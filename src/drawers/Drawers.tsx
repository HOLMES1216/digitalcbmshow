import React, { useState } from 'react';
import {
  Activity, ShieldCheck, Cpu, Target, CheckCircle2,
  Gauge, TrendingUp, AlertTriangle, SearchCheck,
  Database, ScanSearch, UserCheck,
  LayoutDashboard, BrainCircuit, PlugZap, Radio,
  Users, History
} from 'lucide-react';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

export function DTDDetailsContent({ onVideoState }: { onVideoState?: (playing: boolean) => void }) {
  const [videoEnded, setVideoEnded] = useState(false);

  const tags = ['标准化现场任务', '专业检测', '数字化记录', '授权历史日志获取', '数据上传', '全程可追溯'];

  return (
    <div className="space-y-6">
      <div className="w-full h-48 mb-2">
        <VideoPlaceholder 
          id="V3" 
          title="DTD检测演示 (DTD Demo)" 
          durationMs={20000} 
          autoPlay={false}
          onEnded={() => setVideoEnded(true)}
          onPlayingChange={onVideoState}
          className="w-full h-full"
        />
      </div>
      <div className="text-[11px] text-[#7fa3c7] font-medium">点击播放 · 默认静音 · 约20秒</div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="px-2.5 py-1 bg-[#1d5aa8]/40 border border-[#2f6fbf]/40 text-[#8fc1ff] text-[11px] font-bold rounded-full">{t}</span>
        ))}
      </div>

      <p className="text-blue-100/80 font-medium">
        DTD支持标准化现场检测和任务执行；在系统授权与接口支持的条件下，还可获取设备或监控终端中的历史运行数据和日志，为CBM分析补充更完整的状态证据。
      </p>
      <p className="text-sm text-[#8fc1ff] font-bold">
        DTD是CBM多源数据体系中的重要现场工具，但不是唯一的数据来源。
      </p>
      
      <div className="space-y-4 mt-6">
        <h4 className="font-bold text-white mb-2 border-b border-[#2f6fbf]/40 pb-2">核心能力</h4>
        <div className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40 flex items-start space-x-3 shadow-sm">
          <Activity className="w-5 h-5 text-[#E2001A] mt-0.5" />
          <div>
            <div className="font-bold text-white">专业检测与数据记录</div>
            <div className="text-sm text-blue-100/80 mt-1 font-medium">支持标准化现场任务，记录高频振动、声音、温度等高质量证据。</div>
          </div>
        </div>
        <div className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40 flex items-start space-x-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#E2001A] mt-0.5" />
          <div>
            <div className="font-bold text-white">授权终端日志获取</div>
            <div className="text-sm text-blue-100/80 mt-1 font-medium">支持离线或安全提取监控终端历史日志，丰富状态数据维度。</div>
          </div>
        </div>
        <div className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40 flex items-start space-x-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-[#E2001A] mt-0.5" />
          <div>
            <div className="font-bold text-white">数据上传和追溯</div>
            <div className="text-sm text-blue-100/80 mt-1 font-medium">检测结果与运行数据同步上传至CBM平台，形成完整闭环追溯。</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-[#7fa3c7] font-medium border-t border-[#2f6fbf]/40 pt-4">
        数据获取范围取决于设备接口、系统授权和项目配置。
      </div>
    </div>
  );
}

