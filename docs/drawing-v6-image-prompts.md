# V6「一起画完这一张」插画记录

- 生成日期：2026-08-13
- 用途：雨夜共同创作舞台的四个角色帧，以及三张可被选择的小猫成稿
- 生成方式：使用工作区内置图像生成工具生成原创同人场景，再以 FFmpeg 导出本地 WebP
- 使用边界：个人非盈利同人展示；不使用官方截图，不复刻动画分镜，不训练或克隆真实人物与声优声纹

本文记录视觉方向、生成提示词、导出规格与运行时文件校验值。图像生成具有随机性；提示词用于保持身份和构图方向，不承诺重新生成后逐像素一致。

## 统一身份与画面约束

四个舞台帧必须像发生在同一分钟：同一位银白长发、明亮蓝眼睛、两枚小粉色发饰的娇小少女，穿宽松粉色猫耳连帽家居服与朴素奶油色内搭；圆润脸型、轻 Q 比例、全年龄、非性感化。她坐在同一张木质画桌前使用黑色数位屏，左侧有耳机、画笔和稿纸，右侧有猫咪玩偶与带猫图案的杯子，后方是书架、盆栽、草莓装饰和雨夜窗户。室内是暖粉桌灯，窗外是安静银蓝雨夜。

共同负面约束：不要文字、标志、水印、网站 UI、对话框、额外手指、畸形手部、暴露服装、性感姿势、夸张胸部、成熟写实年龄、霓虹赛博灯光、紫色科技渐变、官方动画截图感或复杂动态背景。

## 舞台帧提示词

### 1. 专注帧 `studio-focus`

> 4:3 horizontal anime-inspired editorial illustration for a gentle non-commercial fan webpage. Keep the exact shared identity and room layout described above. Medium-wide eye-level view across the drawing desk. The silver-haired blue-eyed girl looks down at her pen display and draws with calm, serious concentration; one hand holds the stylus naturally and the other rests near the tablet. Her expression is quiet and absorbed, not posing for the viewer. Warm desk lamp against a deep blue rainy window, soft painterly texture, cozy hand-crafted storybook finish, clear face and hands, enough stable detail for later matching frames. No text, logo, watermark, UI, sexualization, fisheye lens, or dramatic action.

### 2. 眨眼帧 `studio-blink`

> Recreate the `studio-focus` scene as the same continuous moment: identical character, camera, crop, clothing, desk, props, lighting and hand positions. The only meaningful change is a brief natural blink while she keeps drawing, with eyelids gently closed and a relaxed concentrated face. Preserve every large shape so a 145 ms image swap feels like animation rather than a new shot. 4:3 horizontal, soft painterly anime storybook finish. No text, watermark, UI or other changes.

### 3. 害羞帧 `studio-shy`

> Continue the same rainy-night drawing-desk scene with identical identity, camera and props. She has just heard a specific, sincere compliment about her drawing. She looks slightly away from the viewer, cheeks visibly pink, and brings the cuff of her oversized sleeve close to her mouth while trying not to smile. The reaction is shy, restrained and in-character rather than exaggerated. Keep the pen display and unfinished paper visible. Warm lamp, silver-blue rain, 4:3 horizontal, soft painterly anime storybook texture. No text, watermark, UI, sexualization or camera change.

### 4. 完成递画帧 `studio-reveal`

> Continue the same scene, identity, clothing, room and eye-level 4:3 camera. The girl now wears a small shy but quietly proud smile and leans forward just enough to slide one newly finished sheet of paper across the desk toward the viewer. One hand extends the page naturally; the black pen display, sketch stack, cat mug and plush cat remain readable anchors. Her blue eyes finally meet the visitor for a moment. Warm desk lamp and rainy blue window, gentle painterly anime storybook finish, safe everyday mood. No readable drawing on the offered sheet, no text, watermark, UI, sexualization or dramatic perspective.

## 小猫成稿提示词

三张成稿共用以下媒介锚点：4:3 横向扫描稿；温暖奶油色粗纹纸；非常柔软的灰铅笔线与稀薄粉彩水彩；留白充足；像害羞但认真画完的一页小稿；主体清楚、细节克制。不要文字、签名、水印、界面、照片写实、矢量描边、粗黑轮廓、强饱和色或复杂背景。

