import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, CATEGORIES } from '../../utils/helpers';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const emptyService = { name: '', description: '', category: 'Bridal Makeup', price: '', duration: 60 };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyService);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/services/all').then(({ data }) => {
      setServices(data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm(emptyService);
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (svc) => {
    setForm({ ...svc, price: svc.price.toString() });
    setEditId(svc._id);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, price: parseFloat(form.price), duration: parseInt(form.duration) };
    try {
      if (editId) {
        await api.put(`/services/${editId}`, payload);
      } else {
        await api.post('/services', payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this service?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Services</h1>
        <button onClick={openCreate} className="btn-primary">+ Add Service</button>
      </div>

      <div className="grid gap-3">
        {services.map((svc) => (
          <div key={svc._id} className={`card ${!svc.isActive ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{svc.name}</p>
                <p className="text-xs text-rosegold-500">{svc.category} · {svc.duration} min</p>
                <p className="text-sm text-gray-500 mt-1">{svc.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-rosegold-600">{formatCurrency(svc.price)}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(svc)} className="text-xs text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(svc._id)} className="text-xs text-red-600">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Service' : 'Add Service'}>
        {error && <Alert message={error} />}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input required className="input-field" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required className="input-field" rows="2" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Duration (min)</label>
              <input type="number" required min="15" className="input-field" value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Price (₹)</label>
            <input type="number" required min="0" className="input-field" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">Save Service</button>
        </form>
      </Modal>
    </div>
  );
}
