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
    currentUser?.username?.toLowerCase() === 'seakit' ||
    currentUser?.username?.toLowerCase() === 'bujar.nushi' ||
    currentUser?.username?.toLowerCase() === 'bujar.noshi';

  const executiveName = isNushi
    ? 'Mr. Nushi'
    : currentUser?.displayName || 'Mr. Nushi';

  return (
    <div
      className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-600/50 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
      id="executive-greeting-banner"
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0">
          {icon === 'morning' && <Sun className="w-5 h-5 text-amber-300" />}
          {icon === 'afternoon' && <Sunset className="w-5 h-5 text-amber-300" />}
          {icon === 'evening' && <Moon className="w-5 h-5 text-blue-200" />}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xs font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded font-mono">
              Sea-Kit &bull; PMO Review
            </span>
            <span className="text-2xs text-blue-200 font-semibold">
              Director Asset Management
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            {greeting},{' '}
            <span className="text-cyan-200 font-extrabold">
              {executiveName}
            </span>
          </h2>
          <p className="text-2xs sm:text-xs text-blue-100 max-w-2xl leading-relaxed mt-0.5">
            Welcome to the PMO Establishment Proposal &amp; Diagnostic Platform.
          </p>
        </div>
      </div>

      {/* Verified Sea-Kit / PJMAK badge */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-3 sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1 shadow-2xs">
        <span className="text-3xs uppercase font-extrabold tracking-wider text-cyan-200 flex items-center gap-1 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
          <span>Verified Access</span>
        </span>
        <span className="text-2xs text-blue-200 font-medium">
          Sea-Kit International &bull; PJMAK
        </span>
      </div>
    </div>
  );
};
