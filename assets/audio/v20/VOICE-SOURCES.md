# V20 日常配音来源与复现

本目录包含 24 句为 V20 新互动独立合成的日语台词，以及逐句简体中文字幕、参数、哈希与响度记录。继续使用既有 Piper Plus「つくよみちゃん」声线，不是新声线试听，不使用 AivisSpeech 或 Qwen。

## 模型与使用范围

- 模型：[ayousanz/piper-plus-tsukuyomi-chan](https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan)。固定 revision：`36b59c825c36bd386b8960cf3f604382f52f2a87`。
- 模型文件：`tsukuyomi-chan-6lang-fp16.onnx`；SHA-256：`5289e9b6eaf21080803b7fe1c4dc85b5491d4c216121207a41df18dd5f68e5d7`。
- 配置 SHA-256：`516058f405ec914140f34832a9d8bb5d8272ba62af9bc7ffb29349715a539780`。
- 推理源码：[Piper Plus](https://github.com/ayutaz/piper-plus)，`npm-v0.6.0` 对应提交 `5fceade2c284a85c8da0523c48b830b434350309`，同一提交的 Python 版本为 `1.12.0`。
- 语料与条款：[つくよみちゃんコーパス（CV.夢前黎 / © Rei Yumesaki）](https://tyc.rei-yumesaki.net/material/corpus/)。模型采用 `tsukuyomi-chan-corpus` 条款，不是 Aivis 的 ACML-NC。

这些预先生成的配音只作为本个人非商业同人网站作品的一部分供欣赏，不授予音频的二次素材利用许可，不提供在线文本转语音服务。网站并非角色版权方、模型提供者或声优的官方作品。模型、语料和中间 WAV 不随网站仓库分发。

本次没有训练、微调、参考音频、动画音轨或声优声纹克隆。推理使用 256 维零说话人向量、mask `0` 和 `CPUExecutionProvider`。全部台词使用同一组自然轻声参数：`noise_scale=0.64`、`length_scale=1.50`、`noise_w=0.76`。参数名称不代表完成了专业情绪表演或听感验收。

## 输出与测量

- 44.1 kHz、单声道、160 kbps MP3；原始推理 WAV 为 22.05 kHz。
- 两遍实测 `loudnorm`，目标 `-18 LUFS`；编码前峰值上限 `-2 dBTP`，为 MP3 解码峰值留出余量。
- 高通 `70 Hz`、低通 `10500 Hz`，沿用既有声音制作滤波范围；没有移调或后期变速。
- 测量 MP3 后，如有响度偏差，只在原始 WAV 的第二遍归一化之后补偿固定音量，不对 MP3 二次转码。每句增益、首次测量及最终实测均保存于查询 JSON。
- 最终 24 句均已完整解码；实测响度 `-18.45` 至 `-17.86 LUFS`，峰值 `-3.50` 至 `-1.64 dBTP`。测量不能代替主观审听，听感验收由主流程记录。

`voice-manifest.json` 是运行资源清单：每项包括 `id`、`textJa`、`textZh`、`file`、`duration`、`sha256`、`parameters`、`loudness`，并指向完整查询。只有实际雨天场景可触发 `window-rain`；未完成稿恢复与共同成稿展示分别只用于对应真实保存或完成状态。

## 复现

使用已有 `.tmp/v19-voice/.venv`、固定源码和模型，不下载或安装其他模型。默认写入带时间戳的 `.tmp/v20-voice` 新目录，已有文件不会覆盖：

```powershell
& .tmp\v19-voice\.venv\Scripts\python.exe tools\build-v20-voice.py
```

首次发布时可以加 `--publish`，但只有 `assets/audio/v20` 尚不存在且所有测量通过时才复制最终 MP3、查询和清单。本仓库已含发布资源，日后复现不加此选项。

如仅调整归一化，可指定 `--reuse-raw <先前生成目录>`，按文本、参数和 WAV 哈希复用原始音频，不重新合成。声学模型含随机采样，重新推理不保证逐字节相同；正式资源以清单的 SHA-256 为准。

本次原始 WAV、两遍编码测量文件和首次未通过响度门槛的版本全部保留在 `.tmp/v20-voice`，未删除任何旧图、旧语音、模型或缓存。
