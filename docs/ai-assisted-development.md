# AI 协作开发与维护手册

- 更新日期：2026-08-11
- 项目仓库：<https://github.com/xinchenok/izumi-sagiri-room>
- 在线页面：<https://xinchenok.github.io/izumi-sagiri-room/>

本文记录“和泉纱雾的房门里”互动页如何在 AI 协助下完成、语音资源从哪里取得、怎样在本地重新合成，以及后续维护计划。它既是开发说明，也是后续接手者的复现入口。

## 先说明：本项目没有训练语音模型

本项目没有收集训练数据，没有训练、微调或克隆任何声优声纹，也没有截取动画音轨。当前语音采用许可范围明确的 AivisSpeech 预训练模型“天深シノ”，在本地通过 AivisSpeech Engine 独立合成二十二句日语回答；页面没有把同一句台词变速、变调后当成新回答。

因此，准确说法是“使用预训练模型进行本地语音合成”，不是“训练了一个和原作声音相同的模型”。页面只追求害羞、轻声、开心和稍微不高兴等情绪方向，不冒充原作声优，也不宣称与官方声音相同。

## AI 协助完成了什么

AI 在人工给定角色方向、功能目标和版权边界后，协助完成了以下工作：

1. 把页面整理为“门口初见 → 房间探索 → 日常换装 → 秘密画稿 → 晚安告别”的房门偷看叙事。
2. 建立草莓粉、银蓝、薄荷青、可可棕和奶油纸色组成的视觉系统，并记录在 `DESIGN.md`。
3. 生成一张角色身份锚点，再基于同一身份制作四张首屏表情、五张换装图、十一张运行时画册情景图和一张五秘密画桌场景图。
4. 使用原生 HTML、CSS 和 JavaScript 实现敲门、三阶段回访文案、表情切换、无常驻标记彩蛋、换装相册、章节画廊与暗房、语音字幕和控制、晚安纸条和统一反应角。
5. 将人物表情、服装、台词、反应、画廊和彩蛋集中在 `script.js` 的 `CONTENT` 对象中，避免内容散落在事件处理代码里。
6. 在 `sagiri-room-state-v2` 中扩展回访次数、上次有效拜访、画册位置、音量和只看字幕偏好，并保留从 `sagiri-room-state-v1` 迁移服装和彩蛋记录的逻辑。
7. 使用 AivisSpeech 在本地生成二十二句不同回答；十八句轻声、普通或开心回答按入口洗牌并保证一轮听完前不重复，四句 `ふきげん` 回答只在访客短时间连续催门或催稿时使用，同时展示当前回答的日文和简体中文字幕。
8. 将运行时人物与换装切换为完整尺寸 / 560px 两档高质量 WebP，将 1.5 MB 标题字体缩成当前页面字符子集 WOFF2，并取消画册与衣橱的一次性全量预取。
9. 建立 2048、1440、1024 和 390px 的发布前浏览器清单，并对键盘操作、暗房、回访状态、只看字幕、减少动态效果、音频失败降级、资源引用和 UTF-8 编码进行自动检查。
10. 将静态站点提交到 GitHub，并使用 GitHub Pages 从 `main` 分支根目录发布。

AI 生成的内容经过人工目标约束与浏览器验收；AI 不是素材版权、许可兼容性或上线质量的最终责任主体。

## 当前项目结构

