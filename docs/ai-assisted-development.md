# AI 协作开发与维护手册

- 更新日期：2026-08-10
- 项目仓库：<https://github.com/xinchenok/izumi-sagiri-room>
- 在线页面：<https://xinchenok.github.io/izumi-sagiri-room/>

本文记录“和泉纱雾的房门里”互动页如何在 AI 协助下完成、语音资源从哪里取得、怎样在本地重新合成，以及后续维护计划。它既是开发说明，也是后续接手者的复现入口。

## 先说明：本项目没有训练语音模型

本项目没有收集训练数据，没有训练、微调或克隆任何声优声纹，也没有截取动画音轨。语音部分采用现成且许可范围明确的 AivisSpeech 预训练模型“天深シノ”，在本地通过 AivisSpeech Engine 将四句日语文本合成为 WAV 文件。

因此，准确说法是“使用预训练模型进行本地语音合成”，不是“训练了一个和原作声音相同的模型”。页面只追求害羞、轻声、开心和稍微不高兴等情绪方向，不冒充原作声优，也不宣称与官方声音相同。

## AI 协助完成了什么

AI 在人工给定角色方向、功能目标和版权边界后，协助完成了以下工作：

1. 把页面整理为“门口初见 → 房间探索 → 日常换装 → 秘密画稿 → 晚安告别”的房门偷看叙事。
2. 建立草莓粉、银蓝、薄荷青、可可棕和奶油纸色组成的视觉系统，并记录在 `DESIGN.md`。
3. 生成一张角色身份锚点，再基于同一身份制作四张首屏表情、三张换装图和三张画廊情景图。
4. 使用原生 HTML、CSS 和 JavaScript 实现敲门、表情切换、桌面彩蛋、换装相册、画廊、语音字幕、晚安纸条和统一反应角。
5. 将人物表情、服装、台词、反应、画廊和彩蛋集中在 `script.js` 的 `CONTENT` 对象中，避免内容散落在事件处理代码里。
6. 将浏览器状态升级为 `sagiri-room-state-v2`，并保留从 `sagiri-room-state-v1` 迁移服装和彩蛋记录的逻辑。
7. 使用 AivisSpeech 在本地生成四段日语 WAV，网页通过 `Audio` 播放，同时始终展示日文台词和简体中文字幕。
8. 完成桌面、平板和手机尺寸的浏览器检查，以及键盘操作、减少动态效果、音频失败降级、资源 404、控制台错误和 UTF-8 编码检查。
9. 将静态站点提交到 GitHub，并使用 GitHub Pages 从 `main` 分支根目录发布。

AI 生成的内容经过人工目标约束与浏览器验收；AI 不是素材版权、许可兼容性或上线质量的最终责任主体。

## 当前项目结构

| 路径 | 用途 |
| --- | --- |
| `index.html` | 页面语义结构、无脚本降级内容和素材署名 |
| `styles.css` | 房间视觉、响应式布局、动效与减少动态效果适配 |
| `script.js` | 集中内容数据、交互、音频、状态保存与 v1 → v2 迁移 |
| `assets/v3/` | 当前页面使用的十张 PNG 角色插画 |
| `assets/audio/v3/` | 当前页面使用的四段 WAV 日语语音 |
| `PRODUCT.md` | 产品定位、设计原则与无障碍目标 |
| `DESIGN.md` | 视觉规范、组件状态、响应式和动效规则 |
| `docs/ai-assisted-development.md` | 本文：AI 协作过程、语音复现和路线图 |

网站是零框架、无后端的静态页面。浏览网站时不需要 AivisSpeech、语音模型或任何外部运行时服务；它们只在重新生成音频时需要。

## 角色插画的制作方式

本项目没有使用官方截图。插画工作流如下：

1. 先生成身份锚点，确定银白长发、蓝眼睛、粉色发饰、圆润脸型和约 5.5 头身的轻 Q 比例。
2. 以身份锚点为编辑参考，锁定脸部、发型、比例和房间光线，再只改变表情、服装或场景。
3. 首屏生成安静偷看、突然受惊、害羞微笑和认真得意四种表情。
4. 换装生成宽松粉色运动家居服、蓝白格深夜画稿睡衣、水手领裙装与薄荷针织外套三种明显不同的轮廓。
5. 画廊生成数位板前专注画画、躲在画册后偷看、夜晚抱猫咪玩偶三种独立情景。
6. 生成时明确要求全年龄、非性感化、无图片内文字、无水印、不复刻官方截图。

