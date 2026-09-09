---
name: 纱雾的房间
description: 清爽日光里的房间、物件与轻声回应
colors:
  rose: "#b74063"
  rose-light: "#f38198"
  room-pink: "#f3dce3"
  paper: "#fff9fa"
  panel-surface: "#fff9fb"
  control-surface: "#fffdfd"
  control-hover: "#fff0f6"
  control-border: "#deb9c9"
  control-hover-ink: "#8f3456"
  ink: "#323142"
  ink-soft: "#67525e"
  sign-ink: "#683e53"
  mint-found: "#dfefe8"
  mint-found-ink: "#34594d"
  focus: "#215c89"
typography:
  display:
    fontFamily: "RoomSign, RoomTitle, serif"
    fontSize: "clamp(26px, 2.14vw, 36px)"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "RoomTitle, serif"
    fontSize: "clamp(19px, 1.65vw, 28px)"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "RoomBody, Microsoft YaHei, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  panel-body:
    fontFamily: "RoomBody, Microsoft YaHei, sans-serif"
    fontSize: "0.91rem"
    fontWeight: 400
    lineHeight: 1.75
  dialogue:
    fontFamily: "RoomBody, Microsoft YaHei, sans-serif"
    fontSize: "clamp(18px, 1.61vw, 27px)"
    fontWeight: 400
    lineHeight: 1.2
  japanese:
    fontFamily: "RoomJapanese, RoomBody, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "RoomBody, Microsoft YaHei, sans-serif"
    fontSize: "clamp(14px, 1.13vw, 19px)"
    fontWeight: 400
    lineHeight: 1.6
  paper-quote:
    fontFamily: "RoomTitle, serif"
    fontSize: "1.22rem"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  image: "10px"
  inspector-control: "12px"
  choice: "13px"
  caption: "15px"
  mobile-panel: "16px"
  control: "18px"
  inspector: "20px"
  panel: "22px"
  action: "2rem"
  navigation: "2.5rem"
spacing:
  compact-gap: "0.45rem"
  choice-gap: "0.55rem"
  action-gap: "0.75rem"
  panel-padding: "1rem 1.25rem"
  mobile-panel-padding: "0.85rem"
  control-padding: "0.55rem 0.85rem"
  action-padding: "0.6rem 1.4rem"
components:
  button-primary:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.paper}"
    rounded: "{rounded.action}"
    padding: "{spacing.action-padding}"
  button-secondary:
    backgroundColor: "#fffafc"
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "{spacing.action-padding}"
  object-chip:
    backgroundColor: "rgba(255, 252, 253, 0.97)"
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "0.16rem 0.55rem 0.16rem 0.35rem"
  place-navigation:
    backgroundColor: "rgba(255, 252, 253, 0.98)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.navigation}"
    padding: "0 0.6rem"
  story-choice:
    backgroundColor: "{colors.control-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.choice}"
    padding: "0.65rem 0.85rem"
  story-choice-hover:
    backgroundColor: "{colors.control-hover}"
    textColor: "{colors.control-hover-ink}"
  story-choice-selected:
    backgroundColor: "#fceaf1"
    textColor: "{colors.ink}"
    rounded: "{rounded.choice}"
  room-panel:
    backgroundColor: "{colors.panel-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  inspector-button:
    backgroundColor: "#fff"
    textColor: "{colors.ink}"
    rounded: "{rounded.inspector-control}"
    padding: "8px 12px"
  inspector-zoom:
    textColor: "{colors.ink}"
    height: "44px"
    width: "clamp(80px, 14vw, 190px)"
  dialogue-panel:
    backgroundColor: "#fff4f8"
    textColor: "{colors.ink}"
    padding: "0.65rem 1.1rem 0.9rem"
  drawing-footer:
    backgroundColor: "#fff4f8"
    textColor: "{colors.ink}"
    padding: "0.65rem 1.1rem 0.9rem"
---

# Design System: 纱雾的房间

## Overview

**Creative North Star: "清爽日光里的小小做客"**

