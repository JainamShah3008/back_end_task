# 📦 Backend Task – Node.js + Express + MongoDB

A production-ready backend project built using **Node.js**, **Express.js**, **MongoDB (Mongoose)**, **JWT authentication**, **Multer uploads**, **Logging**, and **Input validations (Joi)**.

This project contains:

- User Signup
- User Login
- Create Post (with image upload)
- Get Posts (with search, filters & pagination)

---

## 🚀 Tech Stack

| Layer           | Technology                 |
| --------------- | -------------------------- |
| Backend         | Node.js (Express.js)       |
| Database        | MongoDB (Mongoose)         |
| Authentication  | JSON Web Token (JWT)       |
| File Upload     | Multer                     |
| Data Validation | Joi                        |
| Logging         | Morgan + Custom DB Logging |
| Security        | Helmet, CORS               |
| Environment     | dotenv                     |

---

## 📂 Folder Structure

project-root/
│── index.js
│── package.json
│── .env
│── .gitignore
│── uploads/
│── controllers/
│── middlewares/
│── models/
│── routes/
│── utils/
│── validations/


## 🔐 Environment Variables (.env)

```env
HOST_URL=http://localhost:3000
PORT=3000

MONGO_URL=mongodb://localhost:27017/back_end_task

JWT_SECRET=your_jwt_secret_key

DEVMODE=local

