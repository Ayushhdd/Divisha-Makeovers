import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { fetchServices, toggleService, clearSelected } from '../../store/serviceSlice';
import api from '../../api/axios';
import { formatCurrency, CATEGORIES } from '../../utils/helpers';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const PAYMENT_TIMER_SECONDS = 5 * 60;
const todayIso = () => new Date().toISOString().split('T')[0];

const getCompleteCustomServices = (services) =>
  services
    .map((service) => ({
      ...service,
      name: service.name.trim(),
      price: parseFloat(service.price),
      duration: parseInt(service.duration, 10) || 60,
    }))
    .filter((service) => service.name && Number.isFinite(service.price) && service.price > 0);

export default function BookAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, selected } = useSelector((state) => state.services);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    appointmentDate: '',
    appointmentTime: '',
    venue: '',
    notes: '',
    advanceAmount: '',
    paymentOption: 'pay_later',
    customServiceRequest: '',
  });
  const [customServices, setCustomServices] = useState([]);
  const [settings, setSettings] = useState(null);
  const [generatedQrCode, setGeneratedQrCode] = useState('');
  const [qrImageFailed, setQrImageFailed] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(PAYMENT_TIMER_SECONDS);
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchServices({ search, category }));
    api.get('/admin/settings/public').then(({ data }) => setSettings(data));
    return () => dispatch(clearSelected());
  }, [dispatch, search, category]);

  const completeCustomServices = useMemo(
    () => getCompleteCustomServices(customServices),
    [customServices]
  );
  const hasPartialCustomService = customServices.some((service) => {
    const hasName = service.name.trim();
    const hasPrice = String(service.price).trim();
    return (hasName || hasPrice) && !(hasName && parseFloat(service.price) > 0);
  });
  const hasBookingItems =
    selected.length > 0 || completeCustomServices.length > 0 || form.customServiceRequest.trim();
  const appointmentDetailsComplete =
    Boolean(form.appointmentDate) && Boolean(form.appointmentTime) && Boolean(form.venue.trim());

  const total = selected.reduce((sum, s) => sum + s.price, 0) +
    completeCustomServices.reduce((sum, s) => sum + s.price, 0);

  const requestedAdvance = parseFloat(form.advanceAmount) || 0;
  const advance = form.paymentOption === 'pay_now' ? requestedAdvance : 0;
  const remaining = total - advance;
  const paymentAmount = advance > 0 ? advance : total;
  const paymentTimerLabel = useMemo(() => {
    const minutes = Math.floor(paymentTimer / 60);
    const seconds = paymentTimer % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [paymentTimer]);
  const paymentTimerProgress = (paymentTimer / PAYMENT_TIMER_SECONDS) * 100;
  const upiPaymentLink = useMemo(() => {
    if (!settings?.upiId) return '';

    const params = new URLSearchParams({
      pa: settings.upiId,
      pn: settings.businessName || 'Divisha Makeovers',
      cu: 'INR',
    });

    if (paymentAmount > 0) {
      params.set('am', paymentAmount.toFixed(2));
    }

    return `upi://pay?${params.toString()}`;
  }, [paymentAmount, settings?.businessName, settings?.upiId]);

  useEffect(() => {
    let isActive = true;

    setQrImageFailed(false);

    if (!upiPaymentLink) {
      setGeneratedQrCode('');
      return () => {
        isActive = false;
      };
    }

    QRCode.toDataURL(upiPaymentLink, {
      margin: 2,
      width: 240,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isActive) setGeneratedQrCode(url);
      })
      .catch(() => {
        if (isActive) setGeneratedQrCode('');
      });

    return () => {
      isActive = false;
    };
  }, [upiPaymentLink]);

  useEffect(() => {
    if (step !== 3 || form.paymentOption !== 'pay_now') {
      setPaymentTimer(PAYMENT_TIMER_SECONDS);
      return undefined;
    }

    setPaymentTimer(PAYMENT_TIMER_SECONDS);

    const timer = window.setInterval(() => {
      setPaymentTimer((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [form.paymentOption, step, upiPaymentLink]);

  const validateStepOne = () => {
    setError('');
    if (!hasBookingItems) {
      setError('Please select at least one service or add a custom request');
      return false;
    }
    if (hasPartialCustomService) {
      setError('Please complete custom service name and price, or remove the incomplete row');
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    setError('');
    if (!form.appointmentDate || !form.appointmentTime || !form.venue.trim()) {
      setError('Please fill appointment date, time and venue');
      return false;
    }
    if (form.appointmentDate < todayIso()) {
      setError('Please choose today or a future appointment date');
      return false;
    }
    return true;
  };

  const goToStepTwo = () => {
    if (validateStepOne()) setStep(2);
  };

  const goToPayment = () => {
    if (validateStepTwo()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!validateStepOne() || !validateStepTwo()) {
      return;
    }
    if (form.paymentOption === 'pay_now' && total <= 0) {
      setError('Pay Now requires a priced service. Use Pay Later for custom quote requests.');
      return;
    }
    if (form.paymentOption === 'pay_now' && advance < 1) {
      setError('Minimum advance of Rs. 1 required for Pay Now');
      return;
    }
    if (form.paymentOption === 'pay_now' && paymentTimer === 0) {
      setError('Payment window expired. Please go back and generate the QR again.');
      return;
    }
    if (form.paymentOption === 'pay_now' && !screenshot) {
      setError('Please upload the payment screenshot before confirming the booking.');
      return;
    }
    setError('');
    if (selected.length === 0 && customServices.length === 0 && !form.customServiceRequest) {
      setError('Please select at least one service or add a custom request');
      return;
    }
    if (!form.appointmentDate || !form.appointmentTime || !form.venue) {
      setError('Please fill appointment date, time and venue');
      return;
    }
    if (form.paymentOption === 'pay_now' && advance < 1) {
      setError('Minimum advance of ₹1 required for Pay Now');
      return;
    }

    const submittedAdvance = form.paymentOption === 'pay_now' ? advance : 0;
    setSubmitting(true);
    const formData = new FormData();
    formData.append('serviceIds', JSON.stringify(selected.map((s) => s._id)));
    formData.append('customServices', JSON.stringify(completeCustomServices));
    formData.append('customServiceRequest', form.customServiceRequest.trim());
    formData.append('appointmentDate', form.appointmentDate);
    formData.append('appointmentTime', form.appointmentTime);
    formData.append('venue', form.venue.trim());
    formData.append('notes', form.notes.trim());
    formData.append('advanceAmount', submittedAdvance);
    formData.append('paymentOption', form.paymentOption);
    if (screenshot) formData.append('paymentScreenshot', screenshot);

    try {
      await api.post('/appointments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(clearSelected());
      navigate('/divisha/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
    setSubmitting(false);
  };

  const addCustomService = () => {
    setCustomServices([...customServices, { name: '', price: '', duration: 60 }]);
  };

  const removeCustomService = (index) => {
    setCustomServices(customServices.filter((_, i) => i !== index));
  };

  if (loading && list.length === 0) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Book Appointment</h1>

      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-1 rounded-full ${step >= s ? 'bg-rosegold-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      {error && <Alert message={error} onClose={() => setError('')} />}

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Search services..."
              className="input-field flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="input-field sm:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            {list.map((svc) => {
              const isSelected = selected.some((s) => s._id === svc._id);
              return (
                <button
                  key={svc._id}
                  onClick={() => dispatch(toggleService(svc))}
                  className={`card w-full text-left transition-all ${isSelected ? 'ring-2 ring-rosegold-400 bg-rosegold-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{svc.name}</p>
                      <p className="text-xs text-gray-500">{svc.category} · {svc.duration} min</p>
                    </div>
                    <p className="font-semibold text-rosegold-600">{formatCurrency(svc.price)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="card space-y-3">
            <p className="font-medium text-sm">Custom Service Request</p>
            <textarea
              className="input-field"
              rows="2"
              placeholder="Describe service not listed..."
              value={form.customServiceRequest}
              onChange={(e) => setForm({ ...form, customServiceRequest: e.target.value })}
            />
            {customServices.map((cs, i) => (
              <div key={i} className="grid grid-cols-[1fr_120px_auto] gap-2 max-sm:grid-cols-1">
                <input placeholder="Service name" className="input-field" value={cs.name}
                  onChange={(e) => {
                    const updated = [...customServices];
                    updated[i].name = e.target.value;
                    setCustomServices(updated);
                  }} />
                <input type="number" placeholder="Price ₹" className="input-field" value={cs.price}
                  onChange={(e) => {
                    const updated = [...customServices];
                    updated[i].price = e.target.value;
                    setCustomServices(updated);
                  }} />
                <button
                  type="button"
                  onClick={() => removeCustomService(i)}
                  className="rounded-xl border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50 max-sm:py-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addCustomService} className="text-sm text-rosegold-600">+ Add custom service with price</button>
          </div>

          <div className="card bg-rosegold-50">
            <p className="text-sm text-gray-600">
              Selected: {selected.length + completeCustomServices.length} priced services
              {form.customServiceRequest.trim() ? ' + custom request' : ''}
            </p>
            <p className="text-xl font-bold text-rosegold-700">{formatCurrency(total)}</p>
          </div>

          <button onClick={goToStepTwo} className="btn-primary w-full py-3">Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="label">Appointment Date *</label>
            <input type="date" required className="input-field" min={todayIso()}
              value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Appointment Time *</label>
            <input type="time" required className="input-field"
              value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} />
          </div>
          <div>
            <label className="label">Venue / Location *</label>
            <input required className="input-field" placeholder="Event venue or address"
              value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input-field" rows="3" placeholder="Any special requirements..."
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button
              onClick={goToPayment}
              className={`btn-primary flex-1 ${appointmentDetailsComplete ? '' : 'opacity-60'}`}
              aria-disabled={!appointmentDetailsComplete}
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="card bg-softpink-50 space-y-2">
            <div className="flex justify-between"><span>Total Amount</span><span className="font-bold">{formatCurrency(total)}</span></div>
            <div>
              <label className="label">Advance Amount (₹1 to {formatCurrency(total)})</label>
              <input type="number" min="0" max={total} className="input-field" value={form.advanceAmount}
                onChange={(e) => setForm({ ...form, advanceAmount: e.target.value })} />
            </div>
            <div className="flex justify-between text-sm"><span>Advance Paid</span><span>{formatCurrency(advance)}</span></div>
            <div className="flex justify-between font-semibold text-rosegold-700"><span>Remaining Balance</span><span>{formatCurrency(remaining)}</span></div>
          </div>

          <div className="space-y-3">
            <label className={`card block cursor-pointer ${form.paymentOption === 'pay_now' ? 'ring-2 ring-rosegold-400' : ''}`}>
              <input type="radio" name="payment" value="pay_now" className="mr-2"
                checked={form.paymentOption === 'pay_now'}
                onChange={() => setForm({ ...form, paymentOption: 'pay_now' })} />
              <span className="font-medium">Pay Advance Now</span>
              <p className="text-xs text-gray-500 mt-1">Upload payment screenshot → Booking Confirmed</p>
            </label>
            <label className={`card block cursor-pointer ${form.paymentOption === 'pay_later' ? 'ring-2 ring-rosegold-400' : ''}`}>
              <input type="radio" name="payment" value="pay_later" className="mr-2"
                checked={form.paymentOption === 'pay_later'}
                onChange={() => setForm({ ...form, paymentOption: 'pay_later' })} />
              <span className="font-medium">Request Pay Later</span>
              <p className="text-xs text-gray-500 mt-1">Admin will approve your booking</p>
            </label>
          </div>

          {form.paymentOption === 'pay_now' && settings && (
            <div className="card space-y-3">
              <div className="flex flex-col items-center gap-3 text-center">
                {(settings.qrCodeUrl && !qrImageFailed) || generatedQrCode ? (
                  <img
                    src={settings.qrCodeUrl && !qrImageFailed ? settings.qrCodeUrl : generatedQrCode}
                    alt="Payment QR"
                    className="w-48 rounded-lg border border-softpink-200 bg-white p-2 shadow-sm"
                    loading="lazy"
                    onError={() => setQrImageFailed(true)}
                  />
                ) : (
                  <div className="w-48 rounded-lg border border-dashed border-rosegold-300 bg-softpink-50 p-5 text-sm text-gray-600">
                    Payment QR will appear after UPI details are configured.
                  </div>
                )}
                {generatedQrCode && (
                  <p className="text-[11px] text-gray-500">
                    QR generated from the UPI ID for this booking amount.
                  </p>
                )}
                <div className="w-full max-w-xs rounded-2xl border border-rosegold-200 bg-softpink-50 px-4 py-3">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                    <span>Payment window</span>
                    <span className={paymentTimer === 0 ? 'text-red-500' : 'text-rosegold-700'}>
                      {paymentTimer === 0 ? 'Expired' : paymentTimerLabel}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        paymentTimer === 0 ? 'bg-red-400' : 'bg-rosegold-500'
                      }`}
                      style={{ width: `${paymentTimerProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-gray-500">
                    Complete the UPI payment before the timer ends.
                  </p>
                </div>
              </div>
              {settings.upiId && <p className="text-center text-sm">UPI: <strong>{settings.upiId}</strong></p>}
              <p className="text-xs text-gray-500 text-center">{settings.paymentInstructions}</p>
              <div>
                <label className="label">Upload Payment Screenshot</label>
                <input type="file" accept="image/*" className="input-field"
                  onChange={(e) => setScreenshot(e.target.files[0])} />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
