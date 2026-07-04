import express from 'express';
import {
  createBooking,
  getMyAppointments,
  getAppointmentById,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getCalendarView,
  getDailySchedule,
  getReceipt,
} from '../controllers/appointmentController.js';
import { protect, adminOnly, customerOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, customerOnly, upload.single('paymentScreenshot'), createBooking);
router.get('/my', protect, customerOnly, getMyAppointments);
router.get('/calendar', protect, adminOnly, getCalendarView);
router.get('/schedule', protect, adminOnly, getDailySchedule);
router.get('/admin/all', protect, adminOnly, getAllAppointments);
router.get('/:id/receipt', protect, getReceipt);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

export default router;
