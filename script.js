"use strict";

function v18Portrait(name) {
  return {
    image: `assets/v18/master/${name}-4k.webp`,
    medium: `assets/v18/${name}-1440.webp`,
    small: `assets/v18/${name}-720.webp`,
    width: 3072,
    mediumWidth: 1440,
    smallWidth: 720
  };
}

function v18Scene(name) {
  return {
    image: `assets/v18/master/${name}-4k.webp`,
    medium: `assets/v18/${name}-1440.webp`,
    small: `assets/v18/${name}-720.webp`,
    thumb: `assets/v18/${name}-480.webp`,
    width: 3840,
    mediumWidth: 1440,
    smallWidth: 720
  };
}

function v19Portrait(name) {
  return {
    image: `assets/v19/master/${name}-4k.webp`,
    medium: `assets/v19/${name}-1440.webp`,
    small: `assets/v19/${name}-720.webp`,
    width: 3072,
    mediumWidth: 1440,
    smallWidth: 720
  };
}

function v19Scene(name) {
  return {
    image: `assets/v19/master/${name}-4k.webp`,
    medium: `assets/v19/${name}-1440.webp`,
    small: `assets/v19/${name}-720.webp`,
    thumb: `assets/v19/${name}-480.webp`,
    width: 3840,
    mediumWidth: 1440,
    smallWidth: 720
  };
}

