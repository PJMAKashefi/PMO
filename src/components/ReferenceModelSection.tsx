import React, { useState } from 'react';
import { PMO_REFERENCE_DIMENSIONS } from '../data/pmoReferenceModel';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Search,
  Sparkles,
} from 'lucide-react';
import { NavTabId } from './Header';

interface ReferenceModelSectionProps {
  onNavigate: (tab: NavTabId) => void;
}

export const ReferenceModelSection: React.FC<ReferenceModelSectionProps> = ({ onNavigate }) => {
  const [selectedDimensionId, setSelectedDimensionId] = useState<'all' | '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6'>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '4.1': true,
    '4.2': true,
    '4.3': true,
    '4.4': true,
    '4.5': true,
    '4.6': true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDimensions = PMO_REFERENCE_DIMENSIONS.filter((dim) => {
    if (selectedDimensionId !== 'all' && dim.id !== selectedDimensionId) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      dim.title.toLowerCase().includes(query) ||
      dim.subtitle.toLowerCase().includes(query) ||
      dim.leadSummary.toLowerCase().includes(query) ||
      dim.sections.some(
        (sec) =>
          sec.title.toLowerCase().includes(query) ||
          sec.bulletPoints.some((bp) => bp.toLowerCase().includes(query))
      )
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4" id="reference-model-container">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>The Proposed PMO Reference Model &bull; Chapter 4 Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sea-Kit Project Delivery Framework (Reference Model)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          The reference model provides an operational integration and decision-support capability connecting engineering, software (G-SAVI), yard manufacturing, procurement, quality, finance, and Fugro governance across concurrent H, X, and XL-Class vessel builds.
        </p>

        {/* Dimension Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4">
          <button
            onClick={() => setSelectedDimensionId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedDimensionId === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Dimensions (4.1 to 4.6)
          </button>
          {PMO_REFERENCE_DIMENSIONS.map((dim) => (
            <button
              key={dim.id}
              onClick={() => setSelectedDimensionId(dim.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedDimensionId === dim.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dim {dim.id}: {dim.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference model (e.g. 'VDR', 'Stage-Gate', 'Fugro', '48-hour', 'Service Sunset')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
        <button
          onClick={() => {
            const allExpanded = Object.values(expandedSections).every(Boolean);
            const newState: Record<string, boolean> = {};
            PMO_REFERENCE_DIMENSIONS.forEach((d) => (newState[d.id] = !allExpanded));
            setExpandedSections(newState);
          }}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 whitespace-nowrap"
        >
          {Object.values(expandedSections).every(Boolean) ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Dimensions Content Display */}
      <div className="space-y-6">
        {filteredDimensions.map((dim) => {
          const isExpanded = !!expandedSections[dim.id];
          return (
            <div
              key={dim.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              id={`reference-dimension-${dim.id.replace('.', '-')}`}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(dim.id)}
                className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200 cursor-pointer flex items-center justify-between hover:bg-slate-100/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded font-mono">
                      Dimension {dim.id}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {dim.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {dim.subtitle}
                  </p>
                </div>
                <div className="text-slate-400 hover:text-slate-700 pl-4">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>

              {/* Lead Summary */}
              <div className="px-6 py-4 bg-sky-50/40 border-b border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {dim.leadSummary}
              </div>

              {/* Expandable Sections */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {dim.sections.map((sec, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2.5"
                      >
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          {sec.title}
                        </h3>
                        <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                          {sec.bulletPoints.map((bp, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2">
                              <span className="text-slate-400 font-bold mt-0.5">&bull;</span>
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Key Takeaways */}
                  <div className="bg-slate-100/70 rounded-lg p-3.5 border border-slate-200">
                    <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Key Architectural Guardrails (Dim {dim.id})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dim.keyTakeaways.map((takeaway, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs bg-white text-slate-800 px-3 py-1 rounded-md border border-slate-200 font-medium"
                        >
                          &bull; {takeaway}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold">Ready to assess your role against Chapter 4?</h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure your respondent profile to begin your customized questionnaire.
          </p>
        </div>
        <button
          id="ref-model-start-questionnaire-btn"
          onClick={() => onNavigate('profile_setup')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <span>Setup Stakeholder Profile</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
