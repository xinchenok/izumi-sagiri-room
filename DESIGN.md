---
name: 和泉纱雾的房门里
description: 从半掩房门到晚安纸条的一次安静拜访
colors:
  strawberry: "#d8879f"
  strawberry-deep: "#a04f69"
  strawberry-pale: "#efbcc9"
  wallpaper-pink: "#d99aae"
  moon-silver: "#cfe8ed"
  moon-blue: "#3f6078"
  night-blue: "#273e59"
  night-deep: "#1c2c42"
  mint: "#a9cfbf"
  mint-pale: "#d9eee5"
  cocoa-door: "#573a3e"
  cocoa-mid: "#79545a"
  cocoa-light: "#a87672"
  cream-paper: "#fff6df"
  manuscript-paper: "#f8e8c5"
  paper-shadow: "#dfc99f"
  ink: "#3c2a31"
  ink-soft: "#684b56"
  quiet-white: "#fffaf1"
  butter-yellow: "#f3d16d"
  focus-blue: "#183f73"
typography:
  display:
    fontFamily: "Kuaile, YouYuan, Yuanti SC, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Kuaile, YouYuan, Yuanti SC, sans-serif"
    fontSize: "clamp(2rem, 4.3vw, 4.7rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "normal"
  title:
    fontFamily: "Kuaile, YouYuan, Yuanti SC, sans-serif"
    fontSize: "clamp(1.55rem, 3vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "normal"
  body:
    fontFamily: "Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "normal"
  label:
    fontFamily: "Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sharp-paper: "0"
  pencil: "0.25rem 1.2rem 1.2rem 0.25rem"
  circle: "50%"
  pill: "999px"
spacing:
  compact-gap: "0.55rem"
  control-gap: "0.75rem"
  paper-pad: "1.2rem"
  content-gap: "2rem"
  section-block: "clamp(5rem, 10vw, 9rem)"
components:
  button-paw:
    backgroundColor: "{colors.strawberry-deep}"
    textColor: "{colors.quiet-white}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1rem"
  button-pencil:
    backgroundColor: "{colors.mint-pale}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pencil}"
    padding: "0.55rem 0.9rem"
  button-round:
    backgroundColor: "{colors.cocoa-mid}"
    textColor: "{colors.quiet-white}"
    rounded: "{rounded.circle}"
    size: "3rem"
  nav-door:
    backgroundColor: "{colors.cocoa-door}"
    textColor: "{colors.quiet-white}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp-paper}"
    padding: "0.55rem 1.1rem"
  paper-note:
    backgroundColor: "{colors.manuscript-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp-paper}"
    padding: "1.2rem"
  outfit-option:
    backgroundColor: "{colors.cream-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp-paper}"
    padding: "0.55rem 0.8rem"
  film-thumb:
    backgroundColor: "{colors.cream-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp-paper}"
    padding: "0.42rem 0.42rem 1.45rem"
  feedback-dock:
    backgroundColor: "{colors.night-deep}"
    textColor: "{colors.quiet-white}"
    rounded: "{rounded.sharp-paper}"
    padding: "0"
---

# Design System: 和泉纱雾的房门里

## Overview

**Creative North Star: “门缝里的安静拜访”**

这是一个 code-led 的房门偷看叙事：访客先站在银蓝走廊里，被半掩的可可木门和门缝后的蓝眼睛拦住；轻轻敲门、获得回应之后，才依次进入画桌、衣橱相册、胶片画稿与晚安纸条。它不是角色资料卡集合，而是一段有距离、有许可、会回应的拜访过程。

草莓粉墙纸建立柔软私密的房间气氛，银蓝月光划分门外与夜晚，薄荷文具负责轻盈提示，可可木门承担结构与边界，奶油稿纸承载台词、留言和说明。可爱来自人物反应、创作物件和手工媒介，而不是廉价卡通堆叠；角色始终全年龄、日常化、非性感化。

品牌的五个不变量是：害羞但不冷淡，可爱但不幼稚，用创作细节讲角色，每次互动都轻柔而明确地回馈，人物始终处于安全日常情境。房门是本页的签名表达；后续界面可以复用“先观察、再获准靠近”的关系，不应机械复制同一扇门。

**Key Characteristics:**

- 半掩木门、门牌和门把构成第一视觉阈值。
- 猫爪印章、铅笔标签、胶带、拍立得、衣橱相册与胶片统一控件语言。
- 本地角色插画与语音承担证明内容，界面本身保持安静。
- 所有操作都汇入同一个反应与字幕停靠区，反馈不散落成多套浮层。
- 手作纸面保持清晰阅读顺序、键盘可达和 WCAG AA 对比目标。

## Colors

配色来自五种具体物件：草莓粉墙纸、银蓝月光、薄荷文具、可可木门与奶油稿纸。frontmatter 是唯一数值来源；正文只规定颜色关系和使用场景。

