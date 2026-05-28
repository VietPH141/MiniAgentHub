import { useState } from 'react';

const GroupModal = ({ onClose }: { onClose: () => void }) => {
  const [permissions] = useState([
    { action: 'Create', desc: 'New Resources', grant: true },
    { action: 'Read', desc: 'Resource Data', grant: true },
    { action: 'Update', desc: 'Edit Content', grant: false },
    { action: 'Delete', desc: 'Remove Assets', grant: false },
  ]);

  return (
    <div className="bg-[var(--bg-main)] p-6 rounded-xl shadow-2xl w-[700px] border border-[var(--border)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Tạo nhóm mới (RBAC)</h2>
          <p className="text-xs text-gray-500">Thiết lập định danh và quyền truy cập cho nhóm.</p>
        </div>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs uppercase text-gray-500 block mb-1">Tên nhóm</label>
          <input type="text" className="w-full p-2 rounded bg-transparent border border-[var(--border)]" placeholder="e.g. Marketing Team" />
        </div>
        <div>
          <label className="text-xs uppercase text-gray-500 block mb-1">Loại thực thể</label>
          <div className="flex bg-[var(--bg-sidebar)] rounded p-1">
            <button className="flex-1 py-1 bg-[var(--accent)] text-white rounded text-sm">Users</button>
            <button className="flex-1 py-1 text-sm">Agents</button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-xs uppercase text-gray-500 block mb-2">Ma trận quyền (Permissions Matrix)</label>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-gray-500">
              <th className="py-2">Hành động</th>
              <th className="py-2">Mô tả</th>
              <th className="py-2">Cho phép</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, i) => (
              <tr key={i} className="border-b border-[var(--border)]">
                <td className="py-2 font-medium">{p.action}</td>
                <td className="py-2 text-gray-500">{p.desc}</td>
                <td className="py-2">
                  <input type="checkbox" checked={p.grant} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 text-sm">Hủy</button>
        <button className="px-6 py-2 bg-[var(--accent)] text-white rounded-md text-sm">Khởi tạo nhóm</button>
      </div>
    </div>
  );
};

export default GroupModal;