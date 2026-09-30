import React, { useState } from 'react';
import { PjmakLogo } from './PjmakLogo';
import { SeaKitLogo } from './SeaKitLogo';
import { SYSTEM_ACCOUNTS, UserCredential } from '../data/authUsers';
import { UserAccount } from '../types';
import {
  AlertCircle,
  ArrowRight,
  KeyRound,
  Lock,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('seakit');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const matched = SYSTEM_ACCOUNTS.find(
      (a) => a.username.toLowerCase() === cleanUser && a.password === cleanPass
    );

    if (matched) {
      setError(null);
      onLogin({
        username: matched.username,
        displayName: matched.displayName,
        category: matched.category,
        roleTitle: matched.roleTitle,
        department: matched.department,
        isAssetOwner: matched.isAssetOwner,
        isOwner: matched.isOwner,
      });
    } else {
      setError('Invalid credentials. Initial sign in is reserved for authorized credentials (username: "seakit", password: "password").');
    }
  };

  const handleQuickSignIn = () => {
    const acc = SYSTEM_ACCOUNTS[0];
    onLogin({
      username: acc.username,
      displayName: acc.displayName,
      category: acc.category,
      roleTitle: acc.roleTitle,
      department: acc.department,
      isAssetOwner: acc.isAssetOwner,
      isOwner: acc.isOwner,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-xl space-y-6">
        {/* Header Branding Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-1">
            <SeaKitLogo size="lg" />
            <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
              <PjmakLogo size="md" showSubtitle={true} />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            PMO ESTABLISHMENT SOFTWARE / TOOL &mdash; SEA-KIT
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Executive Proposal &amp; Diagnostic Platform &bull; Sea-Kit International Ltd
          </p>
        </div>

        {/* Exclusive Sign In Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">
                Executive Portal Sign In
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Access is authenticated for <span className="font-bold text-slate-800">Mr. Nushi</span> (Director Asset Management).
            </p>
          </div>

          {/* Quick Access Card for Mr. Nushi */}
          <div className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <User className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      Mr. Nushi
                    </span>
                    <span className="text-3xs font-extrabold uppercase bg-teal-700 text-white px-2 py-0.5 rounded">
                      Director Asset Management
                    </span>
                  </div>
                  <span className="text-2xs text-slate-600 block mt-0.5">
                    Sea-Kit International Ltd &bull; Executive Proposal Review &amp; Assessment
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickSignIn}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Instant Sign In as Mr. Nushi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-3xs font-bold uppercase tracking-wider text-slate-400">
              Or Sign In with Credentials
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
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
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
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
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-2xs text-red-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit &amp; Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-2xs text-slate-500 space-y-1.5">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Confidential Review:</strong> Once signed in, you have full universal access to review the proposal chapters and examine all departmental questionnaires via the Stakeholder Profile.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
