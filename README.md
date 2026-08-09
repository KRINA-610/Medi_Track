# 💊 MediTrack

**MediTrack** is a full-stack medicine tracking and reminder system that helps doctors and patients manage medicines, appointments, and medication reminders.

## 🚀 Features

* 👨‍⚕️ Doctor & Patient authentication
* 👥 Patient management
* 💊 Medicine management
* 🔔 Medicine reminders & reminder history
* 📅 Appointment management
* 🤖 AI-powered medicine information using Google Gemini
* 🔐 JWT authentication & password encryption
* 📊 Separate Doctor and Patient dashboards

## 🛠️ Tech Stack

**Frontend**

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

**AI**

* Google Gemini API

## 📁 Project Structure

```text
MediTrack/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── Middleware/
│   ├── db.js
│   └── index.js
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

Frontend:

```text
http://localhost:5173
```

## 🔑 Environment Variables

Create a `.env` file in the backend:

```env
PORT=5000
JWTPRIVATEKEY=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Never upload `.env` or API keys to GitHub.**

## 🤖 AI Medicine Assistant

MediTrack uses Google Gemini to provide general information about medicines, including their purpose, usage, and precautions.

> ⚠️ AI-generated information is for educational purposes only and is not a substitute for professional medical advice.

## 🔮 Future Scope

* Push notifications
* Email/SMS reminders
* Prescription uploads
* Admin dashboard
* Mobile application
* Cloud deployment

## 👩‍💻 Author

**Krina Patel**

Computer Engineering Student

---

⭐ If you find this project useful, consider giving it a star!
