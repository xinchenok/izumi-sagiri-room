# V20「走进纱雾的日常」实现与复现

- 文档基准日期：2026-09-09。
- 实现分支：`codex/v20-room-redesign`。
- 目标发布版本／缓存标识：`20.0.0`／`20260909-v20-1`。
- 发布状态：live verified。PR #24 合并为 `daaa534b2868a402b06999539acf921aa8abeb3f`，CI 与 Pages 成功，正式站 221 个文件指纹和核心互动／刷新恢复通过。本地 57 项测试通过；独立审查 F2–F5 已解决，F1 工具逐像素流程仍未闭环，detector 有 warnings 且捕获截断，未宣称全绿。
- 发布凭证：[v20-release-receipt.json](v20-release-receipt.json)，含运行提交、CI、Pages、正式交互路径与全部已核对指纹。

以上版本／发布条目记录首次 V20.0.0。当前代码的 V20.0.1 陪画补全以[独立修复说明](v20-drawing-restoration.md)为准，新增 8 项对照测试；不将首次发布的验证范围扩大解释为所有旧互动均已完整迁移。

## 1. 已确认方向与体验结构

用户最终锁定三种构图中的**原始方案 A、最初床位**。曾提出的另一床位调整没有被采用，对应样稿和原始参考仍保留。用户随后明确委托完成全计划，原先逐阶段选择声线／等待样段审批的安排已取消，不再等待额外选择。

V20 替换“旧首屏＋七幕展示＋旧功能区”的重复结构。现在只有一个角色房间世界，提供全景、画桌、衣橱、床边、窗边五个地点；导航和物件入口到达相同内容，不通过滚动自动换幕或劫持滚轮。短句、日文字幕和语音状态共用一处反馈，不叠加另一套头像弹层。

三段可选日常是共同画小猫、认真选一件衣服、说说画册中喜欢的细节。画稿主题、配色与评价延续原有内容；未完成稿、共同成稿、秘密、回访和晚安纸条仍能继续。五套服装影响实时人物的全部九种姿态；十一张旧画廊被明确保留为收藏作品，画中衣服不是实时人物的当前换装状态。

共同创作新增三个固定主题与三种配色的九张真实小猫插画：门缝看月亮、被窝里画星星、抱着大铅笔，分别提供草莓黄昏、薄荷雨夜、银蓝月光。选择配色切换实际图片，不再只给同一张纸加 CSS 色调。独立膝上画板把作品放到执笔位置，兼容五套人物服装，而不是把画板画进某一套人物图。

轻邀请只在入场一段时间且空闲时出现，不打断对话或观察；同次拜访关闭后不催促。安静陪伴可随时结束，不把停留节点当成完成条件或奖励。图片、语音失败都有可恢复入口，错误不会靠改用系统 TTS 或伪造已完成状态掩盖。

## 2. 运行结构与状态

页面保持原生 HTML／CSS／JavaScript，零框架、无后端、无运行时外部服务。图片、字体和音频全部来自仓库本地；外部链接只用于来源说明。

| 职责 | 入口 |
| --- | --- |
| 集中内容：地点、角色、服装、故事、画廊、台词 | `script.js` 的 `CONTENT`，V20 扩展为 `CONTENT.roomExperience` |
| v1／v2 状态迁移、图片缓存、三路声音 | `room-core.js` |
| 场景切换、人物回应、物件、日常、回访与晚安 | `room.js` |
| 房间／作品统一观察器 | `room-inspector.js`、`inspector.css` |
| 语义入口与视觉布局 | `index.html`、`styles.css` |

持久键继续使用 `sagiri-room-state-v2`。已有服装、秘密、画廊位置、声音偏好、共同作品、未完成稿、房间记忆、换装记忆和纸条字段不整体重置；v1 服装与秘密按已知值迁移，未知 v2 扩展字段仍保留。V20 增加地点、分支进度、作品历史、画廊喜好、环境音量、声音入场选择和日夜设置。存储读写不可用时退化为当前会话，而不是禁止继续操作。

