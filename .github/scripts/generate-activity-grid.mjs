// Gera .github/assets/activity-grid.svg (grade de atividade em vidro, com onda animada)
// Uso: node .github/scripts/generate-activity-grid.mjs
import fs from 'fs';

const cols = 53;
const rows = 7;
const startX = 76;
const startY = 92;
const step = 13.5;
const size = 10;
const rx = 3;

// Distribuição determinística (mesma grade a cada geração)
function getLevel(c, r) {
  const seed = (c * 17 + r * 31 + (c ^ r) * 7) % 100;
  if (seed < 22) return 0;
  if (seed < 50) return 1;
  if (seed < 76) return 2;
  if (seed < 92) return 3;
  return 4;
}

const opacity = { 0: 0.07, 1: 0.24, 2: 0.46, 3: 0.74, 4: 1 };

let columnsSvg = '';
for (let c = 0; c < cols; c++) {
  const x = (startX + c * step).toFixed(1);
  const delay = (c * 0.09).toFixed(2);
  let cells = '';
  for (let r = 0; r < rows; r++) {
    const y = startY + r * step;
    const lvl = getLevel(c, r);
    const fill = lvl === 0 ? '#FFFFFF' : '#64D2FF';
    cells += `      <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${rx}" fill="${fill}" fill-opacity="${opacity[lvl]}" />\n`;
  }
  columnsSvg += `    <g class="col" style="animation-delay:${delay}s">\n${cells}    </g>\n`;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
let monthLabelsSvg = '';
months.forEach((m, idx) => {
  const mx = (startX + Math.floor(idx * (cols / 12)) * step).toFixed(1);
  monthLabelsSvg += `    <text class="mono" x="${mx}" y="80" fill="#8B93A7" font-size="11">${m}</text>\n`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 226" width="100%" height="100%" role="img" aria-labelledby="grid-title">
  <title id="grid-title">Grade de atividade dos últimos 12 meses</title>
  <defs>
    <clipPath id="card"><rect x="1" y="1" width="838" height="224" rx="20" /></clipPath>

    <linearGradient id="gFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.11" />
      <stop offset="1" stop-color="#fff" stop-opacity="0.03" />
    </linearGradient>
    <linearGradient id="gStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.36" />
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.06" />
      <stop offset="1" stop-color="#fff" stop-opacity="0.16" />
    </linearGradient>
    <linearGradient id="gGlint" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.5" stop-color="#fff" stop-opacity="0.55" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="gSweep" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#64D2FF" stop-opacity="0" />
      <stop offset="0.5" stop-color="#64D2FF" stop-opacity="1" />
      <stop offset="1" stop-color="#64D2FF" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="orbBlue"><stop offset="0" stop-color="#0A84FF" stop-opacity="0.38" /><stop offset="1" stop-color="#0A84FF" stop-opacity="0" /></radialGradient>
    <radialGradient id="orbIndigo"><stop offset="0" stop-color="#5E5CE6" stop-opacity="0.36" /><stop offset="1" stop-color="#5E5CE6" stop-opacity="0" /></radialGradient>
  </defs>

  <style>
    .sans { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI Variable Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .mono { font-family: ui-monospace, "SF Mono", "JetBrains Mono", Consolas, Menlo, monospace; }

    @keyframes drift1 { from { transform: translate(0, 0); } to { transform: translate(100px, -20px); } }
    @keyframes drift2 { from { transform: translate(0, 0); } to { transform: translate(-90px, 20px); } }
    .o1 { animation: drift1 17s ease-in-out infinite alternate; }
    .o2 { animation: drift2 21s ease-in-out infinite alternate; }

    @keyframes glare { 0%, 55% { transform: translateX(0); } 100% { transform: translateX(1200px); } }
    .glare { animation: glare 11s ease-in-out infinite 5s; }

    @keyframes sweep { from { transform: translateX(-260px); } to { transform: translateX(840px); } }
    .sweep { animation: sweep 8s ease-in-out infinite 2s; }

    @keyframes ring { 0% { opacity: 0.6; transform: scale(1); } 100% { opacity: 0; transform: scale(2.8); } }
    .ring { transform-box: fill-box; transform-origin: center; animation: ring 2.4s ease-out infinite; }

    /* Onda de brilho percorre as colunas da esquerda para a direita */
    @keyframes wave { 0%, 100% { opacity: 0.5; } 45% { opacity: 1; } 70% { opacity: 0.6; } }
    .col { animation: wave 5.5s ease-in-out infinite; }

    @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .rise { animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
    .d1 { animation-delay: 0.1s; } .d2 { animation-delay: 0.3s; }

    @media (prefers-reduced-motion: reduce) {
      .o1, .o2, .glare, .sweep, .ring, .col, .rise { animation: none !important; }
      .ring, .sweep, .glare { opacity: 0; }
    }
  </style>

  <rect x="1" y="1" width="838" height="224" rx="20" fill="#06080F" />
  <g clip-path="url(#card)">
    <circle class="o1" cx="150" cy="230" r="240" fill="url(#orbIndigo)" />
    <circle class="o2" cx="690" cy="0" r="250" fill="url(#orbBlue)" />
    <g transform="skewX(-20)"><rect class="glare" x="-300" y="-20" width="140" height="260" fill="url(#gGlint)" opacity="0.09" /></g>
    <rect class="sweep" x="0" y="1" width="260" height="1.5" fill="url(#gSweep)" />
  </g>
  <rect x="1" y="1" width="838" height="224" rx="20" fill="none" stroke="url(#gStroke)" stroke-width="1" />

  <!-- Cabeçalho -->
  <text class="sans rise d1" x="40" y="42" fill="#F5F5F7" font-size="16" font-weight="600">Atividade de contribuições</text>
  <g class="rise d1">
    <rect x="652" y="24" width="148" height="28" rx="14" fill="url(#gFill)" stroke="url(#gStroke)" stroke-width="1" />
    <circle class="ring" cx="670" cy="38" r="3.5" fill="#30D158" />
    <circle cx="670" cy="38" r="3.5" fill="#30D158" />
    <text class="sans" x="684" y="43" fill="#E5E7EB" font-size="12.5" font-weight="600">Últimos 12 meses</text>
  </g>

  <!-- Grade -->
  <g class="rise d2">
${monthLabelsSvg}    <text class="mono" x="40" y="${startY + 9}" fill="#8B93A7" font-size="11">Seg</text>
    <text class="mono" x="40" y="${startY + 9 + step * 2}" fill="#8B93A7" font-size="11">Qua</text>
    <text class="mono" x="40" y="${startY + 9 + step * 4}" fill="#8B93A7" font-size="11">Sex</text>
${columnsSvg}  </g>

  <!-- Legenda -->
  <g class="rise d2" transform="translate(0, 208)">
    <text class="mono" x="660" y="0" fill="#8B93A7" font-size="11" text-anchor="end">Menos</text>
    <rect x="668" y="-9" width="10" height="10" rx="3" fill="#fff" fill-opacity="0.07" />
    <rect x="682" y="-9" width="10" height="10" rx="3" fill="#64D2FF" fill-opacity="0.24" />
    <rect x="696" y="-9" width="10" height="10" rx="3" fill="#64D2FF" fill-opacity="0.46" />
    <rect x="710" y="-9" width="10" height="10" rx="3" fill="#64D2FF" fill-opacity="0.74" />
    <rect x="724" y="-9" width="10" height="10" rx="3" fill="#64D2FF" />
    <text class="mono" x="742" y="0" fill="#8B93A7" font-size="11">Mais</text>
  </g>
</svg>
`;

fs.writeFileSync('.github/assets/activity-grid.svg', svg, 'utf8');
console.log('Gerado .github/assets/activity-grid.svg');
