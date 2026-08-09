require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connection = require("./db");
const auth = require("./middleware/auth"); // ✅ Import

// Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const mediRoutes = require("./routes/medicines");
const mediRead = require("./routes/read");
const mediDelete = require("./routes/delete");
const mediEdit = require("./routes/editmedi");
const userEdit = require("./routes/useredit");
const appointmentRoutes = require("./routes/appointments");
const medicineAiRoutes = require("./routes/medicineAi");

// Database
connection();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use("/api/users", userRoutes);   // Register
app.use("/api/auth", authRoutes);   // Login

app.use("/api/medicines", auth, mediRoutes);
app.use("/api/mediRead", auth, mediRead);
app.use("/api/delete", auth, mediDelete);
app.use("/api/editmedi", auth, mediEdit);
app.use("/api/edituserdet", auth, userEdit);
app.use("/api/appointments", auth, appointmentRoutes);
app.use("/api/medicine-ai", auth, medicineAiRoutes);

// Test
app.get("/", (req, res) => {
  res.send("MediTrack Backend is running...");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`MediTrack server listening on port ${port}...`);
});