export function TrendEvidenceContent() {
  return (
    <div className="space-y-6">
      <p className="text-blue-100/80 font-medium border-l-4 border-[#E2001A] pl-4">
        数据汇总证明：设备正在经历缓慢但持续的状态偏离。
      </p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-[#072457] p-4 rounded-lg border border-[#2f6fbf]/40 shadow-sm">
          <div className="text-xs font-bold text-[#7fa3c7] mb-1 uppercase tracking-wider flex items-center"><Gauge className="w-3.5 h-3.5 mr-1 text-[#8fc1ff]" />健康基线</div>
          <div className="text-green-400 font-bold">稳定参考区间 established</div>
        </div>
        <div className="bg-[#072457] p-4 rounded-lg border border-[#2f6fbf]/40 shadow-sm">
          <div className="text-xs font-bold text-[#7fa3c7] mb-1 uppercase tracking-wider flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1 text-[#8fc1ff]" />历史趋势</div>
          <div className="text-orange-400 font-bold">振动指标上升趋势持续30天</div>
        </div>
        <div className="bg-[#072457] p-4 rounded-lg border border-[#E2001A]/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#E2001A]" />
          <div className="text-xs font-bold text-[#7fa3c7] mb-1 uppercase tracking-wider flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1 text-[#E2001A]" />当前状态</div>
          <div className="text-[#E2001A] font-bold">超出预警阈值 15%</div>
        </div>
        <div className="bg-[#072457] p-4 rounded-lg border border-[#2f6fbf]/40 shadow-sm">
          <div className="text-xs font-bold text-[#7fa3c7] mb-1 uppercase tracking-wider flex items-center"><SearchCheck className="w-3.5 h-3.5 mr-1 text-[#8fc1ff]" />DTD检测证据</div>
          <div className="text-blue-300 font-bold">确认轴承频段异常</div>
        </div>
      </div>
    </div>
  );
}

export function AIBasisContent() {
  const groups = [
    {
      title: '输入',
      icon: Database,
      items: ['状态数据', '历史趋势', '设备上下文', '维修知识'],
    },
    {
      title: '分析',
      icon: ScanSearch,
      items: ['基线比较', '趋势识别', '规则判断', '模型分析', '知识关联'],
    },
    {
      title: '输出',
      icon: CheckCircle2,
      items: ['状态结论', '趋势证据', '关注等级', '维护建议', '行动优先级'],
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center border-b border-[#2f6fbf]/40 pb-2"><Cpu className="w-5 h-5 mr-2 text-[#E2001A]"/> AI辅助分析依据 AI-Assisted Analysis Basis</h3>
      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.title} className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40 shadow-sm">
            <div className="font-bold text-white text-sm mb-3 flex items-center"><g.icon className="w-4 h-4 mr-2 text-[#8fc1ff]" />{g.title}</div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span key={it} className="px-2.5 py-1 bg-[#072457] border border-[#2f6fbf]/40 rounded-full text-xs text-blue-100/80 font-medium">{it}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="bg-[#0a2a5e] p-4 rounded-lg border border-yellow-500/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
          <div className="font-bold text-yellow-300 text-sm mb-2 flex items-center"><UserCheck className="w-4 h-4 mr-2 text-[#8fc1ff]" />人工确认机制 (Human in the Loop)</div>
          <p className="text-sm text-blue-100/80 font-medium">AI提供辅助分析和决策支持，最终维护行动可由授权人员确认。</p>
        </div>
      </div>
    </div>
  );
}

export function ArchitectureContent() {
  return (
    <div className="space-y-4">
      {[
        { level: "第五层", name: "业务应用与执行层", desc: "Condition Overview, Fleet Dashboard, Work Orders, Mobile Execution, Reports", icon: LayoutDashboard },
        { level: "第四层", name: "分析与AI层", desc: "Health Baseline, Trend Analysis, Anomaly Detection, Predictive Models, AI Agent", icon: BrainCircuit },
        { level: "第三层", name: "CBM数据与编排平台", desc: "Asset Data Model, Time-Series Data, Maintenance History, Knowledge Base", icon: Database },
        { level: "第二层", name: "数据接入与治理层", desc: "Streaming/Batch Ingestion, Data Validation, Contextualization, Security", icon: PlugZap },
        { level: "第一层", name: "多源数据层", desc: "Real-time Sensors, Historical Logs, Field Inspection (DTD), Maintenance Records", icon: Radio }
      ].map((layer, idx) => (
        <div key={idx} className="bg-[#072457] p-4 rounded-xl border border-[#2f6fbf]/40 flex flex-col shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <layer.icon className="w-4 h-4 text-[#8fc1ff]" />
            <span className="text-[10px] bg-[#1d5aa8]/40 text-[#8fc1ff] px-2 py-1 rounded uppercase tracking-widest font-bold">{layer.level}</span>
            <span className="font-bold text-white">{layer.name}</span>
          </div>
          <div className="text-sm text-blue-100/80 font-medium pl-1">{layer.desc}</div>
        </div>
      ))}
      <div className="pt-4 mt-4 border-t border-[#2f6fbf]/40">
        <div className="text-xs text-[#7fa3c7] font-bold mb-2 uppercase tracking-wider">横向支撑能力</div>
        <div className="flex flex-wrap gap-2 text-xs text-blue-100/80 font-bold">
          <span className="bg-[#0a2a5e] px-2 py-1 rounded border border-[#2f6fbf]/40 flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-[#8fc1ff]" />网络与数据安全</span>
          <span className="bg-[#0a2a5e] px-2 py-1 rounded border border-[#2f6fbf]/40 flex items-center"><Users className="w-3 h-3 mr-1 text-[#8fc1ff]" />用户与权限</span>
          <span className="bg-[#0a2a5e] px-2 py-1 rounded border border-[#2f6fbf]/40 flex items-center"><History className="w-3 h-3 mr-1 text-[#8fc1ff]" />审计与追溯</span>
        </div>
      </div>
    </div>
  );
}

export function BusinessValueContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-6 border-b border-[#2f6fbf]/40 pb-2">让维护更早、更准、更可控。</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[#072457] p-4 rounded-xl border border-[#2f6fbf]/40 shadow-sm">
          <div className="flex items-center text-white font-bold mb-2"><Target className="w-4 h-4 mr-2 text-[#E2001A]"/> 更早识别</div>
          <p className="text-sm text-blue-100/80 font-medium">在故障前识别值得关注的状态变化，避免非计划停机。</p>
        </div>
        <div className="bg-[#072457] p-4 rounded-xl border border-[#2f6fbf]/40 shadow-sm">
          <div className="flex items-center text-white font-bold mb-2"><Target className="w-4 h-4 mr-2 text-[#E2001A]"/> 更完整理解</div>
          <p className="text-sm text-blue-100/80 font-medium">结合不同来源和时间的数据理解设备状态，告别数据孤岛。</p>
        </div>
        <div className="bg-[#072457] p-4 rounded-xl border border-[#2f6fbf]/40 shadow-sm">
          <div className="flex items-center text-white font-bold mb-2"><Target className="w-4 h-4 mr-2 text-[#E2001A]"/> 更有依据规划</div>
          <p className="text-sm text-blue-100/80 font-medium">支持维护窗口、人员、任务和备件安排，优化生命周期成本(LCC)。</p>
        </div>
        <div className="bg-[#072457] p-4 rounded-xl border border-[#2f6fbf]/40 shadow-sm">
          <div className="flex items-center text-white font-bold mb-2"><Target className="w-4 h-4 mr-2 text-[#E2001A]"/> 更高效执行</div>
          <p className="text-sm text-blue-100/80 font-medium">将状态洞察连接到工单与现场行动，形成数据驱动闭环。</p>
        </div>
      </div>
    </div>
  );
}

export function BrakeMoreContent() {
  const scenarios = [
    {
      title: '制动控制与制动柜',
      desc: '关联控制状态、指令反馈、故障事件与历史日志，帮助识别控制功能和系统响应的变化。',
      scope: '制动柜、CCBII、EP2002等',
    },
    {
      title: '制动阀与气动控制',
      desc: '结合压力、动作响应、循环记录和异常事件，辅助发现响应变化、功能偏差或潜在气动问题。',
      scope: '分配阀、中继阀、控制阀等',
    },
    {
      title: '基础制动',
      desc: '结合运行里程、制动使用、现场检测和维修记录，支持磨耗状态跟踪、检查计划和维护优先级判断。',
      scope: '制动夹钳、制动缸、制动盘、闸片／闸瓦等',
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-blue-100/80 font-medium border-l-4 border-[#1d5aa8] pl-4">
        除空压机外，CBM 服务还可以根据不同制动设备的数据条件，支持制动控制、气动控制和基础制动等系统的状态监测与维护分析。
      </p>
      <div className="space-y-4">
        {scenarios.map((s) => (
          <div key={s.title} className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40">
            <div className="font-bold text-white mb-2">{s.title}</div>
            <p className="text-sm text-blue-100/80 font-medium mb-3">{s.desc}</p>
            <div className="text-xs text-[#7fa3c7] font-bold">范围举例：<span className="text-[#8fc1ff]">{s.scope}</span></div>
          </div>
        ))}
      </div>
      <div className="text-xs text-[#7fa3c7] font-medium border-t border-[#2f6fbf]/40 pt-4">
        实际服务内容由设备配置、可获得的数据、接口条件及客户维护目标共同确定。
      </div>
    </div>
  );
}

export function RealtimeDataContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">持续感知设备运行状态</h3>
      <p className="text-blue-100/80 font-medium">
        在接口与数据条件支持的情况下，CBM可接收设备实时或近实时运行数据，持续观察关键状态参数和运行事件。
      </p>
      {/* Live curve sketch */}
      <div className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40">
        <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-3">实时曲线 · 振动（演示数据）</div>
        <svg viewBox="0 0 320 80" className="w-full h-20">
          <path d="M0,50 Q20,46 40,50 T80,50 T120,48 T160,52 T200,46 T240,44 T280,38 T320,30" fill="none" stroke="#2f6fbf" strokeWidth="2" />
          <path d="M0,60 L320,60" stroke="#2f6fbf" strokeOpacity="0.3" strokeDasharray="4 4" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#072457] p-3 rounded-lg border border-[#2f6fbf]/40">
          <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-1">当前值</div>
          <div className="text-white font-bold">4.2 mm/s <span className="text-xs font-medium text-[#7fa3c7]">振动</span></div>
          <div className="text-white font-bold">72°C <span className="text-xs font-medium text-[#7fa3c7]">温度</span></div>
        </div>
        <div className="bg-[#072457] p-3 rounded-lg border border-[#2f6fbf]/40">
          <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-1">运行状态</div>
          <div className="text-emerald-300 font-bold">正常运行</div>
          <div className="text-xs text-blue-100/70 font-medium mt-1">数据更新：刚刚</div>
        </div>
      </div>
      <div className="bg-[#072457] p-3 rounded-lg border border-[#2f6fbf]/40">
        <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-2">最近事件</div>
        <div className="text-sm text-blue-100/80 font-medium">无报警事件；上次事件：常规启停记录（3天前）</div>
      </div>
    </div>
  );
}

export function HistoryDataContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">从历史数据中理解长期变化</h3>
      <p className="text-blue-100/80 font-medium">
        CBM可聚合设备、控制器或监控终端中的历史运行数据和日志，为状态基线、趋势比较和工况分析提供时间维度。
      </p>
      {/* History timeline sketch */}
      <div className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40">
        <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-3">历史时间轴 · 30天（演示数据）</div>
        <svg viewBox="0 0 320 80" className="w-full h-20">
          <path d="M0,60 L60,58 L120,55 L180,48 L240,38 L320,22" fill="none" stroke="#2f6fbf" strokeWidth="2" />
          <circle cx="120" cy="55" r="4" fill="#2f6fbf" />
          <circle cx="240" cy="38" r="4" fill="#f59e0b" />
          <circle cx="320" cy="22" r="4" fill="#f59e0b" />
        </svg>
        <div className="flex justify-between text-[10px] text-[#7fa3c7] font-medium mt-1">
          <span>基线确立</span><span>初期变化</span><span>持续偏离</span>
        </div>
      </div>
      <div className="space-y-2">
        {['事件节点：Day 15 振动微幅上升', '报警历史：90天内无故障报警', '启停记录：日均 26 次，近期增至 34 次', '运行工况：高负载时段占比上升'].map((t) => (
          <div key={t} className="bg-[#072457] p-3 rounded-lg border border-[#2f6fbf]/40 text-sm text-blue-100/80 font-medium">{t}</div>
        ))}
      </div>
    </div>
  );
}

