import { expect, test } from "@playwright/test";
import { LEGACY_KEY, STORAGE_KEY, chooseDrawing, chooseOutfit, finishDrawing, goPlace, openPanel, openRoom, seedState, stateOf } from "../support/v20-helpers.js";

test("v1换装和已发现秘密迁移到v2，补齐房间与声音默认值", async ({ page }) => {
  await seedState(page, { outfit: "artist", secrets: ["tablet", "plush"] }, LEGACY_KEY);
  await openRoom(page);
  await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "artist");
  const saved = await stateOf(page);
  expect(saved.outfit).toBe("artist");
  expect(saved.secrets).toEqual(expect.arrayContaining(["tablet", "plush"]));
  expect(saved.roomScene).toBe("room");
  expect(saved.motionMode).toBe("lively");
  expect(typeof saved.ambientMuted).toBe("boolean");
  expect(Number.isFinite(saved.ambienceVolume)).toBe(true);
});

test("v2旧作品、纸条、音量、回访和未知扩展字段不会在升级时丢失", async ({ page }) => {
  const sharedDrawing = { presence: "help", subject: "door", palette: "mint", praise: "soft", completedAt: 123456789 };
  const extra = { nested: ["保留用户数据", { value: 42 }] };
  await seedState(page, {
    outfit: "bedtime", secrets: ["headphones"], visitCount: 8, lastVisitAt: 123,
    voiceVolume: 0.42, voiceMuted: true, sharedDrawing, keptFortune: "这张旧纸条要好好保留。",
    keptFortuneAt: 222, lastOutfitMemory: { outfit: "bedtime", rememberedAt: 300 },
    roomSoundMuted: true, livingWeather: "rain", galleryIndex: 4, motionMode: "quiet", customFutureField: extra
  });
  await openRoom(page);
  let saved = await stateOf(page);
  expect(saved.sharedDrawing).toMatchObject(sharedDrawing);
  expect(saved.keptFortune).toBe("这张旧纸条要好好保留。");
  expect(saved.voiceVolume).toBe(0.42);
  expect(saved.voiceMuted).toBe(true);
  expect(saved.visitCount).toBeGreaterThanOrEqual(9);
  expect(saved.galleryIndex).toBe(4);
  expect(saved.customFutureField).toEqual(extra);
  await goPlace(page, "window");
  saved = await stateOf(page);
  expect(saved.customFutureField).toEqual(extra);
  expect(saved.sharedDrawing).toMatchObject(sharedDrawing);
});

test("损坏存储退回可用会话，后续操作恢复正常保存", async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, "{无法解析"), STORAGE_KEY);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await openRoom(page);
  await chooseOutfit(page, "hooded");
  expect((await stateOf(page)).outfit).toBe("hooded");
  expect(errors).toEqual([]);
});

test("存储读写均拒绝时换装、秘密和陪画在当前会话仍可完成", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("测试存储读取不可用"); };
    Storage.prototype.setItem = () => { throw new Error("测试存储写入不可用"); };
  });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await openRoom(page);
  await chooseOutfit(page, "outing");
  await openPanel(page, "secrets");
  await page.locator('#secretObjects [data-secret="tablet"]').click();
  await expect(page.locator('#secretObjects [data-secret="tablet"]')).toHaveAttribute("aria-pressed", "true");
  await finishDrawing(page);
  await expect(page.locator("#sharedDrawing")).toBeVisible();
  expect(errors).toEqual([]);
});

test("安静陪伴可以立即继续，不把等待时长变成剧情门槛", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "drawing");
  await chooseDrawing(page, "presence", "quiet");
  await expect(page.locator("#quietStatus")).toBeVisible();
  await expect(page.locator("#quietContinue")).toBeEnabled();
  await page.locator("#quietContinue").click();
  await expect(page.locator('[data-choice-kind="subject"]').first()).toBeVisible();
});

