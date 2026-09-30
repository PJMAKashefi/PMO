import React, { useState } from 'react';

interface SeaKitLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SeaKitLogo: React.FC<SeaKitLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimensions
  const dimClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
  }[size];

  if (!imageError) {
    return (
      <div
        className={`bg-black rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-900 shadow-2xs ${dimClasses} ${className}`}
        title="Sea-Kit International Ltd (a Fugro company)"
      >
        <img
          src="/sea-kit-logo.jpg"
          alt="Sea-Kit International - a Fugro company"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // High-fidelity vector SVG fallback identical to the logo
  return (
    <div
      className={`bg-black rounded-lg overflow-hidden shrink-0 flex flex-col items-center justify-center p-1 border border-slate-900 text-white select-none ${dimClasses} ${className}`}
      title="Sea-Kit International Ltd (a Fugro company)"
    >
      <div className="font-black tracking-tighter text-[9px] leading-[10px] text-slate-200 uppercase text-center font-sans">
        <div>SEA</div>
        <div>KIT</div>
      </div>
      <div className="text-[4px] text-slate-400 tracking-tight leading-none mt-0.5">
        a Fugro co.
      </div>
    </div>
  );
};
