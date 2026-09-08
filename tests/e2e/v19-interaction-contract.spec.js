import { expect, test } from "@playwright/test";

const STORAGE_KEY = "sagiri-room-state-v2";
const VOICE_ROOT = "assets/audio/v19/voice/";
const FOLEY_ROOT = "assets/audio/v19/foley/";

// 以拜访者能听到、看到的固定台词为契约，不从 CONTENT 读取预期结果。
const visits = [
  {
    id: "door", title: "房门", objects: [
      ["轻敲木门", "door-knock-wait", "door-knock-soft", "……ちゃんとノックしてくれたんだ。じゃあ、少しだけ待って。", "……你有好好敲门。那就稍微等一下。"],
      ["轻轻转动门把", "door-handle", "door-handle-turn", "ドアノブ、そんなに見ないで。今、開けるから。", "别一直盯着门把手。我现在就开。"],
      ["看看亮起的门缝", "door-startled", "door-open-gentle", "び、びっくりしただけ。怖がってなんかないから。", "只、只是吓了一跳。我才没有害怕。"]
    ],
    character: ["door-closer", "今日は……いつもより、ちょっとだけ近くてもいいよ。", "今天……可以比平时再靠近一点点。"]
  },
  {
    id: "room", title: "房间", objects: [
      ["听数位笔划过板面", "room-pen-tip", "room-stylus-glide", "ペン先を触るなら、線がずれないようにね。", "要碰笔尖的话，可别让线条歪掉。"],
      ["把椅子轻轻挪近", "room-chair", "room-chair-slide", "そこ、椅子を少しだけ空けておいたの。", "那里……我稍微把椅子空出来了。"],
      ["替她拉上一点窗帘", "room-curtain", "room-curtain-slide", "カーテン、少しだけ閉めて。画面が見やすくなるから。", "把窗帘稍微拉上一点，这样屏幕会更清楚。"]
    ],
    character: ["room-stay", "見てるだけなら……静かに隣にいてもいいよ。", "只是看的话……可以安静待在旁边。"]
  },
  {
    id: "secrets", title: "桌面秘密", objects: [
      ["把耳机放回原来的方向", "secrets-headphones", "secrets-headphones-set", "ヘッドホンの向き？　いつも同じじゃないと落ち着かないだけ。", "耳机的方向？只是每次不一样我就静不下来。"],
      ["掀起草稿的一角", "secrets-draft", "secrets-paper-lift", "そ、それは下書き。まだ見せる予定じゃなかったの。", "那、那只是草稿。我本来没打算给你看的。"],
      ["碰一下抽屉锁扣", "secrets-drawer", "secrets-drawer-latch", "引き出しは……開けるなら、私も一緒に見る。", "抽屉……要打开的话，我也一起看。"]
    ],
    character: ["secrets-nothing-weird", "秘密って言っても、変なものは入ってないからね。", "虽说是秘密，里面可没有奇怪的东西。"]
  },
  {
    id: "wardrobe", title: "衣橱", objects: [
      ["轻轻滑动衣架", "wardrobe-two-outfits", "wardrobe-hanger-slide", "二着いっぺんに比べるの、ちょっと恥ずかしい……。", "一次比较两套，稍微有点害羞……"],
      ["摸摸藏住手的袖口", "wardrobe-sleeves", "wardrobe-sleeve-rustle", "この袖、長すぎる？　でも、手が隠れるから好き。", "这袖子太长了吗？可我喜欢它能遮住手。"],
      ["帮她看蝴蝶结有没有歪", "wardrobe-ribbon", "wardrobe-ribbon-rustle", "リボン、曲がってないかだけ見て。", "只帮我看看蝴蝶结有没有歪。"]
    ],
    character: ["wardrobe-choice-wait", "き、決めたなら早く言って。ずっと待ってるの、もっと恥ずかしいから。", "选、选好了就快点说。一直等着更让人害羞。"]
  },
  {
    id: "gallery", title: "画册", objects: [
      ["替她托住画册封面", "gallery-first-page", "gallery-book-open", "最初のページは、まだ線が少し震えてるの。", "第一页的线条还有一点抖。"],
      ["慢慢翻过一页", "gallery-turn-slow", "gallery-page-turn", "ページ、ゆっくりめくって。角が折れたら困るから。", "慢慢翻页。折到书角我会很困扰。"],
      ["把画纸轻轻滑近", "gallery-close-look", "gallery-photo-slide", "その画、近くで見るなら……感想もちゃんと言って。", "要靠近看那张画……也要认真说感想。"]
    ],
    character: ["gallery-praise", "最後まで見たの？　……じゃあ、少しくらい褒めてもいいよ。", "看到最后了吗？……那稍微夸一下也可以。"]
  },
  {
    id: "drawing", title: "一起画", objects: [
      ["听她再画一条短线", "drawing-one-line", "drawing-stylus-line", "今いいところだから、あと一本だけ線を引かせて。", "正画到关键地方，让我再画一条线。"],
      ["轻碰遮住画面的稿纸", "drawing-peek-again", "drawing-paper-cover", "また覗いた。……そんなに気になるの？", "又偷看。……就这么在意吗？"],
      ["接住推近的完成稿", "drawing-first-view", "drawing-sheet-push", "できた。最初に見せるのは……今日は、あなたでいい。", "画好了。今天第一个给你看的人……可以是你。"]
    ],
    character: ["drawing-you-are-there", "何も言わなくても、そこにいるのは分かってる。", "就算什么都不说，我也知道你在那里。"]
  },
  {
    id: "goodnight", title: "晚安", objects: [
      ["轻轻按一下猫咪玩偶", "goodnight-plush", "goodnight-plush-squeeze", "ぬいぐるみ、ちゃんと返して。これがないと眠れないの。", "玩偶要好好还给我。没有它我睡不着。"],
      ["替她合上怀里的书", "goodnight-book", "goodnight-book-close", "本はここに置いておく。続きは、また今度。", "书就放在这里。下次再看后面。"],
      ["把房门轻轻合上", "goodnight-knock-next", "goodnight-latch", "おやすみ。次も……ちゃんとノックしてね。", "晚安。下次也要……好好敲门哦。"]
    ],
    character: ["goodnight-sleepy", "もう少し起きていたいけど、目が勝手に閉じそう……。", "还想再醒一会儿，可眼睛好像要自己闭上了……"]
  }
];