test("未完成画稿保存安静陪伴时长，刷新后从原步骤继续", async ({ page }) => {
  test.setTimeout(60_000);
  await page.clock.install();
  await openRoom(page);
  await openPanel(page, "drawing");
  await chooseDrawing(page, "presence", "quiet");
  // 连续推进各个tick，不使用fastForward模拟休眠；多留1秒覆盖计时器相位差。
  await page.clock.runFor(46_000);
  const first = (await stateOf(page)).drawingDraft;
  expect(first.choices.presence).toBe("quiet");
  expect(first.quietElapsedMs).toBeGreaterThanOrEqual(45_000);
  await page.reload({ waitUntil: "domcontentloaded" });
  await openPanel(page, "drawing");
  await page.locator("#drawingResume").click();
  await expect(page.locator("#quietStatus")).toBeVisible();
  expect((await stateOf(page)).drawingDraft.quietElapsedMs).toBeGreaterThanOrEqual(first.quietElapsedMs);
  await page.locator("#quietContinue").click();
  await chooseDrawing(page, "subject", "blanket");
  await page.locator("#peekDraft").click();
  expect((await stateOf(page)).drawingDraft.peekCount).toBeGreaterThanOrEqual(1);
});

test("四项真实选择完成共同画稿并保存到回访作品历史", async ({ page }) => {
  await openRoom(page);
  await finishDrawing(page, { presence: "help", subject: "door", palette: "mint", praise: "eyes" });
  const completed = await stateOf(page);
  expect(completed.drawingDraft).toBeNull();
  expect(completed.sharedDrawing).toMatchObject({ presence: "help", subject: "door", palette: "mint", praise: "eyes" });
  expect(completed.sharedDrawings).toContainEqual(expect.objectContaining({ subject: "door", palette: "mint", praise: "eyes" }));
  await page.reload({ waitUntil: "domcontentloaded" });
  expect((await stateOf(page)).sharedDrawing).toMatchObject(completed.sharedDrawing);
  await openPanel(page, "goodnight");
  await expect(page.locator("#fortuneText")).not.toHaveText("");
});

test("不同主题与配色真正改变作品，重新开稿不删除上次成稿", async ({ page }) => {
  await openRoom(page);
  await finishDrawing(page, { subject: "door", palette: "strawberry", praise: "soft" });
  const first = (await stateOf(page)).sharedDrawing;
  const firstArt = await page.locator("#sharedDrawing").innerHTML();
  await finishDrawing(page, { presence: "distance", subject: "pencil", palette: "moon", praise: "lamp" });
  const saved = await stateOf(page);
  expect(saved.sharedDrawing).toMatchObject({ subject: "pencil", palette: "moon", presence: "distance", praise: "lamp" });
  expect(saved.sharedDrawings.length).toBeGreaterThanOrEqual(2);
  expect(saved.sharedDrawings).toContainEqual(expect.objectContaining(first));
  expect(await page.locator("#sharedDrawing").innerHTML()).not.toBe(firstArt);
});

test("重新开始只重置未完成稿，保留已完成作品和已发现秘密", async ({ page }) => {
  await openRoom(page);
  await finishDrawing(page);
  const complete = (await stateOf(page)).sharedDrawing;
  await openPanel(page, "secrets");
  await page.locator('#secretObjects [data-secret="plush"]').click();
  await openPanel(page, "drawing");
  if (await page.locator("#drawingRestart").isVisible()) await page.locator("#drawingRestart").click();
  await chooseDrawing(page, "presence", "help");
  await goPlace(page, "room");
  await openPanel(page, "drawing");
  await page.locator("#drawingRestart").click();
  await expect(page.locator('[data-choice-kind="presence"]').first()).toBeVisible();
  const saved = await stateOf(page);
  expect(saved.sharedDrawing).toMatchObject(complete);
  expect(saved.secrets).toContain("plush");
});

test("五个秘密分别发现并持久化，全部发现后才显示隐藏留言", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "secrets");
  await expect(page.locator("#secretMessage")).toBeHidden();
  const secrets = ["tablet", "headphones", "manuscript", "plush", "drawer"];
  for (const [index, id] of secrets.entries()) {
    const target = page.locator(`#secretObjects [data-secret="${id}"]`);
    await target.press(index % 2 ? "Enter" : "Space");
    await expect(target).toHaveAttribute("aria-pressed", "true");
    if (index < 4) await expect(page.locator("#secretMessage")).toBeHidden();
  }
  await expect(page.locator("#secretMessage")).toBeVisible();
  expect(new Set((await stateOf(page)).secrets)).toEqual(new Set(secrets));
  await page.reload({ waitUntil: "domcontentloaded" });
  await openPanel(page, "secrets");
  await expect(page.locator('#secretObjects [aria-pressed="true"]')).toHaveCount(5);
  await expect(page.locator("#secretMessage")).toBeVisible();
});

