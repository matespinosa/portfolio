export type SkinId = "editorial" | "agency" | "terminal";

export type SkinOption = {
  id: SkinId;
  label: string;
  short: string;
  description: string;
  /** Accent swatch shown in the pill */
  swatch: string;
  source: string;
};

export const SKINS: SkinOption[] = [
  {
    id: "editorial",
    label: "Editorial",
    short: "Edit",
    description: "Cálida tipográfica — Space Grotesk + Instrument Serif",
    swatch: "#e8541f",
    source: "designer + case studies",
  },
  {
    id: "agency",
    label: "Agency",
    short: "Agency",
    description: "Monocromo + lima — Sora / Inter (AI-enhanced)",
    swatch: "#cbff2e",
    source: "portfolio-ai-enhanced",
  },
  {
    id: "terminal",
    label: "Terminal",
    short: "Term",
    description: "GitHub / IDE — verde terminal + mono",
    swatch: "#39d353",
    source: "portfolio-frontend-nextjs",
  },
];

export const DEFAULT_SKIN: SkinId = "editorial";
export const SKIN_STORAGE_KEY = "visual-skin";

export function isSkinId(value: string | null | undefined): value is SkinId {
  return value === "editorial" || value === "agency" || value === "terminal";
}
