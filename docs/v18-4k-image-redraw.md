# V18 全量 4K 插画重绘

更新日期：2026-09-04

## 目标

V18 在不改变 V17 页面结构、互动和叙事的前提下，把全部现役人物与场景图重新进行以图生图绘制。质量目标不是给旧图加锐化，而是以旧图锁定身份、动作和空间，再重新绘制更可爱、更灵动、更精致的一套统一插画。

统一角色锚点强调：银白长发、明亮有层次的蓝眼睛、圆润可爱脸型、细小害羞嘴型、自然脸红、粉色发饰、轻 Q 全年龄比例、柔软织物和含蓄宅系动作。禁止成熟化、网红化、性感化、呆板直视和用夸张光效掩盖角色气质。

## 输出规格

| 类型 | 4K 母版 | 网页派生图 |
| --- | --- | --- |
| 竖版人物 | 3072 × 3840 WebP | 720 × 900、1440 × 1800 |
| 4:3 场景与成稿 | 3840 × 2880 WebP | 480 × 360、720 × 540、1440 × 1080 |

内置 ImageGen 首先根据旧图进行真正的重新绘制；生成结果再使用 Pillow Lanczos 升采样、轻量反锐化和高质量 WebP 编码制作 4K 母版。网页通过 `srcset` 按设备选择 720、1440 或 4K 文件，不要求手机下载 4K 母版。

4K 母版保存在 `assets/v18/master/`，响应式版本保存在 `assets/v18/`。每个最终 WebP 都有同名 `.webp.json` 来源边车，精确记录传给 ImageGen 的提示词；可读提示词另存于 `assets/v18/prompts/`。

## 重绘范围

### 首屏与换装

- `hero-peek`、`hero-startled`、`hero-shy`、`hero-proud`
- `outfit-home`、`outfit-artist-night`、`outfit-outing-sailor`
- `outfit-bedtime`、`outfit-hooded-blanket`

### 十一幕画廊

- `gallery-bed-drawing`、`gallery-blanket-fort`、`gallery-stream-wave`
- `gallery-show-drawing`、`gallery-pillow-offer`、`gallery-door-note`
- `gallery-desk-night`、`gallery-sketch-sort`、`gallery-sketchbook-hide`
- `gallery-awaiting-praise`、`gallery-goodnight`

### 房间、陪画与成稿

- `desk-secrets`、`wardrobe-living`
- `studio-focus`、`studio-blink`、`studio-shy`、`studio-reveal`
- `drawing-door-moon`、`drawing-blanket-star`、`drawing-pencil-stars`

共 29 张独立母版。表情与换装以新的 `hero-peek` 为身份锚点；陪画表情以新的 `studio-focus` 同时锁定人物、机位与房间。三张小猫成稿保持奶油稿纸上的铅笔水彩风，不改成角色人物画。

## 以图生图约束

每张旧图承担“构图目标”职责，必须保留：

- 人物身份、服装、姿势、手势和表情意图。
- 相机机位、画幅比例、主体大小和主要裁切。
- 房间几何、窗户、门、床、画桌、数位板与叙事物件。
- 原场景的时间、天气和光线方向。

允许加强：

- 蓝眼睛的高光和虹膜层次、眉眼与嘴角的微表情。
- 银白发丝、针织衣料、稿纸、木纹与柔软玩偶的材质。
- 手指结构、动作接触关系、环境纵深和自然柔光。
- 同一草莓粉、银蓝、薄荷、可可木和奶油纸色系内的层次。

所有图片均要求无文字、无水印、无徽标、无多余人物或肢体、无畸形手。每张具体提示词以 `assets/v18/prompts/<name>.txt` 为准。

## 旧图归档

V18 不覆盖、不移动、不删除旧图片。v3–v7 版本目录继续保留原文件，`assets/archive/pre-v18-images.json` 记录切换前 55 个现役图片引用的路径、像素尺寸、文件大小和 SHA-256。这样既能回滚，也能追溯每张 V18 图片对应的旧构图。

归档清单由下列命令重建：

```powershell
$env:PYTHONUTF8="1"
python tools\build-v18-archive-manifest.py
```

单张 ImageGen 输出的 4K 和响应式版本由下列命令生成：

```powershell
$env:PYTHONUTF8="1"
python tools\build-v18-images.py --input ".tmp\v18-generated\hero-peek.png" --name "hero-peek" --kind portrait --prompt-file "assets\v18\prompts\hero-peek.txt"
```

## 验收边界

- 同一角色在人物、换装、画廊与陪画场景中能够被立即认出。
- 表情差异来自眉眼、嘴型、脸红和动作，而不是只改变颜色。
- 人物手部、画笔、数位板、衣架、门边与玩偶接触关系合理。
- 画桌五个热点和窗雨多边形必须重新对照新图检查。
- 390、1024、1440 三档不变形、不溢出，手机不会请求 4K 母版。
- 图片缺失时仍保留现有文字和互动降级。
- 所有现役 V18 图片均有 4K 母版、响应式版本、精确提示词和来源边车。
