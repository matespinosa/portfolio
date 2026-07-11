export type SocialLink = {
  label: string;
  href: string;
};

export type Stat = {
  value: number;
  label: string;
  plus?: boolean;
};

export type Skill = {
  num: string;
  title: string;
  description: string;
};

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
};

export type ProjectMediaVariant = "a" | "b" | "c" | "d";

export type ProjectArt = {
  viewBox: string;
  ariaLabel: string;
  shapes: string; // SVG inner markup
};

export type CaseStudyProcessStep = {
  title: string;
  body: string;
};

export type CaseStudyResult = {
  metric: string;
  label: string;
};

export type CaseStudyGalleryItem = {
  title: string;
  caption: string;
  variant: ProjectMediaVariant;
};

export type Project = {
  slug: string;
  name: string;
  title: string;
  year: string;
  tags: string[];
  summary: string;
  mediaVariant: ProjectMediaVariant;
  art: ProjectArt;
  /** Placeholder case-study content — replace with real details */
  isPlaceholder: true;
  role: string;
  timeline: string;
  tools: string[];
  overview: string;
  challenge: string;
  process: CaseStudyProcessStep[];
  gallery: CaseStudyGalleryItem[];
  results: CaseStudyResult[];
  outcome: string;
};