const CONTENT = {
  cinematicScenes: [
    {
      id: "door",
      sectionId: "cinematic-door",
      label: "第一幕 · 房门",
      shortLine: "她听见了，却还在确认是不是你。",
      detailsLabel: "展开门口原稿",
      frameKind: "portrait",
      frames: [
        { id: "door-peek", at: 0, label: "安静偷看", ...v19Portrait("door-peek"), alt: "纱雾从半掩的卧室门后安静偷看" },
        { id: "door-listen", at: 0.28, label: "侧耳确认", ...v19Portrait("door-listen"), alt: "纱雾贴近门边侧耳确认来访者" },
        { id: "door-startled", at: 0.58, label: "吓了一跳", ...v19Portrait("door-startled"), alt: "敲门声响起时纱雾睁大蓝眼睛轻轻受惊" },
        { id: "door-open-smile", at: 0.86, label: "认出你了", ...v19Portrait("door-open-smile"), alt: "纱雾打开房门后脸红着露出安心微笑" }
      ],
      camera: {
        desktop: [{ x: 3, y: -2, scale: 1.11 }, { x: -1, y: -3, scale: 1.16 }, { x: -2, y: -1, scale: 1.1 }, { x: 1, y: 0, scale: 1.04 }],
        mobile: [{ x: 4, y: -1, scale: 1.16 }, { x: 1, y: -2, scale: 1.19 }, { x: -2, y: 0, scale: 1.13 }, { x: 0, y: 0, scale: 1.07 }]
      },
      inspectFrameId: "door-peek",
      transition: "door-edge",
      characterVoiceId: "door-closer",
      hotspots: [
        { id: "door-panel", label: "轻敲木门", desktopPosition: { x: 20, y: 42 }, mobilePosition: { x: 18, y: 45 }, reactionFrame: "door-listen", voiceId: "door-knock-wait", foleyId: "door-knock-soft" },
        { id: "door-handle", label: "轻轻转动门把", desktopPosition: { x: 27, y: 71 }, mobilePosition: { x: 27, y: 71 }, reactionFrame: "door-startled", voiceId: "door-handle", foleyId: "door-handle-turn" },
        { id: "door-gap", label: "看看亮起的门缝", desktopPosition: { x: 35, y: 27 }, mobilePosition: { x: 35, y: 27 }, reactionFrame: "door-open-smile", voiceId: "door-startled", foleyId: "door-open-gentle" }
      ]
    },
    {
      id: "room",
      sectionId: "cinematic-room",
      label: "第二幕 · 房间",
      shortLine: "笔尖没有停，旁边的椅子却悄悄空出来。",
      detailsLabel: "展开房间原稿",
      frameKind: "scene",
      frames: [
        { id: "room-drawing", at: 0, label: "继续画画", ...v19Scene("room-drawing"), alt: "纱雾趴在数位板前认真画画" },
        { id: "room-stops-pen", at: 0.28, label: "笔尖停住", ...v19Scene("room-stops-pen"), alt: "纱雾察觉到你以后暂时停住数位笔" },
        { id: "room-glances-over", at: 0.58, label: "悄悄回望", ...v19Scene("room-glances-over"), alt: "纱雾从银白长发间害羞地回头看你" },
        { id: "room-invites-seat", at: 0.86, label: "空出椅子", ...v19Scene("room-invites-seat"), alt: "纱雾把旁边的椅子轻轻推出来邀请你坐下" }
      ],
      camera: {
        desktop: [{ x: 0, y: 2, scale: 1.03 }, { x: -3, y: 2, scale: 1.06 }, { x: 3, y: -1, scale: 1.08 }, { x: -1, y: 1, scale: 1.03 }],
        mobile: [{ x: -4, y: 2, scale: 1.08 }, { x: -5, y: 3, scale: 1.1 }, { x: 4, y: -1, scale: 1.12 }, { x: 1, y: 1, scale: 1.08 }]
      },
      inspectFrameId: "room-invites-seat",
      transition: "tablet-edge",
      characterVoiceId: "room-stay",
      hotspots: [
        { id: "room-pen", label: "听数位笔划过板面", desktopPosition: { x: 38, y: 65 }, mobilePosition: { x: 38, y: 65 }, reactionFrame: "room-stops-pen", voiceId: "room-pen-tip", foleyId: "room-stylus-glide" },
        { id: "room-chair", label: "把椅子轻轻挪近", desktopPosition: { x: 78, y: 55 }, mobilePosition: { x: 78, y: 55 }, reactionFrame: "room-invites-seat", voiceId: "room-chair", foleyId: "room-chair-slide" },
        { id: "room-curtain", label: "替她拉上一点窗帘", desktopPosition: { x: 76, y: 22 }, mobilePosition: { x: 76, y: 22 }, reactionFrame: "room-glances-over", voiceId: "room-curtain", foleyId: "room-curtain-slide" }
      ]
    },
    {
      id: "secrets",
      sectionId: "cinematic-secrets",
      label: "第三幕 · 桌面秘密",
      shortLine: "每件被收好的东西，都比她更会说实话。",
      detailsLabel: "展开秘密原稿",
      frameKind: "scene",
      frames: [
        { id: "secrets-caught", at: 0, label: "被她发现", ...v19Scene("secrets-caught"), alt: "纱雾发现你在看桌上的耳机和稿纸" },
        { id: "secrets-protects-draft", at: 0.46, label: "护住草稿", ...v19Scene("secrets-protects-draft"), alt: "纱雾慌忙用袖口护住还没完成的草稿" },
        { id: "secrets-opens-drawer", at: 0.82, label: "一起开抽屉", ...v19Scene("secrets-opens-drawer"), alt: "纱雾红着脸陪你打开木桌抽屉" }
      ],
      camera: {
        desktop: [{ x: -2, y: 2, scale: 1.04 }, { x: 3, y: 4, scale: 1.08 }, { x: -3, y: 3, scale: 1.07 }],
        mobile: [{ x: -4, y: 3, scale: 1.08 }, { x: 5, y: 4, scale: 1.12 }, { x: -5, y: 4, scale: 1.1 }]
      },
      inspectFrameId: "secrets-opens-drawer",
      transition: "drawer-edge",
      characterVoiceId: "secrets-nothing-weird",
      hotspots: [
        { id: "secrets-headphones", label: "把耳机放回原来的方向", desktopPosition: { x: 8, y: 34 }, mobilePosition: { x: 8, y: 34 }, reactionFrame: "secrets-caught", voiceId: "secrets-headphones", foleyId: "secrets-headphones-set" },
        { id: "secrets-draft", label: "掀起草稿的一角", desktopPosition: { x: 24, y: 82 }, mobilePosition: { x: 24, y: 82 }, reactionFrame: "secrets-protects-draft", voiceId: "secrets-draft", foleyId: "secrets-paper-lift" },
        { id: "secrets-drawer", label: "碰一下抽屉锁扣", desktopPosition: { x: 87, y: 91 }, mobilePosition: { x: 87, y: 91 }, reactionFrame: "secrets-opens-drawer", voiceId: "secrets-drawer", foleyId: "secrets-drawer-latch" }
      ]
    },
    {
      id: "wardrobe",
      sectionId: "cinematic-wardrobe",
      label: "第四幕 · 衣橱",
      shortLine: "她说只是试一下，却一直等你点头。",
      detailsLabel: "展开衣橱原稿",
      frameKind: "portrait",
      frames: [
        { id: "wardrobe-hides-sleeves", at: 0, label: "袖口藏手", ...v19Portrait("wardrobe-hides-sleeves"), alt: "纱雾害羞地把双手藏进长长的袖口" },
        { id: "wardrobe-holds-two", at: 0.28, label: "举起两套", ...v19Portrait("wardrobe-holds-two"), alt: "纱雾举起轮廓不同的两套衣服等你挑选" },
        { id: "wardrobe-adjusts-bow", at: 0.58, label: "整理蝴蝶结", ...v19Portrait("wardrobe-adjusts-bow"), alt: "纱雾低头认真调整胸前的小蝴蝶结" },
        { id: "wardrobe-chosen-shy", at: 0.86, label: "选好以后", ...v19Portrait("wardrobe-chosen-shy"), alt: "纱雾仍穿粉色家居服，抱着选中的薄荷猫耳外套害羞等你回应" }
      ],
      camera: {
        desktop: [{ x: 0, y: 6, scale: 1.01 }, { x: 0, y: 6, scale: 1.02 }, { x: 0, y: 7, scale: 1.03 }, { x: 0, y: 6, scale: 1.02 }],
        mobile: [{ x: 0, y: 7, scale: 1.03 }, { x: 0, y: 7, scale: 1.04 }, { x: 0, y: 8, scale: 1.05 }, { x: 0, y: 7, scale: 1.04 }]
      },
      inspectFrameId: "wardrobe-holds-two",
      transition: "fabric-edge",
      characterVoiceId: "wardrobe-choice-wait",
      hotspots: [
        { id: "wardrobe-hanger", label: "轻轻滑动衣架", desktopPosition: { x: 27, y: 29 }, mobilePosition: { x: 27, y: 29 }, reactionFrame: "wardrobe-holds-two", voiceId: "wardrobe-two-outfits", foleyId: "wardrobe-hanger-slide" },
        { id: "wardrobe-sleeve", label: "摸摸藏住手的袖口", desktopPosition: { x: 22, y: 57 }, mobilePosition: { x: 22, y: 57 }, reactionFrame: "wardrobe-hides-sleeves", voiceId: "wardrobe-sleeves", foleyId: "wardrobe-sleeve-rustle" },
        { id: "wardrobe-ribbon", label: "帮她看蝴蝶结有没有歪", desktopPosition: { x: 69, y: 44 }, mobilePosition: { x: 69, y: 44 }, reactionFrame: "wardrobe-adjusts-bow", voiceId: "wardrobe-ribbon", foleyId: "wardrobe-ribbon-rustle" }
      ]
    },
    {
      id: "gallery",
      sectionId: "cinematic-gallery",
      label: "第五幕 · 画册",
      shortLine: "画册越往后，她藏起来的速度越慢。",
      detailsLabel: "展开画册原稿",
      frameKind: "scene",
      frames: [
        { id: "gallery-hides-book", at: 0, label: "藏起画册", ...v19Scene("gallery-hides-book"), alt: "纱雾把大画册挡在脸前只露出一点银白长发" },
        { id: "gallery-peeks-over", at: 0.46, label: "从书后偷看", ...v19Scene("gallery-peeks-over"), alt: "纱雾从画册上方露出蓝眼睛观察你的反应" },
        { id: "gallery-pushes-book", at: 0.82, label: "推近最后一页", ...v19Scene("gallery-pushes-book"), alt: "纱雾红着脸把打开的画册轻轻推到你面前" }
      ],
      camera: {
        desktop: [{ x: 1, y: 1, scale: 1.04 }, { x: 0, y: -2, scale: 1.08 }, { x: 0, y: 3, scale: 1.07 }],
        mobile: [{ x: 0, y: 1, scale: 1.08 }, { x: 0, y: -3, scale: 1.12 }, { x: 0, y: 4, scale: 1.1 }]
      },
      inspectFrameId: "gallery-pushes-book",
      transition: "paper-edge",
      characterVoiceId: "gallery-praise",
      hotspots: [
        { id: "gallery-cover", label: "替她托住画册封面", desktopPosition: { x: 34, y: 68 }, mobilePosition: { x: 34, y: 68 }, reactionFrame: "gallery-hides-book", voiceId: "gallery-first-page", foleyId: "gallery-book-open" },
        { id: "gallery-page", label: "慢慢翻过一页", desktopPosition: { x: 57, y: 55 }, mobilePosition: { x: 57, y: 55 }, reactionFrame: "gallery-peeks-over", voiceId: "gallery-turn-slow", foleyId: "gallery-page-turn" },
        { id: "gallery-picture", label: "把画纸轻轻滑近", desktopPosition: { x: 55, y: 74 }, mobilePosition: { x: 55, y: 74 }, reactionFrame: "gallery-pushes-book", voiceId: "gallery-close-look", foleyId: "gallery-photo-slide" }
      ]
    },
    {
      id: "drawing",
      sectionId: "cinematic-drawing",
      label: "第六幕 · 一起画",
      shortLine: "这次，她没有把旁边的位置收回去。",
      detailsLabel: "展开共同创作原稿",
      frameKind: "scene",
      frames: [
        { id: "drawing-focus", at: 0, label: "认真收线", ...v19Scene("drawing-focus"), alt: "纱雾低头专心画下最后几条线" },
        { id: "drawing-blink", at: 0.2, label: "眨一下眼", ...v19Scene("drawing-blink"), alt: "画到一半的纱雾轻轻眨眼休息" },
        { id: "drawing-covers-page", at: 0.42, label: "慌忙遮画", ...v19Scene("drawing-covers-page"), alt: "发现你偷看后纱雾红着脸用稿纸遮住画面" },
        { id: "drawing-shy-pause", at: 0.66, label: "害羞停笔", ...v19Scene("drawing-shy-pause"), alt: "纱雾握着数位笔害羞地停下来确认你还在" },
        { id: "drawing-reveal", at: 0.86, label: "递出完成稿", ...v19Scene("drawing-reveal"), alt: "纱雾把刚完成的画推到你面前等候感想" }
      ],
      camera: {
        desktop: [{ x: -2, y: 3, scale: 1.05 }, { x: 1, y: -1, scale: 1.07 }, { x: 3, y: 2, scale: 1.07 }, { x: 1, y: -1, scale: 1.06 }, { x: 0, y: 2, scale: 1.04 }],
        mobile: [{ x: -4, y: 4, scale: 1.09 }, { x: 3, y: -2, scale: 1.1 }, { x: 4, y: 3, scale: 1.1 }, { x: 2, y: -1, scale: 1.09 }, { x: 0, y: 3, scale: 1.07 }]
      },
      inspectFrameId: "drawing-covers-page",
      transition: "drawing-paper-edge",
      characterVoiceId: "drawing-you-are-there",
      hotspots: [
        { id: "drawing-pen", label: "听她再画一条短线", desktopPosition: { x: 43, y: 58 }, mobilePosition: { x: 43, y: 58 }, reactionFrame: "drawing-focus", voiceId: "drawing-one-line", foleyId: "drawing-stylus-line" },
        { id: "drawing-cover", label: "轻碰遮住画面的稿纸", desktopPosition: { x: 58, y: 68 }, mobilePosition: { x: 58, y: 68 }, reactionFrame: "drawing-covers-page", voiceId: "drawing-peek-again", foleyId: "drawing-paper-cover" },
        { id: "drawing-sheet", label: "接住推近的完成稿", desktopPosition: { x: 69, y: 76 }, mobilePosition: { x: 69, y: 76 }, reactionFrame: "drawing-reveal", voiceId: "drawing-first-view", foleyId: "drawing-sheet-push" }
      ]
    },
    {
      id: "goodnight",
      sectionId: "cinematic-goodnight",
      label: "第七幕 · 晚安",
      shortLine: "门会合上，但她把明天留了一条缝。",
      detailsLabel: "展开晚安原稿",
      frameKind: "scene",
      frames: [
        { id: "goodnight-hug", at: 0, label: "抱紧玩偶", ...v19Scene("goodnight-hug"), alt: "纱雾在夜晚床边蜷坐着抱紧猫咪玩偶" },
        { id: "goodnight-yawn", at: 0.46, label: "困得打呵欠", ...v19Scene("goodnight-yawn"), alt: "纱雾抱着猫咪玩偶困倦地打了一个小呵欠" },
        { id: "goodnight-wave", at: 0.82, label: "门缝里挥手", ...v19Scene("goodnight-wave"), alt: "月光下纱雾从将要合上的房门边轻轻挥手" }
      ],
      camera: {
        desktop: [{ x: 2, y: 2, scale: 1.04 }, { x: 0, y: 2, scale: 1.07 }, { x: -2, y: 1, scale: 1.04 }],
        mobile: [{ x: 4, y: 3, scale: 1.08 }, { x: 0, y: 3, scale: 1.1 }, { x: -3, y: 2, scale: 1.08 }]
      },
      inspectFrameId: "goodnight-wave",
      transition: "night-window-edge",
      characterVoiceId: "goodnight-sleepy",
      hotspots: [
        { id: "goodnight-plush", label: "轻轻按一下猫咪玩偶", desktopPosition: { x: 54, y: 48 }, mobilePosition: { x: 54, y: 48 }, reactionFrame: "goodnight-hug", voiceId: "goodnight-plush", foleyId: "goodnight-plush-squeeze" },
        { id: "goodnight-book", label: "替她合上怀里的书", desktopPosition: { x: 52, y: 63 }, mobilePosition: { x: 52, y: 63 }, reactionFrame: "goodnight-yawn", voiceId: "goodnight-book", foleyId: "goodnight-book-close" },
        { id: "goodnight-door", label: "把房门轻轻合上", desktopPosition: { x: 34, y: 75 }, mobilePosition: { x: 34, y: 75 }, reactionFrame: "goodnight-wave", voiceId: "goodnight-knock-next", foleyId: "goodnight-latch" }
      ]
    }
  ],
  cinematicVoices: {
    "door-knock-wait": { id: "door-knock-wait", scene: "房门", label: "听见轻敲", japanese: "……ちゃんとノックしてくれたんだ。じゃあ、少しだけ待って。", chinese: "……你有好好敲门。那就稍微等一下。", file: "assets/audio/v19/voice/door-knock-wait.mp3", expression: "shy", reaction: "听见了……再等我一下。", frame: "door-listen" },
    "door-startled": { id: "door-startled", scene: "房门", label: "只是一点受惊", japanese: "び、びっくりしただけ。怖がってなんかないから。", chinese: "只、只是吓了一跳。我才没有害怕。", file: "assets/audio/v19/voice/door-startled.mp3", expression: "startled", reaction: "只、只是吓了一小跳。", frame: "door-startled" },
    "door-handle": { id: "door-handle", scene: "房门", label: "准备开门", japanese: "ドアノブ、そんなに見ないで。今、開けるから。", chinese: "别一直盯着门把手。我现在就开。", file: "assets/audio/v19/voice/door-handle.mp3", expression: "startled", reaction: "别盯着门把手啦……马上就开。", frame: "door-startled" },
    "door-closer": { id: "door-closer", scene: "房门", label: "允许靠近", japanese: "今日は……いつもより、ちょっとだけ近くてもいいよ。", chinese: "今天……可以比平时再靠近一点点。", file: "assets/audio/v19/voice/door-closer.mp3", expression: "shy", reaction: "只可以……比平时近一点点。", frame: "door-open-smile" },
    "room-chair": { id: "room-chair", scene: "房间", label: "空出的椅子", japanese: "そこ、椅子を少しだけ空けておいたの。", chinese: "那里……我稍微把椅子空出来了。", file: "assets/audio/v19/voice/room-chair.mp3", expression: "shy", reaction: "椅子只是刚好空着……坐吧。", frame: "room-invites-seat" },
    "room-pen-tip": { id: "room-pen-tip", scene: "房间", label: "笔尖规矩", japanese: "ペン先を触るなら、線がずれないようにね。", chinese: "要碰笔尖的话，可别让线条歪掉。", file: "assets/audio/v19/voice/room-pen-tip.mp3", expression: "proud", reaction: "线条歪掉的话，要陪我重画。", frame: "room-stops-pen" },
    "room-curtain": { id: "room-curtain", scene: "房间", label: "窗帘光线", japanese: "カーテン、少しだけ閉めて。画面が見やすくなるから。", chinese: "把窗帘稍微拉上一点，这样屏幕会更清楚。", file: "assets/audio/v19/voice/room-curtain.mp3", expression: "peek", reaction: "再拉上一点点……这样刚好。", frame: "room-glances-over" },
    "room-stay": { id: "room-stay", scene: "房间", label: "安静坐在身边", japanese: "見てるだけなら……静かに隣にいてもいいよ。", chinese: "只是看的话……可以安静待在旁边。", file: "assets/audio/v19/voice/room-stay.mp3", expression: "shy", reaction: "不说话也没关系……我知道你在。", frame: "room-invites-seat" },
    "secrets-draft": { id: "secrets-draft", scene: "桌面秘密", label: "还没完成的草稿", japanese: "そ、それは下書き。まだ見せる予定じゃなかったの。", chinese: "那、那只是草稿。我本来没打算给你看的。", file: "assets/audio/v19/voice/secrets-draft.mp3", expression: "startled", reaction: "还没画好……不许看太久。", frame: "secrets-protects-draft" },
    "secrets-headphones": { id: "secrets-headphones", scene: "桌面秘密", label: "耳机的方向", japanese: "ヘッドホンの向き？　いつも同じじゃないと落ち着かないだけ。", chinese: "耳机的方向？只是每次不一样我就静不下来。", file: "assets/audio/v19/voice/secrets-headphones.mp3", expression: "proud", reaction: "只是摆整齐以后比较安心。", frame: "secrets-caught" },
    "secrets-drawer": { id: "secrets-drawer", scene: "桌面秘密", label: "一起看抽屉", japanese: "引き出しは……開けるなら、私も一緒に見る。", chinese: "抽屉……要打开的话，我也一起看。", file: "assets/audio/v19/voice/secrets-drawer.mp3", expression: "shy", reaction: "要开的话……手不要松开。", frame: "secrets-opens-drawer" },
    "secrets-nothing-weird": { id: "secrets-nothing-weird", scene: "桌面秘密", label: "没有奇怪东西", japanese: "秘密って言っても、変なものは入ってないからね。", chinese: "虽说是秘密，里面可没有奇怪的东西。", file: "assets/audio/v19/voice/secrets-nothing-weird.mp3", expression: "startled", reaction: "真、真的没有奇怪的东西。", frame: "secrets-caught" },
    "wardrobe-sleeves": { id: "wardrobe-sleeves", scene: "衣橱", label: "喜欢长袖", japanese: "この袖、長すぎる？　でも、手が隠れるから好き。", chinese: "这袖子太长了吗？可我喜欢它能遮住手。", file: "assets/audio/v19/voice/wardrobe-sleeves.mp3", expression: "shy", reaction: "手藏起来的话……就没那么紧张。", frame: "wardrobe-hides-sleeves" },
    "wardrobe-ribbon": { id: "wardrobe-ribbon", scene: "衣橱", label: "蝴蝶结检查", japanese: "リボン、曲がってないかだけ見て。", chinese: "只帮我看看蝴蝶结有没有歪。", file: "assets/audio/v19/voice/wardrobe-ribbon.mp3", expression: "peek", reaction: "只看蝴蝶结……别看别的地方。", frame: "wardrobe-adjusts-bow" },
    "wardrobe-two-outfits": { id: "wardrobe-two-outfits", scene: "衣橱", label: "同时比较两套", japanese: "二着いっぺんに比べるの、ちょっと恥ずかしい……。", chinese: "一次比较两套，稍微有点害羞……", file: "assets/audio/v19/voice/wardrobe-two-outfits.mp3", expression: "startled", reaction: "两套一起举着……好害羞。", frame: "wardrobe-holds-two" },
    "wardrobe-choice-wait": { id: "wardrobe-choice-wait", scene: "衣橱", label: "一直等你选择", japanese: "き、決めたなら早く言って。ずっと待ってるの、もっと恥ずかしいから。", chinese: "选、选好了就快点说。一直等着更让人害羞。", file: "assets/audio/v19/voice/wardrobe-choice-wait.mp3", expression: "startled", reaction: "快一点告诉我……我一直在等。", frame: "wardrobe-chosen-shy" },
    "gallery-first-page": { id: "gallery-first-page", scene: "画册", label: "第一页的线", japanese: "最初のページは、まだ線が少し震えてるの。", chinese: "第一页的线条还有一点抖。", file: "assets/audio/v19/voice/gallery-first-page.mp3", expression: "peek", reaction: "第一页……不要笑我的线。", frame: "gallery-hides-book" },
    "gallery-close-look": { id: "gallery-close-look", scene: "画册", label: "靠近看的约定", japanese: "その画、近くで見るなら……感想もちゃんと言って。", chinese: "要靠近看那张画……也要认真说感想。", file: "assets/audio/v19/voice/gallery-close-look.mp3", expression: "shy", reaction: "看完要认真告诉我感想。", frame: "gallery-peeks-over" },
    "gallery-turn-slow": { id: "gallery-turn-slow", scene: "画册", label: "慢慢翻页", japanese: "ページ、ゆっくりめくって。角が折れたら困るから。", chinese: "慢慢翻页。折到书角我会很困扰。", file: "assets/audio/v19/voice/gallery-turn-slow.mp3", expression: "proud", reaction: "书角不可以折到。", frame: "gallery-peeks-over" },
    "gallery-praise": { id: "gallery-praise", scene: "画册", label: "可以稍微夸奖", japanese: "最後まで見たの？　……じゃあ、少しくらい褒めてもいいよ。", chinese: "看到最后了吗？……那稍微夸一下也可以。", file: "assets/audio/v19/voice/gallery-praise.mp3", expression: "proud", reaction: "只允许……稍微夸一下。", frame: "gallery-pushes-book" },
    "drawing-one-line": { id: "drawing-one-line", scene: "一起画", label: "再画一条线", japanese: "今いいところだから、あと一本だけ線を引かせて。", chinese: "正画到关键地方，让我再画一条线。", file: "assets/audio/v19/voice/drawing-one-line.mp3", expression: "proud", reaction: "就最后一条线……这次是真的。", frame: "drawing-focus" },
    "drawing-peek-again": { id: "drawing-peek-again", scene: "一起画", label: "又被偷看", japanese: "また覗いた。……そんなに気になるの？", chinese: "又偷看。……就这么在意吗？", file: "assets/audio/v19/voice/drawing-peek-again.mp3", expression: "startled", reaction: "又偷看……有那么在意吗？", frame: "drawing-covers-page" },
    "drawing-you-are-there": { id: "drawing-you-are-there", scene: "一起画", label: "知道你还在", japanese: "何も言わなくても、そこにいるのは分かってる。", chinese: "就算什么都不说，我也知道你在那里。", file: "assets/audio/v19/voice/drawing-you-are-there.mp3", expression: "shy", reaction: "不用说话……我知道你在。", frame: "drawing-shy-pause" },
    "drawing-first-view": { id: "drawing-first-view", scene: "一起画", label: "第一个给你看", japanese: "できた。最初に見せるのは……今日は、あなたでいい。", chinese: "画好了。今天第一个给你看的人……可以是你。", file: "assets/audio/v19/voice/drawing-first-view.mp3", expression: "proud", reaction: "今天……先给你看。", frame: "drawing-reveal" },
    "goodnight-sleepy": { id: "goodnight-sleepy", scene: "晚安", label: "眼睛要合上了", japanese: "もう少し起きていたいけど、目が勝手に閉じそう……。", chinese: "还想再醒一会儿，可眼睛好像要自己闭上了……", file: "assets/audio/v19/voice/goodnight-sleepy.mp3", expression: "shy", reaction: "眼睛好像……自己要合上了。", frame: "goodnight-yawn" },
    "goodnight-plush": { id: "goodnight-plush", scene: "晚安", label: "不能少的玩偶", japanese: "ぬいぐるみ、ちゃんと返して。これがないと眠れないの。", chinese: "玩偶要好好还给我。没有它我睡不着。", file: "assets/audio/v19/voice/goodnight-plush.mp3", expression: "startled", reaction: "玩偶要还给我……睡觉需要它。", frame: "goodnight-hug" },
    "goodnight-book": { id: "goodnight-book", scene: "晚安", label: "下次再看", japanese: "本はここに置いておく。続きは、また今度。", chinese: "书就放在这里。下次再看后面。", file: "assets/audio/v19/voice/goodnight-book.mp3", expression: "peek", reaction: "书签放好了……下次继续。", frame: "goodnight-yawn" },
    "goodnight-knock-next": { id: "goodnight-knock-next", scene: "晚安", label: "下次也要敲门", japanese: "おやすみ。次も……ちゃんとノックしてね。", chinese: "晚安。下次也要……好好敲门哦。", file: "assets/audio/v19/voice/goodnight-knock-next.mp3", expression: "shy", reaction: "晚安……下次也要好好敲门。", frame: "goodnight-wave" }
  },
  cinematicFoley: {
    "door-knock-soft": { id: "door-knock-soft", label: "轻敲木门", file: "assets/audio/v19/foley/door-knock-soft.mp3" },
    "door-handle-turn": { id: "door-handle-turn", label: "门把转动", file: "assets/audio/v19/foley/door-handle-turn.mp3" },
    "door-open-gentle": { id: "door-open-gentle", label: "木门轻开", file: "assets/audio/v19/foley/door-open-gentle.mp3" },
    "room-stylus-glide": { id: "room-stylus-glide", label: "笔尖划过数位板", file: "assets/audio/v19/foley/room-stylus-glide.mp3" },
    "room-chair-slide": { id: "room-chair-slide", label: "椅子轻移", file: "assets/audio/v19/foley/room-chair-slide.mp3" },
    "room-curtain-slide": { id: "room-curtain-slide", label: "窗帘布料滑动", file: "assets/audio/v19/foley/room-curtain-slide.mp3" },
    "secrets-headphones-set": { id: "secrets-headphones-set", label: "耳机放下", file: "assets/audio/v19/foley/secrets-headphones-set.mp3" },
    "secrets-paper-lift": { id: "secrets-paper-lift", label: "稿纸掀起", file: "assets/audio/v19/foley/secrets-paper-lift.mp3" },
    "secrets-drawer-latch": { id: "secrets-drawer-latch", label: "抽屉锁扣", file: "assets/audio/v19/foley/secrets-drawer-latch.mp3" },
    "wardrobe-hanger-slide": { id: "wardrobe-hanger-slide", label: "衣架滑动", file: "assets/audio/v19/foley/wardrobe-hanger-slide.mp3" },
    "wardrobe-sleeve-rustle": { id: "wardrobe-sleeve-rustle", label: "袖口布料", file: "assets/audio/v19/foley/wardrobe-sleeve-rustle.mp3" },
    "wardrobe-ribbon-rustle": { id: "wardrobe-ribbon-rustle", label: "丝带轻响", file: "assets/audio/v19/foley/wardrobe-ribbon-rustle.mp3" },
    "gallery-book-open": { id: "gallery-book-open", label: "画册打开", file: "assets/audio/v19/foley/gallery-book-open.mp3" },
    "gallery-page-turn": { id: "gallery-page-turn", label: "单页翻动", file: "assets/audio/v19/foley/gallery-page-turn.mp3" },
    "gallery-photo-slide": { id: "gallery-photo-slide", label: "画纸滑动", file: "assets/audio/v19/foley/gallery-photo-slide.mp3" },
    "drawing-stylus-line": { id: "drawing-stylus-line", label: "数位笔短线", file: "assets/audio/v19/foley/drawing-stylus-line.mp3" },
    "drawing-paper-cover": { id: "drawing-paper-cover", label: "稿纸盖住", file: "assets/audio/v19/foley/drawing-paper-cover.mp3" },
    "drawing-sheet-push": { id: "drawing-sheet-push", label: "画纸推近", file: "assets/audio/v19/foley/drawing-sheet-push.mp3" },
    "goodnight-plush-squeeze": { id: "goodnight-plush-squeeze", label: "玩偶轻压", file: "assets/audio/v19/foley/goodnight-plush-squeeze.mp3" },
    "goodnight-book-close": { id: "goodnight-book-close", label: "书本合上", file: "assets/audio/v19/foley/goodnight-book-close.mp3" },
    "goodnight-latch": { id: "goodnight-latch", label: "房门锁舌轻合", file: "assets/audio/v19/foley/goodnight-latch.mp3" }
  },
  heroExpressions: {
    peek: {
      ...v19Portrait("door-peek"),
      alt: "银白长发、蓝眼睛的纱雾穿着粉色猫耳家居服，握着半掩的卧室门安静偷看"
    },
    startled: {
      ...v19Portrait("door-startled"),
      alt: "听见敲门后，纱雾睁大蓝眼睛露出突然受惊的可爱表情"
    },
    shy: {
      ...v19Portrait("door-open-smile"),
      alt: "认出来访者后，纱雾握着门边脸红地害羞微笑"
    },
    proud: {
      ...v19Portrait("door-open-smile"),
      alt: "纱雾握着门边，露出害羞又有一点得意的可爱微笑"
    }
  },
  outfits: {
    home: {
      name: "宽松运动家居服",
      ...v18Portrait("outfit-home"),
      alt: "纱雾穿宽松粉色运动外套和奶油色运动裤，坐在床边害羞微笑",
      description: "袖子要够长，裤脚要够软。窝在房间里画画的时候，这样才最安心。",
      time: "午后 15:20",
      expression: "shy",
      reaction: "这套……最不会分心。"
    },
    artist: {
      name: "格纹画稿睡衣",
      ...v18Portrait("outfit-artist-night"),
      alt: "纱雾穿蓝白格长袖睡衣和长裤，戴着绘图手套在月光下认真画画",
      description: "蓝白格睡衣、绘图手套和不会掉下去的软拖鞋——熬夜画稿模式，准备完成。",
      time: "深夜 00:47",
      expression: "proud",
      reaction: "今、今晚一定画得完。"
    },
    outing: {
      name: "薄荷水手外套",
      ...v18Portrait("outfit-outing-sailor"),
      alt: "纱雾穿水手领裙装、薄荷色针织外套和深色长袜，抱着棕色书包站在门口",
      description: "水手领、厚厚的薄荷针织和能挡住紧张的书包。真的要出门时，会在门口多站一会儿。",
      time: "早上 08:10",
      expression: "startled",
      reaction: "外、外面的人不会很多吧？"
    },
    bedtime: {
      name: "草莓睡前服",
      ...v18Portrait("outfit-bedtime"),
      alt: "深夜里，纱雾穿奶油粉草莓长袖睡衣和长裤，侧躺在床上用数位板继续画画",
      description: "已经换好睡衣，却还舍不得放下最后一笔。数位板垫在枕头上，画到眼睛发困才肯保存。",
      time: "凌晨 01:13",
      expression: "shy",
      reaction: "再画这一小块就睡……真、真的。"
    },
    hooded: {
      name: "猫耳连帽毯",
      ...v18Portrait("outfit-hooded-blanket"),
      alt: "雨夜里，纱雾裹着薄荷灰猫耳连帽毯，穿长裤和暖袜坐在地毯上认真校对画稿",
      description: "帽子拉低一点，袖子再长一点，就能把雨声和截稿压力都挡在外面；该改的线却一笔也不会漏。",
      time: "雨夜 21:36",
      expression: "proud",
      reaction: "这样就不冷……也不会被看到太多。"
    }
  },
  visitStages: [
    {
      id: "first",
      maxVisits: 1,
      note: "第一次站在门外",
      hanger: "正在画画",
      lead: "门里传来很轻的脚步声。",
      quote: "“先敲门……我才会开。”",
      reaction: "……门外是谁？",
      openLead: "她认出来访者以后，脸更红了。",
      openQuote: "“只、只可以安静地待一会儿。”",
      openReaction: "只可以安静地待一会儿。",
      secretMessage: "“谢谢你没有催我开门。下次……也可以来。”"
    },
    {
      id: "familiar",
      maxVisits: 3,
      note: "她已经认得这阵脚步声",
      hanger: "还是要先敲门",
      lead: "你还没出声，门后的脚步就停近了一点。",
      quote: "“又来了……还是要先敲门。”",
      reaction: "又来了……我已经听见了。",
      openLead: "她这次没有再问门外是谁。",
      openQuote: "“进来吧……位置还是留在那里。”",
      openReaction: "位置还是留在那里……不要靠得太近。",
      secretMessage: "“你真的又来了……那下次，也不用站得那么远。”"
    },
    {
      id: "close",
      maxVisits: Infinity,
      note: "门缝比上次多留了一点",
      hanger: "有一张画想给你看",
      lead: "门缝在你靠近以前，就先亮起了一线暖光。",
      quote: "“我刚好有张画……想先听你的感想。”",
      reaction: "来得正好……有一张画想先给你看。",
      openLead: "画稿已经被悄悄放在桌边。",
      openQuote: "“我没有等很久……进来吧。”",
      openReaction: "才没有一直等……只是刚好画完。",
      secretMessage: "“这次不用等我把留言藏好。反正……你还会再来。”"
    }
  ],
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
          id: "welcome-close",
          label: "悄悄让开一点",
          japanese: "入ってもいいけど……静かにして。あと、近すぎるのは禁止。",
          chinese: "可以进来……但要安静。还有，不许靠得太近。",
          file: "assets/audio/v4/welcome-close.mp3",
          expression: "shy",
          reaction: "可以进来……不许突然靠近。"
        },
        {
          id: "welcome-glad",
          label: "藏不住一点开心",
          japanese: "来たんだ……その、少しだけ嬉しい。",
          chinese: "你来了呀……那个，只有一点点开心。",
          file: "assets/audio/v4/welcome-glad.mp3",
          expression: "shy",
          reaction: "只、只有一点点开心……不要笑。"
        },
        {
          id: "welcome-door-gap",
          label: "给门留一条小缝",
          japanese: "ドア、少しだけ開けておく。……見つめすぎないで。",
          chinese: "门给你留一点缝……不许一直盯着看。",
          file: "assets/audio/v4/welcome-door-gap.mp3",
          expression: "shy",
          reaction: "门缝只留这么大……不许一直看我。"
        }
      ],
      guardedReplies: [
        {
          id: "welcome-knock",
          label: "被连续催门",
          japanese: "聞こえてる……そんなに急かしたら、開けないから。",
          chinese: "我听见了……再那么催我，我就不开门了。",
          file: "assets/audio/v4/welcome-knock.mp3",
          expression: "startled",
          reaction: "连着催门的话……真的不开了。"
        },
        {
          id: "welcome-waiting",
          label: "被催得有点嘴硬",
          japanese: "遅い……べ、別に待ってたわけじゃないけど。",
          chinese: "好慢……我、我又没有在等你。",
          file: "assets/audio/v4/welcome-waiting.mp3",
          expression: "proud",
          reaction: "一直敲什么……才、才没有在等你。"
        }
      ]
    },
    drawing: {
      id: "drawing",
      scene: "画桌旁",
      replies: [
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
          id: "drawing-one-second",
          label: "准你偷看一秒",
          japanese: "この線、うまくいった。……一秒だけなら、見てもいいよ。",
          chinese: "这条线画得很好……只看一秒的话，可以哦。",
          file: "assets/audio/v4/drawing-one-second.mp3",
          expression: "proud",
          reaction: "就、就一秒……这条线画得还不错吧。"
        },
        {
          id: "drawing-stay-near",
          label: "允许你安静陪着",
          japanese: "隣にいてもいいけど、静かにして。……描き終わったら呼ぶから。",
          chinese: "可以待在旁边，但要安静……画完我会叫你的。",
          file: "assets/audio/v4/drawing-stay-near.mp3",
          expression: "shy",
          reaction: "可以待在旁边……画完以后我会叫你。"
        }
      ],
      guardedReplies: [
        {
          id: "drawing-no-peeking",
          label: "偷看得太急",
          japanese: "まだ途中。勝手に覗いたら……追い出すから。",
          chinese: "还没画完。敢擅自偷看……就把你赶出去。",
          file: "assets/audio/v4/drawing-no-peeking.mp3",
          expression: "startled",
          reaction: "还在画……一直偷看的话要赶人了。"
        },
        {
          id: "drawing-opinion",
          label: "追问得太多次",
          japanese: "見たいなら、感想ちゃんと言って。『かわいい』だけは禁止。",
          chinese: "想看的话，就要认真说感想。只说“可爱”不算。",
          file: "assets/audio/v4/drawing-opinion.mp3",
          expression: "proud",
          reaction: "问这么多次……那就要认真说感想。"
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
        },
        {
          id: "like-noticed",
          label: "发现你看得很认真",
          japanese: "そこ、気づいたんだ……ちゃんと見てくれてたんだね。",
          chinese: "你注意到那里了呀……真的有认真看呢。",
          file: "assets/audio/v4/like-noticed.mp3",
          expression: "shy",
          reaction: "连那里都注意到了……原来真的有认真看。"
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
        },
        {
          id: "goodnight-answer",
          label: "等你回一句晚安",
          japanese: "おやすみって言ったら、ちゃんと返して。……聞いてから寝るから。",
          chinese: "我说晚安以后，你也要好好回答……听见了我才睡。",
          file: "assets/audio/v4/goodnight-answer.mp3",
          expression: "shy",
          reaction: "要、要等你也说完晚安……我才会睡。"
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
  galleryChapters: [
    { id: "start", title: "第一章 · 偷偷开始", short: "偷偷开始", start: 0, end: 3 },
    { id: "closer", title: "第二章 · 把画推近", short: "把画推近", start: 4, end: 7 },
    { id: "praise", title: "第三章 · 等一句夸奖", short: "等一句夸奖", start: 8, end: 10 }
  ],
  gallery: [
    {
      id: "bed-drawing",
      ...v18Scene("gallery-bed-drawing"),
      alt: "银白长发的女孩穿粉色猫耳家居服，盘腿坐在床上用数位板画画，被发现后害羞抬眼",
      title: "被抓到在床上画画",
      note: "她原本把数位板藏在膝盖上。听见你靠近，只来得及红着脸抬头：“不许笑……这里比较舒服而已。”",
      expression: "startled",
      reaction: "我、我只是觉得床上比较暖……不许笑。"
    },
    {
      id: "blanket-fort",
      ...v18Scene("gallery-blanket-fort"),
      alt: "银白长发的女孩躲在被子搭成的小帐篷里画画，红着脸从帘边递出一张小猫速写",
      title: "被窝画室只开一条缝",
      note: "她用被子围出一间更小的画室，只把帘子拉开一点点。小猫速写先从缝里递出来，藏在袖口后的声音轻得几乎听不见：“画、画可以先看……”",
      expression: "shy",
      reaction: "帐篷里只能坐一个人……画可以先借你看。"
    },
    {
      id: "stream-wave",
      ...v18Scene("gallery-stream-wave"),
      alt: "银白长发的女孩戴着猫耳耳机坐在数位板前进行安静的绘画直播，用袖口挡住红脸小幅挥手",
      title: "直播开始前的小小挥手",
      note: "进入画师模式时，她盯着线稿比谁都认真。发现镜头还开着，才用袖口挡住脸，飞快挥了一下手：“只、只是在确认画面。”",
      expression: "startled",
      reaction: "刚才不算打招呼……只是确认镜头。"
    },
    {
      id: "show-drawing",
      ...v18Scene("gallery-show-drawing"),
      alt: "银白长发的女孩跪坐在床边，红着脸把画着可爱角色的速写本举给来访者看",
      title: "只给你看三秒",
      note: "画纸举得很认真，视线却躲到了旁边。“看、看完就要说感想……不许只点头。”",
      expression: "shy",
      reaction: "三秒……已经到了。所、所以感想呢？"
    },
    {
      id: "pillow-offer",
      ...v18Scene("gallery-pillow-offer"),
      alt: "银白长发的女孩穿蓝白格睡衣，抱着粉色猫咪靠枕，从靠枕后把一张小猫画递给来访者",
      title: "躲在靠枕后把画递给你",
      note: "大半张脸都藏起来了，画却认真地伸到你面前。“只、只许看画……不许一直看我。”",
      expression: "shy",
      reaction: "只许看画，不许看我……感想还是要说。"
    },
    {
      id: "door-note",
      ...v18Scene("gallery-door-note"),
      alt: "银白长发的女孩藏在半开的卧室门后，脸红着从门缝递出一张画有小猫的卡片",
      title: "谢谢要从门缝里递出来",
      note: "亲口说出口还是太难了，于是她把认真画好的小猫卡片从门缝推给你。等你接稳，门后才传来一句：“那、那只小猫不许笑。”",
      expression: "shy",
      reaction: "卡片收好就行……不许笑上面那只小猫。"
    },
    {
      id: "desk-night",
      ...v18Scene("gallery-desk-night"),
      alt: "深夜里，银白长发的女孩趴在数位板前认真画画，桌灯照亮画稿",
      title: "认真起来就忘了害羞",
      note: "嘴上说着不许偷看，真正画起来以后，连门边的脚步声都听不见了。",
      expression: "proud",
      reaction: "这一笔很重要……等、等画完再和你说话。"
    },
    {
      id: "sketch-sort",
      ...v18Scene("gallery-sketch-sort"),
      alt: "银白长发的女孩穿粉色长袖家居服坐在地毯上整理速写，抱住一张画稿并害羞地把另一张推向来访者",
      title: "最喜欢的那张先藏住",
      note: "散在地毯上的草稿被分成好多小堆。她把最喜欢的一张紧紧抱住，却又把另一张悄悄推向你：“这张……可以替我保管一下。”",
      expression: "shy",
      reaction: "最喜欢的先不行……这张可以替我保管。"
    },
    {
      id: "sketchbook-hide",
      ...v18Scene("gallery-sketchbook-hide"),
      alt: "银白长发的女孩躲在大画册后，只露出一双明亮的蓝眼睛",
      title: "被看太久就藏起来",
      note: "画册挡住了大半张脸，但那双眼睛已经把“我知道你还在看”全都说出来了。",
      expression: "startled",
      reaction: "看、看太久了……下一页要先征得同意。"
    },
    {
      id: "awaiting-praise",
      ...v18Scene("gallery-awaiting-praise"),
      alt: "银白长发的女孩抱膝坐在床上，速写本朝向来访者，脸红着等待评价",
      title: "装作没有在等夸奖",
      note: "她把画留在最显眼的位置，自己却缩进了宽大的袖口里。“我、我没有催你……慢慢看也行。”",
      expression: "shy",
      reaction: "没有在等……但你可以再说具体一点。"
    },
    {
      id: "goodnight",
      ...v18Scene("gallery-goodnight-clean"),
      alt: "月光下，银白长发的女孩蜷坐在窗边抱着猫咪玩偶，露出困倦的微笑",
      title: "今天的最后一页",
      note: "稿子保存好，窗帘留一条缝，再抱住最软的玩偶。临睡前，她还是小声补了一句：“明天……也可以来。”",
      expression: "shy",
      reaction: "明天再翻一页……今天要好好睡觉。"
    }
  ],
  secrets: {
    tablet: { label: "数位板", hint: "她的手刚从画面中央那块最常碰的黑色板子旁收回来。", text: "快捷键都设成单手能按到，因为另一只手常常要抱着靠枕。" },
    headphones: { label: "耳机", hint: "画线稿以前，她总会先看一眼画面左上方的耳机。", text: "画线稿时会循环同一张安静的歌单，音量永远只开到三格。" },
    manuscript: { label: "轻小说稿件", hint: "桌面左下角那叠纸的页边，好像画了比正文更多的东西。", text: "页边画满了表情草稿。比起剧情批注，她更先注意角色有没有好好笑出来。" },
    plush: { label: "猫咪玩偶", hint: "她卡住的时候，视线会飘向画面右上方那只软绵绵的家伙。", text: "不顺利的时候会被抱得很紧。顺利的时候，也一样。" },
    drawer: { label: "上锁抽屉", hint: "最不肯解释的东西，通常被她推到桌子的右下角。", text: "钥匙藏在薄荷色铅笔盒底下。不过，要集齐五枚猫爪才可以打开。" }
  },
  drawingStory: {
    frames: {
      focus: {
        ...v18Scene("studio-focus-clean"),
        alt: "纱雾在夜色里的画桌前低头用数位板认真画线稿"
      },
      blink: {
        ...v18Scene("studio-blink-clean"),
        alt: "纱雾低头画线时轻轻眨了一下眼睛"
      },
      shy: {
        ...v18Scene("studio-shy-clean"),
        alt: "被认真夸奖后，纱雾脸红着用长袖袖口遮住嘴角"
      },
      reveal: {
        ...v18Scene("studio-reveal-clean"),
        alt: "纱雾露出害羞又有一点得意的表情，把刚完成的小猫画推到桌边"
      }
    },
    peekReactions: [
      { expression: "startled", label: "偷看被抓到了", text: "咿——！这、这张还没画完，不许突然凑过来。" },
      { expression: "shy", label: "只露出一小角", text: "……只能看这里。再多一点就要等我画完。" },
      { expression: "proud", label: "她还是推近了一点", text: "都说了没画完……不过，这根线可以先给你看。" }
    ],
    quietBeats: [
      { at: 20000, time: "安静地待了二十秒", title: "她重新描细了一根线。", line: "袖口擦过数位板边缘。她没有抬头，只把旁边那把椅子又往外挪了半格。", frame: "focus" },
      { at: 45000, time: "房间安静了四十五秒", title: "她终于确认你还在。", line: "“……你还在啊。”声音很轻，像是怕一说大声，这段安静就会结束。", frame: "shy" },
      { at: 75000, time: "一起待过一分多钟", title: "画稿被悄悄推近了一点。", line: "她把屏幕转过来一点点，又立刻盯回笔尖：“接下来画什么……你可以帮我选。”", frame: "shy" }
    ],
    presence: {
      quiet: {
        label: "安静坐在旁边",
        detail: "不催她，也不一直盯着屏幕",
        line: "……这样就好。你可以看，但不许突然凑过来。",
        memory: "安静坐在旁边"
      },
      help: {
        label: "问她哪里需要帮忙",
        detail: "等她自己把犹豫说出来",
        line: "那、那就帮我决定画什么。只准认真选。",
        memory: "先问我哪里需要帮忙"
      },
      distance: {
        label: "把椅子挪远一点",
        detail: "给她留出不会被盯着看的距离",
        line: "不用那么远……会看不清的。靠回来一点也可以。",
        memory: "还特意把椅子挪远了一点"
      }
    },
    subjects: {
      door: {
        label: "门缝看月亮的小猫",
        detail: "明明好奇，却只肯先探出半张脸",
        ...v18Scene("drawing-door-moon"),
        alt: "奶油稿纸上，一只小猫从半开的房门后看向月亮和星星的铅笔水彩画",
        line: "门只开这么大……但月亮还是看得见。",
        stageNote: "她先画了一条很窄的门缝，又在外面留了一轮月亮。"
      },
      blanket: {
        label: "被窝里画星星的小猫",
        detail: "躲进最小的画室，还是很认真地下笔",
        ...v18Scene("drawing-blanket-star"),
        alt: "奶油稿纸上，一只小猫躲在被窝帐篷里用铅笔画星星的铅笔水彩画",
        line: "被子里面比较安静……画线也不会抖。",
        stageNote: "她把被子画成一间很小的画室，只给笔尖留了出口。"
      },
      pencil: {
        label: "抱着大铅笔的小猫",
        detail: "看起来软绵绵，抱住画笔时却很认真",
        ...v18Scene("drawing-pencil-stars"),
        alt: "奶油稿纸上，一只小猫抱住一支大铅笔，周围散着三颗小星星的铅笔水彩画",
        line: "笔不能放开。灵感跑掉的话……很难抓回来。",
        stageNote: "她把铅笔画得比小猫还大，爪子却抱得很稳。"
      }
    },
    palettes: {
      strawberry: {
        label: "草莓黄昏",
        detail: "暖粉、纸灯和一点点晚霞",
        className: "palette-strawberry",
        line: "暖一点也可以……但、不许说是因为我喜欢粉色。"
      },
      mint: {
        label: "薄荷雨夜",
        detail: "安静的薄荷青压住窗外雨声",
        className: "palette-mint",
        line: "这个颜色很安静。画久一点，眼睛也不会累。"
      },
      moon: {
        label: "银蓝月光",
        detail: "银白、月蓝和很淡的夜色",
        className: "palette-moon",
        line: "像窗帘没有完全拉紧的时候……就用这个。"
      }
    },
    praises: {
      soft: {
        label: "线条看起来很软",
        detail: "连门和铅笔都没有尖锐的感觉",
        memory: "线条看起来很软",
        line: "你连线条都认真看了……那、那我不改这一笔了。"
      },
      eyes: {
        label: "小猫的眼神很认真",
        detail: "害羞归害羞，它真的很喜欢画画",
        memory: "小猫的眼神很认真",
        line: "看得出来吗？我画那双眼睛……改了很多次。"
      },
      lamp: {
        label: "配色像一盏小夜灯",
        detail: "很安静，但不会让人觉得孤单",
        memory: "配色像一盏小夜灯",
        line: "小夜灯……这个说法，我会写在稿纸背面。"
      }
    }
  },
  livingRoom: {
    voices: {
      "room-desk-intro": {
        scene: "画桌旁",
        label: "留给你的座位",
        japanese: "ここ、私のいちばん落ち着く場所。隣なら、少しだけ空いてるよ。",
        chinese: "这里是我最安心的地方。旁边的话……还空着一点。",
        file: "assets/audio/v8/voice/room-desk-intro.mp3",
        expression: "shy",
        reaction: "只是椅子刚好没有推回去……不是特意留的。"
      },
      "room-desk-pencil": {
        scene: "画桌旁",
        label: "最后一笔",
        japanese: "この線、やっと決まった。ちょっとだけ見ていいよ。",
        chinese: "这根线终于定下来了。只给你看一点点。",
        file: "assets/audio/v8/voice/room-desk-pencil.mp3",
        expression: "proud",
        reaction: "她把刚画好的轮廓转过来一点，手指仍压着画纸的一角。"
      },
      "room-desk-eye": {
        scene: "画桌旁",
        label: "只看眼睛",
        japanese: "目のところだけ。ほかまで見たら隠すから。",
        chinese: "只许看眼睛。要是看到别的地方，我就藏起来。",
        file: "assets/audio/v8/voice/room-desk-eye.mp3",
        expression: "startled",
        reaction: "她盯着你的视线，像真的随时会把数位板抱回去。"
      },
      "room-desk-stay": {
        scene: "画桌旁",
        label: "再画一张",
        japanese: "まだいてくれたんだ。じゃあ、あと一枚だけ。",
        chinese: "你还在呀……那就再画一张。",
        file: "assets/audio/v8/voice/room-desk-stay.mp3",
        expression: "shy",
        reaction: "保存完成以后，她没有催你离开，只是又新建了一张画布。"
      },
      "room-bed-intro": {
        scene: "床边",
        label: "床上的小画室",
        japanese: "ベッドでも描けるから。さぼってるんじゃないよ。",
        chinese: "在床上也能画。所以我才不是在偷懒。",
        file: "assets/audio/v8/voice/room-bed-intro.mp3",
        expression: "proud",
        reaction: "她把数位板摆得更正了一点，认真证明这里也是工作区。"
      },
      "room-bed-blanket": {
        scene: "床边",
        label: "接住毯角",
        japanese: "ありがとう。毛布、落ちるところだった。",
        chinese: "谢谢。毯子刚才差点就掉下去了。",
        file: "assets/audio/v8/voice/room-bed-blanket.mp3",
        expression: "shy",
        reaction: "毯角被仔细收回脚边，旁边也悄悄空出了半个靠枕。"
      },
      "room-bed-fort": {
        scene: "床边",
        label: "小帐篷的缝",
        japanese: "この隙間は換気用。のぞくためじゃないから。",
        chinese: "这条缝是用来通风的。才不是让你偷看的。",
        file: "assets/audio/v8/voice/room-bed-fort.mp3",
        expression: "startled",
        reaction: "帘边的缝没有合上，反而又露出了一点画纸。"
      },
      "room-bed-pillow": {
        scene: "床边",
        label: "借你靠枕",
        japanese: "そのクッション、少しだけ貸してあげる。",
        chinese: "那个靠枕……可以借你一会儿。",
        file: "assets/audio/v8/voice/room-bed-pillow.mp3",
        expression: "shy",
        reaction: "最软的猫咪靠枕被推过来，她自己却先躲回了袖口后面。"
      },
      "room-wardrobe-intro": {
        scene: "衣橱边",
        label: "替她选一件",
        japanese: "どっちがいいと思う？ 笑わないなら、聞いてあげる。",
        chinese: "你觉得哪件好？只要不笑我……就听听你的意见。",
        file: "assets/audio/v8/voice/room-wardrobe-intro.mp3",
        expression: "shy",
        reaction: "两种颜色被重新举到一样高，她终于肯把选择分给你一点。"
      },
      "room-wardrobe-hanger": {
        scene: "衣橱边",
        label: "扶稳衣架",
        japanese: "助かった。ハンガーの音、びっくりするから。",
        chinese: "帮大忙了。衣架的声音总会吓我一跳。",
        file: "assets/audio/v8/voice/room-wardrobe-hanger.mp3",
        expression: "shy",
        reaction: "木衣架安静下来以后，她才慢慢松开一直绷着的肩膀。"
      },
      "room-wardrobe-hood": {
        scene: "衣橱边",
        label: "猫耳连帽毯",
        japanese: "これは可愛いんじゃなくて、暖かいだけ。",
        chinese: "这件才不是为了可爱，只是比较暖而已。",
        file: "assets/audio/v8/voice/room-wardrobe-hood.mp3",
        expression: "startled",
        reaction: "嘴上说着只是保暖，露出来的猫耳却还在轻轻晃。"
      },
      "room-wardrobe-choice": {
        scene: "衣橱边",
        label: "粉色还是薄荷",
        japanese: "ピンクとミント、どっちがいい？ ちゃんと選んで。",
        chinese: "粉色和薄荷色，哪件好？要认真选。",
        file: "assets/audio/v8/voice/room-wardrobe-choice.mp3",
        expression: "proud",
        reaction: "她等着你的答案，没有再偷偷把薄荷色那件藏到后面。"
      },
      "room-window-intro": {
        scene: "窗台",
        label: "窗边的安静",
        japanese: "窓のそばは静か。雨も、ここなら遠くに聞こえる。",
        chinese: "窗边很安静。连雨声在这里听起来也很远。",
        file: "assets/audio/v8/voice/room-window-intro.mp3",
        expression: "shy",
        reaction: "她抱紧猫咪玩偶，给你留出了能一起看月亮的位置。"
      },
      "room-window-latch": {
        scene: "窗台",
        label: "关小窗缝",
        japanese: "これくらいの隙間なら、雨の音も小さいね。",
        chinese: "窗缝留这么大的话，雨声也会小一点呢。",
        file: "assets/audio/v8/voice/room-window-latch.mp3",
        expression: "shy",
        reaction: "雨声退到玻璃外面，月光仍从没有关严的窗帘边落进来。"
      },
      "room-window-moon": {
        scene: "窗台",
        label: "两个月亮",
        japanese: "絵の月と本物の月、並べても変じゃないよね。",
        chinese: "画里的月亮和真的月亮摆在一起，也不奇怪吧？",
        file: "assets/audio/v8/voice/room-window-moon.mp3",
        expression: "proud",
        reaction: "小猫画被靠在窗边，纸上的月亮刚好接住了外面的光。"
      },
      "room-window-close": {
        scene: "窗台",
        label: "再留一分钟",
        japanese: "今日はここまで。あと一分なら、いていいよ。",
        chinese: "今天就到这里。再待一分钟的话……可以。",
        file: "assets/audio/v8/voice/room-window-close.mp3",
        expression: "shy",
        reaction: "画册已经合上，她却没有立刻把身边的位置收回去。"
      },
      "room-weather-rain": {
        scene: "房间窗外",
        label: "雨落在窗外",
        japanese: "雨、降ってきた。窓の外だけだから、心配しないで。",
        chinese: "下雨了。不过雨只在窗外，不用担心。",
        file: "assets/audio/v8/voice/room-weather-rain.mp3",
        expression: "shy",
        reaction: "雨线只沿着窗玻璃落下，房间里的木地板仍然干燥温暖。"
      },
      "room-weather-clear": {
        scene: "房间窗外",
        label: "雨停见月",
        japanese: "雨、やんだみたい。月が見えるよ。",
        chinese: "雨好像停了。能看见月亮了。",
        file: "assets/audio/v8/voice/room-weather-clear.mp3",
        expression: "proud",
        reaction: "窗上的雨线淡下去，月光重新落在玩偶柔软的耳朵上。"
      }
    },
    phases: {
      morning: { label: "清晨", note: "窗光刚越过床沿，房间还没有完全醒。" },
      day: { label: "午后", note: "墙纸被日光照得很软，连稿纸都显得轻一点。" },
      evening: { label: "傍晚", note: "台灯先亮起来，窗外的颜色正在慢慢变深。" },
      night: { label: "夜里", note: "木地板已经安静下来，只剩很轻的创作声。" },
      late: { label: "深夜", note: "房间缩进一盏小灯里，她还舍不得停笔。" }
    },
    places: {
      desk: {
        label: "画桌旁",
        ...v18Scene("studio-focus-clean"),
        alt: "纱雾在暖灯与夜窗之间低头画稿，桌边放着数位板、铅笔和小猫玩偶",
        title: "先别叫她，她正画到最认真的地方。",
        line: "她把旁边的椅子留出一点，却一直装作只是忘了推回去。",
        quote: "“可以靠近……不要突然碰到数位板。”",
        ambient: [
          "笔尖还在移动，台灯把线稿照得很暖。",
          "她停下来眨了一下眼，又把刚才那根线重新描细。",
          "桌边那张共同完成的小画，被压在最不容易折到的位置。"
        ],
        autonomousFrame: {
          ...v18Scene("studio-blink-clean"),
          alt: "纱雾低头画线时轻轻眨了一下眼睛"
        },
        autonomousDuration: 145,
        action: "听她补完这一笔",
        voice: "room-desk-intro",
        voiceLabel: "听她说说画桌",
        deepLink: "#desk-secrets",
        deepLabel: "再靠近画桌一点",
        expression: "proud",
        moments: [
          { line: "她沿着刚才犹豫的轮廓补完最后一笔，肩膀终于松下来一点。", memory: "等她补完了最后一根线", voice: "room-desk-pencil", sound: "assets/audio/v14/desk-stylus-line.mp3" },
          { line: "她把数位板转过来几度，只够你看见新画好的眼睛。", memory: "只看了她肯转过来的那一点画稿", voice: "room-desk-eye", sound: "assets/audio/v14/desk-tablet-turn.mp3" },
          { line: "保存提示轻轻闪了一下，她才发现你一直安静坐在旁边。", memory: "一直等到她按下保存键", voice: "room-desk-stay", sound: "assets/audio/v14/desk-save-key.mp3" }
        ]
      },
      bed: {
        label: "床边",
        ...v18Scene("gallery-bed-drawing"),
        alt: "纱雾穿粉色猫耳家居服，盘腿坐在床上用数位板画画，身边堆着柔软靠枕",
        title: "床是休息的地方，也是她最小的画室。",
        line: "数位板垫在膝盖上，滑下来的被角已经快碰到地板。",
        quote: "“在床上画比较暖……这不是偷懒。”",
        ambient: [
          "靠枕被抱得慢慢陷下去，她还在检查刚画好的小猫耳朵。",
          "她用被子围出一条很窄的缝，只把画先递到外面。",
          "困意把动作放慢了，手里的笔却还没有放下。"
        ],
        action: "把滑下来的毯角递回去",
        voice: "room-bed-intro",
        voiceLabel: "听她说说床边",
        deepLink: "#gallery",
        deepLabel: "翻看床边的小片段",
        expression: "shy",
        moments: [
          {
            line: "毯角回到脚边，她愣了一下，又悄悄往旁边让出半个靠枕。",
            memory: "替她接住了滑下来的毯角",
            voice: "room-bed-blanket",
            sound: "assets/audio/v14/bed-blanket-fold.mp3",
            frame: {
              ...v18Scene("gallery-blanket-fort"),
              alt: "纱雾躲进被子搭成的小帐篷，从帘边害羞地递出一张小猫速写"
            }
          },
          { line: "她把小帐篷收回床角，数位板又稳稳落在膝盖上。", memory: "帮她把被窝小帐篷收回了床角", voice: "room-bed-fort", sound: "assets/audio/v14/bed-fort-rustle.mp3", frame: "base" },
          { line: "最软的猫咪靠枕被推到你这边一点，她本人却迅速躲回袖口后。", memory: "接住了她推过来的猫咪靠枕", voice: "room-bed-pillow", sound: "assets/audio/v14/bed-pillow-pat.mp3" }
        ]
      },
      wardrobe: {
        label: "衣橱边",
        ...v18Scene("wardrobe-living"),
        alt: "纱雾站在打开的木衣橱旁，害羞地比较粉色家居外套和薄荷猫耳连帽毯",
        title: "她已经比较了很久，还不肯承认自己在犹豫。",
        line: "粉色家居服比较安心，薄荷猫耳毯又足够挡住紧张的表情。",
        quote: "“我只是确认哪一件比较方便画画。”",
        ambient: [
          "衣架轻轻碰了一下，她马上伸手扶住，像怕惊动整个房间。",
          "薄荷猫耳毯被举到脸边，又因为太显眼悄悄放低。",
          "她对着两种颜色看了很久，最后先偷偷观察你的反应。"
        ],
        action: "替她扶住晃动的衣架",
        voice: "room-wardrobe-intro",
        voiceLabel: "听她说说衣橱",
        deepLink: "#wardrobe",
        deepLabel: "陪她认真选一套",
        expression: "startled",
        moments: [
          { line: "木衣架终于安静下来，她把差点滑落的袖子重新挂好。", memory: "替她扶稳了差点晃落的衣架", voice: "room-wardrobe-hanger", sound: "assets/audio/v14/wardrobe-hanger-settle.mp3" },
          { line: "她把猫耳毯往身后藏了藏，露出来的耳尖还是轻轻晃了一下。", memory: "发现了她藏到身后的猫耳毯", voice: "room-wardrobe-hood", sound: "assets/audio/v14/wardrobe-fabric-swish.mp3" },
          { line: "两套衣服又被并排举起来，这次她终于把选择权分给你一点。", memory: "认真看完了她举起来的两套衣服", voice: "room-wardrobe-choice", sound: "assets/audio/v14/wardrobe-choice.mp3" }
        ]
      },
      window: {
        label: "窗台",
        ...v18Scene("gallery-goodnight-clean"),
        alt: "月光下，纱雾蜷坐在窗边抱着猫咪玩偶，身旁放着合上的画册",
        title: "窗帘总会留一条缝，刚好够月光进来。",
        line: "她说那样比较容易看清时间，其实只是舍不得把夜色全部关在外面。",
        quote: "“雨小一点以后……月亮也许会出来。”",
        ambient: [
          "窗帘被风抬起一点，月光刚好落在她抱着的玩偶耳朵上。",
          "雨线沿着玻璃慢慢滑下，她在心里给每一条安排了方向。",
          "合上的画册旁边，还留着一张没有写完的晚安纸条。"
        ],
        action: "替她把窗缝关小一点",
        voice: "room-window-intro",
        voiceLabel: "听她说说窗边",
        deepLink: "#goodnight",
        deepLabel: "陪她收好今天",
        expression: "shy",
        moments: [
          { line: "窗缝窄了一点，雨声变轻，玩偶耳朵上的月光却还留着。", memory: "替她把漏进雨声的窗缝关小了一点", voice: "room-window-latch", sound: "assets/audio/v14/window-latch-slide-clean.mp3" },
          { line: "她把上次那张小猫画靠在窗边，让画里的月亮和外面排在一起。", memory: "陪她把画里的月亮和窗外排在一起", voice: "room-window-moon", sound: "assets/audio/v14/window-paper-slide-clean.mp3" },
          { line: "窗帘安静落下，她在合上的画册上轻轻拍了两下。", memory: "陪她把窗帘和今天一起收好了", voice: "room-window-close", sound: "assets/audio/v14/window-curtain-close-clean.mp3" }
        ]
      }
    }
  },
  goodnight: {
    doorSound: "assets/audio/v16/goodnight-door-close.mp3"
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

function clampVolume(value) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.85;
}

function validGalleryIndex(value) {
  return Number.isInteger(value) && value >= 0 && value < CONTENT.gallery.length ? value : 0;
}

function validLivingPlace(value) {
  return Object.prototype.hasOwnProperty.call(CONTENT.livingRoom.places, value) ? value : "desk";
}

function validLivingWeather(value) {
  return value === "clear" || value === "rain" ? value : "rain";
}

function validMotionMode(value) {
  return value === "quiet" ? "quiet" : "lively";
}

function validFortune(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 180 ? value.trim() : "";
}

function validSharedDrawing(value) {
  if (!value || typeof value !== "object") return null;
  const validPresence = Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.presence, value.presence);
  const validSubject = Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.subjects, value.subject);
  const validPalette = Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.palettes, value.palette);
  const validPraise = Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.praises, value.praise);
  if (!validPresence || !validSubject || !validPalette || !validPraise) return null;
  return {
    presence: value.presence,
    subject: value.subject,
    palette: value.palette,
    praise: value.praise,
    completedAt: Number.isFinite(value.completedAt) ? value.completedAt : 0
  };
}

