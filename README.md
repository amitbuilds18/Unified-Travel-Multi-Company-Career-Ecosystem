# 🌍 Traval — Unified Travel & Multi-Company Career Ecosystem

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Amadeus GDS](https://img.shields.io/badge/GDS-Amadeus%20Travel-005EB8)](https://developers.amadeus.com)
[![Razorpay](https://img.shields.io/badge/Fintech-Razorpay%20Gateway-0C2340?logo=razorpay&logoColor=white)](https://razorpay.com)

**Traval** is a modern, enterprise-grade full-stack MERN platform uniting **Global Travel Intelligence** (Flight, Hotel & Tour Booking) with an **ATS-Powered Multi-Company Hiring Network** (1-Click Batch Job Applications).

---

## 🌟 Key Features

### 💼 1. Multi-Company 1-Click Batch Apply
* **Multi-Job Selection:** Candidates select multiple jobs across verified companies using checkboxes.
* **Instant Submission:** Broadcasts application and CV concurrently across multiple company ATS pipelines in 1 click.
* **Live Status Tracking:** Real-time application tracking (Pending ➔ Under Review ➔ Shortlisted ➔ Accepted ➔ Rejected).

### 🏢 2. Employer & Recruiter ATS Dashboard
* **Applicant Pipeline:** Review resumes, portfolios, cover letters, and skills for candidates.
* **Status Modulation:** 1-Click status transitions that reflect immediately on candidate dashboards.
* **Job Publishing:** Post new verified roles with custom salaries, experience levels, and skill tags.

### 🛡️ 3. Master SuperAdmin Command Suite
* **Executive Metrics:** Live statistics for verified employers, open jobs, bookings count, and gross revenue.
* **Company Verification:** Approve or revoke official Blue Verified Badges.
* **Content Moderation:** Manage and delete spam/inappropriate job postings.
* **Package Management:** Create, preview, and manage curated holiday destinations.

### ✈️ 4. Global Travel Intelligence & GDS Engine
* **Amadeus Adapter Pattern:** Real airline schedules (Emirates, IndiGo, Air India, Qatar Airways) with zero-latency realistic mock engine fallback.
* **Interactive Packages:** Curated holiday tours (Dubai, Bali, Swiss Alps, Maldives, Thailand) with dynamic hotel upgrades, traveler count math, and day-by-day itineraries.
* **Dual Payment Strategy:** Razorpay UPI/Cards/NetBanking integration + 1-Click Instant Demo confirmation vouchers.

---

## 🏗️ Project Architecture

`	ext
├── backend/
│   ├── config/             # MongoDB dual-fallback & Razorpay config
│   ├── controllers/        # Business logic for auth, jobs, companies, bookings, destinations
│   ├── models/             # Mongoose schemas (User, Company, Job, Application, Booking, Destination)
│   ├── routes/             # RESTful API routing
│   ├── services/           # Amadeus GDS OAuth2 token caching & adapter engine
│   └── server.js           # Express application entrypoint
│
└── client/
    ├── src/
    │   ├── admin/          # SuperAdmin layout, console, destination manager
    │   ├── components/     # Header, Navbar, BatchApplyModal, FlightHotelSearch
    │   ├── pages/          # Jobs, Companies, Destinations, Checkout, MyApplications, Recruiter
    │   └── services/       # Centralized Axios API services
    └── vite.config.js      # Vite build configuration
`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* Node.js (v18+)
* Local MongoDB instance running on mongodb://127.0.0.1:27017 (or MongoDB Atlas connection string)

### 2. Backend Setup
`ash
cd backend
npm install
npm run seed       # Seeds demo companies, jobs, destinations, and admin users
npm start          # Runs on http://localhost:5000
`

### 3. Frontend Client Setup
`ash
cd client
npm install
npm run dev        # Runs on http://localhost:5173
`

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Candidate** | candidate@demo.com | password123 | [/login](http://localhost:5173/login) |
| **Tech Recruiter** | ecruiter.tech@company.com | password123 | [/login](http://localhost:5173/login) ➔ Recruiter Dashboard |
| **Travel Recruiter** | ecruiter.travel@voyage.com | password123 | [/login](http://localhost:5173/login) ➔ Recruiter Dashboard |
| **SuperAdmin** | dmin@platform.com | password123 | [/admin-login](http://localhost:5173/admin-login) ➔ Admin Suite |

---

## 📄 License
This project is open-source and licensed under the ISC License.