角色和房间先于界面出现：樱粉墙面、浅木家具、银蓝头发与窗外日光构成主体，按钮和文字以少量浅色载体靠近可操作的物件。可爱来自她伸出的手、认真落笔的姿态、软软的袖口和眼神，不依靠额外爱心、脏纹理或厚重框架。

这是一个低密度、物件在场的视觉系统。背景、人物和画板以本地栅格分层呈现；短手写门签保留随手写下的亲近感，细线图标与清楚的中日文负责操作。需要阅读或选择时才展开轻量面板，完成后让视线回到角色；纸面只承载真实的作品、留言和少量引用，不覆盖整个房间。

本文由 `index.html`、`styles.css`、`inspector.css`、`room.js`、`room-inspector.js`、`room-core.js` 与 `script.js` 的现役实现提取，替换旧版七幕房门设计记录。YAML frontmatter 是令牌数值的规范来源；`.impeccable/design.json` 只扩展动效、断点、阴影和自包含组件片段。原始批准构图及阶段回执留在 `.impeccable/surfaces/index-html.md`；设计文档不是工具阶段通过凭证。

**Key Characteristics:**

- 清爽赛璐璐房间与银发蓝眼角色占据视觉中心。
- 玫红行动、近白控件和细线图标保持轻巧而可辨认。
- 龙藏体只写房间门签，文楷写短标题与纸条，Noto 负责中日文阅读。
- 字幕只有一份，随当前操作上下文移动，不叠加多套反应浮层。
- 桌面保留空间关系，手机将阅读和操作接到画面下方。
- 作品本身、手与画板的关系承担共同创作的视觉证据。

## Colors

颜色以房间素材的樱粉、浅木和银蓝为气氛，界面提取玫红强调、偏粉近白表面与深梅墨色，不把插画里的每个颜色升级为 UI 令牌。

### Primary

- **玫红回应：** `rose` 用于主要行动、当前地点文字与部分滑杆强调；`rose-light` 用于当前地点下划线。深底与浅字优先满足阅读，不能只为贴近参考图退回低对比配色。
- **樱粉房间底：** `room-pink` 是页面和加载前的底色，真正的墙面与家具颜色由本地背景图承担。

### Secondary

- **薄荷发现：** `mint-found` 与 `mint-found-ink` 只表达已经看过的秘密物件；保留状态文字和 `aria-pressed`，不以换色独自说明状态。

### Neutral

- **近白纸面：** `paper` 承担标题稳定底、夜间字幕底及主行动浅字；`panel-surface` 用于阅读面板与观察器，`control-surface` 用于可选按钮。
- **粉色边界：** `control-border` 划分普通控件；`control-hover` 与 `control-hover-ink` 共同表达面板按钮悬停，不使用发光外溢。
- **深梅墨色：** `ink` 是主要文字和图标，`ink-soft` 是观察器辅助说明，`sign-ink` 专用于门签文字。
- **焦点蓝：** `focus` 用于明确的键盘焦点轮廓，与玫红选择状态分工。

**The Clear Surface Rule.** 文字所处背景会随场景改变时，使用紧凑的稳定浅底保证阅读；不把大面积半透明罩层铺到人物和房间上。

## Typography

**Display Font:** 龙藏体 Long Cang 的本地 `RoomSign` 子集，只包含“纱雾的房间”五字，来源与许可见 `assets/fonts/v20/font-manifest.json` 和同目录 `OFL-LongCang.txt`。

**Title Font:** 霞鹜文楷 LXGW WenKai 的本地 `RoomTitle` 子集，用于面板标题、晚安引用、作品题签和无脚本阅读标题；不再承担房间 h1 的门签笔势。

**Body Font:** Noto Sans CJK SC 的本地 `RoomBody` 子集负责中文，Noto Sans CJK JP 的本地 `RoomJapanese` 子集负责日文；中文以 Microsoft YaHei 和 sans-serif 回退，日文以 RoomBody 和 sans-serif 回退。四个 `@font-face` 都使用常规字重与 `font-display: swap`。