function validLastRoomMemory(value) {
  if (!value || typeof value !== "object") return null;
  const place = CONTENT.livingRoom.places[value.place];
  const momentIndex = Number.isInteger(value.momentIndex) ? value.momentIndex : -1;
  if (!place || !place.moments[momentIndex]) return null;
  return {
    place: value.place,
    momentIndex,
    rememberedAt: Number.isFinite(value.rememberedAt) ? value.rememberedAt : 0
  };
}

function validLastOutfitMemory(value) {
  if (!value || typeof value !== "object" || !validOutfit(value.outfit)) return null;
  return {
    outfit: value.outfit,
    rememberedAt: Number.isFinite(value.rememberedAt) ? value.rememberedAt : 0
  };
}

function validDrawingDraft(value) {
  if (!value || typeof value !== "object") return null;
  const choices = value.choices && typeof value.choices === "object" ? value.choices : {};
  const normalized = {
    presence: Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.presence, choices.presence) ? choices.presence : "",
    subject: Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.subjects, choices.subject) ? choices.subject : "",
    palette: Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.palettes, choices.palette) ? choices.palette : "",
    praise: Object.prototype.hasOwnProperty.call(CONTENT.drawingStory.praises, choices.praise) ? choices.praise : ""
  };
  const keys = ["presence", "subject", "palette", "praise"];
  const firstMissing = keys.findIndex((key) => !normalized[key]);
  const requestedStep = Number.isInteger(value.step) ? value.step : Math.max(0, firstMissing);
  const step = Math.min(3, Math.max(0, firstMissing < 0 ? requestedStep : Math.min(requestedStep, firstMissing)));
  const quietElapsedMs = Number.isFinite(value.quietElapsedMs)
    ? Math.min(75000, Math.max(0, value.quietElapsedMs))
    : 0;
  const peekCount = Number.isInteger(value.peekCount) ? Math.min(3, Math.max(0, value.peekCount)) : 0;
  return {
    choices: normalized,
    step,
    mode: value.mode === "quiet" && normalized.presence === "quiet" ? "quiet" : "choices",
    quietElapsedMs,
    peekCount,
    updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : 0
  };
}

function readState() {
  const fallback = {
    outfit: "home",
    secrets: new Set(),
    visitCount: 0,
    lastVisitAt: 0,
    previousVisitAt: 0,
    galleryIndex: 0,
    voiceVolume: 0.85,
    voiceMuted: false,
    sharedDrawing: null,
    drawingDraft: null,
    lastRoomMemory: null,
    lastOutfitMemory: null,
    livingPlace: "desk",
    livingWeather: "rain",
    roomSoundMuted: false,
    motionMode: "lively",
    keptFortune: "",
    keptFortuneAt: 0
  };
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY_V2));
    if (current) {
      return {
        outfit: validOutfit(current.outfit) ? current.outfit : "home",
        secrets: new Set(validSecrets(current.secrets)),
        visitCount: Number.isInteger(current.visitCount) && current.visitCount > 0 ? current.visitCount : 0,
        lastVisitAt: Number.isFinite(current.lastVisitAt) ? current.lastVisitAt : 0,
        previousVisitAt: Number.isFinite(current.previousVisitAt) ? current.previousVisitAt : 0,
        galleryIndex: validGalleryIndex(current.galleryIndex),
        voiceVolume: clampVolume(current.voiceVolume),
        voiceMuted: current.voiceMuted === true,
        sharedDrawing: validSharedDrawing(current.sharedDrawing),
        drawingDraft: validDrawingDraft(current.drawingDraft),
        lastRoomMemory: validLastRoomMemory(current.lastRoomMemory),
        lastOutfitMemory: validLastOutfitMemory(current.lastOutfitMemory),
        livingPlace: validLivingPlace(current.livingPlace),
        livingWeather: validLivingWeather(current.livingWeather),
        roomSoundMuted: current.roomSoundMuted === true,
        motionMode: validMotionMode(current.motionMode),
        keptFortune: validFortune(current.keptFortune),
        keptFortuneAt: Number.isFinite(current.keptFortuneAt) ? current.keptFortuneAt : 0
      };
    }

    const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY_V1));
    if (legacy) {
      const migrated = {
        outfit: validOutfit(legacy.outfit) ? legacy.outfit : "home",
        secrets: validSecrets(legacy.secrets),
        visitCount: 0,
        lastVisitAt: 0,
        previousVisitAt: 0,
        galleryIndex: 0,
        voiceVolume: 0.85,
        voiceMuted: false,
        sharedDrawing: null,
        drawingDraft: null,
        lastRoomMemory: null,
        lastOutfitMemory: null,
        livingPlace: "desk",
        livingWeather: "rain",
        roomSoundMuted: false,
        motionMode: "lively",
        keptFortune: "",
        keptFortuneAt: 0
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      return { ...migrated, secrets: new Set(migrated.secrets) };
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
      secrets: [...state.secrets],
      visitCount: state.visitCount,
      lastVisitAt: state.lastVisitAt,
      previousVisitAt: state.previousVisitAt,
      galleryIndex: state.galleryIndex,
      voiceVolume: state.voiceVolume,
      voiceMuted: state.voiceMuted,
      sharedDrawing: state.sharedDrawing,
      drawingDraft: state.drawingDraft,
      lastRoomMemory: state.lastRoomMemory,
      lastOutfitMemory: state.lastOutfitMemory,
      livingPlace: state.livingPlace,
      livingWeather: state.livingWeather,
      roomSoundMuted: state.roomSoundMuted,
      motionMode: state.motionMode,
      keptFortune: state.keptFortune,
      keptFortuneAt: state.keptFortuneAt
    }));
  } catch {
    // 存储不可用时，仅保留当前会话状态。
  }
}

