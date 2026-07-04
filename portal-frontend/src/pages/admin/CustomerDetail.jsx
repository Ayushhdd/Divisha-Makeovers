import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatCurrency, formatDate, STATUS_COLORS, STATUS_LABELS } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatCard from '../../components/ui/StatCard';

export default function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/customers/${id}`).then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p>Customer not found</p>;

  const { customer, appointments, payments, stats } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/admin/customers" className="text-sm text-rosegold-600 hover:underline">← Back to Customers</Link>

      <div className="card">
        <h1 className="font-display text-2xl font-bold">{customer.fullName}</h1>
        <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
          <p><span className="text-gray-500">Email:</span> {customer.email}</p>
          <p><span className="text-gray-500">Mobile:</span> {customer.mobile}</p>
          <p><span className="text-gray-500">Age:</span> {customer.age}</p>
          <p><span className="text-gray-500">Registered:</span> {formatDate(customer.createdAt)}</p>
          <p className="sm:col-span-2">
            <span className="text-gray-500">Address:</span>{' '}
            {customer.address?.line1}, {customer.address?.line2 && `${customer.address.line2}, `}
            {customer.address?.district}, {customer.address?.state} - {customer.address?.postalCode}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Total Spent" value={formatCurrency(stats.totalSpent)} />
        <StatCard title="Advance Paid" value={formatCurrency(stats.totalAdvance)} color="green" />
        <StatCard title="Remaining" value={formatCurrency(stats.remainingBalance)} color="orange" />
        <StatCard title="Bookings" value={stats.totalBookings} color="blue" />
      </div>

      <div>
        <h2 className="font-semibold mb-3">Appointment History</h2>
        <div className="space-y-2">
          {appointments.map((apt) => (
            <div key={apt._id} className="card py-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{apt.bookingReference}</p>
                  <p className="text-sm text-gray-500">{formatDate(apt.appointmentDate)} · {apt.appointmentTime}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[apt.status]}`}>
                    {STATUS_LABELS[apt.status]}
                  </span>
                  <p className="text-sm font-medium mt-1">{formatCurrency(apt.totalAmount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Payment History</h2>
        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p._id} className="card py-2 flex justify-between text-sm">
              <span>{formatDate(p.createdAt)} · {p.type}</span>
              <span className="font-medium">{formatCurrency(p.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
