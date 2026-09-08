# V19 七幕语音与拟音复现

> 历史资源复现：本文保留 V19 的 28 句语音及 21 段拟音记录；V20 新增配音与当前三路调度见 [V20 房间重构](v20-room-redesign.md)。旧声音来源不删除。

- 更新日期：2026-09-09
- 范围：七幕连续镜头的 28 句角色语音与 21 段物件拟音
- 运行时：全部文件随静态站点本地提供；浏览页面不需要 Piper Plus、模型、Python 或 FFmpeg

## 先说明：没有训练、微调或克隆

V19 使用 Piper Plus 与“つくよみちゃん”公开预训练模型进行本地推理，没有收集训练数据，也没有训练、微调或克隆任何真实声优声纹。合成没有参考音频：`speaker_id` 为 0，`speaker_embedding` 是 256 维全零向量，`speaker_embedding_mask` 为 0。后期只做频段整理与响度归一化，`pitch_shift` 为 false，没有用移调制造角色音色。

准确说法是“使用公开预训练模型本地合成原创日语短句”，不能写成“官方配音”“复刻原作声优”或“训练了角色语音模型”。

## 固定版本

| 项目 | 固定值 |
| --- | --- |
| Piper Plus Git ref | `npm-v0.6.0` |
| Piper Plus commit | `5fceade2c284a85c8da0523c48b830b434350309` |
| 同提交 Python `VERSION` | `1.12.0` |
| 本地运行 Python | CPython `3.10.20`，由 uv 管理隔离环境 |
| ONNX Runtime | `1.23.2`，`CPUExecutionProvider` |
| 模型仓库 | `ayousanz/piper-plus-tsukuyomi-chan` |
| 模型 revision | `36b59c825c36bd386b8960cf3f604382f52f2a87` |
| 模型文件 | `tsukuyomi-chan-6lang-fp16.onnx` |
| 模型 SHA-256 | `5289e9b6eaf21080803b7fe1c4dc85b5491d4c216121207a41df18dd5f68e5d7` |
| 配置 SHA-256 | `516058f405ec914140f34832a9d8bb5d8272ba62af9bc7ffb29349715a539780` |

`npm-v0.6.0` 与 Python `VERSION=1.12.0` 来自同一个提交，并不矛盾：前者是 NPM 分发标签，后者是该提交内 Python 包自己的版本标记。复现时必须同时核对 ref、完整提交和两个模型文件哈希，不能只看“0.6.0”字符串。

## 二十八句内容与参数

七幕各有四句独立回答：三个物件热点各一句，角色热点一句。逐句日文、简体中文字幕、场景、最终 MP3、时长、响度、SHA-256 与查询 JSON 统一记录在 `assets/audio/v19/voice-manifest.json`。

| 幕 | 语音 ID |
| --- | --- |
| 房门 | `door-knock-wait`、`door-startled`、`door-handle`、`door-closer` |
| 房间 | `room-chair`、`room-pen-tip`、`room-curtain`、`room-stay` |
| 桌面秘密 | `secrets-draft`、`secrets-headphones`、`secrets-drawer`、`secrets-nothing-weird` |
| 衣橱 | `wardrobe-sleeves`、`wardrobe-ribbon`、`wardrobe-two-outfits`、`wardrobe-choice-wait` |
| 画册 | `gallery-first-page`、`gallery-close-look`、`gallery-turn-slow`、`gallery-praise` |
| 一起画 | `drawing-one-line`、`drawing-peek-again`、`drawing-you-are-there`、`drawing-first-view` |
| 晚安 | `goodnight-sleepy`、`goodnight-plush`、`goodnight-book`、`goodnight-knock-next` |

五种表达配置如下；每句 `assets/audio/v19/queries/<id>.json` 同时保存请求值、短句调整后的实际 scale、音素数、补齐信息、原始 WAV 哈希和两遍响度参数。

| profile | noise_scale | length_scale | noise_w |
| --- | ---: | ---: | ---: |
| soft | 0.64 | 1.50 | 0.76 |
| shy | 0.60 | 1.58 | 0.72 |
| flustered | 0.72 | 1.32 | 0.86 |
| proud | 0.66 | 1.40 | 0.78 |
| sleepy | 0.58 | 1.68 | 0.68 |

最终语音统一为 44.1 kHz、单声道、160 kbps MP3。处理链为 70 Hz 高通、10.5 kHz 低通和两遍 `loudnorm=I=-17:TP=-1.5:LRA=7`；28 个 MP3 全部可解码且 SHA-256 互不相同。`assets/audio/v19/voice-validation.json` 是发布验证摘要。

## 本地环境复现

仓库脚本 `tools/build-cinematic-voice-v19.py` 保存 V19 实际使用的推理流程，直接读取已发布的 `assets/audio/v19/voice-manifest.json` 中 28 句输入，不另存一份台词。模型、Piper Plus 源码副本、uv 环境与中间 WAV 仍不进入 Git。下面命令可在干净检出的仓库根目录重建相同源码和 Python 环境；工作文件均位于 `.tmp`。

