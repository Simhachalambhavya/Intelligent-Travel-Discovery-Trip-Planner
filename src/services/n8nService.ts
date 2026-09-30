/**
 * Service to connect TripWise Concierge chatbot to the n8n AI Agent webhook.
 * Production Webhook URL: https://bhavya-3004.app.n8n.cloud/webhook/tripwise-chat
 */

import {
  getOrCreateSessionProfile,
  updateSessionFromMessage,
  recordConversationTurn,
  buildN8nAugmentedMessage,
  refineAndVerifyAiResponse,
  generateDomainFallbackResponse,
} from './tripwiseAiCore';

const N8N_PRODUCTION_WEBHOOK_URL = 'https://bhavya-3004.app.n8n.cloud/webhook/tripwise-chat';
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
 * Sends user message to the n8n AI Agent webhook with TripWise verification & session context:
 */
export async function sendChatMessageToN8n(
  message: string,
  sessionId: string = DEFAULT_SESSION_ID,
  context?: {
    destination?: string;
    budget?: number;
    currency?: string;
    travelers?: any;
    interests?: string[];
  }
): Promise<{ reply: string; success: boolean }> {
  const profile = getOrCreateSessionProfile(sessionId, context);
  updateSessionFromMessage(profile, message);
  recordConversationTurn(profile, 'user', message);

  const payload = {
    message,
    sessionId,
    context,
  };

  // 1. Try our backend proxy route first (enforces multi-tier resilience, verification guardrails, and avoids CORS)
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
        recordConversationTurn(profile, 'assistant', data.reply);
        return { reply: data.reply, success: true };
      }
    }
  } catch (_err) {
    // Proceed to direct n8n webhook call or domain fallback
  }

  // 2. Direct client-side POST to n8n production webhook if backend proxy is unreachable
  try {
    const augmentedMessage = buildN8nAugmentedMessage(message, profile);
    const directPayload = {
      message: augmentedMessage,
      sessionId,
    };

    const res = await fetch(N8N_PRODUCTION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(directPayload),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      const rawText = extractN8nResponseText(data);
      if (rawText && rawText.trim().length > 0) {
        const verified = refineAndVerifyAiResponse(rawText, message, profile);
        recordConversationTurn(profile, 'assistant', verified);
        return { reply: verified, success: true };
      }
    }
  } catch (_error) {
    // Fall through to domain fallback
  }

  // 3. Resilient client-side domain fallback
  const fallback = generateDomainFallbackResponse(message, profile);
  recordConversationTurn(profile, 'assistant', fallback);
  return {
    reply: fallback,
    success: true,
  };
}
