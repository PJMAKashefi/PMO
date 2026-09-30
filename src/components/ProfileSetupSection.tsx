import React from 'react';
import {
  RespondentProfile,
  StakeholderCategoryId,
  UserAccount,
} from '../types';
import { STAKEHOLDER_CATEGORIES } from '../data/questionnaires';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Coins,
  Compass,
  Hammer,
  KeyRound,
  Lock,
  RotateCcw,
  Server,
  ShieldCheck,
  ShoppingCart,
  Target,
  Truck,
  UserCheck,
  Users,
} from 'lucide-react';
import { NavTabId } from './Header';

interface ProfileSetupSectionProps {
  profile: RespondentProfile;
  currentUser: UserAccount | null;
  onUpdateProfile: (updated: Partial<RespondentProfile>) => void;
  onNavigate: (tab: NavTabId) => void;
  onSelectRoleAndLaunch: (category: StakeholderCategoryId, role: string) => void;
  onSelectPositionToLogin: (category: StakeholderCategoryId, categoryTitle: string, role: string) => void;
  onOpenLoginModal: (requiredCategory?: string) => void;
  onResetAssessment: () => void;
}

export const ProfileSetupSection: React.FC<ProfileSetupSectionProps> = ({
  profile,
  currentUser,
  onUpdateProfile,
  onNavigate,
  onSelectRoleAndLaunch,
  onSelectPositionToLogin,
  onOpenLoginModal,
  onResetAssessment,
}) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Compass,
    ShoppingCart,
    Hammer,
    ShieldCheck,
    Truck,
    Users,
    Briefcase,
    Building2,
    Target,
    Coins,
    Server,
    UserCheck,
  };

  const isAssetOwner = currentUser?.isAssetOwner ?? false;
  const isOwner = currentUser?.isOwner ?? false;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4" id="profile-setup-container">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Stakeholder Department &amp; Role Questionnaires
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any department role below to inspect and examine that stakeholder questionnaire under Director Asset Management review access.
            </p>
          </div>

          {/* Access Control Status Badge */}
          <div>
            {currentUser ? (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-300"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Executive Review Access: {currentUser.displayName} ({currentUser.roleTitle || 'Director Asset Management'})</span>
              </div>
            ) : (
              <button
                onClick={() => onOpenLoginModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Log In to Authenticate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stakeholder Role Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Departments &amp; Designated Positions
          </h2>
          <span className="text-2xs text-slate-500">
            Click on any position to enter username and password
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STAKEHOLDER_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.iconName] || Briefcase;
            const isUserCategory = currentUser?.category === cat.id;

            return (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isUserCategory
                    ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Card Header: Icon, Title & Access State */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isUserCategory
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {cat.title}
                        </h3>
                        <span className="text-2xs font-semibold text-slate-500">
                          {cat.targetRoles.length === 1
                            ? '1 Dedicated Role'
                            : cat.id === 'project_manager'
                            ? '4 Multi-Project Roles'
                            : `${cat.targetRoles.length} Positions`}
                        </span>
                      </div>
                    </div>

                    {isUserCategory && (
                      <span className="text-2xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        Active Role
                      </span>
                    )}
                  </div>

                  {/* Clean Position Selection Buttons: Clicking immediately opens that questionnaire for review */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
                      Inspect Department Questionnaire:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.targetRoles.map((role) => {
                        const isCurrentActive = profile.role === role && profile.category === cat.id;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => onSelectRoleAndLaunch(cat.id, role)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                              isCurrentActive
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold'
                                : 'bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200'
                            }`}
                          >
                            <span>{role}</span>
                            <ArrowRight className="w-3 h-3 opacity-60" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-2xs text-slate-400">
                    20 Diagnostic Questions
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectRoleAndLaunch(cat.id, cat.targetRoles[0])}
                    className="font-bold flex items-center gap-1 text-slate-900 hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    <span>View Questions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
