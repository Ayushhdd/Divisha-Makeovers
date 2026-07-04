import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/authSlice';
import Alert from '../../components/ui/Alert';
import Logo from '../../components/Logo';
import INDIAN_STATES from '../../utils/states';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    email: '',
    mobile: '',
    password: '',
    address: { line1: '', line2: '', district: '', state: '', postalCode: '' },
  });

  const updateAddress = (field, value) => {
    setForm({ ...form, address: { ...form.address, [field]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ ...form, age: parseInt(form.age) }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/divisha/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-softpink-50 py-6 px-4">
      <div className="text-center mb-4">
        <Logo />
      </div>
      <div className="max-w-lg mx-auto card animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm mb-4">Register to book your makeover</p>

        {error && <Alert message={error} onClose={() => dispatch(clearError())} />}

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="label">Full Name *</label>
              <input required className="input-field" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div>
              <label className="label">Age *</label>
              <input type="number" required min="1" max="120" className="input-field" value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
            <div>
              <label className="label">Mobile *</label>
              <input type="tel" required className="input-field" value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email *</label>
              <input type="email" required className="input-field" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Password *</label>
              <input type="password" required minLength="6" className="input-field" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address Line 1 *</label>
              <input required className="input-field" value={form.address.line1}
                onChange={(e) => updateAddress('line1', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address Line 2</label>
              <input className="input-field" value={form.address.line2}
                onChange={(e) => updateAddress('line2', e.target.value)} />
            </div>
            <div>
              <label className="label">District *</label>
              <input required className="input-field" value={form.address.district}
                onChange={(e) => updateAddress('district', e.target.value)} />
            </div>
            <div>
              <label className="label">State *</label>
              <select required className="input-field" value={form.address.state}
                onChange={(e) => updateAddress('state', e.target.value)}>
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Postal Code *</label>
              <input required className="input-field" value={form.address.postalCode}
                onChange={(e) => updateAddress('postalCode', e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/divisha/login" className="text-rosegold-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
