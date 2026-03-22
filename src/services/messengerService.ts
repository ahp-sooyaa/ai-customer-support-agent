import axios from "axios";

const FACEBOOK_GRAPH_API_BASE_URL = "https://graph.facebook.com/v23.0";

export async function sendMessengerText(
  psid: string,
  text: string
): Promise<void> {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Missing FACEBOOK_PAGE_ACCESS_TOKEN environment variable");
    return;
  }

  try {
    const response = await axios.post(
      `${FACEBOOK_GRAPH_API_BASE_URL}/me/messages`,
      {
        recipient: { id: psid },
        message: { text },
      },
      {
        params: { access_token: accessToken },
      }
    );

    console.log(
      `Facebook Send API success for recipient ${psid}:`,
      response.data
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to send message via Facebook Send API:",
        error.response?.data ?? error.message
      );
      return;
    }

    console.error("Failed to send message via Facebook Send API:", error);
  }
}