async function installMediaProbe(page, mode = "resolve") {
  await page.addInitScript(({ playbackMode }) => {
    const playing = new Set();
    const source = (media) => media.dataset.sourceFile || media.getAttribute("src") || "";
    window.__v19Media = { events: [], mode: playbackMode, releaseFirst: null };
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      configurable: true,
      get() { return !playing.has(this); }
    });
    HTMLMediaElement.prototype.play = function recordPlay() {
      const file = source(this);
      window.__v19Media.events.push({ type: "play", file });
      if (window.__v19Media.mode === "reject" && file.includes("/v19/voice/")) {
        return Promise.reject(new DOMException("测试浏览器拒绝播放", "NotAllowedError"));
      }
      playing.add(this);
      if (window.__v19Media.mode === "defer-first" && file.includes("/v19/voice/") && !window.__v19Media.releaseFirst) {
        return new Promise((resolve) => { window.__v19Media.releaseFirst = resolve; });
      }
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function recordPause() {
      playing.delete(this);
      window.__v19Media.events.push({ type: "pause", file: source(this) });
    };
    window.__v19Media.activeFiles = () => [...playing].map(source);
  }, { playbackMode: mode });
}

async function openHome(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#cinematicStage")).toBeVisible();
}

async function inspectScene(page, scene) {
  await page.evaluate((id) => {
    const beat = document.querySelector(`#cinematic-${id}`);
    const top = beat.getBoundingClientRect().top + window.scrollY;
    const focus = window.innerHeight * (window.innerWidth <= 760 ? 0.68 : 0.52);
    window.scrollTo({ top: top + beat.offsetHeight * 0.15 - focus, behavior: "instant" });
  }, scene.id);
  await expect(page.locator("#cinematicStage")).toHaveAttribute("data-scene", scene.id);
  await page.locator("#cinematicInspectButton").click();
  const dialog = page.locator("#cinematicInspectDialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: `看看${scene.title}`, exact: true })).toBeVisible();
  await expect(page.locator("#cinematicInspectImage")).toHaveAttribute("src", new RegExp(`assets/v19/(?:master/)?${scene.id}-`, "u"));
  await expect.poll(() => page.locator("#cinematicInspectImage").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator("#cinematicInspectError")).toBeHidden();
  return dialog;
}

async function expectReply(page, japanese, chinese) {
  await expect(page.locator("#cinematicInspectJapanese")).toBeVisible();
  await expect(page.locator("#cinematicInspectJapanese")).toHaveText(japanese);
  await expect(page.locator("#cinematicInspectChinese")).toBeVisible();
  await expect(page.locator("#cinematicInspectChinese")).toHaveText(chinese);
}

async function playedFiles(page) {
  return page.evaluate(() => window.__v19Media.events.filter((event) => event.type === "play").map((event) => event.file));
}

async function closeInspection(page) {
  await page.locator("#cinematicInspectClose").click();
  await expect(page.locator("#cinematicInspectDialog")).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/\bcinematic-inspecting\b/u);
  await expect(page.locator("#cinematicInspectButton")).toBeFocused();
}

