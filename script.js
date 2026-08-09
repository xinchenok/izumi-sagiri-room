"use strict";

const CONTENT = {
  heroExpressions: {
    peek: {
      image: "assets/v3/hero-peek.png",
      alt: "银白长发、蓝眼睛的纱雾穿着粉色猫耳家居服，握着半掩的卧室门安静偷看"
    },
    startled: {
      image: "assets/v3/hero-startled.png",
      alt: "听见敲门后，纱雾睁大蓝眼睛露出突然受惊的可爱表情"
    },
    shy: {
      image: "assets/v3/hero-shy.png",
      alt: "认出来访者后，纱雾握着门边脸红地害羞微笑"
    },
    proud: {
      image: "assets/v3/hero-proud.png",
      alt: "纱雾握着门边，露出认真又有一点得意的可爱表情"
    }
  },
  outfits: {
    home: {
      name: "宽松运动家居服",
      image: "assets/v3/outfit-home.png",
      alt: "纱雾穿宽松粉色运动外套和奶油色运动裤，坐在床边害羞微笑",
      description: "袖子要够长，裤脚要够软。窝在房间里画画的时候，这样才最安心。",
      time: "午后 15:20",
      expression: "shy",
      reaction: "这套……最不会分心。"
    },
    artist: {
      name: "格纹画稿睡衣",
      image: "assets/v3/outfit-artist-night.png",
      alt: "纱雾穿蓝白格长袖睡衣和长裤，戴着绘图手套在月光下认真画画",
      description: "蓝白格睡衣、绘图手套和不会掉下去的软拖鞋——熬夜画稿模式，准备完成。",
      time: "深夜 00:47",
      expression: "proud",
      reaction: "今、今晚一定画得完。"
    },
    outing: {
      name: "薄荷水手外套",
      image: "assets/v3/outfit-outing-sailor.png",
      alt: "纱雾穿水手领裙装、薄荷色针织外套和深色长袜，抱着棕色书包站在门口",
      description: "水手领、厚厚的薄荷针织和能挡住紧张的书包。真的要出门时，会在门口多站一会儿。",
      time: "早上 08:10",
      expression: "startled",
      reaction: "外、外面的人不会很多吧？"
    }
  },
  voiceLines: {
    welcome: {
      id: "welcome",
      japanese: "お、おかえり……今日も、静かにしてね。",
      chinese: "欢、欢迎回来……今天也要安静一点哦。",
      file: "assets/audio/v3/welcome.wav",
      expression: "shy",
      scene: "房门口",
      reaction: "欢、欢迎回来……"
    },
    drawing: {
      id: "drawing",
      japanese: "まだ描き終わってないから……勝手に見ちゃだめ。",
      chinese: "这张画还没完成，不许偷看。",
      file: "assets/audio/v3/drawing.wav",
      expression: "startled",
      scene: "画桌旁",
      reaction: "不许趁我没注意偷看。"
    },
    like: {
      id: "like",
      japanese: "気に入ったなら……もう一枚、描いてあげてもいいよ。",
      chinese: "如果你喜欢的话……我可以再画一张。",
      file: "assets/audio/v3/like.wav",
      expression: "proud",
      scene: "衣橱相册",
      reaction: "也、也不是特意画给你的。"
    },
    goodnight: {
      id: "goodnight",
      japanese: "おやすみ。明日も……一緒に頑張ろうね。",
      chinese: "晚安，明天也要一起努力。",
      file: "assets/audio/v3/goodnight.wav",
      expression: "shy",
      scene: "晚安以前",
      reaction: "明天……也可以再来。"
    }
  },
  reactions: {
    idle: { expression: "peek", label: "纱雾的反应", text: "……门外是谁？" },
    knock: { expression: "startled", label: "听见敲门", text: "咿——！你、你什么时候来的？" },
    open: { expression: "shy", label: "门打开以后", text: "只可以安静地待一会儿。" },
    secret: { expression: "startled", label: "秘密被发现", text: "那、那个也要看吗？" },
    repeat: { expression: "proud", label: "已经看过啦", text: "记得这么清楚……还算合格。" },
    unlocked: { expression: "shy", label: "五枚猫爪集齐", text: "留言只许你一个人看。" },
    gallery: { expression: "startled", label: "画稿翻页中", text: "慢一点，纸角会折到的。" },
    fortune: { expression: "shy", label: "纸条换了一张", text: "这句……也送给你。" },
    voiceError: { expression: "peek", label: "声音没有播放", text: "字幕还在，先看这里也可以。" }
  },
  gallery: [
    {
      id: "drawing",
      image: "assets/v3/gallery-drawing.png",
      thumb: "assets/v3/gallery-drawing.png",
      alt: "深夜里，纱雾趴在数位板前认真画画",
      title: "进入专注模式",
      note: "嘴上说着不许偷看，真正画起来以后，连门边的脚步声都听不见了。"
    },
    {
      id: "hide",
      image: "assets/v3/gallery-hide.png",
      thumb: "assets/v3/gallery-hide.png",
      alt: "纱雾躲在大画册后，只露出一双俏皮明亮的蓝眼睛",
      title: "被发现就先藏起来",
      note: "画册挡住了大半张脸，但那双眼睛已经把“我知道你在看”全都说出来了。"
    },
    {
      id: "night",
      image: "assets/v3/gallery-night.png",
      thumb: "assets/v3/gallery-night.png",
      alt: "月光下，纱雾蜷坐在窗边抱着猫咪玩偶",
      title: "今天的最后一页",
      note: "稿子保存好，窗帘留一条缝，再抱住最软的玩偶，房间终于慢慢安静下来。"
    },
    {
      id: "home",
      image: "assets/v3/outfit-home.png",
      thumb: "assets/v3/outfit-home.png",
      alt: "纱雾穿宽松粉色运动服坐在床边",
      title: "不用出门的午后",
      note: "宽松袖口把手藏住一半。有人靠近时，她会先把膝盖并好，再抬眼确认。"
    },
    {
      id: "artist",
      image: "assets/v3/outfit-artist-night.png",
      thumb: "assets/v3/outfit-artist-night.png",
      alt: "纱雾穿蓝白格睡衣在深夜数位板前画稿",
      title: "深夜画师模式",
      note: "格纹睡衣和绘图手套是今晚的工作服。困意可以等，这一笔不能歪。"
    },
    {
      id: "outing",
      image: "assets/v3/outfit-outing-sailor.png",
      thumb: "assets/v3/outfit-outing-sailor.png",
      alt: "纱雾穿水手领裙装与薄荷针织外套站在门口",
      title: "出门前的三十秒",
      note: "书包已经拿好，鞋也穿好了。现在只剩下鼓起勇气跨过门槛这一件事。"
    }
  ],
  secrets: {
    tablet: { label: "数位板", text: "快捷键都设成单手能按到，因为另一只手常常要抱着靠枕。" },
    headphones: { label: "耳机", text: "画线稿时会循环同一张安静的歌单，音量永远只开到三格。" },
    manuscript: { label: "轻小说稿件", text: "页边画满了表情草稿。比起剧情批注，她更先注意角色有没有好好笑出来。" },
    plush: { label: "猫咪玩偶", text: "不顺利的时候会被抱得很紧。顺利的时候，也一样。" },
    drawer: { label: "上锁抽屉", text: "钥匙藏在薄荷色铅笔盒底下。不过，要集齐五枚猫爪才可以打开。" }
  },
  fortunes: [
    "画不完也没关系，先把今天好好收起来。",
    "今天已经很努力了，剩下的一小步留给明天。",
    "如果有点害怕，就先从门缝里看一眼。",
    "喜欢的事情不用解释很大声，认真做下去就好。",
    "晚安。明天醒来，线条会比今晚更轻一点。",
    "有人安静陪着的时候，房间就没有那么小了。"
  ]
};

