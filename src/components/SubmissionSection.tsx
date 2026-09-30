import React, { useState } from 'react';
import {
  AssessmentSubmissionPayload,
  QuestionResponse,
  RespondentProfile,
  RoleQuestionnaire,
  Section47Response,
  UserAccount,
} from '../types';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle,
  CheckCircle2,
  Copy,
  Download,
  FileCode,
  FileSpreadsheet,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AssessmentCompletionView } from './AssessmentCompletionView';
import { NavTabId } from './Header';

interface SubmissionSectionProps {
  questionnaire: RoleQuestionnaire;
  profile: RespondentProfile;
  responses: Record<string, QuestionResponse>;
  section47: Section47Response;
  currentUser: UserAccount | null;
  onNavigate: (tab: NavTabId) => void;
  onSubmitAssessment: () => void;
  isSubmitted: boolean;
  onResetAssessment: () => void;
}

export const SubmissionSection: React.FC<SubmissionSectionProps> = ({
  questionnaire,
  profile,
  responses,
  section47,
  currentUser,
  onNavigate,
  onSubmitAssessment,
  isSubmitted,
  onResetAssessment,
}) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const isOwner = currentUser?.isOwner ?? (currentUser?.isAssetOwner ?? false);

  const isToolInventoryComplete = section47.selectedTools.length > 0;
  const totalUnits = questionnaire.questions.length + 1;
  const answeredCount = questionnaire.questions.filter((q) => {
    const r = responses[q.id];
    return r && (r.selectedOption !== undefined || r.currentState !== undefined);
  }).length;
  const answeredUnits = answeredCount + (isToolInventoryComplete ? 1 : 0);

  const completionPct = totalUnits > 0 ? Math.round((answeredUnits / totalUnits) * 100) : 0;
  const isMaturityComplete = section47.integrationMaturity !== null;

  // Build the standardized JSON payload for downstream analytics (Python / SPSS / BI)
  const generatePayload = (): AssessmentSubmissionPayload => {
    const responseArray = questionnaire.questions.map((q) => {
      const resp = responses[q.id] || { questionId: q.id };
      const currentVal = resp.currentState ?? resp.selectedOption ?? null;
      const preferredVal = resp.preferredState ?? resp.selectedOption ?? currentVal ?? null;
      const currentOpt = q.options.find((o) => o.id === currentVal);
      const preferredOpt = q.options.find((o) => o.id === preferredVal);

      return {
        questionId: q.id,
        questionNumber: q.number,
        dimensionId: q.dimensionId,
        dimensionTitle: q.dimensionTitle,
        questionText: q.text,
        currentState: currentVal,
        currentStateText: currentOpt?.text ?? null,
        preferredState: preferredVal,
        preferredStateText: preferredOpt?.text ?? null,
        evidence: resp.evidence ?? '',
        flagged: resp.flagged ?? false,
      };
    });

    return {
      assessmentId: profile.assessmentId,
      respondentId: profile.respondentId,
      timestamp: new Date().toISOString(),
      metadata: {
        systemVersion: '2.0.0-PMO-Canonical-7-Sections',
        framework: 'Sea-Kit PMO Establishment Framework (PJMAK)',
        scope: 'Comprehensive Chapter 4 Model & 12 Stakeholder Questionnaires',
        standardsContext: "Lloyd's Register UMS Code / MCA Category 0",
        parentAffiliation: 'Sea-Kit International Ltd (a Fugro company)',
      },
      respondentProfile: {
        fullName: profile.fullName || 'Anonymous / Role Representative',
        role: profile.role || 'Unspecified Role',
        department: profile.department || questionnaire.title,
        stakeholderCategory: profile.category,
        vesselProgramme: profile.vesselProgramme,
        location: profile.location || 'Unspecified Yard / HQ',
      },
      responses: responseArray,
      section42: {
        selectedTools: section47.selectedTools,
        customTool: section47.customTool || '',
        integrationMaturityLevel: section47.integrationMaturity,
      },
      section47: {
        selectedTools: section47.selectedTools,
        customTool: section47.customTool || '',
        integrationMaturityLevel: section47.integrationMaturity,
      },
    };
  };

  const payload = generatePayload();
  const jsonString = JSON.stringify(payload, null, 2);

  // Generate clean CSV format for Ali Kashefi
  const generateCsv = (): string => {
    const headers = [
      'Assessment_ID',
      'Respondent_ID',
      'Timestamp',
      'Stakeholder_Category',
      'Role',
      'Department',
      'Question_Number',
      'Dimension_ID',
      'Dimension_Title',
      'Question_Text',
      'Current_State_Option',
      'Current_State_Text',
      'Preferred_State_Option',
      'Preferred_State_Text',
      'Evidence_Context',
      'Flagged_For_Review',
      'Sec42_Integration_Maturity',
      'Sec42_Selected_Tools',
    ];

    const escapeCsv = (str: string | number | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = payload.responses.map((r) => {
      return [
        escapeCsv(payload.assessmentId),
        escapeCsv(payload.respondentId),
        escapeCsv(payload.timestamp),
        escapeCsv(payload.respondentProfile.stakeholderCategory),
        escapeCsv(payload.respondentProfile.role),
        escapeCsv(payload.respondentProfile.department),
        escapeCsv(r.questionNumber),
        escapeCsv(r.dimensionId),
        escapeCsv(r.dimensionTitle),
        escapeCsv(r.questionText),
        escapeCsv(r.currentState),
        escapeCsv(r.currentStateText),
        escapeCsv(r.preferredState),
        escapeCsv(r.preferredStateText),
        escapeCsv(r.evidence),
        escapeCsv(r.flagged ? 'TRUE' : 'FALSE'),
        escapeCsv(payload.section42.integrationMaturityLevel),
        escapeCsv(payload.section42.selectedTools.join('; ')),
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SeaKit_PMO_${profile.category}_${profile.assessmentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    const csvContent = generateCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SeaKit_PMO_${profile.category}_${profile.assessmentId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // =========================================================================
  // VIEW FOR REGULAR PARTICIPANTS (Clean, non-analytical, confidential)
  // =========================================================================
  if (!isOwner) {
    if (isSubmitted) {
      return (
        <AssessmentCompletionView
          onNavigate={onNavigate}
          onResetAssessment={onResetAssessment}
        />
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6 px-4" id="participant-submission-container">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Assessment Submission</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Review &amp; Submit Questionnaire
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Please verify your completed responses before final submission. Once submitted, your feedback will be securely transmitted to the PMO Establishment Team (PJMAK).
          </p>

          {/* Participant Identity Summary (Removed Vessel Stream & Location) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Department:</span>
              <span className="font-bold text-slate-900">{profile.department || questionnaire.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Designated Role:</span>
              <span className="font-bold text-slate-900">{profile.role}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Assessment Progress:</span>
              <span className="font-bold text-teal-700 font-mono">
                {answeredUnits} of {totalUnits} units completed ({completionPct}%)
              </span>
            </div>
          </div>

          {/* Warning if partially complete */}
          {answeredUnits < totalUnits ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-3 text-xs text-amber-950">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <span className="font-extrabold text-sm text-amber-900 block">
                  Submission Blocked: {totalUnits - answeredUnits} Assessment Item(s) Incomplete
                </span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  You have completed <strong>{answeredUnits} of {totalUnits}</strong> diagnostic assessment units ({completionPct}%). To preserve study integrity and guarantee actionable findings for the PMO establishment model, all questions across all 7 sections must be answered before final submission.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('questionnaire')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg text-2xs transition-colors cursor-pointer"
                  >
                    <span>Return to Complete Unanswered Questions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">
                All {totalUnits} assessment items are complete! You are ready to transmit your responses to the PMO Establishment Team (PJMAK).
              </span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('questionnaire')}
              className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Questionnaire</span>
            </button>

            <button
              id="participant-submit-assessment-btn"
              disabled={answeredUnits < totalUnits}
              onClick={onSubmitAssessment}
              className={`w-full sm:flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 ${
                answeredUnits < totalUnits
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {answeredUnits < totalUnits
                  ? `Cannot Submit (${totalUnits - answeredUnits} Unanswered Questions)`
                  : 'Submit Questionnaire to PMO Lead'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW FOR SYSTEM OWNER (Ali Kashefi): Complete Analytics, Export & Pipeline
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4" id="submission-section-container">
      {/* 1. Status Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Owner Portal &bull; Ali Kashefi Analytical Control</span>
          </div>

          <button
            onClick={() => onNavigate('admin')}
            className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Open Executive Analytics &amp; Roadmap</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive Data Pipeline &amp; Normalized Payload Export
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Full ingestion format formatted for quantitative analysis, SPSS, Python pipelines, and Power BI dashboards.
        </p>

        {/* Key Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-5">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">
              Units Completed
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block font-mono">
              {answeredUnits} / {totalUnits}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">
              Completion Rate
            </span>
            <span className="text-xl font-extrabold text-teal-700 mt-0.5 block font-mono">
              {completionPct}%
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">
              Sec 4.2 Tool Inventory
            </span>
            <span className="text-sm font-extrabold text-slate-900 mt-1.5 block">
              {section47.selectedTools.length} tools ({isMaturityComplete ? `Lvl ${section47.integrationMaturity}` : 'Pending'})
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">
              Submission State
            </span>
            <span
              className={`text-sm font-extrabold mt-1.5 block ${
                isSubmitted ? 'text-teal-600' : 'text-amber-600'
              }`}
            >
              {isSubmitted ? 'Recorded in Session' : 'Draft In-Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Actions: Finalize & Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Record Submission &amp; Export Analytical Payload
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available exclusively to Ali Kashefi for cross-departmental synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="submit-record-action-btn"
              onClick={onSubmitAssessment}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                isSubmitted
                  ? 'bg-teal-700 text-white hover:bg-teal-800'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitted ? 'Submission Confirmed (Re-Record)' : 'Commit Submission Record'}</span>
            </button>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            id="export-download-json-btn"
            onClick={downloadJson}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all flex items-start gap-3 bg-white cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Download Structured JSON</span>
              <span className="text-2xs text-slate-500 mt-0.5 block">
                Normalized payload for Python, SPSS, or database imports
              </span>
            </div>
          </button>

          <button
            id="export-download-csv-btn"
            onClick={downloadCsv}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all flex items-start gap-3 bg-white cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Download Tabular CSV</span>
              <span className="text-2xs text-slate-500 mt-0.5 block">
                Tabular format for Excel analysis and Power BI reporting
              </span>
            </div>
          </button>

          <button
            id="export-copy-clipboard-btn"
            onClick={copyToClipboard}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all flex items-start gap-3 bg-white cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              {copied ? <Check className="w-5 h-5 text-teal-600" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {copied ? 'Copied to Clipboard!' : 'Copy Raw Payload'}
              </span>
              <span className="text-2xs text-slate-500 mt-0.5 block">
                Copy full JSON to clipboard for manual verification
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Payload Viewer / Code Box (Owner only) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Normalized Analytical JSON Payload
            </h3>
            <span className="text-2xs text-slate-500">
              Adheres strictly to the schema for automated SPSS and Python analytics.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-2.5 py-1 text-2xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-2xs font-mono max-h-80 overflow-y-auto leading-relaxed border border-slate-800">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
