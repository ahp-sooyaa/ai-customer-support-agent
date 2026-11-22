# AI Customer Support Agent

A small Node.js server that answers Facebook Page messages with AI. Facebook sends each new Messenger message to the server's webhook. The server asks the OpenAI API for a short, friendly support reply and sends it back through the Messenger Send API.

It is an experiment and a starting point for an AI support agent. Each reply only looks at the latest message; there is no conversation memory or knowledge base yet.

## Features

- Webhook verification endpoint for the Facebook Messenger platform
- Replies to Messenger text messages with the OpenAI Responses API (`gpt-5-nano` by default, set with `OPENAI_MODEL`)
- Acknowledges webhooks right away and processes messages in the background, so Facebook doesn't retry
- Sends a fallback reply when OpenAI fails, and logs errors clearly
- `GET /health` endpoint for uptime checks

## Tech stack

TypeScript, Node.js, Express 5, OpenAI Node SDK, Axios, Facebook Graph API (v23.0)

## How it works

```
Messenger user ──► Facebook ──POST /webhook──► this server ──► OpenAI API
                                                   │
Messenger user ◄── Facebook ◄──Send API (/me/messages)┘
```

| Path | File |
| --- | --- |
| `GET /webhook`, `POST /webhook` | `src/controllers/webhookController.ts` |
| OpenAI reply | `src/services/openaiService.ts` |
| Messenger Send API | `src/services/messengerService.ts` |

## Getting started

You need Node.js 20+, an OpenAI API key, and a Facebook Page with a Meta developer app that has the Messenger product added.

```bash
git clone https://github.com/ahp-sooyaa/ai-customer-support-agent.git
cd ai-customer-support-agent
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | What it is |
| --- | --- |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_MODEL` | Optional. Defaults to `gpt-5-nano` |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Page access token from the Messenger settings of your Meta app |
| `FACEBOOK_VERIFY_TOKEN` | Any string you choose; enter the same one when you set up the webhook |
| `PORT` | Optional. Defaults to `3001` |

Start the dev server:

```bash
npm run dev
```

Facebook needs a public HTTPS URL. While developing, run a tunnel such as `ngrok http 3001`. Then, in your Meta app's Messenger settings, set the callback URL to `https://<your-tunnel>/webhook`, enter your verify token, and subscribe the Page to the `messages` field. Send your Page a message to test it.

For production, run `npm run build` and then `npm start`.

## License

[MIT](LICENSE)
