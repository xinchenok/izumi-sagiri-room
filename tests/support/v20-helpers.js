import { expect } from "@playwright/test";

export const STORAGE_KEY = "sagiri-room-state-v2";
export const LEGACY_KEY = "sagiri-room-state-v1";
export const OUTFITS = ["home", "artist", "outing", "bedtime", "hooded"];
export const PLACES = ["room", "desk", "wardrobe", "bed", "window"];
export const POSES = {
  room: /^standing-/u,
  desk: /^desk-/u,
  wardrobe: /^standing-/u,
  bed: /^bed-/u,
  window: /^standing-/u
};

export async function seedState(page, state, key = STORAGE_KEY) {
  // 只在第一次打开该浏览器上下文时注入，刷新不会把真实交互保存的数据重置。
  await page.addInitScript(({ value, storageKey }) => {
    const marker = "v20-test-seeded";
    if (!sessionStorage.getItem(marker)) {
      localStorage.clear();
      if (value !== null) localStorage.setItem(storageKey, JSON.stringify(value));
      sessionStorage.setItem(marker, "true");
    }
  }, { value: state ?? null, storageKey: key });
}

export async function openRoom(page, options = {}) {
  if (options.reducedMotion !== false) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(options.hash ? `/${options.hash}` : "/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", /^(room|desk|wardrobe|bed|window)$/u);
  await expectImage(page.locator("#roomCharacter"));
  await expectImage(page.locator("#roomBackdrop"));
  if (options.entry !== "none") await allowSound(page, "off");
}

