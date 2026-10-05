import React, { useState, useEffect } from 'react';
import {
  AssessmentSubmissionPayload,
  QuestionResponse,
  RespondentProfile,
  Section47Response,
  StakeholderCategoryId,
  UserAccount,
} from './types';
import {
  getQuestionnaireByCategory,
  STAKEHOLDER_CATEGORIES,
} from './data/questionnaires';
import { SAMPLE_SUBMISSIONS } from './data/sampleSubmissions';
import { SYSTEM_ACCOUNTS } from './data/authUsers';
import { Header, NavTabId } from './components/Header';
import { ProposalChaptersSection } from './components/ProposalChaptersSection';
import { ProfileSetupSection } from './components/ProfileSetupSection';
import { QuestionnaireSection } from './components/QuestionnaireSection';
import { SubmissionSection } from './components/SubmissionSection';
import { AdminConsoleSection } from './components/AdminConsoleSection';
import { LoginScreen } from './components/LoginScreen';
import { LoginModal, TargetPositionInfo } from './components/LoginModal';
import { PjmakLogo } from './components/PjmakLogo';
import { SeaKitLogo } from './components/SeaKitLogo';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'seakit_pmo_profile_v4_clean',
  USER: 'seakit_pmo_user_v4_clean',
  RESPONSES: 'seakit_pmo_responses_v4_clean',
  SECTION47: 'seakit_pmo_section47_v4_clean',
  SUBMISSIONS: 'seakit_pmo_submissions_v4_clean',
  ROLE_LOCKED: 'seakit_pmo_role_locked_v4',
};

