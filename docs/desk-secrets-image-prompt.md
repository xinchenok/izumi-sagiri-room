# 五秘密画桌插画生成记录

- 生成方式：ChatGPT Work 内置 `image_gen`
- 生成日期：2026-08-11
- 用途：`assets/v3/desk-secrets.png` 与 `assets/v3/desk-secrets.webp`
- PNG SHA-256：`95fd2453e58b7043d0d75afb81f0c3703c16f66b26efb5464c752226b64f5830`
- WebP SHA-256：`4bfe82376907733f55d8ddf85bbeb2e9d49312a03a9c79fe681558233a45ceae`

## 参考图及角色

1. `assets/v3/hero-peek.png`：角色身份锚点。
2. `assets/v3/gallery-drawing.png`：渲染方式、房间光线与横向构图参考。
3. `assets/v3/outfit-home.png`：服装与身体比例参考。

## 最终提示词

```text
Use case: illustration-story
Asset type: 4:3 landscape interactive website section illustration for the “find five little secrets” desk scene
Input images: Image 1 is the character identity anchor; Image 2 is the exact rendering, room-lighting, and landscape-composition reference; Image 3 is the outfit and body-proportion reference.
Primary request: Create a new, original illustration of Izumi Sagiri in her cozy bedroom drawing studio, designed to sit behind five clickable website hotspots. Match the same character identity and the same soft, high-quality Japanese anime illustration finish shown in the references.
Scene/backdrop: strawberry-pink wallpaper, warm cocoa-brown wooden drawing desk, a small right-side window with gentle blue dusk light, pale mint stationery accents, cream manuscript paper, intimate tidy bedroom studio.
Subject: Izumi Sagiri, a petite all-ages anime girl with very long silver-white hair, straight soft bangs, two small pink bow hair clips, large clear cyan-blue eyes, round youthful face, faint blush, and a shy caught-in-the-act expression. She wears the same loose pink cat-ear hoodie and cream modest homewear from the references. Show her seated behind the desk, upper body visible, one hand naturally holding a digital stylus, looking toward the visitor with bashful surprise.
Required five secret objects and exact composition zones: (1) one pair of over-ear headphones clearly isolated in the upper-left area; (2) one small stack of light-novel manuscript pages clearly isolated in the lower-left foreground; (3) one black pen-display drawing tablet clearly isolated in the lower-center area; (4) one pink cat plush clearly isolated in the upper-right area; (5) one visibly locked wooden desk drawer with a tiny keyhole clearly isolated in the lower-right area. Keep all five silhouettes readable, separated, unobstructed, and large enough for website click targets.
Composition/framing: 4:3 landscape, slightly elevated three-quarter view. Sagiri occupies the upper-middle background and does not cover any of the five objects. The desktop fills the lower half. Maintain generous visual separation around each object for overlay labels. Keep important content away from the outer 5% edges.
Style/medium: polished pastel Japanese anime illustration, delicate clean linework, soft painterly cel shading, luminous eyes, finely rendered silver hair, subtle fabric and wood texture, consistent with all three references; cute, gentle, private, handcrafted atmosphere; not photorealistic and not a screenshot.
Lighting/mood: warm desk-lamp glow mixed with cool dusk window light; soft blush-pink and moon-blue shadows; shy, cozy, quiet, adorable.
Color palette: strawberry pink, cream paper, cocoa wood, pale mint, silver hair, cyan eyes, restrained moon blue.
Constraints: preserve Sagiri’s exact facial identity, hairstyle, eye color, hair accessories, petite proportions, and safe everyday characterization from the references. Exactly one character. Exactly one of each required secret object. Full visible hands with natural anatomy. No text anywhere in the image.
Avoid: words, letters, labels, UI, icons, speech bubbles, watermark, logo, official anime screenshot composition, photorealism, 3D render, glossy plastic look, neon colors, purple cyberpunk lighting, fanservice, sexualization, exposed skin, revealing clothing, distorted hands, extra fingers, extra limbs, duplicate objects, clutter covering the five secret objects, extreme fisheye perspective, cropped tablet, cropped drawer.
```

## 接入说明

网页用 `<picture>` 优先加载 WebP，PNG 作为回退。五个热点以百分比定位到耳机、稿件、数位板、玩偶和抽屉，区域互不重叠；原始图内没有文字、交互图标或水印。
