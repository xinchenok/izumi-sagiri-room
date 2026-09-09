import { expect, test } from "@playwright/test";
import {
  allowSound,
  chooseDrawing,
  chooseOutfit,
  expectImage,
  installMediaProbe,
  mediaEvents,
  openPanel,
  openRoom,
  seedState,
  stateOf,
} from "../support/v20-helpers.js";

const choice = (page, kind, value) =>
  page.locator(`[data-choice-kind="${kind}"][data-choice-value="${value}"]`);
const paper = page => page.locator(".draft-paper");

async function storyContent(page) {
  return page.evaluate(() => CONTENT.drawingStory);
}

async function resumeIfOffered(page) {
  if (await page.locator("#drawingResume").isVisible()) {
    await page.locator("#drawingResume").click();
  }
}

async function watchSubtitle(page) {
  await page.evaluate(() => {
    window.__drawingSubtitleObserver?.disconnect();
    window.__drawingSubtitleChanges = [];
    const subtitle = document.querySelector("#subtitleZh");
    window.__drawingSubtitleObserver = new MutationObserver(() => {
      const text = subtitle.textContent.trim();
      if (text) window.__drawingSubtitleChanges.push(text);
    });
    window.__drawingSubtitleObserver.observe(subtitle, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    window.__v20Media?.clear();
  });
}

async function watchPeek(page) {
  await paper(page).evaluate(node => {
    window.__drawingPeekObserver?.disconnect();
    window.__drawingPeekStates = [];
    window.__drawingPeekObserver = new MutationObserver(records => {
      // 记录旧值与当前值，快速连续变更也不会漏掉中间状态。
      for (const record of records) {
        if (record.oldValue) window.__drawingPeekStates.push(record.oldValue);
      }
      window.__drawingPeekStates.push(node.dataset.peekState);
    });
    window.__drawingPeekObserver.observe(node, {
      attributes: true,
      attributeFilter: ["data-peek-state"],
      attributeOldValue: true,
    });
  });
}

async function expectCurrentQuietBeat(page, beat) {
  await expect(page.locator("#quietBeatTitle")).toHaveText(beat.title);
  await expect(page.locator("#quietStatus")).toContainText(beat.line);
}

async function expectPaintedCover(page) {
  const cover = page.locator("#draftCover");
  await expect(cover).toBeVisible();
  await expect.poll(() => cover.evaluate(node => {
    const host = node.closest(".draft-paper");
    if (!host) return false;
    const rect = node.getBoundingClientRect();
    const paperRect = host.getBoundingClientRect();
    const style = getComputedStyle(node);
    const overlapWidth = Math.min(rect.right, paperRect.right) - Math.max(rect.left, paperRect.left);
    const overlapHeight = Math.min(rect.bottom, paperRect.bottom) - Math.max(rect.top, paperRect.top);
    const hasPaint = style.backgroundImage !== "none" ||
      !["transparent", "rgba(0, 0, 0, 0)"].includes(style.backgroundColor);
    return overlapWidth > 0 && overlapHeight > 0 && Number(style.opacity) > 0 && hasPaint;
  })).toBe(true);
}

test("十二项陪画选择先给出各自原回应，不用泛用配音覆盖，记录默认收起", async ({ page }) => {
  test.setTimeout(60_000);
  await installMediaProbe(page);
  await openRoom(page, { entry: "none" });
  await allowSound(page, "on");
  await openPanel(page, "drawing");
  const content = await storyContent(page);
  const groups = { presence: "presence", subject: "subjects", palette: "palettes", praise: "praises" };
  const journeys = [
    { presence: "quiet", subject: "door", palette: "strawberry", praise: "soft" },
    { presence: "help", subject: "blanket", palette: "mint", praise: "eyes" },
    { presence: "distance", subject: "pencil", palette: "moon", praise: "lamp" },
  ];
  for (const [index, journey] of journeys.entries()) {
    if (index > 0) await page.locator("#drawingRestart").click();
    for (const [kind, value] of Object.entries(journey)) {
      const expectedLine = content[groups[kind]][value].line;
      await expect(choice(page, kind, value)).toBeVisible();
      await watchSubtitle(page);
      await chooseDrawing(page, kind, value);
      await expect.poll(() => page.evaluate(() => window.__drawingSubtitleChanges[0])).toBe(expectedLine);
      await expect(page.locator("#subtitleZh")).toHaveText(expectedLine);
      const responses = page.locator("details#drawingResponseLog");
      await expect(responses).toHaveCount(1);
      await expect(responses).not.toHaveAttribute("open", "");
      await expect(responses).not.toHaveAttribute("aria-live", /polite|assertive/u);
      await expect(responses).toContainText(expectedLine);
      const mismatchedVoices = (await mediaEvents(page)).filter(event =>
        event.type === "play" && event.channel === "voice" &&
        /\/(?:draw-invite|theme-cat|palette-chosen)\.mp3$/u.test(event.file));
      expect(mismatchedVoices).toEqual([]);
      if (kind === "presence" && value === "quiet") await page.locator("#quietContinue").click();
    }
    await expect(page.locator("#sharedDrawing")).toBeVisible();
  }
});

test("陪画四步有动作叙述、题材缩略图和配色色签，回退标出真实已选项", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "drawing");
  const notes = [await page.locator("#drawingStageNote").textContent()];
  await chooseDrawing(page, "presence", "distance");
  await expect(page.locator('[data-choice-kind="subject"] img')).toHaveCount(3);
  for (const image of await page.locator('[data-choice-kind="subject"] img').all()) await expectImage(image);
  notes.push(await page.locator("#drawingStageNote").textContent());
  await chooseDrawing(page, "subject", "blanket");
  await expect(page.locator('[data-choice-kind="palette"] .swatch')).toHaveCount(3);
  for (const swatch of await page.locator('[data-choice-kind="palette"] .swatch').all()) await expect(swatch).toBeVisible();
  notes.push(await page.locator("#drawingStageNote").textContent());
  await chooseDrawing(page, "palette", "moon");
  notes.push(await page.locator("#drawingStageNote").textContent());
  expect(notes.every(note => Boolean(note?.trim()))).toBe(true);
  expect(new Set(notes).size).toBe(4);
  for (const [kind, value] of [["palette", "moon"], ["subject", "blanket"], ["presence", "distance"]]) {
    await page.locator('[data-action="drawing-back"]').click();
    await expect(choice(page, kind, value)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(`[data-choice-kind="${kind}"][aria-pressed="true"]`)).toHaveCount(1);
  }
  expect((await stateOf(page)).drawingDraft.choices).toMatchObject({ presence: "distance", subject: "blanket", palette: "moon" });
});

