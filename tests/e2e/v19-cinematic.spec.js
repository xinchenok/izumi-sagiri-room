import { expect, test } from "@playwright/test";

const STORAGE_KEY = "sagiri-room-state-v2";

const sceneFrames = {
  door: [
    [0, "door-peek"],
    [0.3, "door-listen"],
    [0.6, "door-startled"],
    [0.89, "door-open-smile"]
  ],
  room: [
    [0, "room-drawing"],
    [0.3, "room-stops-pen"],
    [0.6, "room-glances-over"],
    [0.89, "room-invites-seat"]
  ],
  secrets: [
    [0, "secrets-caught"],
    [0.49, "secrets-protects-draft"],
    [0.85, "secrets-opens-drawer"]
  ],
  wardrobe: [
    [0, "wardrobe-hides-sleeves"],
    [0.3, "wardrobe-holds-two"],
    [0.6, "wardrobe-adjusts-bow"],
    [0.89, "wardrobe-chosen-shy"]
  ],
  gallery: [
    [0, "gallery-hides-book"],
    [0.49, "gallery-peeks-over"],
    [0.85, "gallery-pushes-book"]
  ],
  drawing: [
    [0, "drawing-focus"],
    [0.23, "drawing-blink"],
    [0.45, "drawing-covers-page"],
    [0.69, "drawing-shy-pause"],
    [0.89, "drawing-reveal"]
  ],
  goodnight: [
    [0, "goodnight-hug"],
    [0.49, "goodnight-yawn"],
    [0.85, "goodnight-wave"]
  ]
};

async function openClean(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#cinematicStage")).toBeVisible();
}

