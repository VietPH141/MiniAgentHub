import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onClose: () => void;
  onSwitchSignup: () => void;
}

const LoginModal = ({ onClose, onSwitchSignup }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Giả lập gọi API login
    // const res = await authService.login({ email, password });
    // login(res);
    alert('Logic đăng nhập sẽ gọi API ở đây');
    onClose();
  };

  return (
    <div className="bg-[var(--bg-main)] p-8 rounded-xl shadow-2xl w-[400px] border border-[var(--border)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đăng nhập</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full p-2 rounded bg-transparent border border-[var(--border)] focus:border-[var(--accent)] outline-none"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input 
            type="password" 
            className="w-full p-2 rounded bg-transparent border border-[var(--border)] focus:border-[var(--accent)] outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full py-2 bg-[var(--accent)] text-white rounded font-medium mt-4">
          Continue to Dashboard
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-gray-500">
        Chưa có tài khoản?{' '}
        <span onClick={onSwitchSignup} className="text-[var(--accent)] cursor-pointer hover:underline">
          Đăng ký ngay
        </span>
      </p>
    </div>
  );
};

export default LoginModal;