| 路径 | 用途 |
| --- | --- |
| `index.html` | 页面语义结构、无脚本降级内容和素材署名 |
| `styles.css` | 房间视觉、响应式布局、动效与减少动态效果适配 |
| `script.js` | 集中内容数据、交互、音频、状态保存与 v1 → v2 迁移 |
| `assets/v3/` | 原始人物 / 换装 PNG 维护源与五秘密画桌资源 |
| `assets/v4/` | 十一张统一 4:3 的运行时画册 WebP 与十一张 480 × 360 缩略图 |
| `assets/v5/` | 四张人物表情与五套换装的完整尺寸 / 560px WebP，以及两套新增换装生成源 PNG |
| `assets/audio/v4/` | 二十二句不同回答的 MP3、完整 `audio_query` 与机器可读合成清单 |
| `PRODUCT.md` | 产品定位、设计原则与无障碍目标 |
| `DESIGN.md` | 视觉规范、组件状态、响应式和动效规则 |
| `docs/ai-assisted-development.md` | 本文：AI 协作过程、语音复现和路线图 |
| `docs/desk-secrets-image-prompt.md` | 五秘密画桌的完整生图提示词、参考图角色与素材校验值 |
| `docs/gallery-v4-image-prompts.md` | 八张新增害羞画册场景的完整提示词、参考图与导出规格 |
| `docs/outfit-v5-image-prompts.md` | 两套新增换装的完整提示词、参考图、校验值与高质量 WebP 导出规格 |

网站是零框架、无后端的静态页面。浏览网站时不需要 AivisSpeech、语音模型或任何外部运行时服务；它们只在重新生成音频时需要。

## 角色插画的制作方式

本项目没有使用官方截图。插画工作流如下：

1. 先生成身份锚点，确定银白长发、蓝眼睛、粉色发饰、圆润脸型和约 5.5 头身的轻 Q 比例。
2. 以身份锚点为编辑参考，锁定脸部、发型、比例和房间光线，再只改变表情、服装或场景。
3. 首屏生成安静偷看、突然受惊、害羞微笑和认真得意四种表情。
4. 换装先生成宽松粉色运动家居服、蓝白格深夜画稿睡衣、水手领裙装与薄荷针织外套三种明显不同的轮廓，再补充“侧躺床上仍在画画的草莓睡前服”和“雨夜裹住自己校稿的猫耳连帽毯”。
5. 画廊在原有“深夜专注、躲在画册后、抱玩偶晚安”之外，先补充“床上画画、举起画稿、躲在靠枕后递画、装作没等夸奖”，再补充“被窝画室、安静直播、门缝递卡片、整理草稿”四种情景；运行时按十一幕小故事排列，不再用换装图填充画廊。
6. 五秘密画桌以首屏身份图、深夜画稿图和家居服图作为参考，明确固定耳机、轻小说稿件、数位板、猫咪玩偶和带锁抽屉五个互不遮挡的点击区域。
7. 生成时明确要求全年龄、非性感化、无图片内文字、无水印、不复刻官方截图。

旧版 PNG 保留在仓库中作为维护源；首屏与换装运行时使用 `assets/v5/`，画册使用 `assets/v4/`，五秘密画桌继续优先使用 `assets/v3/desk-secrets.webp`。新增画册与换装的完整提示词、校验值与导出方法分别见 `docs/gallery-v4-image-prompts.md` 和 `docs/outfit-v5-image-prompts.md`。

## 语音模型的来源与下载位置

### 官方来源

- AivisSpeech 下载：<https://aivis-project.com/AivisSpeech>
- “天深シノ”模型页：<https://hub.aivis-project.com/aivm-models/0f6821f4-9f86-4da1-a41a-fbe6fff9ca88>
- AivisSpeech Engine 源码与版本：<https://github.com/Aivis-Project/AivisSpeech-Engine>

请从上述官方页面安装，不要从来历不明的网盘或二次打包站下载。

### 本项目使用的模型信息

| 项目 | 内容 |
| --- | --- |
| 模型名称 | 天深シノ |
| 模型 UUID | `0f6821f4-9f86-4da1-a41a-fbe6fff9ca88` |
| 许可 | ACML-NC 1.0，限许可允许的非商业用途 |
| 语言 | 日语 |
| 架构 | Style-Bert-VITS2（JP-Extra），ONNX |
| 模型包 | AIVMX，模型页标示约 258.28 MB |
| SHA-256 | `89bb3b704054ef0f08e91fe33ea30f866f14913921bcebfd11e2609bf2b721de` |

