import { expect, test } from "@playwright/test";
import { OUTFITS, PLACES, POSES, assertNoOverflow, chooseOutfit, collectProblems, expectImage, goPlace, openPanel, openRoom, seedState, stateOf } from "../support/v20-helpers.js";

for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
  test(`${viewport.width}×${viewport.height} 房间与各功能面板可达且没有横向溢出`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openRoom(page);
    await expect(page.locator("#roomCharacter")).toBeInViewport();
    await expect(page.locator("#subtitleZh")).toBeVisible();
    await assertNoOverflow(page);
    for (const panel of ["wardrobe", "gallery", "drawing", "goodnight", "secrets"]) {
      await openPanel(page, panel);
      await assertNoOverflow(page);
    }
  });
}

for (const outfit of OUTFITS) {
  test(`${outfit} 衣服贯穿五地点以及画册和晚安，不暗换回默认装`, async ({ page }) => {
    test.setTimeout(60_000);
    await openRoom(page);
    await chooseOutfit(page, outfit);
    for (const place of PLACES) {
      await goPlace(page, place);
      await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", outfit);
      await expect(page.locator("#roomStage")).toHaveAttribute("data-pose", POSES[place]);
      await expect(page.locator("#roomCharacter")).toHaveAttribute("src", new RegExp(`/character/${outfit}/`, "u"));
    }
    await openPanel(page, "gallery");
    await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", outfit);
    await expect(page.locator("#roomCharacter")).toHaveAttribute("src", new RegExp(`/character/${outfit}/reading-peek-`, "u"));
    await openPanel(page, "goodnight");
    await expect(page.locator("#roomCharacter")).toHaveAttribute("src", new RegExp(`/character/${outfit}/bed-`, "u"));
    expect((await stateOf(page)).outfit).toBe(outfit);
  });
}

test("原生滚动不换地点、不请求或播放音频", async ({ page }) => {
  const requestedAudio = [];
  page.on("request", request => { if (/\/assets\/audio\//u.test(request.url())) requestedAudio.push(request.url()); });
  await openRoom(page, { entry: "none" });
  for (const delta of [500, 800, -600, -1000]) await page.mouse.wheel(0, delta);
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "room");
  expect(requestedAudio).toEqual([]);
});

test("旧地址入口准确映射到新地点与功能，首次深链不播放音频", async ({ page }) => {
  const audio = [];
  page.on("request", request => { if (/\/assets\/audio\//u.test(request.url())) audio.push(request.url()); });
  const targets = [
    ["#living-room", "room", null], ["#home", "room", null], ["#room", "room", null],
    ["#wardrobe", "wardrobe", "wardrobe"], ["#gallery", "desk", "gallery"],
    ["#drawing-story", "desk", "drawing"], ["#goodnight", "bed", "goodnight"]
  ];
  for (const [hash, place, panel] of targets) {
    await openRoom(page, { hash });
    await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", place);
    if (panel) await expect(page.locator("#roomPanel")).toHaveAttribute("data-panel", panel);
    expect(new URL(page.url()).hash).toBe(hash);
  }
  expect(audio).toEqual([]);
});

test("地点导航支持浏览器后退、前进与刷新恢复", async ({ page }) => {
  await openRoom(page);
  await goPlace(page, "desk");
  await goPlace(page, "window");
  await page.goBack();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "desk");
  await page.goForward();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "window");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "window");
});

test("慢图片期间快速切地点与服装只提交最后一次选择", async ({ page }) => {
  let release;
  const blocked = new Promise(resolve => { release = resolve; });
  await page.route(/\/character\/artist\/.*\.webp$/u, async route => { await blocked; await route.continue(); });
  try {
    await openRoom(page);
    await openPanel(page, "wardrobe");
    await page.locator('#outfitOptions [data-outfit="artist"]').click();
    await page.locator('#outfitOptions [data-outfit="bedtime"]').click();
    await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "bedtime");
    await goPlace(page, "desk");
    await goPlace(page, "bed");
    release();
    await expect(page.locator("#roomCharacter")).toHaveAttribute("src", /\/bedtime\/bed-/u);
    await expectImage(page.locator("#roomCharacter"));
    await page.waitForTimeout(250);
    expect((await stateOf(page)).outfit).toBe("bedtime");
    expect((await stateOf(page)).lastOutfitMemory.outfit).toBe("bedtime");
    await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "bed");
  } finally { release(); }
});

