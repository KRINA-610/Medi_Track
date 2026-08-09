import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorLayout from "./components/DoctorLayout";
import PatientLayout from "./components/PatientLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";
import PatientDetails from "./pages/PatientDetails";
import AddMedicine from "./pages/AddMedicine";
import EditMedicine from "./pages/EditMedicine";
import Appointments from "./pages/Appointments";
import PatientAppointments from "./pages/PatientAppointments";
import ReminderHistory from "./pages/ReminderHistory";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			<Route element={<DoctorLayout />}>
				<Route path="/doctor-dashboard" element={<DoctorDashboard />} />
				<Route path="/add-patient" element={<AddPatient />} />
				<Route path="/edit-patient/:id" element={<EditPatient />} />
				<Route path="/patient/:id" element={<PatientDetails />} />
				<Route path="/add-medicine/:patientId" element={<AddMedicine />} />
				<Route path="/edit-medicine/:id" element={<EditMedicine />} />
				<Route path="/appointments" element={<Appointments />} />
				<Route path="/reminder-history/:id" element={<ReminderHistory />} />
			</Route>

			<Route element={<PatientLayout />}>
				<Route path="/patient-dashboard" element={<PatientDashboard />} />
				<Route path="/patient-appointments" element={<PatientAppointments />} />
				<Route path="/reminder-history" element={<ReminderHistory />} />
			</Route>
		</Routes>
	);
}

export default App;