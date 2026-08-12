# V7「会生活的房间」素材与拟音记录

- 制作日期：2026-08-13
- 用途：画桌、床边、衣橱和窗台连续房间取景框，以及四类操作触发的本地短拟音
- 图像方式：优先复用项目已经验收的同世界 4:3 场景，只为缺失的衣橱机位生成一张原创同人插画
- 声音方式：使用 FFmpeg 的噪声源、频段、包络和轻微颤音合成原创短拟音，不下载第三方音效，不使用动画原声
- 使用边界：个人非盈利同人展示；不使用官方截图、动画分镜、官方音轨、声优声纹克隆或远程热链

本文记录 V7 连续房间为什么复用既有场景、衣橱新图的生成约束、四段短拟音的制作方向、导出规格与校验值。图像生成具有随机性；提示词用于保持身份与房间方向，不承诺重新生成后逐像素一致。

> 当前状态（2026-08-13）：场景图与衣橱素材仍是现役；下文四段 `assets/audio/v7` 拟音只保留为 V7 历史复现记录，页面已经不再读取。当前房间使用十八条专属角色语音和十四段独立场景声，权威说明及机器可读清单见 [`room-audio-v8.md`](room-audio-v8.md)。

## 四个地点的素材路由

| 地点 | 默认场景 | 事件 / 自主变化 | 说明 |
| --- | --- | --- | --- |
| 画桌 | `assets/v6/studio-focus.webp` | `assets/v6/studio-blink.webp` | 复用 V6 同机位专注与 145ms 眨眼帧，桌边叠放上次共同完成的画 |
| 床边 | `assets/v4/gallery-bed-drawing.webp` | `assets/v4/gallery-blanket-fort.webp` | 把原画册中的床上画稿与被窝画室升级成可进入、可重复互动的空间 |
| 衣橱 | `assets/v7/wardrobe-living.webp` | 衣架与布料的代码动效 | 既有换装均为竖幅人物照，无法承担横向房间机位，因此新增唯一场景图 |
| 窗台 | `assets/v4/gallery-goodnight.webp` | 雨线、窗帘与房间天气 | 复用月光窗台场景；细雨 / 晴月是页面内氛围，不冒充真实天气 |

复用的 v4 / v6 图片仍以各自文档的校验表为准。本页只重复记录 V7 新增文件，避免同一哈希出现多份权威答案。

## 衣橱场景生成提示词

参考图的职责：`assets/v6/studio-focus.webp` 锁定房间世界、光线和横向完成度；`assets/v5/outfit-home.webp` 锁定脸型、银白长发、蓝眼、粉色发饰和家居服；`assets/v5/outfit-hooded-blanket.webp` 锁定薄荷猫耳毯的轮廓与材质。

> 4:3 landscape illustration for an interactive room scene. Show the same shy silver-haired, blue-eyed young illustrator standing beside an open cocoa-brown wooden wardrobe in her strawberry-pink bedroom, hesitantly comparing a loose pink home jacket with a mint cat-ear hooded blanket. She looks slightly away with a small embarrassed expression, as if noticed while deciding what to wear. Keep one fully clothed character only, safe everyday home setting, modest and non-sexualized. The open wardrobe occupies the left third, the character is center-right, and the room still reveals the bed, moonlit window and drawing desk so it reads as one continuous bedroom. Preserve long silver-white hair, straight bangs, blue eyes, pink bow hair clips, natural hands holding one garment each, warm lamp plus restrained moon-blue light, soft polished anime storybook rendering and fabric texture. No second person, text, logo, watermark, UI, split panels, decorative border, lingerie, exposed skin, suggestive pose, exaggerated anatomy, maid costume, fashion runway, neon color, magical effect, chibi proportion or official screenshot imitation.

### 导出规则

- 生成源为 1448 × 1086 PNG，保留为 `assets/v7/wardrobe-living-source.png`。
- 桌面运行时 WebP 保持 1448 × 1086；移动版本缩放为 720 × 540，不改变比例，不锐化脸部或裁掉双手和衣物。
- 运行时使用高质量有损 WebP；生成源只用于后续重导，不参与网页加载。
- 替代文本必须说明“在打开的衣橱旁比较粉色外套和薄荷猫耳毯”，不能把选择写成已经发生的事实。

