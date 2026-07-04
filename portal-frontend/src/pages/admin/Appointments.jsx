import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', customer: '', status: '', service: '' });

  const load = () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/appointments/admin/all', { params }).then(({ data }) => {
      setAppointments(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    api.get('/admin/customers').then(({ data }) => setCustomers(data));
    api.get('/services/all').then(({ data }) => setServices(data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    load();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Appointments</h1>

      <div className="card grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input type="date" className="input-field" value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
        <select className="input-field" value={filters.customer}
          onChange={(e) => setFilters({ ...filters, customer: e.target.value })}>
          <option value="">All Customers</option>
          {customers.map((c) => <option key={c._id} value={c._id}>{c.fullName}</option>)}
        </select>
        <select className="input-field" value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input-field" value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}>
          <option value="">All Services</option>
          {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <button onClick={load} className="btn-primary col-span-2 sm:col-span-4">Apply Filters</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt._id} className="card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <p className="font-medium">{apt.bookingReference}</p>
                  <p className="text-sm">{apt.customer?.fullName} · {apt.customer?.mobile}</p>
                  <p className="text-sm text-gray-500">{formatDate(apt.appointmentDate)} · {apt.appointmentTime}</p>
                  <p className="text-xs text-gray-400">{apt.venue}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[apt.status]}`}>
                    {STATUS_LABELS[apt.status]}
                  </span>
                  <p className="text-sm font-semibold mt-1">{formatCurrency(apt.totalAmount)}</p>
                  <p className="text-xs text-gray-500">Paid: {formatCurrency(apt.advancePaid)}</p>
                </div>
              </div>
              {apt.status === 'pending_payment' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateStatus(apt._id, 'pending_approval')} className="btn-primary text-sm py-1.5 flex-1">
                    Awaiting Payment
                  </button>
                  <button onClick={() => updateStatus(apt._id, 'rejected')} className="btn-outline text-sm py-1.5 flex-1 text-red-600">
                    Reject
                  </button>
                </div>
              )}
              {apt.status === 'pending_approval' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateStatus(apt._id, 'confirmed')} className="btn-primary text-sm py-1.5 flex-1">
                    Approve
                  </button>
                  <button onClick={() => updateStatus(apt._id, 'payment_rejected')} className="btn-outline text-sm py-1.5 flex-1 text-red-600">
                    Reject Payment
                  </button>
                </div>
              )}
              {apt.status === 'payment_rejected' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateStatus(apt._id, 'pending_approval')} className="btn-primary text-sm py-1.5 flex-1">
                    Allow Re-upload
                  </button>
                  <button onClick={() => updateStatus(apt._id, 'rejected')} className="btn-outline text-sm py-1.5 flex-1 text-red-600">
                    Reject Booking
                  </button>
                </div>
              )}
              {apt.status === 'confirmed' && (
                <button onClick={() => updateStatus(apt._id, 'completed')} className="btn-secondary text-sm mt-3 w-full">
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