async function scrollScene(page, scene, progress) {
  await page.evaluate(({ sceneId, amount }) => {
    const beat = document.querySelector(`#cinematic-${sceneId}`);
    const top = beat.getBoundingClientRect().top + window.scrollY;
    const focus = window.innerHeight * (window.innerWidth <= 760 ? 0.68 : 0.52);
    window.scrollTo({ top: top + beat.offsetHeight * amount - focus, behavior: "instant" });
  }, { sceneId: scene, amount: progress });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test("七幕按原生滚动选择 26 个关键帧且纯滚动不请求音频", async ({ page }) => {
  test.setTimeout(90_000);
  const audioRequests = [];
  page.on("request", (request) => {
    if (/\/assets\/audio\//u.test(request.url())) audioRequests.push(request.url());
  });
  await openClean(page);

  for (const [scene, frames] of Object.entries(sceneFrames)) {
    for (const [progress, frame] of frames) {
      await scrollScene(page, scene, progress);
      await expect(page.locator("#cinematicStage")).toHaveAttribute("data-scene", scene);
      await expect(page.locator("#cinematicStage")).toHaveAttribute("data-frame", frame);
    }
  }

  expect(audioRequests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("快速上下滚动只保留最后一幕，不让旧图片覆盖", async ({ page }) => {
  await openClean(page);
  await scrollScene(page, "goodnight", 0.9);
  await scrollScene(page, "room", 0.62);
  await scrollScene(page, "door", 0.9);
  await expect(page.locator("#cinematicStage")).toHaveAttribute("data-scene", "door");
  await expect(page.locator("#cinematicStage")).toHaveAttribute("data-frame", "door-open-smile");
  await page.waitForTimeout(500);
  await expect(page.locator("#cinematicStage")).toHaveAttribute("data-scene", "door");
  await expect(page.locator("#cinematicLayerA")).not.toHaveAttribute("src", /room-|goodnight-/u);
});

test("下一动作帧下载缓慢时，当前帧仍立即显示", async ({ page }) => {
  let releaseNeighbor;
  const blocked = new Promise((resolve) => { releaseNeighbor = resolve; });
  await page.route("**/assets/v19/room-stops-pen-1440.webp", async (route) => {
    await blocked;
    await route.continue();
  });
  try {
    await openClean(page);
    await scrollScene(page, "room", 0.1);
    await expect(page.locator("#cinematicLayerA")).toHaveAttribute("src", /room-drawing-1440\.webp$/u);
    await expect(page.locator("#cinematicLayerA")).toHaveJSProperty("complete", true);
    await expect(page.locator("#cinematicLayerA")).toHaveCSS("opacity", "1");
  } finally {
    releaseNeighbor();
  }
});

test("离开再返回未加载完的配对，邻帧完成后仍能接上", async ({ page }) => {
  let releaseNeighbor;
  let releaseOther;
  const neighbor = new Promise((resolve) => { releaseNeighbor = resolve; });
  const other = new Promise((resolve) => { releaseOther = resolve; });
  await page.route("**/assets/v19/room-stops-pen-1440.webp", async (route) => { await neighbor; await route.continue(); });
  await page.route("**/assets/v19/secrets-caught-1440.webp", async (route) => { await other; await route.continue(); });
  try {
    await openClean(page);
    await scrollScene(page, "room", 0.1);
    await expect(page.locator("#cinematicLayerA")).toHaveAttribute("src", /room-drawing-1440\.webp$/u);
    await scrollScene(page, "secrets", 0.1);
    await expect(page.locator("#cinematicStage")).toHaveAttribute("data-scene", "secrets");
    await scrollScene(page, "room", 0.25);
    await expect(page.locator("#cinematicStage")).toHaveAttribute("data-scene", "room");
    releaseNeighbor();
    await expect(page.locator("#cinematicLayerB")).toHaveAttribute("src", /room-stops-pen-1440\.webp$/u);
    await expect.poll(() => page.locator("#cinematicLayerB").evaluate((image) => Number(image.style.opacity))).toBeGreaterThan(0.3);
    releaseOther();
    await expect(page.locator("#cinematicLayerA")).toHaveAttribute("src", /room-drawing-1440\.webp$/u);
  } finally {
    releaseNeighbor();
    releaseOther();
  }
});

test("观察模式支持热点、两倍缩放、边界、复位、Esc 与焦点恢复", async ({ page }) => {
  await openClean(page);
  await scrollScene(page, "room", 0.6);
  const scrollBeforeInspect = await page.evaluate(() => window.scrollY);
  const trigger = page.locator("#cinematicInspectButton");
  await trigger.click();
  await expect(page.locator("#cinematicInspectDialog")).toBeVisible();
  await expect(page.locator("#cinematicInspectHotspots button")).toHaveCount(3);
  await expect(page.locator("#cinematicCharacterHotspot")).toBeVisible();
  await expect(page.locator("#cinematicInspectViewport")).toHaveCSS("touch-action", "none");

  const viewport = await page.locator("#cinematicInspectViewport").boundingBox();
  await page.mouse.dblclick(viewport.x + 70, viewport.y + 70);
  await expect(page.locator("#cinematicZoomStatus")).toHaveText("200%");
  await page.locator("#cinematicInspectReset").click();
  await page.mouse.move(viewport.x + 70, viewport.y + 70);
  await page.mouse.wheel(0, -220);
  await expect(page.locator("#cinematicZoomStatus")).not.toHaveText("100%");
  await page.mouse.dblclick(viewport.x + 70, viewport.y + 70);
  await expect(page.locator("#cinematicZoomStatus")).toHaveText("200%");
  await page.mouse.move(viewport.x + 45, viewport.y + viewport.height - 45);
  await page.mouse.down();
  await page.mouse.move(viewport.x + viewport.width + 900, viewport.y + viewport.height + 900);
  await page.mouse.up();
  const pan = await page.locator("#cinematicInspectCanvas").evaluate((canvas) => ({
    x: Number.parseFloat(canvas.style.getPropertyValue("--inspect-x")),
    y: Number.parseFloat(canvas.style.getPropertyValue("--inspect-y")),
    scale: Number.parseFloat(canvas.style.getPropertyValue("--inspect-scale")),
    width: canvas.parentElement.clientWidth,
    height: canvas.parentElement.clientHeight
  }));
  const fittedWidth = Math.min(pan.width, pan.height * 4 / 3);
  const expectedMaxX = Math.max(0, (fittedWidth * pan.scale - pan.width) / 2);
  const expectedMaxY = Math.max(0, (fittedWidth / (4 / 3) * pan.scale - pan.height) / 2);
  expect(pan.x).toBeGreaterThanOrEqual(0);
  expect(pan.y).toBeGreaterThan(0);
  expect(pan.x).toBeCloseTo(expectedMaxX, 0);
  expect(pan.y).toBeCloseTo(expectedMaxY, 0);
  await page.locator("#cinematicInspectReset").click();
  await expect(page.locator("#cinematicZoomStatus")).toHaveText("100%");
  await page.locator("#cinematicInspectViewport").evaluate((target) => {
    const bounds = target.getBoundingClientRect();
    const fire = (type, pointerId, x, y) => target.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerType: "touch",
      pointerId,
      clientX: bounds.left + x,
      clientY: bounds.top + y,
      isPrimary: pointerId === 1,
      buttons: type === "pointerup" ? 0 : 1
    }));
    fire("pointerdown", 1, 120, 180);
    fire("pointerdown", 2, 220, 180);
    fire("pointermove", 2, 310, 180);
    fire("pointerup", 2, 310, 180);
    fire("pointerup", 1, 120, 180);
  });
  await expect(page.locator("#cinematicZoomStatus")).not.toHaveText("100%");
  await page.locator("#cinematicInspectViewport").press("ArrowLeft");
  await page.locator("#cinematicInspectViewport").press("ArrowUp");
  await page.locator("#cinematicInspectViewport").press("Home");
  await expect(page.locator("#cinematicZoomStatus")).toHaveText("100%");
  await page.locator("#cinematicInspectViewport").press("Escape");
  await expect(page.locator("#cinematicInspectDialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(Math.abs(await page.evaluate(() => window.scrollY) - scrollBeforeInspect)).toBeLessThanOrEqual(1);
  await expect(page.locator("#cinematicFrame")).toHaveCSS("touch-action", "pan-y");
});

test("安静模式持久化，系统减少动态具有最高优先级", async ({ page }) => {
  await openClean(page);
  await page.locator("#motionModeButton").click();
  await expect(page.locator("body")).toHaveAttribute("data-motion", "quiet");
  await expect(page.locator("#cinematicLayerA")).toHaveCSS("transform", "none");
  await expect(page.locator("#livingRainCanvas")).toHaveCSS("opacity", "0");
  const objectPosition = await page.locator("#heroCharacter").evaluate((image) => image.style.objectPosition);
  await page.locator("#doorScene").dispatchEvent("pointermove", { clientX: 20, clientY: 20 });
  expect(await page.locator("#heroCharacter").evaluate((image) => image.style.objectPosition)).toBe(objectPosition);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).motionMode, STORAGE_KEY)).toBe("quiet");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#motionModeButton")).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("body")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("#motionModeButton")).toBeDisabled();
});

test("手机 Save-Data 不预取邻帧，观察模式最多升级到 1440 档", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true, effectiveType: "4g" }
    });
  });
  const masters = [];
  const v19Images = [];
  page.on("request", (request) => {
    if (request.url().includes("/assets/v19/master/")) masters.push(request.url());
    if (request.url().includes("/assets/v19/") && request.resourceType() === "image") v19Images.push(request.url());
  });
  try {
    await openClean(page);
    for (const scene of Object.keys(sceneFrames)) await scrollScene(page, scene, 0.1);
    expect(v19Images.some((url) => url.includes("-1440.webp"))).toBe(false);
    expect(v19Images.some((url) => /(?:door-listen|room-stops-pen|secrets-protects-draft|wardrobe-holds-two|gallery-peeks-over|drawing-blink|goodnight-yawn)-720\.webp/u.test(url))).toBe(false);
    await page.locator("#cinematicInspectButton").click();
    await page.locator("#cinematicZoomIn").click();
    await expect(page.locator("#cinematicInspectImage")).toHaveJSProperty("complete", true);
    expect(await page.locator("#cinematicInspectImage").getAttribute("src")).toContain("-1440.webp");
    expect(v19Images.some((url) => url.includes("-1440.webp"))).toBe(true);
    expect(masters).toEqual([]);
  } finally {
    await context.close();
  }
});

