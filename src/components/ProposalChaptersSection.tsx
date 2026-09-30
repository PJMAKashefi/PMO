import React, { useState, useEffect } from 'react';
import { PROPOSAL_CHAPTERS, ProposalChapter } from '../data/proposalChapters';
import { SeaKitLogo } from './SeaKitLogo';
import { TimeOfDayGreeting } from './TimeOfDayGreeting';
import { CommentModal } from './CommentModal';
import { ProposalComment, getProposalComments } from '../data/commentsStorage';
import { UserAccount } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Layers,
  Lock,
  Shield,
  ShieldAlert,
  Sparkles,
  LayoutGrid,
  FileText,
  ExternalLink,
  ChevronDown,
  Building2,
  GitBranch,
  FileCheck,
  Scale,
  Zap,
  Users,
  Database,
  MessageSquare,
  MessageSquarePlus,
} from 'lucide-react';
import { NavTabId } from './Header';

interface ProposalChaptersSectionProps {
  onNavigate: (tab: NavTabId) => void;
  onSelectRoleAndNavigate?: () => void;
  currentUser: UserAccount | null;
}

const CHAPTER_4_DIMENSIONS = [
  {
    num: '4.1',
    title: 'Core PMO Team Structure & Interfaces',
    icon: Building2,
    tag: 'Roles & Cadence',
    summary:
      'Proportionate, project-centric integration layer connecting active vessel builds with functional teams without creating separate bureaucracy.',
    keyPoints: [
      'Core PMO Roles (4.1.1): PMO Lead / Integration Manager, Project Planner / Controls Lead, Document Control / Info Management, and Matrixed Functional Leads.',
      'Project-Centric Foundation (4.1.2): Structured around active vessel programmes with daily/weekly lookahead cadences.',
      'Cross-Functional Matrix: Engineering, Software, Yard, and Supply Chain retain functional authority while feeding verified status at source.',
      'Executive & External Interfaces: Unambiguous operational boundaries for Managing Director, Fugro Group, Class societies, and suppliers.',
    ],
  },
  {
    num: '4.2',
    title: 'Departmental Software & System Inventory',
    icon: Database,
    tag: 'Tooling & Maturity',
    summary:
      'Definitive inventory of digital infrastructure, CAD/analysis tools, ERP, EDMS, and spreadsheets with standardized 4-tier integration maturity.',
    keyPoints: [
      'System & Tool Identification: Catalogs active CAD/3D modeling, OrcaFlex, ERP, Primavera P6/MS Project, Jira/Asana, EDMS, and Excel files.',
      '4-Tier Maturity Scale: Evaluates flow from completely siloed files (Level 1) to fully synchronized API ecosystems (Level 3) vs over-regulation (Level 4).',
      'Empirical Foundation: Prevents abstract assumptions by grounding the PMO architecture in actual software tools deployed across departments.',
      'Digital Bottleneck Removal: Targets tool fragmentation between engineering releases, procurement requisitions, and yard outfitting.',
    ],
  },
  {
    num: '4.3',
    title: 'Information, Data & Communication Flows',
    icon: GitBranch,
    tag: 'Single Source of Truth',
    summary:
      'Structured information routes across 8 internal departmental data channels, external supply chain gateways, and 4-step closed-loop resolution.',
    keyPoints: [
      'Internal Departmental Channels (4.3.2): Clear data ownership for Engineering, Procurement, Production, Finance, QHSE, Logistics, IT, and HR.',
      'External Gateways (4.3.3): VDR technical gates, subcontractor milestone verification, and statutory/Lloyd’s Register certification hold points.',
      '4-Step Closed-Loop Protocol (4.3.4): Step 1 (Identification) -> Step 2 (Impact Assessment) -> Step 3 (Cross-Functional Resolution) -> Step 4 (Traceable Closure).',
      'Consolidated Management Info (4.3.5): Decision-ready executive dashboards and consistent parent-company (Fugro) governance feeds.',
    ],
  },
  {
    num: '4.4',
    title: 'PMO Mandate, Authority & Responsibilities',
    icon: Scale,
    tag: 'MD-Chartered Authority',
    summary:
      'Formally chartered operational authority approved by the Managing Director to protect baselines, manage variances, and arbitrate delivery priorities.',
    keyPoints: [
      'Portfolio & IMS Ownership (4.4.1): Maintains consolidated portfolio register and Integrated Master Schedule across H, X, and XL-Class USVs.',
      'Critical-Path Resource Prioritization (4.4.2): Impartial adjudication of competing demands based on master schedule floats and enterprise goals.',
      'Audit Rights & Baseline Control (4.4.4 & 4.4.5): Authority to challenge self-reported progress and enforce strict ECN change gating.',
      'Clear Responsibility Boundaries (4.4.8): PMO coordinates and integrates process while functional teams retain technical and execution authority.',
    ],
  },
  {
    num: '4.5',
    title: 'Governance, Decision-Making & Escalation',
    icon: Shield,
    tag: '4-Tier Forums & Triggers',
    summary:
      'Fast-acting, tiered governance model with 48-hour blocker rule, single data ownership, and quantitative escalation thresholds.',
    keyPoints: [
      '4-Tier Cadence (4.5.2): Tier 1 (Weekly Tactical - 48h Blocker Rule), Tier 2 (Biweekly Control), Tier 3 (Monthly Exec), Tier 4 (Stage-Gates).',
      'Explicit Data Ownership (4.5.3.1): Procurement owns long-lead, EDMS owns transmittals, Engineering owns BOM/baselines, Software owns G-SAVI.',
      'Quantitative Escalation Triggers (4.5.4.1): Critical-path slippage > 5 working days, cost exposure > €10,000, unresolved 48h blocker.',
      'Stage-Gate Evidence Standards (4.5.3.3): Audit-backed verification preventing progression on unmitigated safety or Class gaps.',
    ],
  },
  {
    num: '4.6',
    title: 'Processes Efficiency & Anti-Bureaucracy',
    icon: Zap,
    tag: 'Lean & Service Sunset',
    summary:
      'Lean operational guardrails ensuring every process, metric, meeting, and template delivers measurable decision value.',
    keyPoints: [
      'Minimum Necessary Templates: Only introduce processes that actively improve visibility, control, and delivery performance.',
      'Zero Duplicate Reporting: All reports generated directly from controlled single sources of truth, eliminating shadow spreadsheets.',
      'No Meeting Without a Decision: Strict action orientation; elimination of passive status monologues.',
      'The Service Sunset Rule: Every new metric or report must replace an existing one; periodic retirement of low-value workflows.',
    ],
  },
  {
    num: '4.7',
    title: 'Organizational Adoption & Change Management',
    icon: Users,
    tag: 'Pull over Push',
    summary:
      'Progressive deployment of modular PMO services co-created with functional users to build cultural pull and operational utility.',
    keyPoints: [
      'Service-Oriented PMO Design: Every capability structured as a distinct service with clear customer, inputs, outputs, and measurable value.',
      'User Co-Creation Over Imposition: Processes and dashboards designed alongside engineers, buyers, and yard foremen.',
      'Phased Capability Deployment: Scaled organically starting with schedule visibility and critical-path protection.',
      'Continuous Value Audit: PMO effectiveness evaluated continuously via stakeholder feedback and decision velocity metrics.',
    ],
  },
];