const STORAGE_KEY_V2 = "sagiri-room-state-v2";
const STORAGE_KEY_V1 = "sagiri-room-state-v1";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function validOutfit(value) {
  return Object.prototype.hasOwnProperty.call(CONTENT.outfits, value);
}

function validSecrets(value) {
  return Array.isArray(value) ? value.filter((key) => Object.prototype.hasOwnProperty.call(CONTENT.secrets, key)) : [];
}

function readState() {
  const fallback = { outfit: "home", secrets: new Set() };
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY_V2));
    if (current) {
      return {
        outfit: validOutfit(current.outfit) ? current.outfit : "home",
        secrets: new Set(validSecrets(current.secrets))
      };
    }

    const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY_V1));
    if (legacy) {
      const migrated = {
        outfit: validOutfit(legacy.outfit) ? legacy.outfit : "home",
        secrets: validSecrets(legacy.secrets)
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      return { outfit: migrated.outfit, secrets: new Set(migrated.secrets) };
    }
  } catch {
    return fallback;
  }
  return fallback;
}

const state = readState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify({
      outfit: state.outfit,
      secrets: [...state.secrets]
    }));
  } catch {
    // 存储不可用时，仅保留当前会话状态。
  }
}

const elements = {
  doorScene: document.querySelector("#doorScene"),
  doorLeaf: document.querySelector("#doorLeaf"),
  knockButton: document.querySelector("#knockButton"),
  doorStatus: document.querySelector("#doorStatus"),
  heroCharacter: document.querySelector("#heroCharacter"),
  feedbackDock: document.querySelector("#feedbackDock"),
  reactionCorner: document.querySelector("#reactionCorner"),
  reactionImage: document.querySelector("#reactionImage"),
  reactionLabel: document.querySelector("#reactionLabel"),
  reactionText: document.querySelector("#reactionText"),
  subtitleScene: document.querySelector("#subtitleScene"),
  subtitleJapanese: document.querySelector("#subtitleJapanese"),
  subtitleChinese: document.querySelector("#subtitleChinese"),
  stopVoiceButton: document.querySelector("#stopVoiceButton"),
  outfitStage: document.querySelector("#outfitStage"),
  outfitImage: document.querySelector("#outfitImage"),
  outfitName: document.querySelector("#outfitName"),
  outfitDescription: document.querySelector("#outfitDescription"),
  outfitTime: document.querySelector("#outfitTime"),
  outfitTabs: [...document.querySelectorAll("[data-outfit]")],
  outfitPrev: document.querySelector("#outfitPrev"),
  outfitNext: document.querySelector("#outfitNext"),
  secretButtons: [...document.querySelectorAll("[data-secret]")],
  secretProgress: document.querySelector("#secretProgress"),
  secretCount: document.querySelector("#secretCount"),
  secretMessage: document.querySelector("#secretMessage"),
  galleryStage: document.querySelector("#galleryStage"),
  galleryMainImage: document.querySelector("#galleryMainImage"),
  galleryIndex: document.querySelector("#galleryIndex"),
  galleryCaption: document.querySelector("#galleryCaption"),
  galleryNote: document.querySelector("#galleryNote"),
  galleryThumbs: document.querySelector("#galleryThumbs"),
  galleryPrev: document.querySelector("#galleryPrev"),
  galleryNext: document.querySelector("#galleryNext"),
  fortuneNote: document.querySelector("#fortuneNote strong"),
  fortuneButton: document.querySelector("#fortuneButton")
};

