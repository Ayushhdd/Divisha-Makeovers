import User from '../models/User.js';
import { generateToken, generateOTP } from '../utils/tokens.js';
import { sendOTPEmail } from '../utils/email.js';
import { notifyAdmin } from '../utils/notifications.js';

export const registerCustomer = async (req, res) => {
  const {
    fullName,
    age,
    email,
    mobile,
    password,
    address,
  } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    fullName,
    age,
    email,
    mobile,
    password,
    address,
    role: 'customer',
  });

  await notifyAdmin({
    type: 'new_registration',
    title: 'New Customer Registered',
    message: `${fullName} (${email}) has registered.`,
    relatedId: user._id,
    relatedModel: 'User',
  });

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  console.log(`[Login Attempt] Email: ${email.toLowerCase()}, Role check initiated`);

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    console.log(`[Login Failed] User not found: ${email.toLowerCase()}`);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!(await user.matchPassword(password))) {
    console.log(`[Login Failed] Password mismatch for: ${email.toLowerCase()}`);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    console.log(`[Login Failed] Account deactivated: ${email.toLowerCase()}`);
    return res.status(401).json({ message: 'Account is deactivated' });
  }

  const token = generateToken(user._id, rememberMe);
  console.log(`[Login Success] User: ${email.toLowerCase()}, Role: ${user.role}`);

  res.json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: token,
  });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { fullName, age, mobile, address } = req.body;
  const user = await User.findById(req.user._id);

  if (fullName) user.fullName = fullName;
  if (age) user.age = age;
  if (mobile) user.mobile = mobile;
  if (address) user.address = { ...user.address?.toObject?.() || user.address, ...address };

  await user.save();
  res.json(user);
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpires');

  if (!user) {
    return res.json({ message: 'If email exists, OTP has been sent' });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOTPEmail(user.email, otp, user.fullName);
  res.json({ message: 'If email exists, OTP has been sent' });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpires +password');

  if (!user || user.otp !== otp || user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
};
