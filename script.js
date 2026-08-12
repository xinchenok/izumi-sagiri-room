"use strict";

const CONTENT = {
  heroExpressions: {
    peek: {
      image: "assets/v5/hero-peek.webp",
      small: "assets/v5/hero-peek-560.webp",
      alt: "银白长发、蓝眼睛的纱雾穿着粉色猫耳家居服，握着半掩的卧室门安静偷看"
    },
    startled: {
      image: "assets/v5/hero-startled.webp",
      small: "assets/v5/hero-startled-560.webp",
      alt: "听见敲门后，纱雾睁大蓝眼睛露出突然受惊的可爱表情"
    },
    shy: {
      image: "assets/v5/hero-shy.webp",
      small: "assets/v5/hero-shy-560.webp",
      alt: "认出来访者后，纱雾握着门边脸红地害羞微笑"
    },
    proud: {
      image: "assets/v5/hero-proud.webp",
      small: "assets/v5/hero-proud-560.webp",
      alt: "纱雾握着门边，露出认真又有一点得意的可爱表情"
    }
  },
  outfits: {
    home: {
      name: "宽松运动家居服",
      image: "assets/v5/outfit-home.webp",
      small: "assets/v5/outfit-home-560.webp",
      alt: "纱雾穿宽松粉色运动外套和奶油色运动裤，坐在床边害羞微笑",
      description: "袖子要够长，裤脚要够软。窝在房间里画画的时候，这样才最安心。",
      time: "午后 15:20",
      expression: "shy",
      reaction: "这套……最不会分心。"
    },
    artist: {
      name: "格纹画稿睡衣",
      image: "assets/v5/outfit-artist-night.webp",
      small: "assets/v5/outfit-artist-night-560.webp",
      alt: "纱雾穿蓝白格长袖睡衣和长裤，戴着绘图手套在月光下认真画画",
      description: "蓝白格睡衣、绘图手套和不会掉下去的软拖鞋——熬夜画稿模式，准备完成。",
      time: "深夜 00:47",
      expression: "proud",
      reaction: "今、今晚一定画得完。"
    },
    outing: {
      name: "薄荷水手外套",
      image: "assets/v5/outfit-outing-sailor.webp",
      small: "assets/v5/outfit-outing-sailor-560.webp",
      alt: "纱雾穿水手领裙装、薄荷色针织外套和深色长袜，抱着棕色书包站在门口",
      description: "水手领、厚厚的薄荷针织和能挡住紧张的书包。真的要出门时，会在门口多站一会儿。",
      time: "早上 08:10",
      expression: "startled",
      reaction: "外、外面的人不会很多吧？"
    },
    bedtime: {
      name: "草莓睡前服",
      image: "assets/v5/outfit-bedtime.webp",
      small: "assets/v5/outfit-bedtime-560.webp",
      alt: "深夜里，纱雾穿奶油粉草莓长袖睡衣和长裤，侧躺在床上用数位板继续画画",
      description: "已经换好睡衣，却还舍不得放下最后一笔。数位板垫在枕头上，画到眼睛发困才肯保存。",
      time: "凌晨 01:13",
      expression: "shy",
      reaction: "再画这一小块就睡……真、真的。"
    },
    hooded: {
      name: "猫耳连帽毯",
      image: "assets/v5/outfit-hooded-blanket.webp",
      small: "assets/v5/outfit-hooded-blanket-560.webp",
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
      image: "assets/v4/gallery-bed-drawing.webp",
      thumb: "assets/v4/gallery-bed-drawing-thumb.webp",
      alt: "银白长发的女孩穿粉色猫耳家居服，盘腿坐在床上用数位板画画，被发现后害羞抬眼",
      title: "被抓到在床上画画",
      note: "她原本把数位板藏在膝盖上。听见你靠近，只来得及红着脸抬头：“不许笑……这里比较舒服而已。”",
      expression: "startled",
      reaction: "我、我只是觉得床上比较暖……不许笑。"
    },
    {
      id: "blanket-fort",
      image: "assets/v4/gallery-blanket-fort.webp",
      thumb: "assets/v4/gallery-blanket-fort-thumb.webp",
      alt: "银白长发的女孩躲在被子搭成的小帐篷里画画，红着脸从帘边递出一张小猫速写",
      title: "被窝画室只开一条缝",
      note: "她用被子围出一间更小的画室，只把帘子拉开一点点。小猫速写先从缝里递出来，藏在袖口后的声音轻得几乎听不见：“画、画可以先看……”",
      expression: "shy",
      reaction: "帐篷里只能坐一个人……画可以先借你看。"
    },
    {
      id: "stream-wave",
      image: "assets/v4/gallery-stream-wave.webp",
      thumb: "assets/v4/gallery-stream-wave-thumb.webp",
      alt: "银白长发的女孩戴着猫耳耳机坐在数位板前进行安静的绘画直播，用袖口挡住红脸小幅挥手",
      title: "直播开始前的小小挥手",
      note: "进入画师模式时，她盯着线稿比谁都认真。发现镜头还开着，才用袖口挡住脸，飞快挥了一下手：“只、只是在确认画面。”",
      expression: "startled",
      reaction: "刚才不算打招呼……只是确认镜头。"
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
      id: "door-note",
      image: "assets/v4/gallery-door-note.webp",
      thumb: "assets/v4/gallery-door-note-thumb.webp",
      alt: "银白长发的女孩藏在半开的卧室门后，脸红着从门缝递出一张画有小猫的卡片",
      title: "谢谢要从门缝里递出来",
      note: "亲口说出口还是太难了，于是她把认真画好的小猫卡片从门缝推给你。等你接稳，门后才传来一句：“那、那只小猫不许笑。”",
      expression: "shy",
      reaction: "卡片收好就行……不许笑上面那只小猫。"
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
      id: "sketch-sort",
      image: "assets/v4/gallery-sketch-sort.webp",
      thumb: "assets/v4/gallery-sketch-sort-thumb.webp",
      alt: "银白长发的女孩穿粉色长袖家居服坐在地毯上整理速写，抱住一张画稿并害羞地把另一张推向来访者",
      title: "最喜欢的那张先藏住",
      note: "散在地毯上的草稿被分成好多小堆。她把最喜欢的一张紧紧抱住，却又把另一张悄悄推向你：“这张……可以替我保管一下。”",
      expression: "shy",
      reaction: "最喜欢的先不行……这张可以替我保管。"
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
    tablet: { label: "数位板", hint: "她的手刚从画面中央那块最常碰的黑色板子旁收回来。", text: "快捷键都设成单手能按到，因为另一只手常常要抱着靠枕。" },
    headphones: { label: "耳机", hint: "画线稿以前，她总会先看一眼画面左上方的耳机。", text: "画线稿时会循环同一张安静的歌单，音量永远只开到三格。" },
    manuscript: { label: "轻小说稿件", hint: "桌面左下角那叠纸的页边，好像画了比正文更多的东西。", text: "页边画满了表情草稿。比起剧情批注，她更先注意角色有没有好好笑出来。" },
    plush: { label: "猫咪玩偶", hint: "她卡住的时候，视线会飘向画面右上方那只软绵绵的家伙。", text: "不顺利的时候会被抱得很紧。顺利的时候，也一样。" },
    drawer: { label: "上锁抽屉", hint: "最不肯解释的东西，通常被她推到桌子的右下角。", text: "钥匙藏在薄荷色铅笔盒底下。不过，要集齐五枚猫爪才可以打开。" }
  },
  drawingStory: {
    frames: {
      focus: {
        image: "assets/v6/studio-focus.webp",
        small: "assets/v6/studio-focus-720.webp",
        alt: "纱雾在雨夜的画桌前低头用数位板认真画线稿"
      },
      blink: {
        image: "assets/v6/studio-blink.webp",
        small: "assets/v6/studio-blink-720.webp",
        alt: "纱雾低头画线时轻轻眨了一下眼睛"
      },
      shy: {
        image: "assets/v6/studio-shy.webp",
        small: "assets/v6/studio-shy-720.webp",
        alt: "被认真夸奖后，纱雾脸红着用长袖袖口遮住嘴角"
      },
      reveal: {
        image: "assets/v6/studio-reveal.webp",
        small: "assets/v6/studio-reveal-720.webp",
        alt: "纱雾露出害羞又有一点得意的表情，把刚完成的小猫画推到桌边"
      }
    },
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
        image: "assets/v6/drawing-door-moon.webp",
        alt: "奶油稿纸上，一只小猫从半开的房门后看向月亮和星星的铅笔水彩画",
        line: "门只开这么大……但月亮还是看得见。",
        stageNote: "她先画了一条很窄的门缝，又在外面留了一轮月亮。"
      },
      blanket: {
        label: "被窝里画星星的小猫",
        detail: "躲进最小的画室，还是很认真地下笔",
        image: "assets/v6/drawing-blanket-star.webp",
        alt: "奶油稿纸上，一只小猫躲在被窝帐篷里用铅笔画星星的铅笔水彩画",
        line: "被子里面比较安静……画线也不会抖。",
        stageNote: "她把被子画成一间很小的画室，只给笔尖留了出口。"
      },
      pencil: {
        label: "抱着大铅笔的小猫",
        detail: "看起来软绵绵，抱住画笔时却很认真",
        image: "assets/v6/drawing-pencil-stars.webp",
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
        image: "assets/v6/studio-focus.webp",
        small: "assets/v6/studio-focus-720.webp",
        width: 1448,
        smallWidth: 720,
        alt: "纱雾在暖灯与雨窗之间低头画稿，桌边放着数位板、铅笔和小猫玩偶",
        title: "先别叫她，她正画到最认真的地方。",
        line: "她把旁边的椅子留出一点，却一直装作只是忘了推回去。",
        quote: "“可以靠近……不要突然碰到数位板。”",
        ambient: [
          "笔尖还在移动，台灯把线稿照得很暖。",
          "她停下来眨了一下眼，又把刚才那根线重新描细。",
          "桌边那张共同完成的小画，被压在最不容易折到的位置。"
        ],
        autonomousFrame: {
          image: "assets/v6/studio-blink.webp",
          small: "assets/v6/studio-blink-720.webp",
          width: 1448,
          smallWidth: 720,
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
          { line: "她沿着刚才犹豫的轮廓补完最后一笔，肩膀终于松下来一点。", voice: "room-desk-pencil", sound: "assets/audio/v8/desk-pencil-line.mp3" },
          { line: "她把数位板转过来几度，只够你看见新画好的眼睛。", voice: "room-desk-eye", sound: "assets/audio/v8/desk-paper-turn.mp3" },
          { line: "保存提示轻轻闪了一下，她才发现你一直安静坐在旁边。", voice: "room-desk-stay", sound: "assets/audio/v8/desk-save-tap.mp3" }
        ]
      },
      bed: {
        label: "床边",
        image: "assets/v4/gallery-bed-drawing.webp",
        small: "assets/v4/gallery-bed-drawing-thumb.webp",
        width: 1364,
        smallWidth: 480,
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
            voice: "room-bed-blanket",
            sound: "assets/audio/v8/bed-blanket-fold.mp3",
            frame: {
              image: "assets/v4/gallery-blanket-fort.webp",
              small: "assets/v4/gallery-blanket-fort-thumb.webp",
              width: 1364,
              smallWidth: 480,
              alt: "纱雾躲进被子搭成的小帐篷，从帘边害羞地递出一张小猫速写"
            }
          },
          { line: "她把小帐篷收回床角，数位板又稳稳落在膝盖上。", voice: "room-bed-fort", sound: "assets/audio/v8/bed-fort-rustle.mp3", frame: "base" },
          { line: "最软的猫咪靠枕被推到你这边一点，她本人却迅速躲回袖口后。", voice: "room-bed-pillow", sound: "assets/audio/v8/bed-pillow-pat.mp3" }
        ]
      },
      wardrobe: {
        label: "衣橱边",
        image: "assets/v7/wardrobe-living.webp",
        small: "assets/v7/wardrobe-living-720.webp",
        width: 1448,
        smallWidth: 720,
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
          { line: "木衣架终于安静下来，她把差点滑落的袖子重新挂好。", voice: "room-wardrobe-hanger", sound: "assets/audio/v8/wardrobe-hanger-settle.mp3" },
          { line: "她把猫耳毯往身后藏了藏，露出来的耳尖还是轻轻晃了一下。", voice: "room-wardrobe-hood", sound: "assets/audio/v8/wardrobe-fabric-swish.mp3" },
          { line: "两套衣服又被并排举起来，这次她终于把选择权分给你一点。", voice: "room-wardrobe-choice", sound: "assets/audio/v8/wardrobe-choice.mp3" }
        ]
      },
      window: {
        label: "窗台",
        image: "assets/v4/gallery-goodnight.webp",
        small: "assets/v4/gallery-goodnight-thumb.webp",
        width: 1364,
        smallWidth: 480,
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
          { line: "窗缝窄了一点，雨声变轻，玩偶耳朵上的月光却还留着。", voice: "room-window-latch", sound: "assets/audio/v8/window-latch-rain.mp3" },
          { line: "她把上次那张小猫画靠在窗边，让画里的月亮和外面排在一起。", voice: "room-window-moon", sound: "assets/audio/v8/window-paper-rain.mp3" },
          { line: "窗帘安静落下，她在合上的画册上轻轻拍了两下。", voice: "room-window-close", sound: "assets/audio/v8/window-curtain-close.mp3" }
        ]
      }
    }
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
    livingPlace: "desk",
    livingWeather: "rain",
    roomSoundMuted: false
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
        livingPlace: validLivingPlace(current.livingPlace),
        livingWeather: validLivingWeather(current.livingWeather),
        roomSoundMuted: current.roomSoundMuted === true
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
        livingPlace: "desk",
        livingWeather: "rain",
        roomSoundMuted: false
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
      livingPlace: state.livingPlace,
      livingWeather: state.livingWeather,
      roomSoundMuted: state.roomSoundMuted
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
  doorScene: document.querySelector("#doorScene"),
  doorLeaf: document.querySelector("#doorLeaf"),
  knockButton: document.querySelector("#knockButton"),
  doorStatus: document.querySelector("#doorStatus"),
  doorHanger: document.querySelector(".door-hanger"),
  visitNote: document.querySelector("#visitNote"),
  heroCharacter: document.querySelector("#heroCharacter"),
  feedbackDock: document.querySelector("#feedbackDock"),
  reactionCorner: document.querySelector("#reactionCorner"),
  reactionImage: document.querySelector("#reactionImage"),
  reactionLabel: document.querySelector("#reactionLabel"),
  reactionText: document.querySelector("#reactionText"),
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
  storyStageLabel: document.querySelector("#storyStageLabel"),
  storyStageNote: document.querySelector("#storyStageNote"),
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
  livingRoom: document.querySelector("#living-room"),
  livingRoomStage: document.querySelector("#livingRoomStage"),
  livingRoomView: document.querySelector(".living-room-view"),
  livingRoomImage: document.querySelector("#livingRoomImage"),
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
  fortuneNote: document.querySelector("#fortuneNote strong"),
  fortuneButton: document.querySelector("#fortuneButton")
};

