"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AssistantMessage } from "./AssistantMessage";

const SUGGESTIONS: { icon: React.ReactNode; text: string }[] = [
  { icon: <CoinsIcon />, text: "¿Qué proyectos de fintech ha hecho?" },
  { icon: <GridIcon />, text: "¿Tiene experiencia con design systems?" },
  { icon: <SearchIcon />, text: "¿Cómo es su proceso de research?" },
  { icon: <RouteIcon />, text: "Cuéntame su trayectoria" },
];

function getText(message: { parts?: Array<{ type: string; text?: string }>; content?: string }) {
  if (typeof message.content === "string") return message.content;
  if (!message.parts) return "";
  return message.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, setMessages, status, error, clearError } = useChat({
    transport,
  });

  const busy = status === "submitted" || status === "streaming";
  const lastMessage = messages[messages.length - 1];
  const waiting =
    status === "submitted" ||
    (status === "streaming" && (lastMessage?.role !== "assistant" || !getText(lastMessage)));

  useEffect(() => {
    if (!open || messages.length === 0) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, status]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function ask(text: string) {
    if (busy) return;
    clearError();
    inputRef.current?.focus();
    await sendMessage({ text });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await ask(text);
  }

  function reset() {
    setMessages([]);
    clearError();
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className={`chat-widget${open ? " is-open" : ""}`}>
      {open ? (
        <div
          className="chat-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Asistente del portafolio"
        >
          <header className="chat-panel__head">
            <div className="chat-head__id">
              <span className="chat-avatar" aria-hidden="true">
                M
              </span>
              <div>
                <strong>Mateo · Portafolio</strong>
                <p>
                  <span className="chat-status-dot" aria-hidden="true" />
                  Proyectos, UX y trayectoria
                </p>
              </div>
            </div>
            <div className="chat-head__actions">
              {messages.length > 0 ? (
                <button
                  type="button"
                  className="chat-icon-btn"
                  aria-label="Nueva conversación"
                  title="Nueva conversación"
                  onClick={reset}
                >
                  <RestartIcon />
                </button>
              ) : null}
              <button
                type="button"
                className="chat-icon-btn"
                aria-label="Cerrar chat"
                onClick={() => {
                  setOpen(false);
                  fabRef.current?.focus();
                }}
              >
                <CloseIcon />
              </button>
            </div>
          </header>

          <div className="chat-panel__messages" ref={listRef} aria-live="polite">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty__spark" aria-hidden="true">
                  <SparkIcon />
                </div>
                <h3>
                  Explora mi trabajo <em>conversando</em>
                </h3>
                <p>Casos de estudio, UX, UI y trayectoria. Pregunta lo que necesites.</p>
                <div className="chat-empty__list">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={s.text}
                      type="button"
                      className="chat-suggestion"
                      style={{ "--i": i } as React.CSSProperties}
                      onClick={() => ask(s.text)}
                    >
                      <span className="chat-suggestion__icon" aria-hidden="true">
                        {s.icon}
                      </span>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={m.id} className="chat-bubble chat-bubble--user">
                    <p>{getText(m)}</p>
                  </div>
                ) : (
                  <AssistantMessage
                    key={m.id}
                    text={getText(m)}
                    streaming={status === "streaming" && i === messages.length - 1}
                    suggestionsEnabled={i === messages.length - 1 && !error}
                    onSuggest={ask}
                  />
                ),
              )
            )}
            {waiting ? (
              <div className="chat-typing" aria-label="Escribiendo">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            {error ? (
              <p className="chat-error" role="alert">
                {error.message || "No se pudo completar la respuesta."}
              </p>
            ) : null}
          </div>

          <form className="chat-panel__composer" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta lo que quieras…"
              autoComplete="off"
              aria-label="Tu pregunta"
              maxLength={1000}
            />
            <button
              type="submit"
              className="chat-send"
              aria-label="Enviar pregunta"
              disabled={busy || !input.trim()}
            >
              <ArrowUpIcon />
            </button>
          </form>
          <p className="chat-panel__hint">Responde solo con el contenido de este portafolio.</p>
        </div>
      ) : (
        <button
          ref={fabRef}
          type="button"
          className="chat-fab"
          aria-expanded={open}
          aria-label="Abrir asistente del portafolio"
          onClick={() => setOpen(true)}
        >
          <SparkIcon />
          Pregúntame
        </button>
      )}
    </div>
  );
}

/* ---------- Iconos ---------- */

function iconProps(size = 16) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
}

function SparkIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5L19 19M19 5l-2.5 2.5M7.5 16.5L5 19" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg {...iconProps(17)}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="9" cy="9" r="6" />
      <path d="M17.6 11.6A6 6 0 1 1 12.4 17.6" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19h7a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7h7" />
    </svg>
  );
}
