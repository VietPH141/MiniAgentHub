import { useEffect, useState } from 'react';
import { getConversations } from '../../api/conversationApi';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  onOpenModal: (type: string) => void;
  onNewChat: () => void;
}

const Sidebar = ({ onOpenModal, onNewChat }: SidebarProps) => {
  const { isLoggedIn, user, logout } = useAuth();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (isLoggedIn) {
      getConversations().then(setHistory).catch(console.error);
    } else {
      setHistory([]);
    }
  }, [isLoggedIn]);


  return (
    <div className="h-full bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col p-4">
      <div className="text-xl font-bold mb-8 text-[var(--accent)]">Mini AgentHub</div>
      
      <button onClick={onNewChat} className="w-full py-2 bg-[var(--accent)] text-white rounded-md mb-4">+ New Chat</button>

      <div className="flex-1 overflow-y-auto">
        <p className="text-xs text-gray-500 uppercase mb-2">History</p>
        {/* Render danh sách hội thoại cũ ở đây */}
      </div>

      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <button onClick={toggleTheme} className="w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Theme Sáng/Tối</button>
        <button onClick={() => onOpenModal('GROUPS')} className="w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Groups</button>
        <button onClick={() => onOpenModal('SETTINGS')} className="w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Settings</button>
        
        {isLoggedIn ? (
          <div className="pt-2">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <button onClick={logout} className="text-xs text-red-500">Đăng xuất</button>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <button onClick={() => onOpenModal('LOGIN')} className="w-full py-2 border border-[var(--accent)] text-[var(--accent)] rounded">Login</button>
            <button onClick={() => onOpenModal('SIGNUP')} className="w-full py-2 bg-gray-200 text-black rounded">Sign Up</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;