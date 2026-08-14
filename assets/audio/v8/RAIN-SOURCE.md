# 窗雨录音来源

- 作品：`RAIN on glass window.wav`
- 录音者：nicoproson
- 来源：[Freesound 648529](https://freesound.org/s/648529/)
- 许可：[Creative Commons Zero 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- 原作品规格：96 kHz、32-bit、立体声 WAV、2:53.931
- 本次取得：Freesound 官方 HQ MP3 预览，48 kHz、立体声，SHA-256 `536a435b4d96608aeeff56786652114fe66748184807d87c2303d7087eb309a0`
- 取得日期：2026-08-14

运行文件 `weather-rain-window.mp3` 取官方 HQ 预览第 44–68 秒，做 70 Hz 高通、EBU R128 `-23 LUFS` 归一化、80 ms 淡入与 800 ms 淡出，再导出为 48 kHz、立体声、192 kbps MP3。没有叠加合成白噪声、程序化雨滴或其他第三方素材。

可运行 `node tools/generate-rain-window-audio.mjs` 重新取得、校验并生成相同处理版本；脚本会在生成前核对来源文件 SHA-256，来源变化时直接失败，不会静默替换素材。