let doorOpened = false;
let heroSequence = 0;
let outfitSequence = 0;
let gallerySequence = 0;
let galleryPosition = state.galleryIndex;
let voiceSequence = 0;
let lastFortune = 0;
let feedbackTimer = 0;
let secretHintTimer = 0;
let activeVoiceScene = "";
let lightboxPointerStart = null;
let storyStep = -1;
let storyBusy = false;
let storyFrameSequence = 0;
let storyBlinkTimer = 0;
let storyInView = false;
let storyDraft = { presence: "", subject: "", palette: "", praise: "" };
let livingFrameSequence = 0;
let livingAutonomyTimer = 0;
let livingMomentTimer = 0;
let livingInView = false;
let livingPointerStart = null;
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
  return item.small ? `${item.small} 560w, ${item.image} 1122w` : "";
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
  elements.heroCharacter.src = expression.image;
  elements.heroCharacter.srcset = responsiveSourceSet(expression);
  elements.heroCharacter.alt = expression.alt;
}

function applyVisitStage() {
  elements.visitNote.textContent = visitStage.note;
  elements.doorHanger.textContent = visitStage.hanger;
  elements.doorStatus.querySelector("span").textContent = visitStage.lead;
  elements.doorStatus.querySelector("strong").textContent = visitStage.quote;
  elements.reactionText.textContent = visitStage.reaction;
  elements.secretMessageText.textContent = visitStage.secretMessage;
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
  if (!item.small) return "";
  return `${item.small} ${item.smallWidth || 720}w, ${item.image} ${item.width || 1448}w`;
}

