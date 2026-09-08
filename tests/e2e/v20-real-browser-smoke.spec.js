import { expect, test } from "@playwright/test";
import { allowSound, chooseOutfit, expectImage, goPlace, openPanel, openRoom } from "../support/v20-helpers.js";

test("真实音频可解码并推进currentTime，跨场景打断后字幕仍对应最后一句", async ({ playwright }) => {
  const browser = await playwright.chromium.launch({ args: ["--mute-audio"] });
  const context = await browser.newContext({ baseURL: "http://127.0.0.1:4173", viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await openRoom(page, { entry: "none" });
    await allowSound(page, "on");
    await goPlace(page, "desk");
    await expect.poll(() => page.evaluate(() => {
      const audio = window.sagiriRoom.sound.currentVoice;
      return Boolean(audio && audio.readyState >= 2 && Number.isFinite(audio.duration) && audio.duration > 1 && audio.currentTime > .08 && !audio.paused);
    }), { timeout: 10_000 }).toBe(true);
    const first = await page.evaluate(() => {
      window.__v20RealFirstVoice = window.sagiriRoom.sound.currentVoice;
      return { source: window.__v20RealFirstVoice.currentSrc, time: window.__v20RealFirstVoice.currentTime, duration: window.__v20RealFirstVoice.duration };
    });
    expect(first.source).toContain("/voice/desk-arrive.mp3");
    await openPanel(page, "goodnight");
    await page.locator("#goodnightVoice").click();
    await expect.poll(() => page.evaluate(() => {
      const current = window.sagiriRoom.sound.currentVoice;
      return Boolean(current?.currentSrc.includes("/voice/goodnight.mp3") && current.currentTime > .08 && !current.paused);
    })).toBe(true);
    expect(await page.evaluate(() => window.__v20RealFirstVoice.paused)).toBe(true);
    await expect(page.locator("#subtitleJa")).toHaveText("おやすみ。明日も……無理しないでね。");
    await expect(page.locator("#subtitleZh")).toHaveText("晚安。明天也……不要勉强自己哦。");
    await page.locator("#voiceStop").click();
    expect(await page.evaluate(() => window.sagiriRoom.sound.currentVoice)).toBeNull();
    expect(errors).toEqual([]);
  } finally { await browser.close(); }
});

test("直接打开file网页可以进入房间、切换衣服并浏览本地画廊", async ({ playwright }) => {
  const browser = await playwright.chromium.launch({ args: ["--mute-audio"] });
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await page.goto(new URL("../../index.html", import.meta.url).href, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "room");
    await expectImage(page.locator("#roomCharacter"));
    await allowSound(page, "off");
    await goPlace(page, "desk");
    await chooseOutfit(page, "bedtime");
    await openPanel(page, "gallery");
    await expect(page.locator("#galleryStrip [data-gallery-index]")).toHaveCount(11);
    await page.locator("#galleryNext").click();
    await expectImage(page.locator("#galleryImage"));
    expect(new URL(page.url()).protocol).toBe("file:");
    expect(errors).toEqual([]);
  } finally { await browser.close(); }
});