许可和模型版本可能更新；重新下载时应以模型页当时展示的信息为准，并再次确认使用场景是否仍符合许可。

### 安装位置

在 AivisSpeech 运行时打开模型页，可以使用页面提供的一键安装。Windows 手动放置模型时，AivisSpeech 官方说明的目录是：

```text
C:\Users\<用户名>\AppData\Roaming\AivisSpeech-Engine\Models
```

macOS 对应目录是：

```text
/Users/<用户名>/Library/Application Support/AivisSpeech-Engine/Models
```

本项目曾使用的临时下载目录和引擎缓存已在音频生成后清理，因此仓库中不包含约数百 MB 的模型包，也不包含 AivisSpeech Engine。需要重新生成时，请从官方来源重新安装。

## 当前二十二句不同回答如何生成

### 角色化写法

四类互动分别是房门口、画桌旁、被夸以后与晚安以前。普通池共有十八句独立日文文本，以“轻声、短句、害羞但会一点点放松”为主；涉及画稿时更认真，被夸时会先确认是不是客套。另外四句 `ふきげん` 回答属于连续催门或催稿的情境反馈，不进入普通随机。它表达的是本页角色设定与情境，不照录动画台词，也不冒充真实声优。

运行时数据保存在 `script.js` 的 `CONTENT.voiceLines`。`chooseVoiceReply()` 为每个普通入口维护一份洗牌队列：当前入口的普通回答全部弹出前不会重复；重新洗牌时若队首会与上一轮末句相同，会先交换位置。`shouldUseGuardedReply()` 只在同一入口 5 秒内触发 4 次时放行情境池，并设置 25 秒冷却；这四句不会被 `chooseVoiceReply()` 选中。字幕、表情、反应文字和音频路径都来自同一个回答对象，因此不会出现“声音换了但字幕没换”的错配。

### 合成与可复现文件

- AivisSpeech Engine：1.2.0。
- 同一模型：天深シノ；模型 UUID、说话人 UUID、模型包 SHA-256、风格 ID、每句文本、参数、时长与输出 SHA-256 全部保存在 `assets/audio/v4/voice-manifest.json`。
- 根据句意使用同一模型提供的 `ささやき`、`ノーマル`、`じょうきげん` 或 `ふきげん` 表达；普通随机池不含 `ふきげん`，`pitchScale` 始终为 0，没有用后期移调制造不同音色。
- 每句由 `POST /audio_query` 和 `POST /synthesis` 独立生成；完整查询响应保存在 `assets/audio/v4/queries/<line-id>.json`。
- 最终网页资源统一为 44.1 kHz、单声道、112 kbps MP3。中间 WAV 只用于编码，不提交模型包、引擎或临时缓存。

重新合成时，先按下方官方来源安装引擎与模型，再用 `GET /speakers` 核对当前风格 ID；复用对应查询 JSON 调用 `/synthesis`，并用清单里的 SHA-256、时长、采样率和声道数验收。复合风格 ID 可能随安装变化，必须按模型名称、模型 UUID 与风格名称重新解析，不能盲信旧数字。

## 旧版 v3：四段台词与十二种语气

以下内容仅保留为旧版资源的历史复现记录；当前页面不再读取 `assets/audio/v3`，也不再用同一句的轻度后期版本轮换。

### 台词、风格与输出文件

| 场景 | 日语台词 | 模型风格 | 本次本地引擎 ID | 输出文件 |
| --- | --- | --- | --- | --- |
| 房门口 | お、おかえり……今日も、静かにしてね。 | ささやき／耳语 | `1063997411` | `assets/audio/v3/welcome.wav` |
| 画桌旁 | まだ描き終わってないから……勝手に見ちゃだめ。 | ふきげん／不高兴 | `1063997410` | `assets/audio/v3/drawing.wav` |
| 衣橱相册 | 気に入ったなら……もう一枚、描いてあげてもいいよ。 | じょうきげん／开心 | `1063997409` | `assets/audio/v3/like.wav` |
| 晚安以前 | おやすみ。明日も……一緒に頑張ろうね。 | ノーマル／普通 | `1063997408` | `assets/audio/v3/goodnight.wav` |