function setLivingRoomImage(item) {
  if (!item) return;
  elements.livingRoomImage.src = item.image;
  elements.livingRoomImage.srcset = livingSourceSet(item);
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

function prepareAllLivingAudio() {
  Object.keys(CONTENT.livingRoom.places).forEach(prepareLivingAudioForPlace);
  ["room-weather-rain", "room-weather-clear"].forEach((id) => {
    prepareVoiceFile(CONTENT.livingRoom.voices[id]?.file);
  });
  prepareRoomFxFile("assets/audio/v8/weather-rain-window.mp3");
  prepareRoomFxFile("assets/audio/v8/weather-clear-window.mp3");
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
  elements.livingWeatherToggle.setAttribute("aria-pressed", String(raining));
  elements.livingWeatherToggle.setAttribute("aria-label", raining ? "让房间窗外的细雨停一会儿" : "让房间窗外落一阵细雨");
  elements.livingWeatherToggle.querySelector("strong").textContent = raining ? "细雨" : "晴月";
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
  elements.livingRoomAmbient.textContent = `${place.ambient[0]} ${phase.note}`;
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
    elements.livingRoomStatus.textContent = "场景声暂时没有加载出来，画面与文字反馈仍然保留。";
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
  elements.livingRoomStatus.textContent = `${place.label}：${momentLine}`;
  livingMomentTimer = window.setTimeout(() => {
    elements.livingRoomStage.classList.remove("is-moment");
    scheduleLivingAutonomy();
  }, reducedMotion.matches ? 20 : 2100);
}

function scheduleLivingAutonomy() {
  window.clearTimeout(livingAutonomyTimer);
  if (!livingInView || reducedMotion.matches || document.visibilityState !== "visible") return;
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
  if (doorOpened) {
    updateReaction({ expression: "shy", label: "门已经开着", text: visitStage.openReaction }, false);
    return;
  }
  doorOpened = true;
  prepareAllLivingAudio();
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
    elements.doorStatus.querySelector("span").textContent = visitStage.openLead;
    elements.doorStatus.querySelector("strong").textContent = visitStage.openQuote;
    setHeroExpression("shy");
    updateReaction({ expression: "shy", label: "门打开以后", text: visitStage.openReaction }, false);
  }, reducedMotion.matches ? 20 : 760);
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
  elements.outfitImage.src = outfit.image;
  elements.outfitImage.srcset = responsiveSourceSet(outfit);
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
    saveState();
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
    button.setAttribute("aria-pressed", String(state.secrets.has(button.dataset.secret)));
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
  elements.secretHint.textContent = CONTENT.secrets[remaining[index]].hint;
}

