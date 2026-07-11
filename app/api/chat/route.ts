import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { resolveChatModel } from "@/lib/chatModel";
import { buildDemoAnswer } from "@/lib/chatDemo";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export const maxDuration = 30;

const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 1200;

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    return (m.parts ?? [])
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .trim();
  }
  return "";
}

/** Streamea una respuesta predefinida con el protocolo UI-message del AI SDK. */
function demoStreamResponse(answer: string): Response {
  const words = answer.split(/(?<=\s)/);
  const stream = createUIMessageStream({
    async execute({ writer }) {
      const id = "demo-text";
      writer.write({ type: "text-start", id });
      for (const chunk of words) {
        writer.write({ type: "text-delta", id, delta: chunk });
        await new Promise((r) => setTimeout(r, 18));
      }
      writer.write({ type: "text-end", id });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  try {
    const resolved = resolveChatModel();

    const ip = getClientIp(req);
    const limited = rateLimit(`chat:${ip}`, {
      // El modo demo no consume tokens; los proveedores reales sí.
      limit: resolved.provider === "demo" ? 60 : 20,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.ok) {
      return Response.json(
        {
          error:
            "Límite de mensajes alcanzado por ahora. Escríbeme a matespinosa09@gmail.com o usa el formulario de contacto.",
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const messages = (body.messages ?? []) as UIMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Mensajes inválidos." }, { status: 400 });
    }
    if (messages.length > MAX_MESSAGES) {
      return Response.json({ error: "Conversación demasiado larga." }, { status: 400 });
    }

    const question = lastUserText(messages);
    if (question.length > MAX_MESSAGE_CHARS) {
      return Response.json({ error: "Mensaje demasiado largo." }, { status: 400 });
    }

    if (resolved.provider === "demo") {
      return demoStreamResponse(buildDemoAnswer(question));
    }

    try {
      const result = streamText({
        model: resolved.model,
        system: buildSystemPrompt(),
        messages: await convertToModelMessages(messages),
        maxOutputTokens: 900,
      });

      return result.toUIMessageStreamResponse();
    } catch (llmErr) {
      // Key inválida, cuota agotada, proveedor caído, etc. → demo
      // para que el chat del portafolio no se rompa en producción.
      console.error("[chat] LLM falló; usando modo demo:", llmErr);
      return demoStreamResponse(buildDemoAnswer(question));
    }
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error en el chat." }, { status: 500 });
  }
}