## 四段本地短拟音

四段拟音均为 44.1 kHz、单声道 MP3，页面内部播放系数为 `0.55`。它们只在点击地点事件或手动切换房间天气后播放；“房间声”开关独立于日语语音的音量与“只看字幕”，不会自动播放或循环。

| 文件 | 时长 | 合成方向 | 最终峰值 |
| --- | --- | --- | --- |
| `assets/audio/v7/pencil-soft.mp3` | 0.940 s | 粉噪声经 1–5.2 kHz 频段、13 Hz 轻微颤音与短淡入淡出，模拟柔软笔尖摩擦 | -17.1 dB |
| `assets/audio/v7/fabric-soft.mp3` | 1.149 s | 棕噪声经 90–2100 Hz 频段、慢颤音与长尾淡出，模拟被角和靠枕布料 | -14.7 dB |
| `assets/audio/v7/hanger-soft.mp3` | 0.940 s | 过滤粉噪声与极短 760 Hz 轻碰声混合，模拟衣架与衣物被扶稳 | -17.5 dB |
| `assets/audio/v7/curtain-rain.mp3` | 1.384 s | 粉噪声经 420–5600 Hz 频段、低深度颤音和较长尾音，模拟窗帘与细雨 | -14.5 dB |

页面播放后峰值约为 -20～-23 dB，目的是在手机扬声器上能被感知，但不压过角色语音或突然惊扰访客。若替换任一拟音，应重新检查解码、时长、峰值、操作后播放限制和独立静音降级。

## V7 新增文件校验

| 文件 | 尺寸 / 时长 | SHA-256 |
| --- | --- | --- |
| `assets/v7/wardrobe-living-source.png` | 1448 × 1086 | `90b1a0aef6bfb2f97b34eeb1e18eabe8131ad58e4321a379874a235d23820206` |
| `assets/v7/wardrobe-living.webp` | 1448 × 1086 | `8d1af59562c2682feb8b7bb5a5830ac20c473a37ad4412d5180edd90ef0cc379` |
| `assets/v7/wardrobe-living-720.webp` | 720 × 540 | `1a811cb63190aa9e44f5e6dc1bff4302514e23239377d1abc68907c2a5a177c6` |
| `assets/audio/v7/pencil-soft.mp3` | 0.940 s | `298aae0428088b1367567edc0e9a0f94d49ea80b33e118b5a3fb4af92f858759` |
| `assets/audio/v7/fabric-soft.mp3` | 1.149 s | `d192b809e35f6d48c68fd8c169d9b4806956af00e0f6fa30741a889a7eda0bc0` |
| `assets/audio/v7/hanger-soft.mp3` | 0.940 s | `ed0c2008686bb2637cdf8bc54539f568782cb747613eaa36109bea6d4ec15612` |
| `assets/audio/v7/curtain-rain.mp3` | 1.384 s | `1db5f9fbb7515162424c8f10e3d5139a2afadbae5bb401983e42289a77eaae8d` |

## 运行时与状态边界

- 内容集中在 `script.js` 的 `CONTENT.livingRoom`，没有引入框架、Canvas、3D 引擎、联网天气或通用游戏状态机。
- `sagiri-room-state-v2` 只新增 `livingPlace`、`livingWeather` 和 `roomSoundMuted`；旧状态缺失时自然回落，不清空服装、秘密、回访、画册、语音或共同作品。
- 四地点按钮支持点击与方向键，手机取景框支持横向滑动；图片禁止原生拖拽，避免浏览器把房间手势当成拖图。
- `prefers-reduced-motion: reduce` 下不安排自主换帧，雨线、笔尖、布料、衣架和窗帘动画隐藏；地点、事件、天气、文字与拟音开关仍可使用。
- 完成新的 V6 共同作品后，桌边拍立得立即更新；没有共同作品时不显示空相框，也不伪造默认记忆。

维护时若替换新衣橱场景，应同步更新本表、`CONTENT.livingRoom`、`DESIGN.md` 和 `docs/ai-assisted-development.md`；若替换当前配音或场景声，应改 `docs/room-audio-v8.md` 与两个 V8 清单。两类改动都要重新检查 1440、1024、390px、方向键、手机横滑、旧 V6 存档和减少动态效果。
