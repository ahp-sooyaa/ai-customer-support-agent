import OpenAI from "openai";

const FALLBACK_REPLY = "Sorry, I’m having trouble replying right now.";
const DEFAULT_MODEL = "gpt-5-nano";

const SYSTEM_PROMPT =
  "You are a helpful customer support assistant for a Facebook Page. Keep answers short, friendly, and clear.";

export async function generateReply(message: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY environment variable");
    return FALLBACK_REPLY;
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    const reply = response.output_text?.trim();
    if (!reply) {
      console.error("OpenAI returned empty output_text", {
        model,
        responseId: response.id,
      });
      return FALLBACK_REPLY;
    }

    return reply;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("Failed to generate OpenAI reply:", {
        model,
        status: error.status,
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type,
      });
      return FALLBACK_REPLY;
    }

    const err = error as {
      message?: string;
      code?: string;
      cause?: { code?: string; message?: string };
    };

    console.error("Failed to generate OpenAI reply:", {
      model,
      message: err?.message ?? "Unknown error",
      code: err?.code,
      causeCode: err?.cause?.code,
      causeMessage: err?.cause?.message,
    });
    return FALLBACK_REPLY;
  }
}