### Primary

- **草莓墙纸组：** `wallpaper-pink` 是站点背景，`strawberry-pale` 是房间与相册内页，`strawberry` 用于服装色样和纸屑，`strawberry-deep` 用于猫爪主行动、活动状态与印章。
- **可可木门组：** `cocoa-door` 是导航、画桌框架和门框的主深色，`cocoa-mid` 建立门板、相册边框和圆形翻页按钮，`cocoa-light` 表达被磨亮的木面层次。

### Secondary

- **银蓝月光组：** `night-deep`、`night-blue` 组成门外走廊、画稿暗室和反馈停靠区；`moon-blue` 是描边与晚安场景，`moon-silver` 是夜色上的正文和月光细节。
- **薄荷文具组：** `mint-pale` 是铅笔按钮和衣橱背景，`mint` 用于胶带、相片角和完成提示；薄荷只做平衡与工具提示，不抢走草莓粉的角色识别度。

### Tertiary

- **黄油亮点：** `butter-yellow` 只用于门把、猫爪进度、胶片选中框、夜间主按钮与庆祝纸屑，表达发现或完成。

### Neutral

- **奶油稿纸组：** `cream-paper` 是偏亮纸面，`manuscript-paper` 是台词、相册与晚安纸条，`paper-shadow` 是纸边与虚线压痕，`quiet-white` 是夜色上的温暖白。
- **墨色组：** `ink` 是纸面主文字，`ink-soft` 是说明文字，`focus-blue` 专用于高可见焦点轮廓。

**门内外规则。** 银蓝夜色只定义门外、画稿与晚安时刻；进入房间后必须由草莓粉、薄荷和稿纸接管，不把整页做成同一种粉色或同一种深色。

**黄油稀缺规则。** 黄油黄只标记可以被触碰、已经发现或值得庆祝的东西；同一局部不新增第二套高亮色。

## Typography

**Display Font:** 本地 ZCOOL KuaiLe，以 `YouYuan`、`Yuanti SC` 和无衬线字体回退。  
**Body Font:** 系统中文字体栈 `Microsoft YaHei`、`PingFang SC`、`Noto Sans CJK SC` 与通用无衬线字体。

**Character:** Kuaile 像写在门牌、相册和纸条上的圆润手写标题；系统中文字体负责台词、说明、状态和版权信息，保证长句清楚。二者的关系是“有性格的短标题 + 克制易读的正文”。

### Hierarchy

- **Display：** Kuaile 常规字重、流式大标题，用于各场景二级标题；负字距只在这一层收紧。
- **Headline：** Kuaile 常规字重、紧凑行高，用于门牌角色名和相册核心名称。
- **Title：** Kuaile 常规字重，用于画稿标题、便签和局部互动主题。
- **Body：** 系统中文字体常规字重与宽松行高，用于叙述、台词与状态；说明段落通常控制在约 31–40rem。
- **Label：** 系统中文字体高字重、轻微字距，只用于门牌提示、场景名、进度和版权标签；不承担长段阅读。

**双字体规则。** Kuaile 只负责短而有情绪的标题，正文、日语字幕、简体中文字幕和交互状态一律使用系统字体；不得用装饰字体覆盖整页内容。

## Layout

页面使用纵向叙事与 1200px 最大内容宽度。桌面区段以左右非对称网格制造“门板遮挡、相册摊开、窗格并置”的空间感，不使用等宽卡片墙。区段纵向留白采用流式大间距，内容容器在宽屏由视口自动生成等量边距。

首屏的视觉与操作顺序固定为“门把 → 台词稿纸 → 轻轻敲门”：黄油色门把是视线锚点，门把下方的稿纸卡先解释门内状态与台词，猫爪按钮作为稿纸内的首要行动完成敲门。不得把敲门按钮移成脱离门体的全屏 CTA，也不得让台词先于门把抢占视觉中心。

- **1440px 校验画幅：** 内容最大宽度为 1200px，常规区段左右各约 120px；房门和相册主体最大约 1120px。首屏木门位于左侧前景，人物在右侧门缝出现，稿纸卡压在门板下部与人物交界处。
- **1024px 校验画幅：** 触发紧凑桌面布局；房门场景宽度为视口减 4rem，门板扩大到 57%，人物扩大到 78%。性格便签从三列变两列，画桌从左右分栏改为上下堆叠，衣橱相册调整为 55% / 45%。
- **390px 校验画幅：** 同时使用 760px 堆叠规则与 410px 窄屏修正；导航隐藏迷你门牌文字但保留四个 44px 锚点，房门场景高 40rem，稿纸卡占 74% 并贴近门把下方。主要区段单列，补充插画保持原始 4:3 比例，五秘密提示缩为小型徽记但命中区不缩小，隐藏留言使用小头像与完整正文两列，衣橱照片高 28rem，胶片横向滚动，反馈停靠区贴齐左右安全边距。
- **矮桌面窗口：** 761px 以上视口不再无限压缩房门舞台；场景最低保持 680px 高，让门牌、门把与敲门稿纸维持分区，空间不足时由页面自然纵向滚动。

