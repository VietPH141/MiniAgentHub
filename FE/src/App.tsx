import { useEffect, useState } from 'react';
import { createUser, deleteUser, getRoles, getUsers, updateUser } from './api/users';
import type { CreateUserData, Role, User, UpdateUserData } from './types/user';
import './App.css';

const initialFormState = {
  email: '',
  password: '',
  fullName: '',
  roleId: '',
  isActive: true,
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setError('');
      setUsers(await getUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải người dùng');
    }
  }

  async function loadRoles() {
    try {
      setError('');
      setRoles(await getRoles());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải roles');
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialFormState);
    setSuccess('');
    setError('');
  }

  function handleEdit(user: User) {
    setEditingId(user.id);
    setForm({
      email: user.email,
      password: '',
      fullName: user.fullName ?? '',
      roleId: user.role.id,
      isActive: user.isActive,
    });
    setError('');
    setSuccess('');
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này không?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteUser(id);
      setSuccess('Xóa người dùng thành công');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa người dùng');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.email || !form.roleId || (!editingId && !form.password)) {
      setError('Email, role và mật khẩu là bắt buộc.');
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editingId) {
        const payload: UpdateUserData = {
          email: form.email,
          fullName: form.fullName || undefined,
          roleId: form.roleId,
          isActive: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        };
        await updateUser(editingId, payload);
        setSuccess('Cập nhật người dùng thành công');
      } else {
        const payload: CreateUserData = {
          email: form.email,
          password: form.password,
          fullName: form.fullName || undefined,
          roleId: form.roleId,
          isActive: form.isActive,
        };
        await createUser(payload);
        setSuccess('Tạo người dùng mới thành công');
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu người dùng');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>User CRUD</h1>
          <p>Quản lý người dùng đơn giản với API backend và frontend React.</p>
        </div>
        <button type="button" onClick={resetForm} className="clear-button">
          Mới
        </button>
      </header>

      {(error || success) && (
        <div className={`message ${error ? 'message-error' : 'message-success'}`}>
          {error || success}
        </div>
      )}

      <main className="layout-grid">
        <section className="panel form-panel">
          <h2>{editingId ? 'Cập nhật người dùng' : 'Tạo người dùng mới'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                type="email"
                required
              />
            </label>
            <label>
              Mật khẩu {editingId ? '(để trống nếu không đổi)' : ''}
              <input
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                type="password"
                placeholder={editingId ? 'Đổi mật khẩu...' : 'Nhập mật khẩu'}
                {...(!editingId ? { required: true } : {})}
              />
            </label>
            <label>
              Họ tên
              <input
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                type="text"
              />
            </label>
            <label>
              Role
              <select
                value={form.roleId}
                onChange={(event) => setForm({ ...form, roleId: event.target.value })}
                required
              >
                <option value="">Chọn role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="switch-label">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
              />
              Active
            </label>

            <button type="submit" className="submit-button" disabled={loading}>
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="panel-header">
            <h2>Danh sách người dùng</h2>
            <button type="button" onClick={loadUsers} className="small-button">
              Làm mới
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.fullName || '—'}</td>
                    <td>{user.role?.name || '—'}</td>
                    <td>{user.isActive ? 'Yes' : 'No'}</td>
                    <td className="action-cell">
                      <button type="button" onClick={() => handleEdit(user)}>
                        Sửa
                      </button>
                      <button type="button" onClick={() => handleDelete(user.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5}>Không có người dùng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
