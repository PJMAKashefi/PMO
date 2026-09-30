import React, { useState, useEffect } from 'react';
import {
  QuestionResponse,
  QuestionnaireItem,
  RespondentProfile,
  RoleQuestionnaire,
  Section47Response,
} from '../types';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle,
  CheckCircle2,
  Database,
  Layers,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { NavTabId } from './Header';

interface QuestionnaireSectionProps {
  questionnaire: RoleQuestionnaire;
  profile: RespondentProfile;
  responses: Record<string, QuestionResponse>;
  section47: Section47Response;
  onUpdateResponse: (questionId: string, update: Partial<QuestionResponse>) => void;
  onUpdateSection47: (update: Partial<Section47Response>) => void;
  onNavigate: (tab: NavTabId) => void;
}

const DIMENSION_METADATA: Record<string, { title: string; subtitle: string }> = {
  '4.1': {
    title: 'Core PMO Team Structure & Interfaces',
    subtitle: 'Cross-functional matrix placement, integration boundaries, and technical vs delivery prioritization.',
  },
  '4.2': {
    title: 'Departmental Software & System Inventory',
    subtitle: 'Active tooling stack checklist and system interoperability maturity across vessel build programs.',
  },
  '4.3': {
    title: 'Information, Data & Communication Flows',
    subtitle: 'MDR baseline governance, transmittals, ECN propagation, and closed-loop issue resolution.',
  },
  '4.4': {
    title: 'PMO Mandate, Authority & Operating Model',
    subtitle: 'Managing Director chartered authority, IMS float ownership, and change gating control.',
  },
  '4.5': {
    title: 'Governance, Decision-Making & Escalation',
    subtitle: 'Tiered governance rhythm, 48-hour blocker protocol, and quantitative escalation triggers.',
  },
  '4.6': {
    title: 'Bureaucracy Principles & Operational Rules',
    subtitle: 'Lean single source of truth, minimum necessary templates, and the Service Sunset rule.',
  },
  '4.7': {
    title: 'Organizational Adoption & Change Management',
    subtitle: 'Service-oriented PMO design, user co-creation, training pathways, and value retrospectives.',
  },
};

