import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../../store/authSlice';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';
import INDIAN_STATES from '../../utils/states';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/profile').then(({ data }) => setProfile(data));
  }, []);

  const updateAddress = (field, value) => {
    setProfile({ ...profile, address: { ...profile.address, [field]: value } });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.put('/auth/profile', {
        fullName: profile.fullName,
        age: profile.age,
        mobile: profile.mobile,
        address: profile.address,
      });
      setProfile(data);
      dispatch(fetchProfile());
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  if (!profile) return null;

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">My Profile</h1>
      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSave} className="card space-y-3">
        <div>
          <label className="label">Full Name</label>
          <input className="input-field" value={profile.fullName || ''}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Age</label>
            <input type="number" className="input-field" value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
          </div>
          <div>
            <label className="label">Mobile</label>
            <input className="input-field" value={profile.mobile || ''}
              onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input-field bg-gray-50" value={profile.email} disabled />
        </div>
        <div>
          <label className="label">Address Line 1</label>
          <input className="input-field" value={profile.address?.line1 || ''}
            onChange={(e) => updateAddress('line1', e.target.value)} />
        </div>
        <div>
          <label className="label">Address Line 2</label>
          <input className="input-field" value={profile.address?.line2 || ''}
            onChange={(e) => updateAddress('line2', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">District</label>
            <input className="input-field" value={profile.address?.district || ''}
              onChange={(e) => updateAddress('district', e.target.value)} />
          </div>
          <div>
            <label className="label">State</label>
            <select className="input-field" value={profile.address?.state || ''}
              onChange={(e) => updateAddress('state', e.target.value)}>
              <option value="">Select</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Postal Code</label>
          <input className="input-field" value={profile.address?.postalCode || ''}
            onChange={(e) => updateAddress('postalCode', e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
