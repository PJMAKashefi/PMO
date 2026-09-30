import React, { useState, useEffect } from 'react';
import { Sun, Sunset, Moon, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface TimeOfDayGreetingProps {
  currentUser: UserAccount | null;
}

export const TimeOfDayGreeting: React.FC<TimeOfDayGreetingProps> = ({ currentUser }) => {
  const [greeting, setGreeting] = useState('Good day');
  const [icon, setIcon] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      let greet = 'Good day';
      let iconType: 'morning' | 'afternoon' | 'evening' = 'afternoon';

      if (hour >= 5 && hour < 12) {
        greet = 'Good morning';
        iconType = 'morning';
      } else if (hour >= 12 && hour < 17) {
        greet = 'Good afternoon';
        iconType = 'afternoon';
      } else {
        greet = 'Good evening';
        iconType = 'evening';
      }

      setGreeting(greet);
      setIcon(iconType);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const isNushi =
    currentUser?.displayName?.toLowerCase().includes('nushi') ||
    currentUser?.displayName?.toLowerCase().includes('noshi') ||
    currentUser?.username?.toLowerCase() === 'b.nushi' ||
    currentUser?.username?.toLowerCase() === 'mr.nushi' ||
    currentUser?.username?.toLowerCase() === 'nushi' ||
    currentUser?.username?.toLowerCase() === 'bujar.nushi' ||
    currentUser?.username?.toLowerCase() === 'bujar.noshi';

  const executiveName = isNushi
    ? 'Mr. Nushi'
    : currentUser?.displayName || 'Sea-Kit Team Member';

  const roleLabel = isNushi
    ? 'Director Asset Management'
    : currentUser?.roleTitle || 'Sea-Kit Stakeholder';

  return (
    <div
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-700/60 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
      id="executive-greeting-banner"
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
          {icon === 'morning' && <Sun className="w-5 h-5 text-amber-300" />}
          {icon === 'afternoon' && <Sunset className="w-5 h-5 text-amber-400" />}
          {icon === 'evening' && <Moon className="w-5 h-5 text-teal-300" />}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xs font-extrabold uppercase tracking-wider bg-teal-400 text-slate-950 px-2 py-0.5 rounded font-mono">
              {isNushi ? 'Sea-Kit • Executive PMO Review' : 'Sea-Kit • Stakeholder Portal'}
            </span>
            <span className="text-2xs text-teal-200/80 font-medium">
              {roleLabel}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            {greeting},{' '}
            <span className="text-teal-300">
              {executiveName}
            </span>
          </h2>
          <p className="text-2xs sm:text-xs text-slate-300 max-w-2xl leading-relaxed mt-0.5">
            {isNushi
              ? 'Welcome to the PMO Establishment Proposal & Diagnostic Platform. You have authorized review access with inline feedback commenting.'
              : 'Welcome to the PMO Establishment Proposal & Diagnostic Platform. Please review the proposal chapters and complete your stakeholder profile.'}
          </p>
        </div>
      </div>

      {/* Verified Sea-Kit / PJMAK badge */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shadow-2xs">
        <span className="text-3xs uppercase font-extrabold tracking-wider text-teal-400 flex items-center gap-1 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isNushi ? 'Executive Access' : 'Verified Access'}</span>
        </span>
        <span className="text-2xs text-slate-300 font-medium">
          Sea-Kit International &bull; PJMAK
        </span>
      </div>
    </div>
  );
};
