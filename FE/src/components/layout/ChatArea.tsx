import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ChatAreaProps {
  onOpenAuth: () => void;
}

const ChatArea = ({ onOpenAuth }: ChatAreaProps) => {
  const { isLoggedIn, setPendingPrompt, pendingPrompt } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  // Tự động chạy prompt nếu user vừa login xong
  useEffect(() => {
    if (isLoggedIn && pendingPrompt) {
      handleSend(pendingPrompt);
      setPendingPrompt(null); // Xóa hàng chờ
    }
  }, [isLoggedIn, pendingPrompt]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    if (!isLoggedIn) {
      setPendingPrompt(content);
      onOpenAuth(); // Mở popup login
      return;
    }

    // Logic gửi API chat thực tế ở đây
    setMessages([...messages, { role: 'user', content }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="overflow-y-auto flex-1">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Hãy bắt đầu bằng một câu hỏi cho AI...
          </div>
        ) : (
          messages.map((m, i) => <div key={i} className="mb-4">{m.content}</div>)
        )}
      </div>

      <div className="border-t pt-4">
        <input
          className="w-full p-4 rounded-lg bg-transparent border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
          placeholder="Nhập prompt tại đây..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
        />
      </div>
    </div>
  );
};

export default ChatArea;