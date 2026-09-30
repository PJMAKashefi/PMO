import React, { useState, useEffect } from 'react';
import { PjmakLogo } from './PjmakLogo';
import { SeaKitLogo } from './SeaKitLogo';
import { SYSTEM_ACCOUNTS } from '../data/authUsers';
import { StakeholderCategoryId, UserAccount } from '../types';
import {
  AlertCircle,
  ArrowRight,
  KeyRound,
  Lock,
  User,
  X,
} from 'lucide-react';

export interface TargetPositionInfo {
  category: StakeholderCategoryId;
  categoryTitle: string;
  role: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (user: UserAccount, targetCategory?: StakeholderCategoryId, targetRole?: string) => void;
  onClose?: () => void;
  targetPosition?: TargetPositionInfo | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLogin,
  onClose,
  targetPosition,
}) => {
  const [username, setUsername] = useState('seakit');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername('seakit');
    setPassword('password');
    setError(null);
  }, [targetPosition, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('Please enter username.');
      return;
    }

    const matched = SYSTEM_ACCOUNTS.find(
      (a) => a.username.toLowerCase() === cleanUser && a.password === cleanPass
    );

    if (matched) {
      setError(null);
      onLogin(
        {
          username: matched.username,
          displayName: matched.displayName,
          category: targetPosition ? targetPosition.category : matched.category,
          roleTitle: matched.roleTitle,
          department: matched.department,
          isAssetOwner: matched.isAssetOwner,
          isOwner: matched.isOwner,
        },
        targetPosition?.category,
        targetPosition?.role
      );
    } else {
      setError('Invalid credentials. Authorized sign in: username "seakit", password "password".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in"
        id="login-modal-dialog"
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <SeaKitLogo size="sm" />
              <PjmakLogo size="sm" showSubtitle={false} />
            </div>
            <div className="border-l border-slate-700 pl-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Executive Authentication</span>
              </h2>
              <p className="text-2xs text-slate-300">
                Sea-Kit International &bull; Proposal &amp; Assessment Platform
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {targetPosition && (
            <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-1">
              <span className="text-3xs uppercase font-extrabold bg-teal-700 text-white px-1.5 py-0.5 rounded">
                Inspecting Role
              </span>
              <div className="font-bold text-sm text-slate-900">
                {targetPosition.role} ({targetPosition.categoryTitle})
              </div>
              <p className="text-2xs text-slate-600">
                Authorized under Director Asset Management review access.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              id="confirm-role-login-btn"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authenticate &amp; Open Questionnaire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500">
          <span>
            Authorized Review Session for Mr. Nushi
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
