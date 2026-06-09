import { useState } from 'react';
import type { FormEvent } from 'react';
import { signup as signupApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onClose: () => void;
  onSwitchLogin: () => void;
}

const SignupModal = ({ onClose, onSwitchLogin }: Props) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await signupApi(email, password, fullName || undefined);
      login(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    }
  };

  return (
    <div className="bg-[var(--bg-main)] p-8 rounded-xl shadow-2xl w-[400px] border border-[var(--border)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tạo tài khoản</h2>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 rounded bg-transparent border border-[var(--border)]" />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-transparent border border-[var(--border)]" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-transparent border border-[var(--border)]" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" className="w-full py-2 bg-[var(--accent)] text-white rounded font-medium">Create Account</button>
      </form>

      <p className="text-center text-sm mt-6 text-gray-500">
        Đã có tài khoản?{' '}
        <span onClick={onSwitchLogin} className="text-[var(--accent)] cursor-pointer hover:underline">Đăng nhập</span>
      </p>
    </div>
  );
};

export default SignupModal;