function scheduleGentleHint(delay = 11000) {
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

  state.secrets.add(key);
  saveState();
  refreshSecrets();
  const unlocked = state.secrets.size === Object.keys(CONTENT.secrets).length;
  if (!unlocked) {
    elements.secretHint.textContent = `${secret.label}被她默默承认了。剩下的先别急着找。`;
    scheduleGentleHint(7500);
  }
  updateReaction(unlocked ? "unlocked" : { ...CONTENT.reactions.secret, text: `${secret.label}：${secret.text}` });
  if (unlocked) elements.secretMessage.focus?.();
}

const STORY_STEP_KEYS = ["presence", "subject", "palette", "praise"];
const STORY_PALETTE_CLASSES = ["palette-strawberry", "palette-mint", "palette-moon"];

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
  elements.storyStageImage.src = frame.image;
  elements.storyStageImage.srcset = responsiveSourceSet(frame);
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
    && !reducedMotion.matches
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
  button.setAttribute("aria-pressed", String(storyDraft[stepKey] === key));
  if (stepKey === "palette") {
    const swatch = document.createElement("i");
    swatch.className = `story-swatch story-swatch--${key}`;
    swatch.setAttribute("aria-hidden", "true");
    button.append(swatch);
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
  storyStep = -1;
  storyBusy = false;
  elements.storyTheater.removeAttribute("aria-busy");
  const hasMemory = Boolean(validSharedDrawing(state.sharedDrawing));
  elements.storyBeat.textContent = hasMemory ? "桌边还压着上次的稿纸" : "笔尖还在慢慢移动";
  elements.storyPrompt.textContent = hasMemory ? "这次，也陪她画一张吗？" : "要不要安静陪她画一会儿？";
  elements.storyLine.textContent = hasMemory
    ? "她没有把上次那张收进抽屉，只在旁边重新放了一张空白稿纸。"
    : "她给旁边留了一点位置，却一直装作只是忘了把椅子推回去。";
  elements.storyStageLabel.textContent = "截稿前的雨夜";
  elements.storyStageNote.textContent = "她画得太认真，暂时没有发现你已经坐下。";
  elements.storyArtPreview.hidden = true;
  elements.storyBack.hidden = true;
  elements.storyRestart.hidden = true;
  const button = document.createElement("button");
  button.className = "story-choice story-choice--primary";
  button.type = "button";
  button.dataset.storyStart = "";
  const title = document.createElement("strong");
  title.textContent = "坐到她留出的椅子旁";
  const detail = document.createElement("span");
  detail.textContent = "只在她需要的时候开口";
  button.append(title, detail);
  button.addEventListener("click", startDrawingStory);
  elements.storyChoices.replaceChildren(button);
  transitionStoryFrame("focus");
}