export async function expectImage(locator) {
  await expect(locator).toBeVisible();
  await expect.poll(() => locator.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
}

export async function stateOf(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
}

export async function goPlace(page, place) {
  await page.locator(`nav.place-navigation button[data-place="${place}"]`).click();
  if (await page.locator("#soundConsent").isVisible()) await page.locator('[data-sound-choice="off"]').click();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-scene", place);
  await expectImage(page.locator("#roomCharacter"));
  await expectImage(page.locator("#roomBackdrop"));
  await expect.poll(() => page.locator("#roomCharacter").evaluate(image => {
    const stage = document.querySelector("#roomStage");
    return image.currentSrc.includes(`/${stage.dataset.pose}-`);
  })).toBe(true);
  await expect(page.locator(`nav.place-navigation button[data-place="${place}"]`)).toHaveAttribute("aria-pressed", "true");
}

export async function openPanel(page, name) {
  if (name === "wardrobe") await goPlace(page, "wardrobe");
  else {
    const place = name === "goodnight" ? "bed" : "desk";
    if (await page.locator("#roomStage").getAttribute("data-scene") !== place) await goPlace(page, place);
    const panel = page.locator("#roomPanel");
    if (!(await panel.isVisible()) || await panel.getAttribute("data-panel") !== name) {
      await page.locator(`[data-action="${name}"]:visible`).first().click();
      if (await page.locator("#soundConsent").isVisible()) await page.locator('[data-sound-choice="off"]').click();
    }
  }
  await expect(page.locator("#roomPanel")).toHaveAttribute("data-panel", name);
  await expect(page.locator("#roomPanel")).toBeVisible();
}

export async function chooseOutfit(page, outfit) {
  await openPanel(page, "wardrobe");
  await page.locator(`#outfitOptions button[data-outfit="${outfit}"]`).click();
  await expect(page.locator("#roomStage")).toHaveAttribute("data-outfit", outfit);
  await expect(page.locator("#roomCharacter")).toHaveAttribute("src", new RegExp(`/character/${outfit}/`, "u"));
  await expectImage(page.locator("#roomCharacter"));
}

export async function chooseDrawing(page, kind, value) {
  const choice = page.locator(`[data-choice-kind="${kind}"][data-choice-value="${value}"]`);
  await expect(choice).toBeVisible();
  await choice.click();
}

export async function finishDrawing(page, choices = {}) {
  await openPanel(page, "drawing");
  if (await page.locator("#drawingRestart").isVisible()) await page.locator("#drawingRestart").click();
  await chooseDrawing(page, "presence", choices.presence ?? "help");
  if (choices.presence === "quiet") await page.locator("#quietContinue").click();
  await chooseDrawing(page, "subject", choices.subject ?? "door");
  await chooseDrawing(page, "palette", choices.palette ?? "mint");
  await chooseDrawing(page, "praise", choices.praise ?? "soft");
  await expect(page.locator("#sharedDrawing")).toBeVisible();
}

export async function allowSound(page, choice = "on") {
  await page.locator("#soundButton").click();
  await expect(page.locator("#soundConsent")).toBeVisible();
  await page.locator(`[data-sound-choice="${choice}"]`).click();
  await expect(page.locator("#soundConsent")).toBeHidden();
}

export async function settings(page) {
  await page.locator("#settingsButton").click();
  await expect(page.locator("#settingsPanel")).toBeVisible();
}

export async function installMediaProbe(page, mode = "resolve") {
  await page.addInitScript(({ playbackMode }) => {
    const playing = new Set();
    const known = new Set();
    const source = media => media.dataset.sourceFile || media.getAttribute("src") || media.currentSrc || "";
    const category = media => media.dataset.channel || (/\/voice\//u.test(source(media)) ? "voice" : /(?:ambient|ambience|rain-loop|room-rain)/u.test(source(media)) ? "ambient" : "foley");
    window.__v20Media = { events: [], mode: playbackMode, deferred: null };
    Object.defineProperty(HTMLMediaElement.prototype, "paused", { configurable: true, get() { return !playing.has(this); } });
    HTMLMediaElement.prototype.play = function playProbe() {
      known.add(this);
      const file = source(this);
      window.__v20Media.events.push({ type: "play", file, channel: category(this), at: performance.now() });
      if (window.__v20Media.mode === "reject" && category(this) === "voice") {
        return Promise.reject(new DOMException("测试浏览器拒播", "NotAllowedError"));
      }
      playing.add(this);
      if (window.__v20Media.mode === "defer-first" && category(this) === "voice" && !window.__v20Media.deferred) {
        return new Promise(resolve => { window.__v20Media.deferred = { resolve, media: this }; });
      }
      this.dispatchEvent(new Event("playing"));
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function pauseProbe() {
      playing.delete(this);
      window.__v20Media.events.push({ type: "pause", file: source(this), channel: category(this), at: performance.now() });
      this.dispatchEvent(new Event("pause"));
    };
    window.__v20Media.active = () => [...playing].map(media => ({ file: source(media), channel: category(media), volume: media.volume }));
    window.__v20Media.finish = () => {
      for (const media of [...playing]) { playing.delete(media); media.dispatchEvent(new Event("ended")); }
    };
    window.__v20Media.finishVoice = () => {
      for (const media of [...playing].filter(item => category(item) === "voice")) {
        playing.delete(media); media.dispatchEvent(new Event("ended"));
      }
    };
    window.__v20Media.clear = () => { window.__v20Media.events.length = 0; };
    window.__v20Media.release = () => { window.__v20Media.deferred?.resolve(); };
    window.__v20Media.volumes = () => [...known].map(media => ({ file: source(media), volume: media.volume, channel: category(media) }));
  }, { playbackMode: mode });
}

export async function mediaEvents(page) { return page.evaluate(() => window.__v20Media.events); }
export async function activeMedia(page) { return page.evaluate(() => window.__v20Media.active()); }

export function collectProblems(page) {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => {
    if (response.url().includes("127.0.0.1:4173") && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  return errors;
}

export async function assertNoOverflow(page) {
  const bounds = await page.evaluate(() => ({
    rootWidth: document.documentElement.clientWidth,
    rootScroll: document.documentElement.scrollWidth,
    bodyWidth: document.body.clientWidth,
    bodyScroll: document.body.scrollWidth
  }));
  expect(bounds.rootScroll).toBeLessThanOrEqual(bounds.rootWidth + 1);
  expect(bounds.bodyScroll).toBeLessThanOrEqual(bounds.bodyWidth + 1);
}