export const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({
  questionnaire,
  profile,
  responses,
  section47,
  onUpdateResponse,
  onUpdateSection47,
  onNavigate,
}) => {
  const [activeDimensionFilter, setActiveDimensionFilter] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'unanswered' | 'completed' | 'flagged'>('all');
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [attemptedSubmitWithUnanswered, setAttemptedSubmitWithUnanswered] = useState(false);

  const softwareConfig = questionnaire.softwareInventory || questionnaire.section47;

  // Distinct dimensions present
  const dimensionsList = ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7'];

  const isToolInventoryComplete = section47.selectedTools.length > 0;

  // Question calculations
  const totalRegularQuestions = questionnaire.questions.length;
  const isQuestionAnswered = (qId: string) => {
    const r = responses[qId];
    return r && (r.currentState !== undefined || r.preferredState !== undefined || r.selectedOption !== undefined);
  };
  const isQuestionFullyAnswered = (qId: string) => {
    const r = responses[qId];
    return (
      r &&
      ((r.currentState !== undefined && r.preferredState !== undefined) ||
        (r.selectedOption !== undefined && r.preferredState !== undefined))
    );
  };
  const answeredRegularCount = questionnaire.questions.filter((q) =>
    isQuestionAnswered(q.id)
  ).length;

  // Total assessment units = diagnostic questions + Section 4.2 software checklist
  const totalUnits = totalRegularQuestions + 1;
  const answeredUnits = answeredRegularCount + (isToolInventoryComplete ? 1 : 0);
  const remainingUnits = Math.max(0, totalUnits - answeredUnits);

  // Helper per dimension
  const getDimensionStats = (dimId: string) => {
    const dimQuestions = questionnaire.questions.filter((q) => q.dimensionId === dimId);
    const answeredDim = dimQuestions.filter((q) => isQuestionAnswered(q.id)).length;
    let totalDim = dimQuestions.length;
    let completedDim = answeredDim;

    if (dimId === '4.2') {
      totalDim += 1;
      if (isToolInventoryComplete) {
        completedDim += 1;
      }
    }

    const isComplete = completedDim === totalDim && totalDim > 0;
    const unansweredCount = totalDim - completedDim;
    return { totalDim, completedDim, isComplete, unansweredCount };
  };

  const handleSelectTool = (toolName: string, isChecked: boolean) => {
    if (isChecked) {
      onUpdateSection47({
        selectedTools: [...section47.selectedTools, toolName],
      });
    } else {
      onUpdateSection47({
        selectedTools: section47.selectedTools.filter((t) => t !== toolName),
      });
    }
  };

  // Prevent copy, cut, paste, and context menu across questionnaire
  const triggerCopyNotice = () => {
    setCopyToastVisible(true);
    setTimeout(() => setCopyToastVisible(false), 2400);
  };

  const handleCopyPrevent = (e: React.ClipboardEvent) => {
    e.preventDefault();
    triggerCopyNotice();
  };

  const handlePastePrevent = (e: React.ClipboardEvent) => {
    e.preventDefault();
    triggerCopyNotice();
  };

  const handleContextMenuPrevent = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerCopyNotice();
  };

  // Keyboard shortcut listener to prevent Ctrl+C, Ctrl+V, Cmd+C, Cmd+V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'C', 'V', 'X', 'A'].includes(e.key)) {
        // Prevent copying question text
        const target = e.target as HTMLElement;
        if (target && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          triggerCopyNotice();
        } else if (['c', 'C', 'x', 'X'].includes(e.key)) {
          e.preventDefault();
          triggerCopyNotice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter questions according to active dimension and filter mode
  const filteredQuestions = questionnaire.questions.filter((q) => {
    const resp = responses[q.id];
    const isAnswered = isQuestionAnswered(q.id);
    const isFlagged = resp && resp.flagged;

    if (activeDimensionFilter !== 'all' && q.dimensionId !== activeDimensionFilter) {
      return false;
    }

    if (filterMode === 'unanswered') {
      return !isAnswered;
    }
    if (filterMode === 'completed') {
      return isAnswered;
    }
    if (filterMode === 'flagged') {
      return !!isFlagged;
    }
    return true;
  });

  // Group questions by dimension so each section header appears in correct natural order (4.1 -> 4.2 -> 4.3 -> ...)
  const groupedDimensions = dimensionsList.filter((dim) => {
    if (activeDimensionFilter !== 'all' && activeDimensionFilter !== dim) return false;
    return true;
  });

  // Step-by-step section navigation calculations
  const currentIndex = dimensionsList.indexOf(activeDimensionFilter);
  const isFilteredSingleSection = activeDimensionFilter !== 'all' && currentIndex !== -1;
  const prevDimension = isFilteredSingleSection && currentIndex > 0 ? dimensionsList[currentIndex - 1] : null;
  const nextDimension = isFilteredSingleSection && currentIndex < dimensionsList.length - 1 ? dimensionsList[currentIndex + 1] : null;
  const isLastSection = isFilteredSingleSection && currentIndex === dimensionsList.length - 1;

  // Active section stats
  const activeSectionStats = isFilteredSingleSection ? getDimensionStats(activeDimensionFilter) : null;

  // Navigation handlers
  const handleGoToSection = (dimId: string) => {
    setActiveDimensionFilter(dimId);
    setFilterMode('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextSection = () => {
    if (nextDimension) {
      handleGoToSection(nextDimension);
    }
  };

  const handlePrevSection = () => {
    if (prevDimension) {
      handleGoToSection(prevDimension);
    }
  };

  const handleProceedToReview = () => {
    if (remainingUnits > 0) {
      setAttemptedSubmitWithUnanswered(true);
    }
    onNavigate('submission');
  };

  return (
    <div
      className="max-w-5xl mx-auto space-y-4 py-4 px-4 select-none relative"
      id="questionnaire-main-container"
      onCopy={handleCopyPrevent}
      onCut={handleCopyPrevent}
      onPaste={handlePastePrevent}
      onContextMenu={handleContextMenuPrevent}
    >
      {/* Toast alert if copy-paste attempted */}
      {copyToastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs animate-fade-in">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Copy-paste is disabled to preserve assessment integrity.</span>
        </div>
      )}

      {/* 1. SLIM Sticky Header */}
      <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200 shadow-xs px-3.5 py-2 sticky top-[57px] z-30 flex items-center justify-between gap-3">
        {/* Left: Role & Department Indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
          <span className="text-xs font-bold text-slate-900 truncate">
            {profile.role || questionnaire.title}
          </span>
          <span className="hidden md:inline-block text-2xs text-slate-400 font-medium truncate">
            ({profile.department || questionnaire.title})
          </span>
        </div>

        {/* Center: Compact Progress Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-24 sm:w-32 bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-teal-600 h-2 transition-all duration-300"
              style={{ width: `${Math.min(100, (answeredUnits / totalUnits) * 100)}%` }}
            />
          </div>
          <span className="text-2xs font-bold text-slate-700 font-mono">
            {answeredUnits}/{totalUnits} ({Math.round((answeredUnits / totalUnits) * 100)}%)
          </span>
        </div>

        {/* Right: Filter & Submit */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg text-2xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('unanswered')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filterMode === 'unanswered'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unanswered ({remainingUnits})
            </button>
          </div>

          <button
            id="sticky-review-submit-btn"
            onClick={handleProceedToReview}
            className={`px-3 py-1 text-white text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              remainingUnits > 0 ? 'bg-slate-800 hover:bg-slate-700' : 'bg-teal-700 hover:bg-teal-800'
            }`}
          >
            <span>Review &amp; Submit</span>
            {remainingUnits > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title={`${remainingUnits} unanswered`} />
            )}
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* 2. Questionnaire Context & Reviewer Identity Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xs uppercase font-extrabold tracking-wider bg-teal-400 text-slate-950 px-2 py-0.5 rounded">
              Questionnaire Preview
            </span>
            <span className="text-2xs text-slate-300 font-mono">
              Role: <strong className="text-white">{profile.role || questionnaire.title}</strong>
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-2xs text-teal-300 font-medium">
              Reviewer: Mr. Nushi (Director Asset Management)
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{questionnaire.title}</span>
          </h2>
          <p className="text-xs text-slate-300">
            <strong>Target Department:</strong> {profile.department || questionnaire.title} &bull; <strong>Questionnaire Role:</strong> {profile.role}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xs uppercase tracking-wider text-slate-400 block font-semibold">
            Framework Alignment
          </span>
          <span className="text-xs font-bold text-teal-300">
            Chapter 4 &bull; 7 Canonical Sections
          </span>
        </div>
      </div>

      {/* 3. Purpose of the Questionnaire Explanation Card */}
      <div
        id="questionnaire-purpose-card"
        className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                Purpose of the Questionnaire
              </h3>
              <span className="text-2xs font-semibold text-teal-700 uppercase tracking-wider block">
                {profile.department || questionnaire.title} &bull; PJMAK PMO Establishment Framework
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-flex text-3xs font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200 font-mono">
            7 Canonical Sections &bull; Chapter 4
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/90 p-4 rounded-xl border border-slate-200/80">
          {questionnaire.purpose ||
            `This questionnaire is designed to understand the current way of working, information flows, responsibilities, and coordination within the ${profile.department || questionnaire.title} across seven sections. The section numbers and structure are aligned with Chapter 4 of our proposal for PMO Establishment in Sea-Kit. Your responses will be used to identify gaps, strengths, and improvement opportunities and to support the development of a practical PMO framework aligned with the department’s actual needs.`}
        </p>

        {questionnaire.description && (
          <div className="flex items-start gap-2 pt-0.5 text-2xs text-slate-500">
            <span className="font-bold text-slate-700 uppercase tracking-wider shrink-0">Evaluation Scope:</span>
            <span className="leading-snug text-slate-600">{questionnaire.description}</span>
          </div>
        )}
      </div>

      {/* 4. Dimension Quick Navigation Tabs (All 7 Sections with visual status dots) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-2xs">
        <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Section Filter:
        </span>
        <button
          type="button"
          onClick={() => setActiveDimensionFilter('all')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 ${
            activeDimensionFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All (7 Sections)
        </button>
        {dimensionsList.map((dim) => {
          const stats = getDimensionStats(dim);
          return (
            <button
              key={dim}
              type="button"
              onClick={() => handleGoToSection(dim)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
                activeDimensionFilter === dim
                  ? 'bg-slate-900 text-white ring-2 ring-slate-900/30'
                  : stats.isComplete
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>Sec {dim}</span>
              {stats.isComplete ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Section Complete" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title={`${stats.unansweredCount} remaining`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Section Info Header when filtered */}
      {isFilteredSingleSection && DIMENSION_METADATA[activeDimensionFilter] && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-2xs">
                Section {activeDimensionFilter} of 4.7
              </span>
              <span className="font-bold text-slate-900">
                {DIMENSION_METADATA[activeDimensionFilter].title}
              </span>
              {activeSectionStats?.isComplete ? (
                <span className="text-3xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded">
                  Completed
                </span>
              ) : (
                <span className="text-3xs font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded">
                  {activeSectionStats?.unansweredCount} Question(s) Pending
                </span>
              )}
            </div>
            <p className="text-2xs text-slate-600 mt-0.5">
              {DIMENSION_METADATA[activeDimensionFilter].subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveDimensionFilter('all')}
            className="text-2xs font-bold text-slate-500 hover:text-slate-800 underline self-start sm:self-center shrink-0"
          >
            Show All 7 Sections
          </button>
        </div>
      )}

      {/* 5. Sequential Questionnaire Content: Rendered strictly in order (4.1 -> 4.2 -> 4.3 -> ...) */}
      <div className="space-y-6">
        {groupedDimensions.map((dimId) => {
          const dimMeta = DIMENSION_METADATA[dimId];
          const dimQuestions = filteredQuestions.filter((q) => q.dimensionId === dimId);

          // If filtering to unanswered and this dimension has no questions matching, skip
          if (dimQuestions.length === 0 && (dimId !== '4.2' || filterMode !== 'all')) {
            return null;
          }

          return (
            <div key={dimId} className="space-y-4">
              {/* Dimension Section Banner (renders in natural order) */}
              <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    Section {dimId}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {dimMeta?.title}
                  </span>
                </div>
                <span className="text-2xs text-slate-500 hidden sm:inline">
                  {dimMeta?.subtitle}
                </span>
              </div>

              {/* Special for Section 4.2: Part 4.2A Tool Checklist renders IN PLACE right under Section 4.2 */}
              {dimId === '4.2' && softwareConfig && (
                <div
                  id="dimension-4-2-software-inventory-card"
                  className="bg-white rounded-xl border border-slate-300 p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase font-mono">
                        Part 4.2A: {softwareConfig.partATitle || 'System & Tool Identification'}
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        {softwareConfig.partADescription || 'Select all systems, software, and tools you actively use in your daily workflow:'}
                      </p>
                    </div>

                    {isToolInventoryComplete ? (
                      <span className="text-teal-700 font-bold text-2xs bg-teal-50 border border-teal-200 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" /> Tools Identified
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold text-2xs bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                        Checklist Pending
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {softwareConfig.availableTools.map((toolName) => {
                      const isChecked = section47.selectedTools.includes(toolName);
                      return (
                        <label
                          key={toolName}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            isChecked
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-medium'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleSelectTool(toolName, e.target.checked)}
                            className="mt-0.5 accent-teal-400 shrink-0"
                          />
                          <span className="leading-tight">{toolName}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Custom tool entry */}
                  <div className="pt-1">
                    <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Other Department-Specific Tools, Bespoke Models, or Spreadsheets:
                    </label>
                    <input
                      type="text"
                      value={section47.customTool || ''}
                      onChange={(e) => onUpdateSection47({ customTool: e.target.value })}
                      placeholder="e.g. Bespoke dispatch register, OrcaFlex hydro model, vendor portal, custom Excel lookahead..."
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Diagnostic Questions in this Section (All sections have Preferred and Current columns) */}
              <div className="space-y-4">
                {dimQuestions.map((q) => {
                  const resp = responses[q.id] || { questionId: q.id };
                  const currentOptId = resp.currentState ?? (resp.selectedOption !== undefined ? resp.selectedOption : undefined);
                  const preferredOptId = resp.preferredState;
                  const hasCurrent = currentOptId !== undefined;
                  const hasPreferred = preferredOptId !== undefined;
                  const isFullyComplete = hasCurrent && hasPreferred;
                  const isPartiallyComplete = hasCurrent || hasPreferred;
                  const isSameSelection = hasCurrent && hasPreferred && currentOptId === preferredOptId;
                  const gap = hasCurrent && hasPreferred ? preferredOptId - currentOptId : null;

                  return (
                    <div
                      key={q.id}
                      id={`question-card-${q.id}`}
                      className={`bg-white rounded-xl border transition-all p-4 sm:p-5 shadow-xs ${
                        isFullyComplete
                          ? 'border-slate-200'
                          : isPartiallyComplete
                          ? 'border-teal-200 ring-1 ring-teal-100'
                          : 'border-slate-300 ring-1 ring-slate-200'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                            Q{q.number}
                          </span>
                          <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                            {q.dimensionTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateResponse(q.id, { flagged: !resp.flagged })}
                            className={`p-1.5 rounded-md border text-2xs transition-colors flex items-center gap-1 cursor-pointer ${
                              resp.flagged
                                ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                                : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                            }`}
                            title="Flag for review"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                              {resp.flagged ? 'Flagged' : 'Flag'}
                            </span>
                          </button>

                          {isFullyComplete ? (
                            <span className="inline-flex items-center gap-1 text-2xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                            </span>
                          ) : isPartiallyComplete ? (
                            <span className="inline-flex items-center gap-1 text-2xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              1 of 2 Selected
                            </span>
                          ) : (
                            <span className="text-2xs text-slate-400 font-medium">Unanswered</span>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-3">
                        {q.text}
                      </h4>

                      {/* Guidance banner with quick match helper */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-2xs text-slate-600 mb-3 flex items-center justify-between">
                        <span>
                          Please select one row for <strong>Current Practice</strong> (Column 1) and one row for <strong>Preferred Target</strong> (Column 2).
                        </span>
                        {hasCurrent && !hasPreferred && (
                          <button
                            type="button"
                            onClick={() => onUpdateResponse(q.id, { preferredState: currentOptId })}
                            className="text-teal-800 hover:text-teal-950 font-bold underline cursor-pointer shrink-0 ml-2"
                          >
                            Match Target to Current
                          </button>
                        )}
                      </div>

                      {/* Dual-Column 1-4 Scale Matrix (Present across ALL sections, including 4.2) */}
                      <div className="overflow-x-auto border border-slate-200 rounded-lg mb-3">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 text-2xs uppercase tracking-wider font-mono">
                            <tr>
                              <th className="py-2 px-3 w-28 sm:w-36 text-center border-r border-slate-200">
                                Current Practice
                              </th>
                              <th className="py-2 px-3 w-28 sm:w-36 text-center border-r border-slate-200">
                                Preferred Target
                              </th>
                              <th className="py-2 px-3">
                                Operational Archetype (Level 1 to Level 4)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {q.options.map((opt) => {
                              const isCurrent = currentOptId === opt.id;
                              const isPreferred = preferredOptId === opt.id;
                              const isSame = isCurrent && isPreferred;

                              return (
                                <tr
                                  key={opt.id}
                                  className={`transition-colors ${
                                    isSame
                                      ? 'bg-emerald-50/70 hover:bg-emerald-50'
                                      : isCurrent
                                      ? 'bg-slate-100/70 hover:bg-slate-100'
                                      : isPreferred
                                      ? 'bg-teal-50/70 hover:bg-teal-50'
                                      : 'hover:bg-slate-50'
                                  }`}
                                >
                                  {/* Column 1: Current State Radio */}
                                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                                    <label className="flex items-center justify-center cursor-pointer p-1">
                                      <input
                                        type="radio"
                                        name={`current_${q.id}`}
                                        checked={isCurrent}
                                        onChange={() => {
                                          onUpdateResponse(q.id, {
                                            currentState: opt.id,
                                            selectedOption: opt.id,
                                          });
                                          if (q.dimensionId === '4.2') {
                                            onUpdateSection47({ integrationMaturity: opt.id });
                                          }
                                        }}
                                        className="w-4 h-4 accent-slate-900 cursor-pointer"
                                      />
                                    </label>
                                  </td>

                                  {/* Column 2: Preferred Target Radio */}
                                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                                    <label className="flex items-center justify-center cursor-pointer p-1">
                                      <input
                                        type="radio"
                                        name={`preferred_${q.id}`}
                                        checked={isPreferred}
                                        onChange={() =>
                                          onUpdateResponse(q.id, {
                                            preferredState: opt.id,
                                          })
                                        }
                                        className="w-4 h-4 accent-teal-600 cursor-pointer"
                                      />
                                    </label>
                                  </td>

                                  {/* Column 3: Archetype Description */}
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-mono font-bold text-2xs text-slate-800">
                                        Level {opt.id}
                                      </span>

                                      {/* Badges */}
                                      {isSame ? (
                                        <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                          Zero-Gap Baseline (Current = Preferred)
                                        </span>
                                      ) : (
                                        <>
                                          {isCurrent && (
                                            <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-900 font-bold border border-slate-300">
                                              Current Practice
                                            </span>
                                          )}
                                          {isPreferred && (
                                            <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold border border-teal-300">
                                              Preferred Target
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </div>

                                    <p
                                      className={`text-xs sm:text-sm ${
                                        isSame
                                          ? 'text-slate-950 font-medium'
                                          : isCurrent || isPreferred
                                          ? 'text-slate-900 font-medium'
                                          : 'text-slate-700'
                                      }`}
                                    >
                                      {opt.text}
                                    </p>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Gap Status Indicator */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-2xs mb-3">
                        <div className="flex items-center gap-2">
                          {isFullyComplete ? (
                            isSameSelection ? (
                              <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                Zero-Gap Baseline: Organization practices align with target requirements in this area (Level {currentOptId}).
                              </span>
                            ) : gap !== null && gap > 0 ? (
                              <span className="text-teal-900 font-bold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                Target Uplift: +{gap} Level Growth (Current: Level {currentOptId} &rarr; Target: Level {preferredOptId}).
                              </span>
                            ) : (
                              <span className="text-amber-800 font-bold flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                Alignment Note: Current practice (Level {currentOptId}) exceeds preferred target (Level {preferredOptId}).
                              </span>
                            )
                          ) : hasCurrent ? (
                            <span className="text-slate-700 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-600" />
                              Current Practice selected (Level {currentOptId}). Please choose Preferred Target in Column 2.
                            </span>
                          ) : hasPreferred ? (
                            <span className="text-teal-800 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-teal-600" />
                              Preferred Target selected (Level {preferredOptId}). Please choose Current Practice in Column 1.
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Select 1 row for Current Practice (Column 1) and 1 row for Preferred Practice (Column 2).
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Context & Practical Observations Field */}
                      <div className="pt-2 border-t border-slate-100">
                        <label
                          htmlFor={`context-${q.id}`}
                          className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                        >
                          Context &amp; Practical Observations (Optional):
                        </label>
                        <textarea
                          id={`context-${q.id}`}
                          rows={2}
                          value={resp.evidence || ''}
                          onChange={(e) => onUpdateResponse(q.id, { evidence: e.target.value })}
                          placeholder="Provide practical department observations, tool names, process delays, drawing handoffs, or qualitative context..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed text-slate-800 placeholder:text-slate-400 transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Step-by-Step Bottom Navigation Bar */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        {/* If user is in a single section filter and has remaining unanswered questions in other sections */}
        {isFilteredSingleSection && remainingUnits > 0 && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Assessment In Progress:</span> You have{' '}
              <strong>{remainingUnits} unanswered item(s)</strong> across the assessment. You can proceed to the next section or navigate between sections freely, but all questions must be answered prior to final submission.
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Navigation: Either previous section or back to proposal */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            {prevDimension ? (
              <button
                type="button"
                onClick={handlePrevSection}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous (Section {prevDimension})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('proposal')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Proposal</span>
              </button>
            )}

            {isFilteredSingleSection && (
              <button
                type="button"
                onClick={() => setActiveDimensionFilter('all')}
                className="hidden md:inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-2xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <span>View All Sections</span>
              </button>
            )}
          </div>

          {/* Right Navigation: Either Next Section (till 4.7) or Proceed to Review & Submit */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            {nextDimension ? (
              <button
                type="button"
                id="next-section-btn"
                onClick={handleNextSection}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue to Section {nextDimension}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="bottom-proceed-submit-btn"
                onClick={handleProceedToReview}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer ${
                  remainingUnits === 0
                    ? 'bg-teal-700 hover:bg-teal-800'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <span>
                  {isLastSection
                    ? 'Proceed to Review & Submit'
                    : 'Proceed to Review & Submit'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