**叙事顺序规则。** 响应式只能重排空间，不能改变“门口—画桌—衣橱—画稿—晚安”的阅读顺序，也不能把人物证明图折叠到交互之后。

## Elevation & Depth

层次由真实物件关系、透视门板、纸面重叠和少量环境阴影共同建立。门外和画稿使用更深的夜色阴影，便签和相片使用粉棕阴影；没有玻璃拟态、模糊背板或纯黑硬阴影。

### Shadow Vocabulary

- **门槛深度：** 房门舞台使用大范围夜色投影并配合内描边，表达门框厚度与前后景距离。
- **纸面浮起：** 便签、拍立得、相册内页使用低不透明粉棕阴影，配合轻微旋转而不是额外容器。
- **夜间画框：** 画稿主图与窗格使用更深、更宽的环境阴影，在深蓝背景上仍保持边缘可辨。
- **反馈停靠：** `feedback-dock` 使用单层紧凑阴影；临时浮起时不增加第二层更重的阴影。

**物件先于阴影规则。** 先用门框、相册书脊、窗格、纸边和遮挡建立深度，阴影只补充环境光；任何看起来像黑色描边的投影都过重。

## Shapes

形状语言以真实房间物件为准：门框、稿纸、相册、胶片和导航保持明确直角；猫爪主按钮是胶囊，翻页与印章是圆形，铅笔按钮使用一端方、一端圆的削笔轮廓。纸面可用轻微旋转、胶带、撕边和 `clip-path` 制造手作感，但正文基线与点击区域保持稳定。

- **门牌：** 直角稿纸、双薄荷挂点、圆形猫爪印章。
- **猫爪：** 胶囊按钮与爪印进度共同表达主要行动和发现状态。
- **铅笔：** 左端短直角、右端圆角，负责语音等次级行动。
- **拍立得 / 衣橱相册：** 奶油纸相框、薄荷照片角、可可书脊和轻微页转透视。
- **胶片：** 直角缩略图、底部双齿孔、横向卷轴和黄油色选中框。

**轮廓归因规则。** 每个可见形状都必须能被解释为门、纸、胶带、印章、铅笔、照片、相册或胶片；不得加入没有叙事来源的通用圆角卡片。

## Components

### Navigation

顶部导航是粘在门框上的可可木条：左侧迷你门牌，中间四个房间锚点，右侧“请小声一点”状态灯。桌面悬停和键盘焦点用黄油下划线提示；移动端隐藏状态灯并压缩门牌，但四个锚点仍保留 2.75rem（44px）最小触控尺寸。

### 房门首屏

房门舞台由银蓝走廊、草莓墙纸内景、人物 PNG、透视门板、门牌、门把和稿纸卡叠成。初始状态只能偷看；敲门后人物先受惊，再在默认 760ms 后脸红并开门，门板以 1100ms 绕左侧旋转。门牌承担身份，门把承担视觉引导，稿纸承担台词，猫爪按钮承担许可动作，四者不可互相替代。

### Buttons

- **猫爪主按钮：** 草莓深色胶囊、温暖白字、最小高度 3rem；夜间变体改用黄油黄与墨色。
- **铅笔按钮：** 薄荷纸底、银蓝描边、不对称圆角、最小高度 2.9rem，用于语音和次级动作。
- **圆形翻页按钮：** 可可中间色圆形、3rem 方形点击区，用于相册与画稿前后切换。
- **States：** 悬停上移 2px，按下下移 2px；所有按钮与链接使用 3px `focus-blue` 可见焦点并外偏移 4px。新增触控控件的可用命中区不得小于 44 × 44px；紧凑图标的可见圆可以更小，但必须补足外围命中区。

### 稿纸、相册与胶片

性格便签使用账页线、胶带、撕边与拍立得三种不同纸面，不统一成同一种卡片。衣橱是左右摊开的实体相册，服装切换同时更新本地 PNG、名称、描述、时间、`aria-pressed` 和反应；胶片条横向滚动并用黄油边框与位置变化共同表示选中。画册固定为十一个不重复情景，按“床上画画—被窝画室—安静直播—举起画稿—靠枕后递画—门缝卡片—专心作画—整理草稿—藏起画册—等待夸奖—晚安”推进，不用换装图填充数量。“夸夸她的画”语音入口紧跟胶片控件，以一张贴了胶带的小纸条承接“看画 → 夸她 → 听回答”，不得移回无关区段。

### 五个小秘密画桌

