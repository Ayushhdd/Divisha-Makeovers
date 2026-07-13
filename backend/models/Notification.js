import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'new_registration',
        'new_booking',
        'advance_payment',
        'booking_cancelled',
        'booking_confirmed',
        'payment_confirmed',
        'payment_rejected',
        'appointment_reminder',
        'booking_rejected',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    relatedModel: {
      type: String,
      enum: ['User', 'Appointment', 'Payment'],
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
