"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import type { Project } from "@/content/types";

/**
 * El modelo responde texto markdown + marcadores en línea propia:
 *   [[project:slug]]  → tarjeta de caso de estudio
 *   [[cta:contact]]   → tarjeta de contacto
 *   [[suggest:¿…?]]   → chips de preguntas de seguimiento
 * Este componente parsea el stream y lo convierte en bloques visuales.
 */

const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

type Segment =
  | { kind: "md"; text: string }
  | { kind: "project"; project: Project }
  | { kind: "cta" };

export type ParsedAssistant = { segments: Segment[]; suggestions: string[] };

const MARKER = /\[\[(project|cta|suggest):?\s*([^\]]*?)\s*\]\]/g;

export function parseAssistantText(raw: string, streaming: boolean): ParsedAssistant {
  let text = raw;
  if (streaming) {
    // Oculta un marcador que aún no terminó de llegar ("[[sugg…")
    text = text.replace(/\[\[?[^[\]]*$/, "");
  }

  const segments: Segment[] = [];
  const suggestions: string[] = [];
  let cursor = 0;

  for (const match of text.matchAll(MARKER)) {
    const before = text.slice(cursor, match.index).trim();
    if (before) segments.push({ kind: "md", text: before });

    const [, type, rawValue] = match;
    const value = rawValue.trim();

    if (type === "project") {
      const project = projectBySlug.get(value.toLowerCase());
      const dupe = segments.some(
        (s) => s.kind === "project" && s.project.slug === project?.slug,
      );
      if (project && !dupe) segments.push({ kind: "project", project });
    } else if (type === "cta") {
      if (!segments.some((s) => s.kind === "cta")) segments.push({ kind: "cta" });
    } else if (type === "suggest" && value) {
      suggestions.push(value);
    }

    cursor = (match.index ?? 0) + match[0].length;
  }

  const rest = text.slice(cursor).trim();
  if (rest) segments.push({ kind: "md", text: rest });

  return { segments, suggestions };
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

function ProjectChatCard({ project }: { project: Project }) {
  const highlight = project.results[0];
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className="chat-card"
      aria-label={`Ver caso de estudio: ${project.name}`}
    >
      <span className={`chat-card__media project__media--${project.mediaVariant}`} aria-hidden="true">
        <svg viewBox={project.art.viewBox} dangerouslySetInnerHTML={{ __html: project.art.shapes }} />
      </span>
      <span className="chat-card__body">
        <span className="chat-card__top">
          <strong>{project.name}</strong>
          <span className="chat-card__year">{project.year}</span>
        </span>
        <span className="chat-card__tags">{project.tags.join(" · ")}</span>
        {highlight ? (
          <span className="chat-card__metric">
            <b>{highlight.metric}</b> {highlight.label}
          </span>
        ) : null}
      </span>
      <span className="chat-card__arrow">
        <ArrowIcon />
      </span>
    </Link>
  );
}

function ContactCard() {
  return (
    <div className="chat-cta">
      <p>
        <strong>{profile.availability}.</strong> Respondo en menos de 24 horas.
      </p>
      <div className="chat-cta__actions">
        <Link className="btn btn--primary btn--sm" href="/#contacto">
          Ir al formulario
        </Link>
        <a className="btn btn--ghost btn--sm" href={`mailto:${profile.email}`}>
          Escribir email
        </a>
      </div>
    </div>
  );
}

export function AssistantMessage({
  text,
  streaming,
  suggestionsEnabled,
  onSuggest,
}: {
  text: string;
  streaming: boolean;
  suggestionsEnabled: boolean;
  onSuggest: (text: string) => void;
}) {
  const { segments, suggestions } = parseAssistantText(text, streaming);

  return (
    <div className="chat-turn">
      {segments.map((seg, i) => {
        if (seg.kind === "project") return <ProjectChatCard key={`p-${seg.project.slug}`} project={seg.project} />;
        if (seg.kind === "cta") return <ContactCard key="cta" />;
        return (
          <div className="chat-prose" key={`t-${i}`}>
            <ReactMarkdown>{seg.text}</ReactMarkdown>
          </div>
        );
      })}
      {streaming ? <span className="chat-caret" aria-hidden="true" /> : null}
      {suggestionsEnabled && suggestions.length > 0 ? (
        <div className="chat-chips" aria-label="Preguntas sugeridas">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chat-chip" onClick={() => onSuggest(s)}>
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
