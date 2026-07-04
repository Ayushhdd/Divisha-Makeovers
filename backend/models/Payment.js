import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    type: {
      type: String,
      enum: ['advance', 'balance', 'full'],
      default: 'advance',
    },
    method: {
      type: String,
      enum: ['upi', 'screenshot', 'online', 'cash'],
      default: 'upi',
    },
    screenshot: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    transactionRef: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ appointment: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
