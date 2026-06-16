import { useEffect, useState } from 'react';
import { createGroup, getGroups } from '../../api/groupApi';
import type { Group } from '../../types/group';

const GroupModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissions] = useState([
    { action: 'Create', desc: 'New Resources', grant: true },
    { action: 'Read', desc: 'Resource Data', grant: true },
    { action: 'Update', desc: 'Edit Content', grant: false },
    { action: 'Delete', desc: 'Remove Assets', grant: false },
  ]);
  const [entityType, setEntityType] = useState<'users' | 'agents'>('users');

  const fetchGroups = async () => {
    setError(null);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách nhóm');
    }
  };

  useEffect(() => {
    void fetchGroups();
  }, []);

  const handleCreate = async () => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Vui lòng nhập tên nhóm.');
      return;
    }

    setLoading(true);
    try {
      await createGroup({ name: name.trim(), description: description.trim() });
      setSuccess('Tạo nhóm thành công.');
      setName('');
      setDescription('');
      await fetchGroups();
    } catch (err) {
      setError((err as Error).message || 'Không thể tạo nhóm');
    } finally {
      setLoading(false);
    }
  };

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
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-[var(--border)]"
            placeholder="e.g. Marketing Team"
          />
        </div>

        <div>
          <label className="text-xs uppercase text-gray-500 block mb-1">Mô tả nhóm</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-[var(--border)]"
            placeholder="Mô tả ngắn"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-xs uppercase text-gray-500 block mb-1">Loại thực thể</label>
        <div className="flex bg-[var(--bg-sidebar)] rounded p-1 mb-6">
          <button
            type="button"
            onClick={() => setEntityType('users')}
            className={`flex-1 py-2 text-sm rounded ${entityType === 'users' ? 'bg-[var(--accent)] text-white' : 'text-gray-500'}`}
          >
            Users
          </button>
          <button
            type="button"
            onClick={() => setEntityType('agents')}
            className={`flex-1 py-2 text-sm rounded ${entityType === 'agents' ? 'bg-[var(--accent)] text-white' : 'text-gray-500'}`}
          >
            Agents
          </button>
        </div>

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

      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-500">{success}</div>}

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleCreate}
            className="w-full px-6 py-3 bg-[var(--accent)] text-white rounded-md text-sm disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Khởi tạo nhóm'}
          </button>
          <button onClick={onClose} className="w-full px-4 py-3 text-sm border border-[var(--border)] rounded-md">Hủy</button>
        </div>

        <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--bg-sidebar)]">
          <h3 className="text-sm font-semibold mb-3">Danh sách nhóm</h3>
          {groups.length === 0 ? (
            <p className="text-sm text-gray-500">Không có nhóm hoặc bạn chưa có quyền xem.</p>
          ) : (
            <ul className="space-y-3 max-h-56 overflow-y-auto">
              {groups.map((group) => (
                <li key={group.id} className="rounded-lg border border-[var(--border)] p-3 bg-[var(--bg-main)]">
                  <div className="font-medium">{group.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{group.description || 'Chưa có mô tả'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupModal;