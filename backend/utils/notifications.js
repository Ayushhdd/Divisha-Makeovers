import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createNotification = async ({
  recipientId,
  type,
  title,
  message,
  relatedId,
  relatedModel,
}) => {
  return Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    relatedId,
    relatedModel,
  });
};

export const notifyAdmin = async ({ type, title, message, relatedId, relatedModel }) => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) return null;
  return createNotification({
    recipientId: admin._id,
    type,
    title,
    message,
    relatedId,
    relatedModel,
  });
};

export const notifyCustomer = async ({
  customerId,
  type,
  title,
  message,
  relatedId,
  relatedModel,
}) => {
  return createNotification({
    recipientId: customerId,
    type,
    title,
    message,
    relatedId,
    relatedModel,
  });
};
