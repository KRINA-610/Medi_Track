import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AddMedicine = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        medicineName: "",
        dosage: "",
        medicineTime: "",
        frequency: "Once Daily",
        startDate: "",
        endDate: "",
        instructions: "",
        disease: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        console.log("=== SUBMIT TRIGGERED ===");
        console.log("patientId:", patientId);
        console.log("Auth user:", user);
        console.log("formData:", formData);

        try {
            // Get logged-in user from AuthContext
            let loggedInUser = user;

            // If AuthContext user is null, get user from localStorage
            if (!loggedInUser) {
                const storedUser = localStorage.getItem("user");

                if (storedUser) {
                    try {
                        loggedInUser = JSON.parse(storedUser);
                    } catch (parseError) {
                        console.error(
                            "Error reading stored user:",
                            parseError
                        );
                    }
                }
            }

            console.log("Logged in user:", loggedInUser);

            // Check doctor information
            if (!loggedInUser || !loggedInUser.id) {
                setError(
                    "Doctor information not found. Please login again."
                );
                return;
            }

            // Check patient ID
            if (!patientId) {
                setError("Patient ID is missing.");
                return;
            }

            // Prepare medicine data
            const payload = {
                ...formData,
                patientId: patientId,
                doctorId: loggedInUser.id,
            };

            console.log("Sending payload:", payload);

            // Send medicine to backend
            const res = await api.post("/medicines", payload);

            console.log("SUCCESS response:", res.data);

            setSuccess("Medicine added successfully!");

            // Go back to patient details
            setTimeout(() => {
                navigate(`/patient/${patientId}`);
            }, 1500);
        } catch (err) {
            console.log("=== ERROR CAUGHT ===");
            console.log("Full error object:", err);
            console.log("err.response:", err.response);
            console.log("err.message:", err.message);

            setError(
                err.response?.data?.message ||
                "Failed to add medicine"
            );
        }
    };

    return (
        <div className="min-screen grid lg:grid-cols-5 bg-[#f5f1e8]">
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes ringPulse {
                    0% { box-shadow: 0 0 0 0 rgba(159,216,198,0.55); }
                    70% { box-shadow: 0 0 0 10px rgba(159,216,198,0); }
                    100% { box-shadow: 0 0 0 0 rgba(159,216,198,0); }
                }
                .fade-up { animation: fadeUp .45s ease both; }
                .float-slow { animation: float 4.5s ease-in-out infinite; }
                .float-slower { animation: float 5.5s ease-in-out infinite; animation-delay: .4s; }
                .pulse-ring { animation: ringPulse 2.4s ease-out infinite; }
            `}</style>

            {/* Left info panel — kept compact so it never needs to scroll */}
            <div className="hidden lg:flex lg:col-span-2 flex-col bg-[#0d3b36] px-10 py-8 text-white relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                                <path d="M6 4v6a4 4 0 0 0 8 0V4" />
                                <path d="M6 4H5M14 4h1" />
                                <path d="M18 10v2a6 6 0 0 1-12 0v-2" />
                                <circle cx="19" cy="8" r="2" />
                            </svg>
                        </span>
                        <span className="text-xl font-extrabold tracking-tight">MediTrack</span>
                    </div>

                    <button
                        onClick={() => navigate(`/patient/${patientId}`)}
                        className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        Back to patient
                    </button>
                </div>

                {/* Doctor + prescription illustration, sized to keep the panel short */}
                <div className="relative flex items-center justify-center mt-4 mb-2">
                    <svg viewBox="0 0 300 190" className="w-full max-w-[220px] relative z-10" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="48" r="24" fill="#ffffff" fillOpacity="0.08" />
                        <circle cx="60" cy="43" r="11" fill="#9fd8c6" />
                        <path d="M42 68c0-9 8-15 18-15s18 6 18 15" fill="#9fd8c6" />

                        <rect x="62" y="32" width="140" height="120" rx="16" fill="#ffffff" fillOpacity="0.08" />
                        <rect x="84" y="52" width="96" height="20" rx="7" fill="#9fd8c6" />
                        <rect x="84" y="82" width="96" height="9" rx="4" fill="#ffffff" fillOpacity="0.5" />
                        <rect x="84" y="97" width="70" height="9" rx="4" fill="#ffffff" fillOpacity="0.3" />
                        <rect x="84" y="123" width="52" height="21" rx="10" fill="#ffffff" fillOpacity="0.15" />
                        <rect x="144" y="123" width="35" height="21" rx="10" fill="#9fd8c6" />

                        <path d="M82 60 C 92 64, 80 76, 88 84" stroke="#9fd8c6" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 6" fill="none" />
                    </svg>

                    <span className="float-slow pulse-ring absolute top-0 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#9fd8c6] text-[#0d3b36] shadow-lg z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                            <rect x="3" y="10" width="10" height="10" rx="5" transform="rotate(-45 8 15)" />
                            <path d="M12 12l6-6" />
                        </svg>
                    </span>
                    <span className="float-slower absolute bottom-0 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white shadow-lg z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                            <circle cx="12" cy="13" r="7" />
                            <path d="M12 9v4l3 2M9 3h6" />
                        </svg>
                    </span>
                </div>

                <div className="relative z-10">
                    <p className="text-xs font-bold tracking-[0.15em] text-[#9fd8c6]">
                        PRESCRIBE
                    </p>
                    <h2 className="mt-1.5 text-xl font-extrabold leading-tight">
                        Set a clear schedule your patient can follow.
                    </h2>
                    <p className="mt-2 text-xs text-white/70 leading-relaxed">
                        Dosage, timing and instructions all sync straight to
                        their dashboard with reminders.
                    </p>

                    <ul className="mt-4 space-y-2">
                        {[
                            "Dosage & timing reminders",
                            "Start/end date tracking",
                            "Instant sync to dashboard",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-xs text-white/80">
                                <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#9fd8c6]/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9fd8c6" strokeWidth="2.5" className="h-2.5 w-2.5">
                                        <path d="M4 12l5 5L20 6" />
                                    </svg>
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#9fd8c6]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
            </div>

            {/* Right form panel */}
            <div className="lg:col-span-3 flex items-center justify-center px-6 py-10">
                <form
                    onSubmit={handleSubmit}
                    className="fade-up w-full max-w-md rounded-2xl border border-[#e4dfd2] bg-white p-7 shadow-sm"
                >
                    <p className="text-[11px] font-bold tracking-[0.15em] text-[#0d3b36]">
                        NEW PRESCRIPTION
                    </p>
                    <h2 className="mt-1 mb-5 text-2xl font-extrabold text-[#151310]">
                        Add medicine
                    </h2>

                    {error && (
                        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                    )}
                    {success && (
                        <p className="text-[#0f6e56] text-sm mb-4 text-center">{success}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-sm font-medium text-[#151310]">Medicine name</label>
                            <input
                                type="text"
                                name="medicineName"
                                placeholder="e.g. Amoxicillin"
                                value={formData.medicineName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[#151310]">Dosage</label>
                            <input
                                type="text"
                                name="dosage"
                                placeholder="e.g. 500mg"
                                value={formData.dosage}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-sm font-medium text-[#151310]">Time</label>
                            <input
                                type="time"
                                name="medicineTime"
                                value={formData.medicineTime}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[#151310]">Frequency</label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="mt-1 w-full appearance-none rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm text-[#151310] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            >
                                <option value="Once Daily">Once Daily</option>
                                <option value="Twice Daily">Twice Daily</option>
                                <option value="Three Times Daily">Three Times Daily</option>
                                <option value="As Needed">As Needed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-sm font-medium text-[#151310]">Start date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[#151310]">End date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            />
                        </div>
                    </div>

                    <label className="text-sm font-medium text-[#151310]">Disease / condition</label>
                    <input
                        type="text"
                        name="disease"
                        placeholder="e.g. Bacterial infection"
                        value={formData.disease}
                        onChange={handleChange}
                        required
                        className="mt-1 mb-3 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                    />

                    <label className="text-sm font-medium text-[#151310]">Instructions (optional)</label>
                    <textarea
                        name="instructions"
                        placeholder="e.g. Take after meals"
                        value={formData.instructions}
                        onChange={handleChange}
                        rows="2"
                        className="mt-1 mb-5 w-full rounded-2xl border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#0d3b36] text-white py-3 rounded-full text-sm font-semibold transition hover:bg-[#0a2e2a] active:scale-95"
                    >
                        Add medicine
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/patient/${patientId}`)}
                        className="w-full mt-2 text-[#6b6558] py-2.5 rounded-full text-sm font-medium transition hover:bg-[#faf8f3]"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMedicine;
