// Genera una matriz de contribuciones estilo GitHub (53 semanas x 7 días).
// Determinista para que SSR y cliente coincidan (sin Math.random).

export type Day = { level: 0 | 1 | 2 | 3 | 4; count: number };

// PRNG determinista (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildContributions(seed = 20260708): Day[][] {
  const rand = mulberry32(seed);
  const weeks: Day[][] = [];
  for (let w = 0; w < 53; w++) {
    const week: Day[] = [];
    for (let d = 0; d < 7; d++) {
      const r = rand();
      // sesgo: más actividad entre semana, menos fines de semana
      const weekendPenalty = d === 0 || d === 6 ? 0.55 : 1;
      const roll = r * weekendPenalty;
      let level: Day["level"] = 0;
      if (roll > 0.86) level = 4;
      else if (roll > 0.7) level = 3;
      else if (roll > 0.48) level = 2;
      else if (roll > 0.26) level = 1;
      const count = level === 0 ? 0 : Math.ceil(roll * 9);
      week.push({ level, count });
    }
    weeks.push(week);
  }
  return weeks;
}

export const monthLabels = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export const dayLabels = ["", "Lun", "", "Mié", "", "Vie", ""];
