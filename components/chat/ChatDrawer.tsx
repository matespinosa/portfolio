"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AssistantMessage } from "./AssistantMessage";
import { useChatLauncher } from "./ChatProvider";
import {
  ArrowUpIcon,
  CloseIcon,
  CoinsIcon,
  GridIcon,
  RestartIcon,
  RouteIcon,
  SearchIcon,
  SparkIcon,
} from "./icons";

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

function friendlyChatError(error: { message?: string; statusCode?: number } | Error): string {
  const message = (error.message || "").toLowerCase();
  const status =
    "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : undefined;

  if (
    status === 401 ||
    status === 403 ||
    message.includes("protected deployment") ||
    message.includes("unauthorized") ||
    message.includes("forbidden")
  ) {
    return "Este deploy de Vercel está protegido (Vercel Authentication). Desactívalo en Project Settings → Deployment Protection para Production, o inicia sesión en Vercel y recarga.";
  }
  if (status === 429 || message.includes("rate") || message.includes("límite")) {
    return "Límite de mensajes alcanzado por ahora. Prueba más tarde o usa el formulario de contacto.";
  }
  if (message.includes("failed to fetch") || message.includes("network")) {
    return "No hubo respuesta del servidor. Revisa la conexión o que el deploy de Vercel esté público.";
  }
  return error.message || "No se pudo completar la respuesta.";
}

export function ChatDrawer() {
  const { open, closeChat, queued, consumeQueued } = useChatLauncher();
  const [shown, setShown] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastActiveRef = useRef<Element | null>(null);

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

  // Entrada/salida animada: monta cerrado y abre en el siguiente tick para
  // que la transición corra. setTimeout (no rAF): los timers disparan aunque
  // el navegador esté throttled/sin frames, así el panel nunca queda oculto.
  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    const t = setTimeout(() => setShown(true), 30);
    return () => clearTimeout(t);
  }, [open]);

  // Mensaje en cola desde la sección de la home o el FAB.
  // Guarda síncrona por ref: el efecto puede re-ejecutarse muchas veces
  // (StrictMode, chunks del stream) antes de que el provider propague
  // queued=null, y sin la ref se enviaría en cascada.
  const lastQueuedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!queued) {
      lastQueuedRef.current = null;
      return;
    }
    if (lastQueuedRef.current === queued || busy) return;
    lastQueuedRef.current = queued;
    consumeQueued();
    clearError();
    sendMessage({ text: queued });
  }, [queued, busy, consumeQueued, clearError, sendMessage]);

  // Foco: guarda el disparador, enfoca el input al abrir, restaura al cerrar
  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement;
      const t = setTimeout(() => inputRef.current?.focus(), 380);
      return () => clearTimeout(t);
    }
    const last = lastActiveRef.current;
    if (last instanceof HTMLElement) last.focus();
  }, [open]);

  // Bloquea el scroll del documento mientras el panel está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  useEffect(() => {
    if (!open || messages.length === 0) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, status]);

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
    <>
      <div
        className={`chat-scrim${shown ? " is-open" : ""}`}
        aria-hidden="true"
        onClick={closeChat}
      />
      <aside
        className={`chat-drawer${shown ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Asistente del portafolio"
        inert={!open}
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
              onClick={closeChat}
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
              {friendlyChatError(error)}
            </p>
          ) : null}
        </div>

        <form className="chat-panel__composer" onSubmit={onSubmit}>
          <input
            ref={inputRef}
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
      </aside>
    </>
  );
}