模型页中四个风格的模型内 ID 分别为 `3`、`2`、`1`、`0`；表格里的十位数 ID 是本次 AivisSpeech Engine 返回的本地复合风格 ID。重新安装模型后，本地 ID 可能变化，因此不要把这些数字当成永久接口。

旧版 v3 WAV 可用下面的 SHA-256 校验：

| 文件 | SHA-256 |
| --- | --- |
| `welcome.wav` | `0cf48ccbd6240956086a13b4f81354006a6ba392f3aae13c76aa88aca0ae9fad` |
| `drawing.wav` | `8b503fdb5249f85233a998d392b95f7179559b134214a35e0f5041261cd1e7f0` |
| `like.wav` | `dd8562efea4cf32b8fb6bec059b91c781499fc94d8306d17f3dfdd558d196b6a` |
| `goodnight.wav` | `d1280b58d1f57d2e4f8b32777cb4650f0788c591ce046416239e7842b8c38859` |

### 轻度后期语气版本

八段 MP3 都直接来自对应原始 WAV，只调整少量音高、速度、音量和高低通，不新增或替换任何字词。页面仍展示与原始台词逐字一致的日文和中文字幕。编码统一为 44.1 kHz、单声道、112 kbps MP3；制作时使用 FFmpeg 6.1.1。

| 场景 | 页面语气 | 输出文件 | 处理参数摘要 |
| --- | --- | --- | --- |
| 房门口 | 更小声 | `welcome-soft.mp3` | 音高 +1.5%、速度放慢约 3%、音量 86%、70 Hz–11.5 kHz |
| 房门口 | 慌张一点 | `welcome-flustered.mp3` | 音高 +4.5%、整体稍快、音量 92%、70 Hz 高通 |
| 画桌旁 | 小声嘟囔 | `drawing-mutter.mp3` | 音高 -0.5%、速度放慢约 2.5%、音量 82%、70 Hz–10.5 kHz |
| 画桌旁 | 被抓到啦 | `drawing-flustered.mp3` | 音高 +3.5%、整体稍快、音量 90%、70 Hz 高通 |
| 衣橱相册 | 偷偷开心 | `like-soft.mp3` | 音高 +1.5%、速度放慢约 3%、音量 86%、70 Hz–11.5 kHz |
| 衣橱相册 | 藏不住开心 | `like-happy.mp3` | 音高 +4.2%、整体稍快、音量 94%、70 Hz 高通 |
| 晚安以前 | 更轻一点 | `goodnight-soft.mp3` | 音高 +0.8%、速度放慢约 4%、音量 80%、65 Hz–9.8 kHz |
| 晚安以前 | 困困的 | `goodnight-sleepy.mp3` | 音高 -1.2%、速度放慢约 6%、音量 78%、65 Hz–9 kHz |

旧版 v3 MP3 可用下面的 SHA-256 校验：

| 文件 | SHA-256 |
| --- | --- |
| `welcome-soft.mp3` | `522c4f2ac1c39888ae9a1b7ab58839eab095c6c4959672d249ea5ffb5fbea70a` |
| `welcome-flustered.mp3` | `8001d09de71ba0c20ccb51eeca3578c38daef23344f22c3627471359dba7ccad` |
| `drawing-mutter.mp3` | `48b92d99667bcfa6c7567ad8cee9f2274068f323316db4e21a846eb0761511e4` |
| `drawing-flustered.mp3` | `03a72c874df16fd32a24118b5ee7c00f3eaea6990a17d0672a2fe3009e498190` |
| `like-soft.mp3` | `f3ab735e3b68f9d38e857f89e15e99c29b5dbcec98a1b06a4ef228a89468b908` |
| `like-happy.mp3` | `cfa54abd771f02e5bb15c6c93099df1b91c3856b72e96d1f41d9367e94e6759e` |
| `goodnight-soft.mp3` | `1c428767b4d0066b6116ea8fcbb313dd381ec4a3288d01e0423c557b395b4a62` |
| `goodnight-sleepy.mp3` | `6b8263d7ea2c701346fa459f74a7991cae4b9ed8be0b55095d6cb7a93259041d` |