旧版素材保留在仓库中作为回退；当前运行时资源以 `assets/v3/` 为准。

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

## 四段语音如何生成

### 台词、风格与输出文件

| 场景 | 日语台词 | 模型风格 | 本次本地引擎 ID | 输出文件 |
| --- | --- | --- | --- | --- |
| 房门口 | お、おかえり……今日も、静かにしてね。 | ささやき／耳语 | `1063997411` | `assets/audio/v3/welcome.wav` |
| 画桌旁 | まだ描き終わってないから……勝手に見ちゃだめ。 | ふきげん／不高兴 | `1063997410` | `assets/audio/v3/drawing.wav` |
| 衣橱相册 | 気に入ったなら……もう一枚、描いてあげてもいいよ。 | じょうきげん／开心 | `1063997409` | `assets/audio/v3/like.wav` |
| 晚安以前 | おやすみ。明日も……一緒に頑張ろうね。 | ノーマル／普通 | `1063997408` | `assets/audio/v3/goodnight.wav` |

模型页中四个风格的模型内 ID 分别为 `3`、`2`、`1`、`0`；表格里的十位数 ID 是本次 AivisSpeech Engine 返回的本地复合风格 ID。重新安装模型后，本地 ID 可能变化，因此不要把这些数字当成永久接口。

当前 WAV 可用下面的 SHA-256 校验：

| 文件 | SHA-256 |
| --- | --- |
| `welcome.wav` | `0cf48ccbd6240956086a13b4f81354006a6ba392f3aae13c76aa88aca0ae9fad` |
| `drawing.wav` | `8b503fdb5249f85233a998d392b95f7179559b134214a35e0f5041261cd1e7f0` |
| `like.wav` | `dd8562efea4cf32b8fb6bec059b91c781499fc94d8306d17f3dfdd558d196b6a` |
| `goodnight.wav` | `d1280b58d1f57d2e4f8b32777cb4650f0788c591ce046416239e7842b8c38859` |

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

当前四个文件为 44.1 kHz、单声道 WAV。网页通过用户点击后创建 `Audio` 实例播放；开始新台词前会停止上一段。播放失败时仍保留日文台词、简体中文字幕和视觉反馈，且不会回退到系统 TTS。

本文记录了现有 WAV 校验值，但当前仓库没有保存四句语音各自完整的 `audio_query` JSON 和当时的引擎版本。因此可以按同一模型与风格重新合成，但暂时不能保证逐字节得到完全相同的文件。补齐机器可读的合成清单已列入后续规划。

## 许可与伦理边界

- 不使用动画原声、官方截图或未经授权的角色声纹数据。
- 不训练、微调或分发藤田茜或其他真实声优的声纹克隆模型。
- 不把“风格相近”描述为“原作声音”或“官方配音”。
- 不在仓库中重新分发“天深シノ”模型包；仓库只保存页面需要的最终 WAV。
- 当前语音模型采用 ACML-NC 1.0，网站必须维持许可允许的非商业使用范围并保留来源说明。
- 若未来出现商业化、广告、付费下载或品牌合作，必须先停用现有语音并重新完成角色版权、模型许可和字体许可审查。

## 验证与上线方式

本次上线前完成了以下检查：

- 1440×900、1024×768 和 390×844 三种视口的布局与横向溢出检查。
- 门板键盘操作、三套换装、六张画廊内容、五个彩蛋、隐藏留言和 v1 状态迁移。
- 四段语音的连续播放、跨场景打断和缺失文件降级。
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

## 已知问题与后续规划

### P0：上线性能与自动检查

- 当前 `assets/v3/` 十张 PNG 合计约 18 MB。为线上访问生成 WebP 或 AVIF，并保留 PNG 回退；为缩略图和移动端提供更小尺寸。
- 使用 `<picture>` 或响应式图片选择，实测首屏传输量、LCP 和移动网络体验。
- 增加 GitHub Actions：检查 `script.js` 语法、静态资源引用、UTF-8 无 BOM、乱码特征和 GitHub Pages 冒烟访问。

### P1：语音可复现性与无障碍

- 为每句语音保存模型 UUID、AivisSpeech Engine 版本、风格名称与实际 ID、完整 `audio_query` JSON、输出 WAV SHA-256 和生成日期。
- 增加一条受控的本地生成脚本，但仍要求操作者自行从官方来源安装模型，不在仓库中分发模型。
- 完成屏幕阅读器复测，并评估加入播放／暂停、当前播放状态和音量控制是否能改善体验。

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
