// Script to generate matrix-grid.svg
import fs from 'fs';

const cols = 53;
const rows = 7;
const startX = 64;
const startY = 56;
const step = 14;
const size = 10;
const rx = 2.5;

// Pseudo-random but deterministic activity distribution matching ~2,500 commits
function getLevel(c, r) {
  const seed = (c * 17 + r * 31 + (c ^ r) * 7) % 100;
  if (seed < 22) return 0; // inactive
  if (seed < 50) return 1; // light commit
  if (seed < 76) return 2; // medium
  if (seed < 92) return 3; // high (cyan)
  return 4; // peak (neon matrix green)
}

const colors = {
  0: '#101726',
  1: '#064E3B',
  2: '#047857',
  3: '#00D9FF',
  4: '#00FF66'
};

let cellsSvg = '';
for (let c = 0; c < cols; c++) {
  const x = startX + c * step;
  for (let r = 0; r < rows; r++) {
    const y = startY + r * step;
    const lvl = getLevel(c, r);
    const color = colors[lvl];
    cellsSvg += `    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${rx}" fill="${color}" />\n`;
  }
}

// 18 Matrix rain streaks falling across columns
const rainCols = [2, 5, 8, 12, 15, 19, 22, 26, 29, 33, 36, 40, 43, 46, 49, 51];
let rainStreaksSvg = '';
let rainCss = '';

rainCols.forEach((colIdx, idx) => {
  const x = startX + colIdx * step;
  const duration = (1.5 + (idx % 5) * 0.35).toFixed(2);
  const delay = ((idx * 0.35) % 2.6).toFixed(2);
  const className = `rain-${idx}`;

  rainCss += `
    .${className} {
      animation: dropRain ${duration}s cubic-bezier(0.4, 0, 0.8, 1) infinite;
      animation-delay: ${delay}s;
    }`;

  rainStreaksSvg += `    <rect x="${x}" y="-65" width="${size}" height="65" rx="${rx}" fill="url(#matrixRainGrad)" class="${className}" />\n`;
});

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
let monthLabelsSvg = '';
months.forEach((m, idx) => {
  const mx = startX + Math.floor(idx * (cols / 12)) * step;
  monthLabelsSvg += `    <text x="${mx}" y="46" fill="#475569" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="500">${m}</text>\n`;
});

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 196" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="matrixBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050914" />
      <stop offset="50%" stop-color="#080D1A" />
      <stop offset="100%" stop-color="#04060F" />
    </linearGradient>

    <!-- Matrix Rain Streak Laser Gradient -->
    <linearGradient id="matrixRainGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00FF66" stop-opacity="0" />
      <stop offset="40%" stop-color="#00D9FF" stop-opacity="0.35" />
      <stop offset="82%" stop-color="#00FF66" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1" />
    </linearGradient>

    <pattern id="matrixScanline" width="100%" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100%" y2="0" stroke="#00FF66" stroke-width="0.3" stroke-opacity="0.08" />
    </pattern>

    <clipPath id="cardClip">
      <rect x="2" y="2" width="856" height="192" rx="14" />
    </clipPath>
  </defs>

  <style>
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.8); }
    }

    @keyframes dropRain {
      0% {
        transform: translateY(0px);
        opacity: 0;
      }
      15% {
        opacity: 0.95;
      }
      85% {
        opacity: 0.95;
      }
      100% {
        transform: translateY(240px);
        opacity: 0;
      }
    }

    @keyframes glitchText {
      0%, 94%, 100% { opacity: 1; }
      95% { opacity: 0.5; }
      97% { opacity: 0.9; }
    }

    .pulse-live {
      transform-origin: 708px 24px;
      animation: pulseDot 1.8s ease-in-out infinite;
    }

    .title-glitch {
      animation: glitchText 6s infinite;
    }
${rainCss}

    .code-font {
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    }
  </style>

  <!-- Container Box -->
  <rect x="2" y="2" width="856" height="192" rx="14" fill="url(#matrixBg)" stroke="#1E293B" stroke-width="1.5" />
  <rect x="2" y="2" width="856" height="192" rx="14" fill="url(#matrixScanline)" />

  <!-- Top Title Header -->
  <g transform="translate(28, 28)">
    <text x="0" y="0" fill="#00FF66" class="code-font title-glitch" font-size="12" font-weight="700" letter-spacing="1.2">
      ⚡ MATRIX CODE STREAM // 2,504+ COMMITS DEPLOYED
    </text>
  </g>

  <!-- Top Right Status Badge -->
  <g transform="translate(686, 12)">
    <rect x="0" y="0" width="144" height="24" rx="12" fill="#071912" stroke="#10B981" stroke-width="0.8" />
    <circle cx="14" cy="12" r="4.5" fill="#00FF66" class="pulse-live" />
    <text x="26" y="16" fill="#00FF66" class="code-font" font-size="10" font-weight="700" letter-spacing="0.8">LIVE STREAMING</text>
  </g>

  <!-- Month Labels -->
  <g>
${monthLabelsSvg}  </g>

  <!-- Day Labels -->
  <text x="36" y="65" fill="#475569" class="code-font" font-size="9.5">Seg</text>
  <text x="36" y="93" fill="#475569" class="code-font" font-size="9.5">Qua</text>
  <text x="36" y="121" fill="#475569" class="code-font" font-size="9.5">Sex</text>

  <!-- Base Contribution Grid (53x7) -->
  <g id="contribution-cells">
${cellsSvg}  </g>

  <!-- Animated Matrix Digital Rain Streaks (Clipped cleanly to container) -->
  <g id="matrix-rain-streaks" clip-path="url(#cardClip)" style="mix-blend-mode: screen;">
${rainStreaksSvg}  </g>

  <!-- Legend and System Status Bar at Bottom -->
  <g transform="translate(36, 172)">
    <text x="0" y="0" fill="#64748B" class="code-font" font-size="10">FEED: GITHUB/GUSTAVO-LG/MAIN</text>
    
    <!-- Legend -->
    <text x="640" y="0" fill="#64748B" class="code-font" font-size="9.5">Menos</text>
    <rect x="682" y="-9" width="9" height="9" rx="2" fill="#101726" />
    <rect x="696" y="-9" width="9" height="9" rx="2" fill="#064E3B" />
    <rect x="710" y="-9" width="9" height="9" rx="2" fill="#047857" />
    <rect x="724" y="-9" width="9" height="9" rx="2" fill="#00D9FF" />
    <rect x="738" y="-9" width="9" height="9" rx="2" fill="#00FF66" />
    <text x="754" y="0" fill="#64748B" class="code-font" font-size="9.5">Mais</text>
  </g>
</svg>
`;

fs.writeFileSync('.github/assets/matrix-grid.svg', svgContent, 'utf8');
console.log('Successfully updated .github/assets/matrix-grid.svg with clipPath!');
