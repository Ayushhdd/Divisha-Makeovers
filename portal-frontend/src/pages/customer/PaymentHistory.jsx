import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadPayments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/payments/my');
      setPayments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPayments(); }, []);

  const reuploadScreenshot = async (payment) => {
    const file = files[payment._id];
    const appointmentId = payment.appointment?._id || payment.appointment;
    if (!file) {
      setError('Choose the new payment screenshot first.');
      return;
    }
    if (!appointmentId) {
      setError('This payment is no longer linked to a booking. Please contact the owner.');
      return;
    }

    setSubmittingId(payment._id);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointmentId);
      formData.append('amount', payment.amount);
      formData.append('method', 'screenshot');
      formData.append('screenshot', file);
      await api.post('/payments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFiles((current) => ({ ...current, [payment._id]: null }));
      setMessage('New screenshot submitted. The owner will verify it in the UPI or bank app.');
      await loadPayments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit the screenshot');
    } finally {
      setSubmittingId('');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Payment History</h1>
      {error && <Alert message={error} onClose={() => setError('')} />}
      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

      {payments.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">No payments yet</div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment._id} className="card">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-rosegold-600">{formatCurrency(payment.amount)}</p>
                  <p className="text-sm text-gray-500">
                    {payment.appointment?.bookingReference || 'Booking'} - {formatDate(payment.createdAt)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                  payment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {payment.status === 'pending' ? 'Awaiting verification' : payment.status}
                </span>
              </div>

              {payment.status === 'pending' && (
                <p className="mt-3 text-sm text-amber-700">Screenshot submitted. It is not counted as paid until the owner verifies it.</p>
              )}
              {payment.verificationNote && (
                <p className="mt-3 text-sm text-gray-600">Owner note: {payment.verificationNote}</p>
              )}

              {payment.status === 'rejected' && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
                  <p className="text-sm text-red-700">Upload one clear, new screenshot for the same payment amount.</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="input-field mt-3 bg-white"
                    onChange={(event) => setFiles((current) => ({ ...current, [payment._id]: event.target.files?.[0] || null }))}
                  />
                  <button
                    onClick={() => reuploadScreenshot(payment)}
                    disabled={submittingId === payment._id}
                    className="btn-primary mt-3 w-full"
                  >
                    {submittingId === payment._id ? 'Submitting...' : 'Submit New Screenshot'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
