"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AssistantMessage } from "@/components/chat/AssistantMessage";
import {
  COMMANDS,
  SUGGESTED,
  matchCommands,
  type CommandCtx,
  type CommandDef,
} from "@/lib/commands";

const HISTORY_KEY = "cmd-history";
const HISTORY_MAX = 32;

function getText(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}) {
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
    return "Este deploy está protegido (Vercel Authentication). Desactívalo para Production o inicia sesión en Vercel y recarga.";
  }
  if (status === 429 || message.includes("rate") || message.includes("límite")) {
    return "Límite de mensajes alcanzado por ahora. Prueba más tarde o usa el formulario de contacto.";
  }
  if (message.includes("failed to fetch") || message.includes("network")) {
    return "No hubo respuesta del servidor. Revisa la conexión.";
  }
  return error.message || "No se pudo completar la respuesta.";
}

function loadHistory(): string[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * La superficie de comando: un input, dos modos.
 * Token conocido → ejecuta con feedback literal. Frase → IA en el mismo panel.
 * El hilo de IA se conserva mientras dure la sesión, como scrollback.
 */
export function CommandSurface({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const historyRef = useRef<string[]>([]);
  const closeTimer = useRef<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyRef.current = loadHistory();
  }, []);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error, clearError } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  const lastMessage = messages[messages.length - 1];
  const waiting =
    status === "submitted" ||
    (status === "streaming" && (lastMessage?.role !== "assistant" || !getText(lastMessage)));
  const chatActive = messages.length > 0;

  // El hilo sigue al stream.
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, waiting]);

  // Al cerrar: input limpio y sin feedback viejo. El hilo de IA queda.
  useEffect(() => {
    if (open) return;
    setValue("");
    setFeedback(null);
    setHelpOpen(false);
    setHistoryIdx(null);
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, [open]);

  const ctx = useMemo<CommandCtx>(
    () => ({
      navigate: (href) => router.push(href),
      jump: (hash) => {
        if (pathname === "/") {
          const el = document.querySelector(hash);
          if (el) {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
            return;
          }
        }
        router.push(`/${hash}`);
      },
      toggleTheme: () => {
        const next =
          document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        return next;
      },
      copy: async (text) => {
        await navigator.clipboard.writeText(text);
      },
    }),
    [router, pathname],
  );

  const pushHistory = useCallback((entry: string) => {
    const list = [...historyRef.current.filter((h) => h !== entry), entry].slice(-HISTORY_MAX);
    historyRef.current = list;
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch {
      /* sessionStorage puede no estar disponible; el historial es prescindible */
    }
  }, []);

  const runCommand = useCallback(
    async (def: CommandDef) => {
      pushHistory(def.token);
      setValue("");
      setHistoryIdx(null);
      if (def.special === "help" || !def.run) {
        setHelpOpen(true);
        setFeedback(null);
        return;
      }
      setHelpOpen(false);
      const result = await def.run(ctx);
      setFeedback(result.output);
      if (result.closes) {
        closeTimer.current = window.setTimeout(onClose, 650);
      }
    },
    [ctx, onClose, pushHistory],
  );

  const askAI = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean || busy) return;
      pushHistory(clean);
      setValue("");
      setHistoryIdx(null);
      setHelpOpen(false);
      setFeedback(null);
      clearError();
      void sendMessage({ text: clean });
    },
    [busy, clearError, pushHistory, sendMessage],
  );

  const matches = useMemo(() => matchCommands(value), [value]);

  // Autocompletado fantasma: solo cuando lo tecleado es prefijo literal del
  // token, para que el resto alinee carácter a carácter con lo escrito.
  const completion = useMemo(() => {
    const first = matches[0];
    if (!first || !value.trim()) return "";
    return first.token.startsWith(value.toLowerCase()) ? first.token.slice(value.length) : "";
  }, [matches, value]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" && completion && matches[0]) {
        e.preventDefault();
        setValue(matches[0].token);
        return;
      }
      // Historial estilo shell: ↑ con el prompt vacío recupera lo último.
      const history = historyRef.current;
      if (e.key === "ArrowUp" && history.length > 0 && (value === "" || historyIdx !== null)) {
        e.preventDefault();
        e.stopPropagation();
        const next = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(next);
        setValue(history[next] ?? "");
        return;
      }
      if (e.key === "ArrowDown" && historyIdx !== null) {
        e.preventDefault();
        e.stopPropagation();
        const next = historyIdx + 1;
        if (next >= history.length) {
          setHistoryIdx(null);
          setValue("");
        } else {
          setHistoryIdx(next);
          setValue(history[next] ?? "");
        }
      }
    },
    [completion, historyIdx, matches, value],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      label="Línea de comandos del portafolio"
      shouldFilter={false}
      loop
    >
      <div className="cmds__inputrow">
        <span className="cmds__prompt-mark" aria-hidden="true">
          &gt;
        </span>
        <div className="cmds__inputwrap">
          <span className="cmds__ghost" aria-hidden="true">
            <span className="cmds__ghost-typed">{value}</span>
            <span className="cmds__ghost-completion">{completion}</span>
          </span>
          <Command.Input
            value={value}
            onValueChange={(v) => {
              setValue(v);
              setHistoryIdx(null);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="comando o pregunta"
            autoFocus
          />
        </div>
      </div>

      <Command.List>
        {!chatActive && !value.trim() && !helpOpen ? (
          <Command.Group heading="sugerencias">
            {SUGGESTED.map((s) => (
              <Command.Item
                key={`sug-${s.value}`}
                value={`sug-${s.value}`}
                className="cmds__item"
                onSelect={() => {
                  if (s.kind === "cmd") {
                    const def = COMMANDS.find((c) => c.token === s.value);
                    if (def) void runCommand(def);
                  } else {
                    askAI(s.value);
                  }
                }}
              >
                <span className={`cmds__tag cmds__tag--${s.kind}`} aria-hidden="true">
                  {s.kind === "cmd" ? "cmd" : "ia"}
                </span>
                <span className="cmds__item-label">{s.value}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ) : null}

        {value.trim() ? (
          <>
            {matches.map((def) => (
              <Command.Item
                key={`cmd-${def.token}`}
                value={`cmd-${def.token}`}
                className="cmds__item"
                onSelect={() => void runCommand(def)}
              >
                <span className="cmds__tag cmds__tag--cmd" aria-hidden="true">
                  cmd
                </span>
                <span className="cmds__item-label">{def.token}</span>
                <span className="cmds__item-hint">{def.hint}</span>
              </Command.Item>
            ))}
            <Command.Item
              value="ai-free"
              className="cmds__item"
              disabled={busy}
              onSelect={() => askAI(value)}
            >
              <span className="cmds__tag cmds__tag--ia" aria-hidden="true">
                ia
              </span>
              <span className="cmds__item-label">preguntar: “{value.trim()}”</span>
            </Command.Item>
          </>
        ) : null}
      </Command.List>

      {chatActive ? (
        <div className="cmds__chat" ref={chatRef} aria-live="polite">
          {messages.map((m) =>
            m.role === "user" ? (
              <p key={m.id} className="cmds__usertext">
                <span aria-hidden="true">&gt; </span>
                {getText(m)}
              </p>
            ) : (
              <AssistantMessage
                key={m.id}
                text={getText(m)}
                streaming={busy && m.id === lastMessage?.id}
                suggestionsEnabled={false}
                onSuggest={askAI}
              />
            ),
          )}
          {waiting ? (
            <p className="cmds__waiting" aria-hidden="true">
              ···
            </p>
          ) : null}
          {error ? (
            <p className="cmds__error" role="alert">
              {friendlyChatError(error)}
            </p>
          ) : null}
        </div>
      ) : null}

      {helpOpen ? (
        <div className="cmds__help">
          <p className="cmds__help-title">comandos</p>
          <ul>
            {COMMANDS.map((c) => (
              <li key={c.token}>
                <b>{c.token}</b>
                <span>{c.hint}</span>
              </li>
            ))}
          </ul>
          <p className="cmds__help-note">cualquier otra frase va a la IA</p>
        </div>
      ) : null}

      {feedback ? (
        <p className="cmds__feedback" role="status">
          {feedback}
        </p>
      ) : null}

      <p className="cmds__hints" aria-hidden="true">
        tab completar · ↑ último comando · esc cerrar
        {busy ? " · respondiendo…" : ""}
      </p>
    </Command.Dialog>
  );
}
