/**
 * Service to connect TripWise Concierge chatbot to the n8n AI Agent webhook.
 * Production Webhook URL: https://bhavya-3004.app.n8n.cloud/webhook/tripwise-chat
 */

const N8N_PRODUCTION_WEBHOOK_URL = 'https://bhavya-3004.app.n8n.cloud/webhook/tripwise-chat';
const N8N_TEST_WEBHOOK_URL = 'https://bhavya-3004.app.n8n.cloud/webhook/tripwise-chat';
export const DEFAULT_SESSION_ID = 'tripwise-user-session';

export function extractN8nResponseText(data: any): string {
  if (typeof data === 'string') {
    // If it's a JSON string, try to parse it
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        return extractN8nResponseText(parsed);
      }
    } catch {
      return data;
    }
    return data;
  }
  if (!data) return '';
  if (Array.isArray(data) && data.length > 0) {
    return extractN8nResponseText(data[0]);
  }
  if (typeof data === 'object') {
    if (typeof data.output === 'string') return data.output;
    if (typeof data.text === 'string') return data.text;
    if (typeof data.response === 'string') return data.response;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.reply === 'string') return data.reply;
    if (typeof data.result === 'string') return data.result;
    if (data.data) return extractN8nResponseText(data.data);
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string' && data[key].trim().length > 0) {
        return data[key];
      }
    }
  }
  return typeof data === 'object' ? JSON.stringify(data) : String(data);
}

/**
 * Sends user message to the n8n AI Agent webhook in the exact requested format:
 * {
 *   "message": "USER_MESSAGE",
 *   "sessionId": "tripwise-user-session"
 * }
 */
export async function sendChatMessageToN8n(
  message: string,
  sessionId: string = DEFAULT_SESSION_ID
): Promise<{ reply: string; success: boolean }> {
  const payload = {
    message,
    sessionId,
  };

  // 1. Try our backend proxy route first (avoids browser CORS issues and handles workflow states)
  try {
    const serverRes = await fetch('/api/n8n/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data && data.reply) {
        return { reply: data.reply, success: true };
      }
    }
  } catch (err) {
    console.warn('Backend proxy fetch error, attempting direct n8n webhook call:', err);
  }

  // 2. Direct client-side POST to n8n production webhook
  try {
    const res = await fetch(N8N_PRODUCTION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      const text = extractN8nResponseText(data);
      if (text) {
        return { reply: text, success: true };
      }
    } else if (res.status === 404) {
      // If production URL returns 404, check test webhook in case workflow is running in test mode
      try {
        const testRes = await fetch(N8N_TEST_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (testRes.ok) {
          const contentType = testRes.headers.get('content-type') || '';
          const testData = contentType.includes('application/json')
            ? await testRes.json()
            : await testRes.text();
          const text = extractN8nResponseText(testData);
          if (text) {
            return { reply: text, success: true };
          }
        }
      } catch (testErr) {
        console.warn('Test webhook fallback check failed:', testErr);
      }

      return {
        reply: "Your n8n AI Agent is connected, but the webhook is waiting for execution. In n8n, please switch the workflow toggle to 'Active' in the top-right corner (or click 'Execute workflow' on the canvas), then send your message again!",
        success: false,
      };
    }
  } catch (error) {
    console.error('Error contacting n8n webhook:', error);
  }

  // Friendly error message fallback
  return {
    reply: "I'm having trouble connecting to the n8n AI Agent right now. Please verify your n8n workflow is running or click 'Execute workflow' in the n8n editor, then try again!",
    success: false,
  };
}
