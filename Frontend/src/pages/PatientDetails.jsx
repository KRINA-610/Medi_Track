import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const PatientDetails = () => {
    const { id } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [patientInfo, setPatientInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMedicines = async () => {
        try {
            const res = await api.get(`/mediRead/${id}`);
            setMedicines(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientInfo = async () => {
        try {
            const res = await api.get(`/edituserdet/${id}`);
            setPatientInfo(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchMedicines();
        fetchPatientInfo();
    }, [id]);

    const handleDelete = async (medId) => {
        if (!window.confirm("Delete this medicine?")) return;
        try {
            await api.delete(`/delete/${medId}`);
            fetchMedicines();
        } catch (err) {
            console.log(err);
        }
    };

    const statusStyles = {
        Taken: "bg-[#e1f5ee] text-[#0f6e56]",
        Missed: "bg-red-50 text-red-600",
        Pending: "bg-amber-50 text-amber-700",
    };

    const statusDot = {
        Taken: "bg-[#0f6e56]",
        Missed: "bg-red-500",
        Pending: "bg-amber-500",
    };

    // Rotating soft accent colors so the medicine grid doesn't feel monotone
    const accents = ["#0d3b36", "#c98a3a", "#5b7fb5", "#a8577a"];

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
                onClick={() => navigate("/doctor-dashboard")}
                className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#0d3b36] hover:underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to dashboard
            </button>

            {/* ---------- Patient info card ---------- */}
            {patientInfo && (
                <div className="fade-up relative overflow-hidden rounded-3xl border border-[#e4dfd2] bg-white shadow-sm mb-8">
                    {/* Top accent strip */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#0d3b36] via-[#0f6e56] to-[#9fd8c6]" />

                    <div className="p-6 sm:p-7">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0d3b36] text-white font-bold text-xl shadow-md">
                                    {patientInfo.firstName?.[0]}
                                    {patientInfo.lastName?.[0]}
                                </span>
                                <div>
                                    <h3 className="font-extrabold text-2xl text-[#151310] leading-tight">
                                        {patientInfo.firstName} {patientInfo.lastName}
                                    </h3>
                                    <p className="text-sm text-[#a8a191] mt-0.5">Patient profile</p>
                                </div>
                            </div>

                            {patientInfo.gender && (
                                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-[#faf8f3] border border-[#e4dfd2] px-3.5 py-1.5 text-xs font-semibold text-[#0d3b36]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                                        <circle cx="12" cy="8" r="4" /><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                                    </svg>
                                    {patientInfo.gender}
                                </span>
                            )}
                        </div>

                        {/* Info chips */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="flex items-center gap-3 rounded-xl bg-[#faf8f3] border border-[#f0ece1] px-4 py-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e1f5ee] text-[#0d3b36]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                                    </svg>
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] uppercase tracking-wide text-[#a8a191] font-medium">Email</p>
                                    <p className="text-sm text-[#151310] truncate">{patientInfo.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-[#faf8f3] border border-[#f0ece1] px-4 py-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e1f5ee] text-[#0d3b36]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                                    </svg>
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] uppercase tracking-wide text-[#a8a191] font-medium">Age</p>
                                    <p className="text-sm text-[#151310]">{patientInfo.age || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl bg-[#faf8f3] border border-[#f0ece1] px-4 py-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e1f5ee] text-[#0d3b36]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.8 2.1z" />
                                    </svg>
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] uppercase tracking-wide text-[#a8a191] font-medium">Phone</p>
                                    <p className="text-sm text-[#151310] truncate">{patientInfo.phone || "N/A"}</p>
                                </div>
                            </div>

                            {patientInfo.address && (
                                <div className="flex items-center gap-3 rounded-xl bg-[#faf8f3] border border-[#f0ece1] px-4 py-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e1f5ee] text-[#0d3b36]">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                            <path d="M12 21s-7-5.7-7-11a7 7 0 0 1 14 0c0 5.3-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
                                        </svg>
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-[11px] uppercase tracking-wide text-[#a8a191] font-medium">Location</p>
                                        <p className="text-sm text-[#151310] truncate">{patientInfo.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- Header row ---------- */}
            <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
                <h2 className="text-xl font-extrabold text-[#151310]">Patient Medicines</h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => navigate(`/edit-patient/${id}`)}
                        className="bg-white border border-[#e4dfd2] text-[#0d3b36] px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-[#faf8f3] active:scale-95"
                    >
                        Edit Patient
                    </button>
                    <button
                        onClick={() => navigate(`/reminder-history/${id}`)}
                        className="bg-white border border-[#e4dfd2] text-[#0f6e56] px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-[#faf8f3] active:scale-95"
                    >
                        History
                    </button>
                    <button
                        onClick={() => navigate(`/add-medicine/${id}`)}
                        className="bg-[#0d3b36] text-white px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-[#0a2e2a] active:scale-95"
                    >
                        + Add Medicine
                    </button>
                </div>
            </div>

            {/* ---------- Medicine cards ---------- */}
            {loading ? (
                <div className="flex items-center gap-2 text-sm text-[#6b6558]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                    Loading medicines...
                </div>
            ) : medicines.length === 0 ? (
                <div className="fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dfd2] bg-white/60 py-16 text-center">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e1f5ee]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 text-[#0d3b36]">
                            <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" />
                        </svg>
                    </span>
                    <p className="text-base font-medium text-[#151310]">No medicines assigned yet</p>
                    <p className="mt-1 text-sm text-[#6b6558]">
                        Add a prescription to start tracking this patient's care.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicines.map((med, i) => {
                        const accent = accents[i % accents.length];
                        return (
                            <div
                                key={med._id}
                                className="fade-up group relative overflow-hidden rounded-2xl border border-[#e4dfd2] bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                {/* Left accent bar */}
                                <span
                                    className="absolute left-0 top-0 h-full w-1.5"
                                    style={{ backgroundColor: accent }}
                                />

                                <div className="pl-6 pr-5 py-5">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold"
                                                style={{ backgroundColor: accent }}
                                            >
                                                {med.medicineName?.[0]?.toUpperCase()}
                                            </span>
                                            <h3 className="font-semibold text-base text-[#151310] truncate">
                                                {med.medicineName}
                                            </h3>
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[med.reminderStatus] || statusStyles.Pending
                                                }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[med.reminderStatus] || statusDot.Pending}`} />
                                            {med.reminderStatus}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                                        <p className="text-[#6b6558]">
                                            <span className="text-[#a8a191]">Dosage</span><br />
                                            <span className="text-[#151310] font-medium">{med.dosage}</span>
                                        </p>
                                        <p className="text-[#6b6558]">
                                            <span className="text-[#a8a191]">Time</span><br />
                                            <span className="text-[#151310] font-medium">{med.medicineTime}</span>
                                        </p>
                                        <p className="text-[#6b6558]">
                                            <span className="text-[#a8a191]">Frequency</span><br />
                                            <span className="text-[#151310] font-medium">{med.frequency}</span>
                                        </p>
                                        <p className="text-[#6b6558]">
                                            <span className="text-[#a8a191]">Disease</span><br />
                                            <span className="text-[#151310] font-medium">{med.disease}</span>
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-[#f0ece1] pt-3">
                                        <span className="inline-flex items-center gap-1.5 text-xs text-[#a8a191]">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                                                <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
                                            </svg>
                                            {new Date(med.startDate).toLocaleDateString()} – {new Date(med.endDate).toLocaleDateString()}
                                        </span>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/edit-medicine/${med._id}`)}
                                                className="text-[#0d3b36] text-sm font-medium hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(med._id)}
                                                className="text-red-600 text-sm font-medium hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PatientDetails;