### 本地合成流程

1. 安装并启动 AivisSpeech，让本地 Engine 正常运行。
2. 安装“天深シノ”模型。
3. 请求 `GET /speakers`，根据模型 UUID、说话人名称和风格名称读取当前安装实际返回的 `styles[].id`。
4. 对每句文本调用 `POST /audio_query` 生成查询参数。
5. 将查询 JSON 传给 `POST /synthesis`，保存返回的 WAV。
6. 把 WAV 放入 `assets/audio/v3/`，并核对 `script.js` 中的文件路径、日文台词、中文字幕和表情映射。

AivisSpeech Engine 默认提供与 VOICEVOX 兼容的本地 HTTP API。下面是 PowerShell 示例；执行前必须先从 `/speakers` 核对当前风格 ID：

```powershell
$engineBase = "http://127.0.0.1:10101"

# 先查看当前安装实际提供的说话人与风格 ID。
$speakers = Invoke-RestMethod -Method Get -Uri "$engineBase/speakers"
$speakers | ForEach-Object {
  $speaker = $_
  $speaker.styles | ForEach-Object {
    [PSCustomObject]@{
      Speaker = $speaker.name
      Style = $_.name
      Id = $_.id
    }
  }
} | Format-Table

# 用刚刚核对出的 ID 生成一条语音。
$lineText = "お、おかえり……今日も、静かにしてね。"
$styleId = 1063997411
$escapedText = [Uri]::EscapeDataString($lineText)
$queryUri = "$engineBase/audio_query?text=$escapedText&speaker=$styleId"
$query = Invoke-RestMethod -Method Post -Uri $queryUri
$queryJson = $query | ConvertTo-Json -Depth 100 -Compress
$queryBytes = [Text.Encoding]::UTF8.GetBytes($queryJson)

Invoke-WebRequest `
  -Method Post `
  -Uri "$engineBase/synthesis?speaker=$styleId" `
  -ContentType "application/json" `
  -Body $queryBytes `
  -OutFile "assets\audio\v3\welcome.wav"