let doorOpened = false;
let heroSequence = 0;
let outfitSequence = 0;
let gallerySequence = 0;
let galleryPosition = 0;
let voiceSequence = 0;
let lastFortune = 0;
let feedbackTimer = 0;

const voicePlayer = new Audio();
voicePlayer.preload = "none";

function preloadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(source);
    image.onerror = reject;
    image.src = source;
  });
}

function setHeroExpression(key) {
  const expression = CONTENT.heroExpressions[key] || CONTENT.heroExpressions.peek;
  elements.heroCharacter.src = expression.image;
  elements.heroCharacter.alt = expression.alt;
}

function sprinkle(origin) {
  if (reducedMotion.matches) return;
  const colors = ["#f3d16d", "#a9cfbf", "#d8879f", "#cfe8ed"];
  for (let index = 0; index < 9; index += 1) {
    const piece = document.createElement("i");
    piece.className = "paper-confetti";
    piece.style.left = `${origin.x}px`;
    piece.style.top = `${origin.y}px`;
    piece.style.setProperty("--confetti-color", colors[index % colors.length]);
    piece.style.setProperty("--confetti-x", `${(index - 4) * 12 + Math.random() * 10}px`);
    piece.style.setProperty("--confetti-y", `${28 + Math.random() * 34}px`);
    piece.style.setProperty("--confetti-r", `${(index - 4) * 41}deg`);
    document.body.append(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

function reactionOrigin() {
  const bounds = elements.reactionCorner.getBoundingClientRect();
  return { x: bounds.left + bounds.width * 0.55, y: bounds.top + bounds.height * 0.5 };
}

function settleFeedback(delay = 3200) {
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    elements.feedbackDock.classList.remove("is-peeking");
    document.body.classList.remove("feedback-active");
  }, delay);
}

function showFeedback(persistent = false) {
  window.clearTimeout(feedbackTimer);
  elements.feedbackDock.classList.add("is-peeking");
  document.body.classList.add("feedback-active");
  if (!persistent) settleFeedback();
}

function updateReaction(reaction, withConfetti = true) {
  const next = typeof reaction === "string" ? CONTENT.reactions[reaction] : reaction;
  if (!next) return;
  const expression = CONTENT.heroExpressions[next.expression] || CONTENT.heroExpressions.peek;
  elements.reactionImage.src = expression.image;
  elements.reactionImage.alt = expression.alt;
  elements.reactionLabel.textContent = next.label;
  elements.reactionText.textContent = next.text;
  elements.reactionCorner.classList.remove("is-reacting");
  void elements.reactionCorner.offsetWidth;
  elements.reactionCorner.classList.add("is-reacting");
  showFeedback();
  if (withConfetti) sprinkle(reactionOrigin());
}

function openDoor() {
  if (doorOpened) {
    updateReaction("open", false);
    return;
  }
  doorOpened = true;
  const sequence = ++heroSequence;
  elements.doorScene.classList.add("is-startled");
  elements.knockButton.setAttribute("aria-expanded", "true");
  elements.knockButton.querySelector("span").textContent = "门正在打开";
  elements.doorStatus.innerHTML = "<span>她被吓了一小跳。</span><strong>“咿——！先、先等一下……”</strong>";
  setHeroExpression("startled");
  updateReaction("knock");

  window.setTimeout(() => {
    if (sequence !== heroSequence) return;
    elements.doorScene.classList.add("is-open");
    elements.doorScene.classList.remove("is-startled");
    elements.knockButton.querySelector("span").textContent = "门已经打开啦";
    elements.knockButton.disabled = true;
    elements.doorStatus.innerHTML = "<span>她认出你以后，脸更红了。</span><strong>“只、只可以安静地待一会儿。”</strong>";
    setHeroExpression("shy");
    updateReaction("open", false);
  }, reducedMotion.matches ? 20 : 760);
}

function stopVoice(keepSubtitle = true, keepDock = false) {
  voiceSequence += 1;
  voicePlayer.pause();
  try {
    voicePlayer.currentTime = 0;
  } catch {
    // 某些浏览器在媒体尚未就绪时不允许重置时间。
  }
  elements.stopVoiceButton.hidden = true;
  if (!keepSubtitle) {
    elements.subtitleScene.textContent = "房门里";
    elements.subtitleJapanese.textContent = "音声を停止しました。";
    elements.subtitleChinese.textContent = "语音已停止。";
  }
  if (!keepDock) settleFeedback(keepSubtitle ? 1200 : 2400);
}

async function playVoice(id) {
  const line = CONTENT.voiceLines[id];
  if (!line) return;

  stopVoice(true, true);
  const sequence = voiceSequence;
  elements.subtitleScene.textContent = line.scene;
  elements.subtitleJapanese.textContent = line.japanese;
  elements.subtitleChinese.textContent = line.chinese;
  setHeroExpression(line.expression);
  updateReaction({ expression: line.expression, label: `正在听 · ${line.scene}`, text: line.reaction });
  showFeedback(true);

  voicePlayer.src = line.file;
  voicePlayer.load();
  try {
    await voicePlayer.play();
    if (sequence !== voiceSequence) return;
    elements.stopVoiceButton.hidden = false;
  } catch {
    if (sequence !== voiceSequence) return;
    elements.stopVoiceButton.hidden = true;
    elements.subtitleScene.textContent = `${line.scene} · 暂时没有声音`;
    updateReaction("voiceError", false);
  }
}

voicePlayer.addEventListener("ended", () => {
  elements.stopVoiceButton.hidden = true;
  settleFeedback(2600);
});

voicePlayer.addEventListener("error", () => {
  elements.stopVoiceButton.hidden = true;
  settleFeedback(3200);
});

function applyOutfit(key) {
  const outfit = CONTENT.outfits[key];
  if (!outfit) return;
  elements.outfitImage.src = outfit.image;
  elements.outfitImage.alt = outfit.alt;
  elements.outfitName.textContent = outfit.name;
  elements.outfitDescription.textContent = outfit.description;
  elements.outfitTime.textContent = outfit.time;
  elements.outfitTabs.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.outfit === key));
  });
}

