# 📘 **CleanPro Admin Panel – Backend (Node.js + Express + MySQL)**

This backend powers the CleanPro Admin Portal, providing secure authentication, user management, and dashboard data through REST APIs.
It follows an MVC structure and uses JWT authentication to secure all admin operations.

---

# 🚀 **Overview**

The backend handles:

- ✔ JWT-based Authentication
- ✔ Admin-only access
- ✔ Users Module (CRUD)
- ✔ Dashboard statistics API
- ✔ MySQL database integration
- ✔ Centralized error handling
- ✔ Protected routes using middleware

All frontend requests are validated and processed securely before reaching the database.

---

# 🛠 **Tech Stack**

- **Node.js**
- **Express.js**
- **MySQL**
- **JWT (jsonwebtoken)**
- **dotenv**
- **CORS**
- **MVC Pattern**

---

# 📁 **Backend Folder Structure**

```
backend/
│── config/
│   └── db.js
│── controllers/
│   ├── authController.js
│   └── userController.js
│── middleware/
│   └── authMiddleware.js
│── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
│── server.js
│── .env
└── package.json
```

---

# 🔧 **1. Database Setup (MySQL)**

Create database:

```sql
CREATE DATABASE cleanpro;
```

Users Table (sample):

```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50),
  profile TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Supported roles:

```
admin, user, partner, cleaner
```

---

# 🔐 **2. Environment Variables**

Create a `.env` file in the backend folder:

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=****
DB_NAME=cleanpro
DB_PORT=3306

JWT_SECRET=YourSecretKeyHere
JWT_EXPIRES_IN=7d
```

---

# 🧠 **3. Authentication (JWT-Based)**

Admin authentication is based on email-only login.

### **Login Flow**

1️⃣ Frontend sends `{ email }` to `/api/auth/login`
2️⃣ Backend checks:

- Email exists
- User role is **admin** only
  3️⃣ Backend generates JWT token:

```js
jwt.sign({ user_id, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
```

4️⃣ Returns token + user details to frontend
5️⃣ Token is required for all protected APIs

---

# 🛡 **4. JWT Middleware (Route Protection)**

Every protected route goes through:

`backend/middleware/authMiddleware.js`

It:

- Extracts token
- Verifies token
- Attaches decoded user info to `req.user`
- Rejects unauthorized requests

Only admin users can access resources.

---

# 🎯 **5. Routes Overview**

## **AUTH Routes**

| Method | Route             | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/api/auth/login` | Login using email (Admin only) |

---

## **USERS Routes**

| Method | Route                  | Description            |
| ------ | ---------------------- | ---------------------- |
| GET    | `/api/users`           | Get all users          |
| POST   | `/api/users`           | Create new user        |
| PUT    | `/api/users`           | Update user by payload |
| DELETE | `/api/users`           | Delete user by payload |
| GET    | `/api/users/stats/all` | Dashboard stats        |

---

# 🧩 **6. Controllers**

## 🔹 **authController.js**

Handles:

- Validate email
- Verify admin role
- Generate JWT token
- Return user object

---

## 🔹 **userController.js**

Responsible for:

- Create user
- List all users
- Update user
- Delete user
- Return dashboard stats

Uses parameterized queries to prevent SQL injection.

---

# ⚙️ **7. Server Entry Point**

`server.js` handles:

- Express initialization
- CORS setup
- JSON middleware
- Route mounting
- DB connection test
- Starting the server

Sample output:

```
Server running at port 5000
MySQL Connected
```

---

# 🧪 **8. Testing with Postman**

Exported Postman collection contains:

- Auth login
- User CRUD
- Stats API

Add token under Authorization → Bearer Token.

---

# 🚀 **9. How to Run Backend**

### Install dependencies:

```
cd backend
npm install
```

### Start server:

```
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

# 🏁 **10. Features Completed**

- ✔ JWT Authentication
- ✔ Admin-only access
- ✔ MySQL integration
- ✔ Modular MVC structure
- ✔ Users CRUD
- ✔ Dashboard stats API
- ✔ API validation
- ✔ Postman collection

---
"# CleanPro-Admin-backend" 