function generateId(prefix: string) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-4)}${rand}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('proposal');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [targetPosition, setTargetPosition] = useState<TargetPositionInfo | null>(null);
  const [loginRequiredCategory, setLoginRequiredCategory] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Track if non-executive user has already selected their 1 designated role
  const [hasSelectedRole, setHasSelectedRole] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ROLE_LOCKED) === 'true';
  });

  // 1. Authenticated User State: Defaults to null so visitor must sign in with their credentials
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify account has not been expired
        const matched = SYSTEM_ACCOUNTS.find(
          (a) => a.username.toLowerCase() === parsed.username?.toLowerCase()
        );
        if (matched && matched.isExpired) {
          localStorage.removeItem(STORAGE_KEYS.USER);
          return null;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return null;
  });

  // 2. Respondent Profile state (completely clean, unselected)
  const [profile, setProfile] = useState<RespondentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      assessmentId: generateId('SEAKIT-ASSESS'),
      respondentId: generateId('RESP'),
      category: 'engineering',
      vesselProgramme: 'X-Class USV (18m)',
      department: '',
      role: '',
      fullName: '',
      email: '',
      location: 'Sea-Kit International Ltd',
      experienceYears: '',
    };
  });

  // 3. Question Responses map (per question ID) - Completely CLEAN / Empty
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESPONSES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  // 4. Section 4.7 state - Completely clean
  const [section47, setSection47] = useState<Section47Response>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTION47);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      selectedTools: [],
      customTool: '',
      integrationMaturity: null,
    };
  });

  // 5. Stored Submissions
  const [submissions, setSubmissions] = useState<AssessmentSubmissionPayload[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(
    currentUser?.isAssetOwner ?? false
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync to Local Storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTION47, JSON.stringify(section47));
  }, [section47]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  // Active Questionnaire definition
  const currentQuestionnaire = getQuestionnaireByCategory(profile.category);

  // Calculate completion percentage (diagnostic questions + Section 4.2 tool inventory)
  const totalQuestions = currentQuestionnaire.questions.length + 1;
  const isToolInventoryDone = section47.selectedTools.length > 0;
  const answeredCount =
    currentQuestionnaire.questions.filter((q) => {
      const r = responses[q.id];
      return r && (r.selectedOption !== undefined || r.currentState !== undefined);
    }).length + (isToolInventoryDone ? 1 : 0);

  const completionPercentage =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Universal Copy-Paste Prevention across all sections (especially Proposal)
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showToast('Copying is disabled to protect proposal and assessment integrity.');
    };
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      showToast('Cut is disabled.');
    };
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      showToast('Pasting is disabled. Please enter information directly.');
    };
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast('Right-click context menu is disabled.');
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 's', 'p', 'C', 'V', 'X', 'S', 'P', 'u', 'U'].includes(e.key)) {
        e.preventDefault();
        showToast('Keyboard shortcuts (Copy/Paste/Save/Print) are disabled.');
      }
    };

    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleUpdateProfile = (updated: Partial<RespondentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateResponse = (questionId: string, update: Partial<QuestionResponse>) => {
    setResponses((prev) => {
      const existing = prev[questionId] || { questionId };
      return {
        ...prev,
        [questionId]: { ...existing, ...update },
      };
    });
  };

  const handleUpdateSection47 = (update: Partial<Section47Response>) => {
    setSection47((prev) => ({ ...prev, ...update }));
  };

  // Role selection & navigation to questionnaire
  const handleSelectRoleAndLaunch = (category: StakeholderCategoryId, role: string) => {
    const isExecutive = currentUser?.isAssetOwner ?? false;

    // If non-executive and already selected a role, block changing role without logout
    if (!isExecutive && hasSelectedRole && profile.role && profile.role !== role) {
      showToast(`Role is locked to ${profile.role}. Please log out first to switch to another role.`);
      return;
    }

    const catInfo = STAKEHOLDER_CATEGORIES.find((c) => c.id === category);

    setProfile((prev) => ({
      ...prev,
      category,
      role,
      department: catInfo?.title || prev.department,
    }));

    if (!isExecutive) {
      setHasSelectedRole(true);
      localStorage.setItem(STORAGE_KEYS.ROLE_LOCKED, 'true');
    }

    setActiveTab('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Role selected: ${role}. Questionnaire ready.`);
  };

  const handleLogin = (
    user: UserAccount,
    targetCategory?: StakeholderCategoryId,
    targetRole?: string
  ) => {
    setCurrentUser(user);
    const isExecutive = user.isAssetOwner || (user.isOwner ?? false);

    if (isExecutive) {
      setIsAdminUnlocked(true);
      setProfile((prev) => ({
        ...prev,
        category: 'asset_owner',
        role: 'Director Asset Management',
        department: 'Asset Management',
        fullName: 'Mr. Nushi',
      }));
    } else {
      setIsAdminUnlocked(false);
      // Reset role selection lock on fresh team login
      setHasSelectedRole(false);
      localStorage.removeItem(STORAGE_KEYS.ROLE_LOCKED);
      setProfile((prev) => ({
        ...prev,
        category: 'engineering',
        role: '',
        department: '',
        fullName: 'Sea-Kit Team Member',
      }));
    }

    setIsLoginModalOpen(false);
    setTargetPosition(null);
    setActiveTab('proposal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Authenticated as ${user.displayName}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminUnlocked(false);
    setHasSelectedRole(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE_LOCKED);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.RESPONSES);
    localStorage.removeItem(STORAGE_KEYS.SECTION47);
    setResponses({});
    setSection47({
      selectedTools: [],
      customTool: '',
      integrationMaturity: null,
    });
    setProfile({
      assessmentId: generateId('SEAKIT-ASSESS'),
      respondentId: generateId('RESP'),
      category: 'engineering',
      vesselProgramme: 'X-Class USV (18m)',
      department: '',
      role: '',
      fullName: '',
      email: '',
      location: 'Sea-Kit International Ltd',
      experienceYears: '',
    });
    setActiveTab('proposal');
    showToast('Signed out successfully.');
  };

  const handleSubmitAssessment = () => {
    // If not owner, enforce completion of all questions + software inventory
    const isOwnerUser = currentUser?.isOwner ?? (currentUser?.isAssetOwner ?? false);
    const isToolInventoryComplete = section47.selectedTools.length > 0;
    const answeredCount = currentQuestionnaire.questions.filter((q) => {
      const r = responses[q.id];
      return r && (r.selectedOption !== undefined || r.currentState !== undefined);
    }).length;
    const totalUnits = currentQuestionnaire.questions.length + 1;
    const answeredUnits = answeredCount + (isToolInventoryComplete ? 1 : 0);

    if (!isOwnerUser && answeredUnits < totalUnits) {
      showToast(`Cannot submit: ${totalUnits - answeredUnits} assessment questions remaining.`);
      return;
    }

    const responseArray = currentQuestionnaire.questions.map((q) => {
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

    const newPayload: AssessmentSubmissionPayload = {
      assessmentId: profile.assessmentId,
      respondentId: profile.respondentId,
      timestamp: new Date().toISOString(),
      metadata: {
        systemVersion: '1.0.0-PMO',
        framework: 'Sea-Kit PMO Establishment Framework (PJMAK)',
        scope: 'Stakeholder Diagnostic Assessment & Systems Inventory',
        standardsContext: "Lloyd's Register UMS / MCA Cat 0",
        parentAffiliation: 'Sea-Kit International Ltd (a Fugro company)',
      },
      respondentProfile: {
        fullName: profile.fullName || currentUser?.displayName || profile.role,
        role: profile.role || currentUser?.roleTitle || 'Unspecified Role',
        department: profile.department || currentQuestionnaire.title,
        stakeholderCategory: profile.category,
        vesselProgramme: profile.vesselProgramme,
        location: profile.location || 'Tollesbury Yard / HQ',
      },
      responses: responseArray,
      section47: {
        selectedTools: section47.selectedTools,
        customTool: section47.customTool || '',
        integrationMaturityLevel: section47.integrationMaturity,
      },
    };

    setSubmissions((prev) => [
      newPayload,
      ...prev.filter((s) => s.assessmentId !== newPayload.assessmentId),
    ]);
    setIsSubmitted(true);
    showToast(`Assessment ${profile.assessmentId} recorded successfully.`);
  };

  const handleResetAssessment = () => {
    if (
      window.confirm(
        'Reset current assessment draft? This will clear active question selections for this role while preserving previously committed submissions.'
      )
    ) {
      setResponses({});
      setSection47({
        selectedTools: [],
        customTool: '',
        integrationMaturity: null,
      });
      setIsSubmitted(false);
      setProfile((prev) => ({
        ...prev,
        assessmentId: generateId('SEAKIT-ASSESS'),
      }));
      showToast('Assessment draft reset.');
    }
  };

  // If no user is logged in, show dedicated LoginScreen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div
      className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900 font-sans antialiased select-none"
      onCopy={(e) => {
        e.preventDefault();
        showToast('Copying is disabled to protect proposal and assessment integrity.');
      }}
      onCut={(e) => {
        e.preventDefault();
        showToast('Cut is disabled.');
      }}
      onPaste={(e) => {
        e.preventDefault();
        showToast('Pasting is disabled.');
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        showToast('Right-click context menu is disabled.');
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role Re-Authentication / Position Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLogin={handleLogin}
        onClose={() => {
          setIsLoginModalOpen(false);
          setTargetPosition(null);
        }}
        targetPosition={targetPosition}
      />

      {/* Main App Header with PJMAK Branding */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          // If non-executive tries to open questionnaire without having selected a role, direct to profile setup with message
          if (tab === 'questionnaire' && !currentUser.isAssetOwner && !currentUser.isOwner && !profile.role) {
            setActiveTab('profile_setup');
            showToast('Please first go to Stakeholder Profile and select your role.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        currentUser={currentUser}
        completionPercentage={completionPercentage}
        isAdminUnlocked={isAdminUnlocked}
        onOpenLoginModal={() => {
          setTargetPosition(null);
          setLoginRequiredCategory(undefined);
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'proposal' && (
          <ProposalChaptersSection
            currentUser={currentUser}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'profile_setup' && (
          <ProfileSetupSection
            profile={profile}
            currentUser={currentUser}
            hasSelectedRole={hasSelectedRole}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectRoleAndLaunch={handleSelectRoleAndLaunch}
            onSelectPositionToLogin={(category, categoryTitle, role) => {
              setTargetPosition({ category, categoryTitle, role });
              setIsLoginModalOpen(true);
            }}
            onOpenLoginModal={(cat) => {
              setTargetPosition(null);
              setLoginRequiredCategory(cat);
              setIsLoginModalOpen(true);
            }}
            onResetAssessment={handleResetAssessment}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'questionnaire' && (
          <QuestionnaireSection
            questionnaire={currentQuestionnaire}
            profile={profile}
            responses={responses}
            section47={section47}
            onUpdateResponse={handleUpdateResponse}
            onUpdateSection47={handleUpdateSection47}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'submission' && (
          <SubmissionSection
            questionnaire={currentQuestionnaire}
            profile={profile}
            responses={responses}
            section47={section47}
            currentUser={currentUser}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSubmitAssessment={handleSubmitAssessment}
            isSubmitted={isSubmitted}
            onResetAssessment={handleResetAssessment}
          />
        )}

        {activeTab === 'admin' && (currentUser?.isOwner || currentUser?.isAssetOwner || isAdminUnlocked) && (
          <AdminConsoleSection
            submissions={submissions}
            onClearAllSubmissions={() => {
              if (window.confirm('Clear all stored submissions in this session?')) {
                setSubmissions([]);
                showToast('All submissions cleared.');
              }
            }}
            onLoadSampleSubmissions={() => {
              setSubmissions(SAMPLE_SUBMISSIONS);
              showToast('Demonstration dataset loaded.');
            }}
            onLockAdmin={() => {
              setActiveTab('proposal');
              showToast('Exited Admin Console.');
            }}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4 text-slate-500 text-xs" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <SeaKitLogo size="sm" />
              <div className="p-1 bg-slate-50 border border-slate-200 rounded-md">
                <PjmakLogo size="sm" showSubtitle={false} />
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-800">
                PMO ESTABLISHMENT SOFTWARE / TOOL — SEA-KIT
              </p>
              <p className="text-2xs text-slate-500">
                Developed by PJMAK (Project Management Key) &bull; Sea-Kit International (a Fugro company)
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-2xs text-slate-400">
            Role-Based Stakeholder Diagnostic Assessment &bull; PJMAK Reference Model
          </div>
        </div>
      </footer>
    </div>
  );
}
