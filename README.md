# RVS-CN Digital · 数字化 CBM 互动演示

Knorr-Bremse 数字化 CBM（Condition-Based Maintenance）展会触摸屏互动演示应用。
以 **1920×1080（16:9）** 固定舞台等比缩放适配任意屏幕，深蓝工业视觉体系，支持自动播放与人工接管。

- 两大服务领域：**制动系统 CBM** / **门系统 CBM**
- 唯一完整互动案例：**制动系统 CBM > 供风系统 > 空压机**（Data → Unify → Insight → Decide → Act → Improve）
- 技术栈：React 19 · Vite 6 · TypeScript · Tailwind CSS v4 · motion · lucide-react

## 本地开发

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 输出 dist/
npm run lint       # tsc --noEmit
```

---

# 完整的页面与交互设计

## 一、全局框架

### 1. 16:9 等比舞台
整个应用渲染在固定的 1920×1080 舞台上，通过 `transform: scale()` 按窗口尺寸等比缩放居中；窗口任意缩放画面比例不变，外围以纯色深海军蓝衬底。顶栏、底部导航、抽屉、全屏浮层全部在舞台内部随画面一起缩放。

### 2. 顶部标题栏（TopBar）
- 左侧三段式品牌标题：Knorr-Bremse / Digital CBM / Rail Vehicle Systems · 数字化状态维修；
- 案例归属标签「制动系统 · 供风系统 · 空压机」，点击展开**层级小地图**（树状图标注当前案例 + 直达制动服务页按钮）；
- 右侧：上一页/播放暂停/下一页胶囊导航组、CN/EN 语言胶囊、Home、更多（MegaMenu）、真实 Knorr-Bremse logo 白底牌；
- 进入案例流程页（P02–P09）时显示导航组与案例标签，其余页面隐藏。

### 3. 底部步骤导航（BottomNav）
Data / Unify / Insight / Decide / Act / Improve 六个胶囊步骤，点击可直接跳转到对应页面**及其内部阶段**（点 Decide 直达决策段、点 Improve 直达反馈段）；高亮随页面内部阶段实时联动。

### 4. 更多菜单（MegaMenu）
顶栏「更多」展开三栏菜单：
- **CBM 服务**：制动系统 CBM 服务、供风系统·空压机案例、门系统 CBM 服务；
- **解决方案**：多源数据、AI 辅助决策、运维闭环、业务价值、完整架构；
- **资料**：扫码获取资料、联系现场专家（均跳 P09）。

### 5. 自动播放与人工接管
- 各页面带时长配置自动推进（P02 停留 7s 等）；
- 用户任何交互后顶部出现轻提示「已切换为手动浏览｜继续自动播放」，点击恢复；
- 无操作分级复位：普通页面 90s 回待机屏、抽屉 60s 自动关闭、CTA 页 120s；
- 任何视频播放期间自动暂停推进与复位计时。

### 6. 视频系统
V2–V5 为「图片+进度模拟」占位视频（后续可替换真实视频文件），播放器常驻暂停/继续、跳过、重播控件；V3（DTD）在全屏层中打开即自动播放。

---

## 二、P00 待机屏

- 主标题「汇聚数据，洞察状态，驱动行动。/ Unify Data. Understand Condition. Drive Action.」
- 副标题：数字化 CBM 价值主张（中英）；
- 背景：G01 双系统全景概念图（45% 透明度 + 深蓝渐变），左上角真实 Knorr-Bremse logo；
- 主按钮「探索 CBM 服务 / Explore CBM Services」（呼吸动画），点击/触摸进入 P01；
- 90 秒无操作自动回到本页。

## 三、P01 CBM 服务全景

- 标题「一个 CBM 框架，服务多个关键系统。」+ 副标题；
- 左右 50/50 等宽双卡（等高对齐）：
  - **制动系统 CBM**（亮蓝）：G02 横幅图、简介、一行覆盖标签（供风｜制动控制｜气动控制｜基础制动），双按钮「查看空压机CBM案例（带 Featured 徽章）」「查看制动系统CBM服务」；
  - **门系统 CBM**（紫色）：G05 横幅图、简介、覆盖标签（门控系统｜驱动机构｜机械系统｜关键接口），单按钮「查看门系统CBM服务」；
- 卡片内容为系统级服务表达，不做产品目录式罗列。

## 四、P02 空压机案例引入

- 顶部：面包屑「制动系统 CBM > 供风系统 > 空压机案例」+ 红色 Featured Interactive Story 标签；
- 左侧 56%：**空压机状态监测台**（HMI 风格控制台）——
  - LIVE 徽章（演示数据）；
  - 蓝图网格底纹 + 十字分割线 + ASSET 刻字；
  - 四角仪器卡：排气温度（弧形仪表+实时跳变）、振动（实时读数+滚动微波形）、运行时间（12,400h + 监测秒表）、事件/维护/更新三行；
  - 中左排气压力实时条、中右占空比紫色甜甜圈；
  - 中央真实空压机产品图：60 格旋转刻度环 + 四通道彩色弧 + HUD 直角框 + 往复扫描光带；
  - 底部双通道实时滚动波形（振动/温度）；
- 右侧 44%：故事文案 → 三状态卡依次点亮（正常运行/暂无报警/趋势需关注）→「为什么需要关注」证据区（压力建立时间 +6%、启停频次 +30%、单位能耗 +4%）→ 基线偏离曲线自动生长；
- 结论条「CBM不是等待故障，而是更早识别状态变化。」+ 主按钮「查看数据来自哪里」。

## 五、P03 多源数据

- 先播放 V2 多源数据视频（14s，可跳过/重播/了解更多）；
- 结束态：**四通道汇聚控制台**——
  - 四条贝塞尔光束从四角流向中央空压机核心（描边生长 + 持续流动光点）；
  - 中心：产品图 + 旋转虚线环 + 脉冲光圈 + 「统一状态视图」LIVE 徽章；
  - 四张通道卡（弹簧入场，可点击进详情）：
    - 实时或近实时数据（内嵌实时滚动波形，→ D03 实时抽屉）；
    - 历史运行数据（内嵌迷你时间轴，→ D03 历史抽屉）；
    - DTD与现场检测（任务状态行 + 紫色脉动徽章「▶ 演示视频 · 点击播放」，→ D04 全屏视频）；
    - 维修与业务数据（内嵌工单条，→ D03 维修抽屉）；
  - 结论条「实时、历史、现场与维修数据，共同构成CBM的状态基础。」+「重播视频」+ 主按钮「汇聚数据」。

## 六、D03 数据详情抽屉（右侧 50%）

- 实时：实时曲线 SVG、当前值、运行状态、最近事件；
- 历史：30 天时间轴、事件节点、报警/启停记录；
- 维修：工单时间轴、维修前后状态对比条；
- 60 秒无操作自动关闭。

## 七、D04 DTD 全屏视频页

- 全屏纯色遮罩：标题「DTD延伸CBM的数据触点 / DTD extends CBM data access into the field.」；
- 中央宽屏 V3 视频（20s），**打开即自动播放**，播放期间主流程计时暂停；
- 下方 6 能力标签 + 说明 + 「非唯一数据来源」提示 + 免责声明；
- 出口：返回多源数据 / X 关闭。

## 八、P04 数据汇聚

- 全幅 1600×720 交互 SVG 汇聚图：
  - 左：四张数据通道卡（色条+图标+呼吸点）；
  - 中：四条贝塞尔曲线汇入渐变主管线，六个六边形处理节点（接入/校验/时间同步/标准化/设备关联/工况上下文化）依次弹簧浮现，**点击节点放大发光、全部光点暂停、左下角弹出说明卡**；
  - 右：统一设备时间轴卡（渐变竖线 + 节点行，当前状态琥珀高亮）；
- 底部 6 技术标签（Encrypted…Traceable）；
- 「查看完整架构」**直接弹出全屏精美架构图浮层**（数据流主轴 + 五层卡 + 横向支撑，可再进架构页）。

## 九、P05 趋势洞察

- 专业商务趋势图（760×360 等比坐标系，无字体失真）：
  - Y 轴 0–100 五档刻度、X 轴 Day 0–30；
  - 绿色基线带（斜纹）+ 琥珀关注区，双曲线（振动蓝/温度青，渐变面积+发光描边）+ 11 个采样点；
  - DTD 菱形、维修绿环、事件点标记；
- **曲线自动生长**：时间轴节点（历史稳定/初期变化/持续偏离/DTD专项检测/当前状态）每 1.8s 自动前进，900ms 缓动补间揭示曲线，指示线处读数卡实时插值；
- 底部 scrubber 与绘图区严格对齐，可点击/拖拽接管；
- 维度切换（综合/振动/温度/运行事件）；
- 右侧状态卡（分区：当前状态/趋势进度条/关注等级/数据证据点亮）；
- 「发现持续性趋势偏离」提示条（固定槽位无抖动）→「开始分析」进入 V4 桥接视频。

## 十、P06 AI 辅助决策

- V4 桥接（趋势证据进入分析层，可跳过）；
- 决策工作台三栏：
  - 左：图示化输入卡（波形/资产树/档案堆叠 + 就绪状态）；
  - 中：**分析泳道控制台**——6 模块逐道处理（当前泳道扫描光带、完成泳道轨道填满 + 绿勾 + 等宽量化读数：偏差 +8.2%、斜率 +0.34/d 等），蓝图底纹 + ANALYSIS 刻字，可点击展开解释；
  - 右：结果卡——RadialGauge 动画仪表（0→78，示例值）、需关注徽章、**判决印章「P2 · 计划性关注」**（分析完成瞬间弹簧砸入）、基线对比小图、三项子指标条、三条证据逐项印证、建议行动卡、置信度/完整度双条；
- 「查看趋势证据」返回 P05 详情态（不重播 V4）；「查看分析依据」开 D05 抽屉（输入/分析/输出 + 人工确认口径）；
- 主按钮「创建维护任务」。

## 十一、P07 维护行动

- V5 视频（20s）播放时底部 7 节点（建议/工单/优先级/排程/备件/现场执行/结果上传）随进度依次点亮；
- 结束态：**Web Portal + Mobile 高保真双端界面**——
  - Web Portal：浏览器框 + 侧边导航 + 面包屑「工单管理 › WO-2024-118」+ 状态胶囊 + 四 KPI 卡 + 振动趋势小图 + 任务进度时间线；
  - Mobile：手机机身 + 状态栏 + Mini-APP 头 + 工单卡 + 检查清单 + 照片上传块 + 双按钮 + 底部 Tab 栏；
  - **双端互动**：点击手机「上传结果」→ 手机上传中/清单完成/已回传 → 中间同步通道加速变绿 → Portal 滑出「收到现场回传」Toast、工单状态变「已回传」、进度项变绿勾；
- 结论「建议不是终点，执行才形成价值。」+ 主按钮进入 P08。

## 十二、P08 反馈优化

- **知识资产回流控制台**（蓝图底纹 + KNOWLEDGE REFLOW 刻字）：
  - 左：7 项上传结果依次进入 → 输送带 + 绿色「验证」戳；
  - 中：**五个知识资产液罐**（设备履历/知识库/故障数据库/分析规则/模型验证）——金属盖、液位刻度、玻璃反光、液面波浪、不同液位依次注入；
  - 下：双线回流管道（卡箍接头 + FlowDots）送回 Data 节点；
- 右侧四张价值卡（更早识别/更完整理解/更有依据规划/更高效执行，差异化图标 + 渐变边条）；
- 主按钮「查看CBM服务覆盖」。

## 十三、P09 总结与 CTA

- 标题「一种数据驱动的方法，服务更多关键系统。」；
- G07 闭环图 + 「连接数据→监测状态→分析判断→推动行动」链；
- 两大系统卡（可点击进服务页）+ 四项最终价值；
- CTA 区：二维码块（含说明）、联系数字化 CBM 专家、扫码获取解决方案、重新体验空压机案例、查看完整架构；
- 120 秒无操作回待机屏。

## 十四、系统服务页

### 制动系统 CBM 服务（服务全景）
- G02 主视觉 + 区域链标签（供风/制动控制/气动传递/基础制动）；
- 四张服务能力卡（数据连接/状态监测/分析判断/维护闭环 + 关键词）；
- 底部「可覆盖」口径声明（产品名仅作范围举例）；
- 按钮：进入空压机完整案例 / 了解更多制动场景（抽屉：三个服务场景 + 声明）/ 返回。

### 门系统 CBM 服务
- G05 主视觉：青绿车门群 + 一扇琥珀关注车门，**点击热点弹出状态浮层**（当前状态/动作趋势/最近事件/建议行动）；
- 四项服务能力卡（运行数据连接/状态监测/性能变化分析/维护计划支持）；
- 预测能力口径说明（以实际部署为准）。

## 十五、完整架构页

- 标题「连接多源数据、状态洞察与维护执行。」；
- 五层架构（多源数据/接入与治理/CBM 数据与编排平台/分析与 AI/业务应用与执行），**点击层放大并展开模块 chips，其他层弱化**；
- 「查看数据流」按钮：自下而上逐层点亮动画；
- 底部横向支撑 6 项；「返回故事」回到来源页。

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

## 二、概念图提示词（G 系列）

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

> 生成素材统一存放 `src/assets/images/`，压缩为 WebP（quality 82，method 6）后接入页面，全站图片约 1.9MB。