async function switchOutfit(key, announce = true) {
  const outfit = CONTENT.outfits[key];
  if (!outfit) return;
  const sequence = ++outfitSequence;
  if (key === state.outfit && announce) {
    elements.outfitStage.classList.remove("is-turning");
    applyOutfit(key);
    updateReaction({ expression: outfit.expression, label: outfit.name, text: outfit.reaction }, false);
    return;
  }
  elements.outfitStage.classList.add("is-turning");

  try {
    await preloadImage(outfit.image);
  } catch {
    if (sequence === outfitSequence) {
      elements.outfitStage.classList.remove("is-turning");
      updateReaction("voiceError", false);
    }
    return;
  }

  window.setTimeout(() => {
    if (sequence !== outfitSequence) return;
    applyOutfit(key);
    state.outfit = key;
    saveState();
    if (announce) {
      updateReaction({ expression: outfit.expression, label: `换上 · ${outfit.name}`, text: outfit.reaction });
    }
  }, reducedMotion.matches ? 0 : 210);

  window.setTimeout(() => {
    if (sequence === outfitSequence) elements.outfitStage.classList.remove("is-turning");
  }, reducedMotion.matches ? 10 : 540);
}

function adjacentOutfit(direction) {
  const keys = Object.keys(CONTENT.outfits);
  const position = keys.indexOf(state.outfit);
  const next = (position + direction + keys.length) % keys.length;
  switchOutfit(keys[next]);
}

