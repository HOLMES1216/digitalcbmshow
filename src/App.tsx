import React, { useState, useEffect } from 'react';
import { useAutoPlay } from './hooks/useAutoPlay';
import { PageContainer } from './components/layout/PageContainer';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { Drawer } from './components/ui/drawer';

// Pages
import { S0Standby } from './pages/S0_Standby';
import { S1Home } from './pages/S1_Home';
import { S2Intro } from './pages/S2_Intro';
import { S3Data } from './pages/S3_Data';
import { S4Unify } from './pages/S4_Unify';
import { S5Insight } from './pages/S5_Insight';
import { S6Act } from './pages/S6_Act';
import { S7CTA } from './pages/S7_CTA';
import { DoorService } from './pages/DoorService';
import { BrakeLandscape } from './pages/S9_BrakeLandscape';
import { ArchitecturePage } from './pages/S13_Architecture';
import { MegaMenu } from './components/ui/MegaMenu';
import { DTDOverlay } from './components/ui/DTDOverlay';

// Drawers
import { 
  AIBasisContent, 
  BusinessValueContent,
  BrakeMoreContent,
  RealtimeDataContent,
  HistoryDataContent,
  MaintenanceDataContent
} from './drawers/Drawers';

// Page Timings (in ms)
const PAGE_DURATIONS: Record<number, number> = {
  1: 7000,
  2: 7000,
  3: 15000,
  4: 15000,
  5: 18000,
  6: 20000,
  7: 10000,
};

// Interactive kiosk stage: always render at 1920x1080 and scale to fit,
// so the picture keeps a 16:9 aspect ratio no matter the window size.
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