运行字体路径为 `assets/fonts/v20/RoomSign.woff2`、`RoomTitle.woff2`、`RoomBody.woff2`、`RoomJapanese.woff2`；文楷许可为 `OFL-LXGWWenKai.txt`，Noto 许可为 `OFL-NotoSansCJK.txt`。实际字符覆盖、固定版本、来源哈希和导出哈希由字体清单记录，扩展文字时同步重建对应子集。

**Character:** 门签细长、松动，纸上标题温和而工整，操作与字幕清楚稳定。手写字不扩大成整页正文，日文不会依赖访客恰好装有日文字体。

### Hierarchy

- **Display：** 只用于 h1 门签；桌面采用 frontmatter 的流式规格，手机固定为 25px。小型浅底、深梅字，无软阴影或文字描边。
- **Title：** 用于面板标题；平板固定为 20px，手机为 21px。观察器标题另用 `clamp(21px, 2.1vw, 28px)`，手机为 22px。
- **Body / Panel body：** 中文正文稳定排版，面板段落采用独立阅读行高；无脚本段落宽度限制为 70ch。
- **Dialogue：** 房间主字幕采用短行流式字号；手机为 17px、1.65 行高，面板内为 0.94rem、1.7 行高，观察器另有适配。不能把房间短句的紧行高搬到长段文字。
- **Japanese：** 中文下方的辅助字幕；面板内为 0.76rem，手机主体为 0.78rem，始终标记 `lang="ja"`。
- **Label：** 地点栏和工具标签使用中文正文字体，不另造全大写眉题、编号标题或装饰性字距。
- **Paper quote：** 晚安纸条使用文楷和宽松行高，边线分隔而不另加重复纸纹。

**The Four Font Jobs Rule.** RoomSign 只负责固定 h1，RoomTitle 负责短标题与纸条，RoomBody 负责中文，RoomJapanese 负责日文；新增内容先选职责，再选字号。

## Layout

房间舞台是全宽的连续空间，桌面按 1681:936 比例组织，最低保持 100svh。背景覆盖舞台，透明人物按自己的容器等比容纳；镜头、人物与画板坐标各有明确父容器。批准首屏的具体物件位置属于 surface brief，不把这些百分比推广成所有后续界面的通用网格。

桌面标题位于左上，工具收在右上，物件入口靠近相应家具，字幕和成组行动在下方空位，地点栏居底。普通任务面板宽 35%，画册与记忆宽 41%，晚安宽 38% 并靠右；面板内是固定标题、可滚内容和共享字幕页脚。面板出现时不再生成第二套人物或独立房间。

| 视口范围 | 实际布局行为 |
| --- | --- |
| 1100px 以上 | 空间式桌面布局，浮动任务面板与底部胶囊地点栏。 |
| 761–1100px | 舞台最低 760px；工具宽 260px，地点栏宽 57%；普通面板宽 39%，画册与记忆宽 44%，内边距缩小。 |
| 760px 及以下 | 场景画面高 `clamp(360px, 57svh, 550px)`，后接面板、字幕、行动和可见物件行；页面自然纵向滚动，不依赖隐藏热点完成操作。 |

手机地点栏固定在底部，含安全区的高度为 `calc(65px + env(safe-area-inset-bottom))`；页面底部预留 `calc(72px + env(safe-area-inset-bottom))`。五个地点保持图标与中文文字，当前地点同时有文字强调和下划线。手机面板使用流式全宽、正常文档高度，画册和共同作品按原比例显示；衣服和缩略图允许局部横向滚动，不能造成整页横向溢出。

主要间距是紧凑选项间隙、成组行动间隙与面板内边距，不采用大段营销留白。观察器桌面宽 `min(1180px, calc(100vw - 40px))`、高 `min(880px, calc(100svh - 40px))`，手机分别为 `calc(100vw - 16px)` 和 `calc(100svh - 24px)`。

**The One Caption Rule.** 同一个字幕节点在房间、任务面板和观察器之间移动；新回应替换旧回应，中文为主、日文为辅，声音状态与重试留在相同上下文。

