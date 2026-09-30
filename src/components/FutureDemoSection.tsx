import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  FileText,
  Filter,
  Layers,
  LayoutDashboard,
  Lock,
  Milestone,
  Shield,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { NavTabId } from './Header';

interface FutureDemoSectionProps {
  onNavigate: (tab: NavTabId) => void;
  userRole?: string;
  departmentName?: string;
}

interface RoadmapPhase {
  phaseNumber: number;
  weeks: string;
  title: string;
  objective: string;
  status: 'In Progress (Active)' | 'Scheduled' | 'Upcoming';
  statusColor: string;
  milestones: {
    id: string;
    title: string;
    deliverable: string;
    owner: string;
    completed: boolean;
    tags: string[];
  }[];
  keyGovernanceDeliverable: string;
  coCreationActivity: string;
}

const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phaseNumber: 1,
    weeks: 'Weeks 1–4',
    title: 'Diagnostic Intake & Baseline Assessment',
    objective:
      'Deploy the dual-respondent questionnaires across all 12 operational sectors, ingest real-time friction telemetry, and compute initial health indices.',
    status: 'In Progress (Active)',
    statusColor: 'bg-teal-600 text-white',
    keyGovernanceDeliverable: 'PMO Charter signed by Managing Director & Baseline Diagnostic Report',
    coCreationActivity: 'Dual-respondent alignment interviews (Department Manager & Discipline Lead)',
    milestones: [
      {
        id: 'M1.1',
        title: 'Executive Charter Endorsement',
        deliverable: 'Formal MD-chartered authority establishing PMO float ownership & change control boundary.',
        owner: 'Managing Director & PMO Lead (Ali Kashefi)',
        completed: true,
        tags: ['Governance', 'Charter', 'Ch 4.4'],
      },
      {
        id: 'M1.2',
        title: 'Cross-Sector Diagnostic Survey Rollout',
        deliverable: 'Distribution of 12 role-specific questionnaires capturing current vs. preferred practices.',
        owner: 'PMO Lead & Department Heads',
        completed: true,
        tags: ['Diagnostic', 'Data Collection', 'Ch 5.1'],
      },
      {
        id: 'M1.3',
        title: 'Baseline Gap & Friction Telemetry Processing',
        deliverable: 'Computation of Departmental Friction Index (DFI) and Shadow-Work Prevalence (SWP).',
        owner: 'PMO Analytical Engine',
        completed: false,
        tags: ['Analytics', 'Triangulation', 'Ch 5.3'],
      },
    ],
  },
  {
    phaseNumber: 2,
    weeks: 'Weeks 5–8',
    title: 'Gap Synthesis & Co-Creation Workshops',
    objective:
      'Isolate perception vs. reality gaps across internal interfaces, uncover shadow spreadsheets, and collaboratively co-design streamlined pull mechanisms.',
    status: 'Scheduled',
    statusColor: 'bg-slate-700 text-white',
    keyGovernanceDeliverable: 'Interface Matrix & Streamlined Technical Handoff Standards (MDR & ECN)',
    coCreationActivity: 'Co-creation workshops between Engineering, Procurement, and Yard Operations',
    milestones: [
      {
        id: 'M2.1',
        title: 'Interface Perception Gap Report',
        deliverable: 'Triangulated analysis exposing friction points between design release and procurement lead-times.',
        owner: 'PMO Lead & Lead Engineers',
        completed: false,
        tags: ['Interfaces', 'Co-Creation', 'Ch 6.1'],
      },
      {
        id: 'M2.2',
        title: 'Master Deliverable Register (MDR) Gate Standardization',
        deliverable: 'Agreed single source of truth for engineering drawing freeze and transmittal gating.',
        owner: 'Engineering Manager & Document Control',
        completed: false,
        tags: ['MDR', 'Engineering', 'Ch 4.3'],
      },
      {
        id: 'M2.3',
        title: '48-Hour Blocker Protocol Ratification',
        deliverable: 'Implementation of rapid escalation pathway eliminating bureaucratic meeting stalls.',
        owner: 'Vessel Project Managers & PMO',
        completed: false,
        tags: ['Escalation', '48h Rule', 'Ch 4.5'],
      },
    ],
  },
  {
    phaseNumber: 3,
    weeks: 'Weeks 9–12',
    title: 'Modular Transformation & Dashboard Integration',
    objective:
      'Activate targeted PMO service modules, sunset redundant legacy paperwork, and deploy the unified PJMAK single-screen command center.',
    status: 'Upcoming',
    statusColor: 'bg-slate-500 text-white',
    keyGovernanceDeliverable: 'Live Integrated Master Schedule (IMS) & PJMAK Executive Dashboard Deployment',
    coCreationActivity: 'Hands-on operational training with Vessel Leads and Project Controllers',
    milestones: [
      {
        id: 'M3.1',
        title: 'Multi-Class Integrated Master Schedule (IMS)',
        deliverable: 'Live cross-vessel schedule linking H-Class, X-Class, and XL-Class milestones and yard resources.',
        owner: 'PMO Lead & Planning Team',
        completed: false,
        tags: ['IMS', 'Critical Path', 'Ch 4.4'],
      },
      {
        id: 'M3.2',
        title: 'Service Sunset Review & Legacy Elimination',
        deliverable: 'Formal retirement of duplicate spreadsheets and low-value administrative forms.',
        owner: 'PMO Governance Board',
        completed: false,
        tags: ['Lean PMO', 'Service Sunset', 'Ch 4.6'],
      },
      {
        id: 'M3.3',
        title: 'Single-Screen Executive Dashboard Activation',
        deliverable: 'Unified executive cockpit visualizing critical-path float, handover health, and risk dials.',
        owner: 'PJMAK Delivery Platform',
        completed: false,
        tags: ['Dashboard', 'Executive BI', 'Ch 6.3'],
      },
    ],
  },
  {
    phaseNumber: 4,
    weeks: 'Weeks 13–16',
    title: 'Full Operational Handover & Continuous Feedback Loops',
    objective:
      'Transition PMO governance to internal operational cadence, embed continuous improvement surveys, and establish permanent Fugro alignment.',
    status: 'Upcoming',
    statusColor: 'bg-slate-500 text-white',
    keyGovernanceDeliverable: 'Final PMO Capability Handover Package & Longitudinal Value Retrospective',
    coCreationActivity: 'Quarterly value retrospective and user adoption feedback sessions',
    milestones: [
      {
        id: 'M4.1',
        title: 'Internal PMO Competency Certification',
        deliverable: 'Upskilling of Sea-Kit project managers and delivery leads in standardized workflows.',
        owner: 'PMO Director & HR',
        completed: false,
        tags: ['Adoption', 'Training', 'Ch 4.7'],
      },
      {
        id: 'M4.2',
        title: 'Lloyd’s Register UMS Gate Synchronization',
        deliverable: 'Automated alignment between project milestones and classification society surveys.',
        owner: 'QHSE Lead & PMO',
        completed: false,
        tags: ['Compliance', 'UMS Code', 'Ch 5.1'],
      },
      {
        id: 'M4.3',
        title: 'Executive Sponsor & Fugro Steering Review',
        deliverable: 'Formal sign-off of PMO operational autonomy, schedule variance reduction, and value metrics.',
        owner: 'Managing Director & Fugro Steering Group',
        completed: false,
        tags: ['Executive Sign-off', 'Handover', 'Ch 6.2'],
      },
    ],
  },
];

