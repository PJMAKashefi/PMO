import React from 'react';
import { PjmakLogo } from './PjmakLogo';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Cpu,
  FileSpreadsheet,
  Globe2,
  Lock,
  Ship,
  Sparkles,
  Users,
} from 'lucide-react';
import { NavTabId } from './Header';

interface WelcomeSectionProps {
  onNavigate: (tab: NavTabId) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4" id="welcome-section-container">
      {/* 1. Hero Card featuring PJMAK Logo & Title */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-red-600 to-blue-700" />

        {/* Branded Logo Showcase */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs inline-block">
            <PjmakLogo size="lg" showSubtitle={true} />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Enterprise Integration &amp; Project Control Solution Architecture
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          PMO ESTABLISHMENT SOFTWARE / TOOL — SEA-KIT
        </h1>
        <p className="text-base sm:text-xl font-medium text-slate-600 mt-2 max-w-3xl mx-auto">
          Project Delivery Framework &amp; Stakeholder Assessment (Chapter 4 Scope)
        </p>

        <p className="text-sm text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Prepared for <span className="font-semibold text-slate-800">Sea-Kit International Ltd</span> (a Fugro company), Nootdorp &amp; Tollesbury Yard, by <span className="font-semibold text-slate-800">PJMAK</span> (Project Management Key).
        </p>

        {/* Quick Action Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="welcome-start-assessment-btn"
            onClick={() => onNavigate('profile_setup')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
          >
            <span>Begin Stakeholder Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="welcome-view-principles-btn"
            onClick={() => onNavigate('principles')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-300 shadow-2xs transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <span>Review Guiding Principles</span>
          </button>

          <button
            id="welcome-view-reference-btn"
            onClick={() => onNavigate('reference_model')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-300 shadow-2xs transition-colors"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Explore PMO Reference Model</span>
          </button>
        </div>
      </div>

      {/* 2. Operational Context & Maritime Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <Ship className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">High-Performance USV Builds</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Coordinating concurrent vessel programmes across <span className="font-semibold text-slate-800">H-Class (12m)</span>, <span className="font-semibold text-slate-800">X-Class (18m)</span>, and <span className="font-semibold text-slate-800">XL-Class (24m+)</span> Uncrewed Surface Vessels for maritime, offshore energy, ocean science, and defence.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Maritime Class &amp; Safety Standards</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Rigorous engineering and production compliance under <span className="font-semibold text-slate-800">Lloyd&apos;s Register Unmanned Marine Systems (UMS)</span> code and <span className="font-semibold text-slate-800">MCA Category 0</span> commercial vessel requirements.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Fugro Group Alignment</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Providing reliable governance and reporting interfaces to Fugro while preserving Sea-Kit&apos;s operational autonomy, naval agility, and technical innovation culture.
          </p>
        </div>
      </div>

      {/* 3. Strict Chapter 4 Mandate & Boundaries Box */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 text-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>System Scope Mandate &amp; Non-Evaluative Architecture</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          In strict accordance with the system specification, this tool is restricted through <strong>Chapter 4 Content</strong>. It provides the proposed reference model, role-specific stakeholder questionnaires, and structured data-collection pathways.
        </p>
        <div className="bg-white/80 p-3.5 rounded-lg border border-amber-200/80 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-start gap-2">
            <span className="text-red-600 font-bold">&bull;</span>
            <span><strong>Strict Prohibition:</strong> No automated scoring, ranking, maturity labels, gap analysis, or automated design roadmaps are generated.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">&bull;</span>
            <span><strong>Clean Data Capture:</strong> Captures both Current Practice and Preferred Ways of Working with evidence for downstream analytics pipelines.</span>
          </div>
        </div>
      </div>

      {/* 4. Structured Pathway Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Assessment Workflow &amp; Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase">Step 1</div>
            <div className="text-sm font-bold text-slate-800 mt-1">Review Framework</div>
            <div className="text-xs text-slate-600 mt-1">Examine the 6 PMO reference model dimensions from Chapter 4.</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase">Step 2</div>
            <div className="text-sm font-bold text-slate-800 mt-1">Select Profile</div>
            <div className="text-xs text-slate-600 mt-1">Pick your domain (Engineering, Yard, Procurement, QA, PM, etc.) and vessel class.</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase">Step 3</div>
            <div className="text-sm font-bold text-slate-800 mt-1">Complete Module</div>
            <div className="text-xs text-slate-600 mt-1">Assess Current vs Preferred practices and Section 4.7 tool inventory.</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase">Step 4</div>
            <div className="text-sm font-bold text-slate-800 mt-1">Capture &amp; Export</div>
            <div className="text-xs text-slate-600 mt-1">Generate a timestamped Assessment ID and export structured JSON/CSV data.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
