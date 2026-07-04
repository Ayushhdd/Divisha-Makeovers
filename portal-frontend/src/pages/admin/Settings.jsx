import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(({ data }) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const formData = new FormData();
    formData.append('upiId', settings.upiId);
    formData.append('paymentInstructions', settings.paymentInstructions);
    formData.append('businessName', settings.businessName);
    formData.append('businessPhone', settings.businessPhone || '');
    formData.append('businessEmail', settings.businessEmail || '');
    formData.append('reminderHoursBefore', settings.reminderHoursBefore || 24);
    if (qrFile) formData.append('qrCode', qrFile);

    try {
      const { data } = await api.put('/admin/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSettings(data);
      setQrFile(null);
      setMessage('Settings saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Payment Settings</h1>
      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="label">Business Name</label>
          <input className="input-field" value={settings.businessName || ''}
            onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} />
        </div>
        <div>
          <label className="label">UPI ID</label>
          <input className="input-field" placeholder="yourname@upi"
            value={settings.upiId || ''}
            onChange={(e) => setSettings({ ...settings, upiId: e.target.value })} />
        </div>
        <div>
          <label className="label">Payment QR Code</label>
          {settings.qrCodeUrl && (
            <img src={settings.qrCodeUrl} alt="QR Code" className="w-40 mb-2 rounded-lg" loading="lazy" />
          )}
          <input type="file" accept="image/*" className="input-field"
            onChange={(e) => setQrFile(e.target.files[0])} />
        </div>
        <div>
          <label className="label">Payment Instructions</label>
          <textarea className="input-field" rows="3"
            value={settings.paymentInstructions || ''}
            onChange={(e) => setSettings({ ...settings, paymentInstructions: e.target.value })} />
        </div>
        <div>
          <label className="label">Reminder Hours Before Appointment</label>
          <input type="number" min="1" className="input-field"
            value={settings.reminderHoursBefore || 24}
            onChange={(e) => setSettings({ ...settings, reminderHoursBefore: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
