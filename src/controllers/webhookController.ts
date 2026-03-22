import { Request, Response } from "express";
import { sendMessengerText } from "../services/messengerService";
import { generateReply } from "../services/openaiService";
import { FacebookWebhookBody } from "../types/facebookWebhook";
import { parseMessengerTextMessage } from "../utils/parseMessengerTextMessage";

export function verifyWebhook(req: Request, res: Response): Response {
  const mode = req.query["hub.mode"];
  const verifyToken = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    typeof verifyToken === "string" &&
    verifyToken === process.env.FACEBOOK_VERIFY_TOKEN &&
    typeof challenge === "string"
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

export function receiveWebhook(req: Request, res: Response): Response {
  const body = req.body as FacebookWebhookBody;

  // Acknowledge quickly so Facebook doesn't retry due to timeouts.
  const ack = res.sendStatus(200);

  if (!isValidPageWebhook(body)) {
    return ack;
  }

  void processIncomingMessages(body);
  return ack;
}

function isValidPageWebhook(body: FacebookWebhookBody): boolean {
  return body.object === "page" && Array.isArray(body.entry);
}

async function processIncomingMessages(body: FacebookWebhookBody): Promise<void> {
  try {
    const entries = body.entry as unknown[];

    for (const entry of entries) {
      if (!entry || typeof entry !== "object") {
        continue;
      }

      const messaging = (entry as { messaging?: unknown }).messaging;
      if (!Array.isArray(messaging)) {
        continue;
      }

      for (const event of messaging) {
        const parsedMessage = parseMessengerTextMessage(event);
        if (!parsedMessage) {
          continue;
        }

        console.log(
          `Incoming text message from ${parsedMessage.senderPsid}: ${parsedMessage.text}`
        );

        const aiReply = await generateReply(parsedMessage.text);
        await sendMessengerText(parsedMessage.senderPsid, aiReply);
      }
    }
  } catch (error) {
    console.error("Failed to process webhook payload:", error);
  }
}
