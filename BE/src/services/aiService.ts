import { Response } from "express";

// Thay URL này bằng URL base và CHAT_ID của bạn trong Flowise
const FLOWISE_URL_RAW = process.env.FLOWISE_URL || process.env.FLOWISE_BASE_URL || "http://localhost:3001/api/v1/prediction";
const FLOWISE_CHAT_ID = process.env.FLOWISE_CHAT_ID || process.env.CHAT_ID || process.env.chatID || process.env.CHATID;

function buildFlowiseUrl() {
  const raw = FLOWISE_URL_RAW.trim().replace(/\/$/, '');
  if (FLOWISE_CHAT_ID) {
    if (raw.endsWith(FLOWISE_CHAT_ID)) {
      return raw;
    }
    return [raw, FLOWISE_CHAT_ID].join('/');
  }

  const fullPredictionPattern = /\/api\/v1\/prediction\/[^/]+$/;
  if (fullPredictionPattern.test(raw)) {
    return raw;
  }

  throw new Error('FLOWISE_URL must include the full prediction endpoint or FLOWISE_CHAT_ID must be set.');
}

export async function getFlowiseStream(prompt: string, res: Response) {
  try {
    const flowiseUrl = buildFlowiseUrl();
    console.log("Flowise URL:", flowiseUrl);
    const response = await fetch(flowiseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: prompt,
        streaming: true, // Kích hoạt stream từ Flowise
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '<no body>');
      throw new Error(`Flowise connection failed: ${response.status} ${response.statusText} ${errorText}`);
    }

    // Header cho SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (!reader) return "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim().startsWith('data:')) {
          try {
            const jsonStr = line.replace('data:', '').trim();
            const data = JSON.parse(jsonStr);

            // Flowise gửi các token qua event 'token'
            if (data.event === 'token') {
              const content = data.data;
              fullText += content;
              // Gửi về cho Frontend của bạn
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // Bỏ qua các dòng không phải JSON hợp lệ (ví dụ [DONE])
          }
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
    return fullText;

  } catch (error) {
    console.error("Flowise Stream Error:", error);
    if (!res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: "AI Service Error" })}\n\n`);
      res.end();
    }
    return "";
  }
}