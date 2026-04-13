# 💸 Expense Tracker (Full Stack)

A full-stack Expense Tracker web application built using **React, Flask, and MySQL**, allowing users to manage expenses, view analytics, and securely authenticate using JWT.

---

## 🚀 Features

* 🔐 User Authentication (Register & Login)
* 🔑 JWT-based Authorization
* 🛡️ Protected Routes (Frontend + Backend)
* 💰 Add, View, Update, Delete Expenses (CRUD)
* 📊 Monthly Expense Summary
* 📂 Category-wise Expense Breakdown
* ⚡ Real-time data updates
* 🌐 REST API integration

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Fetch API

### Backend

* Flask
* Flask-CORS
* JWT (PyJWT)
* Bcrypt

### Database

* MySQL

---

## 📁 Project Structure

```
expense-tracker/
│
├── expense-tracker-frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── expense-tracker-backend/
│   ├── app.py
│   ├── auth.py
│   ├── expenses.py
│   ├── summary.py
│   ├── db.py
│   └── utils.py
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 1. Clone Repository

```
git clone https://github.com/UTKARSHPDUBEY/expense-tracker.git
cd expense-tracker
```

---

### 🔹 2. Backend Setup

```
cd expense-tracker-backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Create `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
SECRET_KEY=your_secret_key
```

Run backend:

```
python app.py
```

---

### 🔹 3. Frontend Setup

```
cd expense-tracker-frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Auth

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/me`

### Expenses

* `GET /expenses`
* `POST /expenses`
* `PUT /expenses/:id`
* `DELETE /expenses/:id`

### Summary

* `GET /expenses/summary/monthly?month=YYYY-MM`
* `GET /expenses/summary/category?month=YYYY-MM`

---

## 🔐 Authentication Flow

1. User logs in → receives JWT token
2. Token stored in localStorage
3. Token sent in headers for protected routes
4. Backend verifies token before granting access

---

## 📸 Screenshots

*(Add screenshots here later)*

---

## 🧠 Learnings

* Implemented full-stack architecture
* Understood JWT authentication flow
* Handled CORS issues in real-world scenario
* Built REST APIs with Flask
* Managed relational database with MySQL

---

## 🚀 Future Improvements

* ✏️ Edit expense UI improvements
* 📊 Charts using Chart.js
* 🎨 Better UI with Tailwind CSS
* 🔓 Logout functionality
* 📱 Responsive design

---

## 👨‍💻 Author

**Utkarsh Dubey**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
