export type StakeholderCategoryId =
  | 'engineering'
  | 'procurement'
  | 'production'
  | 'quality_hseq'
  | 'logistics'
  | 'finance'
  | 'it_digital'
  | 'hr_admin'
  | 'vendors'
  | 'pmo_director'
  | 'project_manager'
  | 'asset_owner';

export type VesselProgramme =
  | 'H-Class USV (12m)'
  | 'X-Class USV (18m)'
  | 'XL-Class USV (24m+)'
  | 'Multi-Class / Fleet-Wide'
  | 'Emerging / Technology Platform';

export interface StakeholderCategoryInfo {
  id: StakeholderCategoryId;
  title: string;
  shortTitle: string;
  focusArea: string;
  scopeSummary: string;
  targetRoles: string[];
  iconName: string;
}

export interface QuestionOption {
  id: number; // 1: Opaque Isolation, 2: Superficial Compliance, 3: Disciplined Execution, 4: Administrative Overhead
  text: string;
}

export interface QuestionnaireItem {
  id: string;
  number: number;
  dimensionId: '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7';
  dimensionTitle: string;
  text: string;
  options: QuestionOption[];
}

export interface DepartmentalSoftwareConfig {
  partATitle: string;
  partADescription: string;
  availableTools: string[];
  partBTitle: string;
  partBDescription: string;
  partBScale: {
    level: number;
    title: string;
    description: string;
  }[];
}

// Backward compatibility alias
export type Section47Config = DepartmentalSoftwareConfig;

export interface RoleQuestionnaire {
  categoryId: StakeholderCategoryId;
  title: string;
  purpose?: string;
  description: string;
  questions: QuestionnaireItem[];
  softwareInventory: DepartmentalSoftwareConfig;
  section47?: DepartmentalSoftwareConfig; // backward-compatibility alias
}

export interface QuestionResponse {
  questionId: string;
  selectedOption?: number; // 1 to 4
  currentState?: number; // 1 to 4
  preferredState?: number; // 1 to 4
  evidence?: string;
  flagged?: boolean;
}

export interface Section42Response {
  selectedTools: string[];
  customTool?: string;
  integrationMaturity?: number | null; // 1 to 4
}

// Backward compatibility alias
export type Section47Response = Section42Response;

export interface RespondentProfile {
  assessmentId: string;
  respondentId: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  category: StakeholderCategoryId;
  vesselProgramme: VesselProgramme;
  location: string;
  experienceYears?: string;
}

export interface UserAccount {
  username: string;
  displayName: string;
  category: StakeholderCategoryId;
  roleTitle: string;
  department: string;
  isAssetOwner: boolean;
  isOwner?: boolean; // Ali Kashefi - System Owner & Lead Consultant
}

export interface AssessmentSubmission {
  assessmentId: string;
  respondentId: string;
  profile: RespondentProfile;
  responses: Record<string, QuestionResponse>;
  section42?: Section42Response;
  section47: Section47Response;
  status: 'draft' | 'completed';
  createdAt: string;
  completedAt?: string;
  totalQuestions: number;
  completedCurrent: number;
  completedPreferred: number;
}

export interface AssessmentSubmissionPayload {
  assessmentId: string;
  respondentId: string;
  timestamp: string;
  metadata: {
    systemVersion: string;
    framework: string;
    scope: string;
    standardsContext: string;
    parentAffiliation: string;
  };
  respondentProfile: {
    fullName: string;
    role: string;
    department: string;
    stakeholderCategory: string;
    vesselProgramme: string;
    location: string;
  };
  responses: {
    questionId: string;
    questionNumber: number;
    dimensionId: string;
    dimensionTitle: string;
    questionText: string;
    currentState: number | null;
    currentStateText: string | null;
    preferredState: number | null;
    preferredStateText: string | null;
    evidence: string;
    flagged: boolean;
  }[];
  section42?: {
    selectedTools: string[];
    customTool: string;
    integrationMaturityLevel: number | null;
  };
  section47: {
    selectedTools: string[];
    customTool: string;
    integrationMaturityLevel: number | null;
  };
}

export interface FlatAssessmentRecord {
  assessmentId: string;
  respondentId: string;
  respondentName: string;
  stakeholderCategory: string;
  role: string;
  department: string;
  vesselProgramme: string;
  dimensionId: string;
  questionId: string;
  questionNumber: number;
  questionText: string;
  currentStateResponse: string;
  preferredStateResponse: string;
  evidence: string;
  section42Tools?: string;
  section42MaturityLevel?: string;
  section42MaturityText?: string;
  section47Tools: string;
  section47MaturityLevel: string;
  section47MaturityText: string;
  timestamp: string;
  completionStatus: string;
}

export interface ReferenceDimension {
  id: '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7';
  title: string;
  subtitle: string;
  leadSummary: string;
  sections: {
    title: string;
    bulletPoints: string[];
  }[];
  keyTakeaways: string[];
}