export function MaintenanceDataContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">将状态变化与实际维护结果关联</h3>
      <p className="text-blue-100/80 font-medium">
        工单、故障记录、维修措施、部件更换和维修后验证，为状态分析提供业务上下文和结果依据。
      </p>
      {/* Work-order timeline sketch */}
      <div className="bg-[#0a2a5e] p-4 rounded-lg border border-[#2f6fbf]/40">
        <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-3">工单时间轴（演示数据）</div>
        <div className="space-y-2">
          {[
            { date: '120天前', text: '计划维护：滤芯更换，维修后振动回落 12%' },
            { date: '260天前', text: '专项检查：密封状态正常' },
            { date: '400天前', text: '大修：轴承组件更换' },
          ].map((w) => (
            <div key={w.date} className="flex items-start gap-3">
              <span className="px-2 py-0.5 bg-[#1d5aa8]/40 text-[#8fc1ff] text-[10px] font-bold rounded shrink-0">{w.date}</span>
              <span className="text-sm text-blue-100/80 font-medium">{w.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#072457] p-4 rounded-lg border border-[#2f6fbf]/40">
        <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-2">维修前后状态对比</div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs text-blue-100/70 mb-1">维修前振动</div>
            <div className="h-2 rounded-full bg-[#0a2a5e]"><div className="h-2 rounded-full bg-orange-400" style={{ width: '72%' }} /></div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-blue-100/70 mb-1">维修后振动</div>
            <div className="h-2 rounded-full bg-[#0a2a5e]"><div className="h-2 rounded-full bg-emerald-400" style={{ width: '45%' }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
