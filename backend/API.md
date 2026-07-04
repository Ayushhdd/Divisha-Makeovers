# REST API Reference — Divisha Makeovers

Base URL: `https://your-api.onrender.com/api`

All protected routes require header: `Authorization: Bearer <token>`

---

## Auth `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Customer registration |
| POST | `/login` | Public | Login (admin or customer) |
| POST | `/forgot-password` | Public | Send OTP to email |
| POST | `/reset-password` | Public | Reset password with OTP |
| GET | `/profile` | User | Get profile |
| PUT | `/profile` | User | Update profile |
| PUT | `/change-password` | User | Change password |

### Register Body
```json
{
  "fullName": "Jane Doe",
  "age": 25,
  "email": "jane@email.com",
  "mobile": "9876543210",
  "password": "secret123",
  "address": {
    "line1": "123 Main St",
    "line2": "Apt 4",
    "district": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001"
  }
}
```

### Login Body
```json
{
  "email": "jane@email.com",
  "password": "secret123",
  "rememberMe": true
}
```

---

## Services `/api/services`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List active services (`?search=&category=`) |
| GET | `/all` | Admin | List all services |
| GET | `/:id` | Public | Get service by ID |
| POST | `/` | Admin | Create service |
| PUT | `/:id` | Admin | Update service |
| DELETE | `/:id` | Admin | Deactivate service |

### Service Body
```json
{
  "name": "Bridal Makeup",
  "description": "Full bridal look",
  "category": "Bridal Makeup",
  "price": 15000,
  "duration": 180
}
```

---

## Appointments `/api/appointments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Customer | Create booking (multipart) |
| GET | `/my?type=upcoming\|past` | Customer | My appointments |
| GET | `/admin/all` | Admin | All appointments (filters) |
| GET | `/calendar?month=&year=` | Admin | Monthly calendar view |
| GET | `/schedule?date=` | Admin | Daily schedule |
| GET | `/:id` | User | Get appointment |
| GET | `/:id/receipt` | User | Booking receipt |
| PUT | `/:id/status` | Admin | Update status |
| PUT | `/:id/cancel` | User | Cancel booking |

### Admin Filters
`?date=2026-06-15&customer=<id>&status=confirmed&service=<id>`

### Create Booking (multipart/form-data)
```
serviceIds: JSON string array of IDs
customServices: JSON string array
customServiceRequest: string
appointmentDate: ISO date string
appointmentTime: "14:30"
venue: string
notes: string
advanceAmount: number
paymentOption: "pay_now" | "pay_later"
paymentScreenshot: file (optional)
```

---

## Payments `/api/payments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/my` | Customer | Payment history |
| GET | `/all` | Admin | All payments |
| POST | `/` | Customer | Add payment (multipart) |
| PUT | `/:id/verify` | Admin | Verify/reject payment |

---

## Admin `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | Admin | Dashboard statistics |
| GET | `/customers` | Admin | List customers |
| GET | `/customers/:id` | Admin | Customer history |
| GET | `/settings` | Admin | Get settings |
| PUT | `/settings` | Admin | Update settings (multipart) |
| GET | `/settings/public` | Public | Public payment info |
| GET | `/notifications` | User | Get notifications |
| GET | `/notifications/unread-count` | User | Unread count |
| PUT | `/notifications/:id/read` | User | Mark read |
| PUT | `/notifications/read-all` | User | Mark all read |

---

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API status check |

---

## Response Format

**Success:** JSON object or array

**Error:**
```json
{
  "message": "Error description"
}
```

**Status Codes:** 200, 201, 400, 401, 403, 404, 500