function isSameLocalDay(first, second) {
  if (!first || !second) return false;
  const a = new Date(first);
  const b = new Date(second);
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function registerVisit(now = Date.now()) {
  const fourHours = 4 * 60 * 60 * 1000;
  const shouldCount = !state.lastVisitAt
    || !isSameLocalDay(state.lastVisitAt, now)
    || now - state.lastVisitAt >= fourHours;

  if (shouldCount) {
    state.previousVisitAt = state.lastVisitAt;
    state.lastVisitAt = now;
    state.visitCount = Math.max(0, state.visitCount) + 1;
    saveState();
  } else if (state.visitCount < 1) {
    state.visitCount = 1;
    saveState();
  }

  return CONTENT.visitStages.find((stage) => state.visitCount <= stage.maxVisits)
    || CONTENT.visitStages.at(-1);
}

const visitStage = registerVisit();

const elements = {
  motionModeButton: document.querySelector("#motionModeButton"),
  cinematicScrollGrid: document.querySelector("#cinematicScrollGrid"),
  cinematicStage: document.querySelector("#cinematicStage"),
  cinematicFrame: document.querySelector("#cinematicFrame"),
  cinematicLayerA: document.querySelector("#cinematicLayerA"),
  cinematicLayerB: document.querySelector("#cinematicLayerB"),
  cinematicActLabel: document.querySelector("#cinematicActLabel"),
  cinematicShortLine: document.querySelector("#cinematicShortLine"),
  cinematicFrameStatus: document.querySelector("#cinematicFrameStatus"),
  cinematicRetry: document.querySelector("#cinematicRetry"),
  cinematicProgress: document.querySelector("#cinematicProgress"),
  cinematicBeats: [...document.querySelectorAll(".cinematic-beat")],
  cinematicInspectButton: document.querySelector("#cinematicInspectButton"),
  cinematicInspectDialog: document.querySelector("#cinematicInspectDialog"),
  cinematicInspectClose: document.querySelector("#cinematicInspectClose"),
  cinematicInspectAct: document.querySelector("#cinematicInspectAct"),
  cinematicInspectTitle: document.querySelector("#cinematicInspectTitle"),
  cinematicInspectViewport: document.querySelector("#cinematicInspectViewport"),
  cinematicInspectCanvas: document.querySelector("#cinematicInspectCanvas"),
  cinematicInspectImage: document.querySelector("#cinematicInspectImage"),
  cinematicInspectHotspots: document.querySelector("#cinematicInspectHotspots"),
  cinematicCharacterHotspot: document.querySelector("#cinematicCharacterHotspot"),
  cinematicInspectError: document.querySelector("#cinematicInspectError"),
  cinematicInspectFallback: document.querySelector("#cinematicInspectFallback"),
  cinematicInspectRetry: document.querySelector("#cinematicInspectRetry"),
  cinematicZoomOut: document.querySelector("#cinematicZoomOut"),
  cinematicZoomIn: document.querySelector("#cinematicZoomIn"),
  cinematicZoomStatus: document.querySelector("#cinematicZoomStatus"),
  cinematicInspectReset: document.querySelector("#cinematicInspectReset"),
  cinematicInspectJapanese: document.querySelector("#cinematicInspectJapanese"),
  cinematicInspectChinese: document.querySelector("#cinematicInspectChinese"),
  cinematicInspectPlayback: document.querySelector("#cinematicInspectPlayback"),
  cinematicVoiceToggle: document.querySelector("#cinematicVoiceToggle"),
  cinematicFoleyToggle: document.querySelector("#cinematicFoleyToggle"),
  cinematicVoiceStop: document.querySelector("#cinematicVoiceStop"),
  doorScene: document.querySelector("#doorScene"),
  doorLeaf: document.querySelector("#doorLeaf"),
  knockButton: document.querySelector("#knockButton"),
  doorStatus: document.querySelector("#doorStatus"),
  doorHanger: document.querySelector(".door-hanger"),
  visitNote: document.querySelector("#visitNote"),
  doorMemorySlip: document.querySelector("#doorMemorySlip"),
  heroMobileSource: document.querySelector("#heroMobileSource"),
  heroDesktopSource: document.querySelector("#heroDesktopSource"),
  heroCharacter: document.querySelector("#heroCharacter"),
  feedbackDock: document.querySelector("#feedbackDock"),
  feedbackCollapseButton: document.querySelector("#feedbackCollapseButton"),
  reactionCorner: document.querySelector("#reactionCorner"),
  reactionImage: document.querySelector("#reactionImage"),
  reactionLabel: document.querySelector("#reactionLabel"),
  reactionText: document.querySelector("#reactionText"),
  subtitleBar: document.querySelector("#subtitleBar"),
  subtitleScene: document.querySelector("#subtitleScene"),
  subtitleJapanese: document.querySelector("#subtitleJapanese"),
  subtitleChinese: document.querySelector("#subtitleChinese"),
  voicePlaybackState: document.querySelector("#voicePlaybackState"),
  voiceVolume: document.querySelector("#voiceVolume"),
  voiceMuteButton: document.querySelector("#voiceMuteButton"),
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
  secretHint: document.querySelector("#secretHint"),
  deskBoard: document.querySelector(".desk-board"),
  secretMessage: document.querySelector("#secretMessage"),
  secretMessageText: document.querySelector("#secretMessage p"),
  storySection: document.querySelector("#drawing-story"),
  storyTheater: document.querySelector("#storyTheater"),
  storyStage: document.querySelector("#storyStage"),
  storyStageImage: document.querySelector("#storyStageImage"),
  studioRainCanvas: document.querySelector("#studioRainCanvas"),
  storyStageLabel: document.querySelector("#storyStageLabel"),
  storyStageNote: document.querySelector("#storyStageNote"),
  storyPeek: document.querySelector("#storyPeek"),
  storyPeekPaper: document.querySelector("#storyPeekPaper"),
  storyPeekImage: document.querySelector("#storyPeekImage"),
  storyPeekButton: document.querySelector("#storyPeekButton"),
  storyBeat: document.querySelector("#storyBeat"),
  storyPrompt: document.querySelector("#storyPrompt"),
  storyLine: document.querySelector("#storyLine"),
  storyChoices: document.querySelector("#storyChoices"),
  storyBack: document.querySelector("#storyBack"),
  storyRestart: document.querySelector("#storyRestart"),
  storyArtPreview: document.querySelector("#storyArtPreview"),
  storyArtImage: document.querySelector("#storyArtImage"),
  storyArtTitle: document.querySelector("#storyArtTitle"),
  storyArtMeta: document.querySelector("#storyArtMeta"),
  storyMemory: document.querySelector("#storyMemory"),
  storyMemoryImage: document.querySelector("#storyMemoryImage"),
  storyMemoryTitle: document.querySelector("#storyMemoryTitle"),
  storyMemoryText: document.querySelector("#storyMemoryText"),
  quietCompanion: document.querySelector("#quietCompanion"),
  quietTime: document.querySelector("#quietTime"),
  quietCompanionTitle: document.querySelector("#quietCompanionTitle"),
  quietCompanionLine: document.querySelector("#quietCompanionLine"),
  quietContinue: document.querySelector("#quietContinue"),
  quietBeats: [...document.querySelectorAll("[data-quiet-beat]")],
  livingRoom: document.querySelector("#living-room"),
  livingRoomStage: document.querySelector("#livingRoomStage"),
  livingRoomView: document.querySelector(".living-room-view"),
  livingRoomImage: document.querySelector("#livingRoomImage"),
  livingRainCanvas: document.querySelector("#livingRainCanvas"),
  livingRoomTime: document.querySelector("#livingRoomTime"),
  livingWeatherToggle: document.querySelector("#livingWeatherToggle"),
  livingSoundToggle: document.querySelector("#livingSoundToggle"),
  livingRoomCaption: document.querySelector("#livingRoomCaption"),
  livingRoomAmbient: document.querySelector("#livingRoomAmbient"),
  livingPlaceTitle: document.querySelector("#livingPlaceTitle"),
  livingPlaceLine: document.querySelector("#livingPlaceLine"),
  livingPlaceQuote: document.querySelector("#livingPlaceQuote"),
  livingEventButton: document.querySelector("#livingEventButton"),
  livingVoiceButton: document.querySelector("#livingVoiceButton"),
  livingDeepLink: document.querySelector("#livingDeepLink"),
  livingPlaceButtons: [...document.querySelectorAll("[data-living-place]")],
  livingRoomStatus: document.querySelector("#livingRoomStatus"),
  livingDrawingMemory: document.querySelector("#livingDrawingMemory"),
  livingDrawingMemoryImage: document.querySelector("#livingDrawingMemoryImage"),
  livingDrawingMemoryLabel: document.querySelector("#livingDrawingMemoryLabel"),
  galleryStage: document.querySelector("#galleryStage"),
  galleryMainImage: document.querySelector("#galleryMainImage"),
  galleryIndex: document.querySelector("#galleryIndex"),
  galleryChapter: document.querySelector("#galleryChapter"),
  galleryCaption: document.querySelector("#galleryCaption"),
  galleryNote: document.querySelector("#galleryNote"),
  galleryChapters: document.querySelector("#galleryChapters"),
  galleryThumbs: document.querySelector("#galleryThumbs"),
  galleryPrev: document.querySelector("#galleryPrev"),
  galleryNext: document.querySelector("#galleryNext"),
  galleryOpenButton: document.querySelector("#galleryOpenButton"),
  galleryLightbox: document.querySelector("#galleryLightbox"),
  lightboxClose: document.querySelector("#lightboxClose"),
  lightboxStage: document.querySelector("#lightboxStage"),
  lightboxPrev: document.querySelector("#lightboxPrev"),
  lightboxNext: document.querySelector("#lightboxNext"),
  lightboxImageButton: document.querySelector("#lightboxImageButton"),
  lightboxImage: document.querySelector("#lightboxImage"),
  lightboxChapter: document.querySelector("#lightboxChapter"),
  lightboxIndex: document.querySelector("#lightboxIndex"),
  lightboxTitle: document.querySelector("#lightboxTitle"),
  lightboxNote: document.querySelector("#lightboxNote"),
  lightboxZoomHint: document.querySelector("#lightboxZoomHint"),
  goodnightSection: document.querySelector("#goodnight"),
  fortuneLabel: document.querySelector("#fortuneLabel"),
  fortuneNote: document.querySelector("#fortuneNote strong"),
  fortuneButton: document.querySelector("#fortuneButton"),
  copyFortuneButton: document.querySelector("#copyFortuneButton"),
  takeNoteButton: document.querySelector("#takeNoteButton"),
  goodnightStatus: document.querySelector("#goodnightStatus")
};

let doorOpened = false;
let doorOpeningPromise = null;
let heroSequence = 0;
let outfitSequence = 0;
let gallerySequence = 0;
let galleryPosition = state.galleryIndex;
let voiceSequence = 0;
let lastFortune = 0;
let feedbackTimer = 0;
let secretHintTimer = 0;
let secretMissCount = 0;
let activeVoiceScene = "";
let lightboxPointerStart = null;
let storyStep = -1;
let storyBusy = false;
let storyFrameSequence = 0;
let storyBlinkTimer = 0;
let storyInView = false;
let storyDraft = { presence: "", subject: "", palette: "", praise: "" };
let storyPeekSequence = 0;
let storyPeekCount = 0;
let quietTimer = 0;
let quietActive = false;
let quietElapsedMs = 0;
let quietLastTickAt = 0;
let quietRenderedBeat = -1;
let quietSavedBucket = -1;
let livingFrameSequence = 0;
let livingAutonomyTimer = 0;
let livingMomentTimer = 0;
let livingInView = false;
let livingPointerStart = null;
let cinematicDirector = null;
let activeVoicePlayer = null;
let activeRoomFxPlayer = null;
let roomFxSequence = 0;
const livingMomentIndexes = new Map();
const livingAmbientIndexes = new Map();
const voicePlayers = new Map();
const roomFxPlayers = new Map();
const preparedAudioSources = new Map();
const lastVoiceReplies = new Map();
const voiceReplyQueues = new Map();
const lastGuardedVoiceReplies = new Map();
const guardedVoiceReplyQueues = new Map();
const voicePressStates = new Map();
const VOICE_GUARD_WINDOW_MS = 5000;
const VOICE_GUARD_THRESHOLD = 4;
const VOICE_GUARD_COOLDOWN_MS = 25000;

const ROOM_FX_VOLUME = 0.62;

const RAIN_GLASS_SCENES = {
  desk: {
    seed: 1103,
    source: [1448, 1086],
    panes: [
      { points: [[1205, 2], [1343, 2], [1343, 151], [1205, 151]] },
      { points: [[1371, 2], [1446, 2], [1446, 151], [1371, 151]] },
      { points: [[1207, 184], [1342, 184], [1342, 267], [1207, 267]] }
    ]
  },
  wardrobe: {
    seed: 2707,
    source: [1448, 1086],
    panes: [
      { points: [[1247, 2], [1282, 2], [1282, 86], [1218, 86], [1231, 52]] },
      { points: [[1320, 2], [1446, 2], [1446, 87], [1320, 86]] },
      { points: [[1222, 108], [1281, 108], [1281, 249], [1266, 249], [1254, 208], [1238, 164]] },
      { points: [[1320, 108], [1446, 108], [1446, 244], [1320, 247]] }
    ]
  },
  window: {
    seed: 4613,
    source: [1364, 1023],
    panes: [
      { points: [[772, 2], [1011, 2], [1011, 198], [832, 242], [798, 146], [785, 75]] },
      { points: [[1094, 2], [1362, 2], [1362, 219], [1094, 279]] },
      { points: [[1094, 299], [1362, 239], [1362, 559], [1094, 559]] }
    ]
  }
};

class WindowRain {
  constructor({ canvas, image, scene, active, seedOffset = 0 }) {
    this.canvas = canvas;
    this.image = image;
    this.scene = scene;
    this.active = active;
    this.seedOffset = seedOffset;
    this.context = canvas.getContext("2d", { alpha: true });
    this.seed = 1;
    this.panes = [];
    this.drops = [];
    this.beads = [];
    this.lastFrame = 0;
    this.resize = this.resize.bind(this);
    this.draw = this.draw.bind(this);
    image.addEventListener("load", this.resize);
    new ResizeObserver(this.resize).observe(canvas.parentElement);
    new MutationObserver(this.resize).observe(canvas.parentElement, {
      attributes: true,
      attributeFilter: ["data-place", "data-weather"]
    });
    this.resize();
    window.requestAnimationFrame(this.draw);
  }

  random() {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (!width || !height) return;
    const density = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(width * density);
    this.canvas.height = Math.round(height * density);
    this.context.setTransform(density, 0, 0, density, 0, 0);
    const config = this.scene();
    if (!config) {
      this.panes = [];
      return;
    }
    const [sourceWidth, sourceHeight] = config.source;
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;
    const position = getComputedStyle(this.image).objectPosition.split(" ");
    const positionX = Number.parseFloat(position[0]) / 100 || 0.5;
    const positionY = Number.parseFloat(position[1] || position[0]) / 100 || 0.5;
    const offsetX = (width - renderedWidth) * positionX;
    const offsetY = (height - renderedHeight) * positionY;
    this.panes = config.panes.map((pane) => {
      const sourcePoints = pane.points || [
        [pane.x, pane.y],
        [pane.x + pane.width, pane.y],
        [pane.x + pane.width, pane.y + pane.height],
        [pane.x, pane.y + pane.height]
      ];
      const points = sourcePoints.map(([x, y]) => ({
        x: offsetX + x * scale,
        y: offsetY + y * scale
      }));
      const horizontal = points.map((point) => point.x);
      const vertical = points.map((point) => point.y);
      const x = Math.min(...horizontal);
      const y = Math.min(...vertical);
      return {
        points,
        x,
        y,
        width: Math.max(...horizontal) - x,
        height: Math.max(...vertical) - y
      };
    }).filter((pane) => pane.width > 2 && pane.height > 2);
    this.seed = config.seed + this.seedOffset;
    this.drops = [];
    this.beads = [];
    this.panes.forEach((pane, paneIndex) => {
      const area = pane.width * pane.height;
      const dropCount = Math.max(3, Math.min(15, Math.round(area / 2100)));
      const beadCount = Math.max(2, Math.min(8, Math.round(area / 4800)));
      for (let index = 0; index < dropCount; index += 1) {
        this.drops.push({
          paneIndex,
          x: 0.05 + this.random() * 0.9,
          y: this.random() * 1.15 - 0.15,
          speed: 0.32 + this.random() * 0.68,
          length: 8 + this.random() * 23,
          width: 0.55 + this.random() * 0.7,
          alpha: 0.13 + this.random() * 0.25,
          slant: 0.06 + this.random() * 0.14,
          curve: (this.random() - 0.5) * 3.4,
          heavy: this.random() > 0.82
        });
      }
      for (let index = 0; index < beadCount; index += 1) {
        this.beads.push({
          paneIndex,
          x: 0.07 + this.random() * 0.86,
          y: 0.08 + this.random() * 0.84,
          radius: 0.55 + this.random() * 1.25,
          alpha: 0.1 + this.random() * 0.18
        });
      }
    });
  }

  draw(timestamp) {
    window.requestAnimationFrame(this.draw);
    if (timestamp - this.lastFrame < 33) return;
    const elapsed = Math.min((timestamp - this.lastFrame) / 1000, 0.08) || 0.033;
    this.lastFrame = timestamp;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
    if (!this.active() || reducedMotion.matches || document.visibilityState !== "visible") return;

    this.panes.forEach((pane, paneIndex) => {
      const context = this.context;
      context.save();
      context.beginPath();
      pane.points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.closePath();
      context.clip();
      context.fillStyle = "rgba(207, 232, 237, 0.018)";
      context.fillRect(pane.x, pane.y, pane.width, pane.height);
      context.lineCap = "round";

      this.beads.filter((bead) => bead.paneIndex === paneIndex).forEach((bead) => {
        const x = pane.x + bead.x * pane.width;
        const y = pane.y + bead.y * pane.height;
        context.beginPath();
        context.ellipse(x, y, bead.radius * 0.72, bead.radius, -0.12, 0, Math.PI * 2);
        context.fillStyle = `rgba(225, 241, 245, ${bead.alpha})`;
        context.fill();
        context.beginPath();
        context.arc(x - bead.radius * 0.2, y - bead.radius * 0.25, Math.max(0.28, bead.radius * 0.2), 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${bead.alpha * 0.72})`;
        context.fill();
      });

      this.drops.filter((drop) => drop.paneIndex === paneIndex).forEach((drop) => {
        drop.y += drop.speed * elapsed;
        if (drop.y > 1.18) {
          drop.y = -0.18 - this.random() * 0.32;
          drop.x = 0.05 + this.random() * 0.9;
        }
        const x = pane.x + drop.x * pane.width;
        const y = pane.y + drop.y * pane.height;
        const endX = x - drop.length * drop.slant;
        const endY = y + drop.length;
        context.beginPath();
        context.moveTo(x, y);
        context.quadraticCurveTo(
          x + drop.curve,
          y + drop.length * 0.52,
          endX,
          endY
        );
        context.lineWidth = drop.width * 2.25;
        context.strokeStyle = `rgba(94, 128, 151, ${drop.alpha * 0.28})`;
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
        context.quadraticCurveTo(
          x + drop.curve,
          y + drop.length * 0.52,
          endX,
          endY
        );
        context.lineWidth = drop.width;
        context.strokeStyle = `rgba(225, 241, 245, ${drop.alpha})`;
        context.stroke();
        if (drop.heavy) {
          context.beginPath();
          context.ellipse(endX, endY, drop.width * 1.15, drop.width * 1.6, -0.14, 0, Math.PI * 2);
          context.fillStyle = `rgba(226, 241, 245, ${drop.alpha * 0.78})`;
          context.fill();
        }
      });
      context.restore();
    });
  }
}

function setupWindowRain() {
  if (!elements.livingRainCanvas || !elements.studioRainCanvas || !("ResizeObserver" in window)) return;
  new WindowRain({
    canvas: elements.livingRainCanvas,
    image: elements.livingRoomImage,
    scene: () => RAIN_GLASS_SCENES[elements.livingRoomStage.dataset.place],
    seedOffset: 17,
    active: () => livingInView
      && !motionIsQuiet()
      && elements.livingRoomStage.dataset.weather === "rain"
      && elements.livingRoomStage.dataset.place !== "bed"
  });
  new WindowRain({
    canvas: elements.studioRainCanvas,
    image: elements.storyStageImage,
    scene: () => RAIN_GLASS_SCENES.desk,
    seedOffset: 809,
    active: () => storyInView && !motionIsQuiet() && state.livingWeather === "rain"
  });
}

function resetAudioPlayer(player) {
  player.pause();
  try {
    player.currentTime = 0;
  } catch {
    // 某些浏览器在媒体元数据尚未就绪时不允许重置时间。
  }
}

function applyPreparedAudioSource(file, player) {
  const source = preparedAudioSources.get(file);
  if (!source?.blobUrl || player.src === source.blobUrl) return;
  player.src = source.blobUrl;
  player.preload = "auto";
  player.load();
}

function warmAudioFile(file, player) {
  const existing = preparedAudioSources.get(file);
  if (existing) {
    if (existing.blobUrl) applyPreparedAudioSource(file, player);
    return;
  }

  if (window.location.protocol === "file:") {
    player.preload = "auto";
    player.load();
    return;
  }

  const source = { blobUrl: "", promise: null };
  source.promise = fetch(file, { cache: "force-cache", priority: "low" })
    .then((response) => {
      if (!response.ok) throw new Error(`音频请求失败：${response.status}`);
      return response.blob();
    })
    .then((blob) => {
      source.blobUrl = URL.createObjectURL(blob);
      if (player !== activeVoicePlayer && player !== activeRoomFxPlayer) {
        applyPreparedAudioSource(file, player);
      }
    })
    .catch(() => {
      player.preload = "auto";
      player.load();
    });
  preparedAudioSources.set(file, source);
}

function prepareVoiceFile(file) {
  if (!file) return null;
  let player = voicePlayers.get(file);
  if (player) return player;
  player = new Audio();
  player.preload = "none";
  player.src = file;
  player.dataset.sourceFile = file;
  player.playsInline = true;
  player.volume = state.voiceVolume;
  player.muted = state.voiceMuted;
  player.addEventListener("ended", handleVoiceEnded);
  player.addEventListener("error", handleVoiceError);
  voicePlayers.set(file, player);
  warmAudioFile(file, player);
  return player;
}

function prepareRoomFxFile(file) {
  if (!file) return null;
  let player = roomFxPlayers.get(file);
  if (player) return player;
  player = new Audio();
  player.preload = "none";
  player.src = file;
  player.dataset.sourceFile = file;
  player.playsInline = true;
  player.volume = ROOM_FX_VOLUME;
  player.muted = state.roomSoundMuted;
  roomFxPlayers.set(file, player);
  warmAudioFile(file, player);
  return player;
}

function preloadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(source);
    image.onerror = reject;
    image.src = source;
  });
}

function responsiveSourceSet(item) {
  const sources = [];
  if (item.small) sources.push(`${item.small} ${item.smallWidth || 560}w`);
  if (item.medium) sources.push(`${item.medium} ${item.mediumWidth || 1440}w`);
  if (item.image) sources.push(`${item.image} ${item.width || 1122}w`);
  return sources.join(", ");
}

function preloadResponsiveImage(item, sizes) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(item.image);
    image.onerror = reject;
    if (item.small) {
      image.srcset = responsiveSourceSet(item);
      image.sizes = sizes;
    }
    image.src = item.image;
  });
}

function setHeroExpression(key) {
  const expression = CONTENT.heroExpressions[key] || CONTENT.heroExpressions.peek;
  elements.heroMobileSource.srcset = expression.small;
  elements.heroDesktopSource.srcset = expression.medium;
  elements.heroCharacter.removeAttribute("srcset");
  elements.heroCharacter.src = expression.small;
  elements.heroCharacter.alt = expression.alt;
}

function applyVisitStage() {
  setHeroExpression("peek");
  elements.visitNote.textContent = visitStage.note;
  elements.doorHanger.textContent = visitStage.hanger;
  elements.doorStatus.querySelector("span").textContent = visitStage.lead;
  elements.doorStatus.querySelector("strong").textContent = visitStage.quote;
  elements.reactionText.textContent = visitStage.reaction;
  elements.secretMessageText.textContent = visitStage.secretMessage;
  refreshDoorMemory();
}

function rememberedRoomMoment(value = state.lastRoomMemory) {
  const memory = validLastRoomMemory(value);
  if (!memory) return null;
  const place = CONTENT.livingRoom.places[memory.place];
  return { ...memory, place, moment: place.moments[memory.momentIndex] };
}

function latestVisitMemory() {
  const candidates = [];
  if (state.keptFortune) candidates.push({ type: "fortune", at: state.keptFortuneAt || 0 });
  const drawing = validSharedDrawing(state.sharedDrawing);
  if (drawing) candidates.push({ type: "drawing", at: drawing.completedAt || 0 });
  const room = rememberedRoomMoment();
  if (room) candidates.push({ type: "room", at: room.rememberedAt || 0 });
  const outfit = validLastOutfitMemory(state.lastOutfitMemory);
  if (outfit) candidates.push({ type: "outfit", at: outfit.rememberedAt || 0 });
  return candidates.sort((first, second) => second.at - first.at)[0] || null;
}

function buildPersonalizedFortune() {
  const visitStartedAt = state.lastVisitAt || 0;
  const savedDrawing = validSharedDrawing(state.sharedDrawing);
  const savedRoom = rememberedRoomMoment();
  const savedOutfit = validLastOutfitMemory(state.lastOutfitMemory);
  const drawing = savedDrawing && savedDrawing.completedAt >= visitStartedAt ? savedDrawing : null;
  const room = savedRoom && savedRoom.rememberedAt >= visitStartedAt ? savedRoom : null;
  const outfitMemory = savedOutfit && savedOutfit.rememberedAt >= visitStartedAt ? savedOutfit : null;
  if (drawing && room) {
    const subject = CONTENT.drawingStory.subjects[drawing.subject];
    const praise = CONTENT.drawingStory.praises[drawing.praise];
    return `你${room.moment.memory}，还说${praise.memory}。那张${subject.label}……我会好好夹在画桌边。`;
  }
  if (drawing) {
    const subject = CONTENT.drawingStory.subjects[drawing.subject];
    const praise = CONTENT.drawingStory.praises[drawing.praise];
    return `那张${subject.label}还夹在画桌边。你说${praise.memory}……我没有忘。`;
  }
  if (room) return `上次你${room.moment.memory}。今天也谢谢你，没有弄出很大的声音。`;
  if (outfitMemory) {
    const outfit = CONTENT.outfits[outfitMemory.outfit];
    return `你替我选的${outfit.name}还放在最顺手的地方。下次……也可以再帮我看一眼。`;
  }
  const latest = latestVisitMemory();
  if (latest?.type === "drawing" && savedDrawing) {
    return `上次那张${CONTENT.drawingStory.subjects[savedDrawing.subject].label}还在。今晚，也可以再慢慢画一张。`;
  }
  if (latest?.type === "room" && savedRoom) return `我还记得你${savedRoom.moment.memory}。下次，也不用站得那么远。`;
  if (latest?.type === "outfit" && savedOutfit) return `上次选好的${CONTENT.outfits[savedOutfit.outfit].name}还放在这里。谢谢你有认真看。`;
  if (latest?.type === "fortune" && state.keptFortune) return state.keptFortune;
  return CONTENT.fortunes[0];
}

function refreshDoorMemory() {
  const memory = latestVisitMemory();
  elements.doorMemorySlip.hidden = !memory;
  if (!memory) return;
  const labels = {
    fortune: "上次收好的纸条，还夹在这里",
    drawing: "上次一起画的那张，还好好收着",
    room: "她好像记得上次那件小事",
    outfit: state.lastOutfitMemory
      ? `上次选的${CONTENT.outfits[state.lastOutfitMemory.outfit].name}，她没有换回去`
      : "上次选好的衣服，她没有换回去"
  };
  const label = labels[memory.type];
  elements.doorMemorySlip.querySelector("span").textContent = label;
}

function showDoorMemory() {
  const latest = latestVisitMemory();
  if (!latest) return;
  const roomMemory = rememberedRoomMoment();
  const drawing = validSharedDrawing(state.sharedDrawing);
  const outfitMemory = validLastOutfitMemory(state.lastOutfitMemory);
  let line = "";
  if (latest.type === "fortune") line = state.keptFortune;
  if (latest.type === "drawing" && drawing) {
    line = `上次那张${CONTENT.drawingStory.subjects[drawing.subject].label}……我有好好收起来。`;
  }
  if (latest.type === "room" && roomMemory) line = `上次你${roomMemory.moment.memory}。我没有忘记。`;
  if (latest.type === "outfit" && outfitMemory) line = `上次选的${CONTENT.outfits[outfitMemory.outfit].name}……今天也放在最顺手的地方。`;
  if (!line) return;
  elements.doorStatus.querySelector("span").textContent = "门牌下面露出一小截熟悉的纸角。";
  elements.doorStatus.querySelector("strong").textContent = `“${line}”`;
  updateReaction({ expression: "shy", label: "上次留下的纸角", text: "我、我只是还没来得及收进去。" }, false);
}

function sprinkle(origin) {
  if (motionIsQuiet()) return;
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

function collapseFeedback() {
  window.clearTimeout(feedbackTimer);
  elements.feedbackDock.classList.remove("is-peeking");
  document.body.classList.remove("feedback-active", "voice-feedback-active");
}

function settleFeedback(delay = 3200) {
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(collapseFeedback, delay);
}

function showFeedback(persistent = false) {
  if (elements.cinematicInspectDialog.open) return;
  window.clearTimeout(feedbackTimer);
  elements.feedbackDock.classList.add("is-peeking");
  document.body.classList.add("feedback-active");
  if (!persistent) settleFeedback();
}

function updateReaction(reaction, withConfetti = true, preserveSubtitles = false) {
  const next = typeof reaction === "string" ? CONTENT.reactions[reaction] : reaction;
  if (!next) return;
  elements.feedbackDock.classList.toggle("is-voice-context", preserveSubtitles);
  document.body.classList.toggle("voice-feedback-active", preserveSubtitles);
  if (!preserveSubtitles) {
    elements.subtitleScene.textContent = next.label;
    elements.subtitleJapanese.textContent = "";
    elements.subtitleChinese.textContent = next.text;
  }
  const expression = CONTENT.heroExpressions[next.expression] || CONTENT.heroExpressions.peek;
  elements.reactionImage.src = expression.small || expression.image;
  elements.reactionImage.alt = expression.alt;
  elements.reactionLabel.textContent = next.label;
  elements.reactionText.textContent = next.text;
  elements.reactionCorner.classList.remove("is-reacting");
  void elements.reactionCorner.offsetWidth;
  elements.reactionCorner.classList.add("is-reacting");
  showFeedback();
  if (withConfetti) sprinkle(reactionOrigin());
}

function livingPhase(now = new Date()) {
  const hour = now.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  if (hour >= 21 && hour < 24) return "night";
  return "late";
}

function refreshLivingTime() {
  const now = new Date();
  const phaseKey = livingPhase(now);
  const phase = CONTENT.livingRoom.phases[phaseKey];
  const time = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(now);
  elements.livingRoomTime.textContent = `现在 ${time} · ${phase.label}`;
  elements.livingRoomStage.dataset.phase = phaseKey;
}

function livingSourceSet(item) {
  return responsiveSourceSet(item);
}

function setLivingRoomImage(item) {
  if (!item) return;
  elements.livingRoomImage.srcset = livingSourceSet(item);
  elements.livingRoomImage.src = item.image;
  elements.livingRoomImage.alt = item.alt;
}

function preloadLivingFrame(item) {
  return new Promise((resolve, reject) => {
    if (!item?.image) {
      reject(new Error("缺少房间场景素材"));
      return;
    }
    const image = new Image();
    image.onload = () => resolve(item.image);
    image.onerror = reject;
    if (item.small) {
      image.srcset = livingSourceSet(item);
      image.sizes = "(max-width: 760px) calc(100vw - 2.5rem), (max-width: 1024px) 62vw, 760px";
    }
    image.src = item.image;
  });
}

function preloadLivingNeighbors(key) {
  const keys = Object.keys(CONTENT.livingRoom.places);
  const index = keys.indexOf(validLivingPlace(key));
  const neighbors = [
    keys[(index - 1 + keys.length) % keys.length],
    keys[(index + 1) % keys.length]
  ];
  neighbors.forEach((neighbor) => preloadLivingFrame(CONTENT.livingRoom.places[neighbor]).catch(() => {}));
}

function prepareLivingAudioForPlace(key) {
  const place = CONTENT.livingRoom.places[validLivingPlace(key)];
  if (!place) return;
  prepareVoiceFile(CONTENT.livingRoom.voices[place.voice]?.file);
  place.moments.forEach((moment) => {
    prepareVoiceFile(CONTENT.livingRoom.voices[moment.voice]?.file);
    prepareRoomFxFile(moment.sound);
  });
}

function prepareLivingAudioPreviewForPlace(key) {
  const place = CONTENT.livingRoom.places[validLivingPlace(key)];
  if (place) prepareVoiceFile(CONTENT.livingRoom.voices[place.voice]?.file);
}

function prepareLivingAudioNeighbors(key = state.livingPlace) {
  const keys = Object.keys(CONTENT.livingRoom.places);
  const index = Math.max(0, keys.indexOf(validLivingPlace(key)));
  [-1, 1].forEach((offset) => {
    const neighbor = keys[(index + offset + keys.length) % keys.length];
    prepareLivingAudioPreviewForPlace(neighbor);
  });
}

function prepareLivingWeatherAudio(weather = state.livingWeather) {
  const raining = validLivingWeather(weather) === "rain";
  const voice = raining ? "room-weather-rain" : "room-weather-clear";
  const sound = raining
    ? "assets/audio/v8/weather-rain-window.mp3"
    : "assets/audio/v8/weather-clear-window.mp3";
  prepareVoiceFile(CONTENT.livingRoom.voices[voice]?.file);
  prepareRoomFxFile(sound);
}

function prepareCurrentLivingAudio() {
  prepareLivingAudioForPlace(state.livingPlace);
  prepareLivingAudioNeighbors(state.livingPlace);
  prepareLivingWeatherAudio(state.livingWeather);
}

function refreshLivingSoundControl() {
  const soundOn = !state.roomSoundMuted;
  roomFxPlayers.forEach((player) => {
    player.muted = !soundOn;
  });
  elements.livingSoundToggle.setAttribute("aria-pressed", String(soundOn));
  elements.livingSoundToggle.setAttribute("aria-label", soundOn ? "关闭房间里的场景声" : "打开房间里的场景声");
  elements.livingSoundToggle.querySelector("span").textContent = soundOn ? "场景声 · 开" : "场景声 · 关";
}

function refreshLivingWeather() {
  const raining = state.livingWeather === "rain";
  elements.livingRoomStage.dataset.weather = state.livingWeather;
  elements.storyStage.dataset.weather = state.livingWeather;
  elements.livingWeatherToggle.setAttribute("aria-pressed", String(raining));
  elements.livingWeatherToggle.setAttribute("aria-label", raining ? "让房间窗外的细雨停一会儿" : "让房间窗外落一阵细雨");
  elements.livingWeatherToggle.querySelector("strong").textContent = raining ? "细雨" : "晴月";
  if (storyStep < 0) elements.storyStageLabel.textContent = raining ? "截稿前的雨夜" : "截稿前的晴夜";
}

function renderLivingDrawingMemory() {
  const memory = validSharedDrawing(state.sharedDrawing);
  if (!memory || state.livingPlace !== "desk") {
    elements.livingDrawingMemory.hidden = true;
    return;
  }
  const subject = CONTENT.drawingStory.subjects[memory.subject];
  const palette = CONTENT.drawingStory.palettes[memory.palette];
  elements.livingDrawingMemory.hidden = false;
  elements.livingDrawingMemoryImage.srcset = responsiveSourceSet(subject);
  elements.livingDrawingMemoryImage.sizes = "(max-width: 760px) 6.5rem, 9rem";
  elements.livingDrawingMemoryImage.src = subject.image;
  elements.livingDrawingMemoryImage.alt = `${subject.alt}，使用${palette.label}配色，放在画桌边保存`;
  elements.livingDrawingMemoryLabel.textContent = `上次一起画的 · ${subject.label}`;
  setStoryPaletteClass(elements.livingDrawingMemoryImage, memory.palette);
}

function applyLivingPlace(key) {
  const place = CONTENT.livingRoom.places[key];
  if (!place) return;
  const phase = CONTENT.livingRoom.phases[livingPhase()];
  setLivingRoomImage(place);
  elements.livingRoomStage.dataset.place = key;
  elements.livingRoomStage.classList.remove("is-changing", "is-moment", "is-autonomous", "is-image-missing");
  elements.livingRoomCaption.textContent = place.label;
  const memory = rememberedRoomMoment();
  elements.livingRoomAmbient.textContent = memory?.place === place
    ? `上次你${memory.moment.memory}。${phase.note}`
    : `${place.ambient[0]} ${phase.note}`;
  elements.livingPlaceTitle.textContent = place.title;
  elements.livingPlaceLine.textContent = place.line;
  elements.livingPlaceQuote.textContent = place.quote;
  elements.livingEventButton.querySelector("span").textContent = place.action;
  elements.livingVoiceButton.querySelector("span").textContent = place.voiceLabel;
  elements.livingVoiceButton.setAttribute("aria-label", `听纱雾说说${place.label}的事`);
  elements.livingDeepLink.href = place.deepLink;
  elements.livingDeepLink.textContent = place.deepLabel;
  elements.livingPlaceButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.livingPlace === key));
  });
  renderLivingDrawingMemory();
  if (place.autonomousFrame) preloadLivingFrame(place.autonomousFrame).catch(() => {});
  place.moments.forEach((moment) => {
    if (moment.frame && moment.frame !== "base") preloadLivingFrame(moment.frame).catch(() => {});
  });
}

async function switchLivingPlace(key, announce = true) {
  const nextKey = validLivingPlace(key);
  const place = CONTENT.livingRoom.places[nextKey];
  prepareLivingAudioForPlace(nextKey);
  const sequence = ++livingFrameSequence;
  window.clearTimeout(livingAutonomyTimer);
  window.clearTimeout(livingMomentTimer);
  elements.livingRoomStage.classList.add("is-changing");
  try {
    await preloadLivingFrame(place);
  } catch {
    if (sequence === livingFrameSequence) {
      state.livingPlace = nextKey;
      saveState();
      applyLivingPlace(nextKey);
      elements.livingRoomStage.classList.remove("is-changing");
      elements.livingRoomStage.classList.add("is-image-missing");
      elements.livingRoomStatus.textContent = `${place.label}的插画暂时没有加载出来，地点文字和入口仍然可以使用。`;
    }
    return;
  }
  if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 120));
  if (sequence !== livingFrameSequence) return;
  state.livingPlace = nextKey;
  saveState();
  applyLivingPlace(nextKey);
  window.setTimeout(() => {
    if (sequence === livingFrameSequence) elements.livingRoomStage.classList.remove("is-changing");
  }, reducedMotion.matches ? 10 : 360);
  if (announce) elements.livingRoomStatus.textContent = `已经移动到${place.label}。${place.title}`;
  preloadLivingNeighbors(nextKey);
  scheduleLivingAutonomy();
}

async function playRoomFx(file) {
  if (state.roomSoundMuted || !file) return;
  const sequence = ++roomFxSequence;
  if (activeRoomFxPlayer) resetAudioPlayer(activeRoomFxPlayer);
  const player = prepareRoomFxFile(file);
  if (!player) return;
  applyPreparedAudioSource(file, player);
  activeRoomFxPlayer = player;
  resetAudioPlayer(player);
  if (player.error || player.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) player.load();
  try {
    await player.play();
  } catch (error) {
    if (sequence !== roomFxSequence || error?.name === "AbortError") return;
    if (file.includes("/v19/foley/")) {
      elements.voicePlaybackState.textContent = "物件声暂时没有加载出来 · 角色回应与画面仍然保留";
    } else if (file === CONTENT.goodnight.doorSound) {
      elements.goodnightStatus.textContent = "纸条已经收好，门也已经合上；只是这次木门声没有加载出来。";
    } else {
      elements.livingRoomStatus.textContent = "场景声暂时没有加载出来，画面与文字反馈仍然保留。";
    }
  }
}

function runLivingMoment() {
  const key = state.livingPlace;
  const place = CONTENT.livingRoom.places[key];
  if (!place) return;
  const index = livingMomentIndexes.get(key) || 0;
  const moment = place.moments[index % place.moments.length];
  livingMomentIndexes.set(key, index + 1);
  window.clearTimeout(livingAutonomyTimer);
  window.clearTimeout(livingMomentTimer);
  elements.livingRoomStage.classList.remove("is-moment");
  void elements.livingRoomStage.offsetWidth;
  elements.livingRoomStage.classList.add("is-moment");
  elements.livingPlaceLine.textContent = moment.line;
  elements.livingRoomAmbient.textContent = place.ambient[(index + 1) % place.ambient.length];
  if (moment.frame === "base") setLivingRoomImage(place);
  else if (moment.frame) setLivingRoomImage(moment.frame);

  let momentLine = moment.line;
  if (key === "window" && index % place.moments.length === 1 && !validSharedDrawing(state.sharedDrawing)) {
    momentLine = "她把一张月亮小猫速写靠在窗边，让画里的夜色和外面排在一起。";
    elements.livingPlaceLine.textContent = momentLine;
  }
  playRoomFx(moment.sound);
  playLivingVoice(moment.voice);
  state.lastRoomMemory = {
    place: key,
    momentIndex: index % place.moments.length,
    rememberedAt: Date.now()
  };
  saveState();
  refreshDoorMemory();
  refreshPersonalizedFortune();
  elements.livingRoomStatus.textContent = `${place.label}：${momentLine}`;
  livingMomentTimer = window.setTimeout(() => {
    elements.livingRoomStage.classList.remove("is-moment");
    scheduleLivingAutonomy();
  }, reducedMotion.matches ? 20 : 2100);
}

function scheduleLivingAutonomy() {
  window.clearTimeout(livingAutonomyTimer);
  if (!livingInView || motionIsQuiet() || document.visibilityState !== "visible") return;
  livingAutonomyTimer = window.setTimeout(() => {
    const key = state.livingPlace;
    const place = CONTENT.livingRoom.places[key];
    const index = (livingAmbientIndexes.get(key) || 0) + 1;
    livingAmbientIndexes.set(key, index);
    elements.livingRoomAmbient.textContent = place.ambient[index % place.ambient.length];
    elements.livingRoomStage.classList.add("is-autonomous");
    if (place.autonomousFrame) setLivingRoomImage(place.autonomousFrame);
    window.setTimeout(() => {
      if (state.livingPlace !== key) return;
      if (place.autonomousFrame) setLivingRoomImage(place);
      elements.livingRoomStage.classList.remove("is-autonomous");
      scheduleLivingAutonomy();
    }, place.autonomousDuration || 1800);
  }, 5600 + Math.random() * 3600);
}

function toggleLivingWeather() {
  state.livingWeather = state.livingWeather === "rain" ? "clear" : "rain";
  saveState();
  refreshLivingWeather();
  const raining = state.livingWeather === "rain";
  updateReaction({ expression: "shy", label: "窗外的小天气", text: raining ? "雨声小一点的时候，比较容易专心。" : "月亮出来了……窗帘可以再留一条缝。" }, false);
  playRoomFx(raining ? "assets/audio/v8/weather-rain-window.mp3" : "assets/audio/v8/weather-clear-window.mp3");
  playLivingVoice(raining ? "room-weather-rain" : "room-weather-clear");
  elements.livingRoomStatus.textContent = raining ? "房间窗外落起一阵细雨。" : "房间窗外的雨停了，露出一小片晴月。";
}

function toggleLivingSound() {
  state.roomSoundMuted = !state.roomSoundMuted;
  if (state.roomSoundMuted && activeRoomFxPlayer) resetAudioPlayer(activeRoomFxPlayer);
  saveState();
  refreshLivingSoundControl();
  elements.livingRoomStatus.textContent = state.roomSoundMuted ? "房间场景声已经关闭。" : "房间场景声已经打开，仍然只在操作后播放。";
  if (elements.cinematicInspectDialog.open) return;
  updateReaction({
    expression: "peek",
    label: "房间里的场景声",
    text: state.roomSoundMuted ? "安静看也可以，所有文字反馈都会保留。" : "只在你碰到物件时，才会轻轻响一下。"
  }, false);
}

function moveLivingPlace(direction) {
  const keys = Object.keys(CONTENT.livingRoom.places);
  const index = keys.indexOf(state.livingPlace);
  const next = (index + direction + keys.length) % keys.length;
  switchLivingPlace(keys[next]);
  elements.livingPlaceButtons[next]?.focus({ preventScroll: true });
}

function handleLivingTrackKey(event) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  moveLivingPlace(event.key === "ArrowRight" ? 1 : -1);
}

function startLivingSwipe(event) {
  livingPointerStart = { x: event.clientX, y: event.clientY };
  if (elements.livingRoomView.setPointerCapture && event.pointerId >= 0) {
    elements.livingRoomView.setPointerCapture(event.pointerId);
  }
}

function finishLivingSwipe(event) {
  if (!livingPointerStart) return;
  const horizontal = event.clientX - livingPointerStart.x;
  const vertical = event.clientY - livingPointerStart.y;
  livingPointerStart = null;
  if (elements.livingRoomView.hasPointerCapture?.(event.pointerId)) {
    elements.livingRoomView.releasePointerCapture(event.pointerId);
  }
  if (Math.abs(horizontal) < 55 || Math.abs(horizontal) <= Math.abs(vertical)) return;
  moveLivingPlace(horizontal < 0 ? 1 : -1);
}

function setupLivingRoom() {
  refreshLivingTime();
  refreshLivingWeather();
  refreshLivingSoundControl();
  applyLivingPlace(state.livingPlace);
  window.setInterval(refreshLivingTime, 60000);
  if (!("IntersectionObserver" in window)) {
    livingInView = true;
    elements.livingRoom.classList.add("is-in-view");
    preloadLivingNeighbors(state.livingPlace);
    scheduleLivingAutonomy();
    return;
  }
  const observer = new IntersectionObserver(([entry]) => {
    livingInView = entry.isIntersecting;
    elements.livingRoom.classList.toggle("is-in-view", livingInView);
    if (livingInView) {
      preloadLivingNeighbors(state.livingPlace);
      scheduleLivingAutonomy();
    } else {
      window.clearTimeout(livingAutonomyTimer);
      elements.livingRoomStage.classList.remove("is-autonomous");
    }
  }, { threshold: 0.24 });
  observer.observe(elements.livingRoom);
}

function openDoor() {
  if (doorOpeningPromise) return doorOpeningPromise;
  if (doorOpened) {
    updateReaction({ expression: "shy", label: "门已经开着", text: visitStage.openReaction }, false);
    return Promise.resolve();
  }
  doorOpened = true;
  prepareCurrentLivingAudio();
  const sequence = ++heroSequence;
  elements.visitNote.textContent = visitStage.note;
  elements.takeNoteButton.disabled = false;
  elements.takeNoteButton.querySelector("span").textContent = "收下纸条，轻轻带上门";
  elements.doorScene.classList.remove("is-goodnight-closed");
  elements.doorScene.classList.add("is-startled");
  elements.knockButton.setAttribute("aria-expanded", "true");
  elements.knockButton.disabled = true;
  elements.knockButton.querySelector("span").textContent = "门正在打开";
  elements.doorStatus.innerHTML = "<span>她被吓了一小跳。</span><strong>“咿——！先、先等一下……”</strong>";
  setHeroExpression("startled");
  updateReaction("knock");

  doorOpeningPromise = new Promise((resolve) => {
    window.setTimeout(() => {
      if (sequence === heroSequence) {
        elements.doorScene.classList.add("is-open");
        elements.doorScene.classList.remove("is-startled");
        elements.knockButton.querySelector("span").textContent = "门已经打开啦";
        elements.doorStatus.querySelector("span").textContent = visitStage.openLead;
        elements.doorStatus.querySelector("strong").textContent = visitStage.openQuote;
        setHeroExpression("shy");
        updateReaction({ expression: "shy", label: "门打开以后", text: visitStage.openReaction }, false);
      }
      window.setTimeout(() => {
        doorOpeningPromise = null;
        resolve();
      }, reducedMotion.matches ? 20 : 1100);
    }, reducedMotion.matches ? 20 : 760);
  });
  return doorOpeningPromise;
}

function refreshVoiceControls() {
  elements.voiceVolume.value = String(state.voiceVolume);
  elements.voiceMuteButton.setAttribute("aria-pressed", String(state.voiceMuted));
  elements.voiceMuteButton.querySelector("span").textContent = state.voiceMuted ? "恢复角色语音" : "只看角色字幕";
  elements.voiceMuteButton.setAttribute("aria-label", state.voiceMuted ? "恢复角色语音" : "关闭角色语音，只看角色字幕");
  voicePlayers.forEach((player) => {
    player.volume = state.voiceVolume;
    player.muted = state.voiceMuted;
  });
}

function stopVoice(keepSubtitle = true, keepDock = false, announceStop = false) {
  voiceSequence += 1;
  if (activeVoicePlayer) resetAudioPlayer(activeVoicePlayer);
  elements.stopVoiceButton.hidden = true;
  if (announceStop) elements.voicePlaybackState.textContent = "已经停下 · 字幕仍保留";
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

function chooseGuardedVoiceReply(line) {
  let queue = guardedVoiceReplyQueues.get(line.id);
  if (!queue?.length) {
    queue = shuffledReplyIndexes(line.guardedReplies.length);
    const previous = lastGuardedVoiceReplies.get(line.id);
    const nextIndex = queue.length - 1;
    if (queue.length > 1 && queue[nextIndex] === previous) {
      const swapIndex = queue.findIndex((index) => index !== previous);
      [queue[nextIndex], queue[swapIndex]] = [queue[swapIndex], queue[nextIndex]];
    }
  }
  const replyIndex = queue.pop();
  guardedVoiceReplyQueues.set(line.id, queue);
  lastGuardedVoiceReplies.set(line.id, replyIndex);
  return line.guardedReplies[replyIndex];
}

function shouldUseGuardedReply(line, now = Date.now()) {
  if (!line.guardedReplies?.length) return false;

  const current = voicePressStates.get(line.id) || { presses: [], cooldownUntil: 0 };
  if (now < current.cooldownUntil) {
    current.presses = [];
    voicePressStates.set(line.id, current);
    return false;
  }

  current.presses = current.presses.filter((pressedAt) => now - pressedAt <= VOICE_GUARD_WINDOW_MS);
  current.presses.push(now);
  if (current.presses.length >= VOICE_GUARD_THRESHOLD) {
    current.presses = [];
    current.cooldownUntil = now + VOICE_GUARD_COOLDOWN_MS;
    voicePressStates.set(line.id, current);
    return true;
  }

  voicePressStates.set(line.id, current);
  return false;
}

async function playLivingVoice(replyId) {
  const reply = CONTENT.livingRoom.voices[replyId];
  if (!reply) return;
  const scene = reply.scene || CONTENT.livingRoom.places[state.livingPlace].label;

  stopVoice(true, true);
  const sequence = voiceSequence;
  elements.subtitleScene.textContent = `${scene} · ${reply.label}`;
  elements.subtitleJapanese.textContent = reply.japanese;
  elements.subtitleChinese.textContent = reply.chinese;
  setHeroExpression(reply.expression);
  updateReaction({ expression: reply.expression, label: `她在${scene}小声回答`, text: reply.reaction }, false, true);
  showFeedback(true);
  activeVoiceScene = scene;

  if (state.voiceMuted) {
    elements.voicePlaybackState.textContent = `只显示字幕 · ${scene}`;
    elements.stopVoiceButton.hidden = true;
    settleFeedback(4600);
    return;
  }

  const player = prepareVoiceFile(reply.file);
  if (!player) return;
  applyPreparedAudioSource(reply.file, player);
  activeVoicePlayer = player;
  resetAudioPlayer(player);
  if (player.error || player.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) player.load();
  if (player.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
    elements.voicePlaybackState.textContent = `正在准备 · ${scene}`;
  }
  try {
    await player.play();
    if (sequence !== voiceSequence) return;
    elements.voicePlaybackState.textContent = `正在播放 · ${scene}`;
    elements.stopVoiceButton.hidden = false;
  } catch {
    if (sequence !== voiceSequence) return;
    elements.stopVoiceButton.hidden = true;
    elements.subtitleScene.textContent = `${scene} · 暂时没有声音`;
    elements.voicePlaybackState.textContent = "角色声音暂时没加载出来 · 可以继续看字幕";
    updateReaction("voiceError", false, true);
  }
}

async function playVoice(id) {
  const line = CONTENT.voiceLines[id];
  if (!line) return;
  const guarded = shouldUseGuardedReply(line);
  const reply = guarded ? chooseGuardedVoiceReply(line) : chooseVoiceReply(line);

  stopVoice(true, true);
  const sequence = voiceSequence;
  elements.subtitleScene.textContent = guarded ? `${line.scene} · 连续打扰以后 · ${reply.label}` : `${line.scene} · ${reply.label}`;
  elements.subtitleJapanese.textContent = reply.japanese;
  elements.subtitleChinese.textContent = reply.chinese;
  setHeroExpression(reply.expression);
  updateReaction({ expression: reply.expression, label: `${guarded ? "她有点闹别扭" : "她小声回答"} · ${reply.label}`, text: reply.reaction }, true, true);
  showFeedback(true);
  activeVoiceScene = line.scene;

  if (state.voiceMuted) {
    elements.voicePlaybackState.textContent = `只显示字幕 · ${line.scene}`;
    elements.stopVoiceButton.hidden = true;
    settleFeedback(4600);
    return;
  }

  const player = prepareVoiceFile(reply.file);
  if (!player) return;
  applyPreparedAudioSource(reply.file, player);
  activeVoicePlayer = player;
  resetAudioPlayer(player);
  if (player.error || player.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) player.load();
  if (player.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
    elements.voicePlaybackState.textContent = `正在准备 · ${line.scene}`;
  }
  try {
    await player.play();
    if (sequence !== voiceSequence) return;
    elements.voicePlaybackState.textContent = `正在播放 · ${line.scene}`;
    elements.stopVoiceButton.hidden = false;
  } catch {
    if (sequence !== voiceSequence) return;
    elements.stopVoiceButton.hidden = true;
    elements.subtitleScene.textContent = `${line.scene} · 暂时没有声音`;
    elements.voicePlaybackState.textContent = "声音暂时没加载出来 · 可以继续看字幕";
    updateReaction("voiceError", false, true);
  }
}

function cinematicFrameById(frameId) {
  for (const scene of CONTENT.cinematicScenes) {
    const frame = scene.frames.find((item) => item.id === frameId);
    if (frame) return frame;
  }
  return null;
}

function cinematicImageSource(frame, inspect = false) {
  const phone = window.matchMedia("(max-width: 760px)").matches;
  if (inspect) return phone ? frame.medium : frame.image;
  return phone ? frame.small : frame.medium;
}

const cinematicImageCache = new Map();

function decodeCinematicImage(frame, inspect = false) {
  const source = cinematicImageSource(frame, inspect);
  if (cinematicImageCache.has(source)) return cinematicImageCache.get(source);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      try {
        if (typeof image.decode === "function") await image.decode();
      } catch {
        // 已触发 load 的图片即使 decode 被浏览器拒绝，也可以安全显示。
      }
      resolve(source);
    };
    image.onerror = () => reject(new Error(`连续镜头加载失败：${source}`));
    image.src = source;
  });
  cinematicImageCache.set(source, promise);
  promise.catch(() => cinematicImageCache.delete(source));
  return promise;
}

async function playCinematicVoice(voiceId) {
  const reply = CONTENT.cinematicVoices[voiceId];
  if (!reply) return;
  stopVoice(true, true);
  const sequence = voiceSequence;
  elements.subtitleScene.textContent = `${reply.scene} · ${reply.label}`;
  elements.subtitleJapanese.textContent = reply.japanese;
  elements.subtitleChinese.textContent = reply.chinese;
  updateReaction({ expression: reply.expression, label: `${reply.scene}里，她小声回答`, text: reply.reaction }, state.motionMode === "lively", true);
  const reactionFrame = cinematicFrameById(reply.frame);
  if (reactionFrame) {
    elements.reactionImage.src = reactionFrame.small;
    elements.reactionImage.alt = reactionFrame.alt;
  }
  showFeedback(true);
  activeVoiceScene = reply.scene;

  if (state.voiceMuted) {
    elements.voicePlaybackState.textContent = `只显示字幕 · ${reply.scene}`;
    elements.stopVoiceButton.hidden = true;
    settleFeedback(4600);
    return;
  }

  const player = prepareVoiceFile(reply.file);
  if (!player) return;
  applyPreparedAudioSource(reply.file, player);
  activeVoicePlayer = player;
  resetAudioPlayer(player);
  if (player.error || player.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) player.load();
  if (player.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
    elements.voicePlaybackState.textContent = `正在准备 · ${reply.scene}`;
  }
  try {
    await player.play();
    if (sequence !== voiceSequence) return;
    elements.voicePlaybackState.textContent = `正在播放 · ${reply.scene}`;
    elements.stopVoiceButton.hidden = false;
  } catch {
    if (sequence !== voiceSequence) return;
    elements.stopVoiceButton.hidden = true;
    elements.subtitleScene.textContent = `${reply.scene} · 暂时没有声音`;
    elements.voicePlaybackState.textContent = "角色声音暂时没加载出来 · 可以继续看日文与中文字幕";
  }
}

function playCinematicInteraction(voiceId, foleyId, reactionFrame) {
  const foley = CONTENT.cinematicFoley[foleyId];
  if (foley) playRoomFx(foley.file);
  if (cinematicInspector && reactionFrame) cinematicInspector.showReactionFrame(reactionFrame);
  if (cinematicDirector && reactionFrame) cinematicDirector.flashReactionFrame(reactionFrame);
  cinematicDirector?.noteInteraction();
  playCinematicVoice(voiceId);
}

function motionIsQuiet() {
  return reducedMotion.matches || state.motionMode === "quiet";
}

function refreshMotionMode() {
  const systemReduced = reducedMotion.matches;
  document.body.dataset.motion = systemReduced ? "reduced" : state.motionMode;
  elements.motionModeButton.setAttribute("aria-pressed", String(state.motionMode === "quiet"));
  elements.motionModeButton.disabled = systemReduced;
  elements.motionModeButton.querySelector("span").textContent = systemReduced
    ? "系统正在减少动态"
    : state.motionMode === "quiet" ? "恢复房间活泼" : "让房间静一静";
  elements.motionModeButton.setAttribute("aria-label", systemReduced
    ? "系统已启用减少动态效果"
    : state.motionMode === "quiet" ? "恢复房间的连续镜头和自主小动作" : "让房间静一静，关闭连续镜头和自主小动作");
  if (motionIsQuiet()) {
    window.clearTimeout(storyBlinkTimer);
    window.clearTimeout(livingAutonomyTimer);
    elements.livingRoomStage.classList.remove("is-autonomous");
  } else {
    scheduleStoryBlink();
    scheduleLivingAutonomy();
  }
  cinematicDirector?.setMotionMode();
}

function toggleMotionMode() {
  state.motionMode = state.motionMode === "quiet" ? "lively" : "quiet";
  saveState();
  refreshMotionMode();
  updateReaction({
    expression: state.motionMode === "quiet" ? "shy" : "proud",
    label: "房间的动作",
    text: state.motionMode === "quiet" ? "嗯……这样安静一点，也很好。" : "又可以动起来了……不要一直盯着看。"
  }, false);
}

class CinematicDirector {
  constructor(scenes) {
    this.scenes = scenes;
    this.beats = elements.cinematicBeats;
    this.layers = [elements.cinematicLayerA, elements.cinematicLayerB];
    this.activeSceneIndex = 0;
    this.currentFrameIndex = 0;
    this.renderState = { sceneIndex: 0, progress: 0, currentIndex: 0, nextIndex: 0, mix: 0 };
    this.pairKey = "";
    this.requestedPairKey = "";
    this.nextReadyKey = "";
    this.pairAnimation = null;
    this.hasRendered = false;
    this.loadSequence = 0;
    this.autonomySequence = 0;
    this.autonomyCount = 0;
    this.autonomyTimer = 0;
    this.autonomyReturnTimer = 0;
    this.visible = false;
    this.dirty = true;
    this.raf = 0;
    this.dataSaver = Boolean(navigator.connection?.saveData)
      || ["slow-2g", "2g"].includes(navigator.connection?.effectiveType || "");
    this.onScroll = this.onScroll.bind(this);
    this.tick = this.tick.bind(this);
  }

  setup() {
    if (!elements.cinematicScrollGrid || !this.beats.length) return;
    this.layers[0].src = elements.heroCharacter.currentSrc || cinematicImageSource(this.scenes[0].frames[0]);
    elements.cinematicRetry.addEventListener("click", () => {
      this.pairKey = "";
      this.requestUpdate();
    });
    this.buildProgress();
    this.beats.forEach((beat, index) => {
      beat.style.setProperty("--frame-intervals", String(this.scenes[index].frames.length - 1));
    });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onScroll, { passive: true });
    if ("IntersectionObserver" in window) {
      this.sectionObserver = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible) {
          this.requestUpdate();
          this.scheduleAutonomy();
        } else {
          this.stopAutonomy();
        }
      }, { rootMargin: "0px", threshold: 0 });
      this.sectionObserver.observe(elements.cinematicScrollGrid);
    } else {
      this.visible = true;
      this.requestUpdate();
    }
  }

  buildProgress() {
    const fragment = document.createDocumentFragment();
    this.scenes.forEach((scene, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.sceneIndex = String(index);
      button.setAttribute("aria-label", `前往${scene.label}`);
      button.innerHTML = `<span>${index + 1}</span><i>${scene.label.split("·").at(-1).trim()}</i>`;
      button.addEventListener("click", () => {
        document.querySelector(`#${scene.sectionId}`)?.scrollIntoView({ behavior: motionIsQuiet() ? "auto" : "smooth", block: "center" });
      });
      fragment.append(button);
    });
    elements.cinematicProgress.replaceChildren(fragment);
  }

  onScroll() {
    this.scrolled = true;
    this.requestUpdate();
  }

  requestUpdate() {
    this.dirty = true;
    if (!this.raf) this.raf = window.requestAnimationFrame(this.tick);
  }

  tick() {
    this.raf = 0;
    if (!this.dirty) return;
    this.dirty = false;
    const gridBounds = elements.cinematicScrollGrid.getBoundingClientRect();
    this.visible = gridBounds.bottom > 0 && gridBounds.top < window.innerHeight;
    if (this.scrolled) {
      this.scrolled = false;
      this.autonomySequence += 1;
      this.autonomyCount = 0;
      this.stopAutonomy();
    }
    if (!this.visible || document.visibilityState !== "visible") {
      this.stopAutonomy();
      this.autonomySequence += 1;
      this.loadSequence += 1;
      this.requestedPairKey = "";
      return;
    }
    const focusLine = window.innerHeight * (window.innerWidth <= 760 ? 0.68 : 0.52);
    const selectionLine = focusLine + 2;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    this.beats.forEach((beat, index) => {
      const rect = beat.getBoundingClientRect();
      const distance = selectionLine < rect.top ? rect.top - selectionLine
        : selectionLine >= rect.bottom ? selectionLine - rect.bottom : 0;
      if (distance <= bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    const rect = this.beats[bestIndex].getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (focusLine - rect.top) / Math.max(1, rect.height)));
    this.render(bestIndex, progress);
  }

  render(sceneIndex, progress) {
    const scene = this.scenes[sceneIndex];
    if (!scene) return;
    const reduced = reducedMotion.matches;
    const quiet = state.motionMode === "quiet";
    let currentIndex = 0;
    for (let index = 0; index < scene.frames.length; index += 1) {
      if (progress >= scene.frames[index].at) currentIndex = index;
    }
    let nextIndex = Math.min(currentIndex + 1, scene.frames.length - 1);
    let mix = 0;
    if (reduced) {
      currentIndex = 0;
      nextIndex = 0;
    } else if (quiet) {
      nextIndex = currentIndex;
    } else if (nextIndex !== currentIndex) {
      const nextAt = scene.frames[nextIndex].at;
      const previousAt = scene.frames[currentIndex].at;
      const blendSpan = Math.min(0.14, Math.max(0.07, (nextAt - previousAt) * 0.46));
      const raw = Math.min(1, Math.max(0, (progress - (nextAt - blendSpan)) / blendSpan));
      mix = raw * raw * (3 - 2 * raw);
    }
    if (this.dataSaver && mix === 0) nextIndex = currentIndex;
    this.renderState = { sceneIndex, progress, currentIndex, nextIndex, mix };
    if (this.activeSceneIndex !== sceneIndex) {
      this.activeSceneIndex = sceneIndex;
      this.autonomyCount = 0;
      this.pairKey = "";
    }
    this.currentFrameIndex = currentIndex;
    this.updateCopy(scene, this.currentFrameIndex);
    this.updateCamera(scene, currentIndex, nextIndex, progress, mix);
    const nextScene = this.scenes[sceneIndex + 1];
    const boundaryProgress = !reduced && !quiet && nextScene && progress > 0.86
      ? Math.min(1, (progress - 0.86) / 0.14) : 0;
    elements.cinematicStage.classList.toggle("is-boundary", boundaryProgress > 0);
    this.renderState.boundaryProgress = boundaryProgress;
    this.presentPair(scene, currentIndex, nextIndex, mix, boundaryProgress > 0 ? nextScene.frames[0] : null);
    this.preloadAround(sceneIndex, this.currentFrameIndex);
    this.scheduleAutonomy();
  }

  updateCopy(scene, frameIndex) {
    const frame = scene.frames[frameIndex];
    elements.cinematicStage.dataset.scene = scene.id;
    elements.cinematicStage.dataset.frameKind = scene.frameKind;
    elements.cinematicStage.dataset.transition = scene.transition;
    elements.cinematicStage.dataset.frame = frame.id;
    elements.cinematicActLabel.textContent = scene.label;
    elements.cinematicShortLine.textContent = scene.shortLine;
    elements.cinematicFrameStatus.textContent = `${frameIndex + 1} / ${scene.frames.length} · ${frame.label}`;
    this.beats.forEach((beat, index) => beat.classList.toggle("is-active", index === this.activeSceneIndex));
    [...elements.cinematicProgress.children].forEach((button, index) => {
      button.classList.toggle("is-active", index === this.activeSceneIndex);
      if (index === this.activeSceneIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  updateCamera(scene, currentIndex, nextIndex, progress, mix) {
    const cameraSet = window.innerWidth <= 760 ? scene.camera.mobile : scene.camera.desktop;
    const from = cameraSet[currentIndex] || { x: 0, y: 0, scale: 1 };
    const to = cameraSet[nextIndex] || from;
    const interval = scene.frames[nextIndex].at - scene.frames[currentIndex].at;
    const intervalProgress = interval > 0 ? Math.min(1, Math.max(0, (progress - scene.frames[currentIndex].at) / interval)) : 0;
    const amount = motionIsQuiet() ? 0 : intervalProgress * intervalProgress * (3 - 2 * intervalProgress);
    const x = from.x + (to.x - from.x) * amount;
    const y = from.y + (to.y - from.y) * amount;
    const scale = from.scale + (to.scale - from.scale) * amount;
    const margin = Math.max(0, (scale - 1) * 50 - 0.15);
    elements.cinematicFrame.style.setProperty("--camera-x", `${Math.min(margin, Math.max(-margin, x))}%`);
    elements.cinematicFrame.style.setProperty("--camera-y", `${Math.min(margin, Math.max(-margin, y))}%`);
    elements.cinematicFrame.style.setProperty("--camera-scale", String(scale));
    elements.cinematicStage.style.setProperty("--scene-progress", String(progress));
  }

  async presentPair(scene, currentIndex, nextIndex, mix, boundaryFrame = null) {
    const current = scene.frames[currentIndex];
    const next = boundaryFrame || scene.frames[nextIndex];
    const key = `${cinematicImageSource(current)}:${cinematicImageSource(next)}:${state.motionMode}:${reducedMotion.matches}`;
    if (this.requestedPairKey !== key) {
      this.requestedPairKey = key;
      this.loadSequence += 1;
      if (this.pairKey === key && this.nextReadyKey !== key) this.pairKey = "";
      if (this.pairAnimation) {
        this.layers[0].src = this.layers[1].src;
        this.layers[0].style.opacity = "1";
        this.layers[1].style.opacity = "0";
      }
      this.pairAnimation?.cancel();
      this.pairAnimation = null;
    }
    if (this.pairKey === key) {
      if (!this.pairAnimation) this.paintMix(mix, current === next);
      return;
    }
    const sequence = this.loadSequence;
    try {
      const currentSource = await decodeCinematicImage(current);
      if (sequence !== this.loadSequence) return;
      const previousSource = Number(this.layers[1].style.opacity) > 0.5 ? this.layers[1].src : this.layers[0].src;
      this.pairAnimation?.cancel();
      this.pairAnimation = null;
      this.pairKey = key;
      this.nextReadyKey = current === next ? key : "";
      this.layers[0].removeAttribute("srcset");
      this.layers[1].removeAttribute("srcset");
      this.layers[0].src = currentSource;
      this.layers[0].alt = current.alt;
      this.layers[1].src = currentSource;
      this.layers[1].alt = "";
      elements.cinematicStage.classList.remove("is-image-missing");
      elements.cinematicRetry.hidden = true;
      if (state.motionMode === "quiet" && !reducedMotion.matches && this.hasRendered && previousSource !== this.layers[0].src) {
        this.layers[0].src = previousSource;
        this.layers[0].style.opacity = "1";
        this.layers[1].src = currentSource;
        const animation = this.layers[1].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out", fill: "forwards" });
        this.pairAnimation = animation;
        animation.onfinish = () => {
          if (sequence !== this.loadSequence) return;
          this.layers[0].src = currentSource;
          animation.cancel();
          this.pairAnimation = null;
          this.paintMix(0, true);
        };
        return;
      }
      this.hasRendered = true;
      this.paintMix(0, true);
      if (current !== next) {
        try {
          const nextSource = await decodeCinematicImage(next);
          if (sequence !== this.loadSequence) return;
          this.layers[1].src = nextSource;
          this.nextReadyKey = key;
          this.paintMix(this.renderState.mix, false);
        } catch {
          // 邻帧失败不遮住当前帧；下一次滚动或重试可重新准备邻帧。
          if (sequence === this.loadSequence) this.pairKey = "";
        }
      }
    } catch {
      if (sequence !== this.loadSequence) return;
      elements.cinematicStage.classList.add("is-image-missing");
      elements.cinematicFrameStatus.textContent = "插画暂时没有加载出来 · 文字仍可继续阅读";
      elements.cinematicRetry.hidden = false;
    }
  }

  paintMix(mix, sameFrame) {
    const boundary = this.renderState.boundaryProgress || 0;
    const amount = sameFrame || this.nextReadyKey !== this.pairKey ? 0 : boundary > 0 ? 1 : mix;
    this.layers[0].style.opacity = "1";
    this.layers[1].style.opacity = String(amount);
    this.layers[1].style.clipPath = boundary > 0
      ? elements.cinematicStage.dataset.transition.includes("paper")
        ? `inset(${(1 - boundary) * 100}% 0 0)`
        : `inset(0 0 0 ${(1 - boundary) * 100}%)`
      : "none";
  }

  preloadAround(sceneIndex, frameIndex) {
    if (this.dataSaver) return;
    const scene = this.scenes[sceneIndex];
    const nextFrame = scene?.frames[Math.min(frameIndex + 1, scene.frames.length - 1)];
    const nextScene = this.scenes[sceneIndex + 1];
    if (nextFrame && !reducedMotion.matches) decodeCinematicImage(nextFrame).catch(() => {});
    if (nextScene?.frames[0]) decodeCinematicImage(nextScene.frames[0]).catch(() => {});
  }

  stopAutonomy(clearReturn = true) {
    window.clearTimeout(this.autonomyTimer);
    this.autonomyTimer = 0;
    if (clearReturn) {
      window.clearTimeout(this.autonomyReturnTimer);
      this.autonomyReturnTimer = 0;
    }
    elements.cinematicStage.classList.remove("is-autonomous");
  }

  scheduleAutonomy() {
    window.clearTimeout(this.autonomyTimer);
    if (!this.visible || motionIsQuiet() || document.visibilityState !== "visible" || this.autonomyCount >= 3 || elements.cinematicInspectDialog.open) return;
    const sequence = this.autonomySequence;
    this.autonomyTimer = window.setTimeout(() => {
      if (sequence !== this.autonomySequence || motionIsQuiet() || !this.visible) return;
      const scene = this.scenes[this.activeSceneIndex];
      const reactionIndex = Math.min(this.currentFrameIndex + 1, scene.frames.length - 1);
      this.autonomyCount += 1;
      this.flashReactionFrame(scene.frames[reactionIndex].id, true);
      this.scheduleAutonomy();
    }, 4000 + Math.random() * 3000);
  }

  async flashReactionFrame(frameId, autonomous = false) {
    const frame = cinematicFrameById(frameId);
    if (!frame || !this.visible || !this.activeScene().frames.includes(frame) || elements.cinematicInspectDialog.open || motionIsQuiet() && autonomous) return;
    const sequence = ++this.autonomySequence;
    this.loadSequence += 1;
    this.requestedPairKey = "";
    try {
      const source = await decodeCinematicImage(frame);
      if (sequence !== this.autonomySequence) return;
      this.loadSequence += 1;
      this.pairKey = "";
      this.pairAnimation?.cancel();
      this.pairAnimation = null;
      this.layers[1].src = source;
      this.layers[1].style.opacity = "1";
      this.layers[1].style.clipPath = "none";
      elements.cinematicStage.classList.add("is-autonomous");
      window.clearTimeout(this.autonomyReturnTimer);
      this.autonomyReturnTimer = window.setTimeout(() => {
        if (sequence !== this.autonomySequence) return;
        elements.cinematicStage.classList.remove("is-autonomous");
        this.pairKey = "";
        this.requestUpdate();
      }, autonomous ? 520 : 900);
    } catch {
      // 自主小动作加载失败不影响主镜头。
    }
  }

  setMotionMode() {
    this.stopAutonomy();
    this.autonomySequence += 1;
    this.pairKey = "";
    this.requestedPairKey = "";
    this.loadSequence += 1;
    this.pairAnimation?.cancel();
    this.pairAnimation = null;
    this.requestUpdate();
    if (!motionIsQuiet()) this.scheduleAutonomy();
  }

  noteInteraction() {
    this.autonomyCount = 0;
    this.scheduleAutonomy();
  }

  handleVisibility() {
    if (document.visibilityState === "visible") {
      this.requestUpdate();
      this.scheduleAutonomy();
    } else {
      this.stopAutonomy();
      this.autonomySequence += 1;
    }
  }

  activeScene() {
    return this.scenes[this.activeSceneIndex] || this.scenes[0];
  }

  activeFrame() {
    const scene = this.activeScene();
    return scene.frames[this.currentFrameIndex] || scene.frames[0];
  }
}

class CinematicInspector {
  constructor() {
    this.scene = null;
    this.frame = null;
    this.inspectFrame = null;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.pointers = new Map();
    this.dragStart = null;
    this.pinchStart = null;
    this.returnFocus = null;
    this.scrollY = 0;
    this.loadSequence = 0;
    this.reactionTimer = 0;
    this.reactionSequence = 0;
  }

  setup() {
    elements.cinematicInspectButton.addEventListener("click", () => this.open());
    elements.cinematicVoiceToggle.addEventListener("click", () => { toggleVoiceMode(); this.syncControls(); });
    elements.cinematicFoleyToggle.addEventListener("click", () => {
      toggleLivingSound();
      this.syncControls();
    });
    elements.cinematicVoiceStop.addEventListener("click", () => stopVoice(true, true, true));
    this.subtitleObserver = new MutationObserver(() => {
      if (!elements.cinematicInspectDialog.open) return;
      elements.cinematicInspectJapanese.textContent = elements.subtitleJapanese.textContent;
      elements.cinematicInspectChinese.textContent = elements.subtitleChinese.textContent;
      elements.cinematicInspectPlayback.textContent = elements.voicePlaybackState.textContent;
    });
    this.subtitleObserver.observe(elements.subtitleBar, { childList: true, subtree: true, characterData: true });
    elements.cinematicInspectClose.addEventListener("click", () => elements.cinematicInspectDialog.close());
    elements.cinematicZoomOut.addEventListener("click", () => this.setScale(this.scale - 0.2));
    elements.cinematicZoomIn.addEventListener("click", () => this.setScale(this.scale + 0.2));
    elements.cinematicInspectReset.addEventListener("click", () => this.reset());
    elements.cinematicInspectRetry.addEventListener("click", () => this.loadFrame(this.frame));
    elements.cinematicCharacterHotspot.addEventListener("click", () => {
      if (!this.scene) return;
      const voice = CONTENT.cinematicVoices[this.scene.characterVoiceId];
      playCinematicInteraction(this.scene.characterVoiceId, "", voice?.frame || this.frame?.id);
    });
    elements.cinematicInspectDialog.addEventListener("close", () => this.afterClose());
    elements.cinematicInspectDialog.addEventListener("click", (event) => {
      if (event.target === elements.cinematicInspectDialog) elements.cinematicInspectDialog.close();
    });
    const viewport = elements.cinematicInspectViewport;
    viewport.addEventListener("wheel", (event) => this.onWheel(event), { passive: false });
    viewport.addEventListener("dblclick", (event) => {
      if (event.target.closest("button")) return;
      event.preventDefault();
      this.setScale(this.scale > 1.45 ? 1 : 2);
    });
    viewport.addEventListener("pointerdown", (event) => this.onPointerDown(event));
    viewport.addEventListener("pointermove", (event) => this.onPointerMove(event));
    viewport.addEventListener("pointerup", (event) => this.onPointerEnd(event));
    viewport.addEventListener("pointercancel", (event) => this.onPointerEnd(event));
    viewport.addEventListener("keydown", (event) => this.onKeyDown(event));
    this.viewportObserver = new ResizeObserver(() => {
      if (!elements.cinematicInspectDialog.open) return;
      this.clampPan();
      this.applyTransform();
      this.positionHotspots();
    });
    this.viewportObserver.observe(viewport);
    window.addEventListener("resize", () => {
      if (!elements.cinematicInspectDialog.open) return;
      this.clampPan();
      this.applyTransform();
      this.positionHotspots();
    }, { passive: true });
  }

  open() {
    this.scene = cinematicDirector?.activeScene() || CONTENT.cinematicScenes[0];
    this.inspectFrame = cinematicFrameById(this.scene.inspectFrameId) || this.scene.frames[0];
    this.frame = this.inspectFrame;
    this.returnFocus = elements.cinematicInspectButton;
    this.scrollY = window.scrollY;
    collapseFeedback();
    window.scrollTo({ top: this.scrollY, behavior: "instant" });
    document.documentElement.classList.add("cinematic-inspecting");
    cinematicDirector?.stopAutonomy();
    elements.cinematicInspectAct.textContent = this.scene.label;
    elements.cinematicInspectTitle.textContent = `看看${this.scene.label.split("·").at(-1).trim()}`;
    elements.cinematicInspectFallback.textContent = this.scene.shortLine;
    elements.cinematicInspectDialog.dataset.frameKind = this.scene.frameKind;
    this.renderHotspots();
    this.syncControls();
    elements.cinematicInspectJapanese.textContent = "";
    elements.cinematicInspectChinese.textContent = this.scene.shortLine;
    elements.cinematicInspectPlayback.textContent = "碰一下物件，或者轻声叫她。";
    this.reset();
    this.loadFrame(this.frame);
    if (typeof elements.cinematicInspectDialog.showModal === "function") elements.cinematicInspectDialog.showModal();
    else elements.cinematicInspectDialog.setAttribute("open", "");
    window.setTimeout(() => {
      this.positionHotspots();
      elements.cinematicInspectViewport.focus({ preventScroll: true });
    }, 0);
  }

  async loadFrame(frame) {
    if (!frame) return;
    const sequence = ++this.loadSequence;
    elements.cinematicInspectError.hidden = true;
    elements.cinematicInspectViewport.classList.add("is-loading");
    try {
      const source = await decodeCinematicImage(frame, true);
      if (sequence !== this.loadSequence) return;
      elements.cinematicInspectImage.src = source;
      elements.cinematicInspectImage.alt = frame.alt;
      this.frame = frame;
      elements.cinematicInspectViewport.classList.remove("is-loading", "is-image-missing");
      this.positionHotspots();
    } catch {
      if (sequence !== this.loadSequence) return;
      try {
        const fallback = await decodeCinematicImage(frame);
        if (sequence !== this.loadSequence) return;
        elements.cinematicInspectImage.src = fallback;
        elements.cinematicInspectImage.alt = frame.alt;
        this.frame = frame;
      } catch {
        // 保留上一张成功显示的图片，仍提供重试和关闭入口。
      }
      if (sequence !== this.loadSequence) return;
      elements.cinematicInspectViewport.classList.remove("is-loading");
      elements.cinematicInspectViewport.classList.add("is-image-missing");
      elements.cinematicInspectError.hidden = false;
    }
  }

  syncControls() {
    elements.cinematicVoiceToggle.textContent = `角色声音 · ${state.voiceMuted ? "关" : "开"}`;
    elements.cinematicVoiceToggle.setAttribute("aria-pressed", String(state.voiceMuted));
    elements.cinematicVoiceToggle.setAttribute("aria-label", state.voiceMuted ? "打开角色语音" : "关闭角色语音，只显示字幕");
    elements.cinematicFoleyToggle.textContent = `物件声音 · ${state.roomSoundMuted ? "关" : "开"}`;
    elements.cinematicFoleyToggle.setAttribute("aria-pressed", String(state.roomSoundMuted));
    elements.cinematicFoleyToggle.setAttribute("aria-label", state.roomSoundMuted ? "打开物件声音" : "关闭物件声音");
  }

  showReactionFrame(frameId) {
    const frame = cinematicFrameById(frameId);
    if (!frame) return;
    window.clearTimeout(this.reactionTimer);
    const sequence = ++this.reactionSequence;
    elements.cinematicInspectCanvas.classList.add("is-reacting");
    this.loadFrame(frame);
    this.reactionTimer = window.setTimeout(async () => {
      if (sequence !== this.reactionSequence || !elements.cinematicInspectDialog.open) return;
      await this.loadFrame(this.inspectFrame);
      if (sequence !== this.reactionSequence || !elements.cinematicInspectDialog.open) return;
      elements.cinematicInspectCanvas.classList.remove("is-reacting");
    }, 1050);
  }

  renderHotspots() {
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const fragment = document.createDocumentFragment();
    this.scene.hotspots.forEach((hotspot) => {
      const position = mobile ? hotspot.mobilePosition : hotspot.desktopPosition;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cinematic-object-hotspot";
      button.dataset.hotspotX = String(position.x);
      button.dataset.hotspotY = String(position.y);
      button.setAttribute("aria-label", hotspot.label);
      button.innerHTML = `<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M11.2 14.2c-2.1 0-3.7-2-3.7-4.4s1.6-4.3 3.7-4.3 3.6 2 3.6 4.3-1.6 4.4-3.6 4.4Zm9.6 0c-2 0-3.6-2-3.6-4.4s1.6-4.3 3.6-4.3 3.7 2 3.7 4.3-1.6 4.4-3.7 4.4ZM16 29c-5.2 0-8.5-2.2-8.5-5.5 0-3 2.2-7.3 5.2-8.5 1.8-.7 2.2 1 3.3 1s1.5-1.7 3.3-1c3 1.2 5.2 5.5 5.2 8.5 0 3.3-3.3 5.5-8.5 5.5Z"/></svg><span>${hotspot.label}</span>`;
      button.addEventListener("click", () => playCinematicInteraction(hotspot.voiceId, hotspot.foleyId, hotspot.reactionFrame));
      fragment.append(button);
    });
    elements.cinematicInspectHotspots.replaceChildren(fragment);
    const characterPositions = {
      door: { x: 55, y: 39 },
      room: { x: 47, y: 36 },
      secrets: { x: 50, y: 34 },
      wardrobe: { x: 51, y: 25 },
      gallery: { x: 51, y: 28 },
      drawing: { x: 51, y: 32 },
      goodnight: { x: 55, y: 30 }
    };
    const characterPosition = characterPositions[this.scene.id];
    elements.cinematicCharacterHotspot.dataset.hotspotX = String(characterPosition.x);
    elements.cinematicCharacterHotspot.dataset.hotspotY = String(characterPosition.y);
    elements.cinematicCharacterHotspot.setAttribute("aria-label", `轻声呼唤${this.scene.label.split("·").at(-1).trim()}画面里的纱雾`);
  }

  positionHotspots() {
    if (!this.scene || !elements.cinematicInspectDialog.open) return;
    const width = elements.cinematicInspectViewport.clientWidth;
    const height = elements.cinematicInspectViewport.clientHeight;
    if (!width || !height) return;
    const imageRatio = this.scene.frameKind === "portrait" ? 4 / 5 : 4 / 3;
    const imageWidth = Math.min(width, height * imageRatio);
    const imageHeight = imageWidth / imageRatio;
    const imageLeft = (width - imageWidth) / 2;
    const imageTop = (height - imageHeight) / 2;
    [...elements.cinematicInspectHotspots.children, elements.cinematicCharacterHotspot].forEach((button) => {
      const x = Number(button.dataset.hotspotX);
      const y = Number(button.dataset.hotspotY);
      button.style.left = `${imageLeft + imageWidth * x / 100}px`;
      button.style.top = `${imageTop + imageHeight * y / 100}px`;
    });
  }

  setScale(value) {
    this.scale = Math.min(2, Math.max(1, Math.round(value * 100) / 100));
    this.clampPan();
    this.applyTransform();
  }

  reset() {
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.applyTransform();
  }

  clampPan() {
    const bounds = elements.cinematicInspectViewport.getBoundingClientRect();
    const ratio = this.scene?.frameKind === "portrait" ? 4 / 5 : 4 / 3;
    const imageWidth = Math.min(bounds.width, bounds.height * ratio);
    const imageHeight = imageWidth / ratio;
    const maxX = Math.max(0, (imageWidth * this.scale - bounds.width) / 2);
    const maxY = Math.max(0, (imageHeight * this.scale - bounds.height) / 2);
    this.x = Math.min(maxX, Math.max(-maxX, this.x));
    this.y = Math.min(maxY, Math.max(-maxY, this.y));
  }

  applyTransform() {
    elements.cinematicInspectCanvas.style.setProperty("--inspect-x", `${this.x}px`);
    elements.cinematicInspectCanvas.style.setProperty("--inspect-y", `${this.y}px`);
    elements.cinematicInspectCanvas.style.setProperty("--inspect-scale", String(this.scale));
    elements.cinematicZoomStatus.value = `${Math.round(this.scale * 100)}%`;
    elements.cinematicZoomStatus.textContent = `${Math.round(this.scale * 100)}%`;
    elements.cinematicZoomOut.disabled = this.scale <= 1;
    elements.cinematicZoomIn.disabled = this.scale >= 2;
  }

  onWheel(event) {
    event.preventDefault();
    this.setScale(this.scale + (event.deltaY < 0 ? 0.12 : -0.12));
  }

  onPointerDown(event) {
    if (event.target.closest("button")) return;
    event.preventDefault();
    try {
      elements.cinematicInspectViewport.setPointerCapture?.(event.pointerId);
    } catch {
      // 合成触控测试与部分浏览器不会为非主指针建立捕获，手势状态仍可继续维护。
    }
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    elements.cinematicInspectCanvas.classList.add("is-dragging");
    if (this.pointers.size === 1) {
      this.dragStart = { x: event.clientX, y: event.clientY, baseX: this.x, baseY: this.y };
      this.pinchStart = null;
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinchStart = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale: this.scale };
    }
  }

  onPointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;
    event.preventDefault();
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 2 && this.pinchStart) {
      const [a, b] = [...this.pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      this.setScale(this.pinchStart.scale * distance / Math.max(1, this.pinchStart.distance));
      return;
    }
    if (this.pointers.size === 1 && this.dragStart && this.scale > 1) {
      this.x = this.dragStart.baseX + event.clientX - this.dragStart.x;
      this.y = this.dragStart.baseY + event.clientY - this.dragStart.y;
      this.clampPan();
      this.applyTransform();
    }
  }

  onPointerEnd(event) {
    this.pointers.delete(event.pointerId);
    try {
      if (elements.cinematicInspectViewport.hasPointerCapture?.(event.pointerId)) {
        elements.cinematicInspectViewport.releasePointerCapture(event.pointerId);
      }
    } catch {
      // 指针已由浏览器释放时无需重复处理。
    }
    this.dragStart = null;
    this.pinchStart = null;
    if (this.pointers.size === 1) {
      const point = [...this.pointers.values()][0];
      this.dragStart = { ...point, baseX: this.x, baseY: this.y };
    } else if (this.pointers.size === 0) {
      elements.cinematicInspectCanvas.classList.remove("is-dragging");
    }
  }

  onKeyDown(event) {
    const step = event.shiftKey ? 64 : 28;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "Home"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowLeft") this.x += step;
    else if (event.key === "ArrowRight") this.x -= step;
    else if (event.key === "ArrowUp") this.y += step;
    else if (event.key === "ArrowDown") this.y -= step;
    else if (event.key === "+" || event.key === "=") return this.setScale(this.scale + 0.2);
    else if (event.key === "-" || event.key === "_") return this.setScale(this.scale - 0.2);
    else if (event.key === "Home") return this.reset();
    this.clampPan();
    this.applyTransform();
  }

  afterClose() {
    this.loadSequence += 1;
    this.reactionSequence += 1;
    window.clearTimeout(this.reactionTimer);
    elements.cinematicInspectCanvas.classList.remove("is-reacting", "is-dragging");
    this.pointers.clear();
    this.reset();
    document.documentElement.classList.remove("cinematic-inspecting");
    window.scrollTo({ top: this.scrollY, behavior: "instant" });
    this.returnFocus?.focus({ preventScroll: true });
    if (activeVoicePlayer && !activeVoicePlayer.paused) showFeedback(true);
    cinematicDirector?.requestUpdate();
  }
}

let cinematicInspector = null;

function setupCinematic() {
  cinematicDirector = new CinematicDirector(CONTENT.cinematicScenes);
  cinematicInspector = new CinematicInspector();
  cinematicDirector.setup();
  cinematicInspector.setup();
}

function handleVoiceEnded(event) {
  if (event.currentTarget !== activeVoicePlayer) return;
  elements.stopVoiceButton.hidden = true;
  elements.voicePlaybackState.textContent = `播放结束 · ${activeVoiceScene || "字幕仍保留"}`;
  settleFeedback(2600);
}

function handleVoiceError(event) {
  if (event.currentTarget !== activeVoicePlayer) return;
  elements.stopVoiceButton.hidden = true;
  elements.voicePlaybackState.textContent = "声音暂时没加载出来 · 可以继续看字幕";
  settleFeedback(3200);
}

function toggleVoiceMode() {
  state.voiceMuted = !state.voiceMuted;
  if (state.voiceMuted && activeVoicePlayer && !activeVoicePlayer.paused) stopVoice(true, true);
  refreshVoiceControls();
  elements.voicePlaybackState.textContent = state.voiceMuted
    ? "只显示角色字幕 · 场景声由房间开关控制"
    : "角色语音已恢复 · 仍然只在点击后播放";
  saveState();
  elements.feedbackDock.classList.add("is-voice-context");
  document.body.classList.add("voice-feedback-active");
  showFeedback();
}

function changeVoiceVolume() {
  state.voiceVolume = clampVolume(Number(elements.voiceVolume.value));
  voicePlayers.forEach((player) => {
    player.volume = state.voiceVolume;
  });
  saveState();
}

function applyOutfit(key) {
  const outfit = CONTENT.outfits[key];
  if (!outfit) return;
  elements.outfitImage.srcset = responsiveSourceSet(outfit);
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
    await preloadResponsiveImage(outfit, "(max-width: 760px) calc(100vw - 3.2rem), (max-width: 1024px) 52vw, 600px");
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
    state.lastOutfitMemory = { outfit: key, rememberedAt: Date.now() };
    saveState();
    refreshDoorMemory();
    refreshPersonalizedFortune();
    preloadOutfitNeighbors(key);
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

function preloadOutfitNeighbors(key = state.outfit) {
  const keys = Object.keys(CONTENT.outfits);
  const position = Math.max(0, keys.indexOf(key));
  [-1, 1].forEach((offset) => {
    const next = (position + offset + keys.length) % keys.length;
    preloadResponsiveImage(CONTENT.outfits[keys[next]], "(max-width: 760px) calc(100vw - 3.2rem), (max-width: 1024px) 52vw, 600px").catch(() => {});
  });
}

function refreshSecrets() {
  elements.secretButtons.forEach((button) => {
    const found = state.secrets.has(button.dataset.secret);
    button.setAttribute("aria-pressed", String(found));
    button.classList.toggle("is-found", found);
    if (found) button.classList.remove("is-hinting");
  });
  [...elements.secretProgress.children].forEach((paw, index) => {
    paw.classList.toggle("is-found", index < state.secrets.size);
  });
  elements.secretCount.textContent = String(state.secrets.size);
  elements.secretProgress.setAttribute("aria-label", `已经发现${state.secrets.size}个秘密`);
  const unlocked = state.secrets.size === Object.keys(CONTENT.secrets).length;
  elements.secretMessage.hidden = !unlocked;
  if (unlocked) elements.secretHint.textContent = "她把抽屉推开了一点，没有再把线索藏回去。";
}

function undiscoveredSecretKeys() {
  return Object.keys(CONTENT.secrets).filter((key) => !state.secrets.has(key));
}

function revealGentleHint() {
  const remaining = undiscoveredSecretKeys();
  if (!remaining.length) return;
  const index = (Math.max(1, state.visitCount) + state.secrets.size) % remaining.length;
  const key = remaining[index];
  elements.secretButtons.forEach((button) => {
    button.classList.toggle("is-hinting", button.dataset.secret === key);
  });
  elements.secretHint.textContent = CONTENT.secrets[key].hint;
}

function scheduleGentleHint(delay = 7000) {
  window.clearTimeout(secretHintTimer);
  if (!undiscoveredSecretKeys().length) return;
  secretHintTimer = window.setTimeout(revealGentleHint, delay);
}

function setupSecretHints() {
  if (!("IntersectionObserver" in window)) {
    scheduleGentleHint();
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) scheduleGentleHint();
    else window.clearTimeout(secretHintTimer);
  }, { threshold: 0.45 });
  observer.observe(elements.deskBoard);
}

function discoverSecret(button) {
  const key = button.dataset.secret;
  const secret = CONTENT.secrets[key];
  if (!secret) return;

  if (state.secrets.has(key)) {
    updateReaction({ ...CONTENT.reactions.repeat, text: `${secret.label}：${secret.text}` }, false);
    return;
  }

  secretMissCount = 0;
  elements.secretButtons.forEach((item) => item.classList.remove("is-hinting"));
  state.secrets.add(key);
  saveState();
  refreshSecrets();
  const unlocked = state.secrets.size === Object.keys(CONTENT.secrets).length;
  if (!unlocked) {
    elements.secretHint.textContent = `${secret.label}被她默默承认了。剩下的先别急着找。`;
    scheduleGentleHint(5600);
  }
  updateReaction(unlocked ? "unlocked" : { ...CONTENT.reactions.secret, text: `${secret.label}：${secret.text}` });
  if (unlocked) elements.secretMessage.focus?.();
}

function noticeSecretMiss(event) {
  if (event.target.closest(".secret-trigger")) return;
  secretMissCount += 1;
  if (secretMissCount < 2) return;
  secretMissCount = 0;
  window.clearTimeout(secretHintTimer);
  revealGentleHint();
}

const STORY_STEP_KEYS = ["presence", "subject", "palette", "praise"];
const STORY_PALETTE_CLASSES = ["palette-strawberry", "palette-mint", "palette-moon"];

function persistStoryDraft(mode = "choices", step = storyStep) {
  state.drawingDraft = {
    choices: { ...storyDraft },
    step: Math.max(0, Math.min(3, step)),
    mode,
      quietElapsedMs: Math.round(quietElapsedMs),
      peekCount: Math.min(3, storyPeekCount),
    updatedAt: Date.now()
  };
  saveState();
}

function resetQuietCompanion() {
  window.clearTimeout(quietTimer);
  quietTimer = 0;
  quietActive = false;
  quietElapsedMs = 0;
  quietLastTickAt = 0;
  quietRenderedBeat = -1;
  quietSavedBucket = -1;
  elements.quietCompanion.hidden = true;
  elements.storyTheater.classList.remove("is-quiet");
  elements.quietBeats.forEach((mark) => mark.classList.remove("is-reached"));
}

function accumulateQuietTime(forceVisible = false) {
  if (!quietActive) return;
  const now = Date.now();
  if (quietLastTickAt && storyInView && (forceVisible || document.visibilityState === "visible")) {
    quietElapsedMs = Math.min(75000, quietElapsedMs + Math.max(0, now - quietLastTickAt));
  }
  quietLastTickAt = now;
}

function renderQuietCompanion() {
  if (!quietActive) return;
  accumulateQuietTime();
  const beats = CONTENT.drawingStory.quietBeats;
  const reached = beats.reduce((count, beat) => quietElapsedMs >= beat.at ? count + 1 : count, 0);
  const current = reached > 0 ? beats[reached - 1] : null;
  elements.quietBeats.forEach((mark, index) => mark.classList.toggle("is-reached", index < reached));
  if (reached !== quietRenderedBeat) {
    quietRenderedBeat = reached;
    if (current) {
      elements.quietTime.textContent = current.time;
      elements.quietCompanionTitle.textContent = current.title;
      elements.quietCompanionLine.textContent = current.line;
      elements.storyStageLabel.textContent = current.time;
      elements.storyStageNote.textContent = current.line;
      transitionStoryFrame(current.frame);
    }
  }
  const bucket = Math.floor(quietElapsedMs / 5000);
  if (bucket !== quietSavedBucket) {
    quietSavedBucket = bucket;
    persistStoryDraft("quiet");
  }
  if (quietElapsedMs < 75000) {
    quietTimer = window.setTimeout(renderQuietCompanion, 250);
  } else {
    quietTimer = 0;
  }
}

function beginQuietCompanion(resume = false) {
  resetQuietCompanion();
  quietActive = true;
  quietElapsedMs = resume ? validDrawingDraft(state.drawingDraft)?.quietElapsedMs || 0 : 0;
  quietLastTickAt = Date.now();
  storyStep = 1;
  storyDraft.presence = "quiet";
  storyBusy = false;
  elements.storyTheater.removeAttribute("aria-busy");
  elements.storyTheater.classList.add("is-quiet");
  elements.storyTheater.dataset.storyStep = "quiet";
  elements.quietCompanion.hidden = false;
  elements.storyChoices.replaceChildren();
  elements.storyBack.hidden = false;
  elements.storyRestart.hidden = true;
  elements.storyBeat.textContent = "谁都没有催促这一分钟";
  elements.storyPrompt.textContent = "什么都不用说，也可以留下。";
  elements.storyLine.textContent = "这里没有倒计时，也没有需要换取的奖励。她只是慢慢习惯旁边还有一个人。";
  elements.quietTime.textContent = "房间刚刚安静下来";
  elements.quietCompanionTitle.textContent = "就在旁边，先不催她。";
  elements.quietCompanionLine.textContent = "笔尖还在移动。她确认了一下旁边的椅子，没有叫你离开。";
  persistStoryDraft("quiet");
  renderQuietCompanion();
  window.requestAnimationFrame(() => elements.quietContinue.focus({ preventScroll: true }));
}

function finishQuietCompanion(goBack = false) {
  accumulateQuietTime();
  window.clearTimeout(quietTimer);
  quietActive = false;
  elements.quietCompanion.hidden = true;
  elements.storyTheater.classList.remove("is-quiet");
  transitionStoryFrame("focus");
  if (goBack) {
    storyDraft.presence = "";
    storyStep = 0;
  } else {
    storyStep = 1;
  }
  persistStoryDraft("choices");
  renderStoryStep();
}

function setStoryPeekSubject(subjectKey = storyDraft.subject) {
  const subject = CONTENT.drawingStory.subjects[subjectKey] || CONTENT.drawingStory.subjects.door;
  elements.storyPeekImage.srcset = responsiveSourceSet(subject);
  elements.storyPeekImage.sizes = "(max-width: 760px) 12rem, 15rem";
  elements.storyPeekImage.src = subject.image;
  elements.storyPeekImage.alt = `${subject.alt}，只露出还没有被稿纸盖住的一小角`;
}

function resetStoryPeek() {
  storyPeekSequence += 1;
  storyPeekCount = 0;
  elements.storyPeek.hidden = true;
  elements.storyPeek.classList.remove("is-opening", "is-caught", "is-relenting");
  elements.storyPeekPaper.setAttribute("aria-hidden", "true");
  elements.storyPeekButton.disabled = false;
  elements.storyPeekButton.setAttribute("aria-expanded", "false");
  elements.storyPeekButton.querySelector("span").textContent = "偷看画到哪里了";
}

async function peekAtStory() {
  if (elements.storyPeekButton.disabled) return;
  const sequence = ++storyPeekSequence;
  const reaction = CONTENT.drawingStory.peekReactions[Math.min(storyPeekCount, CONTENT.drawingStory.peekReactions.length - 1)];
  storyPeekCount += 1;
  if (state.drawingDraft) persistStoryDraft(state.drawingDraft.mode);
  setStoryPeekSubject();
  elements.storyPeekButton.disabled = true;
  elements.storyPeekButton.setAttribute("aria-expanded", "true");
  elements.storyPeekPaper.setAttribute("aria-hidden", "false");
  elements.storyPeek.classList.remove("is-opening", "is-caught", "is-relenting");
  void elements.storyPeek.offsetWidth;
  elements.storyPeek.classList.add("is-opening");
  elements.storyStageLabel.textContent = "画稿露出了一小角";
  elements.storyStageNote.textContent = "你刚靠近一点，她的袖口就停住了。";
  updateReaction(reaction, false);
  if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 260));
  if (sequence !== storyPeekSequence) return;
  elements.storyPeek.classList.add("is-caught");
  if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 620));
  if (sequence !== storyPeekSequence) return;
  elements.storyPeek.classList.add("is-relenting");
  elements.storyPeekButton.querySelector("span").textContent = "她只肯再露出一小角";
  elements.storyPeekButton.disabled = false;
}

