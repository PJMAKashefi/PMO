import {
  RoleQuestionnaire,
  StakeholderCategoryInfo,
  StakeholderCategoryId,
} from '../types';
import { engineeringQuestionnaire } from './questionnaires/engineering';
import { procurementQuestionnaire } from './questionnaires/procurement';
import { productionQuestionnaire } from './questionnaires/production';
import { qualityHseqQuestionnaire } from './questionnaires/qualityHseq';
import { logisticsQuestionnaire } from './questionnaires/logistics';
import { vendorsQuestionnaire } from './questionnaires/vendors';
import { pmoDirectorQuestionnaire } from './questionnaires/pmoDirector';
import { assetOwnerQuestionnaire } from './questionnaires/assetOwner';
import { projectManagerQuestionnaire } from './questionnaires/projectManager';
import { financeQuestionnaire } from './questionnaires/finance';
import { itDigitalQuestionnaire } from './questionnaires/itDigital';
import { hrAdminQuestionnaire } from './questionnaires/hrAdmin';

export const STAKEHOLDER_CATEGORIES: StakeholderCategoryInfo[] = [
  {
    id: 'engineering',
    title: 'Engineering Department',
    shortTitle: 'Engineering',
    focusArea: 'Long-lead handovers, software/G-SAVI interfaces, drawing baselines, ECNs, and design-freeze gates.',
    scopeSummary: 'Focuses on drawing package readiness, configuration control, VDR gates, Lloyd’s Register compliance, and engineering capacity across build lines.',
    targetRoles: ['Engineering & Design Manager', 'Lead Engineer / Principal Designer', 'Document Control'],
    iconName: 'Compass',
  },
  {
    id: 'procurement',
    title: 'Procurement Department',
    shortTitle: 'Procurement',
    focusArea: 'Spec handovers, commercial vs. technical boundaries, Tier-2/3 milestones, supplier logs, and unbudgeted procurement handling.',
    scopeSummary: 'Focuses on long-lead material commitments, supplier lead times, commercial change management, and single-source-of-truth purchasing registers.',
    targetRoles: ['Procurement Manager', 'Senior Buyer / Sourcing Specialist / Supply Chain Coordinator'],
    iconName: 'ShoppingCart',
  },
  {
    id: 'production',
    title: 'Production & Yard Operations',
    shortTitle: 'Production & Yard',
    focusArea: 'Build spec handovers, multi-trade zoning, shop-floor progress reporting, NCR tracking, and bottleneck escalation.',
    scopeSummary: 'Focuses on aluminium fabrication, mechanical/electrical outfitting, assembly bay contention, yard hold points, and labor capacity.',
    targetRoles: ['Production/Yard Manager', 'Workshop Supervisor / Fabrication Foreman / Site Superintendent'],
    iconName: 'Hammer',
  },
  {
    id: 'quality_hseq',
    title: 'QHSE Department',
    shortTitle: 'QHSE',
    focusArea: 'Quality requirements, QA/QC/Class boundaries, audit actions, safety integration, and sea-trials clearance.',
    scopeSummary: 'Focuses on Lloyd’s Register UMS and MCA Category 0 compliance, NCR/CAPA tracking, safety hold points, and calibration logs.',
    targetRoles: ['QHSE Manager', 'Safety Officer / Quality Inspector / Environmental Auditor'],
    iconName: 'ShieldCheck',
  },
  {
    id: 'logistics',
    title: 'Logistics Department',
    shortTitle: 'Logistics',
    focusArea: 'Inbound delivery coordination, customs/transport division, fragile equipment tracking, and expedited transport.',
    scopeSummary: 'Focuses on international shipping, sensitive payload logistics, customs clearance, and yard arrival alignment.',
    targetRoles: ['Logistics Manager', 'Freight Forwarder / Transport Coordinator / Warehouse Supervisor'],
    iconName: 'Truck',
  },
  {
    id: 'finance',
    title: 'Finance & Accountant Management',
    shortTitle: 'Finance & Accounting',
    focusArea: 'Cost baselines, corporate financial alignment, supplier payment milestones, commercial variations, and billing gates.',
    scopeSummary: 'Focuses on vessel budget tracking, commercial change notices, currency/duty exposure, invoice verification against VDR gates, and margin protection.',
    targetRoles: ['Finance Manager', 'Project Controller / Cost Accountant / Financial Analyst'],
    iconName: 'Coins',
  },
  {
    id: 'it_digital',
    title: 'IT / Digital Systems Department',
    shortTitle: 'IT & Digital Systems',
    focusArea: 'Enterprise infrastructure, PMIS/EDMS tool integrations, database architecture, cybersecurity, and system uptime.',
    scopeSummary: 'Focuses on ERP/PMIS architecture, software access gating, data synchronization, helpdesk ticketing, and disaster recovery.',
    targetRoles: ['IT Manager', 'System Administrator / Database Engineer / Helpdesk Lead'],
    iconName: 'Server',
  },
  {
    id: 'hr_admin',
    title: 'HR & Administration Department',
    shortTitle: 'HR & Administration',
    focusArea: 'Personnel resourcing, offshore maritime competencies (STCW/BOSIET), crew logistics, mobilization, and compliance.',
    scopeSummary: 'Focuses on manpower planning, maritime certifications, timesheets, mobilization travel, and workplace compliance.',
    targetRoles: ['HR Manager', 'Talent Acquisition Officer / HR Business Partner / Mobilization Coordinator'],
    iconName: 'UserCheck',
  },
  {
    id: 'vendors',
    title: 'Vendors & Subcontractors',
    shortTitle: 'Vendors & Subcontractors',
    focusArea: 'Technical package handovers, shop-floor division, quotation/schedule communication, design concessions, and FAT gates.',
    scopeSummary: 'Focuses on external fabricators, sub-tier milestones, vendor data records (VDR), witness testing, and commercial variance handling.',
    targetRoles: ['Vendor/Subcontractor Management Lead', 'External Supplier Representative / Subcontractor Project Manager'],
    iconName: 'Users',
  },
  {
    id: 'pmo_director',
    title: 'PMO Director/Manager',
    shortTitle: 'PMO Director/Manager',
    focusArea: 'PMO-functional interfaces, master schedule maintenance, variance analysis, resource prioritization, and governance.',
    scopeSummary: 'Focuses on enterprise portfolio visibility, IMS maintenance, cross-project critical path analysis, change governance, and anti-bureaucracy.',
    targetRoles: ['PMO Manager/Director', 'Senior PMO Specialist'],
    iconName: 'Briefcase',
  },
  {
    id: 'project_manager',
    title: 'Project Managers',
    shortTitle: 'Project Managers',
    focusArea: 'Data handovers, matrix coordination, master schedule tracking, critical delay escalation, and unbudgeted change control across projects.',
    scopeSummary: 'Focuses on project delivery orchestration, cross-functional execution, schedule milestones, and stage gates across multiple projects.',
    targetRoles: [
      'Project Manager 1 (Project 1)',
      'Project Manager 2 (Project 2)',
      'Project Manager 3 (Project 3)',
      'Project Manager 4 (Project 4)',
    ],
    iconName: 'Target',
  },
  {
    id: 'asset_owner',
    title: 'Asset Owner Management',
    shortTitle: 'Asset Owner Management',
    focusArea: 'Capital decision interfaces, portfolio balance, executive dashboard visibility, investment gates, and escalation.',
    scopeSummary: 'Focuses on executive governance, multi-programme investment gating, strategic risk tolerance, Fugro alignment, and baseline protection.',
    targetRoles: ['Asset Owner / Primary Executive Stakeholder'],
    iconName: 'Building2',
  },
];

