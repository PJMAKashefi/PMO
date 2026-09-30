import React from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  FileCheck,
  GitCompare,
  HelpCircle,
  MessageSquare,
  Shield,
  UserCheck,
} from 'lucide-react';
import { NavTabId } from './Header';

interface PrinciplesSectionProps {
  onNavigate: (tab: NavTabId) => void;
}

export const PrinciplesSection: React.FC<PrinciplesSectionProps> = ({ onNavigate }) => {
  const principles = [
    {
      icon: Compass,
      title: 'Grounded in Sea-Kit’s Existing Reality',
      tagline: 'Does not assume a blank slate',
      description:
        'Sea-Kit already possesses functional methods for engineering, yard assembly, and project management. The assessment identifies what should be retained, scaled, simplified, or clarified rather than imposing a theoretical template.',
    },
    {
      icon: UserCheck,
      title: 'Tailored Strictly to Operational Roles',
      tagline: 'Domain-specific inquiry',
      description:
        'Questionnaires dynamically adapt to your exact domain—whether Engineering drawing baselines, Procurement long-lead lead times, Yard work-zone zoning, or Quality Lloyd’s Register UMS hold points.',
    },
    {
      icon: GitCompare,
      title: 'Dual Capture: Current vs. Preferred Practice',
      tagline: 'Structured comparative dimension',
      description:
        'Every question systematically captures (A) Current Way of Working and (B) Preferred Way of Working. This surfaces operational friction and cross-functional expectations without imposing preconceived answers.',
    },
    {
      icon: MessageSquare,
      title: 'Cross-Functional Multi-Perspective Evaluation',
      tagline: 'Connecting organizational interfaces',
      description:
        'Key handoffs (e.g., Engineering drawing freeze to Yard, Procurement long-lead to Finance VDR gates) are captured from both sides of the interface to illuminate discrepancies in visibility and coordination.',
    },
    {
      icon: FileCheck,
      title: 'Practical Examples & Real-World Evidence',
      tagline: 'Encouraging grounded project context',
      description:
        'Respondents are invited to cite specific vessel programmes (X-Class, H-Class, XL-Class), drawing sets, component lead-time challenges, or yard bottlenecks to enrich the qualitative evidence base.',
    },
    {
      icon: Shield,
      title: 'Confidential & Non-Evaluative',
      tagline: 'Not an evaluation of employee performance',
      description:
        'Responses evaluate system workflows, communication highways, and interface protocols. They are never used to rate or evaluate individual employee or departmental capability.',
    },
    {
      icon: Award,
      title: 'Zero Scoring or "Right Answer" Biases',
      tagline: 'Objective, unweighted data capture',
      description:
        'No option is tagged as "correct", "target standard", or assigned a numerical ranking score. All pathways reflect valid operational postures to allow authentic feedback.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4" id="principles-section-container">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Fundamental Methodological Principles</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Assessment Instructions &amp; Guiding Principles
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Please review the following ground rules prior to completing the stakeholder questionnaire. These principles govern the confidentiality, structure, and integrity of data collection across Sea-Kit International.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            id="principles-proceed-to-profile-btn"
            onClick={() => onNavigate('profile_setup')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <span>Proceed to Stakeholder Profile Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="principles-explore-ref-model-btn"
            onClick={() => onNavigate('reference_model')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-300 transition-colors"
          >
            <span>Read Chapter 4 Reference Model</span>
          </button>
        </div>
      </div>

      {/* Grid of Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{p.title}</h2>
                    <span className="text-2xs font-semibold text-teal-700 uppercase tracking-wider">
                      {p.tagline}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Questionnaire Format Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-600" />
          <span>How to Complete Your Questionnaire</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">A. Current Way of Working</span>
            Select the statement that most closely describes how your team or interface operates in practice today at Sea-Kit.
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">B. Preferred Way of Working</span>
            Select the statement that reflects how you believe this interface or process should operate to maximize delivery effectiveness.
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Evidence / Example (Optional)</span>
            Provide concrete context, drawing references, vessel class examples (H, X, XL), or historical lessons learned.
          </div>
        </div>
      </div>
    </div>
  );
};
