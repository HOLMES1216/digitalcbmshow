# RVS-CN Digital · 数字化 CBM 互动演示

Knorr-Bremse 数字化 CBM（Condition-Based Maintenance）展会触摸屏互动演示应用。
以 **1920×1080（16:9）** 固定舞台等比缩放适配任意屏幕，深蓝工业视觉体系，支持自动播放与人工接管。

- 两大服务领域：**制动系统 CBM** / **门系统 CBM**
- 唯一完整互动案例：**制动系统 CBM > 供风系统 > 空压机**（Data → Unify → Insight → Decide → Act → Improve）
- 技术栈：React 19 · Vite 6 · TypeScript · Tailwind CSS v4 · motion · lucide-react

---

## 页面结构

| 页面 | 内容 |
|---|---|
| P00 待机屏 | 品牌主张「汇聚数据，洞察状态，驱动行动」+ G01 全景背景，触摸进入 |
| P01 服务全景 | 一个 CBM 框架服务两大系统，50/50 双入口卡 |
| P02 案例引入 | 空压机状态监测台（实时仪表/波形/基线偏离） |
| P03 多源数据 | V2 视频 → 四通道汇聚控制台（实时/历史/DTD/维修） |
| D03 | 三类数据详情抽屉（实时/历史/维修） |
| D04 | DTD 全屏视频（V3 自动播放） |
| P04 数据汇聚 | 全幅 SVG 汇聚图：4 通道 → 6 处理节点 → 统一时间轴 |
| P05 趋势洞察 | 自动生长的趋势图（基线带/双曲线/可拖动时间轴/维度切换） |
| P06 AI 辅助决策 | V4 桥接 → 分析泳道 + 判决印章 + 基线对比 + 置信度 |
| P07 维护行动 | V5 → Web Portal 与 Mobile Mini-APP 高保真界面 + 双端同步互动 |
| P08 反馈优化 | 知识资产液罐沉淀 + 回流管道 + 业务价值 |
| P09 总结 CTA | CBM 闭环（G07）+ 两大系统 + 二维码/联系专家 |
| 服务页 | 制动系统 CBM 服务（G02）/ 门系统 CBM 服务（G05 + 车门热点） |
| 架构页 | 五层技术架构（可点击放大 / 查看数据流动画 / 返回故事） |

全局：16:9 等比舞台、手动接管提示、视频常驻控制（暂停/跳过/重播）、无操作分级复位（90s/抽屉 60s/CTA 120s）。

---

## 本地开发

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 输出 dist/
npm run lint       # tsc --noEmit
```

## Docker 部署

```bash
npm run build
docker build -t rvs-cn-digital .
docker run -d --name rvs-cn-digital --restart unless-stopped -p 8090:80 rvs-cn-digital
```

> 说明：`Dockerfile` 为 nginx 托管 `dist/` 模式（SPA 回退、静态资源 30 天 immutable 缓存）。
> 服务器拉不到 node 镜像时此模式最稳：本地构建、服务器只需 nginx。

当前线上实例：`http://117.62.232.51:8090`（容器 `rvs-cn-digital`，重启自启）。

## 图片素材

`src/assets/images/` 中的 G 系列概念图与 V 系列视频占位图均为 AI 生成（火山引擎 doubao-seedream），
并已统一转为 WebP（全站图片约 1.9MB）。产品小图（空压机/门/制动）由 V6 原图裁剪。

---

# 素材生成提示词

## 一、视频提示词（V1–V6）

### V1｜品牌总览（待机屏循环）

```text
Create a premium 20-second cinematic motion-design video for a Knorr-Bremse Digital CBM exhibition touchscreen.

The product hierarchy must be technically clear.

Begin with two top-level onboard system categories:
1. Braking System,
2. Door System.

Move into the braking system and reveal its major functional areas:
- Air Supply,
- Brake Control,
- Pneumatic Valves and Functions,
- Adhesion and Wheel-Slide Protection,
- Brake Actuation and Friction.

Within the Air Supply area, highlight the compressor as the featured interactive component. Do not present the compressor as a system parallel to the braking system.

Show multiple data sources connecting to the compressor: continuous or near-real-time operating data, historical operating logs, field inspection data and maintenance records.

The data forms a connected condition view, a gradual trend deviation, an evidence-based maintenance recommendation and a maintenance action.

Return to a high-level view showing Braking System CBM and Door System CBM as the two service areas.

Visual style: clean, professional, trustworthy rail technology; bright white and light-grey environment; restrained blue data accents and subtle red brand accents.

No embedded text, no generated logos, no AI brain, no robot, no catastrophic failure, no aggressive red alarm, and no incorrect hierarchy showing compressor, braking system and door system as equivalent categories.
```

### V2｜多源数据（P03）

