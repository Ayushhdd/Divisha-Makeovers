import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', customer: '', status: '', service: '' });

  const load = () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    Promise.all([
      api.get('/appointments/admin/all', { params }),
      api.get('/payments/all'),
    ]).then(([appointmentsResponse, paymentsResponse]) => {
      setAppointments(appointmentsResponse.data);
      setPayments(paymentsResponse.data);
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

  const verifyPayment = async (payment, status) => {
    const verificationNote = status === 'rejected'
      ? window.prompt('Why is this payment being rejected?')
      : window.prompt('Optional note, for example: matched in UPI app') || '';

    if (status === 'rejected' && !verificationNote) return;
    await api.put(`/payments/${payment._id}/verify`, { status, verificationNote });
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
          {appointments.map((apt) => {
            const payment = payments.find((item) => item.appointment?._id === apt._id);
            return (
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
              {payment && (
                <div className="mt-3 rounded-xl border border-softpink-100 bg-softpink-50 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Payment submitted: <strong>{formatCurrency(payment.amount)}</strong></span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">{payment.status}</span>
                  </div>
                  {payment.transactionRef && <p className="mt-1 text-xs text-gray-600">UPI reference: <strong>{payment.transactionRef}</strong></p>}
                  {payment.verificationNote && <p className="mt-1 text-xs text-gray-600">Admin note: {payment.verificationNote}</p>}
                </div>
              )}
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
                  {payment?.status === 'pending' ? (
                    <>
                      <a href={payment.screenshotUrl} target="_blank" rel="noreferrer" className="btn-outline text-sm py-1.5 flex-1 text-center">View Screenshot</a>
                      <button onClick={() => verifyPayment(payment, 'verified')} className="btn-primary text-sm py-1.5 flex-1">Verify in UPI App</button>
                      <button onClick={() => verifyPayment(payment, 'rejected')} className="btn-outline text-sm py-1.5 flex-1 text-red-600">Reject Payment</button>
                    </>
                  ) : !payment ? (
                    <button onClick={() => updateStatus(apt._id, 'confirmed')} className="btn-primary text-sm py-1.5 flex-1">Approve Booking Request</button>
                  ) : (
                    <p className="flex-1 rounded-xl bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">Waiting for a new payment submission</p>
                  )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
