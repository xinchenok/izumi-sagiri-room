import { expect, test } from "@playwright/test";
import { assertNoOverflow, goPlace, openPanel, openRoom, seedState, stateOf } from "../support/v20-helpers.js";

const zoomOf = page => page.locator("#inspectPlane").evaluate(plane => Number(plane.dataset.zoom));

test("观察器支持键盘缩放、鼠标拖动、边界、复位和Esc焦点恢复", async ({ page }) => {
  await openRoom(page);
  const trigger = page.locator("#openRoomViewer");
  await trigger.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await trigger.press("Enter");
  await expect(page.locator("#inspectDialog")).toBeVisible();
  const viewport = page.locator("#inspectViewport");
  await viewport.focus();
  for (let index = 0; index < 12; index += 1) await page.keyboard.press("+");
  await expect.poll(() => zoomOf(page)).toBe(2);
  const bounds = await viewport.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 3, bounds.y + bounds.height * 3, { steps: 5 });
  await page.mouse.up();
  const coverage = await page.evaluate(() => {
    const viewportRect = document.querySelector("#inspectViewport").getBoundingClientRect();
    const planeRect = document.querySelector("#inspectPlane").getBoundingClientRect();
    return { left: planeRect.left - viewportRect.left, right: viewportRect.right - planeRect.right,
      top: planeRect.top - viewportRect.top, bottom: viewportRect.bottom - planeRect.bottom };
  });
  expect(coverage.left).toBeLessThanOrEqual(2);
  expect(coverage.right).toBeLessThanOrEqual(2);
  expect(coverage.top).toBeLessThanOrEqual(2);
  expect(coverage.bottom).toBeLessThanOrEqual(2);
  await viewport.focus();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Home");
  await expect.poll(() => zoomOf(page)).toBe(1);
  await page.mouse.dblclick(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect.poll(() => zoomOf(page)).toBe(2);
  await page.locator("#inspectReset").click();
  await expect.poll(() => zoomOf(page)).toBe(1);
  await page.keyboard.press("Escape");
  await expect(page.locator("#inspectDialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(Math.abs(await page.evaluate(() => window.scrollY) - scrollBefore)).toBeLessThanOrEqual(2);
});

test("桌面只有主动观察后加载4K，画廊也复用同一个观察器", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const masters = [];
  page.on("request", request => { if (/-4k\.webp|\/master\//u.test(request.url())) masters.push(request.url()); });
  await openRoom(page);
  expect(masters).toEqual([]);
  await page.locator("#openRoomViewer").click();
  await page.locator("#inspectViewport").focus();
  for (let index = 0; index < 10; index += 1) await page.keyboard.press("+");
  await expect.poll(() => masters.length).toBeGreaterThan(0);
  await page.locator("#inspectClose").click();
  await openPanel(page, "gallery");
  await page.locator("#openGalleryViewer").click();
  await expect(page.locator("#inspectDialog")).toHaveCount(1);
  await expect(page.locator("#inspectDialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#openGalleryViewer")).toBeFocused();
});

test("手机普通触控保留滚动，观察时双指放大最多2倍且资源不超过1440档", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const requests = [];
  page.on("request", request => { if (/\.(webp|png)(?:\?|$)/u.test(request.url())) requests.push(request.url()); });
  try {
    await openRoom(page);
    expect(await page.locator("#roomStage").evaluate(stage => getComputedStyle(stage).touchAction)).not.toBe("none");
    await page.locator("#openRoomViewer").tap();
    await expect(page.locator("#inspectViewport")).toHaveCSS("touch-action", "none");
    const box = await page.locator("#inspectViewport").boundingBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: cx - 20, y: cy, id: 1 }, { x: cx + 20, y: cy, id: 2 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: cx - 100, y: cy, id: 1 }, { x: cx + 100, y: cy, id: 2 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => zoomOf(page)).toBe(2);
    await expect.poll(() => requests.some(url => /-1440\.webp/u.test(url))).toBe(true);
    expect(requests.filter(url => /-4k\.|\/master\//u.test(url))).toEqual([]);
    await page.locator("#inspectClose").tap();
    await assertNoOverflow(page);
  } finally { await context.close(); }
});

test("静一静会持久化，但仍允许主动换地点与换装", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openRoom(page, { reducedMotion: false });
  await page.locator("#motionButton").click();
  await expect(page.locator("#motionButton")).toHaveAttribute("aria-pressed", "true");
  expect((await stateOf(page)).motionMode).toBe("quiet");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#motionButton")).toHaveAttribute("aria-pressed", "true");
  await goPlace(page, "wardrobe");
  await page.locator('#outfitOptions [data-outfit="artist"]').click();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", "artist");
});

test("系统减少动态优先于已保存活泼设置，不自主切换表情", async ({ page }) => {
  await page.clock.install();
  await seedState(page, { outfit: "home", motionMode: "lively" });
  await openRoom(page);
  const stable = await page.locator("#roomStage").getAttribute("data-pose");
  await page.clock.fastForward(25_000);
  await expect(page.locator("#roomStage")).toHaveAttribute("data-pose", stable);
  await expect(page.locator("#motionButton")).toHaveAttribute("aria-pressed", "true");
  expect((await stateOf(page)).motionMode).toBe("lively");
});