function refreshSecrets() {
  elements.secretButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(state.secrets.has(button.dataset.secret)));
  });
  [...elements.secretProgress.children].forEach((paw, index) => {
    paw.classList.toggle("is-found", index < state.secrets.size);
  });
  elements.secretCount.textContent = String(state.secrets.size);
  elements.secretProgress.setAttribute("aria-label", `已经发现${state.secrets.size}个秘密`);
  const unlocked = state.secrets.size === Object.keys(CONTENT.secrets).length;
  elements.secretMessage.hidden = !unlocked;
}

function discoverSecret(button) {
  const key = button.dataset.secret;
  const secret = CONTENT.secrets[key];
  if (!secret) return;

  if (state.secrets.has(key)) {
    updateReaction({ ...CONTENT.reactions.repeat, text: `${secret.label}：${secret.text}` }, false);
    return;
  }

  state.secrets.add(key);
  saveState();
  refreshSecrets();
  const unlocked = state.secrets.size === Object.keys(CONTENT.secrets).length;
  updateReaction(unlocked ? "unlocked" : { ...CONTENT.reactions.secret, text: `${secret.label}：${secret.text}` });
  if (unlocked) elements.secretMessage.focus?.();
}

function buildGalleryThumbs() {
  const fragment = document.createDocumentFragment();
  CONTENT.gallery.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "film-thumb";
    button.type = "button";
    button.dataset.galleryIndex = String(index);
    button.setAttribute("aria-label", `查看画稿：${item.title}`);
    button.setAttribute("aria-pressed", String(index === 0));

    const image = document.createElement("img");
    image.src = item.thumb;
    image.alt = "";
    image.width = 320;
    image.height = 240;
    image.loading = "lazy";
    button.append(image);
    button.addEventListener("click", () => switchGallery(index));
    fragment.append(button);
  });
  elements.galleryThumbs.append(fragment);
}