test("桌面观察模式按需加载 4K，并将物件拟音与角色语音分开控制", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__v19Played = [];
    HTMLMediaElement.prototype.play = function patchedPlay() {
      window.__v19Played.push(this.dataset.sourceFile || this.getAttribute("src") || "");
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function patchedPause() {};
  });
  try {
    await openClean(page);
    await scrollScene(page, "door", 0.32);
    await page.locator("#cinematicInspectButton").click();
    await expect(page.locator("#cinematicInspectImage")).toHaveAttribute("src", /assets\/v19\/master\/door-peek-4k\.webp/u);
    await page.getByRole("button", { name: "轻敲木门" }).click();
    await expect(page.locator("#subtitleJapanese")).toContainText("ノック");
    await expect(page.locator("#cinematicInspectJapanese")).toBeVisible();
    await expect(page.locator("#cinematicInspectJapanese")).toContainText("ノック");
    await expect(page.locator("#cinematicInspectChinese")).toContainText("好好敲门");
    const played = await page.evaluate(() => window.__v19Played);
    expect(played.some((path) => path.includes("/v19/foley/door-knock-soft.mp3"))).toBe(true);
    expect(played.some((path) => path.includes("/v19/voice/door-knock-wait.mp3"))).toBe(true);
  } finally {
    await context.close();
  }
});
