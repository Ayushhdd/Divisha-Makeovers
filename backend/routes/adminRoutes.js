import express from 'express';
import {
  getDashboardStats,
  getCustomers,
  getCustomerHistory,
  getSettings,
  updateSettings,
  getPublicSettings,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/settings/public', getPublicSettings);
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/customers', protect, adminOnly, getCustomers);
router.get('/customers/:id', protect, adminOnly, getCustomerHistory);
router.get('/settings', protect, adminOnly, getSettings);
router.put('/settings', protect, adminOnly, upload.single('qrCode'), updateSettings);
router.get('/notifications', protect, getNotifications);
router.get('/notifications/unread-count', protect, getUnreadCount);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.put('/notifications/read-all', protect, markAllNotificationsRead);

export default router;