interface MockTask {
  id: string;
  title: string;
  department: string;
  vesselProgram: string;
  status: 'In Progress' | 'Complete' | 'Upcoming Review' | 'Blocked';
  priority: 'High' | 'Critical' | 'Medium';
  progress: number;
  milestoneRef: string;
  assignee: string;
  daysRemaining: number;
}

const MOCK_TASKS: MockTask[] = [
  {
    id: 'TSK-101',
    title: 'Establish Single Source of Truth for Vessel Drawing Freezes (MDR)',
    department: 'Engineering & Design',
    vesselProgram: 'X-Class USV (12m)',
    status: 'In Progress',
    priority: 'Critical',
    progress: 65,
    milestoneRef: 'M2.2',
    assignee: 'Engineering Manager & Lead Designer',
    daysRemaining: 12,
  },
  {
    id: 'TSK-102',
    title: 'Formalize 16-Week Procurement Lead-Time Tracker with Hull Fabricator',
    department: 'Procurement & Supply Chain',
    vesselProgram: 'XL-Class USV (24m)',
    status: 'In Progress',
    priority: 'High',
    progress: 40,
    milestoneRef: 'M2.1',
    assignee: 'Procurement Manager & Senior Buyer',
    daysRemaining: 18,
  },
  {
    id: 'TSK-103',
    title: 'Deploy 48-Hour Blocker Escalation Protocol to Workshop Superiors',
    department: 'Production & Yard Operations',
    vesselProgram: 'All Active Vessels',
    status: 'Complete',
    priority: 'Critical',
    progress: 100,
    milestoneRef: 'M2.3',
    assignee: 'Yard Operations Manager',
    daysRemaining: 0,
  },
  {
    id: 'TSK-104',
    title: 'Harmonize Lloyd’s Register UMS Inspection Checkpoints with IMS Float',
    department: 'QHSE & Certification',
    vesselProgram: 'H-Class & X-Class',
    status: 'Upcoming Review',
    priority: 'High',
    progress: 25,
    milestoneRef: 'M4.2',
    assignee: 'QHSE Manager & Classification Liaison',
    daysRemaining: 34,
  },
  {
    id: 'TSK-105',
    title: 'Decommission 4 Fragmented Yard Whiteboards & Offline Spreadsheets',
    department: 'Production / IT Systems',
    vesselProgram: 'Tollesbury Yard',
    status: 'In Progress',
    priority: 'Medium',
    progress: 50,
    milestoneRef: 'M3.2',
    assignee: 'IT Lead & Workshop Foreman',
    daysRemaining: 21,
  },
];