test("十一张画廊有缩略图、前后导航和选择恢复，作品没有被删减", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "gallery");
  const thumbs = page.locator("#galleryStrip button[data-gallery-index]");
  await expect(thumbs).toHaveCount(11);
  await thumbs.nth(9).click();
  await expect(thumbs.nth(9)).toHaveAttribute("aria-pressed", "true");
  const selected = await page.locator("#galleryImage").getAttribute("src");
  await page.locator("#galleryNext").press("Enter");
  expect((await stateOf(page)).galleryIndex).toBe(10);
  await page.locator("#galleryPrev").press("Space");
  await expect(page.locator("#galleryImage")).toHaveAttribute("src", selected);
  await page.reload({ waitUntil: "domcontentloaded" });
  await openPanel(page, "gallery");
  await expect(page.locator('#galleryStrip [data-gallery-index="9"]')).toHaveAttribute("aria-pressed", "true");
});

test("衣橱日常记录关注点、真实换装和评价，普通换装不受剧情门槛限制", async ({ page }) => {
  await openRoom(page);
  await chooseOutfit(page, "artist");
  await page.locator('[data-action="wardrobe-story"]:visible').first().click();
  await page.locator('[data-choice-kind="wardrobe-priority"][data-choice-value="comfort"]').click();
  await page.locator('#outfitOptions [data-outfit="hooded"]').click();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "hooded");
  await page.locator('[data-choice-kind="wardrobe-comment"][data-choice-value="soft"]').click();
  const episode = (await stateOf(page)).episodeProgress.wardrobe;
  expect(episode.choices).toMatchObject({ priority: "comfort", outfit: "hooded", comment: "soft" });
  expect(episode.completedAt).toBeGreaterThan(0);
  await page.reload({ waitUntil: "domcontentloaded" });
  expect((await stateOf(page)).episodeProgress.wardrobe).toMatchObject(episode);
  await chooseOutfit(page, "bedtime");
  expect((await stateOf(page)).lastOutfitMemory.outfit).toBe("bedtime");
});

test("画册日常保存细节与喜欢的作品，回访不捏造感想", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "gallery");
  await page.locator('#galleryStrip [data-gallery-index="3"]').click();
  await page.locator('[data-action="gallery-story"]').click();
  await page.locator('[data-choice-kind="gallery-detail"][data-choice-value="expression"]').click();
  await page.locator('[data-choice-kind="gallery-thought"][data-choice-value="favorite"]').click();
  const saved = await stateOf(page);
  expect(saved.episodeProgress.gallery.choices).toMatchObject({ detail: "expression", thought: "favorite", index: 3 });
  expect(saved.episodeProgress.gallery.completedAt).toBeGreaterThan(0);
  expect(saved.galleryFavorite).toMatchObject({ index: 3, detail: "expression" });
  expect(saved.galleryFavorite.id).toBeTruthy();
  await page.reload({ waitUntil: "domcontentloaded" });
  expect((await stateOf(page)).galleryFavorite).toEqual(saved.galleryFavorite);
});

test("晚安纸条可以更换、收好与刷新恢复", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "goodnight");
  const seen = new Set([await page.locator("#fortuneText").textContent()]);
  for (let index = 0; index < 4; index += 1) {
    await page.locator("#nextFortune").click();
    seen.add(await page.locator("#fortuneText").textContent());
  }
  expect(seen.size).toBeGreaterThan(1);
  const kept = (await page.locator("#fortuneText").textContent()).trim();
  await page.locator("#keepFortune").click();
  expect((await stateOf(page)).keptFortune).toBe(kept);
  await page.reload({ waitUntil: "domcontentloaded" });
  expect((await stateOf(page)).keptFortune).toBe(kept);
});

test("复制纸条失败不会清空纸条或抛出未处理错误", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new DOMException("测试剪贴板拒绝", "NotAllowedError")) } });
  });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await openRoom(page);
  await openPanel(page, "goodnight");
  const before = await page.locator("#fortuneText").textContent();
  await page.locator("#copyFortune").click();
  await expect(page.locator("#fortuneText")).toHaveText(before);
  await expect(page.locator("#keepFortune")).toBeEnabled();
  expect(errors).toEqual([]);
});
