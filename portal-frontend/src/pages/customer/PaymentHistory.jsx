import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my').then(({ data }) => {
      setPayments(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Payment History</h1>

      {payments.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">No payments yet</div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-rosegold-600">{formatCurrency(p.amount)}</p>
                  <p className="text-sm text-gray-500">
                    {p.appointment?.bookingReference} · {formatDate(p.createdAt)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  p.status === 'verified' ? 'bg-green-100 text-green-700' :
                  p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 capitalize">{p.type} · {p.method}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
