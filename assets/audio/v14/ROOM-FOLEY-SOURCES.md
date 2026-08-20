# V14 四地点真实现场拟音

- 用途：画桌、床边、衣橱、窗台各三次物件操作，共十二段一次性场景声
- 目标：每次点击都听见与文字动作一致的真实物件，不以噪声源合成，不循环，不跨事件复用
- 运行格式：48 kHz、双声道、192 kbps MP3；页面接近连续房间时预热，仍只在用户点击后播放
- 机器清单：[`scene-sound-manifest.json`](scene-sound-manifest.json)
- 复现脚本：[`../../../tools/build-room-foley-v14.mjs`](../../../tools/build-room-foley-v14.mjs)

## 来源与动作对应

| 页面动作 | 真实录音 | 录音信息 | 许可 |
| --- | --- | --- | --- |
| 数位笔补完线条 | Euphrosyyn · [SFX_StylusTabletDrawing Pen_DrawingOnTabletSurface.wav](https://freesound.org/s/370216/) | 真实数位笔刮过绘图板；44.1 kHz、24-bit、立体声 | CC0 1.0 |
| 把数位板转过几度 | TurboFool · [Sliding Book](https://freesound.org/s/561017/) | Blue Snowball 近距录制书本沿桌面滑动；48 kHz、32-bit | CC0 1.0 |
| 按键保存画稿 | Sadiquecat · [Keychron k10 Enter](https://freesound.org/s/789629/) | Zoom H2n XY 模式录制一次 Enter 按键；96 kHz、24-bit | CC0 1.0 |
| 收回滑落的毯角 | Joao_Janz · [Blanket Rustling Movement 1_2](https://freesound.org/s/493262/) | Tascam DR-40；48 kHz、24-bit、立体声 | CC0 1.0 |
| 收起被窝小帐篷 | BiancaDrey · [shufflinginbed.wav](https://freesound.org/s/543573/) | Zoom H6、Rode NTG2；48 kHz、24-bit、立体声 | CC0 1.0 |
| 推来猫咪靠枕 | krnash · [Hitting Bed with Pillow.wav](https://freesound.org/s/389799/) | 枕头落在床面的多次实录；48 kHz、24-bit、立体声 | CC0 1.0 |
| 扶稳晃动的衣架 | CarikaDarvall · [Hanging clothes](https://freesound.org/s/764474/) | 衣物实际挂入衣橱；48 kHz、24-bit、立体声 | CC0 1.0 |
| 把猫耳毯藏到身后 | IENBA · [Fabric Flapping](https://freesound.org/s/701647/) | Zoom H4n、Sennheiser MKH50；48 kHz、24-bit、立体声 | CC0 1.0 |
| 并排举起两套衣服 | Breezy2000uk · [Clothes Hangers on a Metal Rail.wav](https://freesound.org/s/577888/) | 带衣物与空衣架沿金属轨道移动；48 kHz、24-bit、立体声 | CC0 1.0 |
| 把窗缝关小 | soundandmelodies · [SFX-Window,Closing](https://freesound.org/s/776184/) | 真实公寓旧窗关闭；48 kHz、24-bit、立体声 | CC0 1.0 |
| 把画纸靠在窗边 | 123jorre456 · [sliding paper on table.wav](https://freesound.org/s/46631/) | 纸张沿桌面移动；48 kHz、16-bit、立体声 | CC0 1.0 |
| 合上窗帘 | Kate_is_yellow · [Opening and Closing of Curtains](https://freesound.org/s/708206/) | Zoom H6 枪式麦克风录制厚窗帘沿轨道收拢；44.1 kHz、24-bit、立体声 | CC0 1.0 |

## 处理边界

- 每份来源只截取与当前动作相符的一次表演；十二个运行文件对应十二个不同 Freesound 来源，不把同一段布料声切成多个文件伪装差异。
- 只做 65 Hz 高通、16 kHz 低通、统一响度、短淡入淡出和 MP3 导出；不叠加白噪声、合成冲击、算法混响或变调层。
- 窗台三次物件操作不固定混入雨声，因为页面允许切换“细雨 / 晴月”；窗雨只由天气操作的真实室内玻璃录音承担，晴月时不会错误听见雨。
- Freesound 页面上的原文件规格与许可在取得时逐项核对；复现脚本下载官方 HQ 预览后先验证 SHA-256，任何来源变化都会中止生成。
