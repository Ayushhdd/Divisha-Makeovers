import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import { notifyAdmin, notifyCustomer } from '../utils/notifications.js';
import { getFileUrl } from '../middleware/upload.js';

const withScreenshotUrl = (payment, req) => {
  const result = payment.toObject ? payment.toObject() : payment;
  return {
    ...result,
    screenshotUrl: result.screenshot ? getFileUrl(result.screenshot, req) : '',
  };
};

export const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ customer: req.user._id })
    .populate('appointment', 'bookingReference appointmentDate totalAmount')
    .sort({ createdAt: -1 });
  res.json(payments.map((payment) => withScreenshotUrl(payment, req)));
};

export const getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate('customer', 'fullName email mobile')
    .populate('appointment', 'bookingReference')
    .sort({ createdAt: -1 });
  res.json(payments.map((payment) => withScreenshotUrl(payment, req)));
};

export const verifyPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('appointment');
  if (!payment) return res.status(404).json({ message: 'Payment not found' });

  const newStatus = req.body.status;
  const verificationNote = String(req.body.verificationNote || '').trim().slice(0, 500);
  if (!['verified', 'rejected'].includes(newStatus)) {
    return res.status(400).json({ message: 'Payment status must be verified or rejected' });
  }
  if (payment.status !== 'pending') {
    return res.status(400).json({ message: 'Only pending payments can be verified or rejected' });
  }
  if (newStatus === 'rejected' && !verificationNote) {
    return res.status(400).json({ message: 'Add a reason before rejecting a payment' });
  }

  payment.status = newStatus;
  payment.verificationNote = verificationNote;
  payment.verifiedAt = new Date();
  payment.verifiedBy = req.user._id;
  await payment.save();

  console.log(`[Payment Verification] Payment ID: ${payment._id}, Status: ${newStatus}, Amount: ${payment.amount}`);

  // Update appointment status based on payment verification
  if (newStatus === 'verified') {
    payment.appointment.advancePaid = Math.min(
      payment.appointment.totalAmount,
      payment.appointment.advancePaid + payment.amount
    );
    payment.appointment.remainingBalance = Math.max(
      0,
      payment.appointment.totalAmount - payment.appointment.advancePaid
    );
    payment.appointment.status = 'confirmed';
    await payment.appointment.save();
    console.log(`[Appointment Confirmed] Reference: ${payment.appointment.bookingReference} after payment verification`);

    await notifyCustomer({
      customerId: payment.customer,
      type: 'payment_confirmed',
      title: 'Payment Confirmed',
      message: `Your payment of ₹${payment.amount} has been verified. Your booking ${payment.appointment.bookingReference} is now confirmed.`,
      relatedId: payment._id,
      relatedModel: 'Payment',
    });
  } else if (newStatus === 'rejected') {
    payment.appointment.status = 'payment_rejected';
    await payment.appointment.save();
    console.log(`[Appointment Payment Rejected] Reference: ${payment.appointment.bookingReference}`);

    await notifyCustomer({
      customerId: payment.customer,
      type: 'payment_rejected',
      title: 'Payment Rejected',
      message: `Your payment of ₹${payment.amount} was not verified. Please upload a valid payment screenshot.`,
      relatedId: payment._id,
      relatedModel: 'Payment',
    });
  }

  res.json(payment);
};

export const addPayment = async (req, res) => {
  const { appointmentId, amount, method, transactionRef } = req.body;
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  if (appointment.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const payAmount = parseFloat(amount);
  if (payAmount < 1 || payAmount > appointment.remainingBalance) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  let screenshot = '';
  if (req.file) {
    screenshot = req.file.filename;
  }

  if (!screenshot) {
    return res.status(400).json({ message: 'Upload the payment screenshot before submitting it for verification' });
  }

  const payment = await Payment.create({
    appointment: appointmentId,
    customer: req.user._id,
    amount: payAmount,
    type: payAmount >= appointment.remainingBalance ? 'balance' : 'advance',
    method: method || (screenshot ? 'screenshot' : 'upi'),
    screenshot,
    transactionRef: String(transactionRef || '').replace(/\s/g, '').trim(),
    status: 'pending',
  });

  appointment.status = 'pending_approval';
  await appointment.save();

  await notifyAdmin({
    type: 'advance_payment',
    title: 'Payment Received',
    message: `₹${payAmount} payment for ${appointment.bookingReference}`,
    relatedId: appointment._id,
    relatedModel: 'Appointment',
  });

  res.status(201).json(payment);
};