test("换装图片缺失时保留当前人物与真实记忆，恢复资源后可重试", async ({ page }) => {
  let broken = true;
  await seedState(page, { outfit: "home", motionMode: "quiet", lastOutfitMemory: { outfit: "home", rememberedAt: 100 } });
  await page.route(/\/character\/outing\/.*\.webp$/u, async route => {
    if (broken) await route.fulfill({ status: 404, contentType: "text/plain", body: "测试图片暂不可用" });
    else await route.continue();
  });
  await openRoom(page);
  await openPanel(page, "wardrobe");
  const previous = await page.locator("#roomCharacter").getAttribute("src");
  await page.locator('#outfitOptions [data-outfit="outing"]').click();
  await expect(page.locator("#assetRetry")).toBeVisible();
  await expect(page.locator("#roomCharacter")).toHaveAttribute("src", previous);
  expect((await stateOf(page)).outfit).toBe("home");
  expect((await stateOf(page)).lastOutfitMemory).toEqual({ outfit: "home", rememberedAt: 100 });
  broken = false;
  await page.locator("#assetRetry").click();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "outing");
  await expectImage(page.locator("#roomCharacter"));
});

test("手机普通浏览始终使用小图，不因高 DPR 请求4K", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const large = [];
  page.on("request", request => { if (/\/(?:master\/)|-4k\.(webp|png)/u.test(request.url())) large.push(request.url()); });
  try {
    await openRoom(page);
    for (const place of PLACES) await goPlace(page, place);
    await openPanel(page, "gallery");
    await page.locator("#galleryNext").click();
    await chooseOutfit(page, "hooded");
    expect(large).toEqual([]);
    await expect(page.locator("#roomCharacter")).toHaveAttribute("src", /-720\.webp/u);
  } finally { await context.close(); }
});

test("节省流量模式不预取未选择服装或未进入地点的人物帧", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true, effectiveType: "2g" } });
  });
  const images = [];
  page.on("request", request => {
    if (/\/assets\/v20\/character\//u.test(request.url()) && request.resourceType() === "image") images.push(request.url());
  });
  await openRoom(page);
  expect(images.length).toBeGreaterThan(0);
  expect(images.every(url => /\/home\/standing-neutral-/u.test(url))).toBe(true);
  await goPlace(page, "desk");
  // 主动走到桌边后的对应表情是当前互动，不把它误判为未进入场景的预取。
  expect(images.every(url => /\/home\/(standing-neutral|desk-[a-z]+)-/u.test(url))).toBe(true);
});

test("五地点和所有功能没有控制台异常或资源404", async ({ page }) => {
  test.setTimeout(60_000);
  const problems = collectProblems(page);
  await openRoom(page);
  for (const place of PLACES) await goPlace(page, place);
  for (const panel of ["gallery", "drawing", "secrets", "goodnight"]) await openPanel(page, panel);
  expect(problems).toEqual([]);
});

test("键盘能到达主导航与功能，按钮有中文名称和可见焦点", async ({ page }) => {
  await openRoom(page);
  const desk = page.locator('nav.place-navigation [data-place="desk"]');
  await desk.focus();
  await desk.press("Enter");
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "desk");
  for (const panel of ["wardrobe", "gallery", "drawing", "goodnight", "secrets"]) {
    await openPanel(page, panel);
    const buttons = page.locator("button:visible");
    for (let index = 0; index < await buttons.count(); index += 1) {
      await expect(buttons.nth(index)).toHaveAccessibleName(/[\u3400-\u9fff]/u);
    }
  }
  const focusTarget = page.locator("#settingsButton");
  await focusTarget.focus();
  await page.keyboard.press("Tab");
  const focusStyle = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return { width: parseFloat(style.outlineWidth), outline: style.outlineStyle, shadow: style.boxShadow };
  });
  expect((focusStyle.width > 0 && focusStyle.outline !== "none") || focusStyle.shadow !== "none").toBe(true);
});

test("禁用JavaScript仍能看到基础人物、介绍和原生展开内容", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /纱雾/u }).first()).toBeVisible();
    await expectImage(page.locator("#roomCharacter"));
    // Playwright的body文本聚合会略过noscript；直接验证已渲染的降级容器。
    await expect(page.locator("#readableContent")).toBeVisible();
    await expect(page.locator("#readableContent")).toContainText("JavaScript 未启用");
    await expect(page.locator("#readableContent figure")).toHaveCount(20);
    await expect(page.locator(".place-navigation")).toBeHidden();
    await expect(page.locator(".room-tools")).toBeHidden();
    const details = page.locator("details").filter({ has: page.locator("summary") }).first();
    await expect(details).toBeVisible();
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
    await assertNoOverflow(page);
  } finally { await context.close(); }
});
