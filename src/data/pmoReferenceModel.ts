import { ReferenceDimension } from '../types';

export const PMO_REFERENCE_DIMENSIONS: ReferenceDimension[] = [
  {
    id: '4.1',
    title: 'Core PMO Team Structure & Interfaces',
    subtitle: 'Integration Function without Redundant Administrative Layers',
    leadSummary:
      'The PMO structure must be proportionate to Sea-Kit’s size, vessel project portfolio, and operating model. Rather than creating a separate bureaucratic layer, the PMO operates as an operational integration function connecting active vessel projects with functional departments and external partners.',
    sections: [
      {
        title: 'Core PMO Roles (Section 4.1.1)',
        bulletPoints: [
          'PMO Lead / Project Delivery Integration Manager: Owns the operating model and coordinates portfolio-level integration, workflow governance, priority escalation, and cross-functional delivery issues.',
          'Project Planner / Project Controls Lead: Maintains integrated schedules, baselines, critical-path analysis, forecasting, performance measurement, and early-warning mechanisms.',
          'Document Control / Project Information Management: Maintains the formal project information structure and baseline integrity, including technical submissions, vendor data, class documentation, reports, forecasts, and meeting records.',
          'Matrixed Functional Representatives: Designated representatives from Engineering, Software, Production, Finance, Procurement, Quality/HSEQ, and Logistics retain their functional authority while acting as defined owners of project commitments within the PMO framework.',
        ],
      },
      {
        title: 'Organizational Placement & Operational Interfaces (Section 4.1.2)',
        bulletPoints: [
          'Project-Centric Foundation: The primary operational focus is active vessel project portfolios (H, X, and XL-Class USVs) supported through calibrated daily/weekly look-ahead cadences.',
          'Cross-Functional Integration: Functional departments remain responsible for their technical work while providing defined project data through agreed interfaces, capturing status at source.',
          'Clear Organizational Interfaces: Unambiguous boundaries between project, functional, and external responsibilities, including handovers, ownership, escalation paths, and decision rights.',
          'Managing Director & Executive Interface: Management receives consolidated, decision-oriented visibility focused strictly on exceptions, priorities, risks, forecasts, and decisions.',
          'Fugro Interface: Provides a consistent interface for required portfolio information and governance with Fugro, reducing parallel reporting requirements while maintaining operational autonomy.',
          'External Interfaces: Formalizes touchpoints with hull fabricators, specialized sub-tier vendors, Lloyd’s Register class surveyors, and customer technical representatives.',
        ],
      },
    ],
    keyTakeaways: [
      'PMO integrates without replacing functional management or technical authority.',
      'Data is captured at source, preventing parallel shadow reporting and reconstruction.',
      'Clear demarcation between project timelines, functional standards, and corporate governance.',
    ],
  },
  {
    id: '4.2',
    title: 'Departmental Software & System Inventory',
    subtitle: 'Empirical Baseline Mapping Active Tools and Integration Maturity',
    leadSummary:
      'Before evaluating how information flows across organizational boundaries, the project ecosystem must establish a definitive inventory of the digital infrastructure, software licenses, database tools, and manual workarounds active across each department.',
    sections: [
      {
        title: 'System & Tool Identification (Part A)',
        bulletPoints: [
          'Captures the specific class of digital tools, enterprise platforms, specialized marine applications, and manual workarounds used in daily workflows.',
          'Encompasses CAD & 3D modeling (AutoCAD, SolidWorks, Rhino), marine analysis software (OrcaFlex), ERP platforms, scheduling tools (Primavera P6, MS Project), task managers (Jira, Asana), EDMS (Oracle Aconex, SharePoint), and spreadsheets (Excel).',
          'Exposes reliance on unapproved local spreadsheets, whiteboards, or offline files that create data fragmentation.',
        ],
      },
      {
        title: 'System Integration & Utilization Maturity (Part B)',
        bulletPoints: [
          'Level 1 (Completely Siloed): Tools operate in isolation, requiring manual data re-entry and offline file passing.',
          'Level 2 (Fragmented): Basic repositories or unlinked tools used with manual exports and high latency.',
          'Level 3 (Integrated): Core systems maintain structured data-sharing and API-driven synchronization with the centralized PMO platform.',
          'Level 4 (Over-Regulated): Hyper-complex locking gates, multi-tier approvals, and administrative red tape that impede operational agility.',
        ],
      },
    ],
    keyTakeaways: [
      'Anchors PMO design in empirical reality rather than theoretical assumptions.',
      'Identifies digital silos and eliminates redundant shadow databases.',
      'Directly links system integration maturity to overall project delivery predictability.',
    ],
  },
  {
    id: '4.3',
    title: 'Information, Data & Communication Flows',
    subtitle: 'Single Source of Truth across Departmental and External Channels',
    leadSummary:
      'The PMO establishes a single-source-of-truth information architecture to eliminate data silos, reporting latency, and downstream forecasting errors across all vessel project lifecycle stages.',
    sections: [
      {
        title: 'Internal Departmental Data Channels (Section 4.3.2)',
        bulletPoints: [
          'Engineering: Technical baselines, design calculations, 3D/2D fabrication drawings, BOM, technical specifications, and ECNs flowing to Procurement, Production, and the PMO.',
          'Procurement: Vendor contracting status, purchase orders, commercial commitments, equipment fabrication progress, and material delivery lead times flowing to Engineering, Production, and Finance.',
          'Production & Yard Operations: Physical build progress, outfitting percentages, shop-floor capacity, fabrication productivity rates, and workshop bottlenecks flowing to the PMO and Engineering.',
          'Finance & Accounting: Cost baselines, budget commitments, cash-flow requirements, customer billing milestones, and variation logs flowing to the PMO and Executive management.',
          'QHSE & Compliance: Inspection records, NCRs, safety audit outcomes, FAT/SAT logs, and statutory/Lloyd’s Register class milestones flowing to Production, Engineering, and the PMO.',
          'Logistics: Freight tracking, transportation schedules, customs clearance statuses, and site-delivery lead times flowing independently of commercial procurement promises.',
          'IT / Digital Systems: PMIS health metrics, software tool availability, database access configurations, user permissions, and network infrastructure readiness.',
          'HR & Administration: Personnel manning curves, mobilization schedules, maritime certification compliance (STCW/BOSIET), and competency-matrix availability.',
        ],
      },
      {
        title: 'External Gateways & Closed-Loop Resolution (Sections 4.3.3 & 4.3.4)',
        bulletPoints: [
          'Vendor Data & Engineering (VDR) Gate: Critical vendor drawings and submittals pass through strict document control before manufacturing proceeds.',
          'Subcontractor Milestone Verification Layer: External fabrication progress and milestone claims are verified objectively before updating the Integrated Master Schedule (IMS).',
          'Statutory & Classification Gateway: Lloyd’s Register UMS and MCA Category 0 survey records and compliance certificates authorize critical physical milestones.',
          'Closed-Loop Resolution Protocol: 4-step workflow: Step 1 (Identification & Logging) -> Step 2 (Impact Assessment & Routing) -> Step 3 (Cross-Functional Resolution) -> Step 4 (Closure & Traceability).',
        ],
      },
    ],
    keyTakeaways: [
      'Data is captured at its departmental source without duplicate manual reporting.',
      'External supply chain milestones are independently verified before entering the master schedule.',
      'The 4-step closed-loop routing protocol guarantees full decision traceability.',
    ],
  },
  {
    id: '4.4',
    title: 'PMO Mandate, Authority & Responsibilities',
    subtitle: 'Enterprise Charter Backed by the Managing Director',
    leadSummary:
      'The PMO possesses sufficient organizational authority to coordinate complex multi-vessel build programs, protect approved master baselines, and enforce structured escalation paths without encroaching upon functional technical accountability.',
    sections: [
      {
        title: 'Core Governance Pillars (Sections 4.4.1 to 4.4.5)',
        bulletPoints: [
          'Portfolio & Master Schedule Ownership: Maintains the consolidated enterprise portfolio register and IMS across H, X, and XL-Class USV streams.',
          'Resource Prioritization & Conflict Resolution: Coordinates competing priorities across engineering design, software configuration, procurement, modular production, and yard testing.',
          'Enterprise Governance & Minimum Standard Architecture: Defines, implements, and maintains the minimum project-delivery standards required across Sea-Kit.',
          'Information Access, Verification & Data Integrity: Maintains unrestricted access to project documentation and holds charter authority to challenge and validate reported progress.',
          'Scope, Change & Baseline Control: Formally evaluates proposed technical, commercial, or customer changes for cost, schedule, quality, and class impacts before baseline re-authorization.',
        ],
      },
      {
        title: 'Forecasting, Escalation & Operating Model (Sections 4.4.6 to 4.4.10)',
        bulletPoints: [
          'Variance Analysis & Performance Forecasting: Ongoing variance analysis against master baselines, identifying critical-path slippages and predictive trends.',
          'Escalation Protocols & Decision Support: Transparent, multi-tiered escalation pathways with direct access to the Managing Director and Executive Board when thresholds are breached.',
          'Functional Accountability Matrix: Clear distinction between PMO integration/coordination and departmental technical execution ownership.',
          'Periodic Reporting Cadence & Executive Visibility: Mandatory weekly tactical and monthly executive reporting transforming disparate inputs into a unified performance dashboard.',
        ],
      },
    ],
    keyTakeaways: [
      'Formally chartered by the Managing Director with explicit enforcement authority.',
      'Protects the Integrated Master Schedule (IMS) as the definitive single source of truth.',
      'Maintains clear boundaries: PMO integrates process while departments own technical solutions.',
    ],
  },
  {
    id: '4.5',
    title: 'Governance, Decision-Making & Escalation',
    subtitle: '4-Tier Operational Decision Forums and Quantitative Escalation Triggers',
    leadSummary:
      'Provides the structural discipline to make timely decisions, maintain uncompromising baseline accountability, and protect agreed project parameters without introducing unnecessary administrative layers or meeting fatigue.',
    sections: [
      {
        title: 'Multi-Tiered Decision Forums (Section 4.5.2)',
        bulletPoints: [
          'Tier 1: Delivery Coordination (Weekly Tactical Review) - Short-term milestone execution, physical progress in the yard, material supply constraints, and shop-floor blockers. Governed by the 48-Hour Blocker Resolution Rule.',
          'Tier 2: Risk & Change Review (Biweekly Control Review) - Risk register updates, NCRs, engineering change proposals (ECNs), and cost/schedule exposure before baselines are affected.',
          'Tier 3: Portfolio Review (Monthly Executive Review) - Managing Director, PMO Lead, Finance, and Fugro representatives aligning on portfolio performance, resource conflicts, and strategic priorities.',
          'Tier 4: Stage-Gate Reviews (Major Project Transitions) - Independent verification of technical readiness, regulatory and Class compliance (Lloyd’s Register UMS / MCA Cat 0), and formal go/no-go decisions.',
        ],
      },
      {
        title: 'Operational Controls & Escalation Thresholds (Sections 4.5.3 & 4.5.4)',
        bulletPoints: [
          'Explicit Data Ownership: Procurement owns long-lead registers, EDMS owns transmittals/class logs, Engineering owns BOM/baselines, Software owns G-SAVI releases.',
          'Engineering Change RACI & Sign-Off Workflow: Auditable workflow ensuring full impact analysis across Engineering, Production, Procurement, Finance, and PMO before changes are implemented.',
          'Quantitative Trigger Thresholds: Mandatory management escalation triggered when critical-path slippage exceeds 5 working days, unbudgeted cost exposure exceeds €10,000, or a tactical blocker remains unresolved past 48 hours.',
          'Cross-Tier Escalation Pathways: Seamless flow from Tier 1 up to Tier 2 or Tier 3 with full decision traceability recorded in PMIS logs.',
        ],
      },
    ],
    keyTakeaways: [
      'The 48-Hour Blocker Resolution Rule prevents operational bottlenecks from lingering.',
      'Objective quantitative thresholds (5 days, €10,000) eliminate subjective escalation debates.',
      'Rigorous stage-gate evidence standards ensure no vessel progresses with unverified safety or Class gaps.',
    ],
  },
  {
    id: '4.6',
    title: 'Processes Efficiency & Anti-Bureaucracy',
    subtitle: 'Lean Operational Guardrails and the Service Sunset Rule',
    leadSummary:
      'Establishes strict guardrails against bureaucratic bloat, ensuring every process, report, meeting, and data requirement proves its direct contribution to decision-making and project performance.',
    sections: [
      {
        title: 'Core Anti-Bureaucracy Principles (Section 4.6.1)',
        bulletPoints: [
          'Minimum Necessary Processes & Templates: Standardize a lean set of core templates, introducing new steps only when they demonstrably improve delivery performance.',
          'No Duplicate Reporting: Generate all governance and management reports directly from controlled single sources of truth, strictly prohibiting parallel manual spreadsheets.',
          'No Meeting Without a Decision or Action Purpose: Convert status-reporting meetings into focused decision-making sessions with explicit agendas and accountable owners.',
          'No Metric Without a Management Purpose: Maintain only KPIs that trigger specific management interventions or decisions, regularly auditing and retiring vanity measures.',
        ],
      },
      {
        title: 'Value vs. Effort & The Service Sunset Rule',
        bulletPoints: [
          'Process & Control Review (Value vs. Effort): Formal cost-benefit evaluation ensuring introduced administrative effort is heavily outweighed by risk reduction.',
          'The Service Sunset Rule: Periodically review PMO reports, workflows, and controls against measurable value; simplify, replace, or retire activities that no longer provide value.',
          'Continuous Improvement & Feedback: Active feedback loops with project teams and functional departments to identify emerging bottlenecks and simplify processes.',
        ],
      },
    ],
    keyTakeaways: [
      'The PMO makes project delivery easier to control—not more burdensome.',
      'Every new metric or report introduced must replace an existing one under Service Sunset logic.',
      'Zero tolerance for unapproved shadow spreadsheets and redundant reconciliation.',
    ],
  },
  {
    id: '4.7',
    title: 'Organizational Adoption & Change Management',
    subtitle: 'Pull over Push, Service-Oriented Design, and User Co-Creation',
    leadSummary:
      'The long-term survival and effectiveness of the PMO depend on deep organizational adoption and cultural pull. Rather than being deployed as a heavy administrative function, the PMO is established as a modular suite of high-value services introduced progressively.',
    sections: [
      {
        title: 'Core Adoption Strategies',
        bulletPoints: [
          'Functional Ownership & Boundary Discipline: Departments retain absolute accountability for technical domains; PMO acts as coordinator without seizing operational tasks.',
          'Service-Oriented PMO Design: Every PMO capability is structured as a distinct internal "service" with defined customer, inputs, outputs, and measurable value proposition.',
          'Co-Creation Over Imposition: Processes, templates, and dashboards are co-designed alongside the teams who use them, resolving friction before workflows become embedded.',
          'Phased Capability Deployment: PMO maturity scales dynamically with organizational need and project risk, starting with schedule visibility and critical-path protection.',
        ],
      },
      {
        title: 'Ways of Working & Continuous Value Audit',
        bulletPoints: [
          'Common Ways of Working: Establishing minimum necessary standards to eliminate shadow trackers while preserving operational agility.',
          'Targeted Enablement & Knowledge Transfer: Practical coaching rather than heavy manuals, helping personnel master digital tools effortlessly.',
          'Continuous Value Audit: PMO effectiveness evaluated continuously through stakeholder feedback, decision velocity, and administrative cycle time reductions.',
        ],
      },
    ],
    keyTakeaways: [
      'Change anchored through demonstrated operational utility rather than compliance policing.',
      'Co-creation ensures high user pull and active buy-in across all engineering and yard teams.',
      'Continuous value audits keep the PMO lightweight, adaptable, and trusted.',
    ],
  },
];