画桌使用一张 4:3 本地场景插画承载真实空间：纱雾坐在画桌后，耳机、轻小说稿件、数位板、猫咪玩偶与带锁抽屉分别占据互不重叠的热点区域。说明区与画面共用奶油稿纸和可可木框，不在插画上再叠大块通用矩形。热点是贴在真实物件旁的低透明小型猫爪纸签：位置按插画百分比锚定，命中区保持 44–52px；只有支持悬停的设备在悬停时或键盘 `focus-visible` 时展开名称，触屏点击与已发现状态只改变图标颜色，不永久覆盖画面。

### Feedback Dock

`feedback-dock` 是全站唯一反馈容器，把左侧即时表情与右侧日语 / 简体中文字幕合并为一条连续停靠带。静态时它位于主要内容之后、页脚之前，宽度上限 64rem；任意敲门、换装、秘密、画稿、纸条或语音操作触发后，它临时加上 `is-peeking` 并固定浮到视口底部，正文同时留出底部空间，默认约 3.2 秒后回到静态位置。普通语音回答按入口各自洗牌，一轮听完以前不重复，重新洗牌时也避免与上一轮末句相邻重复；四句 `ふきげん` 回答独立放在门口和画桌的情境池，仅当同一入口 5 秒内连续触发 4 次时播放，随后冷却 25 秒，不得混入普通随机。回答同时更新场景标签、人物表情、日语字幕和简体中文字幕。语音播放期间保持浮起，播放结束、停止或错误后再延迟收回；移动端改为左侧 3.5rem 表情列加右侧字幕列，不拆成两套组件。

### Interaction & Motion

敲门使用“受惊—脸红—开门”，换装使用 520ms 翻页，画稿使用淡出与轻微放大，发现秘密使用猫爪进度与纸屑，反馈表情使用 420ms 轻弹。状态持久化只保存服装与已发现秘密；图片失败保留门和文字，语音失败保留双语字幕。

在 `prefers-reduced-motion: reduce` 下，平滑滚动关闭，动画和过渡压缩到 0.01ms，纸屑隐藏，视差不注册，门板不旋转而以低透明度露出内景；脚本中的门、换装和画稿等待同步缩短。减少动态只改变表现，不删除内容、状态、字幕或反馈。

### Accessibility & Local Assets

以 WCAG AA 为最低目标：原生按钮支持键盘，页面提供跳转主要内容链接，焦点轮廓不依赖颜色状态之外的隐含信息；选项同时使用位置 / 边框与 `aria-pressed`，进度和字幕使用 `aria-live`，图片有简体中文替代文本，日语语音始终伴随简体中文字幕。新增互动遵循 44 × 44px 最小触控命中区。

人物表情、三套服装与五秘密画桌继续使用 `assets/v3` 的本地资源；十一张运行时画册图及对应缩略图使用 `assets/v4` 的 4:3 WebP。二十二句日语回答使用 `assets/audio/v4` 下的 MP3，每句对应的完整 AivisSpeech 查询参数保存在 `assets/audio/v4/queries`。页脚必须长期保留 AivisSpeech「天深シノ」、依据 ACML-NC 1.0 使用及模型来源链接的署名，也必须保留 ZCOOL KuaiLe 依据 SIL Open Font License 1.1 使用的说明。不得改为远程热链，也不得使用官方截图、动画音轨或声优声纹克隆。

## Do's and Don'ts

### Do:

- **Do** 把访问许可写进构图与交互：先看见门和门把，再读台词，最后敲门。
- **Do** 使用草莓墙纸、银蓝月光、薄荷文具、可可木门和奶油稿纸建立明确物件关系。
- **Do** 让猫爪、铅笔、胶带、拍立得、衣橱相册和胶片承担控件语义。
- **Do** 让每次点击都有表情、字幕、状态或动效反馈，并统一进入 `feedback-dock`。
- **Do** 保持角色造型全年龄、日常化、非性感化，并让本地素材署名长期可见。
- **Do** 在 1440px、1024px 与 390px 校验叙事顺序、44px 触控和双语字幕完整性。

### Don't:

- **Don't** 使用霓虹电竞感、紫色科技渐变、装饰性玻璃拟态或纯黑硬阴影。
- **Don't** 把页面改成左右双栏营销首屏、统一尺寸动漫卡片墙或脱离门体的全屏 CTA。
- **Don't** 用通用圆角容器稀释门牌、稿纸、相册与胶片的真实轮廓。
- **Don't** 让临时反馈散落成多个 toast、表情角标和字幕条；只扩展统一停靠区。
- **Don't** 让动效遮挡内容或忽略减少动态设置，也不要只用颜色表达选择与完成。
- **Don't** 使用官方图片、动画音轨、声优声纹克隆、远程字体或未署名的本地语音。
