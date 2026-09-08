# RoomSign 房间标题字体

RoomSign 是 Google Fonts 收录的 Long Cang（龙藏体）本地 WOFF2 子集，仅用于 h1「纱雾的房间」。它使用原字体自然的细长手写字形，没有 CSS 斜切、拉伸、图像字标或重新描绘。

- 官方收录仓库：[Google Fonts / Long Cang](https://github.com/google/fonts/tree/baa2e5561af8a4873b058859dcfe158bdd033942/ofl/longcang)。
- 固定提交：`baa2e5561af8a4873b058859dcfe158bdd033942`。
- 原字体：`LongCang-Regular.ttf`，5,162,508 字节。
- 原字体 SHA-256：`e5bf2c3f24ef2327c6f136d8f73e2f9dfdf44896fdbeb35a9515f44777bb91bc`。
- 版权署名：Copyright 2018 The Long Cang Project Authors。
- 许可：SIL Open Font License 1.1；完整原文保存在 [OFL-LongCang.txt](OFL-LongCang.txt)。
- 许可文件 SHA-256：`603546b7219a94bb59bf8294458194a5010119486354092b66a09a3fd61aeacc`。
- 衍生字体内部 family：`RoomSign`；Regular 400。
- 实际 cmap：仅「纱」「雾」「的」「房」「间」五字；另有不映射 Unicode 的 `.notdef` 字形。
- 当前子集：`RoomSign.woff2`，3,076 字节；SHA-256 `2000391c403077908ca20087f423c73c8241bba6bb4435c9253f10ab09b02cef`。

RoomTitle（文楷）、RoomBody（Noto SC）和 RoomJapanese（Noto JP）仍保留原 family 与职责。RoomSign 不用于正文、日文字幕或其他标题；变更 h1 文案时，应先明确修改固定 `subsetText` 并核对新字覆盖，不能无声退回不一致字体。

## 复现

源 TTF 只保存在忽略目录，不随网站提交。使用已经配置 fontTools 4.62.0 与 WOFF2 支持的 Python；构建脚本会优先读取项目的 `.tmp/v20-fonts/dependencies`。

```powershell
New-Item -ItemType Directory -Path '.tmp/v20-fonts/source' -Force | Out-Null
$longCangBase = 'https://raw.githubusercontent.com/google/fonts/baa2e5561af8a4873b058859dcfe158bdd033942/ofl/longcang'
Invoke-WebRequest -Uri "$longCangBase/LongCang-Regular.ttf" -OutFile '.tmp/v20-fonts/source/LongCang-Regular.ttf'
Invoke-WebRequest -Uri "$longCangBase/OFL.txt" -OutFile '.tmp/v20-fonts/source/OFL-LongCang.txt'
python tools/build-v20-fonts.py --family RoomSign
```

`--family RoomSign` 只构建这一个子集，保留其他字体字节与原扫描证据；已有其他三份子集时，manifest 会合并为四份。完整发布前仍应按最终运行文本重建全部字体：

```powershell
python tools/build-v20-fonts.py --scan index.html script.js room-core.js room.js room-inspector.js assets/audio/v20/voice-manifest.json
node tools/verify-v20-assets.mjs
```

完整构建保留原始 TTF／OTF 和历史素材，仅重新生成本次 V20 的四个发布子集及当前扫描指纹。所有字体来源、原文件哈希、许可、输出哈希与 cmap 统计统一在 [font-manifest.json](font-manifest.json)。字形覆盖验证不是界面最终视觉验收。
