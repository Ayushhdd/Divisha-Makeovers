import { useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Change Password</h1>
      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input type="password" required className="input-field" value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        </div>
        <div>
          <label className="label">New Password</label>
          <input type="password" required minLength="6" className="input-field" value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input type="password" required className="input-field" value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
