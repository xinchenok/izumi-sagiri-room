import { expect, test } from "@playwright/test";

async function openHome(page) {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/", { waitUntil: "domcontentloaded" });
}

test("新访客可以轻轻敲门并看到房门打开", async ({ page }) => {
  await openHome(page);

  const doorScene = page.locator("#doorScene");
  const knockButton = page.locator("#knockButton");
  await expect(page.locator("#visitNote")).toHaveText("第一次站在门外");
  await expect(knockButton).toHaveAttribute("aria-expanded", "false");
  await expect(knockButton).toContainText("轻轻敲门");

  await knockButton.click();

  await expect(knockButton).toHaveAttribute("aria-expanded", "true");
  await expect(doorScene).toHaveClass(/\bis-open\b/u);
  await expect(knockButton).toContainText("门已经打开啦");
  await expect(page.locator("#doorStatus")).toContainText("安静地待一会儿");
});

const viewports = [
  { name: "桌面 1440×900", width: 1440, height: 900 },
  { name: "平板 1024×768", width: 1024, height: 768 },
  { name: "手机 390×844", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`${viewport.name} 没有横向溢出`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openHome(page);
    await page.evaluate(() => document.fonts?.ready);

    const dimensions = await page.evaluate(() => ({
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      rootClientWidth: document.documentElement.clientWidth,
      rootScrollWidth: document.documentElement.scrollWidth
    }));

    expect(dimensions.rootScrollWidth).toBeLessThanOrEqual(dimensions.rootClientWidth + 1);
    expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.bodyClientWidth + 1);
  });
}

test("禁用 JavaScript 时仍能阅读基础内容", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("#hero-title")).toContainText("和泉纱雾");
    await expect(page.locator("#heroCharacter")).toBeVisible();
    await expect(page.locator("#cinematicScrollGrid")).toBeHidden();
    await expect(page.locator("#motionModeButton")).toBeHidden();
    await expect(page.locator(".cinematic-noscript figure")).toHaveCount(7);
    await expect(page.locator(".cinematic-noscript details")).toHaveCount(7);
    await page.locator(".cinematic-noscript summary").first().click();
    await expect(page.locator(".cinematic-noscript details").first()).toHaveAttribute("open", "");
    await expect(page.locator(".cinematic-noscript figure").first()).toBeVisible();
    await expect(page.locator(".noscript-note")).toContainText("JavaScript 未启用");
  } finally {
    await context.close();
  }
});

test("减少动态效果时关闭持续动画与雨景细节", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);

  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await expect(page.locator(".living-detail--pen")).toHaveCSS("display", "none");
  await expect(page.locator(".living-rain")).toHaveCSS("display", "none");

  const animationDuration = await page.locator(".studio-lamp-glow").evaluate((element) => {
    const value = getComputedStyle(element).animationDuration;
    return value.endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1000;
  });
  expect(animationDuration).toBeLessThanOrEqual(0.02);
});

test("主要章节加载时没有控制台错误、页面异常或资源 404", async ({ page }) => {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`控制台：${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`页面异常：${error.message}`));
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:4173") && response.status() >= 400) {
      problems.push(`HTTP ${response.status()}：${response.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText || "未知错误";
    if (request.url().startsWith("http://127.0.0.1:4173") && !failure.includes("ERR_ABORTED")) {
      problems.push(`请求失败：${request.url()}（${failure}）`);
    }
  });

  await openHome(page);
  await page.evaluate(async () => {
    for (const section of document.querySelectorAll("main section")) {
      section.scrollIntoView({ block: "center" });
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);

  expect(problems).toEqual([]);
});
