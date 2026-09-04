import { expect, test } from "@playwright/test";

test("手机只选择响应式图片，不请求 4K 母版", async ({ browser }) => {
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
    expect(await page.locator("#heroCharacter").evaluate((image) => image.currentSrc)).toContain("hero-peek-720.webp");

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

test("高密度桌面可以取得 4K 首屏母版", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  try {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("#heroCharacter")).toHaveJSProperty("complete", true);
    expect(await page.locator("#heroCharacter").evaluate((image) => image.currentSrc)).toContain("hero-peek-4k.webp");
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
