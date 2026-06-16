import { useState, useCallback } from 'react';
import { createConversation, sendChatRequest } from '../api/chatApi';

export const useChatStream = () => {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { role: 'USER', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        const created = await createConversation('New chat');
        currentConversationId = created.id;
        setConversationId(created.id);
      }

      const response = await sendChatRequest(currentConversationId, userMessage.content);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Không nhận được stream từ server');
      }

      setMessages((prev) => [...prev, { role: 'ASSISTANT', content: '' }]);

      let aiContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.replace(/^data:\s*/, '').trim();
          if (jsonStr === '[DONE]') break;

          try {
            const data = JSON.parse(jsonStr);
            if (typeof data.content === 'string') {
              aiContent += data.content;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: 'ASSISTANT', content: aiContent };
                return next;
              });
            }
          } catch {
            // ignore stream noise
          }
        }
      }
    } catch (error) {
      console.error('Lỗi khi chat:', error);
      setMessages((prev) => [...prev, { role: 'ASSISTANT', content: 'Không thể phản hồi ngay lúc này.' }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, conversationId };
};