```

旧版的四个原始文件为 44.1 kHz、单声道 WAV。v3 页面曾从该场景的原始 WAV 和两段后期 MP3 中随机选择；当前 v4 页面已经改为二十二句独立回答。开始新回答前仍会停止上一段；播放失败时保留日文、简体中文字幕和视觉反馈，且不会回退到系统 TTS。

以上记录了旧版 WAV 校验值；v4 已为全部二十二句保存完整 `audio_query`、引擎版本和机器可读清单。

## 许可与伦理边界

- 不使用动画原声、官方截图或未经授权的角色声纹数据。
- 不训练、微调或分发藤田茜或其他真实声优的声纹克隆模型。
- 不把“风格相近”描述为“原作声音”或“官方配音”。
- 不在仓库中重新分发“天深シノ”模型包；仓库只保存页面需要的最终 MP3、查询 JSON 与合成清单。
- 当前语音模型采用 ACML-NC 1.0，网站必须维持许可允许的非商业使用范围并保留来源说明。
- 若未来出现商业化、广告、付费下载或品牌合作，必须先停用现有语音并重新完成角色版权、模型许可和字体许可审查。

## 验证与上线方式

2026-08-11 当前版本在受控 Chromium 中完成 2048 × 1138、1440 × 900、1024 × 768 与 390 × 844 四档回归。五个热点均保持至少 44px，默认透明且没有常驻按钮；五套换装全部解码；三个章节、暗房方向键 / 放大、只看字幕保存、隔五小时模拟回访、桌面开门全宽铺图和横向溢出均通过，本站控制台没有错误。

同一 390px 冷缓存测量中，页面请求量由约 10.79 MB 降至约 1.04 MB，减少约 90.4%。原始像素尺寸没有下降：桌面主图仍为 1122 × 1402，采用 FFmpeg `libwebp`、`q=95`、`compression_level=6`；主图与 PNG 维护源的 PSNR 为 43.8–44.8 dB。窄屏按实际显示尺寸选择 560 × 700、`q=93` 版本。标题字体从约 1.5 MB 原始 TTF 改为约 80 KB 当前字符子集 WOFF2。

发布前仍应复核下列完整清单：

- 2048×1138、1440×900、1024×768 和 390×844 四种视口的布局与横向溢出检查。
- 门板键盘操作、五套换装、十一张画廊内容、三章与暗房、五个彩蛋、渐进线索、隐藏留言和 v1 状态迁移。
- 四个入口、十八句普通回答的洗牌轮换、四句情境回答的连续点击阈值、跨场景打断和缺失文件降级。
- `prefers-reduced-motion` 下关闭持续动画、视差和纸屑。
- JavaScript 禁用时的基础内容可读性。
- 控制台错误、页面错误和资源 404 检查。
- Node.js 语法检查、UTF-8 无 BOM 检查和中文乱码特征扫描。

站点目前由 GitHub Pages 从 `main` 分支根目录发布。普通内容更新的维护流程是：

1. 在功能分支修改并本地验证。
2. 提交并推送到 GitHub。
3. 合并到 `main`。
4. 等待 GitHub Pages 构建完成。
5. 打开在线地址检查标题、主要交互、音频和静态资源是否正常。

修改 `styles.css` 或 `script.js` 时，必须同时递增 `index.html` 中对应 URL 的 `?v=` 发布标识。GitHub Pages 与移动浏览器可能分别缓存 HTML、CSS 和 JavaScript；版本标识可避免新 HTML 搭配旧样式或旧脚本，造成图片比例、热点位置和互动结构错乱。

## 已知问题与后续规划

### P0：自动检查

- 增加 GitHub Actions：检查 `script.js` 语法、静态资源引用、UTF-8 无 BOM、乱码特征和 GitHub Pages 冒烟访问。
- 在真实低端 Android 与慢速移动网络继续记录 LCP / INP；本地容器数字只用于同条件前后对比，不冒充真实用户监控。

### P1：语音无障碍与自动复现

- 完成屏幕阅读器对音量、停止、只看字幕和暗房焦点循环的复测；保持不加入暂停与机械式进度条。
- 可增加一条读取 `voice-manifest.json` 与查询 JSON 的受控本地生成脚本；仍要求操作者自行从官方来源安装模型，不在仓库中分发模型。

### P2：内容扩展

- 在不改变全年龄与非性感化边界的前提下增加季节换装和新画稿。
- 若要加入离线访问，可评估 PWA；若要使用自定义域名，再补充域名、缓存与回滚说明。
- 每次更换图像、字体或语音模型时重新审查来源、许可和页脚署名。

## 维护者检查清单

每次发布前至少确认：

- [ ] 新素材有明确来源、许可和用途边界。
- [ ] 没有提交模型缓存、临时下载、个人令牌或本机绝对路径。
- [ ] `script.js` 的集中数据与页面文案一致。
- [ ] 音频由用户操作触发，字幕始终可见，失败时不调用系统 TTS。
- [ ] 键盘焦点、颜色对比、减少动态效果和无脚本内容仍然有效。
- [ ] 桌面、平板、手机均无横向溢出，在线资源没有 404。
- [ ] 所有源码、Markdown 和配置均为 UTF-8 且无 BOM，中文无乱码。
- [ ] `README.md`、`PRODUCT.md`、`DESIGN.md` 与本文仍和实际代码一致。
