// Génère une image de remplacement en SVG (data URI), aucune requête réseau nécessaire.
const PALETTE = [
  ['#6366f1', '#818cf8'],
  ['#ec4899', '#f472b6'],
  ['#14b8a6', '#5eead4'],
  ['#f59e0b', '#fbbf24'],
  ['#8b5cf6', '#a78bfa'],
  ['#ef4444', '#f87171'],
  ['#0ea5e9', '#38bdf8'],
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generatePlaceholder(label = 'Produit') {
  const [colorA, colorB] = PALETTE[hashString(label) % PALETTE.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#g)" />
      <circle cx="300" cy="300" r="90" fill="rgba(255,255,255,0.12)" />
      <circle cx="300" cy="300" r="50" fill="rgba(255,255,255,0.08)" />
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
