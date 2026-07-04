import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MyAppointments() {
  const [tab, setTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/appointments/my?type=${tab}`).then(({ data }) => {
      setAppointments(data);
      setLoading(false);
    });
  }, [tab]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await api.put(`/appointments/${id}/cancel`);
    setAppointments(appointments.filter((a) => a._id !== id));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">My Appointments</h1>

      <div className="flex gap-2">
        {['upcoming', 'past'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
              tab === t ? 'bg-rosegold-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : appointments.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">
          <p>No {tab} appointments</p>
          <Link to="/divisha/book" className="btn-primary inline-block mt-4">Book Now</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt._id} className="card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{apt.bookingReference}</p>
                  <p className="text-sm text-gray-600">{formatDate(apt.appointmentDate)} · {apt.appointmentTime}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[apt.status]}`}>
                  {STATUS_LABELS[apt.status]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{apt.venue}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                {apt.services?.map((s, i) => (
                  <span key={i} className="bg-softpink-100 px-2 py-1 rounded-lg">
                    {s.service?.name || s.customServiceName}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-sm border-t border-softpink-100 pt-3">
                <span>Total: <strong>{formatCurrency(apt.totalAmount)}</strong></span>
                <span>Paid: {formatCurrency(apt.advancePaid)} · Due: {formatCurrency(apt.remainingBalance)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link to={`/divisha/receipt/${apt._id}`} className="btn-outline text-sm py-1.5 px-3 flex-1 text-center">
                  Receipt
                </Link>
                {['pending_approval', 'confirmed'].includes(apt.status) && tab === 'upcoming' && (
                  <button onClick={() => handleCancel(apt._id)} className="text-sm text-red-600 py-1.5 px-3">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
