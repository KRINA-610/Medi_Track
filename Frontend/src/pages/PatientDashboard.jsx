import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { askAboutMedicine } from "../api/gemini";
import { useAuth } from "../context/AuthContext";

const PatientDashboard = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiAnswers, setAiAnswers] = useState({});
    const [aiLoading, setAiLoading] = useState({});
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const alarmRef = useRef(null);
    const notifiedRef = useRef(new Set());

    const fetchMedicines = async () => {
        try {
            const res = await api.get(`/mediRead/${user.id}`);
            setMedicines(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMedicines();
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
                now.getMinutes()
            ).padStart(2, "0")}`;

            medicines.forEach((med) => {
                if (
                    med.medicineTime === currentTime &&
                    med.reminderStatus === "Pending" &&
                    !notifiedRef.current.has(med._id + currentTime)
                ) {
                    notifiedRef.current.add(med._id + currentTime);
                    triggerReminder(med);
                }
            });
        }, 30000);

        return () => clearInterval(interval);
    }, [medicines]);

    const unlockAudio = () => {
        if (alarmRef.current && !audioUnlocked) {
            alarmRef.current
                .play()
                .then(() => {
                    alarmRef.current.pause();
                    alarmRef.current.currentTime = 0;
                    setAudioUnlocked(true);
                })
                .catch(() => { });
        }
    };

    const triggerReminder = (med) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("💊 Medicine Reminder", {
                body: `Time to take ${med.medicineName} (${med.dosage})`,
            });
        }

        if (alarmRef.current) {
            alarmRef.current.play().catch(() => { });
        }

        alert(`⏰ Time to take your medicine: ${med.medicineName}`);
    };

    const markAsTaken = async (medId, status) => {
        try {
            await api.put(`/editmedi/${medId}`, { reminderStatus: status });
            fetchMedicines();
        } catch (err) {
            console.log(err);
        }
    };

    const handleAskAI = async (med) => {
        if (aiAnswers[med._id]) {
            setAiAnswers((prev) => {
                const updated = { ...prev };
                delete updated[med._id];
                return updated;
            });
            return;
        }

        setAiLoading((prev) => ({ ...prev, [med._id]: true }));
        const answer = await askAboutMedicine(med.medicineName, med.disease);
        setAiAnswers((prev) => ({ ...prev, [med._id]: answer }));
        setAiLoading((prev) => ({ ...prev, [med._id]: false }));
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const today = new Date().toISOString().split("T")[0];
    const todaysMeds = medicines.filter(
        (m) =>
            new Date(m.startDate).toISOString().split("T")[0] <= today &&
            new Date(m.endDate).toISOString().split("T")[0] >= today
    );
    const takenCount = medicines.filter((m) => m.reminderStatus === "Taken").length;
    const missedCount = medicines.filter((m) => m.reminderStatus === "Missed").length;
    const pendingCount = medicines.length - takenCount - missedCount;

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
    // Left accent bar per card, keyed off status so cards read at a glance
    const accentBar = {
        Taken: "before:bg-[#0f6e56]",
        Missed: "before:bg-red-500",
        Pending: "before:bg-amber-500",
    };

    const statIcons = {
        "Today's Medicines": (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h3" />
            </svg>
        ),
        Taken: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
                <path d="M20 6L9 17l-5-5" />
            </svg>
        ),
        Missed: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
        ),
        Pending: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
        ),
    };
    const statIconBg = {
        "Today's Medicines": "bg-[#e1f5ee] text-[#0d3b36]",
        Taken: "bg-[#e1f5ee] text-[#0f6e56]",
        Missed: "bg-red-50 text-red-600",
        Pending: "bg-amber-50 text-amber-600",
    };

    return (
        <div onClick={unlockAudio}>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp .45s ease both; }
            `}</style>

            <audio
                ref={alarmRef}
                src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Today's Medicines", value: todaysMeds.length, color: "text-[#0d3b36]" },
                    { label: "Taken", value: takenCount, color: "text-[#0f6e56]" },
                    { label: "Missed", value: missedCount, color: "text-red-600" },
                    { label: "Pending", value: pendingCount, color: "text-amber-600" },
                ].map((stat, i) => (
                    <div
                        key={stat.label}
                        className="fade-up flex items-center gap-3 rounded-2xl border border-[#e4dfd2] bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                        style={{ animationDelay: `${i * 70}ms` }}
                    >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${statIconBg[stat.label]}`}>
                            {statIcons[stat.label]}
                        </span>
                        <div>
                            <p className={`text-2xl font-extrabold leading-tight ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-[#6b6558]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="mb-4 text-xl font-extrabold text-[#151310]">My Medicines</h2>

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-[#6b6558]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                    Loading your medicines...
                </div>
            ) : medicines.length === 0 ? (
                <div className="fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dfd2] bg-white/60 py-16 text-center">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e1f5ee]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 text-[#0d3b36]">
                            <rect x="4" y="3" width="16" height="18" rx="2" />
                            <path d="M9 8h6M9 12h6M9 16h3" />
                        </svg>
                    </span>
                    <p className="text-sm font-medium text-[#151310]">No medicines assigned yet</p>
                    <p className="mt-1 text-xs text-[#6b6558]">
                        Once your doctor adds a prescription, it will show up here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicines.map((med, i) => (
                        <div
                            key={med._id}
                            className={`fade-up relative overflow-hidden rounded-2xl border border-[#e4dfd2] bg-white p-5 pl-6 shadow-sm transition hover:shadow-md before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 ${accentBar[med.reminderStatus] || accentBar.Pending
                                }`}
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#0d3b36] text-sm font-bold">
                                        {med.medicineName?.[0]?.toUpperCase()}
                                    </span>
                                    <h3 className="font-semibold text-[#151310]">{med.medicineName}</h3>
                                </div>
                                <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[med.reminderStatus] || statusStyles.Pending
                                        }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot[med.reminderStatus] || statusDot.Pending}`} />
                                    {med.reminderStatus}
                                </span>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-[#6b6558]">
                                <p>Dosage: <span className="text-[#151310] font-medium">{med.dosage}</span></p>
                                <p>⏰ {med.medicineTime}</p>
                                <p className="col-span-2">Frequency: <span className="text-[#151310] font-medium">{med.frequency}</span></p>
                            </div>
                            {med.instructions && (
                                <p className="text-[#a8a191] text-xs mt-1.5">Note: {med.instructions}</p>
                            )}

                            <button
                                onClick={() => handleAskAI(med)}
                                className="text-[#0d3b36] text-sm font-medium mt-3 hover:underline flex items-center gap-1.5"
                            >
                                🤖 What is this medicine for?
                            </button>

                            {aiLoading[med._id] && (
                                <div className="mt-2 flex items-center gap-2 bg-[#faf8f3] p-3 rounded-lg text-sm text-[#6b6558]">
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                                    Thinking...
                                </div>
                            )}

                            {aiAnswers[med._id] && !aiLoading[med._id] && (
                                <div className="fade-up mt-2 bg-[#faf8f3] p-3 rounded-lg text-sm text-[#151310] leading-relaxed">
                                    {aiAnswers[med._id]}
                                </div>
                            )}

                            {med.reminderStatus === "Pending" && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => markAsTaken(med._id, "Taken")}
                                        className="flex-1 bg-[#0d3b36] text-white text-sm font-medium px-3 py-2 rounded-full transition hover:bg-[#0a2e2a] active:scale-95"
                                    >
                                        ✓ Mark as Taken
                                    </button>
                                    <button
                                        onClick={() => markAsTaken(med._id, "Missed")}
                                        className="flex-1 bg-red-50 text-red-600 text-sm font-medium px-3 py-2 rounded-full transition hover:bg-red-100 active:scale-95"
                                    >
                                        ✗ Missed
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
