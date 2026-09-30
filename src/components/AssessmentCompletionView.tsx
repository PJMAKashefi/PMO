import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Sparkles, Database, Layers, ArrowLeft } from 'lucide-react';
import { NavTabId } from './Header';

interface AssessmentCompletionViewProps {
  onNavigate?: (tab: NavTabId) => void;
  onResetAssessment?: () => void;
}

export const AssessmentCompletionView: React.FC<AssessmentCompletionViewProps> = ({
  onNavigate,
  onResetAssessment,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4" id="assessment-completion-container">
      {/* Success Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-3xs font-extrabold uppercase tracking-wider bg-teal-400 text-slate-950 px-2.5 py-0.5 rounded-full">
              Assessment Submitted Successfully
            </span>
            <span className="text-xs text-slate-400 font-mono">
              PJMAK Diagnostic Engine v1.0
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Thank You. Your Operational Reality is Now Driving Real Change.
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Your inputs have been ingested into the analytical engine. By capturing both managerial intent and ground-level execution friction, we are actively replacing shadow trackers with a streamlined, specialized operating model.
          </p>
        </div>
      </div>

      {/* What Happens Next: The Transformation Roadmap Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <span className="text-3xs font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
              Your Transformation Roadmap
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">
              What is Coming Next for Your Department
            </h2>
          </div>
          <Sparkles className="w-5 h-5 text-teal-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1.5">
            <div className="text-3xs font-bold uppercase tracking-wider text-teal-700">Phase 1 (Complete)</div>
            <div className="text-xs font-bold text-slate-900">Diagnostic Intake</div>
            <p className="text-3xs text-slate-600 leading-relaxed">
              Your dual-respondent inputs captured baseline friction and tool inventory.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="text-3xs font-bold uppercase tracking-wider text-slate-500">Phase 2 (Upcoming)</div>
            <div className="text-xs font-bold text-slate-900">Co-Creation Workshops</div>
            <p className="text-3xs text-slate-600 leading-relaxed">
              Isolating root causes and designing clean data handovers with your team.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="text-3xs font-bold uppercase tracking-wider text-slate-500">Phase 3</div>
            <div className="text-xs font-bold text-slate-900">Workflow Activation</div>
            <p className="text-3xs text-slate-600 leading-relaxed">
              Sunsetting legacy spreadsheets and activating targeted pull mechanisms.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="text-3xs font-bold uppercase tracking-wider text-slate-500">Phase 4</div>
            <div className="text-xs font-bold text-slate-900">PJMAK Command Center</div>
            <p className="text-3xs text-slate-600 leading-relaxed">
              Live executive dashboard access for real-time critical path visibility.
            </p>
          </div>
        </div>
      </div>

      {/* The Core Promise: Service Sunset & Anti-Bureaucracy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>The Service Sunset Guarantee</span>
          </div>
          <p className="text-2xs text-slate-600 leading-relaxed">
            If your responses highlighted reporting steps that create administrative drag without protecting the schedule, our engine triggers an automatic review to simplify or eliminate them.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Database className="w-4 h-4 text-teal-600" />
            <span>Single Source of Truth</span>
          </div>
          <p className="text-2xs text-slate-600 leading-relaxed">
            You will no longer need to maintain parallel local trackers. All data flows securely into the unified PJMAK dashboard, giving you transparent visibility across vessel streams.
          </p>
        </div>
      </div>

      {/* Navigation Actions */}
      {onNavigate && (
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
          <button
            onClick={() => onNavigate('profile_setup')}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Select Another Department / Role
          </button>

          <button
            onClick={() => onNavigate('proposal')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Review PMO Proposal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
