import { expect, test } from "@playwright/test";

test("手机首屏与旧功能只选择响应式图片，不请求 4K 母版", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  const requestedMasters = [];
  page.on("request", (request) => {
    if (request.url().includes("/assets/v18/master/")) requestedMasters.push(request.url());
  });
  try {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("#heroCharacter")).toHaveJSProperty("complete", true);
    expect(await page.locator("#heroCharacter").evaluate((image) => image.currentSrc)).toContain("door-peek-720.webp");

    await page.locator("#wardrobe").scrollIntoViewIfNeeded();
    await expect(page.locator("#outfitImage")).toHaveJSProperty("complete", true);
    expect(await page.locator("#outfitImage").evaluate((image) => image.currentSrc)).toContain("outfit-home-720.webp");

    await page.locator("#gallery").scrollIntoViewIfNeeded();
    await expect(page.locator("#galleryMainImage")).toHaveJSProperty("complete", true);
    expect(await page.locator("#galleryMainImage").evaluate((image) => image.currentSrc)).toContain("gallery-bed-drawing-720.webp");
    expect(requestedMasters).toEqual([]);
  } finally {
    await context.close();
  }
});

test("桌面普通首屏限制在 1440 档，4K 留给主动观察", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  try {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("#heroCharacter")).toHaveJSProperty("complete", true);
    expect(await page.locator("#heroCharacter").evaluate((image) => image.currentSrc)).toContain("door-peek-1440.webp");
  } finally {
    await context.close();
  }
});

test("十一张画廊缩略图都使用 V18 480px 派生图", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  const sources = await page.locator("#galleryThumbs img").evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  expect(sources).toHaveLength(11);
  expect(sources.every((source) => /^assets\/v18\/gallery-.+-480\.webp$/u.test(source))).toBe(true);
});

test("标注场景使用清晰版插画且晚安窗户没有重复装饰", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  try {
    await page.goto("/", { waitUntil: "networkidle" });

    await page.locator("#livingRoomImage").scrollIntoViewIfNeeded();
    await page.locator("#livingRoomImage").evaluate((image) => image.decode());
    expect(await page.locator("#livingRoomImage").evaluate((image) => image.currentSrc)).toContain("studio-focus-clean-720.webp");

    await page.locator("#storyStageImage").scrollIntoViewIfNeeded();
    await page.locator("#storyStageImage").evaluate((image) => image.decode());
    expect(await page.locator("#storyStageImage").evaluate((image) => image.currentSrc)).toContain("studio-focus-clean-720.webp");

    const goodnightImage = page.locator("#goodnight .night-window img");
    await goodnightImage.scrollIntoViewIfNeeded();
    await goodnightImage.evaluate((image) => image.decode());
    expect(await goodnightImage.evaluate((image) => image.currentSrc)).toContain("gallery-goodnight-clean-720.webp");
    await expect(page.locator("#goodnight .moon-dot")).toHaveCount(0);

    const pseudoContent = await page.locator("#goodnight .night-window").evaluate((element) => ({
      before: getComputedStyle(element, "::before").content,
      after: getComputedStyle(element, "::after").content
    }));
    expect(pseudoContent).toEqual({ before: "none", after: "none" });

    await page.locator("#livingRoomStage").evaluate((element) => element.classList.add("is-changing"));
    await page.locator("#storyStage").evaluate((element) => element.classList.add("is-changing"));
    expect(await page.locator("#livingRoomImage").evaluate((image) => getComputedStyle(image).filter)).toBe("none");
    expect(await page.locator("#storyStageImage").evaluate((image) => getComputedStyle(image).filter)).toBe("none");
  } finally {
    await context.close();
  }
});