作品另有 `artVersion`：读入的旧 `sharedDrawing`、`sharedDrawings` 与 `drawingDraft` 若没有 `v20` 标记，就补为 `v18` 并继续展示原三主题资源；新建稿纸设为 `v20`，成稿继承草稿标记。V20 图像通过 `CONTENT.roomExperience.artworks[subject][palette]` 查找，`v18` 仍走原 `CONTENT.drawingStory.subjects`。恢复旧稿不等于重绘旧稿，原有作品不会被新画风静默替换；版本化路径已纳入本地 57 项通过结果，但这不是整站最终审查通过的声明。

旧 `#living-room`、`#desk-secrets`、`#drawing-story`、`#gallery`、`#goodnight` 等入口映射到新地点或面板；不再清掉所有地址片段。浏览器前进、后退和刷新仍通过地址与真实状态恢复。

场景请求、角色回应与观察加载各自有时序控制，旧图片解码结果不能接管新选择。动态自主动作只在页面与地点可见、人物空闲时发生，安静模式和系统减少动态效果会取消待执行动作。手机普通浏览固定使用 720 档，不因高 DPR 请求 4K；观察器才按设备和操作升级。

无 JavaScript 时，主首屏人物、角色介绍、五套服装、十一页画廊、共同创作、秘密、晚安与页脚来源仍可读。静态阅读包含二十张 720 派生图并懒加载，不宣称发生了互动或保存了纸条。HTTP 与直接 `file://` 浏览均已进入本地验证，直接文件协议用例通过。

## 3. 插画、透明人物与字体

| 资产 | 发布数量与规格 | 权威记录 |
| --- | --- | --- |
| 实时人物 | 5 套 × 9 态＝45 张原生绿幕源图；每态 720／1440／4K 三档，共 135 透明 WebP | `assets/v20/character/<outfit>/<outfit>-manifest.json` |
| 房间背景 | 白天、夜间各 4 档，共 8 WebP；720／1440／2560／4K | `assets/v20/room/room-background-manifest.json`、`room-night-manifest.json` |
| 共同成稿 | 3 主题 × 3 配色＝9 母图；每张 480／720／1440／4K 四档，共 36 WebP | `assets/v20/drawings/drawings-manifest.json` |
| 膝上画板 | 1 个共享透明道具的 720／1440／4K 三档，共 3 WebP | `assets/v20/props/lap-drawing-board-manifest.json` |
| 制作 plate | 房间背景与基础人物 PNG，用于构图校验 | `assets/plates` |
| 字体 | RoomBody、RoomJapanese、RoomTitle、RoomSign 四个本地 WOFF2 子集 | `assets/fonts/v20/font-manifest.json` |
| 旧资源 | 基线 `e5062e942534647be8f555586f6e6d26e319a2d6` 的 809 份 assets 保留 | `assets/archive/pre-v20-assets.json` |

五套服装为 `home`、`artist`、`outing`、`bedtime`、`hooded`。九态固定为 `standing-neutral`、`standing-shy`、`standing-blink`、`desk-focus`、`desk-shy`、`desk-blink`、`reading-peek`、`bed-hug`、`bed-sleepy`。

人物以 HOME 同姿态为编辑靶图，只换衣服，不借用旧换装图的背景、成熟比例或厚涂纹理。绿幕由内置 ImageGen 生成；FFmpeg 的标准色键和边缘去绿负责透明封装，不使用程序重绘或 Python 抠人物。曾发现全局去绿让真正的薄荷衣服变灰，最终只处理需要去绿的边缘并保留不透明衣料原色；各导出记录保留实际 filter。

白天房间直接保留 A 的入口左床位、衣橱、书柜、画桌与窗框。夜间只编辑窗外银蓝夜色和室内灯光，不增加人物、月亮装饰或窗框。雨滴范围根据实际玻璃保守内缩，不能把窗框、窗帘、灯具与植物当成可下雨的区域。