export const ProposalChaptersSection: React.FC<ProposalChaptersSectionProps> = ({
  onNavigate,
  currentUser,
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('ch1');
  const [ch4ViewMode, setCh4ViewMode] = useState<'summary' | 'full'>('summary');
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [lastViewedDimension, setLastViewedDimension] = useState<string>('4.1');
  const [copyWarning, setCopyWarning] = useState<boolean>(false);

  // Comment Modal state
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [commentTarget, setCommentTarget] = useState<{
    chapterId: string;
    targetId: string;
    targetTitle: string;
  }>({
    chapterId: 'ch1',
    targetId: 'ch1',
    targetTitle: 'Chapter 1: Executive Summary',
  });
  const [allComments, setAllComments] = useState<ProposalComment[]>(() => getProposalComments());

  const refreshComments = () => {
    setAllComments(getProposalComments());
  };

  const openCommentModal = (chapterId: string, targetId: string, targetTitle: string) => {
    setCommentTarget({ chapterId, targetId, targetTitle });
    setIsCommentModalOpen(true);
  };

  const triggerCopyWarning = () => {
    setCopyWarning(true);
    setTimeout(() => setCopyWarning(false), 2800);
  };

  const activeChapter =
    PROPOSAL_CHAPTERS.find((c) => c.id === activeChapterId) || PROPOSAL_CHAPTERS[0];

  const returnToSummary = (targetDim?: string) => {
    const dimToScroll = targetDim || lastViewedDimension || '4.1';
    setCh4ViewMode('summary');
    setSelectedDimension(dimToScroll);

    setTimeout(() => {
      const cardEl = document.getElementById(`summary-dim-card-${dimToScroll.replace('.', '-')}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const topEl = document.getElementById('chapter-content-card');
        if (topEl) topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  return (
    <div
      className="max-w-5xl mx-auto space-y-6 py-6 px-4 select-none relative"
      id="proposal-chapters-container"
      onCopy={(e) => {
        e.preventDefault();
        triggerCopyWarning();
      }}
      onCut={(e) => {
        e.preventDefault();
        triggerCopyWarning();
      }}
      onPaste={(e) => {
        e.preventDefault();
        triggerCopyWarning();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerCopyWarning();
      }}
    >
      {/* Toast Alert if copy is attempted */}
      {copyWarning && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs animate-fade-in">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Copying is prohibited. This proposal is proprietary and copy protected (PJMAK).</span>
        </div>
      )}

      {/* Dynamic Executive Greeting Banner for Mr. Nushi (Morning / Afternoon / Evening) */}
      <TimeOfDayGreeting currentUser={currentUser} />

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <SeaKitLogo size="sm" />
            <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>PMO Establishment Proposal</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-md text-3xs font-extrabold uppercase tracking-wider">
            <Lock className="w-3 h-3 text-amber-700" />
            <span>Proprietary &bull; Copy Protected (PJMAK)</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive Proposal &amp; Framework Summary
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Explore the strategic foundation, operational diagnosis, problem statement, and proposed PMO model tailored to Sea-Kit's multi-class vessel manufacturing environment.
        </p>

        {/* Chapter Selection Tabs */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 border-t border-slate-100 pt-4">
          {PROPOSAL_CHAPTERS.map((ch) => {
            const isSelected = ch.id === activeChapterId;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapterId(ch.id);
                  setSelectedDimension(null);
                }}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`text-2xs font-bold uppercase tracking-wider block ${
                    isSelected ? 'text-amber-400' : 'text-slate-400'
                  }`}
                >
                  {ch.chapterNumber}
                </span>
                <span className="text-xs font-bold block mt-0.5 truncate">{ch.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chapter Content Card */}
      <div
        id="chapter-content-card"
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-6"
      >
        {/* Chapter Title & Subtitle */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded font-mono">
                {activeChapter.chapterNumber}
              </span>
              <button
                type="button"
                onClick={() =>
                  openCommentModal(
                    activeChapter.id,
                    activeChapter.id,
                    `${activeChapter.chapterNumber}: ${activeChapter.title}`
                  )
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-2xs font-bold transition-colors cursor-pointer"
                title="Add feedback or comment on this chapter"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-teal-600" />
                <span>Add Note / Comment</span>
                {allComments.filter((c) => c.chapterId === activeChapter.id && c.targetId === activeChapter.id).length > 0 && (
                  <span className="bg-teal-600 text-white text-3xs px-1.5 py-0.2 rounded-full font-mono">
                    {allComments.filter((c) => c.chapterId === activeChapter.id && c.targetId === activeChapter.id).length}
                  </span>
                )}
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {activeChapter.title}
            </h2>
            {activeChapter.subtitle ? (
              <p className="text-sm font-medium text-slate-600 mt-1">
                {activeChapter.subtitle}
              </p>
            ) : null}
          </div>

          {/* If Chapter 4, offer Summary vs Full Text toggle */}
          {activeChapter.id === 'ch4' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => returnToSummary()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ch4ViewMode === 'summary'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-700" />
                <span>Summarized View</span>
              </button>
              <button
                onClick={() => setCh4ViewMode('full')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ch4ViewMode === 'full'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                <span>Full Text View</span>
              </button>
            </div>
          )}
        </div>

        {/* CHAPTER 4: SUMMARIZED VIEW */}
        {activeChapter.id === 'ch4' && ch4ViewMode === 'summary' ? (
          <div className="space-y-6">
            {/* Overview Intro Box */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                The PMO Model Overview
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                To address organizational and project-delivery challenges as Sea-Kit scales across multi-class vessel programmes, this proposal defines a right-sized, value-driven Project Management Office (PMO). The PMO operates as an operational integration and decision-support capability connecting project information, people, processes, and decisions across engineering, software, production, procurement, logistics, quality, finance, certification, and customer delivery.
              </p>
              <p className="text-xs font-semibold text-slate-600">
                Structured across 7 complementary dimensions:
              </p>
            </div>

            {/* 7 Dimensions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHAPTER_4_DIMENSIONS.map((dim) => {
                const IconComponent = dim.icon;
                const isSelected = selectedDimension === dim.num;

                return (
                  <div
                    key={dim.num}
                    id={`summary-dim-card-${dim.num.replace('.', '-')}`}
                    className={`rounded-xl border p-4 transition-all scroll-mt-28 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 border border-slate-200 text-slate-700'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-mono font-bold text-slate-500 block">
                              Dimension {dim.num}
                            </span>
                            {isSelected && (
                              <span className="text-3xs font-bold uppercase tracking-wider bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded">
                                Last Viewed
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {dim.title}
                          </h3>
                        </div>
                      </div>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 whitespace-nowrap">
                        {dim.tag}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {dim.summary}
                    </p>

                    <div className="border-t border-slate-100 pt-2.5 space-y-1.5">
                      {dim.keyPoints.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="text-slate-400 font-bold mt-0.5">&bull;</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedDimension(dim.num);
                          setLastViewedDimension(dim.num);
                          setCh4ViewMode('full');
                          // Give DOM time to update then scroll to target dimension
                          setTimeout(() => {
                            const el = document.getElementById(`dim-sec-${dim.num.replace('.', '-')}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                        className="text-2xs font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1 transition-colors group cursor-pointer"
                      >
                        <span>Read Full Text of {dim.num}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openCommentModal(
                            'ch4',
                            `dim-${dim.num}`,
                            `Dimension ${dim.num}: ${dim.title}`
                          )
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 border border-slate-200 rounded-md text-3xs font-semibold text-slate-600 transition-colors cursor-pointer"
                        title={`Add note on Dimension ${dim.num}`}
                      >
                        <MessageSquarePlus className="w-3 h-3 text-slate-500 hover:text-teal-600" />
                        <span>Comment</span>
                        {allComments.filter((c) => c.chapterId === 'ch4' && c.targetId === `dim-${dim.num}`).length > 0 && (
                          <span className="bg-teal-600 text-white px-1 rounded-full font-mono">
                            {allComments.filter((c) => c.chapterId === 'ch4' && c.targetId === `dim-${dim.num}`).length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="text-amber-300 font-semibold block mb-0.5">PMO Integration Core:</strong>
                The PMO does not impose unnecessary bureaucracy or replace departmental authority; it establishes an integration spine providing reliable visibility, baseline protection, and prompt decision-making across all 7 operational dimensions.
              </div>
            </div>
          </div>
        ) : (
          /* FULL TEXT VIEW (For Chapter 4 or other chapters) */
          activeChapter.bodyParagraphs &&
          activeChapter.bodyParagraphs.length > 0 && (
            <div className="space-y-3.5 py-2">
              {/* Quick Jump Bar if Chapter 4 Full View */}
              {activeChapter.id === 'ch4' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => returnToSummary()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                      <span>Back to Summary View</span>
                    </button>
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 hidden sm:inline-block">
                      Jump to:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setLastViewedDimension(d);
                          const el = document.getElementById(`dim-sec-${d.replace('.', '-')}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeChapter.bodyParagraphs.map((para, idx) => {
                const isDimensionHeading = /^(---\s*)?[0-9]+\.[0-9]+(\s|:|-)/.test(para) || /^[0-9]+\.[0-9]+\s/.test(para);
                const isSubHeading = para.endsWith(':') && !isDimensionHeading;
                const isBullet = para.startsWith('• ');
                const isLastPara = idx === (activeChapter.bodyParagraphs?.length ?? 0) - 1;

                if (isDimensionHeading) {
                  const cleanedPara = para.replace(/^---\s*/, '').replace(/\s*---$/, '');
                  const dimNumMatch = cleanedPara.match(/^([0-9]+\.[0-9]+)/);
                  const currDim = dimNumMatch ? dimNumMatch[1] : '';
                  const anchorId = currDim ? `dim-sec-${currDim.replace('.', '-')}` : undefined;

                  const dimList = ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7'];
                  const dimIndex = dimList.indexOf(currDim);
                  const prevDim = dimIndex > 0 ? dimList[dimIndex - 1] : null;

                  return (
                    <div
                      key={idx}
                      id={anchorId}
                      className="pt-6 pb-2 border-t border-slate-200 first:border-t-0 first:pt-0 scroll-mt-28 space-y-3"
                    >
                      {/* End of Previous Section Back Bar */}
                      {prevDim && activeChapter.id === 'ch4' && (
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mb-3">
                          <div className="flex items-center gap-2 text-slate-600 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Completed Dimension {prevDim}</span>
                          </div>
                          <button
                            onClick={() => returnToSummary(prevDim)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-300 shadow-2xs cursor-pointer shrink-0"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
                            <span>Back to Summary</span>
                          </button>
                        </div>
                      )}

                      {/* Header with inline Back to Summary button for this dimension */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/90 p-3.5 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                            Dimension Section {currDim}
                          </span>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {cleanedPara}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <button
                            type="button"
                            onClick={() =>
                              openCommentModal(
                                activeChapter.id,
                                anchorId || `dim-${currDim}`,
                                `Section ${currDim}: ${cleanedPara}`
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition-colors border border-teal-200 shadow-2xs shrink-0 cursor-pointer"
                            title={`Add note on Section ${currDim}`}
                          >
                            <MessageSquarePlus className="w-3.5 h-3.5 text-teal-600" />
                            <span>Comment</span>
                            {allComments.filter((c) => c.chapterId === activeChapter.id && c.targetId === (anchorId || `dim-${currDim}`)).length > 0 && (
                              <span className="bg-teal-600 text-white text-3xs px-1.5 py-0.2 rounded-full font-mono">
                                {allComments.filter((c) => c.chapterId === activeChapter.id && c.targetId === (anchorId || `dim-${currDim}`)).length}
                              </span>
                            )}
                          </button>

                          {activeChapter.id === 'ch4' && (
                            <button
                              onClick={() => returnToSummary(currDim)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-300 shadow-2xs shrink-0 cursor-pointer"
                              title={`Return to summarized view from Section ${currDim}`}
                            >
                              <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
                              <span>Back to Summary</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (isSubHeading) {
                  const subHeadingId = `sub-${idx}-${para.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '')}`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between pt-3 pb-0.5 border-b border-slate-100 group"
                    >
                      <h4 className="text-sm font-bold text-slate-800">
                        {para}
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          openCommentModal(
                            activeChapter.id,
                            subHeadingId,
                            `${activeChapter.chapterNumber} Subsection: ${para}`
                          )
                        }
                        className="opacity-70 hover:opacity-100 flex items-center gap-1 text-3xs font-semibold px-2 py-0.5 rounded text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-all cursor-pointer"
                        title="Add note on this subsection"
                      >
                        <MessageSquarePlus className="w-3 h-3 text-teal-600" />
                        <span>Note</span>
                        {allComments.filter((c) => c.chapterId === activeChapter.id && c.targetId === subHeadingId).length > 0 && (
                          <span className="bg-teal-600 text-white px-1 rounded-full font-mono text-[9px]">
                            {allComments.filter((c) => c.chapterId === activeChapter.id && c.targetId === subHeadingId).length}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                }

                if (isBullet) {
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 pl-2 text-sm sm:text-base text-slate-700 leading-relaxed"
                    >
                      <span className="text-slate-400 font-bold mt-1">&bull;</span>
                      <span>{para.replace(/^•\s*/, '')}</span>
                    </div>
                  );
                }

                return (
                  <React.Fragment key={idx}>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {para}
                    </p>

                    {/* End of Chapter 4 / Section 4.7 Closing Back to Summary banner */}
                    {isLastPara && activeChapter.id === 'ch4' && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 text-white rounded-xl p-4 mt-6 text-xs shadow-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="font-semibold">
                            Completed Dimension 4.7 &amp; All 7 PMO Sections
                          </span>
                        </div>
                        <button
                          onClick={() => returnToSummary('4.7')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-slate-900" />
                          <span>Back to Summary Version (All 7 Dimensions)</span>
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Floating Quick Return Pill at bottom of screen when in full text mode */}
              {activeChapter.id === 'ch4' && (
                <div className="sticky bottom-6 z-20 flex justify-center pointer-events-none pt-4">
                  <button
                    onClick={() => returnToSummary()}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-slate-900/95 hover:bg-slate-900 text-white rounded-full text-xs font-bold shadow-xl border border-slate-700 hover:scale-105 transition-all backdrop-blur-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                    <span>Back to Summary Version</span>
                    <span className="text-2xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                      7 Dimensions
                    </span>
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* Bottom Navigation between chapters & CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {activeChapterId === 'ch4' ? (
              <span>Proceed to Chapter 5 to understand how operational data collection and diagnostic logic works before starting the assessment.</span>
            ) : activeChapterId === 'ch6' ? (
              <span>Review complete. You may now proceed to the role-specific assessment.</span>
            ) : (
              <span>Review the proposal chapters sequentially.</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeChapterId === 'ch4' ? (
              /* When reading Chapter 4: Only proceed to Chapter 5 */
              <button
                id="proposal-proceed-to-ch5-btn"
                onClick={() => {
                  setActiveChapterId('ch5');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Chapter 5: Data Collection &amp; Assessment Framework</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                {/* Standard Next Chapter button if not at the last chapter */}
                {(() => {
                  const currIdx = PROPOSAL_CHAPTERS.findIndex((c) => c.id === activeChapterId);
                  if (currIdx < PROPOSAL_CHAPTERS.length - 1) {
                    const nextChap = PROPOSAL_CHAPTERS[currIdx + 1];
                    return (
                      <button
                        onClick={() => {
                          setActiveChapterId(nextChap.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: {nextChap.title}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    );
                  }
                  return null;
                })()}

                {/* Only display Go to Stakeholder Assessment on Chapter 5 or Chapter 6 */}
                {(activeChapterId === 'ch5' || activeChapterId === 'ch6') && (
                  <button
                    id="proposal-proceed-to-assessment-btn"
                    onClick={() => onNavigate('profile_setup')}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Go to Stakeholder Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Proprietary Legal Notice */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-3xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Strictly Confidential &amp; Proprietary &bull; Sea-Kit PMO Establishment Framework</span>
          </div>
          <span>&copy; 2026 PJMAK. All rights reserved. Copying, retransmission, or unauthorized reproduction is strictly prohibited.</span>
        </div>
      </div>

      {/* Proposal Comment & Note Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        chapterId={commentTarget.chapterId}
        targetId={commentTarget.targetId}
        targetTitle={commentTarget.targetTitle}
        currentUser={currentUser}
        comments={allComments}
        onCommentAdded={refreshComments}
      />
    </div>
  );
};

