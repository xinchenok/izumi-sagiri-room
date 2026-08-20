# V16 晚安轻关门实录

- 用途：访客收下晚安纸条后，木门在身后轻轻合上的一次性场景声
- 运行文件：[`goodnight-door-close.mp3`](goodnight-door-close.mp3)
- 机器清单：[`goodnight-door-manifest.json`](goodnight-door-manifest.json)
- 复现脚本：[`../../../tools/build-goodnight-door-v16.mjs`](../../../tools/build-goodnight-door-v16.mjs)

## 来源

CastIronCarousel · [Slow gentle close of squeaky wooden door.wav](https://freesound.org/s/216877/) · CC0 1.0。来源页说明为录音棚内干净录制的一次缓慢轻关重木门；原文件为 96 kHz、16-bit、双声道 WAV，不含人声。

页面使用 Freesound 官方 HQ 预览，取得文件 SHA-256 为 `49ee8a68a7df8e7832aedbe43f44b0c1879ac9087fa3894256562001ade5f070`。复现脚本会先核对该哈希，来源变化时直接中止。

## 处理边界

- 从 0.22 秒开始保留一次完整的门体移动、合拢与门闩落定，不抽取其他物件声，也不与既有窗户、窗帘或衣架文件复用。
- 只做 55 Hz 高通、16 kHz 低通、轻压缩、统一响度、短淡入淡出与 48 kHz / 双声道 / 192 kbps MP3 导出；不叠加雨声、脚步、人声、算法混响或合成冲击。
- 声音只由“收下纸条，轻轻带上门”按钮触发，不自动播放、不循环，并服从页面既有“场景声”开关。