function renderStoryStep(focusFirstChoice = true) {
  const stepKey = STORY_STEP_KEYS[storyStep];
  const config = storyStepConfig(stepKey);
  if (!config) return;
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
  storyDraft = { presence: "", subject: "", palette: "", praise: "" };
  storyStep = 0;
  preloadResponsiveImage(CONTENT.drawingStory.frames.shy, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
  preloadResponsiveImage(CONTENT.drawingStory.frames.reveal, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1024px) 58vw, 700px").catch(() => {});
  transitionStoryFrame("focus");
  renderStoryStep();
  updateReaction({ expression: "shy", label: "椅子被留出来了", text: "……可以坐。只要安静一点。" }, false);
}

async function chooseStoryOption(stepKey, key) {
  if (storyBusy || STORY_STEP_KEYS[storyStep] !== stepKey) return;
  const config = storyStepConfig(stepKey);
  const option = config?.options[key];
  if (!option) return;
  storyBusy = true;
  storyDraft[stepKey] = key;
  [...elements.storyChoices.children].forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-pressed", String(button.dataset.storyChoice === key));
  });

  if (stepKey === "subject") {
    preloadImage(option.image).catch(() => {});
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
      renderStoryStep();
    }, reducedMotion.matches ? 10 : 280);
    return;
  }

  elements.storyTheater.setAttribute("aria-busy", "true");
  updateReaction({ expression: "shy", label: "被认真看见了", text: option.line }, false);
  await transitionStoryFrame("shy");
  if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 680));
  state.sharedDrawing = {
    presence: storyDraft.presence,
    subject: storyDraft.subject,
    palette: storyDraft.palette,
    praise: storyDraft.praise,
    completedAt: Date.now()
  };
  saveState();
  await transitionStoryFrame("reveal");
  storyBusy = false;
  renderStoryResult();
}

