"use client";

import { FormEvent, useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useChatLauncher } from "@/components/chat/ChatProvider";
import { useSkin } from "@/lib/useSkin";
import {
  ArrowUpIcon,
  GridIcon,
  LayersIcon,
  MailIcon,
  RouteIcon,
  SearchIcon,
  SparkIcon,
} from "@/components/chat/icons";

type Topic = {
  id: string;
  label: string;
  icon: React.ReactNode;
  questions: string[];
};

const TOPICS: Topic[] = [
  {
    id: "casos",
    label: "Casos de estudio",
    icon: <GridIcon size={20} />,
    questions: [
      "¿Qué proyectos de fintech ha hecho?",
      "Cuéntame sobre miBanco",
      "¿Cómo fue Credicorp Capital?",
    ],
  },
  {
    id: "experiencia",
    label: "Experiencia",
    icon: <RouteIcon size={20} />,
    questions: [
      "Cuéntame su trayectoria",
      "¿Dónde ha trabajado?",
      "¿Cuántos años de experiencia tiene?",
    ],
  },
  {
    id: "proceso",
    label: "UX & Research",
    icon: <SearchIcon size={20} />,
    questions: [
      "¿Cómo es su proceso de research?",
      "¿Qué herramientas usa?",
      "¿Cómo mide el impacto de su trabajo?",
    ],
  },
  {
    id: "systems",
    label: "Design systems",
    icon: <LayersIcon size={20} />,
    questions: [
      "¿Qué design systems ha creado?",
      "¿Cómo es Modyo Platform?",
      "¿Cómo logra que un design system se adopte?",
    ],
  },
  {
    id: "contacto",
    label: "Contacto",
    icon: <MailIcon size={20} />,
    questions: [
      "¿Está disponible para proyectos?",
      "¿Cómo puedo contactarte?",
      "¿Podemos agendar una llamada?",
    ],
  },
];

/** Conversación demo que rota en la ventana de chat del skin Signal. */
const DEMO_TURNS: { q: string; a: React.ReactNode }[] = [
  {
    q: "¿Qué proyectos de fintech ha hecho?",
    a: (
      <>
        <p>
          Fintech de punta a punta: onboarding de crédito en <strong>miBanco</strong>,
          factoring en <strong>Kapital Bank</strong> y el canal enterprise de{" "}
          <strong>Credicorp Capital</strong>.
        </p>
        <div className="chat-window__facts">
          <span>
            <b>2</b> productos de crédito
          </span>
          <span>
            <b>E2E</b> factoring Colombia
          </span>
          <span>
            <b>1</b> canal enterprise
          </span>
        </div>
      </>
    ),
  },
  {
    q: "¿Qué design systems ha creado?",
    a: (
      <>
        <p>
          <strong>Modyo Platform</strong>: design system multi-banco con tokens y
          gobernanza. Redujo el tiempo de desarrollo un <strong>48%</strong> con{" "}
          <strong>92%</strong> de task-success en tests moderados.
        </p>
        <div className="chat-window__facts">
          <span>
            <b>48%</b> ↓ dev time
          </span>
          <span>
            <b>92%</b> task-success
          </span>
          <span>
            <b>7</b> bancos en pipeline
          </span>
        </div>
      </>
    ),
  },
  {
    q: "¿Está disponible para proyectos?",
    a: (
      <p>
        Sí — está tomando proyectos seleccionados. Escríbele desde la sección de{" "}
        <strong>contacto</strong>, o pregúntame aquí lo que necesites: respondo con sus
        casos reales.
      </p>
    ),
  },
];

/** Una pregunta rápida por tema para los chips de la ventana. */
const QUICK_QUESTIONS = [
  "¿Qué proyectos de fintech ha hecho?",
  "Cuéntame su trayectoria",
  "¿Cómo es su proceso de research?",
  "¿Qué design systems ha creado?",
  "¿Podemos agendar una llamada?",
];