function storyStepConfig(stepKey) {
  const configs = {
    presence: {
      beat: "她终于发现旁边有人",
      prompt: "你想怎么陪她？",
      line: "她握着笔没有回头，只用余光确认椅子有没有被拉开。",
      options: CONTENT.drawingStory.presence,
      stageLabel: "笔尖停了一小会儿",
      stageNote: "她没有赶人，只把旁边那把椅子往外挪了半格。"
    },
    subject: {
      beat: "她新建了一张空白画布",
      prompt: "这次画什么？",
      line: "“只、只选一个。不是因为听你的……我刚好也在想。”",
      options: CONTENT.drawingStory.subjects,
      stageLabel: "空白画布已经打开",
      stageNote: "她把三个很小的构图草稿排在数位板边缘。"
    },
    palette: {
      beat: "线稿已经慢慢成形",
      prompt: "给这张画留哪一种颜色？",
      line: "纱雾把三张调色纸签推过来，自己先盯住了最安静的那一张。",
      options: CONTENT.drawingStory.palettes,
      stageLabel: "她在等一个颜色",
      stageNote: "笔尖悬在色盘上方，灯光把纸边照得很暖。"
    },
    praise: {
      beat: "她把屏幕转过来一点",
      prompt: "你最先注意到了什么？",
      line: "不要只说“可爱”。她装作在检查图层，其实一直在等一句具体的感想。",
      options: CONTENT.drawingStory.praises,
      stageLabel: "画面只给你看一会儿",
      stageNote: "她的视线还停在屏幕上，耳朵却已经在等你的回答。"
    }
  };
  return configs[stepKey];
}

