import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        patientId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        notes: "",
    });

    const fetchAppointments = async () => {
        try {
            const res = await api.get(`/appointments/doctor/${user.id}`);
            setAppointments(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get(`/users/patients/${user.id}`);
            setPatients(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAppointments();
            fetchPatients();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/appointments", {
                ...formData,
                doctorId: user.id,
            });
            setShowForm(false);
            setFormData({
                patientId: "",
                appointmentDate: "",
                appointmentTime: "",
                reason: "",
                notes: "",
            });
            fetchAppointments();
        } catch (err) {
            console.log(err);
        }
    };

    const statusStyles = {
        Completed: "bg-[#e1f5ee] text-[#0f6e56]",
        Cancelled: "bg-red-50 text-red-600",
        Scheduled: "bg-blue-50 text-blue-600",
    };

    const upcoming = appointments.filter((a) => a.status !== "Cancelled" && a.status !== "Completed").length;

    return (
        <div>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(14px) scale(.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes overlayIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .fade-up { animation: fadeUp .45s ease both; }
                .modal-in { animation: modalIn .3s ease both; }
                .overlay-in { animation: overlayIn .2s ease both; }
                .float-slow { animation: float 4.5s ease-in-out infinite; }
                .float-slower { animation: float 5.5s ease-in-out infinite; animation-delay: .4s; }
            `}</style>

            <button
                onClick={() => navigate("/doctor-dashboard")}
                className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#0d3b36] hover:underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to dashboard
            </button>

            <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
                <div>
                    <h2 className="text-xl font-extrabold text-[#151310]">Appointments</h2>
                    <p className="text-xs text-[#6b6558] mt-0.5">
                        {upcoming} upcoming · {appointments.length} total
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#0d3b36] text-white px-4 py-2 rounded-full text-sm font-medium transition hover:bg-[#0a2e2a] active:scale-95"
                >
                    + New Appointment
                </button>
            </div>

            {/* Booking form as a centered modal, so the page never gets pushed down */}
            {showForm && (
                <div className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="modal-in relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white border border-[#e4dfd2] p-6 rounded-2xl shadow-xl"
                    >
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full text-[#6b6558] hover:bg-[#faf8f3]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <p className="text-[11px] font-bold tracking-[0.15em] text-[#0d3b36]">
                            SCHEDULE
                        </p>
                        <p className="text-lg font-extrabold text-[#151310] mb-4">Book a new appointment</p>

                        <label className="text-xs font-medium text-[#6b6558]">Patient</label>
                        <select
                            name="patientId"
                            value={formData.patientId}
                            onChange={handleChange}
                            required
                            className="mt-1 mb-3 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm text-[#151310] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                        >
                            <option value="">Select patient</option>
                            {patients.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.firstName} {p.lastName}
                                </option>
                            ))}
                        </select>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="text-xs font-medium text-[#6b6558]">Date</label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#6b6558]">Time</label>
                                <input
                                    type="time"
                                    name="appointmentTime"
                                    value={formData.appointmentTime}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                                />
                            </div>
                        </div>

                        <label className="text-xs font-medium text-[#6b6558]">Reason</label>
                        <input
                            type="text"
                            name="reason"
                            placeholder="e.g. Follow-up checkup"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            className="mt-1 mb-3 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                        />

                        <label className="text-xs font-medium text-[#6b6558]">Notes (optional)</label>
                        <textarea
                            name="notes"
                            placeholder="Anything the doctor should know beforehand"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 mb-4 w-full rounded-2xl border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#0d3b36] text-white py-2.5 rounded-full text-sm font-semibold transition hover:bg-[#0a2e2a] active:scale-95"
                        >
                            Book appointment
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-[#6b6558]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                    Loading appointments...
                </div>
            ) : appointments.length === 0 ? (
                <div className="fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dfd2] bg-white/60 py-16 text-center">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e1f5ee]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 text-[#0d3b36]">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M16 3v4M8 3v4M3 10h18" />
                        </svg>
                    </span>
                    <p className="text-sm font-medium text-[#151310]">No appointments yet</p>
                    <p className="mt-1 text-xs text-[#6b6558]">
                        Book your first appointment to see it here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((a, i) => (
                        <div
                            key={a._id}
                            className="fade-up rounded-2xl border border-[#e4dfd2] bg-white p-5 shadow-sm transition hover:shadow-md"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-[#151310]">
                                    {a.patientId?.firstName} {a.patientId?.lastName}
                                </h3>
                                <span
                                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[a.status] || statusStyles.Scheduled
                                        }`}
                                >
                                    {a.status}
                                </span>
                            </div>
                            <p className="text-[#6b6558] text-sm mt-2">
                                {new Date(a.appointmentDate).toLocaleDateString()} at {a.appointmentTime}
                            </p>
                            <p className="text-[#6b6558] text-sm">Reason: {a.reason}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Illustrated banner — fills the empty space below the appointment list */}
            {!loading && (
                <div className="fade-up relative mt-10 overflow-hidden rounded-2xl bg-[#0d3b36] px-8 py-10 text-white">
                    <div className="relative z-10 grid md:grid-cols-5 items-center gap-8">
                        <div className="md:col-span-3">
                            <p className="text-xs font-bold tracking-[0.15em] text-[#9fd8c6]">
                                PLAN AHEAD
                            </p>
                            <h3 className="mt-2 text-2xl font-extrabold leading-tight">
                                Keep every visit organised.
                            </h3>
                            <p className="mt-2 text-sm text-white/70 max-w-md">
                                Schedule follow-ups and checkups in seconds — your patients
                                get a reminder before each one.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-[#9fd8c6] text-[#0d3b36] px-4 py-2.5 rounded-full text-sm font-semibold transition hover:bg-white active:scale-95"
                                >
                                    + New appointment
                                </button>
                                <button
                                    onClick={() => navigate("/doctor-dashboard")}
                                    className="bg-white/10 border border-white/20 text-white px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-white/20 active:scale-95"
                                >
                                    Back to patients
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2 relative flex items-center justify-center">
                            <svg viewBox="0 0 220 160" className="w-full max-w-[200px] relative z-10" xmlns="http://www.w3.org/2000/svg">
                                <rect x="45" y="20" width="130" height="120" rx="16" fill="#ffffff" fillOpacity="0.08" />
                                <rect x="63" y="38" width="94" height="16" rx="6" fill="#9fd8c6" />
                                <rect x="63" y="66" width="70" height="8" rx="4" fill="#ffffff" fillOpacity="0.5" />
                                <rect x="63" y="80" width="50" height="8" rx="4" fill="#ffffff" fillOpacity="0.3" />
                                <rect x="63" y="102" width="44" height="20" rx="10" fill="#ffffff" fillOpacity="0.15" />
                                <rect x="113" y="102" width="44" height="20" rx="10" fill="#9fd8c6" />
                            </svg>

                            <span className="float-slow absolute top-0 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#9fd8c6] text-[#0d3b36] shadow-lg z-20">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                                    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
                                </svg>
                            </span>
                            <span className="float-slower absolute bottom-2 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white shadow-lg z-20">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                                    <circle cx="12" cy="13" r="7" /><path d="M12 9v4l3 2M9 3h6" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#9fd8c6]/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
                </div>
            )}
        </div>
    );
};

export default Appointments;