test("偷看有独立盖纸层，按露稿、被盖住、只留一角的次序回应", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openRoom(page, { reducedMotion: false });
  await openPanel(page, "drawing");
  await chooseDrawing(page, "presence", "help");
  await chooseDrawing(page, "subject", "door");
  await expect(paper(page)).toHaveAttribute("data-peek-state", "covered");
  await expectPaintedCover(page);
  await watchPeek(page);
  await page.locator("#peekDraft").click();
  await expect(paper(page)).toHaveAttribute("data-peek-state", "corner");
  const states = await page.evaluate(() => window.__drawingPeekStates);
  const reveal = states.indexOf("reveal");
  const caught = states.indexOf("caught", reveal + 1);
  const corner = states.indexOf("corner", caught + 1);
  expect(reveal).toBeGreaterThanOrEqual(0);
  expect(caught).toBeGreaterThan(reveal);
  expect(corner).toBeGreaterThan(caught);
  await expectPaintedCover(page);
  await expect(page.locator("#peekDraft")).toBeEnabled();
  expect((await stateOf(page)).drawingDraft.peekCount).toBe(1);
});

test("减少动态时偷看直接保留一角，仍记录连续三次不同回应", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "drawing");
  await chooseDrawing(page, "presence", "help");
  await chooseDrawing(page, "subject", "pencil");
  const content = await storyContent(page);
  const seen = [];
  for (let index = 0; index < 3; index += 1) {
    await watchPeek(page);
    await page.locator("#peekDraft").click();
    await expect(paper(page)).toHaveAttribute("data-peek-state", "corner");
    await expectPaintedCover(page);
    await expect(page.locator("#peekDraft")).toBeEnabled();
    const states = await page.evaluate(() => window.__drawingPeekStates);
    expect(states).not.toContain("reveal");
    expect(states).not.toContain("caught");
    await expect(page.locator("#subtitleZh")).toHaveText(content.peekReactions[index].text);
    seen.push(await page.locator("#subtitleZh").textContent());
  }
  expect(new Set(seen).size).toBe(3);
  expect((await stateOf(page)).drawingDraft.peekCount).toBe(3);
});

test("已保存的一分多钟陪伴立即恢复阶段内容，并可直接返回陪伴选择", async ({ page }) => {
  await seedState(page, {
    drawingDraft: {
      choices: { presence: "quiet" }, step: 1, mode: "quiet",
      quietElapsedMs: 75_000, peekCount: 0, updatedAt: 123,
    },
  });
  await openRoom(page);
  await openPanel(page, "drawing");
  await resumeIfOffered(page);
  const beat = (await storyContent(page)).quietBeats.at(-1);
  await expectCurrentQuietBeat(page, beat);
  await expect(page.locator("#quietStatus")).toHaveAttribute("data-elapsed", "75000");
  await expect(page.locator("#quietContinue")).toBeEnabled();
  await page.locator("#quietBack").click();
  await expect(choice(page, "presence", "quiet")).toBeVisible();
  expect((await stateOf(page)).drawingDraft).toMatchObject({ step: 0, mode: "choices" });
});