function setStoryFrameSource(key) {
  const frame = CONTENT.drawingStory.frames[key];
  if (!frame) return;
  elements.storyStageImage.srcset = responsiveSourceSet(frame);
  elements.storyStageImage.src = frame.image;
  elements.storyStageImage.alt = frame.alt;
  elements.storyStage.dataset.frame = key;
}

async function transitionStoryFrame(key) {
  const frame = CONTENT.drawingStory.frames[key];
  if (!frame || elements.storyStage.dataset.frame === key) {
    scheduleStoryBlink();
    return;
  }
  const sequence = ++storyFrameSequence;
  window.clearTimeout(storyBlinkTimer);
  elements.storyStage.classList.add("is-changing");
  try {
    await preloadResponsiveImage(frame, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px");
  } catch {
    if (sequence === storyFrameSequence) elements.storyStage.classList.remove("is-changing");
    return;
  }
  if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 120));
  if (sequence !== storyFrameSequence) return;
  setStoryFrameSource(key);
  window.setTimeout(() => {
    if (sequence === storyFrameSequence) elements.storyStage.classList.remove("is-changing");
  }, reducedMotion.matches ? 10 : 320);
  scheduleStoryBlink();
}

function canStoryBlink() {
  return storyInView
    && !storyBusy
    && !motionIsQuiet()
    && document.visibilityState === "visible"
    && elements.storyStage.dataset.frame === "focus";
}