function useStageScale() {
  const [scale, setScale] = useState(() =>
    Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT)
  );

  useEffect(() => {
    const onResize = () =>
      setScale(Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return scale;
}

export default function App() {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [currentPageState, setCurrentPageState] = useState(0);
  const [caseStage, setCaseStage] = useState<string | null>(null);
  const [stageRequest, setStageRequest] = useState<{ stage: string; token: number } | null>(null);

  const {
    currentPage,
    isPlaying,
    goTo,
    togglePlay,
    advance,
    prev
  } = useAutoPlay({
    pageDurations: PAGE_DURATIONS,
    totalPages: 8,
    timeoutMs: currentPageState === 7 ? 120000 : 90000, // CTA page allows 120s before standby
    paused: videoPlaying, // video playback suspends auto-advance and inactivity reset
    onTimeout: () => {
      setActiveDrawer(null);
    }
  });

  // Reset video-playing flag whenever the page changes
  useEffect(() => {
    setCurrentPageState(currentPage);
    setVideoPlaying(false);
    setCaseStage(null);
    // Consume-stage requests are one-shot: pages read them on mount (child
    // effects run first), then they are cleared here so stale requests never
    // re-fire on later remounts.
    setStageRequest(null);
  }, [currentPage]);

  // Drawers auto-close after 60s
  useEffect(() => {
    if (!activeDrawer) return;
    const t = setTimeout(() => setActiveDrawer(null), 60000);
    return () => clearTimeout(t);
  }, [activeDrawer]);

  const closeDrawer = () => { setActiveDrawer(null); setVideoPlaying(false); };
  const openDrawer = (id: string) => setActiveDrawer(id);
  const handleVideoState = (playing: boolean) => setVideoPlaying(playing);
  const stageScale = useStageScale();
  const [archOrigin, setArchOrigin] = useState(1);
  const openArchitecture = () => { setArchOrigin(currentPage); goTo(13); };

  const renderPage = () => {
    switch (currentPage) {
      case 0: return <S0Standby onStart={() => goTo(1)} />;
      case 1: return <S1Home onOpenCase={() => goTo(2)} onOpenBrake={() => goTo(9)} onOpenDoor={() => goTo(8)} />;
      case 2: return <S2Intro onNext={advance} />;
      case 3: return <S3Data onNext={advance} onOpenDTD={() => openDrawer('dtd')} onOpenData={(t) => openDrawer(`d_${t}`)} onVideoState={handleVideoState} />;
      case 4: return <S4Unify onNext={advance} onOpenArchitecture={openArchitecture} />;
      case 5: return <S5Insight onNext={advance} onOpenBasis={() => openDrawer('ai_basis')} onVideoState={handleVideoState} onStageChange={setCaseStage} requestedStage={stageRequest} />;
      case 6: return <S6Act onNext={advance} onVideoState={handleVideoState} onStageChange={setCaseStage} requestedStage={stageRequest} />;
      case 7: return <S7CTA onRestart={() => goTo(1)} onOpenBrake={() => goTo(9)} onOpenDoor={() => goTo(8)} onOpenArchitecture={openArchitecture} />;
      case 8: return <DoorService onBack={() => goTo(1)} />;
      case 9: return <BrakeLandscape onBack={() => goTo(1)} onOpenCase={() => goTo(2)} onOpenMore={() => openDrawer('brake_more')} />;
      case 13: return <ArchitecturePage onBack={() => goTo(archOrigin === 13 ? 1 : archOrigin)} onHome={() => goTo(1)} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000a1f] overflow-hidden font-sans select-none flex items-center justify-center">
      <div
        className="relative shrink-0 bg-[#002b6b] overflow-hidden"
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${stageScale})` }}
      >
      {/* Standby page doesn't show TopBar or BottomNav */}
      {currentPage > 0 && (
        <TopBar 
          currentPage={currentPage}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onHome={() => { closeDrawer(); setMoreOpen(false); goTo(1); }}
          onMore={() => setMoreOpen(true)}
          onPrev={prev}
          onNext={advance}
          onOpenLandscape={() => goTo(9)}
        />
      )}

      <PageContainer id={currentPage}>
        {renderPage()}
      </PageContainer>

      {/* Manual-browse hint after user takes over */}
      {currentPage > 1 && currentPage < 8 && !isPlaying && (
        <div className="fixed top-20 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="flex items-center gap-3 px-5 py-1.5 bg-[#072457] border border-[#2f6fbf]/40 border-t-0 rounded-b-xl text-xs text-blue-100/80 font-medium pointer-events-auto">
            已切换为手动浏览
            <button onClick={togglePlay} className="text-[#8fc1ff] font-bold hover:text-white transition-colors">
              继续自动播放
            </button>
          </div>
        </div>
      )}

      <BottomNav 
        currentPage={currentPage}
        caseStage={caseStage}
        onGoTo={(page, stage) => { closeDrawer(); goTo(page); if (stage) setStageRequest({ stage, token: Date.now() }); }} 
      />

      {/* Drawers */}
      <Drawer isOpen={activeDrawer === 'd_realtime'} onClose={closeDrawer} title="实时或近实时数据" width="w-[50%]">
        <RealtimeDataContent />
      </Drawer>
      <Drawer isOpen={activeDrawer === 'd_history'} onClose={closeDrawer} title="历史运行数据" width="w-[50%]">
        <HistoryDataContent />
      </Drawer>
      <Drawer isOpen={activeDrawer === 'd_maintenance'} onClose={closeDrawer} title="维修与业务数据" width="w-[50%]">
        <MaintenanceDataContent />
      </Drawer>
      <Drawer isOpen={activeDrawer === 'ai_basis'} onClose={closeDrawer} title="分析依据">
        <AIBasisContent />
      </Drawer>
      <Drawer isOpen={activeDrawer === 'value'} onClose={closeDrawer} title="业务价值">
        <BusinessValueContent />
      </Drawer>
      <Drawer isOpen={activeDrawer === 'brake_more'} onClose={closeDrawer} title="同一 CBM 方法，适用于更多制动系统场景">
        <BrakeMoreContent />
      </Drawer>

      {/* DTD full-screen video overlay */}
      <DTDOverlay isOpen={activeDrawer === 'dtd'} onClose={closeDrawer} onVideoState={handleVideoState} />

      {/* Top "More" mega menu */}
      <MegaMenu
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        onGoTo={(page) => { closeDrawer(); goTo(page); }}
        onOpenDrawer={openDrawer}
      />
      </div>
    </div>
  );
}
