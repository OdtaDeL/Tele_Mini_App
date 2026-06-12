import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Skeleton from '../components/ui/Skeleton';

export default function LearnPage() {
  const navigate = useNavigate();
  const { 
    state, 
    getModuleProgress, 
    getLessonStatus, 
    getCompletedLessonsCount, 
    getCompletedModulesCount 
  } = useApp();

  const sortedModules = [...state.modules].sort((a, b) => a.order - b.order);
  const [expanded, setExpanded] = useState<string | null>(sortedModules[0]?.id || null);

  const completedLessons = getCompletedLessonsCount();
  const totalLessons = state.lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const completedModules = getCompletedModulesCount();

  if (state.isLoading) {
    return (
      <div className="page page-top pb-28">
        {/* ── Curriculum Header Skeleton ── */}
        <div className="mb-8">
          <Skeleton width="70px" height="10px" style={{ marginBottom: 8 }} />
          <Skeleton width="180px" height="28px" style={{ marginBottom: 8 }} />
          <Skeleton width="240px" height="14px" />
        </div>

        {/* ── Stark Progress Dashboard Skeleton ── */}
        <div className="mb-10">
          <div className="flex justify-between items-baseline mb-2">
            <Skeleton width="90px" height="10px" />
            <Skeleton width="30px" height="10px" />
          </div>
          <Skeleton width="100%" height="2px" borderRadius="0px" style={{ marginBottom: 8 }} />
          <div className="flex justify-between">
            <Skeleton width="80px" height="10px" />
            <Skeleton width="60px" height="10px" />
          </div>
        </div>

        {/* ── Flat List-Based Course Directory Skeleton ── */}
        <div className="flex flex-col divide-y divide-border-subtle/40 border-t border-b border-border-subtle/40">
          {[1, 2, 3].map((n) => (
            <div key={n} className="py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton width="20px" height="14px" />
                <Skeleton width="60%" height="14px" />
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <Skeleton width="30px" height="12px" />
                <Skeleton width="10px" height="14px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page page-top pb-28">
      {/* ── Curriculum Header ── */}
      <div className="mb-8 a-fadeUp">
        <p className="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase text-text-3 mb-2">
          Curriculum
        </p>
        <h1 className="text-3xl font-bold tracking-[-0.04em] leading-tight text-text-1">
          Learning Path
        </h1>
        <p className="text-sm text-text-2 mt-2 leading-relaxed max-w-[45ch]">
          Master the curriculum step-by-step. Select a module to view lessons.
        </p>
      </div>

      {/* ── Stark Progress Dashboard ── */}
      <div className="mb-10 a-fadeUp d-1">
        <div className="flex justify-between items-baseline mb-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-text-3">
            Overall Completion
          </span>
          <span className="font-mono text-xs font-bold text-accent">
            {overallProgress}%
          </span>
        </div>
        
        {/* Thin, flat, non-rounded 2px progress bar */}
        <div className="w-full h-[2px] bg-border-subtle overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-700 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 font-mono text-[0.65rem] text-text-3">
          <span>{completedLessons} / {totalLessons} Lessons Done</span>
          <span>{completedModules} / {sortedModules.length} Modules</span>
        </div>
      </div>

      {/* ── Flat List-Based Course Directory ── */}
      <div className="flex flex-col divide-y divide-border-subtle/40 border-t border-b border-border-subtle/40 a-fadeUp d-2">
        {sortedModules.map((mod) => {
          const progress = getModuleProgress(mod.id);
          const isOpen = expanded === mod.id;
          const complete = progress === 100;
          const lessons = state.lessons
            .filter(l => l.module_id === mod.id)
            .sort((a, b) => a.order - b.order);
          const doneCount = lessons.filter(l => getLessonStatus(l.id) === 'completed').length;

          return (
            <div key={mod.id} className="overflow-hidden">
              {/* Module Header Row */}
              <button
                onClick={() => setExpanded(isOpen ? null : mod.id)}
                className="w-full py-5 text-left transition-all active:scale-[0.99] flex items-center justify-between group gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Monospaced Index */}
                  <span className="font-mono text-xs font-bold text-accent min-w-[20px]">
                    {String(mod.order).padStart(2, '0')}
                  </span>
                  {/* Title */}
                  <span className="text-sm font-bold text-text-1 group-hover:text-accent transition-colors truncate">
                    {mod.title}
                  </span>
                  {/* Stark Completion Tag */}
                  {complete && (
                    <span className="font-mono text-[0.55rem] text-accent tracking-widest border border-accent/20 bg-accent/5 px-1 py-0.5 rounded-sm uppercase select-none">
                      DONE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Progress Fraction */}
                  <span className="font-mono text-xs text-text-3">
                    {doneCount}/{lessons.length}
                  </span>
                  {/* Typographic Toggle Control */}
                  <span className="font-mono text-sm text-text-2 group-hover:text-accent select-none w-4 text-center">
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
              </button>

              {/* Indented Lessons List */}
              {isOpen && (
                <div className="pl-8 pb-5 flex flex-col gap-3.5 a-slideDown">
                  {lessons.map((lesson, li) => {
                    const status = getLessonStatus(lesson.id);
                    const done = status === 'completed';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        className="w-full text-left flex items-center justify-between transition-all active:scale-[0.98] group/item gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Monospace Lesson Index */}
                          <span className="font-mono text-[0.7rem] text-text-3 min-w-[28px]">
                            {String(mod.order).padStart(2, '0')}.{li + 1}
                          </span>
                          {/* Title */}
                          <span className="text-xs font-medium text-text-2 group-hover/item:text-accent transition-colors truncate">
                            {lesson.title}
                          </span>
                        </div>

                        {/* Typographic status or action */}
                        {done ? (
                          <span className="font-mono text-[0.55rem] text-accent/80 tracking-wider flex-shrink-0">
                            ✓
                          </span>
                        ) : (
                          <span className="font-mono text-[0.55rem] text-text-4 tracking-wider flex-shrink-0 group-hover/item:text-accent">
                            START
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