function scheduleStoryBlink() {
  window.clearTimeout(storyBlinkTimer);
  if (!canStoryBlink()) return;
  storyBlinkTimer = window.setTimeout(() => {
    if (!canStoryBlink()) return;
    setStoryFrameSource("blink");
    storyBlinkTimer = window.setTimeout(() => {
      if (elements.storyStage.dataset.frame === "blink") setStoryFrameSource("focus");
      scheduleStoryBlink();
    }, 145);
  }, 3600 + Math.random() * 2800);
}

function setStoryPaletteClass(image, paletteKey) {
  image.classList.remove(...STORY_PALETTE_CLASSES);
  image.parentElement?.classList.remove(...STORY_PALETTE_CLASSES);
  const palette = CONTENT.drawingStory.palettes[paletteKey];
  if (palette) {
    image.classList.add(palette.className);
    image.parentElement?.classList.add(palette.className);
  }
}

function refreshStoryArtPreview(final = false) {
  const subject = CONTENT.drawingStory.subjects[storyDraft.subject];
  if (!subject) {
    elements.storyArtPreview.hidden = true;
    return;
  }
  const palette = CONTENT.drawingStory.palettes[storyDraft.palette];
  elements.storyArtPreview.hidden = false;
  elements.storyArtImage.srcset = responsiveSourceSet(subject);
  elements.storyArtImage.sizes = "(max-width: 760px) calc(100vw - 4rem), (max-width: 1024px) 38vw, 22rem";
  elements.storyArtImage.src = subject.image;
  elements.storyArtImage.alt = palette ? `${subject.alt}，使用${palette.label}配色` : subject.alt;
  setStoryPaletteClass(elements.storyArtImage, storyDraft.palette);
  elements.storyArtTitle.textContent = final ? `我们一起完成的「${subject.label}」` : subject.label;
  elements.storyArtMeta.textContent = palette ? palette.label : "颜色还在等你决定";
}

function renderStoryMemory() {
  const memory = validSharedDrawing(state.sharedDrawing);
  if (!memory) {
    elements.storyMemory.hidden = true;
    return;
  }
  const presence = CONTENT.drawingStory.presence[memory.presence];
  const subject = CONTENT.drawingStory.subjects[memory.subject];
  const palette = CONTENT.drawingStory.palettes[memory.palette];
  const praise = CONTENT.drawingStory.praises[memory.praise];
  elements.storyMemory.hidden = false;
  elements.storyMemoryImage.srcset = responsiveSourceSet(subject);
  elements.storyMemoryImage.sizes = "(max-width: 760px) 6.4rem, 9.5rem";
  elements.storyMemoryImage.src = subject.image;
  elements.storyMemoryImage.alt = `${subject.alt}，使用${palette.label}配色`;
  setStoryPaletteClass(elements.storyMemoryImage, memory.palette);
  elements.storyMemoryTitle.textContent = `她还留着「${subject.label}」`;
  elements.storyMemoryText.textContent = `“上次你${presence.memory}。${palette.label}也没有改……你说${praise.memory}，我记得。”`;
}

function storyChoiceButton(stepKey, key, option) {
  const button = document.createElement("button");
  button.className = "story-choice";
  button.type = "button";
  button.dataset.storyChoice = key;
  button.dataset.storyKind = stepKey;
  button.setAttribute("aria-pressed", String(storyDraft[stepKey] === key));
  if (stepKey === "palette") {
    const swatch = document.createElement("i");
    swatch.className = `story-swatch story-swatch--${key}`;
    swatch.setAttribute("aria-hidden", "true");
    button.append(swatch);
  }
  if (stepKey === "subject") {
    const thumbnail = document.createElement("img");
    thumbnail.className = "story-choice-thumb";
    thumbnail.src = option.thumb || option.small || option.image;
    thumbnail.alt = "";
    thumbnail.width = 960;
    thumbnail.height = 720;
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";
    button.append(thumbnail);
  }
  const copy = document.createElement("span");
  copy.className = "story-choice-copy";
  const title = document.createElement("strong");
  title.textContent = option.label;
  const detail = document.createElement("small");
  detail.textContent = option.detail;
  copy.append(title, detail);
  button.append(copy);
  button.addEventListener("click", () => chooseStoryOption(stepKey, key));
  return button;
}

function renderStoryIntro() {
  resetQuietCompanion();
  resetStoryPeek();
  storyStep = -1;
  elements.storyTheater.dataset.storyStep = "intro";
  storyBusy = false;
  elements.storyTheater.removeAttribute("aria-busy");
  const hasMemory = Boolean(validSharedDrawing(state.sharedDrawing));
  elements.storyBeat.textContent = hasMemory ? "桌边还压着上次的稿纸" : "笔尖还在慢慢移动";
  elements.storyPrompt.textContent = hasMemory ? "这次，也陪她画一张吗？" : "要不要安静陪她画一会儿？";
  elements.storyLine.textContent = hasMemory
    ? "她没有把上次那张收进抽屉，只在旁边重新放了一张空白稿纸。"
    : "她给旁边留了一点位置，却一直装作只是忘了把椅子推回去。";
  elements.storyStageLabel.textContent = state.livingWeather === "rain" ? "截稿前的雨夜" : "截稿前的晴夜";
  elements.storyStageNote.textContent = "她画得太认真，暂时没有发现你已经坐下。";
  elements.storyArtPreview.hidden = true;
  elements.storyBack.hidden = true;
  elements.storyRestart.hidden = true;
  const savedDraft = validDrawingDraft(state.drawingDraft);
  const makeButton = (titleText, detailText, primary, handler) => {
    const button = document.createElement("button");
    button.className = `story-choice${primary ? " story-choice--primary" : ""}`;
    button.type = "button";
    const title = document.createElement("strong");
    title.textContent = titleText;
    const detail = document.createElement("span");
    detail.textContent = detailText;
    button.append(title, detail);
    button.addEventListener("click", handler);
    return button;
  };
  const buttons = [];
  if (savedDraft) {
    buttons.push(makeButton(
      savedDraft.mode === "quiet" ? "接着安静陪她一会儿" : "接着上次没画完的地方",
      savedDraft.mode === "quiet" ? "房间会从上次停下的片刻继续" : "已经选过的内容都还夹在稿纸里",
      true,
      resumeDrawingStory
    ));
    buttons.push(makeButton("换一张空白稿纸", "从靠近她的方式重新开始", false, startDrawingStory));
  } else {
    buttons.push(makeButton("坐到她留出的椅子旁", "只在她需要的时候开口", true, startDrawingStory));
  }
  elements.storyChoices.replaceChildren(...buttons);
  transitionStoryFrame("focus");
}

function renderStoryStep(focusFirstChoice = true) {
  elements.quietCompanion.hidden = true;
  elements.storyTheater.classList.remove("is-quiet");
  const stepKey = STORY_STEP_KEYS[storyStep];
  const config = storyStepConfig(stepKey);
  if (!config) return;
  elements.storyTheater.dataset.storyStep = stepKey;
  elements.storyPeek.hidden = !storyDraft.subject;
  elements.storyBeat.textContent = config.beat;
  elements.storyPrompt.textContent = config.prompt;
  elements.storyLine.textContent = config.line;
  elements.storyStageLabel.textContent = config.stageLabel;
  elements.storyStageNote.textContent = config.stageNote;
  elements.storyBack.hidden = storyStep <= 0;
  elements.storyRestart.hidden = true;
  const choices = Object.entries(config.options).map(([key, option]) => storyChoiceButton(stepKey, key, option));
  elements.storyChoices.replaceChildren(...choices);
  refreshStoryArtPreview();
  if (focusFirstChoice) {
    window.requestAnimationFrame(() => elements.storyChoices.querySelector("button")?.focus({ preventScroll: true }));
  }
}

