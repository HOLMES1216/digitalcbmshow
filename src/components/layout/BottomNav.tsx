import React from 'react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  currentPage: number;
  caseStage?: string | null;
  onGoTo: (page: number, stage?: string) => void;
}

const STEPS = [
  { id: 'data', page: 3, label: 'Data', index: 0 },
  { id: 'unify', page: 4, label: 'Unify', index: 1 },
  { id: 'insight', page: 5, label: 'Insight', index: 2, stage: 'insight' },
  { id: 'decide', page: 5, label: 'Decide', index: 3, stage: 'decide' },
  { id: 'act', page: 6, label: 'Act', index: 4, stage: 'act' },
  { id: 'improve', page: 6, label: 'Improve', index: 5, stage: 'improve' },
];

export function BottomNav({ currentPage, caseStage, onGoTo }: BottomNavProps) {
  if (currentPage < 3 || currentPage > 6) return null;

  // Highlight follows both the page and the page-internal stage
  let activeStepIndex = 0;
  if (currentPage === 3) activeStepIndex = 0;
  if (currentPage === 4) activeStepIndex = 1;
  if (currentPage === 5) activeStepIndex = caseStage === 'decide' ? 3 : 2;
  if (currentPage === 6) activeStepIndex = caseStage === 'improve' ? 5 : 4;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-[#001a45] border-t border-[#2f6fbf]/40 flex items-center justify-center z-50">
      <div className="flex items-center gap-1 rounded-full border border-[#2f6fbf]/40 bg-[#072457] p-1.5 shadow-lg shadow-black/30">
        {STEPS.map((step) => {
          const isActive = activeStepIndex === step.index;

          return (
            <button
              key={step.id}
              onClick={() => onGoTo(step.page, step.stage)}
              className={cn(
                "px-5 h-10 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all focus:outline-none",
                isActive
                  ? "bg-[#1d5aa8] text-white"
                  : "text-[#7fa3c7] hover:text-white hover:bg-[#1d5aa8]"
              )}
            >
              {step.label}
            </button>
          );
        })}
      </div>
    </footer>
  );
}