## Elevation & Depth

主体深度来自插画透视、透明人物和真实物件遮挡。界面使用低不透明度的粉梅环境阴影把必要的控件从画面中分离；不复制家具木框，不使用通用玻璃模糊，也不靠多层纸片制造层次。纸条与回忆照片可以有轻微旋转，因为它们确实是一张纸，而不是每个容器的默认装饰。

### Shadow Vocabulary

- **物件入口：** `0 3px 10px rgba(94, 62, 72, 0.07)`，帮助白色标签从局部插画分离。
- **任务面板：** `0 15px 40px rgba(102, 64, 80, 0.13)`，表达可退出的局部阅读层。
- **设置与邀请：** `0 12px 36px rgba(100, 62, 80, 0.14)`，用于短暂选择面板。
- **手机面板：** `0 6px 22px rgba(112, 69, 90, 0.07)`，在文档流中减轻浮层感。
- **手机地点栏：** `0 -4px 22px rgba(112, 69, 90, 0.09)`，只向内容上方投射轻影。
- **观察器：** `0 22px 70px rgba(40, 38, 60, 0.2)`，配合 `rgba(34, 40, 60, 0.72)` 原生对话框背幕。
- **回忆照片：** `0 5px 15px rgba(93, 67, 60, 0.12)`，保留实体照片与房间的距离。

**The Image Owns Depth Rule.** 房间的透视和遮挡由图像承担，界面阴影只解释可操作层；不要用厚木框、硬偏移投影或额外暗罩重画房间边界。

## Shapes

主要行动和物件标签是柔和胶囊，地点栏是更长的胶囊；阅读面板和观察器使用有边界的圆角矩形。选项、图片、缩略图的圆角随尺度减小，不把所有东西统一成同一个大圆角。圆角数值由 frontmatter 按已存在的组件角色命名，不宣称它们来自一个等比圆角尺度。

普通按钮边线为细粉描边，主行动保留白边，次行动有细内描边。图标使用内联 SVG、`currentColor`、圆线帽和圆连接；通常是 1.7px 描线，入口主行动的箭头为 2px。猫爪是门签旁的小型实心 SVG，手机隐藏，不扩展成通用爱心或满屏装饰系统。

门签的浅底只包住五个字与小爪印，圆角为 `0.16em 0.32em 0.32em 0.16em`；它不是大型稿纸框。新作品使用真实本地插画，画板跟随人物父坐标，不能以拉伸人物、遮住手腕或移动画纸去掩盖坐标误差。

## Components

### Buttons

短、清楚、像轻声邀请。主行动使用玫红浅字和白边，次行动使用近白底和细内描边；桌面最小高度 52px，手机 45px。两者悬停上移 2px、按下下移 1px，过渡为 0.2s 的现役缓动曲线。入口“走到她身边”保留右向内联箭头，不只保留文字。

面板普通按钮使用细粉边、近白底与 18px 圆角，悬停同时改变边线、文字和浅底；选项按钮按下可轻移 1px。主要交互命中区保持至少 44×44px；页面焦点为 3px 蓝轮廓、外偏移 4px，观察器外偏移 3px。禁用态降低不透明度，但不能代替加载说明、失败字幕或重试入口。

### Object chips & Navigation

物件入口是带圆环的近白标签，悬停只改变墨色并轻移，不添加呼吸光环。桌面入口靠近物件，手机隐藏画面热点并提供明确可见的等价物件行。它们是入口，不是待完成任务标签。

地点栏始终按“房间、画桌、衣橱、床边、窗边”排列；每项由细线图标、中文文字和原生按钮组成，当前项使用 `aria-pressed` 与下划线。手机变为图标在上、文字在下的底栏，不能隐藏文字只剩难猜的图标。

### Room panel & Story choice

任务面板是清爽的阅读层：标题与关闭按钮在上，内容在中，唯一字幕在下。桌面内部滚动，手机回到文档流。三个小日常沿用同一面板和选项语言；选项用两行以内的主句与较小补充说明，不伪装成问卷进度、奖励或正确答案。

