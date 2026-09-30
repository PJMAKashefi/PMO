import React from 'react';
import { PjmakLogo } from './PjmakLogo';
import { SeaKitLogo } from './SeaKitLogo';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  Layers,
  Lock,
  LogOut,
  Send,
  ShieldCheck,
  User,
  UserCheck,
} from 'lucide-react';
import { RespondentProfile, UserAccount } from '../types';

export type NavTabId =
  | 'proposal'
  | 'profile_setup'
  | 'questionnaire'
  | 'submission'
  | 'admin';

interface HeaderProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  profile: RespondentProfile;
  currentUser: UserAccount | null;
  completionPercentage: number;
  isAdminUnlocked: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  profile,
  currentUser,
  completionPercentage,
  isAdminUnlocked,
  onOpenLoginModal,
  onLogout,
}) => {
  const isOwner = currentUser?.isOwner ?? (currentUser?.isAssetOwner ?? false);

  const navItems: { id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'proposal', label: 'Proposal', icon: BookOpen },
    { id: 'profile_setup', label: 'Stakeholder Profile', icon: UserCheck },
    { id: 'questionnaire', label: 'Questionnaire', icon: Layers },
    {
      id: 'submission',
      label: 'Submit Assessment',
      icon: Send,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs" id="app-main-header">
      {/* Top Banner with Clean Title & PJMAK Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Clean branding element with Sea-Kit and PJMAK logos */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <SeaKitLogo size="md" />
              <div className="p-1 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition-colors shrink-0">
                <PjmakLogo size="sm" showSubtitle={true} />
              </div>
            </div>

            <div className="border-l border-slate-300 pl-3">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                PMO ESTABLISHMENT SOFTWARE / TOOL — SEA-KIT
              </h1>
            </div>
          </div>

          {/* Right Status Info: User badge & Login controls */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {currentUser ? (
              <div
                className="flex items-center gap-2 border py-1.5 px-3 rounded-lg text-xs bg-slate-50 border-slate-200 text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold text-3xs">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="leading-tight">
                    <span className="font-bold block truncate max-w-[160px] sm:max-w-xs">
                      {currentUser.displayName}
                    </span>
                    <span className="text-3xs uppercase font-semibold text-slate-500">
                      {currentUser.roleTitle || 'Director Asset Management'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md font-bold text-2xs transition-colors cursor-pointer"
                  title="Sign out of current account"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Select Position</span>
              </button>
            )}

            {/* Assessment Progress mini indicator */}
            <div
              onClick={() => onTabChange('questionnaire')}
              className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-colors"
              title="Click to jump to Questionnaire"
              id="header-progress-chip"
            >
              <div className="w-12 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-700 font-mono">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-t border-slate-200 bg-slate-50/75 overflow-x-auto scrollbar-none" id="app-nav-tabs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin & Analytical Reports Tab: Hidden from stakeholder review interface */}
          {false && (
            <button
              id="nav-tab-admin"
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-100/70'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Owner Analytics &amp; Roadmap</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
