interface Props {
  onClose: () => void;
  onSwitchLogin: () => void;
}

const SignupModal = ({ onClose, onSwitchLogin }: Props) => {
  return (
    <div className="bg-[var(--bg-main)] p-8 rounded-xl shadow-2xl w-[400px] border border-[var(--border)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tạo tài khoản</h2>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      <div className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-2 rounded bg-transparent border border-[var(--border)]" />
        <input type="email" placeholder="Email Address" className="w-full p-2 rounded bg-transparent border border-[var(--border)]" />
        <input type="password" placeholder="Password" className="w-full p-2 rounded bg-transparent border border-[var(--border)]" />
        <button className="w-full py-2 bg-[var(--accent)] text-white rounded font-medium">Create Account</button>
      </div>

      <p className="text-center text-sm mt-6 text-gray-500">
        Đã có tài khoản?{' '}
        <span onClick={onSwitchLogin} className="text-[var(--accent)] cursor-pointer hover:underline">Đăng nhập</span>
      </p>
    </div>
  );
};

export default SignupModal;