陪画题材以三张实际草图并排呈现，配色选项带三个小色块的纸签；选中的陪伴方式、题材、配色与评价同时保留玫红边线、浅粉底、“已选”文字和 `aria-pressed`。题材草图等比容纳，高 90px；三列使用 `minmax(0, 1fr)`，长标签不撑开面板。色签数据来自 `CONTENT.roomExperience.drawingPaletteSwatches`，只是对应作品的选择提示，不代替真实配色画作。

衣橱保留五套实际人物缩略图与横向选择，选中态有粉色填充、边线和 `aria-pressed`。画册保留十一张原有作品，用主图、简短题注、翻页控件与缩略图条组织，不改为等宽图卡墙。画作图像保持 `contain`，图像本身不因面板比例改变而被拉伸。

### Shared artwork & Notes

共同创作的三主题、三配色对应九张真实作品；新画通过资源路径切换插画颜色，不使用全图染色滤镜。旧作品的 `.is-legacy` 叠色仅保留既有作品呈现，不是新作品的视觉规范。画板、成稿和人物使用一致父坐标，让手、笔尖与板边的接触关系成立。

未完成稿以独立的 `draftCover` 纸张层遮住画作，纸上写“先不许偷看。”；不是裁剪人物来冒充遮纸动作。主动偷看依次经过 `reveal → caught → corner`：先露画、盖回、最后留一角，膝上画板同步隐藏或只露同一角作品。各阶段同时更新提示与 `aria-expanded`；重复偷看保留三段原有文字反应，第三段后维持该边界。

陪伴方式、题材、配色、评价的十二条原分支 `line` 默认以文字回应展示；日文行清空，状态明确标为“文字回应”。“听她说说画稿”是独立的显式配音入口，使用当前阶段或偷看情境对应的真实音频及准确字幕，不拿通用配音覆盖刚选分支的原话。

陪画工具固定在任务面板的字幕页脚上方，不随正文滚走：选定题材后可偷看，安静陪伴时改为“现在继续一起画”和“回到刚才那一步”，并保留听画稿与暂存离开的入口。桌面陪画页脚最高占面板 38%，手机不限制该高度；关闭陪画或切到其他面板时移除这组工具。选择与回应记录放在正文中的原生 `details`，默认折叠，摘要保持 44px 命中高度，不另叠对话窗口。

安静陪伴按已保存的前台停留时间恢复 20、45、75 秒三个阶段，标题、短句、已到达圆点和当前阶段同步变化；`data-reached` 与 `aria-current="step"` 共同表达状态。离开陪画、隐藏页面或尚未恢复草稿时不累计，回到这里后接着原阶段；它不是倒计时或完成门槛，随时可以继续选择或离开。

完成时只有作品纸面轻轻前推，不宣称增加了人物递画姿态。作品记忆由陪伴方式、题材、配色、评价四个真实字段生成，成稿保留该次回应记录，未完成稿仍可恢复。

晚安纸条使用文楷引用、薄分隔线和明确的收下行动；回忆照片只呈现实际保存的成稿。没有事实时保持空缺，不加装饰性“熟悉度”刻度。

### Dialogue & Audio state

中文字幕是主反馈，日文、音频准备或失败状态是附属行。普通房间字幕占局部空位；说话、夜间和复杂背景时提供小型稳定浅底；面板内和观察器内使用其自身浅色表面，不另叠外部字幕条。

新回答中断旧回答，沿用同一 Piper Plus「つくよみちゃん」声线。声音同意、角色语音、物件声和环境声的控制彼此明确；雨天环境声只在同意后持续，晴天不自动循环短拟音。音频拒播或失败时保留准确字幕与重试，不切换到系统 TTS。此处记录控件行为，配音复现和许可细节以素材清单及 AI 协作文档为准。

### Inputs & Inspector