export const FutureDemoSection: React.FC<FutureDemoSectionProps> = ({
  onNavigate,
  userRole = 'Valued Sea-Kit Team Member',
  departmentName = 'All Operational Sectors',
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [taskFilter, setTaskFilter] = useState<string>('all');
  const [activeTabMode, setActiveTabMode] = useState<'roadmap' | 'tasks' | 'how_it_works'>('roadmap');

  const currentPhaseData = ROADMAP_PHASES.find((p) => p.phaseNumber === selectedPhase) || ROADMAP_PHASES[0];

  const filteredTasks = MOCK_TASKS.filter((t) => {
    if (taskFilter === 'all') return true;
    return t.department.toLowerCase().includes(taskFilter.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4" id="future-pmo-demo-container">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Interactive Capability Simulation &bull; Chapter 6 Proposal Model</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-md text-3xs font-extrabold uppercase tracking-wider font-mono">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Standard 16-Week Implementation Lifecycle</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Your Inputs Shape the Future Sea-Kit PMO
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
            This preview illustrates how stakeholder survey responses are collected, analyzed by the PJMAK analytical engine, translated into a phased 16-week transformation roadmap, and monitored through an integrated task execution framework.
          </p>
        </div>

        {/* 3 Interactive Mode Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTabMode('roadmap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabMode === 'roadmap'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>1. Phased 16-Week Roadmap (Ch 6.2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('tasks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabMode === 'tasks'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>2. Task &amp; Goal Execution Board</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('how_it_works')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabMode === 'how_it_works'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>3. How Analysis Drives Implementation</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 16-WEEK PHASED IMPLEMENTATION ROADMAP (CHAPTER 6.2)                 */}
      {/* ========================================================================= */}
      {activeTabMode === 'roadmap' && (
        <div className="space-y-6 animate-fade-in">
          {/* Phase Selector Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ROADMAP_PHASES.map((phase) => {
              const isSelected = selectedPhase === phase.phaseNumber;
              return (
                <button
                  key={phase.phaseNumber}
                  type="button"
                  onClick={() => setSelectedPhase(phase.phaseNumber)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-mono font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      Phase {phase.phaseNumber}
                    </span>
                    <span className="text-3xs font-bold text-slate-500 font-mono">
                      {phase.weeks}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                    {phase.title}
                  </h3>

                  <div className="flex items-center justify-between text-2xs pt-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
                        phase.phaseNumber === 1
                          ? 'bg-teal-100 text-teal-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {phase.status}
                    </span>
                    <span className="font-semibold text-teal-700">
                      {phase.milestones.length} Milestones
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Detail Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    Phase {currentPhaseData.phaseNumber} ({currentPhaseData.weeks})
                  </span>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    {currentPhaseData.status}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {currentPhaseData.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {currentPhaseData.objective}
                </p>
              </div>

              <div className="shrink-0 sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200 text-2xs space-y-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">
                  Primary Governance Output:
                </span>
                <span className="font-bold text-slate-900 block max-w-xs">
                  {currentPhaseData.keyGovernanceDeliverable}
                </span>
              </div>
            </div>

            {/* Milestones in this Phase */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Core Milestones &amp; Work Packages for Phase {currentPhaseData.phaseNumber}:
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {currentPhaseData.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-extrabold bg-teal-800 text-white px-2 py-0.5 rounded">
                          {milestone.id}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {milestone.title}
                        </h4>
                        {milestone.completed && (
                          <span className="inline-flex items-center gap-1 text-3xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">
                        {milestone.deliverable}
                      </p>
                      <div className="flex items-center gap-2 text-2xs text-slate-500 pt-1">
                        <span className="font-semibold text-slate-700">Accountable:</span>
                        <span>{milestone.owner}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      {milestone.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-3xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stakeholder Co-Creation Highlight */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start gap-3 text-xs text-teal-950">
              <Zap className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-teal-900">Co-Creation Principle in This Phase: </span>
                <span className="text-teal-900">{currentPhaseData.coCreationActivity}. Solutions are not imposed top-down; processes are built jointly with department leads.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TASK & GOAL EXECUTION BOARD (CHAPTER 6.3 SIMULATION)               */}
      {/* ========================================================================= */}
      {activeTabMode === 'tasks' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  PMO Implementation Task &amp; Goal Execution Board
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Illustrating how diagnostic findings are converted into actionable tasks, milestones, and tracked deliverables.
                </p>
              </div>

              {/* Filter by Department */}
              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-600">Filter Department:</span>
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering &amp; Design</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Production">Production &amp; Yard</option>
                  <option value="QHSE">QHSE &amp; Certification</option>
                </select>
              </div>
            </div>

            {/* Task Cards */}
            <div className="space-y-3 pt-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-2xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{task.title}</span>
                      <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {task.vesselProgram}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded border ${
                          task.status === 'Complete'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : task.status === 'In Progress'
                            ? 'bg-teal-50 text-teal-800 border-teal-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          task.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Progress & Accountability Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-2xs pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Department:</span>
                      <span className="font-bold text-slate-800">{task.department}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-slate-400 font-medium">Assignee:</span>
                      <span className="font-semibold text-slate-700">{task.assignee}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-teal-600 h-1.5 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-700">{task.progress}%</span>
                      </div>

                      <span className="text-slate-500 font-mono">
                        {task.daysRemaining > 0 ? `${task.daysRemaining} days left` : 'Completed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HOW DATA TRANSLATES INTO THE FUTURE OPERATING MODEL                 */}
      {/* ========================================================================= */}
      {activeTabMode === 'how_it_works' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-3xs font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 px-2 py-0.5 rounded font-mono">
                Methodological Flow &bull; Chapter 5 &amp; 6
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                The 4-Step Analytical Pipeline: From Your Survey to Live PMO Operations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Your questionnaire answers are not passive compliance checkboxes. They directly train the PMO architecture to remove operational friction in your specific daily workflows.
              </p>
            </div>

            {/* 4 Pipeline Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">
                    Dual-Respondent Questionnaire Intake
                  </h3>
                </div>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  The Department Manager and Discipline Lead rate current vs. preferred practices across all 7 canonical sections, identifying software tools and operational delays.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-800 text-white font-mono font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-xs font-bold text-teal-950">
                    PJMAK Analytical Engine Gap Synthesis
                  </h3>
                </div>
                <p className="text-2xs text-teal-800 leading-relaxed">
                  The engine computes the Departmental Friction Index (DFI) and Shadow-Work Prevalence (SWP), exposing gaps between management intent and ground execution.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">
                    Tailored 16-Week Implementation Milestones
                  </h3>
                </div>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Instead of generic corporate rules, targeted PMO interventions are scheduled specifically where friction is high, while redundant forms are sunset.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-mono font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-xs font-bold text-emerald-950">
                    Single-Screen Executive Control &amp; Monitoring
                  </h3>
                </div>
                <p className="text-2xs text-emerald-800 leading-relaxed">
                  Live tracking of critical-path float, drawing freeze status (MDR), and 48-hour blocker resolutions directly inside the PMO executive dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-extrabold text-white">
            Ready to contribute your operational perspective?
          </h3>
          <p className="text-2xs text-slate-300">
            Completing the questionnaire for your department ensures your workflow challenges are directly prioritized in the implementation plan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('questionnaire')}
          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Continue Questionnaire</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
