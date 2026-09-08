import { expect, test } from "@playwright/test";
import { activeMedia, allowSound, goPlace, installMediaProbe, mediaEvents, openPanel, openRoom, seedState, settings, stateOf } from "../support/v20-helpers.js";

const voiceEvents = async page => (await mediaEvents(page)).filter(event => event.type === "play" && event.channel === "voice");

test("首次与刷新都不自动出声，主动有声进入后才触发三路声音", async ({ page }) => {
  await installMediaProbe(page);
  await openRoom(page, { entry: "none" });
  expect(await mediaEvents(page)).toEqual([]);
  await allowSound(page, "on");
  await goPlace(page, "desk");
  await expect.poll(async () => (await voiceEvents(page)).length).toBeGreaterThan(0);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", "desk");
  expect(await mediaEvents(page)).toEqual([]);
});

test("安静进入仍给出准确日中字幕与人物回应，不调用系统朗读", async ({ page }) => {
  await installMediaProbe(page);
  await page.addInitScript(() => {
    window.__systemSpeechCalled = 0;
    if (window.speechSynthesis) window.speechSynthesis.speak = () => { window.__systemSpeechCalled += 1; };
  });
  await openRoom(page, { entry: "none" });
  await allowSound(page, "off");
  await goPlace(page, "desk");
  await expect(page.locator("#subtitleJa")).toHaveText("ここなら、手元が見えるでしょ。静かにしててね。");
  await expect(page.locator("#subtitleZh")).toHaveText("在这里就能看清我手边了吧。要安静一点哦。");
  expect(await voiceEvents(page)).toEqual([]);
  expect(await page.evaluate(() => window.__systemSpeechCalled)).toBe(0);
});

test("新台词打断旧句，延迟返回的播放Promise不能接管最后字幕", async ({ page }) => {
  await installMediaProbe(page, "defer-first");
  await openRoom(page, { entry: "none" });
  await allowSound(page, "on");
  await goPlace(page, "desk");
  await openPanel(page, "goodnight");
  await page.locator("#goodnightVoice").click();
  await expect(page.locator("#subtitleJa")).toHaveText("おやすみ。明日も……無理しないでね。");
  await expect(page.locator("#subtitleZh")).toHaveText("晚安。明天也……不要勉强自己哦。");
  await page.evaluate(() => window.__v20Media.release());
  await page.waitForTimeout(50);
  const activeVoices = (await activeMedia(page)).filter(item => item.channel === "voice");
  expect(activeVoices).toHaveLength(1);
  expect(activeVoices[0].file).toContain("/voice/goodnight.mp3");
  expect((await mediaEvents(page)).some(event => event.type === "pause" && event.channel === "voice")).toBe(true);
  await expect(page.locator("#subtitleZh")).toHaveText("晚安。明天也……不要勉强自己哦。");
});