function startDrawingStory() {
  resetQuietCompanion();
  resetStoryPeek();
  storyDraft = { presence: "", subject: "", palette: "", praise: "" };
  storyStep = 0;
  persistStoryDraft("choices");
  preloadResponsiveImage(CONTENT.drawingStory.frames.shy, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
  preloadResponsiveImage(CONTENT.drawingStory.frames.reveal, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
  transitionStoryFrame("focus");
  renderStoryStep();
  updateReaction({ expression: "shy", label: "椅子被留出来了", text: "……可以坐。只要安静一点。" }, false);
}

function resumeDrawingStory() {
  const savedDraft = validDrawingDraft(state.drawingDraft);
  if (!savedDraft) {
    renderStoryIntro();
    return;
  }
  storyDraft = { ...savedDraft.choices };
  storyStep = savedDraft.step;
  storyPeekCount = savedDraft.peekCount;
  setStoryPeekSubject(storyDraft.subject);
  preloadResponsiveImage(CONTENT.drawingStory.frames.shy, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
  preloadResponsiveImage(CONTENT.drawingStory.frames.reveal, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
  if (savedDraft.mode === "quiet") {
    beginQuietCompanion(true);
  } else {
    transitionStoryFrame("focus");
    renderStoryStep();
  }
  updateReaction({ expression: "shy", label: "稿纸还留在原来的位置", text: "我没有收走……因为你还没说画完。" }, false);
}

async function chooseStoryOption(stepKey, key) {
  if (storyBusy || STORY_STEP_KEYS[storyStep] !== stepKey) return;
  const config = storyStepConfig(stepKey);
  const option = config?.options[key];
  if (!option) return;
  storyBusy = true;
  storyDraft[stepKey] = key;
  const pendingMode = stepKey === "presence" && key === "quiet" ? "quiet" : "choices";
  persistStoryDraft(pendingMode, Math.min(3, storyStep + 1));
  [...elements.storyChoices.children].forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-pressed", String(button.dataset.storyChoice === key));
  });

  if (stepKey === "subject") {
    preloadResponsiveImage(option, "(max-width: 760px) calc(100vw - 4rem), (max-width: 1024px) 38vw, 22rem").catch(() => {});
    setStoryPeekSubject(key);
    elements.storyPeek.hidden = false;
    elements.storyStageNote.textContent = option.stageNote;
  }
  if (stepKey === "palette") refreshStoryArtPreview();

  const labels = {
    presence: "她允许你留下",
    subject: "画面决定了",
    palette: "颜色落在稿纸上"
  };
  if (stepKey !== "praise") {
    updateReaction({ expression: stepKey === "subject" ? "proud" : "shy", label: labels[stepKey], text: option.line }, false);
    window.setTimeout(() => {
      storyBusy = false;
      storyStep += 1;
      if (stepKey === "presence" && key === "quiet") {
        beginQuietCompanion();
      } else {
        persistStoryDraft("choices");
        renderStoryStep();
      }
    }, reducedMotion.matches ? 10 : 280);
    return;
  }

  elements.storyTheater.setAttribute("aria-busy", "true");
  updateReaction({ expression: "shy", label: "被认真看见了", text: option.line }, false);
  state.sharedDrawing = {
    presence: storyDraft.presence,
    subject: storyDraft.subject,
    palette: storyDraft.palette,
    praise: storyDraft.praise,
    completedAt: Date.now()
  };
  state.drawingDraft = null;
  saveState();
  refreshDoorMemory();
  refreshPersonalizedFortune();
  await transitionStoryFrame("shy");
  if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 680));
  await transitionStoryFrame("reveal");
  storyBusy = false;
  renderStoryResult();
}

function renderStoryResult() {
  const subject = CONTENT.drawingStory.subjects[storyDraft.subject];
  const palette = CONTENT.drawingStory.palettes[storyDraft.palette];
  const praise = CONTENT.drawingStory.praises[storyDraft.praise];
  elements.storyTheater.removeAttribute("aria-busy");
  elements.storyTheater.dataset.storyStep = "result";
  elements.quietCompanion.hidden = true;
  elements.storyTheater.classList.remove("is-quiet");
  elements.storyPeek.hidden = true;
  elements.storyBeat.textContent = "她终于把笔放下";
  elements.storyPrompt.textContent = "这张画，完成了。";
  elements.storyLine.textContent = `“${palette.label}是你选的。还有……你说${praise.memory}。我记住了。”`;
  elements.storyStageLabel.textContent = "完成稿被推到桌边";
  elements.storyStageNote.textContent = `${subject.label}只画了一张，她没有再收回去。`;
  elements.storyChoices.replaceChildren();
  elements.storyBack.hidden = true;
  elements.storyRestart.hidden = false;
  refreshStoryArtPreview(true);
  renderStoryMemory();
  renderLivingDrawingMemory();
  updateReaction({ expression: "shy", label: "一起完成的画", text: "只、只许认真收好……不许把纸角折到。" }, false);
  window.requestAnimationFrame(() => elements.storyRestart.focus({ preventScroll: true }));
}

function goBackInStory() {
  if (storyBusy) return;
  if (quietActive) {
    finishQuietCompanion(true);
    return;
  }
  if (storyStep <= 0) return;
  storyStep -= 1;
  persistStoryDraft("choices");
  transitionStoryFrame("focus");
  renderStoryStep();
}

function restartDrawingStory() {
  resetQuietCompanion();
  resetStoryPeek();
  storyDraft = { presence: "", subject: "", palette: "", praise: "" };
  storyStep = 0;
  persistStoryDraft("choices");
  transitionStoryFrame("focus");
  renderStoryStep();
}

function setupDrawingStory() {
  renderStoryMemory();
  renderStoryIntro();
  if (!("IntersectionObserver" in window)) {
    storyInView = true;
    elements.storySection.classList.add("is-in-view");
    preloadResponsiveImage(CONTENT.drawingStory.frames.blink, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
    scheduleStoryBlink();
    return;
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (quietActive && !entry.isIntersecting) {
      accumulateQuietTime(true);
      window.clearTimeout(quietTimer);
      quietTimer = 0;
      persistStoryDraft("quiet");
    }
    storyInView = entry.isIntersecting;
    elements.storySection.classList.toggle("is-in-view", storyInView);
    if (storyInView) {
      quietLastTickAt = Date.now();
      if (quietActive && !quietTimer && quietElapsedMs < 75000) renderQuietCompanion();
      preloadResponsiveImage(CONTENT.drawingStory.frames.blink, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
      scheduleStoryBlink();
    } else {
      window.clearTimeout(storyBlinkTimer);
      if (elements.storyStage.dataset.frame === "blink") setStoryFrameSource("focus");
    }
  }, { threshold: 0.28 });
  observer.observe(elements.storySection);
}

function galleryChapterFor(index) {
  return CONTENT.galleryChapters.find((chapter) => index >= chapter.start && index <= chapter.end)
    || CONTENT.galleryChapters[0];
}

function buildGalleryChapters() {
  const fragment = document.createDocumentFragment();
  CONTENT.galleryChapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.chapter = chapter.id;
    button.textContent = chapter.title;
    button.setAttribute("aria-current", String(galleryPosition >= chapter.start && galleryPosition <= chapter.end));
    button.addEventListener("click", () => switchGallery(chapter.start));
    fragment.append(button);
  });
  elements.galleryChapters.append(fragment);
}

function buildGalleryThumbs() {
  const fragment = document.createDocumentFragment();
  CONTENT.gallery.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "film-thumb";
    button.type = "button";
    button.dataset.galleryIndex = String(index);
    button.setAttribute("aria-label", `查看画稿：${item.title}`);
    button.setAttribute("aria-pressed", String(index === galleryPosition));

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

function applyGallery(index, animateThumbnail = true) {
  const item = CONTENT.gallery[index];
  const chapter = galleryChapterFor(index);
  elements.galleryMainImage.srcset = responsiveSourceSet(item);
  elements.galleryMainImage.sizes = "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 76vw, 920px";
  elements.galleryMainImage.src = item.image;
  elements.galleryMainImage.alt = item.alt;
  elements.galleryIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(CONTENT.gallery.length).padStart(2, "0")}`;
  elements.galleryChapter.textContent = chapter.title;
  elements.galleryCaption.textContent = item.title;
  elements.galleryNote.textContent = item.note;
  elements.galleryOpenButton.setAttribute("aria-label", `沉浸查看画稿：${item.title}`);
  const thumbs = [...elements.galleryThumbs.querySelectorAll("[data-gallery-index]")];
  thumbs.forEach((button) => {
    button.setAttribute("aria-pressed", String(Number(button.dataset.galleryIndex) === index));
  });
  [...elements.galleryChapters.children].forEach((button) => {
    button.setAttribute("aria-current", String(button.dataset.chapter === chapter.id));
  });
  const active = elements.galleryThumbs.querySelector(`[data-gallery-index="${index}"]`);
  if (active) {
    const centeredLeft = active.offsetLeft - (elements.galleryThumbs.clientWidth - active.offsetWidth) / 2;
    elements.galleryThumbs.scrollTo({
      left: Math.max(0, centeredLeft),
      behavior: reducedMotion.matches || !animateThumbnail ? "auto" : "smooth"
    });
  }
  if (elements.galleryLightbox.open) applyLightbox(index);
}

function preloadGalleryNeighbors(index = galleryPosition) {
  [-1, 1].forEach((offset) => {
    const next = (index + offset + CONTENT.gallery.length) % CONTENT.gallery.length;
    preloadResponsiveImage(CONTENT.gallery[next], "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 76vw, 920px").catch(() => {});
  });
}

async function switchGallery(index, announce = true) {
  const normalized = (index + CONTENT.gallery.length) % CONTENT.gallery.length;
  const sequence = ++gallerySequence;
  if (normalized === galleryPosition) {
    elements.galleryStage.classList.remove("is-switching");
    applyGallery(normalized);
    if (announce) {
      const current = CONTENT.gallery[normalized];
      updateReaction({ expression: current.expression, label: "这一页还没看完", text: current.reaction }, false);
    }
    preloadGalleryNeighbors(normalized);
    return;
  }
  const item = CONTENT.gallery[normalized];
  elements.galleryStage.classList.add("is-switching");

  try {
    await preloadResponsiveImage(item, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 76vw, 920px");
  } catch {
    if (sequence === gallerySequence) elements.galleryStage.classList.remove("is-switching");
    return;
  }

  if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 190));
  if (sequence !== gallerySequence) return;
  galleryPosition = normalized;
  state.galleryIndex = normalized;
  saveState();
  applyGallery(normalized);
  preloadGalleryNeighbors(normalized);
  if (announce) updateReaction({ expression: item.expression, label: `画册 · ${item.title}`, text: item.reaction });

  window.setTimeout(() => {
    if (sequence === gallerySequence) elements.galleryStage.classList.remove("is-switching");
  }, reducedMotion.matches ? 10 : 470);
}

function applyLightbox(index) {
  const item = CONTENT.gallery[index];
  const chapter = galleryChapterFor(index);
  elements.lightboxImage.srcset = responsiveSourceSet(item);
  elements.lightboxImage.sizes = "96vw";
  elements.lightboxImage.src = item.image;
  elements.lightboxImage.alt = item.alt;
  elements.lightboxChapter.textContent = chapter.title;
  elements.lightboxIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(CONTENT.gallery.length).padStart(2, "0")}`;
  elements.lightboxTitle.textContent = item.title;
  elements.lightboxNote.textContent = item.note;
}

function openLightbox() {
  applyLightbox(galleryPosition);
  elements.lightboxStage.classList.remove("is-zoomed");
  elements.lightboxImageButton.setAttribute("aria-label", "放大当前画稿");
  elements.lightboxZoomHint.textContent = "点一下画面可放大细节；方向键或滑动可以翻页。";
  elements.galleryLightbox.showModal();
  document.body.classList.add("lightbox-active");
  elements.lightboxClose.focus();
  preloadGalleryNeighbors(galleryPosition);
}

function closeLightbox() {
  if (elements.galleryLightbox.open) elements.galleryLightbox.close();
}

function toggleLightboxZoom() {
  const zoomed = elements.lightboxStage.classList.toggle("is-zoomed");
  elements.lightboxImageButton.setAttribute("aria-label", zoomed ? "缩小当前画稿以适合屏幕" : "放大当前画稿");
  elements.lightboxZoomHint.textContent = zoomed
    ? "已按原图细节放大；拖动画面查看，点一下恢复全图。"
    : "点一下画面可放大细节；方向键或滑动可以翻页。";
}

async function navigateLightbox(direction) {
  elements.lightboxStage.classList.remove("is-zoomed");
  await switchGallery(galleryPosition + direction, false);
}

function handleLightboxKey(event) {
  if (event.key === "Tab") {
    const focusable = [...elements.galleryLightbox.querySelectorAll("button")]
      .filter((button) => !button.disabled && !button.hidden && button.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    navigateLightbox(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    navigateLightbox(1);
  }
}

function startLightboxSwipe(event) {
  if (elements.lightboxStage.classList.contains("is-zoomed") || event.target.closest(".round-arrow")) return;
  lightboxPointerStart = { x: event.clientX, y: event.clientY };
}

function finishLightboxSwipe(event) {
  if (!lightboxPointerStart || elements.lightboxStage.classList.contains("is-zoomed")) {
    lightboxPointerStart = null;
    return;
  }
  const horizontal = event.clientX - lightboxPointerStart.x;
  const vertical = event.clientY - lightboxPointerStart.y;
  lightboxPointerStart = null;
  if (Math.abs(horizontal) < 55 || Math.abs(horizontal) <= Math.abs(vertical)) return;
  navigateLightbox(horizontal < 0 ? 1 : -1);
}

function fortuneOptions() {
  return [...new Set([buildPersonalizedFortune(), ...CONTENT.fortunes])];
}

function refreshPersonalizedFortune() {
  if (elements.goodnightSection.classList.contains("is-note-kept")) return;
  if (elements.goodnightSection.dataset.noteOrigin === "random") return;
  elements.fortuneNote.textContent = buildPersonalizedFortune();
  elements.fortuneLabel.textContent = "她写给这次拜访的小纸条";
  elements.goodnightSection.dataset.noteOrigin = "personalized";
}

function newFortune() {
  const options = fortuneOptions();
  let next = Math.floor(Math.random() * options.length);
  if (options.length > 1 && next === lastFortune) next = (next + 1) % options.length;
  lastFortune = next;
  elements.fortuneNote.textContent = options[next];
  elements.fortuneLabel.textContent = next === 0 ? "她写给这次拜访的小纸条" : "今晚的小纸条";
  elements.goodnightStatus.textContent = "这一张还没有收好；想带到别处，也可以先复制纸条文字。";
  elements.goodnightSection.classList.remove("is-note-kept");
  elements.goodnightSection.dataset.noteOrigin = next === 0 ? "personalized" : "random";
  elements.takeNoteButton.disabled = false;
  elements.takeNoteButton.querySelector("span").textContent = "收下纸条，轻轻带上门";
  updateReaction("fortune");
}

function applySavedFortune() {
  if (!state.keptFortune) {
    refreshPersonalizedFortune();
    return;
  }
  elements.fortuneNote.textContent = state.keptFortune;
  elements.fortuneLabel.textContent = "上次收好的小纸条";
  elements.goodnightStatus.textContent = "她还记得你把这张收好了。今晚也可以换一张，或者再次带上门。";
  elements.goodnightSection.classList.add("is-note-kept");
  elements.goodnightSection.dataset.noteOrigin = "saved";
  lastFortune = Math.max(0, fortuneOptions().indexOf(state.keptFortune));
}

async function copyFortuneText() {
  const note = elements.fortuneNote.textContent.trim();
  let copied = false;
  try {
    await navigator.clipboard.writeText(`今晚的小纸条：${note}`);
    copied = true;
  } catch {
    const fallback = document.createElement("textarea");
    fallback.value = `今晚的小纸条：${note}`;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.append(fallback);
    fallback.select();
    copied = document.execCommand("copy");
    fallback.remove();
  }
  elements.goodnightStatus.textContent = copied
    ? "纸条文字已经复制，可以贴到自己的备忘录里。"
    : "浏览器没有允许复制；纸条仍然可以收在这台设备里。";
  updateReaction({
    expression: "shy",
    label: copied ? "纸条已经复制" : "纸条还在这里",
    text: copied ? "……只许自己留着。" : "没关系，收在房间里也不会丢。"
  }, false);
}

function keepFortuneAndClose() {
  const note = elements.fortuneNote.textContent.trim();
  state.keptFortune = validFortune(note) || CONTENT.fortunes[0];
  state.keptFortuneAt = Date.now();
  saveState();
  refreshDoorMemory();
  elements.fortuneLabel.textContent = "已经收好的小纸条";
  elements.goodnightStatus.textContent = "纸条已经留在这台设备里。门正在身后轻轻合上。";
  elements.goodnightSection.classList.add("is-note-kept");
  elements.takeNoteButton.disabled = true;
  elements.takeNoteButton.querySelector("span").textContent = "纸条已经收好";
  stopVoice(true, false);
  prepareRoomFxFile(CONTENT.goodnight.doorSound);
  playRoomFx(CONTENT.goodnight.doorSound);
  updateReaction({ expression: "shy", label: "晚安以前", text: "纸条……不许弄丢。" }, false);

  doorOpened = false;
  doorOpeningPromise = null;
  heroSequence += 1;
  elements.doorScene.classList.remove("is-open", "is-startled");
  elements.doorScene.classList.add("is-goodnight-closed");
  elements.knockButton.disabled = false;
  elements.knockButton.setAttribute("aria-expanded", "false");
  elements.knockButton.querySelector("span").textContent = "下次再轻轻敲门";
  elements.visitNote.textContent = "今晚的纸条已经收好";
  elements.doorStatus.innerHTML = "<span>木门在身后轻轻合上。</span><strong>“晚安。下次……也要先敲门。”</strong>";

  window.setTimeout(() => {
    scrollPageTarget(document.querySelector("#home"));
  }, reducedMotion.matches ? 20 : 120);
}

function preloadDoorSequence() {
  [CONTENT.heroExpressions.startled, CONTENT.heroExpressions.shy]
    .forEach((item) => decodeCinematicImage(item).catch(() => {}));
}

function prepareVoiceLine(id) {
  const line = CONTENT.voiceLines[id];
  if (!line) return;
  [...line.replies, ...(line.guardedReplies || [])].forEach((reply) => prepareVoiceFile(reply.file));
}

function setupAudioWarmup() {
  const voiceButtons = [...document.querySelectorAll("[data-voice]")];
  voiceButtons.forEach((button) => {
    const prepare = () => prepareVoiceLine(button.dataset.voice);
    button.addEventListener("pointerdown", prepare, { once: true });
  });

  const prepareCurrentRoom = () => prepareLivingAudioForPlace(state.livingPlace);
  [elements.livingEventButton, elements.livingVoiceButton].forEach((button) => {
    button.addEventListener("pointerdown", prepareCurrentRoom);
  });
  const prepareNextWeather = () => prepareLivingWeatherAudio(state.livingWeather === "rain" ? "clear" : "rain");
  elements.livingWeatherToggle.addEventListener("pointerdown", prepareNextWeather);

  const prepareGoodnightDoor = () => prepareRoomFxFile(CONTENT.goodnight.doorSound);
  elements.takeNoteButton.addEventListener("pointerdown", prepareGoodnightDoor, { once: true });
}

function observeDeferredSections() {
  if (!("IntersectionObserver" in window)) {
    preloadOutfitNeighbors();
    preloadGalleryNeighbors();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.id === "wardrobe") {
        preloadOutfitNeighbors();
      }
      if (entry.target.id === "gallery") {
        preloadGalleryNeighbors();
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
    if (doorOpened || motionIsQuiet()) return;
    const bounds = elements.doorScene.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    elements.heroCharacter.style.objectPosition = `${61 + horizontal * 2.4}% ${50 + vertical * 1.8}%`;
  });
  elements.doorScene.addEventListener("pointerleave", () => {
    elements.heroCharacter.style.objectPosition = "61% 50%";
  });
}

function cleanPageUrl() {
  return window.location.href.split("#")[0];
}

function clearLocationHash() {
  if (!window.location.hash) return;
  window.history.replaceState(window.history.state, "", cleanPageUrl());
}

function scrollPageTarget(target, focusTarget = false) {
  if (!target) return;
  const navHeight = document.querySelector(".door-nav")?.getBoundingClientRect().height || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: Math.max(0, targetTop - navHeight - 12),
    behavior: motionIsQuiet() ? "auto" : "smooth"
  });
  if (focusTarget) target.focus({ preventScroll: true });
}

function setupPageNavigation() {
  const pageLinks = [...document.querySelectorAll('a[href^="#"]')];
  const sectionLinks = [...document.querySelectorAll('.door-nav nav a[href^="#"]')];
  const sectionTargets = sectionLinks
    .map((link) => ({ link, target: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.target);
  const nav = document.querySelector(".door-nav");
  let updateQueued = false;

  const updateCurrentSection = () => {
    updateQueued = false;
    const marker = window.scrollY + (nav?.offsetHeight || 0) + Math.min(window.innerHeight * 0.18, 150);
    let activeTarget = null;
    sectionTargets.forEach((item) => {
      const targetTop = item.target.getBoundingClientRect().top + window.scrollY;
      if (targetTop <= marker) activeTarget = item.target;
    });
    sectionTargets.forEach((item) => {
      if (item.target === activeTarget) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
  };

  const queueCurrentSectionUpdate = () => {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(updateCurrentSection);
  };

  pageLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      clearLocationHash();
      const entersRoom = Boolean(link.closest(".door-nav nav")) && !doorOpened;
      if (entersRoom) await openDoor();
      scrollPageTarget(target, link.classList.contains("skip-link"));
    });
  });

  window.addEventListener("scroll", queueCurrentSectionUpdate, { passive: true });
  window.addEventListener("resize", queueCurrentSectionUpdate);
  window.addEventListener("pageshow", () => {
    if (window.__sagiriDiscardedHash) {
      window.__sagiriDiscardedHash = false;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    clearLocationHash();
    queueCurrentSectionUpdate();
  });
  clearLocationHash();
  updateCurrentSection();
}

elements.heroCharacter.addEventListener("error", () => {
  elements.heroCharacter.style.opacity = "0.18";
  elements.doorStatus.innerHTML = "<span>人物插画暂时没有加载出来。</span><strong>房门和她留下的文字还在。</strong>";
}, { once: true });

elements.storyStageImage.addEventListener("error", () => {
  elements.storyStage.classList.add("is-image-missing");
  elements.storyStageNote.textContent = "场景插画暂时没有加载出来，她写下的台词和选择还可以继续。";
}, { once: true });

elements.knockButton.addEventListener("click", openDoor);
elements.motionModeButton.addEventListener("click", toggleMotionMode);
reducedMotion.addEventListener("change", refreshMotionMode);
elements.knockButton.addEventListener("pointerenter", preloadDoorSequence, { once: true });
elements.knockButton.addEventListener("focus", preloadDoorSequence, { once: true });
elements.knockButton.addEventListener("pointerdown", preloadDoorSequence, { once: true });
elements.feedbackCollapseButton.addEventListener("click", collapseFeedback);
elements.doorMemorySlip.addEventListener("click", showDoorMemory);
elements.stopVoiceButton.addEventListener("click", () => stopVoice(false, false, true));
elements.voiceMuteButton.addEventListener("click", toggleVoiceMode);
elements.voiceVolume.addEventListener("input", changeVoiceVolume);
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
elements.deskBoard.addEventListener("click", noticeSecretMiss);
elements.livingPlaceButtons.forEach((button) => {
  button.addEventListener("click", () => switchLivingPlace(button.dataset.livingPlace));
  button.addEventListener("keydown", handleLivingTrackKey);
});
elements.livingEventButton.addEventListener("click", runLivingMoment);
elements.livingVoiceButton.addEventListener("click", () => {
  playLivingVoice(CONTENT.livingRoom.places[state.livingPlace].voice);
});
elements.livingWeatherToggle.addEventListener("click", toggleLivingWeather);
elements.livingSoundToggle.addEventListener("click", toggleLivingSound);
elements.livingRoomView.addEventListener("pointerdown", startLivingSwipe);
elements.livingRoomView.addEventListener("pointerup", finishLivingSwipe);
elements.livingRoomView.addEventListener("pointercancel", () => {
  livingPointerStart = null;
});
elements.storyBack.addEventListener("click", goBackInStory);
elements.storyRestart.addEventListener("click", restartDrawingStory);
elements.storyPeekButton.addEventListener("click", peekAtStory);
elements.quietContinue.addEventListener("click", () => finishQuietCompanion(false));
elements.galleryPrev.addEventListener("click", () => switchGallery(galleryPosition - 1));
elements.galleryNext.addEventListener("click", () => switchGallery(galleryPosition + 1));
elements.galleryOpenButton.addEventListener("click", openLightbox);
elements.lightboxClose.addEventListener("click", closeLightbox);
elements.lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
elements.lightboxNext.addEventListener("click", () => navigateLightbox(1));
elements.lightboxImageButton.addEventListener("click", toggleLightboxZoom);
elements.galleryLightbox.addEventListener("keydown", handleLightboxKey);
elements.galleryLightbox.addEventListener("click", (event) => {
  if (event.target === elements.galleryLightbox) closeLightbox();
});
elements.galleryLightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-active");
  elements.lightboxStage.classList.remove("is-zoomed");
});
elements.lightboxStage.addEventListener("pointerdown", startLightboxSwipe);
elements.lightboxStage.addEventListener("pointerup", finishLightboxSwipe);
elements.lightboxStage.addEventListener("pointercancel", () => {
  lightboxPointerStart = null;
});
elements.fortuneButton.addEventListener("click", newFortune);
elements.copyFortuneButton.addEventListener("click", copyFortuneText);
elements.takeNoteButton.addEventListener("click", keepFortuneAndClose);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    quietLastTickAt = Date.now();
    if (quietActive && !quietTimer) renderQuietCompanion();
    scheduleStoryBlink();
    scheduleLivingAutonomy();
    cinematicDirector?.handleVisibility();
  } else {
    accumulateQuietTime(true);
    window.clearTimeout(quietTimer);
    quietTimer = 0;
    if (quietActive) persistStoryDraft("quiet");
    window.clearTimeout(storyBlinkTimer);
    window.clearTimeout(livingAutonomyTimer);
    cinematicDirector?.handleVisibility();
  }
});

window.addEventListener("pagehide", () => {
  accumulateQuietTime(true);
  window.clearTimeout(quietTimer);
  quietTimer = 0;
  if (quietActive) persistStoryDraft("quiet");
  cinematicDirector?.stopAutonomy();
});

elements.livingRoomImage.addEventListener("load", () => {
  elements.livingRoomStage.classList.remove("is-image-missing");
});

elements.livingRoomImage.addEventListener("error", () => {
  elements.livingRoomStage.classList.add("is-image-missing");
  elements.livingRoomAmbient.textContent = "场景插画暂时没有加载出来，地点文字、小事件和深入入口仍然可以使用。";
});

applyVisitStage();
refreshVoiceControls();
refreshMotionMode();
buildGalleryChapters();
buildGalleryThumbs();
applyOutfit(state.outfit);
applyGallery(galleryPosition, false);
refreshSecrets();
applySavedFortune();
setupSecretHints();
setupLivingRoom();
setupDrawingStory();
setupWindowRain();
setupCinematic();
setupPageNavigation();
setupParallax();
setupAudioWarmup();
observeDeferredSections();
document.documentElement.dataset.js = "true";
