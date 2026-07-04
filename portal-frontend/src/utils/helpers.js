export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (date, time) => `${formatDate(date)} at ${time}`;

export const STATUS_COLORS = {
  pending_payment: 'bg-orange-100 text-orange-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  payment_rejected: 'bg-red-200 text-red-900',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-600',
};

export const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  pending_approval: 'Pending Approval',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  payment_rejected: 'Payment Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const CATEGORIES = [
  'Bridal Makeup', 'Party Makeup', 'HD Makeup', 'Hair Styling',
  'Pre-Wedding Makeup', 'Nail Art', 'Custom Services',
];
