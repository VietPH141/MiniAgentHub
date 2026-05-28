import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="bg-[var(--bg-main)] p-6 rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-y-auto border border-[var(--border)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold">Cài đặt hệ thống</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Người dùng hiện tại: {user?.fullName || user?.email || 'Chưa đăng nhập'}</p>
        </div>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      <div className="space-y-8">
        {/* Section: Personalization */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Cá nhân hóa</h3>
          <div className="flex items-center justify-between p-4 bg-[var(--bg-sidebar)] rounded-lg">
            <div>
              <p className="font-medium">Giao diện (Theme)</p>
              <p className="text-xs text-gray-500">Thay đổi giữa chế độ sáng và tối</p>
            </div>
            <button onClick={toggleTheme} className="px-4 py-1 border border-[var(--accent)] rounded text-sm">
              {theme === 'dark' ? 'Chuyển sang Sáng' : 'Chuyển sang Tối'}
            </button>
          </div>
        </section>

        {/* Section: Account */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Tài khoản & Bảo mật</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border-b border-[var(--border)]">
              <span>Xóa toàn bộ lịch sử hội thoại</span>
              <button className="text-red-500 text-sm">Xóa dữ liệu</button>
            </div>
            <div className="flex justify-between items-center p-3">
              <span>Đăng xuất khỏi thiết bị</span>
              <button onClick={() => { logout(); onClose(); }} className="text-red-500 text-sm">Đăng xuất</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsModal;