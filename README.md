# 和泉纱雾的小小画室

一个零框架、无后端、无运行时外部服务的个人非商业同人网站。V20「走进纱雾的日常」把重复的长页面改为同一间房的全景与近景：纱雾和房间是主体，界面只负责让你轻轻靠近、说一句话、一起完成一件小事。

访问地址：<https://xinchenok.github.io/izumi-sagiri-room/>

## 当前版本与发布状态

当前代码版本 `20.0.1`，缓存标识 `20260909-v20-2`。本补丁专门[补回剧情式陪画互动](docs/v20-drawing-restoration.md)：专属回应、遮稿纸、陪伴阶段、已选标记和完整作品回忆。全量回归共 65 项；最新部署结果见 [GitHub Actions](https://github.com/xinchenok/izumi-sagiri-room/actions)。

V20.0.0 的独立审查与首次发布记录保留在[发布凭证](docs/v20-release-receipt.json)。逐像素工具流程 F1 仍未闭环，未宣称全部工具全绿；该历史凭证也不等于旧版功能已逐项迁移完整。

## 房间里可以做什么

- 在房间全景、画桌、衣橱、床边和窗边自由移动；原生滚动不被劫持，地点也不靠滚动自动切换。
- 五套日常服装贯穿人物的站立、害羞、眨眼、画画、持画册和抱玩偶姿态；画廊里的十一张收藏作品保留原有构图和服装，不冒充当前镜头。
- 选择三段小日常：一起画小猫、认真选衣服、说说画册里喜欢的细节。可以退出或继续，不以倒计时、积分、签到或好感度制造停留。
- 共同创作提供三个主题 × 三种真实配色，共九张清爽小猫作品；换配色真正换图，不再只用 CSS 染纸。独立膝上画板承接笔尖和稿纸，角色本身不被重绘。
- [直接陪她画画](https://xinchenok.github.io/izumi-sagiri-room/#drawing-story)：选项有专属回应，偷看会被盖住稿纸，安静陪伴可随时继续或暂停，已选项和完整回忆不会丢失。
- 继续真实保存的未完成稿，查看共同成稿、五个桌面秘密、回访记忆与晚安纸条；不清空旧版有效记录，不编造共同经历。
- 使用统一观察器放大房间或作品；支持拖动、滚轮、双指、双击、方向键、复位与 Esc，关闭后还原焦点和页面位置。
- 先选择有声或安静进入，再控制角色语音、物件拟音和环境声。只有雨天且明确开启声音时持续播放真实窗雨；晴天不循环关窗等短音。
- “让房间静一静”只控制动态，不等同于静音；系统减少动态效果优先。语音始终配日文与简体中文字幕，失败不回退系统 TTS。
- JavaScript 不可用时，仍能阅读介绍、五套服装、十一页画廊、共同创作、秘密、晚安和来源说明，共二十张本地小尺寸插画。

## 本地浏览与检查

可以直接打开 `index.html`；本轮已验证本地 `file://` 路径。维护时推荐使用仓库自带的本地静态服务器：

```powershell
node tests\support\static-server.mjs
```

然后打开 <http://127.0.0.1:4173/>。浏览页面不需要安装 Python、语音模型或服务器端依赖。

自动维护检查使用 Node.js 22 或更高版本：

```powershell
npm ci
npx playwright install chromium
npm test
```

资产检查核对 45 个人物母图记录、135 张透明人物 WebP、8 张日夜房间 WebP、9 张实际配色作品及 36 个 WebP、3 个画板 WebP、24 句新配音、4 份字体子集与 809 份旧素材保留凭证。真实浏览器本地测量的冷加载 playing 事件为约 134ms，三次缓存重播为 13–14ms，字幕先即时显示；这不是扬声器端到端延迟或主观听感保证。

新增作品另有 9 张母图、36 个 WebP，可用 `python tools/build-v20-drawings.py --verify` 在有 Pillow 的制作环境中核验。膝上画板另提供 720／1440／4K 三份透明 WebP，来源与尺寸记录在 `assets/v20/props/lap-drawing-board-manifest.json`；它是一个共享道具的三档资源，不是三张不同画板。

## 实现与素材

内容集中在 `script.js` 的 `CONTENT`；`room-core.js` 管理状态、资源缓存和三路声音，`room.js` 管理地点、角色回应与日常，`room-inspector.js` 与 `inspector.css` 提供统一观察器。持久状态沿用 `sagiri-room-state-v2`，保留旧有效字段和未知扩展字段，并迁移 v1 的服装与秘密。

V20 使用已批准方案 A 的最初床位。五套衣服各九态，共 45 张内置 ImageGen 原生绿幕图，经 FFmpeg 色键封装为真实透明层；135 个响应式 WebP 与两张日夜背景的 8 个 WebP 保存精确提示词、尺寸和指纹。**V20 所有 4K 档均为等比放大导出，不是原生 4K 生图。**

九张新作品按 `CONTENT.roomExperience.artworks[subject][palette]` 选择图片。旧成稿、旧未完成稿补记 `artVersion: "v18"` 并继续使用旧图；新建稿纸使用 `artVersion: "v20"`，完成后保留版本标记，避免把以前共同画过的作品偷偷替换成新版画风。旧三张小猫图与十一张画廊不删除。

现役角色声线统一为 Piper Plus「つくよみちゃん」；新增 24 句日语配音，继续使用固定预训练模型，没有训练、微调、参考声纹或原声优克隆。旧 AivisSpeech 文件仅保留为历史资源，不混入现役播放。

正文、日文字幕与短标题分别使用本地 Noto Sans CJK SC、Noto Sans CJK JP 和霞鹜文楷子集；房间名另用仅五字的 Long Cang 手写子集。四者附 SIL OFL 1.1 许可。旧字体、旧画稿、旧音频和复核现场均未清理。

## 文档入口

- [V20 实现、素材与复现](docs/v20-room-redesign.md)：当前架构、状态、资源、声音、验证边界与发布流程。
- [产品定位](PRODUCT.md)与[设计规范](DESIGN.md)：体验原则和界面职责。
- [AI 协作开发与维护手册](docs/ai-assisted-development.md)：V20 决策、工具限制与历代记录。
- [V20 配音来源](assets/audio/v20/VOICE-SOURCES.md)、[逐句清单](assets/audio/v20/voice-manifest.json)、[字体清单](assets/fonts/v20/font-manifest.json)。
- [九张作品与真实配色映射](assets/v20/drawings/drawings-manifest.json)、[共享膝上画板](assets/v20/props/lap-drawing-board-manifest.json)。
- [旧素材保留凭证](assets/archive/pre-v20-assets.json)：基线 `e5062e9` 的 809 份原资产。
- [V19 房间](docs/v19-cinematic-room.md)、[V19 声音](docs/v19-voice-reproduction.md)和[V18 插画](docs/v18-4k-image-redraw.md)：历史复现，不是 V20 当前界面合同。

本项目非官方、个人非商业；角色相关权利归原权利人所有，不代表原作版权方、模型提供者或声优的官方立场。模型、语料、字体和拟音分别遵循其来源条款，完整署名保留在页面页脚与素材记录中。
