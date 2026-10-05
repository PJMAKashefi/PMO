import React, { useState } from 'react';
import { PjmakLogo } from './PjmakLogo';
import { SeaKitLogo } from './SeaKitLogo';
import { SYSTEM_ACCOUNTS } from '../data/authUsers';
import { UserAccount } from '../types';
import { submitExtensionRequest } from '../data/accessRequestsStorage';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpiredError, setIsExpiredError] = useState(false);
  const [expiredAccountInfo, setExpiredAccountInfo] = useState<{ username: string; displayName: string; roleTitle: string } | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please enter both your username and password.');
      setIsExpiredError(false);
      return;
    }

    const matched = SYSTEM_ACCOUNTS.find(
      (a) => a.username.toLowerCase() === cleanUser && a.password === cleanPass
    );

    if (matched) {
      if (matched.isExpired) {
        setIsExpiredError(true);
        setExpiredAccountInfo({
          username: matched.username,
          displayName: matched.displayName,
          roleTitle: matched.roleTitle,
        });
        setError(
          matched.expiredMessage ||
            'Access Expired: The preliminary 72-hour review period has concluded. In accordance with security protocol, please contact PJMAK Advisory (Ali Kashefi) to request an extended review token or formal PMO presentation.'
        );
        return;
      }

      setError(null);
      setIsExpiredError(false);
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
      setIsExpiredError(false);
      setError('Invalid username or password. Please verify your Sea-Kit credentials.');
    }
  };

  const handleSendExtensionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiredAccountInfo) return;
    submitExtensionRequest(
      expiredAccountInfo.username,
      expiredAccountInfo.displayName,
      expiredAccountInfo.roleTitle,
      requestNote.trim() || 'Requested 72-hour review extension token.'
    );
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      setRequestNote('');
    }, 2500);
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

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">
                Portal Sign In
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Please enter your authorized Sea-Kit credentials to access the PMO platform.
            </p>
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
                  placeholder="Enter your username (e.g. seakit)"
                  autoComplete="off"
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
                  placeholder="Enter your password"
                  autoComplete="off"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-2xs text-red-800 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{error}</span>
                </div>
                {isExpiredError && (
                  <div className="pt-2 border-t border-red-200/70 flex items-center justify-between">
                    <span className="text-3xs text-red-700 font-medium">Need further review time?</span>
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold text-2xs transition-colors cursor-pointer shadow-2xs"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Request Access Extension</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Sign In &amp; Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-2xs text-slate-500 space-y-1.5">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Confidential Access:</strong> Sea-Kit team members should first complete their Stakeholder Profile upon signing in before filling out their respective departmental diagnostic questionnaires.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Request Access Extension</h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {requestSubmitted ? (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                  <p className="text-xs font-bold text-teal-900">Extension Request Transmitted</p>
                  <p className="text-2xs text-teal-700">
                    Your request has been logged and sent to PJMAK Advisory (Ali Kashefi). You will be notified once access is extended.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendExtensionRequest} className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-2xs space-y-1">
                    <p className="text-slate-500">Applicant:</p>
                    <p className="font-bold text-slate-800">
                      {expiredAccountInfo?.displayName} ({expiredAccountInfo?.roleTitle})
                    </p>
                    <p className="text-3xs text-slate-500 font-mono">Username: {expiredAccountInfo?.username}</p>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Reason / Message for Ali Kashefi (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      placeholder="e.g. Need an additional 48 hours to complete Section 4.5 Engineering review..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Transmit Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