test("七幕观察模式的 21 个物件与 7 次呼唤给出各自的双语回应和唯一声音", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installMediaProbe(page);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await openHome(page);
  const expectedPlayed = [];

  for (const scene of visits) {
    const dialog = await inspectScene(page, scene);
    await expect(page.locator("#cinematicInspectHotspots button")).toHaveCount(3);
    for (const [index, [label, voice, foley, japanese, chinese]] of scene.objects.entries()) {
      const hotspot = dialog.getByRole("button", { name: label, exact: true });
      await expect(hotspot).toBeVisible();
      if (index % 2 === 0) await hotspot.click();
      else await hotspot.press("Enter");
      await expectReply(page, japanese, chinese);
      expectedPlayed.push(`${FOLEY_ROOT}${foley}.mp3`, `${VOICE_ROOT}${voice}.mp3`);
      await expect.poll(() => playedFiles(page)).toEqual(expectedPlayed);
    }
    const [voice, japanese, chinese] = scene.character;
    await dialog.getByRole("button", { name: `轻声呼唤${scene.title}画面里的纱雾`, exact: true }).press("Space");
    await expectReply(page, japanese, chinese);
    expectedPlayed.push(`${VOICE_ROOT}${voice}.mp3`);
    await expect.poll(() => playedFiles(page)).toEqual(expectedPlayed);
    await closeInspection(page);
  }

  const files = await playedFiles(page);
  expect(new Set(files.filter((file) => file.startsWith(VOICE_ROOT))).size).toBe(28);
  expect(new Set(files.filter((file) => file.startsWith(FOLEY_ROOT))).size).toBe(21);
  expect(pageErrors).toEqual([]);
});

test("快速更换物件和呼唤会取消上一句，迟到的播放结果不能覆盖最后回应", async ({ page }) => {
  await installMediaProbe(page, "defer-first");
  await openHome(page);
  const dialog = await inspectScene(page, visits[0]);
  await dialog.getByRole("button", { name: "轻敲木门", exact: true }).click();
  await dialog.getByRole("button", { name: "轻轻转动门把", exact: true }).click();
  await page.locator("#cinematicCharacterHotspot").press("Enter");
  const [, japanese, chinese] = visits[0].character;
  await expectReply(page, japanese, chinese);
  await expect(page.locator("#cinematicInspectPlayback")).toHaveText("正在播放 · 房门");
  await page.evaluate(() => window.__v19Media.releaseFirst());
  await expectReply(page, japanese, chinese);

  const events = await page.evaluate(() => window.__v19Media.events);
  for (const [oldVoice, newVoice] of [["door-knock-wait", "door-handle"], ["door-handle", "door-closer"]]) {
    const oldPlay = events.findIndex((event) => event.type === "play" && event.file === `${VOICE_ROOT}${oldVoice}.mp3`);
    const oldStop = events.findIndex((event, index) => index > oldPlay && event.type === "pause" && event.file === `${VOICE_ROOT}${oldVoice}.mp3`);
    const newPlay = events.findIndex((event) => event.type === "play" && event.file === `${VOICE_ROOT}${newVoice}.mp3`);
    expect(oldPlay).toBeGreaterThanOrEqual(0);
    expect(oldStop).toBeGreaterThan(oldPlay);
    expect(newPlay).toBeGreaterThan(oldStop);
  }
  expect(await page.evaluate(() => window.__v19Media.activeFiles().filter((file) => file.includes("/v19/voice/"))))
    .toEqual([`${VOICE_ROOT}door-closer.mp3`]);
  await page.locator("#cinematicVoiceStop").press("Enter");
  await expect(page.locator("#cinematicInspectPlayback")).toHaveText("已经停下 · 字幕仍保留");
  await expectReply(page, japanese, chinese);
  expect(await page.evaluate(() => window.__v19Media.activeFiles().filter((file) => file.includes("/v19/voice/")))).toEqual([]);
});