export function ChatSection() {
  const { openChat } = useChatLauncher();
  const skin = useSkin();
  const [activeId, setActiveId] = useState(TOPICS[0].id);
  const [input, setInput] = useState("");
  const [turn, setTurn] = useState(0);

  const active = TOPICS.find((t) => t.id === activeId) ?? TOPICS[0];
  const demo = DEMO_TURNS[turn];

  // Rota la conversación demo solo en Signal y sin reduced motion
  useEffect(() => {
    if (skin !== "signal") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setTurn((t) => (t + 1) % DEMO_TURNS.length);
    }, 7000);
    return () => clearInterval(id);
  }, [skin]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    openChat(text);
  }

  return (
    <section className="section chat-home" id="pregunta" aria-label="Asistente del portafolio">
      <div className="container chat-home__inner">
        <Reveal className="chat-home__head">
          <span className="chat-home__spark" aria-hidden="true">
            <SparkIcon size={22} />
          </span>
          <h2 className="chat-home__title">
            Pregúntale a mi <em>portafolio</em>
          </h2>
          <p className="chat-home__sub">
            Un asistente con IA que responde con mis casos de estudio, experiencia y
            proceso. Elige un tema o escribe tu propia pregunta.
          </p>
        </Reveal>

        {/* Layout por defecto (skins editorial / agency / terminal) */}
        <Reveal className="chat-home__explore">
          <div className="chat-home__topics" role="group" aria-label="Temas sugeridos">
            {TOPICS.map((topic, i) => (
              <button
                key={topic.id}
                type="button"
                className={`chat-topic${topic.id === activeId ? " is-active" : ""}`}
                style={{ "--i": i } as React.CSSProperties}
                aria-pressed={topic.id === activeId}
                onClick={() => setActiveId(topic.id)}
              >
                <span className="chat-topic__icon" aria-hidden="true">
                  {topic.icon}
                </span>
                <span className="chat-topic__label">{topic.label}</span>
              </button>
            ))}
          </div>

          <div className="chat-home__questions" key={active.id}>
            {active.questions.map((q, i) => (
              <button
                key={q}
                type="button"
                className="chat-chip chat-chip--lg"
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => openChat(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="chat-home__ask">
          <form className="chat-home__composer" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta lo que quieras sobre mi trabajo…"
              autoComplete="off"
              aria-label="Tu pregunta para el asistente"
              maxLength={1000}
            />
            <button
              type="submit"
              className="chat-send chat-send--lg"
              aria-label="Enviar pregunta"
              disabled={!input.trim()}
            >
              <ArrowUpIcon />
            </button>
          </form>
          <p className="chat-home__hint">
            Impulsado por IA · responde solo con el contenido de este portafolio
          </p>
        </Reveal>

        {/* Ventana de chat (solo skin Signal, se muestra vía CSS) */}
        <Reveal className="chat-window">
          <div className="chat-window__frame">
            <header className="chat-window__bar">
              <span className="chat-window__avatar" aria-hidden="true">
                <SparkIcon size={16} />
              </span>
              <div className="chat-window__id">
                <strong>Asistente del portafolio</strong>
                <span>
                  <i className="pulse-dot" aria-hidden="true" /> en línea · entrenado con
                  mis casos
                </span>
              </div>
              <span className="chat-window__badge">IA · demo</span>
            </header>

            <div className="chat-window__feed" key={turn} aria-hidden="true">
              <div className="chat-window__q">{demo.q}</div>
              <div className="chat-window__turn">
                <span className="chat-window__mini" aria-hidden="true">
                  <SparkIcon size={13} />
                </span>
                <div className="chat-window__stack">
                  <div className="chat-window__typing">
                    <span className="chat-typing">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                  <div className="chat-window__a">{demo.a}</div>
                </div>
              </div>
            </div>

            <div className="chat-window__chips" role="group" aria-label="Preguntas sugeridas">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} type="button" className="chat-chip" onClick={() => openChat(q)}>
                  {q}
                </button>
              ))}
            </div>

            <form className="chat-window__composer" onSubmit={onSubmit}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta lo que quieras sobre mi trabajo…"
                autoComplete="off"
                aria-label="Tu pregunta para el asistente"
                maxLength={1000}
              />
              <button
                type="submit"
                className="chat-send"
                aria-label="Enviar pregunta"
                disabled={!input.trim()}
              >
                <ArrowUpIcon />
              </button>
            </form>
            <p className="chat-window__hint">
              Impulsado por IA · responde solo con el contenido de este portafolio
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
