import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ReminderHistory = () => {
    const { id } = useParams(); // patientId (optional, doctor view)
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const patientId = id || user?.id;

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const res = await api.get(`/mediRead/${patientId}`);
                setMedicines(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        if (patientId) fetchMedicines();
    }, [patientId]);

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

    const takenCount = medicines.filter((m) => m.reminderStatus === "Taken").length;
    const missedCount = medicines.filter((m) => m.reminderStatus === "Missed").length;
    const pendingCount = medicines.length - takenCount - missedCount;

    return (
        <div className="bg-[#f5f1e8] p-4 sm:p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[#0d3b36] hover:underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                Back
            </button>

            <div className="max-w-5xl mx-auto rounded-3xl border border-[#e4dfd2] bg-white shadow-sm overflow-hidden flex flex-col lg:flex-row">
                {/* Decorative side panel — hidden on small screens to keep things compact */}
                <div className="hidden lg:flex lg:w-[30%] relative overflow-hidden bg-[#0d3b36] p-6 flex-col justify-between text-white">
                    <div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-[#9fd8c6]">
                                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                            </svg>
                        </span>
                        <h3 className="text-lg font-extrabold leading-snug">
                            A clear record of every dose.
                        </h3>
                        <p className="mt-2 text-xs text-white/60 leading-relaxed">
                            Track what's been taken, missed, or is still pending — all in one timeline.
                        </p>
                    </div>

                    <svg viewBox="0 0 160 120" className="w-full max-w-[140px] relative z-10 self-center" xmlns="http://www.w3.org/2000/svg">
                        <rect x="35" y="24" width="90" height="76" rx="12" fill="#ffffff" fillOpacity="0.08" />
                        <circle cx="55" cy="44" r="6" fill="#9fd8c6" />
                        <rect x="68" y="41" width="42" height="6" rx="3" fill="#ffffff" fillOpacity="0.5" />
                        <circle cx="55" cy="64" r="6" fill="#ffffff" fillOpacity="0.35" />
                        <rect x="68" y="61" width="34" height="6" rx="3" fill="#ffffff" fillOpacity="0.35" />
                        <circle cx="55" cy="84" r="6" fill="#9fd8c6" />
                        <rect x="68" y="81" width="38" height="6" rx="3" fill="#ffffff" fillOpacity="0.5" />
                    </svg>

                    <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#9fd8c6]/10 blur-2xl" />
                </div>

                {/* Content panel */}
                <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5 mb-4">
                        <span className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#0d3b36]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-lg font-extrabold text-[#151310]">Reminder History</h2>
                            <p className="text-xs text-[#a8a191]">Every dose logged for this patient</p>
                        </div>
                    </div>

                    {!loading && medicines.length > 0 && (
                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                            <div className="rounded-xl border border-[#e4dfd2] bg-[#faf8f3] py-2.5 text-center">
                                <p className="text-lg font-extrabold text-[#0f6e56]">{takenCount}</p>
                                <p className="text-[11px] text-[#6b6558]">Taken</p>
                            </div>
                            <div className="rounded-xl border border-[#e4dfd2] bg-[#faf8f3] py-2.5 text-center">
                                <p className="text-lg font-extrabold text-red-600">{missedCount}</p>
                                <p className="text-[11px] text-[#6b6558]">Missed</p>
                            </div>
                            <div className="rounded-xl border border-[#e4dfd2] bg-[#faf8f3] py-2.5 text-center">
                                <p className="text-lg font-extrabold text-amber-600">{pendingCount}</p>
                                <p className="text-[11px] text-[#6b6558]">Pending</p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center gap-2 text-sm text-[#6b6558] py-6">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                            Loading history...
                        </div>
                    ) : medicines.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dfd2] bg-[#faf8f3] py-10 text-center">
                            <span className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#e1f5ee]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-[#0d3b36]">
                                    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                                </svg>
                            </span>
                            <p className="text-sm font-medium text-[#151310]">No records found</p>
                            <p className="mt-0.5 text-xs text-[#6b6558]">Reminder history will appear here once tracked.</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-[#e4dfd2] bg-white overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#faf8f3] border-b border-[#f0ece1]">
                                            <th className="p-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#a8a191]">Medicine</th>
                                            <th className="p-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#a8a191]">Time</th>
                                            <th className="p-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#a8a191]">Dosage</th>
                                            <th className="p-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#a8a191]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicines.map((med, i) => (
                                            <tr
                                                key={med._id}
                                                className={`border-b border-[#f0ece1] last:border-0 transition hover:bg-[#faf8f3] ${i % 2 === 1 ? "bg-[#fbfaf6]" : ""}`}
                                            >
                                                <td className="p-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e1f5ee] text-[#0d3b36] text-[11px] font-bold">
                                                            {med.medicineName?.[0]?.toUpperCase()}
                                                        </span>
                                                        <span className="text-sm font-medium text-[#151310]">{med.medicineName}</span>
                                                    </div>
                                                </td>
                                                <td className="p-2.5 text-sm text-[#6b6558]">{med.medicineTime}</td>
                                                <td className="p-2.5 text-sm text-[#6b6558]">{med.dosage}</td>
                                                <td className="p-2.5">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[med.reminderStatus] || statusStyles.Pending
                                                            }`}
                                                    >
                                                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[med.reminderStatus] || statusDot.Pending}`} />
                                                        {med.reminderStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReminderHistory;