test("角色静音与物件静音互不连带，重新开启后各自恢复点击播放", async ({ page }) => {
  await installMediaProbe(page);
  await openHome(page);
  const dialog = await inspectScene(page, visits[0]);
  const voiceToggle = page.locator("#cinematicVoiceToggle");
  const foleyToggle = page.locator("#cinematicFoleyToggle");
  const [label, voice, foley, japanese, chinese] = visits[0].objects[0];
  const hotspot = dialog.getByRole("button", { name: label, exact: true });

  await voiceToggle.press("Enter");
  await expect(voiceToggle).toHaveAttribute("aria-pressed", "true");
  await expect(foleyToggle).toHaveAttribute("aria-pressed", "false");
  await hotspot.click();
  await expectReply(page, japanese, chinese);
  await expect.poll(() => playedFiles(page)).toEqual([`${FOLEY_ROOT}${foley}.mp3`]);
  await expect(page.locator("#cinematicInspectPlayback")).toContainText("只显示字幕");

  await voiceToggle.click();
  await foleyToggle.press("Enter");
  await expect(voiceToggle).toHaveAttribute("aria-pressed", "false");
  await expect(foleyToggle).toHaveAttribute("aria-pressed", "true");
  await hotspot.press("Space");
  await expect.poll(() => playedFiles(page)).toEqual([`${FOLEY_ROOT}${foley}.mp3`, `${VOICE_ROOT}${voice}.mp3`]);
  await expectReply(page, japanese, chinese);

  await foleyToggle.click();
  await expectReply(page, japanese, chinese);
  await hotspot.click();
  await expect.poll(() => playedFiles(page)).toEqual([
    `${FOLEY_ROOT}${foley}.mp3`, `${VOICE_ROOT}${voice}.mp3`, `${FOLEY_ROOT}${foley}.mp3`, `${VOICE_ROOT}${voice}.mp3`
  ]);
  await closeInspection(page);
  await expect(page.locator("#feedbackDock")).toHaveClass(/\bis-peeking\b/u);
  await expect(page.locator("#subtitleJapanese")).toBeVisible();
  await expect(page.locator("#subtitleJapanese")).toHaveText(japanese);
});

for (const failure of ["浏览器拒播", "音频文件缺失"]) {
  test(`${failure}时观察模式仍显示当前双语台词且没有页面异常`, async ({ page }) => {
    await installMediaProbe(page, failure === "浏览器拒播" ? "reject" : "resolve");
    const pageErrors = [];
    const failedVoiceResponses = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    if (failure === "音频文件缺失") {
      await page.route("**/assets/audio/v19/voice/door-knock-wait.mp3", (route) => route.fulfill({ status: 404, body: "" }));
      page.on("response", (response) => {
        if (response.url().endsWith("/v19/voice/door-knock-wait.mp3") && response.status() === 404) failedVoiceResponses.push(response.url());
      });
    }
    await openHome(page);
    const dialog = await inspectScene(page, visits[0]);
    const [label, , , japanese, chinese] = visits[0].objects[0];
    await dialog.getByRole("button", { name: label, exact: true }).click();
    await expect(page.locator("#cinematicInspectPlayback")).toContainText("没加载出来");
    await expectReply(page, japanese, chinese);
    if (failure === "音频文件缺失") expect(failedVoiceResponses.length).toBeGreaterThan(0);
    expect(pageErrors).toEqual([]);
    await page.locator("#cinematicInspectClose").press("Enter");
    await expect(page.locator("#cinematicInspectButton")).toBeFocused();
  });
}

test("旧 v2 状态自动补充活泼模式并保留原有静音偏好", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({ outfit: "home", secrets: [], voiceMuted: true, roomSoundMuted: false }));
  }, STORAGE_KEY);
  await installMediaProbe(page);
  await openHome(page);
  await expect(page.locator("body")).toHaveAttribute("data-motion", "lively");
  await expect(page.locator("#motionModeButton")).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).motionMode, STORAGE_KEY)).toBe("lively");
  await inspectScene(page, visits[0]);
  await expect(page.locator("#cinematicVoiceToggle")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#cinematicFoleyToggle")).toHaveAttribute("aria-pressed", "false");
});

test("存储读写不可用时，安静模式和两个声音开关仍在当前会话工作", async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem"]) {
      Storage.prototype[method] = () => { throw new DOMException("测试存储不可用", "SecurityError"); };
    }
  });
  await installMediaProbe(page);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await openHome(page);
  await page.locator("#motionModeButton").press("Enter");
  await expect(page.locator("body")).toHaveAttribute("data-motion", "quiet");
  await inspectScene(page, visits[0]);
  await page.locator("#cinematicVoiceToggle").press("Enter");
  await page.locator("#cinematicFoleyToggle").press("Space");
  await closeInspection(page);

  const dialog = await inspectScene(page, visits[1]);
  await expect(page.locator("#cinematicVoiceToggle")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#cinematicFoleyToggle")).toHaveAttribute("aria-pressed", "true");
  const [label, voice, , japanese, chinese] = visits[1].objects[0];
  await dialog.getByRole("button", { name: label, exact: true }).click();
  await expectReply(page, japanese, chinese);
  expect(await playedFiles(page)).toEqual([]);
  await page.locator("#cinematicVoiceToggle").click();
  await dialog.getByRole("button", { name: label, exact: true }).click();
  await expect.poll(() => playedFiles(page)).toEqual([`${VOICE_ROOT}${voice}.mp3`]);
  await closeInspection(page);
  await expect(page.locator("body")).toHaveAttribute("data-motion", "quiet");
  expect(pageErrors).toEqual([]);
});