**全部 V20 4K 都是等比放大导出，不是 ImageGen 原生 4K 输出。** 人物 4K 档的最长边为 3840；白天原生 1681×936，夜间原生 1680×936，背景 4K 档分别为 3840×2138 与 3840×2139。每个发布文件记录精确提示词、原生尺寸、参考图指纹、源图指纹、处理方式、导出尺寸和 SHA-256。原始与拒用 PNG 均保留在忽略目录；干净检出只依赖发布资源即可运行，不要求存在本机制作现场。

### 新作品与膝上画板

九张小猫作品原生均为 1448×1086，四档为 480×360、720×540、1440×1080、3840×2880。旧图只作主题构图参考，新图采用浅银灰萌猫、清爽细线和平涂，四边保留至少 10% 清白空间。同主题先做草莓母图，再编辑薄荷与银蓝配色；留白不足和毯面星形漂移的初版与修正版均保留。最终 36 个文件各有独立哈希，总计 3,395,890 字节，不依赖 CSS 染纸替代。

画板原生 1061×1482，三档为 720×1006、1440×2011、2749×3840；4K 同样只是等比放大。画板带真实 alpha，稿纸角点与人物配准说明由 manifest 和 `CONTENT.roomExperience.drawingBoard` 管理；不应拉伸人物来迁就画板，也不能将三档分辨率描述为三块不同画板。

### 字体来源与子集