### 1. 门缝看月亮的小猫 `drawing-door-moon`

> A tiny curious kitten peeks halfway from behind a gently opened bedroom door. Beyond the door is a quiet crescent moon with three very small stars and a faint blush-colored cloud. The kitten is shy but clearly wants to look outside. Soft graphite construction lines and translucent watercolor on cream textured paper, muted warm gray, pale moon blue and a trace of blush pink, generous negative space, tender children’s storybook sketch, 4:3 horizontal scan.

### 2. 被窝里画星星的小猫 `drawing-blanket-star`

> A small kitten hides inside a blanket fort shaped like a tiny private studio. Only its focused face and paws are visible as it uses a pencil to draw one star on a little sheet of paper; two soft stars float as an imaginative accent above the blanket. Soft graphite and translucent watercolor on cream textured paper, muted mint, warm gray and pale yellow, generous negative space, cozy and serious rather than silly, 4:3 horizontal scan.

### 3. 抱着大铅笔的小猫 `drawing-pencil-stars`

> A fluffy kitten hugs an oversized wooden pencil with both front paws as if it refuses to let an idea escape. Three tiny stars sit around it with lots of quiet cream-paper space. The pose is soft and cute, but the kitten’s eyes look earnestly focused. Soft graphite and translucent watercolor on cream textured paper, muted blush, warm gray and pale yellow, delicate imperfect hand-drawn lines, 4:3 horizontal scan.

## 导出规则

- 舞台生成源比例为 4:3、尺寸为 1448 × 1086；桌面运行时保留该尺寸，移动版本缩放到 720 × 540。
- 小猫成稿统一导出为 960 × 720；配色选择由 CSS 在纸面框内添加低强度颜色层，不能再导出三套重复位图。
- WebP 使用高质量有损压缩与最高压缩级别；不改变画面比例，不锐化面部，不裁掉手、画纸、数位屏或关键房间锚点。
- `srcset` 只用于四个舞台帧；三张成稿按用户实际选择才预加载。

## 运行时文件校验

| 文件 | 尺寸 | SHA-256 |
| --- | --- | --- |
| `assets/v6/studio-focus.webp` | 1448 × 1086 | `84953ab415a6b2587b60fd3c770eef586e1009f08bc92761864054b0189b8474` |
| `assets/v6/studio-focus-720.webp` | 720 × 540 | `2c7a742846b2d82023d71dd1ff6fce71e31ce3c8a7dcd30ddb3ccf94375be647` |
| `assets/v6/studio-blink.webp` | 1448 × 1086 | `033dd2d540ba9b605aea57385a29a217f4e2ac3929fd74de65afe72ac314d5d3` |
| `assets/v6/studio-blink-720.webp` | 720 × 540 | `89b7cf995f99ad44ae972af09ae3ca111126b36484f19a954791d92c743b8337` |
| `assets/v6/studio-shy.webp` | 1448 × 1086 | `28996e89d77f13500790bbad2f634432f611b534767eda53b172c80916cd08eb` |
| `assets/v6/studio-shy-720.webp` | 720 × 540 | `b7fb3483cc8309060c472c0afa34a0fd3510af501375b7738a181f9687d91af9` |
| `assets/v6/studio-reveal.webp` | 1448 × 1086 | `07cdda93d64554126f2d0adc95a63b87cd6992a164a82b832b96d5f24ca9eac0` |
| `assets/v6/studio-reveal-720.webp` | 720 × 540 | `2f000ad28305458a45e8657e67e9d714465be33e71ed6d7a77c38a54915b32aa` |
| `assets/v6/drawing-door-moon.webp` | 960 × 720 | `b1bed7c56ae71f3008c3ced2b4081e8ddb2e94fe4739d6f7cf31096dcc1af832` |
| `assets/v6/drawing-blanket-star.webp` | 960 × 720 | `7b573eef59ec1a70225660844ef123fe9ab40cb4852ef29b12b13a95411f18f9` |
| `assets/v6/drawing-pencil-stars.webp` | 960 × 720 | `1dbc2030db178cc0c957a83498d9b78427649f8a3bbfb9862ea5e3d32493e1e8` |

维护时若替换任一文件，应同时更新本表、`script.js` 的替代文本、`DESIGN.md` 的资源说明，并重新检查 1440、1024 与 390px 的构图及减少动态效果。
