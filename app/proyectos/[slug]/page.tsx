import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectBySlug } from "@/content/projects";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { ProcessSection } from "@/components/case-study/ProcessSection";
import { Gallery } from "@/components/case-study/Gallery";
import { ResultsSection } from "@/components/case-study/ResultsSection";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Proyecto no encontrado" };
  return {
    title: `${project.name} — Mateo Espinosa`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <CaseStudyHero project={project} />
      <ProcessSection project={project} />
      <Gallery project={project} />
      <ResultsSection project={project} />
      <CaseStudyNav currentSlug={project.slug} />
    </>
  );
}