```powershell
$voiceRoot = ".tmp\v19-voice"
uv python install 3.10.20
uv venv --python 3.10.20 "$voiceRoot\.venv"

git clone https://github.com/ayutaz/piper-plus.git "$voiceRoot\piper-plus-src"
git -C "$voiceRoot\piper-plus-src" checkout 5fceade2c284a85c8da0523c48b830b434350309
Get-Content -LiteralPath "$voiceRoot\piper-plus-src\VERSION" -Encoding UTF8

uv pip install --python "$voiceRoot\.venv\Scripts\python.exe" `
  numpy==2.2.6 onnxruntime==1.23.2 imageio-ffmpeg==0.6.0 mutagen==1.47.0 `
  soundfile==0.14.0 pyopenjtalk-plus==0.4.1.post9 sudachipy==0.6.11 `
  sudachidict-core==20260723 pydantic==2.13.5

New-Item -ItemType Directory -Path "$voiceRoot\model" -Force | Out-Null
Invoke-WebRequest -Uri "https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan/resolve/36b59c825c36bd386b8960cf3f604382f52f2a87/tsukuyomi-chan-6lang-fp16.onnx?download=true" -OutFile "$voiceRoot\model\tsukuyomi-chan-6lang-fp16.onnx"
Invoke-WebRequest -Uri "https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan/resolve/36b59c825c36bd386b8960cf3f604382f52f2a87/config.json?download=true" -OutFile "$voiceRoot\model\config.json"

Get-FileHash -Algorithm SHA256 "$voiceRoot\model\tsukuyomi-chan-6lang-fp16.onnx"
Get-FileHash -Algorithm SHA256 "$voiceRoot\model\config.json"
```

环境准备完成后，直接运行仓库脚本。它会核对实际源码提交、模型与配置 SHA-256、28 句清单和五组参数，然后从该提交的 `src/python` 加载音素、韵律、短句补齐、ONNX 推理和音频裁切流程，向会话传入零说话人向量与关闭的参考音频掩码。后处理与发布版一致，并逐句重新解码、记录响度和哈希。

```powershell
& "$voiceRoot\.venv\Scripts\python.exe" tools\build-cinematic-voice-v19.py --help
& "$voiceRoot\.venv\Scripts\python.exe" tools\build-cinematic-voice-v19.py --work-dir $voiceRoot
```

默认每次写入一个新的 `.tmp/v19-voice/reproduction-<UTC时间戳>` 目录，里面包含 `raw/*.wav`、`voice/*.mp3`、`queries/*.json`、`requests.json`、`generation-log.json` 和 `draft-manifest.json`。脚本不下载模型，不自动替换 `assets/audio/v19` 中的发布文件。查看 `--help` 只需 Python 标准库，不需要生成环境或模型。

需要复用其他本地缓存或指定独立结果目录时，可显式传入路径：

```powershell
& "$voiceRoot\.venv\Scripts\python.exe" tools\build-cinematic-voice-v19.py `
  --source-dir "$voiceRoot\piper-plus-src" `
  --model-dir "$voiceRoot\model" `
  --output-dir "$voiceRoot\reproduction-review"
```

`--source-dir` 指向完整 Piper Plus Git 检出，`--model-dir` 包含固定 ONNX 与 `config.json`；`--output-dir` 是本地结果根目录，指定同一结果目录重复执行会覆盖其中的生成结果，请使用新的 `.tmp` 子目录保留前次试听。可用 `--ffmpeg "C:\path\to\ffmpeg.exe"` 指定 FFmpeg，否则使用 `imageio-ffmpeg` 自带版本。

推理包含模型随机采样；固定版本、台词与五组参数复现的是同一生成流程和表达配置，不保证新 MP3 与发布 MP3 逐字节相同。新的时长、响度和 SHA-256 以本次 `draft-manifest.json` 为准。试听验收通过后再由维护者显式整合发布文件及清单，不能把旧清单中的哈希直接赋给新文件。

仓库中已发布文件的确定性验证入口仍是：

```powershell
npm run verify
```

不要为了复现而提交 `.tmp/v19-voice`、模型、源码副本、虚拟环境、原始 WAV 或本地缓存。

## 二十一份 CC0 物件拟音

七幕的 21 个物件热点各使用一份不同的 Freesound CC0 1.0 现场录音，不跨事件复用，也不复用 V14 / V16 的运行拟音。来源页、官方 HQ 预览 URL、取得 SHA-256、原始规格、裁切区间、处理参数、响度和最终文件哈希位于：

- `assets/audio/v19/CINEMATIC-FOLEY-SOURCES.md`
- `assets/audio/v19/scene-sound-manifest.json`

最终拟音统一为 48 kHz、双声道、192 kbps MP3，只截取一次与页面动作对应的真实物件表演。重建命令：

```powershell
$env:FFMPEG_PATH="C:\path\to\ffmpeg.exe"
npm run audio:v19-foley
```

构建脚本下载 Freesound 官方 HQ 预览并先校验取得哈希。所有语音和拟音只在访客主动点击观察热点或角色热点后播放；滚动、自动换帧、预取、打开观察模式和页面加载均不得播放声音。语音失败时仍保留日文与简体中文字幕，拟音关闭或失败时仍完成视觉反馈。

## 许可边界

- 模型来源：<https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan>
- つくよみちゃん语料与使用条款：<https://tyc.rei-yumesaki.net/material/corpus/>
- Piper Plus 源码：<https://github.com/ayutaz/piper-plus>
- 不在仓库分发模型、源码副本、虚拟环境或中间 WAV。
- 当前项目保持个人非盈利展示；更换模型或用途前必须重新审查许可。