正文使用 Noto Sans CJK SC，日文字幕使用 Noto Sans CJK JP；两者固定 [Noto CJK 提交](https://github.com/notofonts/noto-cjk/tree/f8d157532fbfaeda587e826d4cd5b21a49186f7c)。短标题使用 [霞鹜文楷 v1.522](https://github.com/lxgw/LxgwWenKai/releases/tag/v1.522)，房间名使用仅五个汉字的 [Long Cang 子集](../assets/fonts/v20/RoomSign-SOURCE.md)。四者按 SIL OFL 1.1 发布子集，完整许可和源文件哈希保存在字体目录。

修改中文或日文后，使用 `tools/build-v20-fonts.py --scan` 重新扫描所有含运行文案的文件。脚本检查源字体与导出 cmap，不允许悄悄遗漏中日文字。字体子集的大小、字符集和最终哈希以重建后的 manifest 为准，不把首次生成的哈希写成永久值。

### 复现入口

- `tools/build-v20-character-assets.py`：按 `--outfit`、`--id`、`--source`、`--prompt`、`--reference` 导出；需要本地 FFmpeg。它会重建对应 V20 派生图，应在受控工作副本中运行，不能把复现误当成替换已发布资源。
- `tools/build-v20-room-assets.py --period day|night`：仅作等比 Lanczos 导出与 provenance，拒绝覆盖已有目标；所有画面编辑由内置 ImageGen 完成。
- `tools/build-v20-drawings.py --batch`：从九张本地原生 PNG 导出 36 个 WebP 和 `mapping[subject][palette]`；`--verify` 核对 9／36 矩阵、尺寸、解码、哈希与精确提示词。源图同名但指纹改变时拒绝覆盖，应建立新素材版本。
- 膝上画板的生成提示词、参考、色键 filter、角点和三档指纹在 `assets/v20/props/lap-drawing-board-manifest.json`；浏览器只依赖发布后的透明 WebP。
- `tools/build-v20-fonts.py --source-dir .tmp/v20-fonts/source --scan index.html script.js room-core.js room.js room-inspector.js assets/audio/v20/voice-manifest.json`：重建字体子集；源字体仍只存本地，官方下载位置与固定版本在 manifest 内。
- 生成提示词用于说明真实输入与约束，不保证重新调用 ImageGen 得到逐像素相同结果。需要重做素材时保留旧图并产生新版本，不删除唯一来源。

## 4. 配音与三路声音

现役统一使用已有 Piper Plus「つくよみちゃん」声线。用户取消了 Aivis／Qwen／Piper 三组对照试听，不再需要选择新声线；V20 新增的 24 句继续使用此前同一预训练角色。旧 AivisSpeech 音频仅保留为历史资源，许可仍随文件保留，不混入当前播放目录。

- 模型：[ayousanz/piper-plus-tsukuyomi-chan](https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan)。
- 模型 revision：`36b59c825c36bd386b8960cf3f604382f52f2a87`。
- 模型 SHA-256：`5289e9b6eaf21080803b7fe1c4dc85b5491d4c216121207a41df18dd5f68e5d7`。
- Piper Plus 源码固定提交：`5fceade2c284a85c8da0523c48b830b434350309`，对应 `npm-v0.6.0`；该提交的 Python 版本标记为 `1.12.0`。
- 没有训练、微调、参考音频、动画音轨、真实声优克隆或后期移调；使用 256 维零向量和 mask 0。
- 新 24 句使用 `noise_scale 0.64 / length_scale 1.50 / noise_w 0.76`；输出 44.1kHz、单声道、160kbps MP3，目标约 −18 LUFS。
- 许可依据[つくよみちゃんコーパス条款](https://tyc.rei-yumesaki.net/material/corpus/)，署名为“つくよみちゃんコーパス（CV.夢前黎 / © Rei Yumesaki）”；不是 Aivis 的 ACML-NC。

完整逐句文本、参数、实测响度、文件哈希和再生成边界见 [V20 配音来源](../assets/audio/v20/VOICE-SOURCES.md)及[音频清单](../assets/audio/v20/voice-manifest.json)。复现使用 `tools/build-v20-voice.py` 与已有本地推理环境，默认写新的时间戳目录，不提交模型、环境或中间 WAV。

### 播放合同

角色语音、物件拟音、持续环境声是三条独立通道。首次明确选择有声进入后才允许播放，刷新不擅自延续声音；新角色回答取消上一句，文字选择也会停止不再匹配的旧语音。字幕立即更新，加载、播放、失败与停止有明确状态。

持续环境声只在雨天且已获声音入场选择时使用 [nicoproson 的真实雨窗录音](../assets/audio/v8/RAIN-SOURCE.md)。晴天没有循环底声，不把关窗等短拟音循环充当环境声。物件声不切断雨声；说话时雨声降低约 8dB，结束恢复。页面隐藏暂停声音，返回后提供恢复入口。

动态图案的“安静”偏好不等于静音；三路音频各有开关。音频失败时保留准确日文、中文字幕和可重试入口，绝不调用系统 `speechSynthesis`。历史 [V14 物件声](../assets/audio/v14/ROOM-FOLEY-SOURCES.md)、[V16 关门声](../assets/audio/v16/GOODNIGHT-DOOR-SOURCE.md)和[V19 拟音来源](../assets/audio/v19/CINEMATIC-FOLEY-SOURCES.md)继续保留。

## 5. 验证证据、工具限制与发布

2026-09-09 最新本地结果为 **57 项测试全部通过**，包含新增作品／版本化回归、真实本地音频播放和 `file://` 路径，以及导航、旧入口、换装、草稿／成稿／秘密／纸条、存储失败、分支日常、观察器、动态优先级、图片档位和声音通道。受控 Audio 探针负责调度与故障路径，真实媒体用例补充实际加载与播放；两者都不能把缓存后 200ms 指标解释为真实声卡端到端延迟，或代替所有设备的主观听感验收。

`node tools/verify-v20-assets.mjs` 离线核对 45／135 人物矩阵、8 张背景、9／36 成稿矩阵、3 张画板、24 句声音、4 份字体及旧资源保留。它读取发布文件头、尺寸、alpha 标志、哈希、来源指纹和提示词；CI 不依赖忽略目录中的 PNG、模型或原字体。809 份旧资产的凭证同时区分 Git 规范化内容与工作树字节，避免把合法换行差异误记为原素材修改。Impeccable provenance 扫描 184 张栅格，缺失记录为 0。

五套衣服 × 九态的 HTML 明暗背景矩阵已检查，45 张均能真实加载，未见串衣服、错身份、道具缺失或闭眼态错误；这不是整站响应式视觉验收的替代。当前验证状态如下：

| 事实面 | 状态 |
| --- | --- |
| 57 项本地测试，含真实音频、`file://` 与新旧作品版本路径 | locally verified，不代表生产已上线 |
| 小猫作品的独立 9／36 解码、哈希、provenance 与 HTML 矩阵 | locally verified，9／9 浏览器加载 |
| 独立完成审查列出的四项视觉修复 | F2–F5 resolved；23 张同路径复拍有效 |
| DESIGN 与标题对比度 | 已按 V20 同步；标题实值约 8.40:1 |
| Impeccable detector | 仅运行 1 次，exit 0；有 warnings、捕获截断，不是全绿 |
| 远端 CI、合并、GitHub Pages、正式网址及资源指纹 | live verified；PR #24、221 文件无指纹差异 |
| 文档收尾 | 产品、设计、复现、协作与真实发布凭证已同步 |
| 原图、分支、缓存和临时复核现场清理 | 未执行；保留现场 |

### Impeccable 的实际限制

V20 按 Experience 模式使用已批准 A 构图。初始整帧相似度达到 0.88 以上，但逐控件像素 gate 没有接受中文字体与对比度调整，强制跳过请求也被拒绝。**该像素门槛没有通过，不能写成所有工具全绿。** 差异报告保留在本地 `.impeccable/review/diff/hero`。

独立完成审查确认原始 A 的空间、人物焦点与清爽画风保留；热点命中区、深玫红按钮和可读字幕属于有依据的无障碍适配。按审查意见完成自然手写标题及 8.40:1 对比、主行动箭头、手机手笔板坐标和 200% 观察清晰度修复，23 张同路径复拍后四项均为 resolved。F1 工具阶段仍为 unresolved，formal disposition 保留 `fix`，不冒充整站 `ship`。官方 `record hero`、`advance` 与 `finish --disposition fix` 已执行，失败证据保留，未手改状态。

唯一一次 detector 退出码为 0，但有 warnings 且捕获截断，不等于全绿。回执保留在 `.impeccable/review/v20-detector.json`，不重跑覆盖。旧 DESIGN 字体／颜色提示已由独立文档代理按实际 V20 系统同步。以上是工具流程降级披露，不是让用户继续做选择，也不把未通过记录藏起来。

### 发布与回退

发布负责人在最低验证和 CI 通过后，从功能分支合并到 `main`，等待 GitHub Pages 从根目录部署，再检查正式网址、关键运行文件及真实交互路径。提交已合并、Pages 成功、用户可见 V20 和知识收尾完成是不同状态。不得仅看到 HTTP 200 或缓存标识就宣称全部上线验证完成。

完成这些步骤后才写入 `docs/v20-release-receipt.json`，包括目标提交、版本／标识、CI／Pages 结果、正式路径与资源核对、检测器限制和剩余待办。不要预填虚构提交号或运行时间。旧版本资源仍原位保留，回退不以删除新旧素材为步骤。

### 保留的复核现场

原始、拒用和试验素材继续保留在 `.tmp/v20-room`、`.tmp/v20-character`、`.tmp/v20-voice`、`.tmp/v20-fonts` 与本地样稿目录。取消候选声线流程还留下约 4.08GiB 未完成的 PyTorch 下载缓存（全局 uv 缓存）与约 206MiB 的 Aivis 压缩包；它们不是网站运行依赖，未继续下载，也未删除。公开文档只记录用途和逻辑位置，不抄个人系统完整路径。

新增作品与画板的原始、初版和修正现场另外保留在 `.tmp/v20-drawings`、`.tmp/v20-desk-prop`，没有覆盖或删除旧三张小猫图与十一张画廊。

本次没有清理旧图、旧语音、分支、模型、临时目录或缓存。只有最终汇报已交付、用户明确确认可以清场之后，才单独执行获准的清理，并保留实际删除清单。
