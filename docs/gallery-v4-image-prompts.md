# v4 害羞画册插画提示词

- 生成日期：2026-08-11
- 用途：补充“在床上画画 → 给来访者看画 → 悄悄留位置 → 等待夸奖”的房间叙事
- 输出：`assets/v4/gallery-*.webp` 与对应 `-thumb.webp`

## 参考图与身份约束

每张图都同时使用以下三张项目内参考图：

1. `assets/v3/hero-shy.png`：人物身份、脸型、银白长发、蓝眼睛、粉色发饰与粉色猫耳家居服。
2. `assets/v3/desk-secrets.png`：草莓粉卧室、奶油床品、薄荷文具、木质画桌与银蓝月光的空间语言。
3. `assets/v3/gallery-hide.png`：害羞、轻柔、全年龄的情绪与精致二次元插画完成度。

四张图共用这些硬约束：同一个角色、同一间卧室、银白长发与蓝眼睛、粉色蝴蝶结发饰、约 5.5 头身的轻 Q 比例、柔和赛璐璐与水彩质感、干净手部、一个人物、全年龄、完整日常服装、无性感化、无图片内文字、无标志、无水印、不复刻任何官方截图。构图按 4:3 安全区设计，关键人物、画稿和动作不得贴边。

## 01：在床上画画

对应文件：`gallery-bed-drawing.webp`

```text
Create a polished 4:3 anime-style illustration for a shy bedroom story gallery. Preserve the exact character identity from the references: the same silver-white long hair, bright blue eyes, pink ribbon hair clips, rounded youthful face, light chibi 5.5-head proportion, and oversized pink cat-ear hoodie with fully covered cream lounge pants. Preserve the same strawberry-pink bedroom, cream bedding, mint stationery, warm wooden furniture, sketchbooks, and soft blue evening light.

Scene: she sits cross-legged in the middle of her bed with a pen tablet resting safely across her knees, actively drawing a cute original character. The viewer has just caught her drawing there. She pauses mid-stroke, shoulders slightly tucked, cheeks visibly pink, and looks up with a startled-but-soft expression while one long sleeve partly hides her hand. Include a stylus, two loose sketch pages, a strawberry cushion, and a cat plush as natural room objects. Make the tablet, stylus hand, and embarrassed glance immediately readable. Intimate but innocent everyday mood; cute, shy, cozy, age-appropriate, fully clothed. Soft cel shading with watercolor-like room light, consistent linework and palette with the references. One character only, coherent hands, no text, no logo, no watermark, no official screenshot recreation.
```

## 02：举起画稿给你看

对应文件：`gallery-show-drawing.webp`

```text
Create a polished 4:3 anime-style illustration continuing the exact same character and bedroom from the references. Preserve her silver-white long hair, blue eyes, pink ribbon clips, rounded face, light chibi proportions, oversized pink cat-ear hoodie, cream lounge pants, strawberry-pink walls, cream bed, mint stationery, wooden desk, and soft blue evening ambience.

Scene: kneeling near the edge of the bed, she shyly holds an open sketchbook toward the viewer with both hands so the artwork is clearly visible. The page contains a simple cute original mascot drawing with no written words. Her arms are slightly stiff from nervousness, cheeks bright pink, eyes looking to the side rather than directly at the viewer, and her mouth forms a tiny guarded pout as if saying “only for three seconds.” A stylus and pen tablet remain on the rumpled bed behind her, linking this image to the previous drawing scene. The emotional focus is the brave little act of showing her work despite being embarrassed. Cute, shy, cozy, innocent, age-appropriate, fully clothed. Coherent hands and sketchbook perspective, one character only, soft cel shading and watercolor room light, no text, no logo, no watermark, no official screenshot recreation.
```

## 03：推来一只靠枕

对应文件：`gallery-pillow-offer.webp`

生成结果将“留一个位置”演绎成了“抱住猫咪靠枕，从靠枕后递出画稿”。运行时采用实际画面叙事与替代文本，保留这份更害羞、也更能回应“展示画画给你看”的变体。

```text
Create a polished 4:3 anime-style illustration continuing the exact same silver-haired, blue-eyed girl and strawberry-pink bedroom from the references. Keep the same pink ribbon hair clips, rounded youthful face, light chibi proportions, oversized pink cat-ear hoodie, fully covered cream lounge pants, cream bedding, mint stationery, wooden furniture, sketchbooks, and soft blue evening light.

Scene: she sits on the bed among neatly scattered drawing tools and shyly pushes a soft strawberry-shaped cushion toward the viewer, silently offering a small place to sit. One sleeve-covered hand rests on the cushion; the other keeps hold of her stylus as if she may return to drawing at any moment. Her body angles away defensively, knees drawn in, but her eyes glance back toward the viewer; cheeks are flushed and her expression is a small tsundere pout hiding kindness. Keep a safe respectful distance in the composition. Make the cushion-offering gesture instantly readable and tender. Cute, bashful, cozy, innocent, age-appropriate, fully clothed. One character, coherent hands, soft cel shading with watercolor-like light, no text, no logo, no watermark, no official screenshot recreation.
```

## 04：装作没在等夸奖

对应文件：`gallery-awaiting-praise.webp`

```text
Create a polished 4:3 anime-style illustration continuing the exact same character identity and room design from the references: silver-white long hair, bright blue eyes, pink ribbon clips, rounded youthful face, light chibi proportions, oversized pink cat-ear hoodie, cream lounge pants, strawberry-pink walls, cream bed, mint stationery, wooden desk, sketchbooks, and quiet blue evening light.

Scene: after showing her drawing, she sits curled up on the bed with knees hugged close and long sleeves hiding part of her hands. The open sketchbook is deliberately placed facing the viewer on the bed in front of her, displaying a cute original character drawing without words. She pretends to look away, but her eyes sneak back toward the viewer, clearly waiting for praise; cheeks are flushed, toes tucked inward, expression guarded and hopeful rather than sad. Include the pen tablet and stylus nearby, plus the cat plush leaning against a pillow. Make the emotional story “pretending not to wait for a compliment” immediately legible. Cute, shy, cozy, innocent, age-appropriate, fully clothed. One character, coherent hands and props, soft cel shading and watercolor room light, no text, no logo, no watermark, no official screenshot recreation.
```

## 导出处理

原始生成图为 1536 × 1024。为保持画册与移动端裁切一致，最终资源从中心安全区裁成 4:3 的 1364 × 1023 WebP，质量 88；缩略图缩放为 480 × 360 WebP，质量 80。另将三张原有叙事情景图按同样规格导出为 `gallery-desk-night`、`gallery-sketchbook-hide` 与 `gallery-goodnight`，因此运行时画册共有七个不重复场景。

`gallery-awaiting-praise` 的第一版速写本正面为空。最终版本以该成图为编辑参考，只在页面上补入一只抱草莓的原创小猫铅笔稿，不改变人物、姿势、手部、房间、构图与光线；编辑提示词如下：

```text
Edit this existing 4:3 anime illustration with one precise change only. Keep the character identity, face, blue eyes, silver hair, pink cat-ear hoodie, cream pants, pose, hands, sketchbook position, bedroom, objects, composition, lighting, colors, rendering style, and 4:3 framing unchanged. On the currently blank sketchbook page facing the viewer, add a clearly visible but delicate hand-drawn pencil-and-soft-pink sketch of a cute original chibi cat mascot holding a tiny strawberry. The sketch must read as an actual unfinished artist drawing, with clean light graphite construction lines and a few pink accent strokes. No written words, no letters, no signature, no logo, no watermark. Do not add or remove any other object; do not alter the character or her hands.
```
