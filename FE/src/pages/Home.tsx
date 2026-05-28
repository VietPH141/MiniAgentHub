import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/layout/ChatArea';

// Import các Modals
import LoginModal from '../components/modals/LoginModal';
import SignupModal from '../components/modals/SignupModal';
import SettingsModal from '../components/modals/SettingsModal';
import GroupModal from '../components/modals/GroupModal';

const Home = () => {
  // State quản lý modal nào đang hiển thị: 'LOGIN' | 'SIGNUP' | 'SETTINGS' | 'GROUPS' | null
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Hàm tiện ích để đóng modal
  const closeModal = () => setActiveModal(null);

  // Hàm bọc Overlay để dùng chung cho mọi Modal
  const renderModalOverlay = (children: React.ReactNode) => (
    <div 
      className="modal-overlay" 
      onClick={closeModal} // Click ra ngoài vùng modal thì đóng
    >
      <div 
        onClick={(e) => e.stopPropagation()} // Click bên trong modal thì không bị đóng
        className="animate-in fade-in zoom-in duration-200" // Hiệu ứng nhẹ nếu dùng Tailwind
      >
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-main)]">
      
      {/* 1. THANH ĐIỀU KHIỂN BÊN TRÁI (Tỷ lệ ~ 1/7) */}
      <div className="w-[14.28%] min-w-[240px] h-full">
        <Sidebar onOpenModal={(type) => setActiveModal(type)} />
      </div>

      {/* 2. GIAO DIỆN CHAT BÊN PHẢI (Tỷ lệ ~ 6/7) */}
      <div className="flex-1 h-full relative">
        <ChatArea onOpenAuth={() => setActiveModal('LOGIN')} />
      </div>

      {/* 3. LỚP PHỦ POPUP (Chỉ hiển thị khi activeModal khác null) */}
      {activeModal === 'LOGIN' && renderModalOverlay(
        <LoginModal 
          onClose={closeModal} 
          onSwitchSignup={() => setActiveModal('SIGNUP')} 
        />
      )}

      {activeModal === 'SIGNUP' && renderModalOverlay(
        <SignupModal 
          onClose={closeModal} 
          onSwitchLogin={() => setActiveModal('LOGIN')} 
        />
      )}

      {activeModal === 'SETTINGS' && renderModalOverlay(
        <SettingsModal onClose={closeModal} />
      )}

      {activeModal === 'GROUPS' && renderModalOverlay(
        <GroupModal onClose={closeModal} />
      )}

    </div>
  );
};

export default Home;