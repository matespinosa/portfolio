import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

/**
 * Proveedores soportados por el chat.
 *
 * - anthropic  → Claude (mejor calidad; requiere ANTHROPIC_API_KEY, de pago)
 * - groq       → Llama 3.3 70B open-source servido por Groq (free tier; GROQ_API_KEY)
 * - openrouter → modelos open-source con sufijo :free (OPENROUTER_API_KEY)
 * - ollama     → LLM open-source 100% local y gratis (requiere `ollama serve`)
 * - demo       → sin LLM: respuestas predefinidas por keywords (sin ninguna key)
 *
 * Selección: CHAT_PROVIDER explícito, o auto-detección por la key disponible.
 */
export type ChatProviderId = "anthropic" | "groq" | "openrouter" | "ollama" | "demo";

export type ResolvedChatModel =
  | { provider: Exclude<ChatProviderId, "demo">; modelId: string; model: LanguageModel }
  | { provider: "demo" };

function openAICompatible(name: string, baseURL: string, apiKey?: string) {
  return createOpenAICompatible({ name, baseURL, apiKey });
}

function buildModel(provider: Exclude<ChatProviderId, "demo">): ResolvedChatModel {
  const custom = process.env.CHAT_MODEL;

  switch (provider) {
    case "anthropic": {
      const modelId = custom || "claude-haiku-4-5";
      return { provider, modelId, model: anthropic(modelId) };
    }
    case "groq": {
      const modelId = custom || "llama-3.3-70b-versatile";
      const groq = openAICompatible(
        "groq",
        "https://api.groq.com/openai/v1",
        process.env.GROQ_API_KEY,
      );
      return { provider, modelId, model: groq.chatModel(modelId) };
    }
    case "openrouter": {
      const modelId = custom || "meta-llama/llama-3.3-70b-instruct:free";
      const openrouter = openAICompatible(
        "openrouter",
        "https://openrouter.ai/api/v1",
        process.env.OPENROUTER_API_KEY,
      );
      return { provider, modelId, model: openrouter.chatModel(modelId) };
    }
    case "ollama": {
      const modelId = custom || "llama3.2";
      const ollama = openAICompatible(
        "ollama",
        (process.env.OLLAMA_BASE_URL || "http://localhost:11434") + "/v1",
      );
      return { provider, modelId, model: ollama.chatModel(modelId) };
    }
  }
}

export function resolveChatModel(): ResolvedChatModel {
  const forced = process.env.CHAT_PROVIDER as ChatProviderId | undefined;

  if (forced === "demo") return { provider: "demo" };
  if (forced) return buildModel(forced);

  // Auto-detección por key disponible; demo como último recurso
  if (process.env.ANTHROPIC_API_KEY) return buildModel("anthropic");
  if (process.env.GROQ_API_KEY) return buildModel("groq");
  if (process.env.OPENROUTER_API_KEY) return buildModel("openrouter");
  return { provider: "demo" };
}
