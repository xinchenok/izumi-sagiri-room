# v5 新增换装插画提示词

- 生成日期：2026-08-11
- 生成方式：OpenAI 内置图像生成，参考图生成模式
- 用途：为衣橱增加“草莓睡前服”和“猫耳连帽毯”两套符合角色日常与性格的完整场景换装
- 输出：`assets/v5/outfit-*.webp`、对应 `-560.webp` 与两张 `-source.png` 维护源

## 参考图与共同约束

生成时以项目内人物表情、旧换装和卧室场景作为参考：

1. `assets/v3/hero-shy.png`：人物身份、银白长发、蓝眼睛、粉色发饰、圆润脸型与害羞表情。
2. `assets/v3/outfit-home.png`：约 5.5 头身的轻 Q 比例、服装展示构图与柔和赛璐璐质感。
3. `assets/v3/outfit-artist-night.png`：深夜画师状态、画具和室内银蓝光线。
4. `assets/v3/desk-secrets.png`：草莓粉卧室、奶油床品、薄荷文具与温暖木质家具。

两张图共用这些硬约束：保持同一个角色与同一间卧室；银白长发、明亮蓝眼睛、粉色发饰、圆润年轻面部、轻 Q 比例；一个人物；完整日常服装；全年龄、非性感化；手部和画具关系清楚；无图片内文字、标志、水印或官方截图复刻。纵向构图为 1122 × 1402，人物、手部与关键画具不得贴边。

## 01：草莓睡前服 · 侧躺床上画画

维护源：`assets/v5/outfit-bedtime-source.png`

运行时资源：

- `assets/v5/outfit-bedtime.webp`
- `assets/v5/outfit-bedtime-560.webp`

```text
Create a polished vertical anime-style outfit illustration for the same shy silver-white-haired, bright-blue-eyed girl shown in the project references. Preserve her exact identity, rounded youthful face, pink ribbon hair clips, light chibi 5.5-head proportions, soft cel shading, and the same strawberry-pink bedroom with cream bedding, mint stationery, warm wooden furniture, moonlit blue shadows, and a small warm bedside lamp.

Scene and outfit: it is late at night and she is lying safely on her side across the bed while still drawing on a thin pen tablet propped on a pillow. Dress her in a cozy fully covered cream-and-soft-pink long-sleeved pajama set with tiny strawberry motifs, loose full-length pajama pants, and socks. One hand holds the stylus correctly against the tablet while the other steadies the tablet or pillow. Her eyelids are a little sleepy, cheeks softly flushed, and her guarded expression says she promised herself one last stroke but does not want to stop. Include a cat plush, a closed sketchbook, and quiet moonlight as secondary details without cluttering the action.

Make the side-lying pose, bedtime clothing, correct stylus hand, tablet surface, and sleepy persistence immediately readable. One character only; coherent hands and limbs; fully clothed; innocent, cozy, age-appropriate, non-sexual everyday mood. No text, letters, signature, logo, watermark, extra fingers, detached objects, or official screenshot recreation.
```

## 02：猫耳连帽毯 · 雨夜认真校稿

维护源：`assets/v5/outfit-hooded-blanket-source.png`

运行时资源：

- `assets/v5/outfit-hooded-blanket.webp`
- `assets/v5/outfit-hooded-blanket-560.webp`

```text
Create a polished vertical anime-style outfit illustration continuing the exact same character identity and bedroom from the project references. Preserve the same silver-white long hair, bright blue eyes, pink ribbon clips, rounded youthful face, light chibi 5.5-head proportions, strawberry-pink room, cream textiles, mint drawing supplies, warm wooden furniture, soft cel shading, and watercolor-like room light.

Design the outfit around her introverted stay-at-home illustrator personality rather than generic fashion: an oversized mint-gray wearable hooded blanket with small cat ears, long roomy sleeves, a cream lining, subtle strawberry-pink stitching, fully covered soft lounge pants, and thick socks. It should feel like a private portable hiding place—cute, practical, warm, and slightly defensive, never glamorous or revealing.

Scene: on a rainy evening she sits cross-legged at a low table, almost wrapped inside the hooded blanket, seriously checking several original sketch pages with a red correction pencil. A pen tablet, capped mug, clips, and cat plush sit nearby. She has a focused illustrator's gaze, but notices the viewer and pulls one sleeve closer to her flushed cheek. Show rain as soft window reflections, not a dramatic storm. Make the outfit silhouette, cat-ear hood, correct pencil hand, proofing action, and shy-but-serious personality instantly readable. One character only; coherent hands and papers; fully clothed; safe, cozy, age-appropriate, non-sexual. No readable text, signature, logo, watermark, or official screenshot recreation.
```

## 导出与清晰度验收

两张生成源均为 1122 × 1402 RGB PNG。运行时完整图保持原始 1122 × 1402 像素，不缩小，以 FFmpeg `libwebp`、`quality=95`、`compression_level=6`、`preset=picture` 导出；仅在窄屏实际显示尺寸较小时，通过 `srcset` 选择 560 × 700 的 Lanczos 缩放版本，质量为 93。PNG 维护源不参与网页首屏加载。

完整图与 PNG 维护源的 PSNR 分别为：

| 服装 | 完整图 PSNR |
| --- | ---: |
| 草莓睡前服 | 43.7795 dB |
| 猫耳连帽毯 | 44.0891 dB |

资源 SHA-256：

| 文件 | SHA-256 |
| --- | --- |
| `outfit-bedtime-source.png` | `1fc1906880cda771f1b462c6225d79c83362279280e25140eae7fb32bb9b4e68` |
| `outfit-bedtime.webp` | `1e9f43d5c159484b33d4b926dc7330a3f0ce9a7ae6ccf2827216b13a8576d4c7` |
| `outfit-bedtime-560.webp` | `758635d454338525dc06b7a4cede4d681925d021174e403c42acbe2c36992e32` |
| `outfit-hooded-blanket-source.png` | `3df91cdc468a45fabd2a1e82a80805dfbe31e598fbe9d3d8e71362f179cc62b9` |
| `outfit-hooded-blanket.webp` | `1a25f7bd6cb50cce10287292761093f306d194b4a10ad81e4425f45e964c4f7b` |
| `outfit-hooded-blanket-560.webp` | `2dfacea37388a7706d6aa4dbb92d03e3a981a2e73c578438acf1a2f767265089` |
