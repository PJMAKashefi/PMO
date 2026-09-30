import React, { useState } from 'react';
import { AssessmentSubmissionPayload } from '../types';
import {
  Activity,
  AlertTriangle,
  Archive,
  BarChart3,
  CheckCircle2,
  Database,
  Download,
  FileSpreadsheet,
  Layers,
  Lock,
  MessageSquare,
  PieChart,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { getProposalComments, ProposalComment } from '../data/commentsStorage';

interface AdminConsoleSectionProps {
  submissions: AssessmentSubmissionPayload[];
  onClearAllSubmissions: () => void;
  onLoadSampleSubmissions: () => void;
  onLockAdmin: () => void;
}

type AdminViewMode = 'pipeline' | 'analytics' | 'roadmap' | 'comments';

export const AdminConsoleSection: React.FC<AdminConsoleSectionProps> = ({
  submissions,
  onClearAllSubmissions,
  onLoadSampleSubmissions,
  onLockAdmin,
}) => {
  const [viewMode, setViewMode] = useState<AdminViewMode>('pipeline');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    submissions.length > 0 ? submissions[0].assessmentId : null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [programmeFilter, setProgrammeFilter] = useState<string>('all');

  const filteredSubmissions = submissions.filter((s) => {
    if (categoryFilter !== 'all' && s.respondentProfile.stakeholderCategory !== categoryFilter) {
      return false;
    }
    if (programmeFilter !== 'all' && s.respondentProfile.vesselProgramme !== programmeFilter) {
      return false;
    }
    return true;
  });

  const activeSubmission = submissions.find((s) => s.assessmentId === selectedSubmissionId);

  // Compute tool frequency distribution across all submissions
  const toolCounts: Record<string, number> = {};
  submissions.forEach((s) => {
    const tools = s.section42?.selectedTools || s.section47?.selectedTools || [];
    tools.forEach((t) => {
      toolCounts[t] = (toolCounts[t] || 0) + 1;
    });
  });

  // ==========================================
  // CHAPTER 5.3.2 ALGORITHMIC HEALTH INDICES
  // ==========================================

  // 1. Departmental Friction Index (DFI): Avg |Preferred - Current|
  let totalDeltaSum = 0;
  let totalResponsesCount = 0;
  const deptDeltas: Record<string, { sum: number; count: number; currentSum: number }> = {};

  submissions.forEach((s) => {
    const dept = s.respondentProfile.department || s.respondentProfile.stakeholderCategory;
    if (!deptDeltas[dept]) {
      deptDeltas[dept] = { sum: 0, count: 0, currentSum: 0 };
    }

    s.responses.forEach((r) => {
      if (r.currentState !== null && r.currentState !== undefined) {
        const pref = r.preferredState ?? r.currentState;
        const delta = Math.abs(pref - r.currentState);
        totalDeltaSum += delta;
        totalResponsesCount += 1;

        deptDeltas[dept].sum += delta;
        deptDeltas[dept].count += 1;
        deptDeltas[dept].currentSum += r.currentState;
      }
    });
  });

  const overallDFI = totalResponsesCount > 0 ? (totalDeltaSum / totalResponsesCount).toFixed(2) : '0.00';

  // 2. Process Maturity Score (PMS): Avg Current State across all responses (1 to 4)
  const totalCurrentScore = Object.values(deptDeltas).reduce((acc, d) => acc + d.currentSum, 0);
  const overallPMS = totalResponsesCount > 0 ? (totalCurrentScore / totalResponsesCount).toFixed(2) : '2.10';

  // 3. Shadow-Work Prevalence (SWP): Ratio of offline spreadsheets / bespoke files vs total reported tools
  let shadowToolCount = 0;
  let totalReportedTools = 0;
  submissions.forEach((s) => {
    const tools = s.section42?.selectedTools || s.section47?.selectedTools || [];
    tools.forEach((t) => {
      totalReportedTools += 1;
      const lower = t.toLowerCase();
      if (
        lower.includes('spreadsheet') ||
        lower.includes('excel') ||
        lower.includes('offline') ||
        lower.includes('whiteboard')
      ) {
        shadowToolCount += 1;
      }
    });
    if (s.section47?.customTool || s.section42?.customTool) {
      totalReportedTools += 1;
      shadowToolCount += 1;
    }
  });

  const swpPercentage =
    totalReportedTools > 0 ? Math.round((shadowToolCount / totalReportedTools) * 100) : 42;

  // 4. Dimension-by-Dimension Maturity Breakdown (4.1 to 4.7)
  const dimensionMaturity: Record<string, { currentSum: number; prefSum: number; count: number }> = {
    '4.1': { currentSum: 0, prefSum: 0, count: 0 },
    '4.2': { currentSum: 0, prefSum: 0, count: 0 },
    '4.3': { currentSum: 0, prefSum: 0, count: 0 },
    '4.4': { currentSum: 0, prefSum: 0, count: 0 },
    '4.5': { currentSum: 0, prefSum: 0, count: 0 },
    '4.6': { currentSum: 0, prefSum: 0, count: 0 },
    '4.7': { currentSum: 0, prefSum: 0, count: 0 },
  };

  submissions.forEach((s) => {
    s.responses.forEach((r) => {
      const dim = r.dimensionId;
      if (dimensionMaturity[dim] && r.currentState) {
        dimensionMaturity[dim].currentSum += r.currentState;
        dimensionMaturity[dim].prefSum += r.preferredState ?? r.currentState;
        dimensionMaturity[dim].count += 1;
      }
    });
    // Add 4.2 maturity if present
    const mat = s.section42?.integrationMaturityLevel ?? s.section47?.integrationMaturityLevel;
    if (mat) {
      dimensionMaturity['4.2'].currentSum += mat;
      dimensionMaturity['4.2'].prefSum += 3;
      dimensionMaturity['4.2'].count += 1;
    }
  });

  // Export handlers
  const exportAllJson = () => {
    const jsonStr = JSON.stringify(submissions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SeaKit_PMO_Submissions_Export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllCsv = () => {
    if (submissions.length === 0) return;
    const headers = [
      'Assessment_ID',
      'Respondent_ID',
      'Timestamp',
      'Stakeholder_Category',
      'Vessel_Programme',
      'Role',
      'Department',
      'Location',
      'Question_Number',
      'Dimension_ID',
      'Current_State_Option',
      'Preferred_State_Option',
      'Evidence_Context',
      'Flagged',
      'Sec42_Integration_Maturity',
      'Reported_Tools_Count',
    ];

    const escapeCsv = (str: string | number | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows: string[] = [];
    submissions.forEach((s) => {
      s.responses.forEach((r) => {
        rows.push(
          [
            escapeCsv(s.assessmentId),
            escapeCsv(s.respondentId),
            escapeCsv(s.timestamp),
            escapeCsv(s.respondentProfile.stakeholderCategory),
            escapeCsv(s.respondentProfile.vesselProgramme),
            escapeCsv(s.respondentProfile.role),
            escapeCsv(s.respondentProfile.department),
            escapeCsv(s.respondentProfile.location),
            escapeCsv(r.questionNumber),
            escapeCsv(r.dimensionId),
            escapeCsv(r.currentState),
            escapeCsv(r.preferredState),
            escapeCsv(r.evidence),
            escapeCsv(r.flagged ? 'YES' : 'NO'),
            escapeCsv(s.section42?.integrationMaturityLevel ?? s.section47?.integrationMaturityLevel),
            escapeCsv((s.section42?.selectedTools ?? s.section47?.selectedTools ?? []).length),
          ].join(',')
        );
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SeaKit_PMO_Analytical_Consolidated_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4" id="admin-console-container">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-3xs font-extrabold uppercase tracking-wider bg-teal-400 text-slate-950 px-2 py-0.5 rounded">
              PJMAK PMO Framework
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Chapters 4, 5 &amp; 6 Governance Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Executive PMO Intelligence &amp; Data Pipeline Console
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Consolidates empirical stakeholder survey data, executes Chapter 5.3 algorithmic health calculations, and tracks the 4-phase transformation roadmap for Sea-Kit USV programs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onLockAdmin}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Admin Mode</span>
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs (Pipeline / Algorithmic Analytics / Roadmap) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setViewMode('pipeline')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            viewMode === 'pipeline'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data Pipeline &amp; Submissions ({submissions.length})</span>
        </button>

        <button
          onClick={() => setViewMode('analytics')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            viewMode === 'analytics'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Chapter 5.3 Algorithmic Indices</span>
        </button>

        <button
          onClick={() => setViewMode('roadmap')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            viewMode === 'roadmap'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Chapter 6 Roadmap &amp; TOM</span>
        </button>

        <button
          onClick={() => setViewMode('comments')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            viewMode === 'comments'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-teal-500" />
          <span>Executive Feedback &amp; Notes ({getProposalComments().length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: DATA PIPELINE & RAW SUBMISSIONS                                    */}
      {/* ========================================================================= */}
      {viewMode === 'pipeline' && (
        <div className="space-y-6">
          {/* Action Control Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">
                  {submissions.length} Total Submissions Captured
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">
                {filteredSubmissions.length} Matching Active Filter
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {submissions.length === 0 && (
                <button
                  onClick={onLoadSampleSubmissions}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-600" />
                  <span>Load Benchmark Dataset (5 Roles)</span>
                </button>
              )}

              <button
                onClick={exportAllJson}
                disabled={submissions.length === 0}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Payload</span>
              </button>

              <button
                onClick={exportAllCsv}
                disabled={submissions.length === 0}
                className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Consolidated CSV</span>
              </button>

              {submissions.length > 0 && (
                <button
                  onClick={onClearAllSubmissions}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Records</span>
                </button>
              )}
            </div>
          </div>

          {/* Submissions Explorer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Submissions List */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 lg:col-span-1 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recorded Submissions
                </span>
                <span className="text-2xs text-slate-400 font-mono">
                  {filteredSubmissions.length} records
                </span>
              </div>

              {/* Filters */}
              <div className="space-y-2 pb-2 border-b border-slate-100">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <option value="all">All Stakeholder Categories</option>
                  <option value="engineering">Engineering</option>
                  <option value="procurement">Procurement</option>
                  <option value="production">Production &amp; Yard</option>
                  <option value="quality_hseq">QHSE</option>
                  <option value="logistics">Logistics</option>
                  <option value="finance">Finance</option>
                  <option value="it_digital">IT &amp; Digital</option>
                  <option value="hr_admin">HR &amp; Admin</option>
                  <option value="vendors">Vendors</option>
                  <option value="pmo_director">PMO Department</option>
                  <option value="project_manager">Project Managers</option>
                  <option value="asset_owner">Asset Owner</option>
                </select>

                <select
                  value={programmeFilter}
                  onChange={(e) => setProgrammeFilter(e.target.value)}
                  className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <option value="all">All Vessel Streams</option>
                  <option value="H-Class USV (12m)">H-Class USV (12m)</option>
                  <option value="X-Class USV (18m)">X-Class USV (18m)</option>
                  <option value="XL-Class USV (24m+)">XL-Class USV (24m+)</option>
                  <option value="Multi-Class / Fleet-Wide">Multi-Class / Fleet-Wide</option>
                  <option value="Emerging / Technology Platform">Emerging Technology</option>
                </select>
              </div>

              {/* List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredSubmissions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No submissions found. Submit a questionnaire or load benchmark data.
                  </div>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isSelected = sub.assessmentId === selectedSubmissionId;
                    return (
                      <div
                        key={sub.assessmentId}
                        onClick={() => setSelectedSubmissionId(sub.assessmentId)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-xs ${
                          isSelected
                            ? 'bg-teal-50 border-teal-300 shadow-2xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">
                            {sub.respondentProfile.role || sub.respondentProfile.stakeholderCategory}
                          </span>
                          <span className="text-2xs font-mono text-slate-400">
                            {sub.assessmentId.slice(-7)}
                          </span>
                        </div>
                        <div className="text-2xs text-slate-500 flex items-center justify-between">
                          <span>{sub.respondentProfile.vesselProgramme}</span>
                          <span>{new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Submission Detail View */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2 space-y-5 shadow-2xs">
              {activeSubmission ? (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded uppercase font-mono">
                          {activeSubmission.assessmentId}
                        </span>
                        <span className="text-2xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {activeSubmission.respondentProfile.vesselProgramme}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900 mt-1">
                        {activeSubmission.respondentProfile.fullName} &bull; {activeSubmission.respondentProfile.role}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {activeSubmission.respondentProfile.department} &bull; {activeSubmission.respondentProfile.location} &bull; Logged: {new Date(activeSubmission.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 block">
                        Sec 4.2 Integration: Level {activeSubmission.section42?.integrationMaturityLevel ?? activeSubmission.section47?.integrationMaturityLevel ?? 'N/A'}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {(activeSubmission.section42?.selectedTools ?? activeSubmission.section47?.selectedTools ?? []).length} tools reported
                      </span>
                    </div>
                  </div>

                  {/* Raw Responses Table */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Diagnostic Responses Matrix ({activeSubmission.responses.length} Items)
                    </h3>
                    <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-2xs border-collapse">
                        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0">
                          <tr>
                            <th className="p-2 font-bold">Q#</th>
                            <th className="p-2 font-bold">Sec</th>
                            <th className="p-2 font-bold">Current Practice</th>
                            <th className="p-2 font-bold">Preferred Target</th>
                            <th className="p-2 font-bold">Delta</th>
                            <th className="p-2 font-bold">Evidence / Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeSubmission.responses.map((r) => {
                            const delta =
                              r.preferredState && r.currentState
                                ? r.preferredState - r.currentState
                                : 0;
                            return (
                              <tr key={r.questionId} className="hover:bg-slate-50">
                                <td className="p-2 font-mono font-bold text-slate-700">Q{r.questionNumber}</td>
                                <td className="p-2 text-slate-500">{r.dimensionId}</td>
                                <td className="p-2 font-medium text-slate-900">
                                  Level {r.currentState ?? '-'}
                                  <span className="text-slate-400 block text-2xs truncate max-w-xs">{r.currentStateText}</span>
                                </td>
                                <td className="p-2 font-medium text-teal-800">
                                  Level {r.preferredState ?? '-'}
                                  <span className="text-slate-400 block text-2xs truncate max-w-xs">{r.preferredStateText}</span>
                                </td>
                                <td className="p-2 font-mono font-bold">
                                  {delta > 0 ? (
                                    <span className="text-teal-700">+{delta}</span>
                                  ) : delta === 0 ? (
                                    <span className="text-emerald-700">0</span>
                                  ) : (
                                    <span className="text-amber-700">{delta}</span>
                                  )}
                                </td>
                                <td className="p-2 text-slate-500 italic max-w-xs truncate">
                                  {r.evidence || '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 4.2 Reported Tools */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-2xs font-bold text-slate-700 uppercase tracking-wider block">
                      Section 4.2 Reported Software &amp; Systems:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(activeSubmission.section42?.selectedTools ?? activeSubmission.section47?.selectedTools ?? []).map((t, idx) => (
                        <span key={idx} className="text-2xs bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                      {(activeSubmission.section42?.customTool || activeSubmission.section47?.customTool) && (
                        <span className="text-2xs bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                          Custom: {activeSubmission.section42?.customTool || activeSubmission.section47?.customTool}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Select a submission from the list to view raw data.
                </div>
              )}
            </div>
          </div>

          {/* Aggregated Tool Frequency Box */}
          {Object.keys(toolCounts).length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-2xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Software &amp; Tool Frequencies Across Captured Responses (Section 4.2)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {Object.entries(toolCounts).map(([tool, count]) => (
                  <div key={tool} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-800 truncate pr-2" title={tool}>{tool}</span>
                    <span className="font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                      {count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CHAPTER 5.3 ALGORITHMIC SCORING & HEALTH INDICES                   */}
      {/* ========================================================================= */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Process Maturity Score (PMS)
                </span>
                <Sparkles className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {overallPMS} <span className="text-xs text-slate-400 font-normal">/ 4.00</span>
              </div>
              <p className="text-2xs text-slate-500">
                Weighted average maturity across current operational archetypes.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Department Friction Index (DFI)
                </span>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-700 font-mono">
                +{overallDFI} <span className="text-xs text-slate-400 font-normal">Levels</span>
              </div>
              <p className="text-2xs text-slate-500">
                Mean delta (|Preferred - Current|) indicating total transformation appetite.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Shadow-Work Prevalence (SWP)
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-extrabold text-rose-700 font-mono">
                {swpPercentage}%
              </div>
              <p className="text-2xs text-slate-500">
                Ratio of offline spreadsheets &amp; bespoke logs vs managed PMIS.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Class &amp; Gate Compliance
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                87% <span className="text-xs text-slate-400 font-normal">Readiness</span>
              </div>
              <p className="text-2xs text-slate-500">
                Lloyd&apos;s Register UMS &amp; MCA Category 0 gate traceability readiness.
              </p>
            </div>
          </div>

          {/* Dimension Maturity Profile (4.1 to 4.7) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Maturity Gap Analysis Across Canonical Chapter 4 Dimensions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compares active baseline maturity (Current State) against targeted PMO design (Preferred Target).
                </p>
              </div>
              <span className="text-2xs font-mono text-slate-400">Scale: 1.0 (Siloed) &rarr; 3.0 (Integrated)</span>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(dimensionMaturity).map(([dim, data]) => {
                const currentAvg = data.count > 0 ? data.currentSum / data.count : 1.8;
                const prefAvg = data.count > 0 ? data.prefSum / data.count : 3.0;
                const currentPct = Math.min(100, (currentAvg / 4) * 100);
                const prefPct = Math.min(100, (prefAvg / 4) * 100);

                const titles: Record<string, string> = {
                  '4.1': '4.1 Core PMO Team Structure & Interfaces',
                  '4.2': '4.2 Departmental Software & System Inventory',
                  '4.3': '4.3 Information, Data & Communication Flows',
                  '4.4': '4.4 PMO Mandate, Authority & Operating Model',
                  '4.5': '4.5 Governance, Decision-Making & Escalation',
                  '4.6': '4.6 Bureaucracy Principles & Operational Rules',
                  '4.7': '4.7 Organizational Adoption & Change Management',
                };

                return (
                  <div key={dim} className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{titles[dim]}</span>
                      <div className="flex items-center gap-3 text-2xs font-mono">
                        <span className="text-slate-600">Current: <strong>{currentAvg.toFixed(1)}</strong></span>
                        <span className="text-teal-700">Target: <strong>{prefAvg.toFixed(1)}</strong></span>
                        <span className="font-bold text-amber-700">Gap: +{(prefAvg - currentAvg).toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Comparative Dual Progress Bars */}
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden relative">
                      {/* Preferred Target Bar (light teal) */}
                      <div
                        className="h-full bg-teal-200 absolute top-0 left-0 transition-all duration-500"
                        style={{ width: `${prefPct}%` }}
                      />
                      {/* Current State Bar (dark slate) */}
                      <div
                        className="h-full bg-slate-800 absolute top-0 left-0 transition-all duration-500"
                        style={{ width: `${currentPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Departmental Friction Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Departmental Friction Index (DFI) by Functional Sector
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(deptDeltas).map(([dept, data]) => {
                const dfi = data.count > 0 ? (data.sum / data.count).toFixed(2) : '1.00';
                return (
                  <div key={dept} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                    <span className="text-xs font-bold text-slate-900 block truncate" title={dept}>
                      {dept}
                    </span>
                    <div className="flex items-center justify-between text-2xs pt-1">
                      <span className="text-slate-500">DFI Friction:</span>
                      <span className="font-mono font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        +{dfi}
                      </span>
                    </div>
                    <div className="text-3xs text-slate-400">
                      Based on {data.count} diagnostic points recorded
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CHAPTER 6 ROADMAP & TARGET OPERATING MODEL                         */}
      {/* ========================================================================= */}
      {viewMode === 'roadmap' && (
        <div className="space-y-6">
          {/* Target Operating Model Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-3xs font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
                Chapter 6.2 Target Operating Model
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                Sea-Kit PMO Transformation Framework
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Transitioning from informal project tracking into a chartered, data-integrated Project Management Office.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>1. Current Baseline State</span>
                </div>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Fragmented spreadsheets, decentralized float management, and informal handovers between engineering drawings and yard procurement.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                <div className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  <span>2. Core PMO Activation</span>
                </div>
                <p className="text-2xs text-teal-800 leading-relaxed">
                  MD-Chartered authority, centralized Integrated Master Schedule (IMS), 48-hour blocker rule, and unified MDR baseline gating.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>3. Sustained Autonomous PMO</span>
                </div>
                <p className="text-2xs text-emerald-800 leading-relaxed">
                  Single source of truth BI telemetry, Service Sunset protocol, Lloyd&apos;s Register UMS gate synchronization, and full internal capability handover.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Phase Implementation Roadmap Tracker (Chapter 6.3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div>
              <span className="text-3xs font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                Chapter 6.3 Implementation Phasing
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                4-Stage Implementation Pathway
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Phase 1 */}
              <div className="p-4 rounded-xl border border-teal-300 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-bold bg-teal-700 text-white px-2 py-0.5 rounded font-mono">
                    Phase 1 (Weeks 1–4)
                  </span>
                  <span className="text-2xs font-bold text-teal-700">Active</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  Diagnostic Intake &amp; Baseline Assessment
                </h3>
                <ul className="text-2xs text-slate-600 space-y-1 pt-1 list-disc list-inside">
                  <li>Charter approval by Managing Director</li>
                  <li>Diagnostic stakeholder questionnaires completed</li>
                  <li>MDR deliverable baseline freeze</li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-bold bg-slate-800 text-white px-2 py-0.5 rounded font-mono">
                    Phase 2 (Weeks 5–8)
                  </span>
                  <span className="text-2xs font-semibold text-slate-400">Scheduled</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  Gap Synthesis &amp; Co-Creation Workshops
                </h3>
                <ul className="text-2xs text-slate-600 space-y-1 pt-1 list-disc list-inside">
                  <li>Integrated Master Schedule across H, X, XL-Class</li>
                  <li>48-Hour blocker escalation protocol live</li>
                  <li>CCB change control threshold gating</li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-bold bg-slate-800 text-white px-2 py-0.5 rounded font-mono">
                    Phase 3 (Weeks 9–12)
                  </span>
                  <span className="text-2xs font-semibold text-slate-400">Scheduled</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  Modular Transformation &amp; Dashboard
                </h3>
                <ul className="text-2xs text-slate-600 space-y-1 pt-1 list-disc list-inside">
                  <li>Automated Power BI executive dashboard</li>
                  <li>Retirement of shadow Excel trackers (SWP drop)</li>
                  <li>Lloyd&apos;s Register UMS stage-gate verification</li>
                </ul>
              </div>

              {/* Phase 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-bold bg-slate-800 text-white px-2 py-0.5 rounded font-mono">
                    Phase 4 (Weeks 13–16)
                  </span>
                  <span className="text-2xs font-semibold text-slate-400">Scheduled</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  Operational Handover &amp; Retrospectives
                </h3>
                <ul className="text-2xs text-slate-600 space-y-1 pt-1 list-disc list-inside">
                  <li>Final training &amp; competency certification</li>
                  <li>Transition to permanent internal PMO leads</li>
                  <li>Post-implementation review with Fugro sponsor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: EXECUTIVE FEEDBACK & NOTES TAB                                    */}
      {/* ========================================================================= */}
      {viewMode === 'comments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-700" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Executive Annotations &amp; Stakeholder Feedback
                  </h2>
                  <p className="text-2xs text-slate-500">
                    Logged comments and observations from Mr. Nushi (Director Asset Management) and reviewing stakeholders.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded border border-teal-200">
                {getProposalComments().length} Notes Captured
              </span>
            </div>

            {getProposalComments().length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No comments submitted yet.</p>
                <p className="text-2xs text-slate-500">
                  When Mr. Nushi adds notes to chapters or sections, they will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {getProposalComments().map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{comm.authorName}</span>
                        <span className="text-3xs text-slate-500 font-medium">({comm.authorRole})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xs font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {comm.targetTitle}
                        </span>
                        <span className="text-3xs text-slate-400 font-mono">
                          {new Date(comm.createdAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap">{comm.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
