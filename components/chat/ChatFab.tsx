"use client";

import { useChatLauncher } from "./ChatProvider";
import { SparkIcon } from "./icons";

export function ChatFab() {
  const { open, openChat } = useChatLauncher();

  if (open) return null;

  return (
    <button
      type="button"
      className="chat-fab"
      aria-label="Abrir asistente del portafolio"
      onClick={() => openChat()}
    >
      <SparkIcon />
      Pregúntame
    </button>
  );
}
