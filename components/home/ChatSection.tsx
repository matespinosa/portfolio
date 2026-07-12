"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useChatLauncher } from "@/components/chat/ChatProvider";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import {
  ArrowUpIcon,
  GridIcon,
  LayersIcon,
  MailIcon,
  MicIcon,
  RouteIcon,
  SearchIcon,
  SparkIcon,
  StopIcon,
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
    label: "Proyectos",
    icon: <GridIcon size={17} />,
    questions: [
      "¿Qué proyectos de fintech ha hecho?",
      "Cuéntame sobre miBanco",
      "¿Cómo fue Credicorp Capital?",
    ],
  },
  {
    id: "experiencia",
    label: "Trayectoria",
    icon: <RouteIcon size={17} />,
    questions: [
      "Cuéntame su trayectoria",
      "¿Dónde ha trabajado?",
      "¿Cuántos años de experiencia tiene?",
    ],
  },
  {
    id: "proceso",
    label: "Proceso UX",
    icon: <SearchIcon size={17} />,
    questions: [
      "¿Cómo es su proceso de research?",
      "¿Qué herramientas usa?",
      "¿Cómo mide el impacto de su trabajo?",
    ],
  },
  {
    id: "systems",
    label: "Sistemas",
    icon: <LayersIcon size={17} />,
    questions: [
      "¿Qué design systems ha creado?",
      "¿Cómo es Modyo Platform?",
      "¿Cómo logra que un design system se adopte?",
    ],
  },
  {
    id: "contacto",
    label: "Contacto",
    icon: <MailIcon size={17} />,
    questions: [
      "¿Está disponible para proyectos?",
      "¿Cómo puedo contactarte?",
      "¿Podemos agendar una llamada?",
    ],
  },
];

export function ChatSection() {
  const { openChat } = useChatLauncher();
  const [activeId, setActiveId] = useState(TOPICS[0].id);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const active = TOPICS.find((topic) => topic.id === activeId) ?? TOPICS[0];
  const handleTranscript = useCallback((value: string) => {
    setInput(value.slice(0, 1000));
    inputRef.current?.focus();
  }, []);
  const voice = useSpeechRecognition({ onTranscript: handleTranscript });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    voice.stop();
    setInput("");
    openChat(text);
  }

  function toggleVoice() {
    if (voice.listening) {
      voice.stop();
      return;
    }
    voice.start(input);
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
            Encuentra el caso, la métrica o la experiencia que necesitas sin recorrer
            cada página.
          </p>
        </Reveal>

        <Reveal className="chat-home__experience">
          <div className="chat-home__composer-shell">
            <form className="chat-home__composer" onSubmit={onSubmit}>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={voice.listening ? "Te escucho…" : "Pregunta sobre mi trabajo…"}
                autoComplete="off"
                aria-label="Tu pregunta para el asistente"
                maxLength={1000}
              />

              <div className="chat-home__composer-bar">
                <div className="chat-home__topics" role="group" aria-label="Temas sugeridos">
                  {TOPICS.map((topic, index) => (
                    <button
                      key={topic.id}
                      type="button"
                      className={`chat-topic${topic.id === activeId ? " is-active" : ""}`}
                      style={{ "--i": index } as React.CSSProperties}
                      aria-pressed={topic.id === activeId}
                      onClick={() => setActiveId(topic.id)}
                    >
                      <span aria-hidden="true">{topic.icon}</span>
                      {topic.label}
                    </button>
                  ))}
                </div>

                <div className="chat-home__actions">
                  <button
                    type="button"
                    className={`chat-voice${voice.listening ? " is-listening" : ""}`}
                    aria-label={voice.listening ? "Detener dictado" : "Usar entrada por voz"}
                    aria-pressed={voice.listening}
                    title={
                      voice.supported
                        ? voice.listening
                          ? "Detener dictado"
                          : "Hablar"
                        : "Tu navegador no admite entrada por voz"
                    }
                    disabled={!voice.supported}
                    onClick={toggleVoice}
                  >
                    {voice.listening ? <StopIcon /> : <MicIcon />}
                  </button>
                  <button
                    type="submit"
                    className="chat-send chat-send--lg"
                    aria-label="Enviar pregunta"
                    disabled={!input.trim()}
                  >
                    <ArrowUpIcon />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="chat-home__suggestions" key={active.id}>
            <span>Prueba con</span>
            <div className="chat-home__questions">
              {active.questions.map((question, index) => (
                <button
                  key={question}
                  type="button"
                  className="chat-chip chat-chip--lg"
                  style={{ "--i": index } as React.CSSProperties}
                  onClick={() => openChat(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <p
            className={`chat-home__hint${voice.error ? " is-error" : ""}`}
            aria-live="polite"
          >
            {voice.error ??
              (voice.listening
                ? "Escuchando — habla con naturalidad y revisa el texto antes de enviarlo."
                : "IA basada únicamente en el contenido de este portafolio")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
