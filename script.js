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
      scene: "房门口",
      replies: [
        {
          id: "welcome-home",
          label: "认出你了",
          japanese: "お、おかえり……ノック、一回でいいから。",
          chinese: "欢、欢迎回来……敲一次就够了。",
          file: "assets/audio/v4/welcome-home.mp3",
          expression: "shy",
          reaction: "欢、欢迎回来……敲一次我就听见了。"
        },
        {
          id: "welcome-knock",
          label: "隔着门嘟囔",
          japanese: "聞こえてる……そんなに急かしたら、開けないから。",
          chinese: "我听见了……再那么催我，我就不开门了。",
          file: "assets/audio/v4/welcome-knock.mp3",
          expression: "startled",
          reaction: "再催的话……真的不开门了。"
        },
        {
          id: "welcome-close",
          label: "悄悄让开一点",
          japanese: "入ってもいいけど……静かにして。あと、近すぎるのは禁止。",
          chinese: "可以进来……但要安静。还有，不许靠得太近。",
          file: "assets/audio/v4/welcome-close.mp3",
          expression: "shy",
          reaction: "可以进来……不许突然靠近。"
        },
        {
          id: "welcome-waiting",
          label: "嘴硬地等你",
          japanese: "遅い……べ、別に待ってたわけじゃないけど。",
          chinese: "好慢……我、我又没有在等你。",
          file: "assets/audio/v4/welcome-waiting.mp3",
          expression: "proud",
          reaction: "才、才没有一直听门外的脚步声。"
        }
      ]
    },
    drawing: {
      id: "drawing",
      scene: "画桌旁",
      replies: [
        {
          id: "drawing-no-peeking",
          label: "挡住画稿",
          japanese: "まだ途中。勝手に覗いたら……追い出すから。",
          chinese: "还没画完。敢擅自偷看……就把你赶出去。",
          file: "assets/audio/v4/drawing-no-peeking.mp3",
          expression: "startled",
          reaction: "还、还在画……敢偷看就把你赶出去。"
        },
        {
          id: "drawing-stay-still",
          label: "偷偷拿你当参考",
          japanese: "動かないで。いま、手の形が難しいの。",
          chinese: "别动。我正在画……最难画的手。",
          file: "assets/audio/v4/drawing-stay-still.mp3",
          expression: "proud",
          reaction: "别动……手的形状画歪了就怪你。"
        },
        {
          id: "drawing-first-look",
          label: "答应先给你看",
          japanese: "あと一枚だけ。描けたら……最初に見せてあげる。",
          chinese: "只差一张。画好以后……第一个给你看。",
          file: "assets/audio/v4/drawing-first-look.mp3",
          expression: "shy",
          reaction: "只、只给你先看一眼。"
        },
        {
          id: "drawing-opinion",
          label: "小声讨要评价",
          japanese: "見たいなら、感想ちゃんと言って。『かわいい』だけは禁止。",
          chinese: "想看的话，就要认真说感想。只说“可爱”不算。",
          file: "assets/audio/v4/drawing-opinion.mp3",
          expression: "shy",
          reaction: "只说“可爱”不算……要说哪里画得好。"
        }
      ]
    },
    like: {
      id: "like",
      scene: "画册旁",
      replies: [
        {
          id: "like-another",
          label: "藏不住一点得意",
          japanese: "そ、そんなに好き？……じゃあ、もう一枚だけ。",
          chinese: "有、那么喜欢吗？……那就，再给你看一张。",
          file: "assets/audio/v4/like-another.mp3",
          expression: "proud",
          reaction: "只、只多给你看一张。"
        },
        {
          id: "like-really",
          label: "确认你不是哄她",
          japanese: "本当に？　お世辞だったら……もう見せないから。",
          chinese: "真的？要是客套话……以后就不给你看了。",
          file: "assets/audio/v4/like-really.mp3",
          expression: "shy",
          reaction: "不许只是哄我……我会当真的。"
        },
        {
          id: "like-again",
          label: "想再听一次",
          japanese: "褒めても何も出ない……もう一回言うなら、聞くけど。",
          chinese: "就算夸我也没有奖励……不过要再说一次，我会听。",
          file: "assets/audio/v4/like-again.mp3",
          expression: "shy",
          reaction: "再、再说一次也不是不可以。"
        },
        {
          id: "like-gift",
          label: "把画推给你",
          japanese: "これ、あげる。折ったら……もう描いてあげない。",
          chinese: "这个送给你。弄皱的话……以后就不给你画了。",
          file: "assets/audio/v4/like-gift.mp3",
          expression: "proud",
          reaction: "弄皱的话……以后真的不画给你了。"
        }
      ]
    },
    goodnight: {
      id: "goodnight",
      scene: "晚安以前",
      replies: [
        {
          id: "goodnight-together",
          label: "画师式催睡",
          japanese: "もう遅い。寝ないと、明日の線がぶれるよ。",
          chinese: "已经很晚了。不睡的话，明天画线会手抖哦。",
          file: "assets/audio/v4/goodnight-together.mp3",
          expression: "shy",
          reaction: "熬夜的话，明天连直线都画不好。"
        },
        {
          id: "goodnight-sleep",
          label: "认真催你睡觉",
          japanese: "明日も来るなら……今日はちゃんと寝て。",
          chinese: "如果明天还要来……今天就好好睡觉。",
          file: "assets/audio/v4/goodnight-sleep.mp3",
          expression: "proud",
          reaction: "不许偷偷熬夜，我会知道的。"
        },
        {
          id: "goodnight-one-minute",
          label: "舍不得赶你走",
          japanese: "電気を消したら帰って。……あと一分だけなら、いていい。",
          chinese: "关灯后就回去。……再待一分钟也可以。",
          file: "assets/audio/v4/goodnight-one-minute.mp3",
          expression: "shy",
          reaction: "只有一分钟……不许偷偷加时。"
        },
        {
          id: "goodnight-dream",
          label: "答应明天继续",
          japanese: "おやすみ。明日、続き見せてあげる……たぶん。",
          chinese: "晚安。明天给你看后续……大概。",
          file: "assets/audio/v4/goodnight-dream.mp3",
          expression: "shy",
          reaction: "明天……大概会给你看下一页。"
        }
      ]
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
      id: "bed-drawing",
      image: "assets/v4/gallery-bed-drawing.webp",
      thumb: "assets/v4/gallery-bed-drawing-thumb.webp",
      alt: "银白长发的女孩穿粉色猫耳家居服，盘腿坐在床上用数位板画画，被发现后害羞抬眼",
      title: "被抓到在床上画画",
      note: "她原本把数位板藏在膝盖上。听见你靠近，只来得及红着脸抬头：“不许笑……这里比较舒服而已。”",
      expression: "startled",
      reaction: "我、我只是觉得床上比较暖……不许笑。"
    },
    {
      id: "show-drawing",
      image: "assets/v4/gallery-show-drawing.webp",
      thumb: "assets/v4/gallery-show-drawing-thumb.webp",
      alt: "银白长发的女孩跪坐在床边，红着脸把画着可爱角色的速写本举给来访者看",
      title: "只给你看三秒",
      note: "画纸举得很认真，视线却躲到了旁边。“看、看完就要说感想……不许只点头。”",
      expression: "shy",
      reaction: "三秒……已经到了。所、所以感想呢？"
    },
    {
      id: "pillow-offer",
      image: "assets/v4/gallery-pillow-offer.webp",
      thumb: "assets/v4/gallery-pillow-offer-thumb.webp",
      alt: "银白长发的女孩穿蓝白格睡衣，抱着粉色猫咪靠枕，从靠枕后把一张小猫画递给来访者",
      title: "躲在靠枕后把画递给你",
      note: "大半张脸都藏起来了，画却认真地伸到你面前。“只、只许看画……不许一直看我。”",
      expression: "shy",
      reaction: "只许看画，不许看我……感想还是要说。"
    },
    {
      id: "desk-night",
      image: "assets/v4/gallery-desk-night.webp",
      thumb: "assets/v4/gallery-desk-night-thumb.webp",
      alt: "深夜里，银白长发的女孩趴在数位板前认真画画，桌灯照亮画稿",
      title: "认真起来就忘了害羞",
      note: "嘴上说着不许偷看，真正画起来以后，连门边的脚步声都听不见了。",
      expression: "proud",
      reaction: "这一笔很重要……等、等画完再和你说话。"
    },
    {
      id: "sketchbook-hide",
      image: "assets/v4/gallery-sketchbook-hide.webp",
      thumb: "assets/v4/gallery-sketchbook-hide-thumb.webp",
      alt: "银白长发的女孩躲在大画册后，只露出一双明亮的蓝眼睛",
      title: "被看太久就藏起来",
      note: "画册挡住了大半张脸，但那双眼睛已经把“我知道你还在看”全都说出来了。",
      expression: "startled",
      reaction: "看、看太久了……下一页要先征得同意。"
    },
    {
      id: "awaiting-praise",
      image: "assets/v4/gallery-awaiting-praise.webp",
      thumb: "assets/v4/gallery-awaiting-praise-thumb.webp",
      alt: "银白长发的女孩抱膝坐在床上，速写本朝向来访者，脸红着等待评价",
      title: "装作没有在等夸奖",
      note: "她把画留在最显眼的位置，自己却缩进了宽大的袖口里。“我、我没有催你……慢慢看也行。”",
      expression: "shy",
      reaction: "没有在等……但你可以再说具体一点。"
    },
    {
      id: "goodnight",
      image: "assets/v4/gallery-goodnight.webp",
      thumb: "assets/v4/gallery-goodnight-thumb.webp",
      alt: "月光下，银白长发的女孩蜷坐在窗边抱着猫咪玩偶，露出困倦的微笑",
      title: "今天的最后一页",
      note: "稿子保存好，窗帘留一条缝，再抱住最软的玩偶。临睡前，她还是小声补了一句：“明天……也可以来。”",
      expression: "shy",
      reaction: "明天再翻一页……今天要好好睡觉。"
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
const lastVoiceReplies = new Map();
const voiceReplyQueues = new Map();

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

function shuffledReplyIndexes(length) {
  const indexes = Array.from({ length }, (_, index) => index);
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return indexes;
}

function chooseVoiceReply(line) {
  let queue = voiceReplyQueues.get(line.id);
  if (!queue?.length) {
    queue = shuffledReplyIndexes(line.replies.length);
    const previous = lastVoiceReplies.get(line.id);
    const nextIndex = queue.length - 1;
    if (queue.length > 1 && queue[nextIndex] === previous) {
      const swapIndex = queue.findIndex((index) => index !== previous);
      [queue[nextIndex], queue[swapIndex]] = [queue[swapIndex], queue[nextIndex]];
    }
  }
  const replyIndex = queue.pop();
  voiceReplyQueues.set(line.id, queue);
  lastVoiceReplies.set(line.id, replyIndex);
  return line.replies[replyIndex];
}

async function playVoice(id) {
  const line = CONTENT.voiceLines[id];
  if (!line) return;
  const reply = chooseVoiceReply(line);

  stopVoice(true, true);
  const sequence = voiceSequence;
  elements.subtitleScene.textContent = `${line.scene} · ${reply.label}`;
  elements.subtitleJapanese.textContent = reply.japanese;
  elements.subtitleChinese.textContent = reply.chinese;
  setHeroExpression(reply.expression);
  updateReaction({ expression: reply.expression, label: `她小声回答 · ${reply.label}`, text: reply.reaction });
  showFeedback(true);

  voicePlayer.src = reply.file;
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
    const current = CONTENT.gallery[normalized];
    updateReaction({ expression: current.expression, label: "这一页还没看完", text: current.reaction }, false);
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
    if (announce) updateReaction({ expression: item.expression, label: `画册 · ${item.title}`, text: item.reaction });
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