观察器使用原生 `dialog`，不是另一个全屏站点。主体为完整图片视口，控制区含关闭、复位、100%–200% 滑杆，以及适用时的前后翻页。按钮为 12px 圆角、白底细边，悬停浅粉、按下更深一档；范围输入保留原生可操作性和 44px 高度，焦点蓝轮廓清晰可见。

普通页面不接管滚动。只有观察器中启用拖动、双指缩放、滚轮与键盘操作，平移限制在图像边界，关闭后恢复触发点焦点和页面位置。大图必须以当前显示需要加载，不能把“4K 等比导出”写成“原生 4K”，也不能把请求到大文件当作已经验证清晰度。剪贴板失败时用现役多行文本框提供可复制文字，不把可恢复失败变成结束页面。

### Motion

控件状态使用 0.2s，房间镜头与人物容器变化使用 0.65s，缓动为 `cubic-bezier(0.16, 1, 0.3, 1)`；观察器按钮为 0.15s。活泼状态的人物呼吸周期为 5.5s、位移仅 1.5px，窗雨为 2.8s 线性循环。它们分别来自呼吸与窗雨行为，不增加与角色无关的装饰动画。

偷看使用独立盖纸层：位移过渡 0.22s，露角裁切过渡 0.24s；触发时进入 `reveal`，260ms 后进入 `caught`，再过 360ms、即触发后 620ms 进入 `corner`。盖纸先向右下移出并轻转，再盖回并露角；膝板上的作品同步状态。安静或减少动态时直接落在露角结果，不运行这段时序。成稿的 `hand-over-paper` 使用 0.65s，从纸面右下偏移 20px / 8px、旋转 −2deg 与局部裁切回到原位；只移动纸，不移动或新造人物姿态。

安静偏好停止镜头过渡与窗雨等自主动作；暂停、空闲休息和系统减少动态各有对应停止路径。`prefers-reduced-motion` 优先于保存的活泼偏好，停用动画和过渡后仍保留内容、字幕、主动操作与声音选择。观察器平移缩放不增加补间动画。

## Do's and Don'ts

### Do:

- **Do** 让角色、房间和真实物件承担视觉焦点，控件靠近它所操作的内容。
- **Do** 用清爽赛璐璐、冷白银发、清透肤色与浅木家具保持人物和环境连续。
- **Do** 保留五套服装在实时人物姿态间的连续性，同时明确区分收藏画作与当前人物。
- **Do** 保持 RoomSign、RoomTitle、RoomBody 与 RoomJapanese 的字体职责和本地资源来源。
- **Do** 用稳定浅底、中文标签、可见焦点和至少 44×44px 命中区实现可读可操作的轻量界面。
- **Do** 让手机阅读回到文档流，并保留可见地点栏与物件入口。
- **Do** 保持单一字幕节点，让音频失败、准备状态和重试留在当前上下文。
- **Do** 让九张新作品以真实配色素材呈现，并让手、笔、画板与作品共用正确的坐标关系。
- **Do** 用实际保存的画作和纸条表达回访，把未完成稿与共同成稿区分清楚。
- **Do** 尊重原生滚动、原生输入和减少动态偏好，保持图像比例与退出路径。

### Don't:

- **Don't** 用深棕粗框、大片重复稿纸、油画脏纹理、颗粒、灰棕罩层或通用爱心替代角色气质。
- **Don't** 把房间重新拆成七幕长页面、功能卡目录或强制按顺序解锁的地点。
- **Don't** 让面板和装饰遮住脸、手、笔尖，或用拉伸图像修补构图问题。
- **Don't** 把旧作品的滤镜兼容表现推广为新作品的配色机制。
- **Don't** 为贴近参考图牺牲文字对比度、中文语义或触控命中区。
- **Don't** 叠加多套 toast、表情角标和字幕条，或让自动动作伪造一段共同经历。
- **Don't** 把长段正文改成手写字，也不要让五字门签字体承担未包含的字符。
- **Don't** 把观察器资源的等比导出标成原生分辨率。
- **Don't** 添加官方截图、动画音轨、声优声纹克隆、运行时外链字体或未记录来源的素材。
