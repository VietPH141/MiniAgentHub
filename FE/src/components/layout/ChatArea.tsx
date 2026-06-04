import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChatStream } from '../../hooks/useChatStream';

interface ChatAreaProps {
  onOpenAuth: () => void;
}

const ChatArea = ({ onOpenAuth }: ChatAreaProps) => {
  const { isLoggedIn, setPendingPrompt, pendingPrompt } = useAuth();
  const { messages, sendMessage, loading } = useChatStream();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isLoggedIn && pendingPrompt) {
      void sendMessage(pendingPrompt);
      setPendingPrompt(null);
    }
  }, [isLoggedIn, pendingPrompt, sendMessage, setPendingPrompt]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    if (!isLoggedIn) {
      setPendingPrompt(content);
      onOpenAuth();
      return;
    }

    setInput('');
    await sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="overflow-y-auto flex-1 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Hãy bắt đầu bằng một câu hỏi cho AI...
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`max-w-3xl rounded-2xl px-4 py-3 ${m.role === 'USER' ? 'ml-auto bg-[var(--accent)] text-white' : 'mr-auto bg-[var(--bg-sidebar)] border border-[var(--border)]'}`}>
              {m.content}
            </div>
          ))
        )}
        {loading && <div className="text-sm text-gray-400">AI đang trả lời...</div>}
      </div>

      <div className="border-t pt-4">
        <input
          className="w-full p-4 rounded-lg bg-transparent border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
          placeholder="Nhập prompt tại đây..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void handleSend(input)}
        />
      </div>
    </div>
  );
};

export default ChatArea;