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
  hasSelectedRole: boolean;
  onUpdateProfile: (updated: Partial<RespondentProfile>) => void;
  onNavigate: (tab: NavTabId) => void;
  onSelectRoleAndLaunch: (category: StakeholderCategoryId, role: string) => void;
  onSelectPositionToLogin: (category: StakeholderCategoryId, categoryTitle: string, role: string) => void;
  onOpenLoginModal: (requiredCategory?: string) => void;
  onResetAssessment: () => void;
  onLogout: () => void;
}

export const ProfileSetupSection: React.FC<ProfileSetupSectionProps> = ({
  profile,
  currentUser,
  hasSelectedRole,
  onUpdateProfile,
  onNavigate,
  onSelectRoleAndLaunch,
  onSelectPositionToLogin,
  onOpenLoginModal,
  onResetAssessment,
  onLogout,
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

  const isExecutive = currentUser?.isAssetOwner ?? false;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4" id="profile-setup-container">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Stakeholder Department &amp; Role Selection
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isExecutive
                ? 'Executive Access: You may inspect any department questionnaire.'
                : 'Team Access: Select your dedicated role once. To switch to a different role later, you must log out first and log in again.'}
            </p>
          </div>

          {/* Access Control Status Badge */}
          <div>
            {currentUser && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  isExecutive
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'bg-blue-50 text-blue-900 border border-blue-200'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${isExecutive ? 'text-teal-600' : 'text-blue-600'}`} />
                <span>
                  {isExecutive
                    ? `Executive Review: ${currentUser.displayName}`
                    : `Team Portal: ${currentUser.displayName}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Locked Role Notice for Sea-Kit Team */}
        {!isExecutive && hasSelectedRole && profile.role && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Your role is currently designated as: <strong>{profile.role}</strong> ({profile.department}). To choose another role, please <strong>log out</strong> first.
              </span>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-2xs rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Log Out Now
            </button>
          </div>
        )}
      </div>

      {/* Stakeholder Role Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Departments &amp; Designated Positions
          </h2>
          <span className="text-2xs text-slate-500">
            {!isExecutive && hasSelectedRole
              ? 'Role is locked. Log out to select another position.'
              : 'Select your designated organizational position'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STAKEHOLDER_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.iconName] || Briefcase;
            const isUserCategory = profile.category === cat.id;

            return (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isUserCategory && profile.role
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
                          isUserCategory && profile.role
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

                    {isUserCategory && profile.role && (
                      <span className="text-2xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        Active Role
                      </span>
                    )}
                  </div>

                  {/* Clean Position Selection Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
                      Select Department Position:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.targetRoles.map((role) => {
                        const isCurrentActive = profile.role === role && profile.category === cat.id;
                        const isLockedForOther = !isExecutive && hasSelectedRole && !isCurrentActive;

                        return (
                          <button
                            key={role}
                            type="button"
                            disabled={isLockedForOther}
                            onClick={() => onSelectRoleAndLaunch(cat.id, role)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all text-left flex items-center gap-1.5 ${
                              isCurrentActive
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold cursor-pointer'
                                : isLockedForOther
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                                : 'bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200 cursor-pointer'
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
                    disabled={!isExecutive && hasSelectedRole && profile.category !== cat.id}
                    onClick={() => onSelectRoleAndLaunch(cat.id, cat.targetRoles[0])}
                    className={`font-bold flex items-center gap-1 transition-colors ${
                      !isExecutive && hasSelectedRole && profile.category !== cat.id
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-slate-900 hover:text-teal-700 cursor-pointer'
                    }`}
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
