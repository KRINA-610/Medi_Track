import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get(`/appointments/patient/${user.id}`);
                setAppointments(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchAppointments();
    }, [user]);

    const statusStyles = {
        Completed: "bg-[#e1f5ee] text-[#0f6e56]",
        Cancelled: "bg-red-50 text-red-600",
        Scheduled: "bg-blue-50 text-blue-600",
    };

    const statusDot = {
        Completed: "bg-[#0f6e56]",
        Cancelled: "bg-red-500",
        Scheduled: "bg-blue-500",
    };

    const upcoming = appointments.filter(
        (a) => a.status !== "Cancelled" && a.status !== "Completed"
    ).length;

    return (
        <div className="min-h-screen bg-[#f5f1e8] p-6">
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp .45s ease both; }
            `}</style>

            <button
                onClick={() => navigate("/patient-dashboard")}
                className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#0d3b36] hover:underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to dashboard
            </button>

            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#151310]">My Appointments</h2>
                <p className="text-sm text-[#6b6558] mt-0.5">
                    {upcoming} upcoming · {appointments.length} total
                </p>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-[#6b6558]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                    Loading appointments...
                </div>
            ) : appointments.length === 0 ? (
                <div className="fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dfd2] bg-white/60 py-16 text-center">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e1f5ee]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 text-[#0d3b36]">
                            <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
                        </svg>
                    </span>
                    <p className="text-base font-medium text-[#151310]">No appointments scheduled</p>
                    <p className="mt-1 text-sm text-[#6b6558]">
                        Your doctor's bookings will show up here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((a, i) => {
                        const status = a.status || "Scheduled";
                        const name = `Dr. ${a.doctorId?.firstName || ""} ${a.doctorId?.lastName || ""}`.trim();
                        const initials = `${a.doctorId?.firstName?.[0] || ""}${a.doctorId?.lastName?.[0] || ""}`;

                        return (
                            <div
                                key={a._id}
                                className="fade-up group rounded-2xl border border-[#e4dfd2] bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-0.5 p-5"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d3b36] text-white text-sm font-bold">
                                            {initials || "Dr"}
                                        </span>
                                        <h3 className="font-semibold text-base text-[#151310] truncate">
                                            {name}
                                        </h3>
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[status] || statusStyles.Scheduled
                                            }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status] || statusDot.Scheduled}`} />
                                        {status}
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#faf8f3] border border-[#f0ece1] px-3.5 py-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-[#0d3b36] shrink-0">
                                        <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
                                    </svg>
                                    <span className="text-sm text-[#151310] font-medium">
                                        {new Date(a.appointmentDate).toLocaleDateString()} at {a.appointmentTime}
                                    </span>
                                </div>

                                <p className="text-[#6b6558] text-sm mt-3">
                                    <span className="text-[#a8a191]">Reason: </span>
                                    {a.reason}
                                </p>

                                {a.notes && (
                                    <p className="text-[#a8a191] text-xs mt-2 border-t border-[#f0ece1] pt-2">
                                        Notes: {a.notes}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;
