🚀 CleanPro Admin Backend

Node.js + Express + MySQL + JWT Authentication

📌 Overview

This backend powers the CleanPro Admin Panel, including:

User signup & login

Role-based authentication

Dashboard statistics

Manage Users (Admin only)

Manage Cleaners

Manage Partners

The backend is fully token-protected and role restricted.

📂 Project Structure
backend/
│
├── config/
│ └── db.js
│
├── controllers/
│ ├── authController.js
│ └── userController.js
│
├── middleware/
│ ├── authMiddleware.js
│ └── role.js
│
├── routes/
│ ├── authRoutes.js
│ ├── dashboardRoutes.js
│ └── userRoutes.js
│
├── server.js
├── package.json
└── .env

🔐 Authentication Flow
Signup
POST /api/auth/signup

Creates a user with hashed password.

Login
POST /api/auth/login

Returns JWT containing:

{ id, email, role }

Token Validation

authMiddleware verifies JWT for protected routes.

🔒 Role-Based Access

The backend uses:

allowRoles("admin")

Example:

router.get("/", auth, allowRoles("admin"), controllerFn);

📊 Dashboard API
GET /api/dashboard

Returned:

total_users
admin_count
user_count
partner_count
cleaner_count

👥 User Management API
Get all users
GET /api/users

Update user
PUT /api/users

Delete user
DELETE /api/users

All protected with:

auth + allowRoles("admin")

🗄 Database
Users Table
id (PK)
full_name
email (unique)
phone
password (hashed)
role (admin/partner/cleaner/user)
profile_image (null)
created_at

Everything (dashboard, users, partners, cleaners) is derived from this ONE table.

⚙ .env Configuration
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=

▶ Running Locally
npm install
node server.js

🚢 Deployed On

Vercel (Serverless Functions)

Secure, fast, and scalable.

                           ┌──────────────────────────┐
                           │        FRONTEND          │
                           │  React + Axios + JWT     │
                           └────────────┬─────────────┘
                                        │
                                        │ (User submits signup/login)
                                        ▼
                     ┌────────────────────────────────────────┐
                     │        /api/auth/signup (POST)          │
                     │        /api/auth/login  (POST)          │
                     └───────────────────────┬────────────────┘
                                             │
                                             ▼
                               ┌──────────────────────────┐
                               │     AUTH ROUTES          │
                               │  authRoutes.js           │
                               └────────────┬─────────────┘
                                             │
                                             ▼
                               ┌──────────────────────────┐
                               │   AUTH CONTROLLER        │
                               │   signupUser / loginUser │
                               └────────────┬─────────────┘
                                             │
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼

┌────────────────┐ ┌─────────────────────┐ ┌────────────────┐
│ FRONTEND VALID │ │ BACKEND VALIDATION │ │ PASSWORD HASH │
│ Email / Phone │ │ Email exists? │ │ bcrypt.hash │
│ Password rules │ │ Required fields? │ └────────────────┘
└────────────────┘ │ Normalize email │
└─────────────────────┘
│
▼
┌────────────────────────────────┐
│ DATABASE INSERT / SELECT │
│ users table ONLY │
└────────────────────────────────┘
│
▼
┌────────────────────────┐
│ AUTH SUCCESS RESPONSE │
│ Signup or Login OK │
└─────────┬──────────────┘
│
▼
┌────────────────────────────────┐
│ JWT TOKEN GENERATED │
│ Stored in localStorage │
└─────────────┬──────────────────┘
│
▼
┌───────────────────────────────────┐
│ PROTECTED ROUTES VIA JWT │
│ /api/dashboard │
│ /api/users │
└─────────────┬─────────────────────┘
│
▼
┌───────────────────────────────────┐
│ AUTH MIDDLEWARE (Backend) │
│ • Verifies JWT │
│ • Sets req.user │
└─────────────┬─────────────────────┘
│
▼
┌────────────────────────────────────┐
│ ROLE MIDDLEWARE (allowRoles) │
│ Example: allowRoles("admin") │
│ Deny if role mismatch │
└─────────────┬─────────────────────┘
│
▼
┌────────────────────────────────────────────┐
│ USER CONTROLLER (Admin) │
│ /api/users → list/update/delete │
│ /api/dashboard → stats │
└────────────────────────────────────────────┘
│
▼
┌───────────────────────────────────┐
│ FRONTEND UI │
│ Dashboard, Manage Users, etc. │
└───────────────────────────────────┘
