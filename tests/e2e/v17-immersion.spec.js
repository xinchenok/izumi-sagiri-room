import { expect, test } from "@playwright/test";

const STORAGE_KEY = "sagiri-room-state-v2";

async function openClean(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function goToDrawing(page) {
  await page.locator("#drawing-story").scrollIntoViewIfNeeded();
  await expect(page.locator("#storyTheater")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("未完成画稿、安静陪伴和偷看藏画组成一条可恢复路径", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    window.__v17AudioPlayCount = 0;
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function patchedPlay(...args) {
      window.__v17AudioPlayCount += 1;
      return originalPlay.apply(this, args);
    };
  });
  await openClean(page);
  await goToDrawing(page);

  await page.getByRole("button", { name: "坐到她留出的椅子旁" }).click();
  await expect(page.locator("#storyPrompt")).toHaveText("你想怎么陪她？");

  await page.reload({ waitUntil: "domcontentloaded" });
  await goToDrawing(page);
  await page.getByRole("button", { name: "接着上次没画完的地方" }).click();
  await page.locator('[data-story-choice="quiet"]').click();
  await expect(page.locator("#quietCompanion")).toBeVisible();
  await page.clock.fastForward(45000);
  await expect(page.locator("#quietTime")).toContainText("四十五秒");
  await page.clock.fastForward(30000);
  await expect(page.locator("#quietTime")).toContainText("一分多钟");
  await expect(page.locator("#storyStage")).toHaveAttribute("data-frame", "shy");
  await page.reload({ waitUntil: "domcontentloaded" });
  await goToDrawing(page);
  await page.getByRole("button", { name: "接着安静陪她一会儿" }).click();
  await expect(page.locator("#quietTime")).toContainText("一分多钟");
  await expect(page.locator(".quiet-thread .is-reached")).toHaveCount(3);

  await page.locator("#quietContinue").click();
  await expect(page.locator("#storyPrompt")).toHaveText("这次画什么？");
  await page.locator('[data-story-choice="door"]').click();
  await expect(page.locator("#storyPeek")).toBeVisible();
  await page.locator("#storyPeekButton").click();
  await expect(page.locator("#storyPeek")).toHaveClass(/\bis-relenting\b/u);
  await expect(page.locator("#reactionText")).toContainText("不许突然凑过来");
  expect(await page.evaluate(() => window.__v17AudioPlayCount)).toBe(0);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).drawingDraft.peekCount, STORAGE_KEY)).toBe(1);

  await page.locator('[data-story-choice="mint"]').click();
  await page.locator('[data-story-choice="soft"]').click();
  await expect(page.locator("#storyPrompt")).toHaveText("这张画，完成了。");
  await expect(page.locator("#storyPeek")).toBeHidden();
  await expect(page.locator("#fortuneNote strong")).toContainText("门缝看月亮的小猫");

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.drawingDraft).toBeNull();
  expect(saved.sharedDrawing.subject).toBe("door");
  expect(saved.sharedDrawing.palette).toBe("mint");
  expect(await page.evaluate(() => window.__v17AudioPlayCount)).toBe(0);
  await expect(page.locator("#doorMemorySlip")).toBeVisible();
});

test("房间事件和换装按真实时间更新门口记忆", async ({ page }) => {
  await openClean(page);
  await page.locator("#living-room").scrollIntoViewIfNeeded();
  await page.locator("#livingEventButton").click();
  await expect(page.locator("#fortuneNote strong")).toContainText("等她补完了最后一根线");

  await page.locator("#wardrobe").scrollIntoViewIfNeeded();
  await page.locator('[data-outfit="bedtime"]').click();
  await page.waitForTimeout(30);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#doorMemorySlip")).toContainText("草莓睡前服");
});

test("存储写入失败时当前会话仍能进入安静陪画", async ({ page }) => {
  await openClean(page);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("测试中的存储不可用");
    };
  });
  await goToDrawing(page);
  await page.getByRole("button", { name: "坐到她留出的椅子旁" }).click();
  await page.locator('[data-story-choice="quiet"]').click();
  await expect(page.locator("#quietCompanion")).toBeVisible();
  await expect(page.locator("#storyPrompt")).toContainText("什么都不用说");
});