```text
A sophisticated multi-source railway data convergence visualization centered on a rail air compressor unit mounted under a passenger train.
On the left, four distinct large data sources: live onboard operational signal waveforms, historical controller log archives, a portable field inspection diagnostic tablet, and maintenance service record cards.
In the center the streams are validated, time-aligned and associated with the compressor asset.
On the right they form one continuous equipment condition timeline with a clear trend and event markers.
Dark navy technical background, Knorr-Bremse-inspired blue data accents, subtle cyan stable-status light, one restrained amber attention signal, premium European industrial corporate visualization, photorealistic with restrained technical infographic overlays, 16:9, 4K, no text, no logos, no AI brain, no robot, no red emergency alarm, no exploded parts view.
```

### V3｜DTD 现场能力（D04 全屏）

```text
A field service engineer in dark workwear holding a rugged diagnostic tablet, performing a standardized inspection task on a rail air compressor and bogie area beneath a modern passenger train in a maintenance depot.
Task-based data upload visualization rises from the tablet toward a central condition platform. Professional, trustworthy rail maintenance atmosphere.
Dark navy technical background, Knorr-Bremse-inspired blue data accents, subtle cyan stable-status light, one restrained amber attention signal, premium European industrial corporate visualization, photorealistic with restrained technical infographic overlays, 16:9, 4K, no text, no logos, no AI brain, no robot, no red emergency alarm, no exploded parts view.
```

### V4｜趋势到决策桥接（P05→P06）

```text
A condition-trend-to-maintenance-decision bridge visualization for railway CBM: on the left, equipment trend curves with a green healthy baseline band gradually deviating into an amber attention zone;
the evidence flows into a transparent analysis layer where health baseline, engineering rules, maintenance knowledge and analytical models light up in sequence;
on the right a clean maintenance recommendation card forms. Transparent analytical modules, no brain imagery.
Dark navy technical background, Knorr-Bremse-inspired blue data accents, subtle cyan stable-status light, one restrained amber attention signal, premium European industrial corporate visualization, photorealistic with restrained technical infographic overlays, 16:9, 4K, no text, no logos, no AI brain, no robot, no red emergency alarm, no exploded parts view.
```

### V5｜维护行动（P07）

```text
A railway maintenance execution flow visualization in connected scenes: a digital work order being created, priority and maintenance window scheduling, spare parts confirmation,
a field engineer receiving the task on a mobile device at the train, performing the inspection, and uploading results with photos and verification data.
Clear left-to-right narrative, large scenes instead of small icons.
Dark navy technical background, Knorr-Bremse-inspired blue data accents, subtle cyan stable-status light, one restrained amber attention signal, premium European industrial corporate visualization, photorealistic with restrained technical infographic overlays, 16:9, 4K, no text, no logos, no AI brain, no robot, no red emergency alarm, no exploded parts view.
```

### V6｜服务覆盖（备用）

```text
Create a 12-second premium product-hierarchy motion-design video for a rail Digital CBM service.

Begin with the compressor as the featured interactive component.

Zoom out to show that the compressor belongs to the Air Supply area of the braking system. Include air dryers and air supply units as related Air Supply components.

Zoom out again to reveal the complete Braking System CBM landscape:
- Air Supply,
- Brake Control,
- Pneumatic Valves and Functions,
- Adhesion and Wheel-Slide Protection,
- Brake Actuation and Friction.

Within Brake Control, visually indicate integrated brake control equipment, CCB-II and EP2002 or CubeControl as representative platforms, without implying that every product is used in every project.

Then reveal Door System CBM as a second top-level service area alongside Braking System CBM.

End with two clear top-level service categories:
1. Braking System CBM,
2. Door System CBM.

The compressor must remain visibly nested within Air Supply and the braking system. Do not show the compressor as a category parallel to the braking system.

Use a clean, premium and technically credible industrial style. No embedded text, no generated logos, no unverified product details, no dramatic failure and no red emergency alarms.
```

## 二、概念图提示词（G 系列，已生成并接入）

### G01｜双系统 CBM 全景（P00/P01）

```text
A premium cinematic visualization of a modern electric passenger train viewed in three-quarter side perspective inside a clean dark industrial environment. Two system domains are subtly highlighted: the braking system beneath the train including air supply, brake control and foundation brake zones, and the passenger entrance doors along the vehicle side. Elegant blue data streams originate from both domains and converge into one central digital condition-monitoring layer, then continue toward a maintenance engineer with a tablet and a fleet operations dashboard. The image must communicate one unified condition-based maintenance service across braking and entrance systems, not a product catalogue. Realistic engineering proportions, sophisticated industrial design, dark graphite and deep navy background, Knorr-Bremse-inspired blue data accents, restrained cyan status light, small red accent only, clean negative space for headline and UI overlays, premium corporate technology aesthetic, photorealistic with subtle technical infographic elements, 16:9, 4K, no text, no logos.
```

### G02｜制动系统 CBM 服务（制动服务页）

