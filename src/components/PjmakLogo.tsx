import React from 'react';

interface PjmakLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const PjmakLogo: React.FC<PjmakLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Dimensions map
  const dimensions = {
    sm: { height: 36, viewBox: '0 0 400 240', textScale: 'text-xs' },
    md: { height: 52, viewBox: '0 0 400 240', textScale: 'text-sm' },
    lg: { height: 76, viewBox: '0 0 400 240', textScale: 'text-base' },
    xl: { height: 104, viewBox: '0 0 400 240', textScale: 'text-lg' },
  };

  const dim = dimensions[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`} id="pjmak-branding-logo">
      <svg
        viewBox="0 0 500 290"
        style={{ height: `${dim.height}px`, width: 'auto' }}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="PJMAK - Project Management Key Logo"
      >
        <defs>
          <clipPath id="m-cutout">
            {/* The geometry of stylized M with sharp cuts */}
            <polygon points="196,110 220,110 250,172 280,110 304,110 304,212 280,212 280,146 256,196 244,196 220,146 220,212 196,212" />
          </clipPath>
        </defs>

        {/* 1. Golden / Orange Crown at Top */}
        <g transform="translate(205, 36) scale(0.9)">
          <polygon
            points="50,12 68,52 88,24 84,68 16,68 12,24 32,52"
            fill="#F39200"
          />
          {/* Crown base band */}
          <rect x="16" y="70" width="68" height="9" rx="1.5" fill="#F39200" />
        </g>

        {/* 2. PJ Letters */}
        <g fill="#111827" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="108">
          {/* P */}
          <text x="56" y="210" letterSpacing="-2px">P</text>
          {/* J */}
          <text x="122" y="210" letterSpacing="-2px">J</text>
        </g>

        {/* 3. Stylized 'M' with Dutch Flag Tricolor (Red / White / Cobalt Blue) */}
        <g clipPath="url(#m-cutout)">
          {/* Top Red Band */}
          <rect x="190" y="105" width="120" height="36" fill="#AE1C28" />
          {/* Middle White Band */}
          <rect x="190" y="141" width="120" height="35" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
          {/* Bottom Blue Band */}
          <rect x="190" y="176" width="120" height="40" fill="#21468B" />
        </g>
        {/* Outline boundary for M to ensure crisp contrast on light canvas */}
        <polygon
          points="196,110 220,110 250,172 280,110 304,110 304,212 280,212 280,146 256,196 244,196 220,146 220,212 196,212"
          fill="none"
          stroke="#0F172A"
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />

        {/* 4. AK Letters */}
        <g fill="#111827" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="108">
          {/* A */}
          <text x="312" y="210" letterSpacing="-2px">A</text>
          {/* K */}
          <text x="390" y="210" letterSpacing="-2px">K</text>
        </g>

        {/* 5. Subtitle: "Project Management Key" */}
        {showSubtitle && (
          <g>
            <text
              x="250"
              y="256"
              textAnchor="middle"
              fill="#0F172A"
              fontFamily="Georgia, Cambria, 'Times New Roman', serif"
              fontWeight="600"
              fontSize="30"
              letterSpacing="0.8px"
            >
              Project Management Key
            </text>
            {/* Underline */}
            <line
              x1="44"
              y1="264"
              x2="456"
              y2="264"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
