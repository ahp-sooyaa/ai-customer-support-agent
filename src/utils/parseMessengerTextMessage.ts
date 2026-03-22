import { ParsedMessengerTextMessage } from "../types/messenger";

type UnknownRecord = Record<string, unknown>;

export function parseMessengerTextMessage(
  event: unknown
): ParsedMessengerTextMessage | null {
  if (!event || typeof event !== "object") {
    return null;
  }

  const eventRecord = event as UnknownRecord;
  const sender = eventRecord.sender as UnknownRecord | undefined;
  const message = eventRecord.message as UnknownRecord | undefined;

  const senderPsid = sender?.id;
  const text = message?.text;

  if (typeof senderPsid !== "string" || typeof text !== "string") {
    return null;
  }

  const trimmedText = text.trim();
  if (!trimmedText) {
    return null;
  }

  return {
    senderPsid,
    text: trimmedText,
  };
}