```text
A system-level condition-based maintenance visualization for a modern rail braking system. Show a realistic passenger train in side cutaway view with four broad functional zones highlighted without excessive component detail: compressed air supply, brake control, pneumatic transmission, and foundation brake actuation at the bogies. Thin blue data lines from all four zones converge into a single unified condition timeline and a clean central health overview, then flow toward maintenance planning and field service execution. The composition must emphasize connected system condition, trend understanding, and maintenance service rather than individual products. Use large visual zones instead of many small icons. Dark navy technical background, precise industrial engineering style, subtle cyan stable-state lighting, one restrained amber attention signal, premium European corporate visualization, ample blank space for UI labels, orthographic-isometric hybrid, 16:9, 4K, no embedded text, no logo.
```

### G05｜门系统 CBM 服务（门系统服务页）

```text
A premium side-view visualization of a modern passenger train at a station platform, focusing on a row of passenger entrance doors. Most doors show subtle cyan stable-condition halos, while one door has a restrained amber attention highlight indicating a gradual performance change, not a failure. Elegant data traces visualize door opening and closing cycles, movement duration, drive behavior and event history. These data streams converge into a simple condition trend and then into a maintenance recommendation card placeholder beside a technician using a tablet. The image should communicate continuous monitoring, performance trend analysis and planned maintenance for train entrance systems. Realistic train design, calm safe station environment, dark navy and cool metallic palette, sophisticated blue digital overlays, premium industrial corporate style, generous negative space for UI and bilingual copy, 16:9, 4K, no text, no logos.
```

### G07｜统一 CBM 服务闭环（P09）

```text
A circular condition-based maintenance service ecosystem for railway systems, built around a modern train silhouette. Four large visual sectors form a continuous loop: multi-source data connection, system condition monitoring, engineering analysis and maintenance action. Braking systems and passenger entrance doors are both connected to the same service loop. Maintenance results flow back into the asset history, completing the cycle. The graphic should feel simple, authoritative and system-level, with only four major sectors, strong visual hierarchy and no embedded labels. Dark graphite background, precision blue linework, restrained cyan and amber status colors, premium European industrial technology branding, elegant flat-isometric vector style, large empty center and outer spaces for bilingual UI text, 16:9, 4K, no logo, no text.
```

### 备用提示词（未接入，可后续使用）

**G03｜四阶段服务架构**

```text
A clean horizontal industrial service architecture infographic with four large connected stages and no text. Stage one visually represents multi-source rail equipment data: live signals, historical controller logs, portable field inspection data and maintenance records. Stage two represents continuous condition monitoring with a unified train asset view and trend curves. Stage three represents engineering analysis with evidence correlation, anomaly patterns and maintenance priority assessment. Stage four represents maintenance action with planning, technician execution and post-maintenance verification. A braking system silhouette runs subtly through all four stages as the common asset context. Use only four large visual modules, connected by elegant directional data flow, dark blue background, white and electric-blue linework, cyan for normal status, restrained amber for attention, premium corporate vector-isometric style, balanced negative space for external bilingual headings, 16:9, ultra-clean, no text, no logo.
```

**G06｜门系统数据到维护行动架构**

```text
A clean four-stage visual architecture for train door condition-based maintenance, without text. First stage: passenger doors generating cycle count, opening and closing duration, drive characteristics, controller events and maintenance history. Second stage: a fleet-level view comparing door condition across multiple train cars. Third stage: trend analysis highlighting one door with gradually changing performance and correlated historical events. Fourth stage: a planned inspection and maintenance action followed by post-maintenance verification showing restored stable performance. Use four large connected scenes, not many small icons. Premium corporate infographic style, realistic technical objects combined with restrained vector overlays, dark navy background, blue and white data lines, cyan stable condition and amber attention state, clear left-to-right narrative, blank areas for external labels, 16:9, 4K, no text, no logo.
```

**G08｜多源数据到统一状态视图**

```text
A sophisticated multi-source railway data convergence visualization. On the left, four large and distinct data sources: live onboard operational signals, historical controller logs, field inspection using a portable diagnostic tablet, and maintenance service records. In the center, the streams are validated, time-aligned and associated with a single train asset model. On the right, they form one continuous equipment condition timeline with a clear trend, event markers and maintenance history. The image must emphasize that CBM uses more than inspection data and supports both real-time and historical information. Clean dark navy background, precise blue and white data flows, realistic rail equipment details, premium technical infographic, simple three-zone composition, ample space for external labels, 16:9, 4K, no text, no logos.
```

## 三、通用约束（所有生成素材统一遵守）

```text
no embedded text, no logos, no watermark beyond platform mark, no AI brain, no humanoid robot,
no red emergency alarm, no accident or failure scene, no exploded parts view, no product catalogue layout,
no unverified numbers or percentages.
```

## 四、生成接口调用示例（火山引擎 Ark / doubao-seedream）

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ARK_API_KEY>" \
  -d '{
    "model": "doubao-seedream-5-0-pro-260628",
    "prompt": "<上方任一提示词>",
    "response_format": "url",
    "size": "2K",
    "stream": false,
    "watermark": true
  }'
```

> 生成后统一用 `src/assets/images/` 存放，并压缩为 WebP（quality 82，method 6）后接入页面。
