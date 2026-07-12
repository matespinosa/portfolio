"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ChatDrawer = dynamic(
  () => import("./ChatDrawer").then((m) => m.ChatDrawer),
  { ssr: false },
);

type ChatLauncher = {
  open: boolean;
  /** Abre el panel lateral; con `message`, lo envía al llegar. */
  openChat: (message?: string) => void;
  closeChat: () => void;
  /** Mensaje pendiente de enviar (lo consume el drawer). */
  queued: string | null;
  consumeQueued: () => void;
};

const ChatLauncherContext = createContext<ChatLauncher | null>(null);

export function useChatLauncher(): ChatLauncher {
  const ctx = useContext(ChatLauncherContext);
  if (!ctx) throw new Error("useChatLauncher debe usarse dentro de <ChatProvider>");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [queued, setQueued] = useState<string | null>(null);

  const openChat = useCallback((message?: string) => {
    if (message?.trim()) setQueued(message.trim());
    setOpen(true);
    setEverOpened(true);
  }, []);

  const closeChat = useCallback(() => setOpen(false), []);
  const consumeQueued = useCallback(() => setQueued(null), []);

  const value = useMemo(
    () => ({ open, openChat, closeChat, queued, consumeQueued }),
    [open, openChat, closeChat, queued, consumeQueued],
  );

  return (
    <ChatLauncherContext.Provider value={value}>
      {children}
      {/* Montado tras la primera apertura y persistente: conserva la conversación */}
      {everOpened ? <ChatDrawer /> : null}
    </ChatLauncherContext.Provider>
  );
}
