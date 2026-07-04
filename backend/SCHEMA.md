# MongoDB Schema Design — Divisha Makeovers

## Collections Overview

| Collection | Purpose |
|------------|---------|
| `users` | Admin (single) + customer accounts |
| `services` | Salon service catalog |
| `appointments` | Customer bookings |
| `payments` | Payment records |
| `notifications` | In-app notifications |
| `adminsettings` | Payment QR, UPI ID, business config |

---

## Users

```javascript
{
  fullName: String,        // required
  age: Number,
  email: String,           // unique, lowercase
  mobile: String,
  password: String,        // bcrypt hashed, select: false
  address: {
    line1: String,
    line2: String,
    district: String,
    state: String,
    postalCode: String
  },
  role: "customer" | "admin",  // default: customer
  otp: String,             // forgot password, select: false
  otpExpires: Date,
  isActive: Boolean,
  createdAt, updatedAt
}
```

**Indexes:** `email`, `mobile`, `role`

---

## Services

```javascript
{
  name: String,
  description: String,
  category: Enum [
    "Bridal Makeup", "Party Makeup", "HD Makeup",
    "Hair Styling", "Pre-Wedding Makeup", "Nail Art", "Custom Services"
  ],
  price: Number,           // INR
  duration: Number,          // minutes
  isActive: Boolean,
  createdAt, updatedAt
}
```

**Indexes:** text search on `name`, `description`, `category`; compound `{ category, isActive }`

---

## Appointments

```javascript
{
  customer: ObjectId → User,
  services: [{
    service: ObjectId → Service,     // optional if custom
    customServiceName: String,
    customServicePrice: Number,
    price: Number,
    duration: Number
  }],
  customServiceRequest: String,
  appointmentDate: Date,
  appointmentTime: String,           // "HH:mm"
  venue: String,
  notes: String,
  totalAmount: Number,
  advancePaid: Number,
  remainingBalance: Number,
  paymentOption: "pay_now" | "pay_later",
  paymentScreenshot: String,         // filename
  status: "pending_approval" | "confirmed" | "rejected" | "completed" | "cancelled",
  bookingReference: String,          // unique, e.g. DM202606081234
  adminNotes: String,
  createdAt, updatedAt
}
```

**Indexes:** `{ customer, appointmentDate }`, `{ status, appointmentDate }`, `appointmentDate`

---

## Payments

```javascript
{
  appointment: ObjectId → Appointment,
  customer: ObjectId → User,
  amount: Number,
  type: "advance" | "balance" | "full",
  method: "upi" | "screenshot" | "online" | "cash",
  screenshot: String,
  status: "pending" | "verified" | "rejected",
  transactionRef: String,
  notes: String,
  createdAt, updatedAt
}
```

---

## Notifications

```javascript
{
  recipient: ObjectId → User,
  type: Enum [
    "new_registration", "new_booking", "advance_payment",
    "booking_cancelled", "booking_confirmed", "payment_confirmed",
    "appointment_reminder", "booking_rejected"
  ],
  title: String,
  message: String,
  relatedId: ObjectId,
  relatedModel: "User" | "Appointment" | "Payment",
  isRead: Boolean,
  createdAt, updatedAt
}
```

---

## AdminSettings

Single document (singleton pattern):

```javascript
{
  upiId: String,
  qrCode: String,              // uploaded filename
  paymentInstructions: String,
  businessName: String,
  businessPhone: String,
  businessEmail: String,
  reminderHoursBefore: Number, // default 24
  createdAt, updatedAt
}
```

---

## Relationships

```
User (customer) ──1:N──▶ Appointment ──1:N──▶ Payment
User (admin)    ──1:1──▶ AdminSettings
Service         ──N:M──▶ Appointment (embedded in services array)
User            ──1:N──▶ Notification
```
