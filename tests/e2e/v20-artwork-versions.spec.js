import { expect, test } from "@playwright/test";
import { chooseDrawing, expectImage, finishDrawing, openPanel, openRoom, seedState, stateOf } from "../support/v20-helpers.js";

const oldArt = {
  door: "assets/v18/drawing-door-moon-720.webp",
  blanket: "assets/v18/drawing-blanket-star-720.webp",
  pencil: "assets/v18/drawing-pencil-stars-720.webp"
};

async function expectBoardAndPaper(page, selector, expected) {
  const paper = page.locator(`${selector} img`).first();
  const board = page.locator("#roomStage .board-artwork");
  await expect(paper).toHaveAttribute("src", expected);
  await expect(board).toHaveAttribute("src", expected);
  await expectImage(paper);
  await expectImage(board);
}

test("旧完成稿缺少版本时迁移v18，回访作品和膝上画板仍显示原图片", async ({ page }) => {
  const old = { presence: "help", subject: "door", palette: "mint", praise: "soft", completedAt: 12345 };
  await seedState(page, { outfit: "home", sharedDrawing: old, sharedDrawings: [old] });
  await openRoom(page);
  const saved = await stateOf(page);
  expect(saved.sharedDrawing).toMatchObject({ ...old, artVersion: "v18" });
  expect(saved.sharedDrawings[0].artVersion).toBe("v18");
  await openPanel(page, "memories");
  await expectBoardAndPaper(page, "#roomPanel .shared-art", oldArt.door);
  await page.reload({ waitUntil: "domcontentloaded" });
  expect((await stateOf(page)).sharedDrawing.artVersion).toBe("v18");
});

test("旧未完成稿恢复和完成后继续使用原图，不在续画时偷偷换成v20", async ({ page }) => {
  const draft = { choices: { presence: "help", subject: "blanket", palette: "moon", praise: "" },
    step: 3, mode: "choices", quietElapsedMs: 0, peekCount: 0, updatedAt: 54321 };
  await seedState(page, { outfit: "home", drawingDraft: draft });
  await openRoom(page);
  await openPanel(page, "drawing");
  await page.locator("#drawingResume").click();
  expect((await stateOf(page)).drawingDraft.artVersion).toBe("v18");
  await expectBoardAndPaper(page, "#draftPreview", oldArt.blanket);
  await chooseDrawing(page, "praise", "soft");
  await expectBoardAndPaper(page, "#sharedDrawing", oldArt.blanket);
  const completed = (await stateOf(page)).sharedDrawing;
  expect(completed).toMatchObject({ subject: "blanket", palette: "moon", artVersion: "v18" });
});

for (const subject of ["door", "blanket", "pencil"]) {
  test(`新${subject}主题三种配色各用独立画面，完成稿与膝上板同步`, async ({ page }) => {
    test.setTimeout(60_000);
    await openRoom(page);
    const sources = [];
    for (const palette of ["strawberry", "mint", "moon"]) {
      await finishDrawing(page, { subject, palette });
      const expected = `assets/v20/drawings/${subject}-${palette}-720.webp`;
      await expectBoardAndPaper(page, "#sharedDrawing", expected);
      expect((await stateOf(page)).sharedDrawing).toMatchObject({ subject, palette, artVersion: "v20" });
      sources.push(await page.locator("#sharedDrawing img").getAttribute("src"));
    }
    expect(new Set(sources).size).toBe(3);
    expect((await stateOf(page)).sharedDrawings.filter(item => item.subject === subject && item.artVersion === "v20")).toHaveLength(3);
  });
}

test("新草稿保存v20版本与已选配色，刷新继续时预览和画板仍一致", async ({ page }) => {
  await openRoom(page);
  await openPanel(page, "drawing");
  expect((await stateOf(page)).drawingDraft.artVersion).toBe("v20");
  await chooseDrawing(page, "presence", "help");
  await chooseDrawing(page, "subject", "pencil");
  await chooseDrawing(page, "palette", "mint");
  const expected = "assets/v20/drawings/pencil-mint-720.webp";
  await expectBoardAndPaper(page, "#draftPreview", expected);
  await page.reload({ waitUntil: "domcontentloaded" });
  await openPanel(page, "drawing");
  await page.locator("#drawingResume").click();
  await expectBoardAndPaper(page, "#draftPreview", expected);
  expect((await stateOf(page)).drawingDraft).toMatchObject({ artVersion: "v20", choices: { subject: "pencil", palette: "mint" } });
});
