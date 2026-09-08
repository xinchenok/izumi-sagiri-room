# V19 七幕拟音来源

V19 的 21 个物件动作各使用一份独立的 Freesound CC0 实录，不跨事件复用，也不与 V14/V16 的现役拟音复用。声音只在访客主动点击观察模式热点时播放；滚动、自动动作和页面载入均不播放声音。

| Freesound ID | 上传者 | 原始标题 | 页面 | 许可 |
| --- | --- | --- | --- | --- |
| 635282 | DrFahrts | soft knocks on door | [来源](https://freesound.org/s/635282/) | CC0 1.0 |
| 213998 | FenrirFangs | door handle 1.wav | [来源](https://freesound.org/s/213998/) | CC0 1.0 |
| 444386 | MootMcnoodles | Door opening.wav | [来源](https://freesound.org/s/444386/) | CC0 1.0 |
| 407405 | florianreichelt | Drawing with a pen | [来源](https://freesound.org/s/407405/) | CC0 1.0 |
| 50701 | RutgerMuller | Chair Heavy Sliding.wav | [来源](https://freesound.org/s/50701/) | CC0 1.0 |
| 205074 | jadend2 | Curtains.WAV | [来源](https://freesound.org/s/205074/) | CC0 1.0 |
| 546729 | addison42 | taking off headphones and setting them down.m4a | [来源](https://freesound.org/s/546729/) | CC0 1.0 |
| 211246 | Tomoyo Ichijouji | PageRustle | [来源](https://freesound.org/s/211246/) | CC0 1.0 |
| 260218 | laura222 | drawer.wav | [来源](https://freesound.org/s/260218/) | CC0 1.0 |
| 554730 | dynamique | moving clotheshangers.wav | [来源](https://freesound.org/s/554730/) | CC0 1.0 |
| 556711 | NachtmahrTV | Rustling fabric | [来源](https://freesound.org/s/556711/) | CC0 1.0 |
| 734619 | Vrymaa | Cloth - Ribbon rustle | [来源](https://freesound.org/s/734619/) | CC0 1.0 |
| 554837 | The_Runner_01 | Book - Open':Close.wav | [来源](https://freesound.org/s/554837/) | CC0 1.0 |
| 814247 | Mihacappy | paperrustle.wav / Notebook Page Flipping | [来源](https://freesound.org/s/814247/) | CC0 1.0 |
| 46631 | 123jorre456 | sliding paper on table.wav | [来源](https://freesound.org/s/46631/) | CC0 1.0 |
| 46624 | 123jorre456 | drawing fast lines with pencil on paper.wav | [来源](https://freesound.org/s/46624/) | CC0 1.0 |
| 449127 | HarpyHarpHarp | Rustling Paper | [来源](https://freesound.org/s/449127/) | CC0 1.0 |
| 444426 | MTJohnson | Sliding Envelope into Drawer.wav | [来源](https://freesound.org/s/444426/) | CC0 1.0 |
| 240015 | survivalzombie | Squeeze Toy.mp3 | [来源](https://freesound.org/s/240015/) | CC0 1.0 |
| 862316 | qubodup | Close Book 2 | [来源](https://freesound.org/s/862316/) | CC0 1.0 |
| 405534 | nebulasnails | Door Lock.wav | [来源](https://freesound.org/s/405534/) | CC0 1.0 |

机器可核验的预览 URL、取得哈希、原始规格、裁切区间、处理参数、响度与最终文件 SHA-256 位于 [scene-sound-manifest.json](scene-sound-manifest.json)。发布文件统一为 48 kHz、双声道、192 kbps MP3。

构建命令：

```powershell
$env:FFMPEG_PATH="C:\path\to\ffmpeg.exe"
node tools\build-cinematic-foley-v19.mjs
```

构建脚本只下载官方 Freesound HQ 预览，并逐项校验预期 SHA-256。原始下载文件与中间产物不提交。