test("语音、拟音和环境声静音互相独立，物件声不会切断环境声", async ({ page }) => {
  await installMediaProbe(page);
  await seedState(page, { livingWeather: "rain", ambientMuted: false });
  await openRoom(page, { entry: "none" });
  await allowSound(page, "on");
  await expect.poll(async () => (await activeMedia(page)).filter(item => item.channel === "ambient").length).toBeGreaterThan(0);
  await settings(page);
  await page.locator("#voiceMute").click();
  await expect(page.locator("#voiceMute")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#foleyMute")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#ambientMute")).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Escape");
  await page.evaluate(() => window.__v20Media.clear());
  await openPanel(page, "secrets");
  await page.locator('#secretObjects [data-secret="headphones"]').click();
  const events = await mediaEvents(page);
  expect(events.some(event => event.type === "play" && event.channel === "foley")).toBe(true);
  expect(events.filter(event => event.type === "play" && event.channel === "voice")).toEqual([]);
  expect(events.filter(event => event.type === "pause" && event.channel === "ambient")).toEqual([]);
  await settings(page);
  await page.locator("#foleyMute").click();
  await expect(page.locator("#ambientMute")).toHaveAttribute("aria-pressed", "false");
  await page.locator("#ambientMute").click();
  await expect.poll(async () => (await activeMedia(page)).filter(item => item.channel === "ambient").length).toBe(0);
});

test("拒播保留字幕、反应和重试入口，不抛出未处理异常", async ({ page }) => {
  await installMediaProbe(page, "reject");
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await openRoom(page, { entry: "none" });
  await allowSound(page);
  await goPlace(page, "desk");
  await expect(page.locator("#subtitleZh")).toHaveText("在这里就能看清我手边了吧。要安静一点哦。");
  await expect(page.locator("#subtitleJa")).toHaveText("ここなら、手元が見えるでしょ。静かにしててね。");
  await expect(page.locator("#voiceStatus")).toBeVisible();
  await expect(page.locator("#voiceReplay")).toBeEnabled();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-pose", /^desk-/u);
  expect(errors).toEqual([]);
});

test("停止和重播使用同一句，已缓存语音调度及时响应", async ({ page }) => {
  await installMediaProbe(page);
  await openRoom(page, { entry: "none" });
  await allowSound(page);
  await openPanel(page, "goodnight");
  await page.locator("#goodnightVoice").click();
  await expect.poll(async () => (await voiceEvents(page)).at(-1)?.file).toContain("goodnight.mp3");
  await page.locator("#voiceStop").click();
  expect((await activeMedia(page)).filter(item => item.channel === "voice")).toHaveLength(0);
  const started = await page.evaluate(() => {
    const time = performance.now();
    document.querySelector("#voiceReplay").click();
    return time;
  });
  await expect.poll(async () => (await activeMedia(page)).filter(item => item.channel === "voice").length).toBe(1);
  const last = (await voiceEvents(page)).at(-1);
  expect(last.file).toContain("goodnight.mp3");
  // 只测控制器到 Audio.play 的已缓存调度延迟，不冒充扬声器实际发声延迟。
  expect(last.at - started).toBeLessThanOrEqual(200);
  await expect(page.locator("#subtitleZh")).toHaveText("晚安。明天也……不要勉强自己哦。");
});

test("语音文件404仍保留双语台词与失败反馈", async ({ page }) => {
  await installMediaProbe(page);
  await page.route("**/assets/audio/v20/voice/desk-arrive.mp3", route => route.fulfill({ status: 404, contentType: "text/plain", body: "测试配音文件缺失" }));
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await openRoom(page, { entry: "none" });
  await allowSound(page);
  await goPlace(page, "desk");
  await expect(page.locator("#subtitleJa")).toHaveText("ここなら、手元が見えるでしょ。静かにしててね。");
  await expect(page.locator("#subtitleZh")).toHaveText("在这里就能看清我手边了吧。要安静一点哦。");
  await expect(page.locator("#voiceStatus")).toContainText(/失败|无法|不可用|字幕|重试|暂时没有播放|再听/u);
  await expect(page.locator("#voiceReplay")).toBeEnabled();
  expect(errors).toEqual([]);
});

test("角色开口时环境声降低约8dB，结束后恢复且不重启环境音轨", async ({ page }) => {
  await installMediaProbe(page);
  await seedState(page, { livingWeather: "rain", ambienceVolume: 0.4, ambientMuted: false });
  await openRoom(page, { entry: "none" });
  await allowSound(page);
  await page.evaluate(() => window.__v20Media.finishVoice());
  const ambientVolume = async () => (await activeMedia(page)).find(item => item.channel === "ambient")?.volume ?? 0;
  await expect.poll(ambientVolume).toBeGreaterThan(0.01);
  await page.waitForTimeout(600);
  const baseline = await ambientVolume();
  await page.evaluate(() => window.__v20Media.clear());
  await goPlace(page, "desk");
  await expect.poll(ambientVolume).toBeLessThanOrEqual(baseline * 0.5);
  const lowered = await ambientVolume();
  expect(lowered).toBeGreaterThanOrEqual(baseline * 0.25);
  await page.evaluate(() => window.__v20Media.finishVoice());
  await expect.poll(ambientVolume).toBeGreaterThanOrEqual(baseline * 0.95);
  expect((await mediaEvents(page)).filter(event => event.channel === "ambient" && event.type === "pause")).toEqual([]);
});

test("隐藏页面暂停声音，重新可见后必须主动恢复", async ({ page }) => {
  await installMediaProbe(page);
  await seedState(page, { livingWeather: "rain", ambientMuted: false });
  await openRoom(page, { entry: "none" });
  await allowSound(page);
  await goPlace(page, "desk");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(await activeMedia(page)).toEqual([]);
  const count = (await mediaEvents(page)).filter(event => event.type === "play").length;
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator("#resumeSound")).toBeVisible();
  expect((await mediaEvents(page)).filter(event => event.type === "play")).toHaveLength(count);
  await page.locator("#resumeSound").click();
  await expect.poll(async () => (await mediaEvents(page)).filter(event => event.type === "play").length).toBeGreaterThan(count);
});

test("轻邀请不早于进房30秒，关闭后本次拜访不再催促", async ({ page }) => {
  await page.clock.install();
  await openRoom(page, { entry: "none" });
  await allowSound(page, "off");
  await page.clock.fastForward(29_000);
  await expect(page.locator("#inviteNote")).toBeHidden();
  await page.clock.fastForward(3_000);
  await expect(page.locator("#inviteNote")).toBeVisible();
  await page.locator("#inviteDismiss").click();
  await page.clock.fastForward(120_000);
  await expect(page.locator("#inviteNote")).toBeHidden();
});

test("邀请避开正在进行的剧情，并优先接回真实未完成稿", async ({ page }) => {
  const draft = { choices: { presence: "help", subject: "door", palette: "", praise: "" }, step: 2,
    mode: "choices", quietElapsedMs: 0, peekCount: 1, updatedAt: 123 };
  await page.clock.install();
  await seedState(page, { outfit: "home", drawingDraft: draft });
  await openRoom(page, { entry: "none" });
  await allowSound(page, "off");
  await openPanel(page, "gallery");
  await page.clock.fastForward(60_000);
  await expect(page.locator("#inviteNote")).toBeHidden();
  await goPlace(page, "room");
  await page.clock.fastForward(9_000);
  await expect(page.locator("#inviteNote")).toBeVisible();
  await page.locator("#inviteAccept").click();
  await expect(page.locator("#roomPanel")).toHaveAttribute("data-panel", "drawing");
  expect((await stateOf(page)).drawingDraft.choices).toMatchObject(draft.choices);
});
