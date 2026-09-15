# Web Development Admin Dashboard (NexusAdmin)

A complete, modern, responsive full-stack Admin Dashboard built with **React + Vite**, **Node.js + Express**, and an **SQLite** database.

> **Project**: Web Development Problem Statement  
> **Deadline**: 20 September 2026

---

## 🌟 Key Features

1. **Authentication**
   - Clean glassmorphic admin login portal with input validation.
   - Pre-seeded Demo Administrator account:
     - **Email**: `admin@example.com`
     - **Password**: `admin123`
   - Password security: `bcryptjs` hashing.
   - JWT authentication (`jsonwebtoken`) with protected routes and auto-redirection.
   - One-click demo login credentials auto-fill helper.
   - Full sign-out / logout functionality.

2. **User Management Dashboard**
   - Interactive user data directory table displaying ID, Full Name, Email, Role, Status, and Date Created.
   - Dynamic live search bar filtering users by name or email.
   - Metric summary cards (Total Users, Active Accounts, Admins & Managers, Pending Approvals).
   - Add User modal form with field validation (Full Name, Email, Role, Status, Phone, Address, Bio).
   - Delete User action with confirmation modal dialog.
   - Theme toggle (Dark Mode / Light Mode).

3. **User Profile Details**
   - Slide-over side panel / drawer displaying complete user profile metadata (phone, physical address, biography notes, account creation date, role, and active status badge).

4. **SQLite Database & Auto-Seeding**
   - Embedded persistent SQLite database (`server/database.sqlite`).
   - Automatically seeds the demo administrator and 12 realistic sample user records on initial server boot.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+ or v11+)

### 1. Clone & Set Up Backend

```bash
cd server
npm install
npm run dev
```

The Express server will start on **`http://localhost:5000`** and automatically initialize & seed the SQLite database.

### 2. Set Up Frontend

Open a second terminal window:

```bash
cd client
npm install
npm run dev
```

The React Vite frontend will start on **`http://localhost:3000`** with API calls proxied to port `5000`.

---

## 📡 API Endpoints Documentation

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description | Payload |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate administrator | `{ "email": "admin@example.com", "password": "admin123" }` |
| `GET` | `/api/auth/me` | Protected | Verify JWT session | Header: `Authorization: Bearer <token>` |

### User Management (`/api/users`) — All Protected

| Method | Endpoint | Description | Query / Body |
|---|---|---|---|
| `GET` | `/api/users` | List users | Optional search: `?search=sarah` |
| `GET` | `/api/users/:id` | Get single user by ID | Path param: `:id` |
| `POST` | `/api/users` | Create user record | `{ "full_name": "...", "email": "...", "role": "...", "status": "...", "phone": "...", "address": "...", "bio": "..." }` |
| `PUT` | `/api/users/:id` | Update user record | Partial or full user payload |
| `DELETE` | `/api/users/:id` | Delete user record | Path param: `:id` |

---

## 🌐 Production Deployment Guide

### Option 1: Deploy to Render (Recommended Single Web Service)

1. Build client static files into backend:
   ```bash
   cd client
   npm run build
   ```
2. Set Environment Variables in Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `your_random_secure_jwt_secret_key`
3. Configure Build & Start Commands:
   - **Build Command**: `cd server && npm install && cd ../client && npm install && npm run build`
   - **Start Command**: `node server/src/index.js`

### Option 2: Deploy to Railway

1. Push repository to GitHub.
2. Link project repository in Railway dashboard.
3. Add environment variable `JWT_SECRET` in Railway project settings.
4. Set root directory or run command: `node server/src/index.js`.

---

## 🧪 Testing the Complete Flow

1. Open `http://localhost:3000` in browser.
2. Click **"Auto-Fill"** or enter `admin@example.com` / `admin123`, then click **"Sign In"**.
3. Confirm login success and dashboard load with metric stat cards and sample user records.
4. Type `elena` into top search bar — observe instantaneous live table filtering.
5. Click **"View"** on any user to inspect the slide-over detail drawer.
6. Click **"Add New User"**, fill in user details, click **"Create User"** — verify user appears in table and toast alert displays.
7. Click **"Delete"** on a user, confirm in modal — verify user removal.
8. Click **"Logout"** — verify session token is cleared and user is redirected to `/login`.
