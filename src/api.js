import { API_URL } from './config';

/**
 * Call the AI backend and get a reply.
 * Works with Gradio backend.
 */
export async function sendMessageToAI(message, mode = 'Balanced') {
  if (!API_URL || API_URL.includes('YOUR_USERNAME')) {
    return {
      success: false,
      reply:
        'Please set your real backend URL in src/config.js\n\n' +
        '1. Deploy the AI project to Hugging Face Spaces\n' +
        '2. Copy the public link\n' +
        '3. Paste it in src/config.js',
    };
  }

  try {
    // Gradio queue-based API call
    const base = API_URL.replace(/\/$/, '');

    // Step 1: Join the queue / call the endpoint
    // We try the common Gradio patterns.

    // First try the modern Gradio client style endpoint
    const callUrl = `${base}/call/chat_stream`;

    const response = await fetch(callUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          message,           // message
          [],                // history
          mode,              // mode
          0.85,              // temperature
          50,                // top_k
          220,               // max_tokens
        ],
      }),
    });

    if (!response.ok) {
      // Fallback: try the older /run/ endpoint style
      return await fallbackCall(base, message, mode);
    }

    const json = await response.json();

    // Gradio usually returns { event_id: "..." } then we need to poll,
    // or in some versions it returns the data directly.
    if (json.event_id) {
      // Poll for the result
      const result = await pollGradioResult(base, json.event_id);
      return result;
    }

    // Direct data response
    if (json.data && Array.isArray(json.data)) {
      const history = json.data[0];
      if (history && history.length > 0) {
        const last = history[history.length - 1];
        const reply = Array.isArray(last) ? last[1] : String(last);
        return { success: true, reply: cleanReply(reply) };
      }
    }

    return {
      success: false,
      reply: 'Received unexpected response from the AI backend.',
    };
  } catch (error) {
    return {
      success: false,
      reply: `Connection error: ${error.message}\n\nMake sure the backend is running and the URL in config.js is correct.`,
    };
  }
}

async function fallbackCall(base, message, mode) {
  try {
    const response = await fetch(`${base}/run/chat_stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [message, [], mode, 0.85, 50, 220],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json.data && Array.isArray(json.data)) {
      const history = json.data[0];
      if (history && history.length > 0) {
        const last = history[history.length - 1];
        const reply = Array.isArray(last) ? last[1] : String(last);
        return { success: true, reply: cleanReply(reply) };
      }
    }

    return { success: false, reply: 'No reply received from backend.' };
  } catch (err) {
    return {
      success: false,
      reply: `Fallback failed: ${err.message}`,
    };
  }
}

async function pollGradioResult(base, eventId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1000));

    try {
      const res = await fetch(`${base}/call/chat_stream/${eventId}`);
      if (!res.ok) continue;

      const text = await res.text();

      // Gradio streams events as text lines sometimes
      if (text.includes('data:')) {
        const lines = text.split('\n').filter((l) => l.startsWith('data:'));
        if (lines.length > 0) {
          const lastLine = lines[lines.length - 1].replace('data:', '').trim();
          try {
            const parsed = JSON.parse(lastLine);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              const history = parsed[0];
              if (history && history.length > 0) {
                const last = history[history.length - 1];
                const reply = Array.isArray(last) ? last[1] : String(last);
                return { success: true, reply: cleanReply(reply) };
              }
            }
          } catch (e) {
            // continue polling
          }
        }
      }

      // Try JSON directly
      try {
        const json = JSON.parse(text);
        if (json.data) {
          const history = json.data[0];
          if (history && history.length > 0) {
            const last = history[history.length - 1];
            const reply = Array.isArray(last) ? last[1] : String(last);
            return { success: true, reply: cleanReply(reply) };
          }
        }
      } catch (e) {}
    } catch (e) {
      // keep trying
    }
  }

  return { success: false, reply: 'Timed out waiting for the AI response.' };
}

function cleanReply(text) {
  if (!text) return '';
  // Remove the thinking process block for cleaner mobile display (optional)
  // Keep it if you want to see the steps
  return String(text).trim();
}