test("离开画画面板或隐藏页面暂停陪伴，回开立即恢复当前节拍而非通用文案", async ({ page }) => {
  test.setTimeout(60_000);
  await page.clock.install();
  await seedState(page, {
    drawingDraft: {
      choices: { presence: "quiet" }, step: 1, mode: "quiet",
      quietElapsedMs: 45_000, peekCount: 0, updatedAt: 123,
    },
  });
  await openRoom(page);
  await openPanel(page, "drawing");
  await resumeIfOffered(page);
  const beat = (await storyContent(page)).quietBeats[1];
  await expectCurrentQuietBeat(page, beat);
  await page.locator("#panelClose").click();
  const closedAt = (await stateOf(page)).drawingDraft.quietElapsedMs;
  await page.clock.runFor(8_000);
  expect((await stateOf(page)).drawingDraft.quietElapsedMs).toBe(closedAt);
  await openPanel(page, "drawing");
  await resumeIfOffered(page);
  await expectCurrentQuietBeat(page, beat);
  await page.clock.runFor(2_000);
  const visibleAt = (await stateOf(page)).drawingDraft.quietElapsedMs;
  expect(visibleAt).toBeGreaterThan(closedAt);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenAt = (await stateOf(page)).drawingDraft.quietElapsedMs;
  await page.clock.runFor(8_000);
  expect((await stateOf(page)).drawingDraft.quietElapsedMs).toBe(hiddenAt);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expectCurrentQuietBeat(page, beat);
  await page.clock.runFor(2_000);
  expect((await stateOf(page)).drawingDraft.quietElapsedMs).toBeGreaterThan(hiddenAt);
});

test("旧草稿恢复专属动作并延续偷看次数，刷新不换掉原画或已选配色", async ({ page }) => {
  await seedState(page, {
    outfit: "artist",
    drawingDraft: {
      choices: { presence: "help", subject: "blanket" }, step: 2, mode: "choices",
      quietElapsedMs: 0, peekCount: 1, updatedAt: 123,
    },
  });
  await openRoom(page);
  await openPanel(page, "drawing");
  await resumeIfOffered(page);
  await expect(page.locator("#drawingStageNote")).not.toHaveText("");
  await expect(page.locator("#draftPreview img").first()).toHaveAttribute("src", "assets/v18/drawing-blanket-star-720.webp");
  await chooseDrawing(page, "palette", "mint");
  await page.locator("#peekDraft").click();
  await expect(paper(page)).toHaveAttribute("data-peek-state", "corner");
  const before = (await stateOf(page)).drawingDraft;
  expect(before).toMatchObject({ artVersion: "v18", step: 3, peekCount: 2, choices: { subject: "blanket", palette: "mint" } });
  await page.reload({ waitUntil: "domcontentloaded" });
  await openPanel(page, "drawing");
  await resumeIfOffered(page);
  await expect(choice(page, "praise", "soft")).toBeVisible();
  await expect(page.locator("#draftPreview img").first()).toHaveAttribute("src", "assets/v18/drawing-blanket-star-720.webp");
  expect((await stateOf(page)).drawingDraft).toMatchObject({ artVersion: "v18", step: 3, peekCount: 2, choices: before.choices });
  await page.locator('[data-action="drawing-back"]').click();
  await expect(choice(page, "palette", "mint")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "artist");
});

test("完成稿有递出状态，记忆复述四项真实选择，整段陪画保持当前衣服", async ({ page }) => {
  await openRoom(page);
  await chooseOutfit(page, "hooded");
  await openPanel(page, "drawing");
  const content = await storyContent(page);
  const selected = { presence: "distance", subject: "pencil", palette: "moon", praise: "lamp" };
  for (const [kind, value] of Object.entries(selected)) {
    await chooseDrawing(page, kind, value);
    await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "hooded");
  }
  await expect(page.locator("#sharedDrawing")).toHaveClass(/\bis-revealed\b/u);
  await expectImage(page.locator("#sharedDrawing img").first());
  await expect(page.locator("#roomCharacter")).toHaveAttribute("src", /\/character\/hooded\//u);
  const saved = await stateOf(page);
  expect(saved.sharedDrawing).toMatchObject({ ...selected, artVersion: "v20" });
  expect(saved.drawingDraft).toBeNull();
  await page.locator("#panelClose").click();
  await openPanel(page, "memories");
  const memory = page.locator("#drawingMemoryText, .drawing-memory-text")
    .filter({ hasText: content.subjects.pencil.label }).first();
  await expect(memory).toBeVisible();
  for (const detail of [content.presence.distance.memory, content.subjects.pencil.label,
    content.palettes.moon.label, content.praises.lamp.memory]) {
    await expect(memory).toContainText(detail);
  }
  await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "hooded");
});
