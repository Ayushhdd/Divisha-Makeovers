import express from 'express';
import {
  getMyPayments,
  getAllPayments,
  verifyPayment,
  addPayment,
} from '../controllers/paymentController.js';
import { protect, adminOnly, customerOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/my', protect, customerOnly, getMyPayments);
router.get('/all', protect, adminOnly, getAllPayments);
router.post('/', protect, customerOnly, upload.single('screenshot'), addPayment);
router.put('/:id/verify', protect, adminOnly, verifyPayment);

export default router;