// Helper to ensure backward compatibility for section47 accessor
function normalizeQuestionnaire(q: RoleQuestionnaire): RoleQuestionnaire {
  return {
    ...q,
    section47: q.section47 || q.softwareInventory,
  };
}

export const QUESTIONNAIRES_MAP: Record<StakeholderCategoryId, RoleQuestionnaire> = {
  engineering: normalizeQuestionnaire(engineeringQuestionnaire),
  procurement: normalizeQuestionnaire(procurementQuestionnaire),
  production: normalizeQuestionnaire(productionQuestionnaire),
  quality_hseq: normalizeQuestionnaire(qualityHseqQuestionnaire),
  logistics: normalizeQuestionnaire(logisticsQuestionnaire),
  vendors: normalizeQuestionnaire(vendorsQuestionnaire),
  pmo_director: normalizeQuestionnaire(pmoDirectorQuestionnaire),
  asset_owner: normalizeQuestionnaire(assetOwnerQuestionnaire),
  project_manager: normalizeQuestionnaire(projectManagerQuestionnaire),
  finance: normalizeQuestionnaire(financeQuestionnaire),
  it_digital: normalizeQuestionnaire(itDigitalQuestionnaire),
  hr_admin: normalizeQuestionnaire(hrAdminQuestionnaire),
};

export function getQuestionnaireByCategory(categoryId: StakeholderCategoryId): RoleQuestionnaire {
  return QUESTIONNAIRES_MAP[categoryId] || normalizeQuestionnaire(engineeringQuestionnaire);
}