function renderStoryResult() {
  const subject = CONTENT.drawingStory.subjects[storyDraft.subject];
  const palette = CONTENT.drawingStory.palettes[storyDraft.palette];
  const praise = CONTENT.drawingStory.praises[storyDraft.praise];
  elements.storyTheater.removeAttribute("aria-busy");
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
  if (storyBusy || storyStep <= 0) return;
  storyStep -= 1;
  transitionStoryFrame("focus");
  renderStoryStep();
}

function restartDrawingStory() {
  storyDraft = { presence: "", subject: "", palette: "", praise: "" };
  storyStep = 0;
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
    storyInView = entry.isIntersecting;
    elements.storySection.classList.toggle("is-in-view", storyInView);
    if (storyInView) {
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

function applyGallery(index) {
  const item = CONTENT.gallery[index];
  const chapter = galleryChapterFor(index);
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
  active?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
  if (elements.galleryLightbox.open) applyLightbox(index);
}

function preloadGalleryNeighbors(index = galleryPosition) {
  [-1, 1].forEach((offset) => {
    const next = (index + offset + CONTENT.gallery.length) % CONTENT.gallery.length;
    preloadImage(CONTENT.gallery[next].image).catch(() => {});
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
    await preloadImage(item.image);
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

function newFortune() {
  let next = Math.floor(Math.random() * CONTENT.fortunes.length);
  if (CONTENT.fortunes.length > 1 && next === lastFortune) next = (next + 1) % CONTENT.fortunes.length;
  lastFortune = next;
  elements.fortuneNote.textContent = CONTENT.fortunes[next];
  updateReaction("fortune");
}

function preloadDoorSequence() {
  [CONTENT.heroExpressions.startled, CONTENT.heroExpressions.shy]
    .forEach((item) => preloadResponsiveImage(item, "(max-width: 760px) calc(100vw - 1.6rem), (max-width: 1024px) 78vw, 1120px").catch(() => {}));
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
    button.addEventListener("pointerenter", prepare, { once: true });
    button.addEventListener("focus", prepare, { once: true });
    button.addEventListener("pointerdown", prepare, { once: true });
  });

  const prepareCurrentRoom = () => prepareLivingAudioForPlace(state.livingPlace);
  [elements.livingEventButton, elements.livingVoiceButton].forEach((button) => {
    button.addEventListener("pointerenter", prepareCurrentRoom);
    button.addEventListener("focus", prepareCurrentRoom);
    button.addEventListener("pointerdown", prepareCurrentRoom);
  });
  elements.livingWeatherToggle.addEventListener("pointerenter", prepareAllLivingAudio, { once: true });
  elements.livingWeatherToggle.addEventListener("focus", prepareAllLivingAudio, { once: true });
  elements.livingWeatherToggle.addEventListener("pointerdown", prepareAllLivingAudio, { once: true });

  if (!("IntersectionObserver" in window)) {
    voiceButtons.forEach((button) => prepareVoiceLine(button.dataset.voice));
    prepareAllLivingAudio();
    return;
  }

  const voiceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      prepareVoiceLine(entry.target.dataset.voice);
      voiceObserver.unobserve(entry.target);
    });
  }, { rootMargin: "520px 0px" });
  voiceButtons.forEach((button) => voiceObserver.observe(button));

  const roomObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    prepareAllLivingAudio();
    roomObserver.disconnect();
  }, { rootMargin: "900px 0px" });
  roomObserver.observe(elements.livingRoom);
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

elements.storyStageImage.addEventListener("error", () => {
  elements.storyStage.classList.add("is-image-missing");
  elements.storyStageNote.textContent = "场景插画暂时没有加载出来，她写下的台词和选择还可以继续。";
}, { once: true });

elements.knockButton.addEventListener("click", openDoor);
elements.knockButton.addEventListener("pointerenter", preloadDoorSequence, { once: true });
elements.knockButton.addEventListener("focus", preloadDoorSequence, { once: true });
elements.knockButton.addEventListener("pointerdown", preloadDoorSequence, { once: true });
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
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    scheduleStoryBlink();
    scheduleLivingAutonomy();
  } else {
    window.clearTimeout(storyBlinkTimer);
    window.clearTimeout(livingAutonomyTimer);
  }
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
buildGalleryChapters();
buildGalleryThumbs();
applyOutfit(state.outfit);
applyGallery(galleryPosition);
refreshSecrets();
setupSecretHints();
setupLivingRoom();
setupDrawingStory();
setupParallax();
setupAudioWarmup();
observeDeferredSections();
document.documentElement.dataset.js = "true";