function applyGallery(index) {
  const item = CONTENT.gallery[index];
  elements.galleryMainImage.src = item.image;
  elements.galleryMainImage.alt = item.alt;
  elements.galleryIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(CONTENT.gallery.length).padStart(2, "0")}`;
  elements.galleryCaption.textContent = item.title;
  elements.galleryNote.textContent = item.note;
  [...elements.galleryThumbs.children].forEach((button, thumbIndex) => {
    button.setAttribute("aria-pressed", String(thumbIndex === index));
  });
  const active = elements.galleryThumbs.children[index];
  active?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
}

async function switchGallery(index, announce = true) {
  const normalized = (index + CONTENT.gallery.length) % CONTENT.gallery.length;
  const sequence = ++gallerySequence;
  if (normalized === galleryPosition && announce) {
    elements.galleryStage.classList.remove("is-switching");
    applyGallery(normalized);
    updateReaction("gallery", false);
    return;
  }
  const item = CONTENT.gallery[normalized];
  elements.galleryStage.classList.add("is-switching");

  try {
    await preloadImage(item.image);
  } catch {
    if (sequence === gallerySequence) elements.galleryStage.classList.remove("is-switching");
    return;
  }

  window.setTimeout(() => {
    if (sequence !== gallerySequence) return;
    galleryPosition = normalized;
    applyGallery(normalized);
    if (announce) updateReaction({ ...CONTENT.reactions.gallery, text: `“${item.title}”这一页不许折角。` });
  }, reducedMotion.matches ? 0 : 190);

  window.setTimeout(() => {
    if (sequence === gallerySequence) elements.galleryStage.classList.remove("is-switching");
  }, reducedMotion.matches ? 10 : 470);
}

function newFortune() {
  let next = Math.floor(Math.random() * CONTENT.fortunes.length);
  if (CONTENT.fortunes.length > 1 && next === lastFortune) next = (next + 1) % CONTENT.fortunes.length;
  lastFortune = next;
  elements.fortuneNote.textContent = CONTENT.fortunes[next];
  updateReaction("fortune");
}

function preloadDeferredAssets() {
  [CONTENT.heroExpressions.startled, CONTENT.heroExpressions.shy]
    .forEach((item) => preloadImage(item.image).catch(() => {}));
}

function observeDeferredSections() {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.id === "wardrobe") {
        preloadImage(CONTENT.heroExpressions.proud.image).catch(() => {});
        Object.values(CONTENT.outfits).forEach((item) => preloadImage(item.image).catch(() => {}));
      }
      if (entry.target.id === "gallery") {
        CONTENT.gallery.forEach((item) => preloadImage(item.image).catch(() => {}));
      }
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "220px" });
  const wardrobe = document.querySelector("#wardrobe");
  const gallery = document.querySelector("#gallery");
  if (wardrobe) observer.observe(wardrobe);
  if (gallery) observer.observe(gallery);
}

function setupParallax() {
  if (reducedMotion.matches) return;
  elements.doorScene.addEventListener("pointermove", (event) => {
    if (doorOpened) return;
    const bounds = elements.doorScene.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    elements.heroCharacter.style.objectPosition = `${61 + horizontal * 2.4}% ${50 + vertical * 1.8}%`;
  });
  elements.doorScene.addEventListener("pointerleave", () => {
    elements.heroCharacter.style.objectPosition = "61% 50%";
  });
}

elements.heroCharacter.addEventListener("error", () => {
  elements.heroCharacter.style.opacity = "0.18";
  elements.doorStatus.innerHTML = "<span>人物插画暂时没有加载出来。</span><strong>房门和她留下的文字还在。</strong>";
}, { once: true });

elements.knockButton.addEventListener("click", openDoor);
elements.stopVoiceButton.addEventListener("click", () => stopVoice(false));
document.querySelectorAll("[data-voice]").forEach((button) => {
  button.addEventListener("click", () => playVoice(button.dataset.voice));
});
elements.outfitTabs.forEach((button) => {
  button.addEventListener("click", () => switchOutfit(button.dataset.outfit));
});
elements.outfitPrev.addEventListener("click", () => adjacentOutfit(-1));
elements.outfitNext.addEventListener("click", () => adjacentOutfit(1));
elements.secretButtons.forEach((button) => {
  button.addEventListener("click", () => discoverSecret(button));
});
elements.galleryPrev.addEventListener("click", () => switchGallery(galleryPosition - 1));
elements.galleryNext.addEventListener("click", () => switchGallery(galleryPosition + 1));
elements.fortuneButton.addEventListener("click", newFortune);

buildGalleryThumbs();
applyOutfit(state.outfit);
refreshSecrets();
setupParallax();
observeDeferredSections();
document.documentElement.dataset.js = "true";

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(preloadDeferredAssets, { timeout: 1800 });
} else {
  window.setTimeout(preloadDeferredAssets, 500);
}
