import Appointment from '../models/Appointment.js';
import AdminSettings from '../models/AdminSettings.js';
import { notifyCustomer } from './notifications.js';
import { sendAppointmentReminder } from './email.js';

export const sendReminders = async () => {
  try {
    const settings = await AdminSettings.findOne();
    const hoursBefore = settings?.reminderHoursBefore || 24;

    const now = new Date();
    const reminderWindow = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);
    const windowEnd = new Date(reminderWindow.getTime() + 60 * 60 * 1000);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: reminderWindow, $lt: windowEnd },
      status: 'confirmed',
    }).populate('customer', 'fullName email');

    for (const apt of appointments) {
      await notifyCustomer({
        customerId: apt.customer._id,
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: `Reminder: Your appointment on ${apt.appointmentDate.toLocaleDateString('en-IN')} at ${apt.appointmentTime}`,
        relatedId: apt._id,
        relatedModel: 'Appointment',
      });

      if (apt.customer.email) {
        await sendAppointmentReminder(
          apt.customer.email,
          apt.customer.fullName,
          apt.appointmentDate.toLocaleDateString('en-IN'),
          apt.appointmentTime,
          apt.venue
        );
      }
    }
  } catch (error) {
    console.error('Reminder job error:', error.message);
  }
};

export const startReminderJob = () => {
  sendReminders();
  setInterval(sendReminders, 60 * 60 * 1000);
};
