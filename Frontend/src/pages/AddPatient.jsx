import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AddPatient = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("/users", {
                ...formData,
                role: "patient",
                assignedDoctorId: user.id,
            });
            setSuccess("Patient added successfully!");
            setTimeout(() => navigate("/doctor-dashboard"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add patient");
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
                        onClick={() => navigate("/doctor-dashboard")}
                        className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        Back to dashboard
                    </button>
                </div>

                {/* Doctor + patient illustration, sized to keep the panel short */}
                <div className="relative flex items-center justify-center mt-4 mb-2">
                    <svg viewBox="0 0 300 210" className="w-full max-w-[220px] relative z-10" xmlns="http://www.w3.org/2000/svg">
                        <path d="M95 100 C 130 130, 170 130, 205 100" stroke="#9fd8c6" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 6" fill="none" />

                        <g>
                            <circle cx="90" cy="78" r="34" fill="#ffffff" fillOpacity="0.08" />
                            <circle cx="90" cy="70" r="15" fill="#9fd8c6" />
                            <path d="M64 108c0-13 11-21 26-21s26 8 26 21" fill="#9fd8c6" />
                            <circle cx="116" cy="56" r="6" fill="#ffffff" fillOpacity="0.9" />
                            <path d="M113 56h6M116 53v6" stroke="#0d3b36" strokeWidth="1.4" strokeLinecap="round" />
                        </g>

                        <g>
                            <circle cx="210" cy="78" r="34" fill="#ffffff" fillOpacity="0.08" />
                            <circle cx="210" cy="70" r="15" fill="#ffffff" fillOpacity="0.65" />
                            <path d="M184 108c0-13 11-21 26-21s26 8 26 21" fill="#ffffff" fillOpacity="0.65" />
                        </g>

                        <rect x="105" y="128" width="90" height="60" rx="14" fill="#ffffff" fillOpacity="0.1" />
                        <rect x="122" y="141" width="56" height="8" rx="4" fill="#9fd8c6" />
                        <rect x="122" y="156" width="40" height="6" rx="3" fill="#ffffff" fillOpacity="0.5" />
                        <circle cx="178" cy="172" r="9" fill="#9fd8c6" />
                        <path d="M174 172l3 3 5-5" stroke="#0d3b36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <span className="float-slow pulse-ring absolute top-0 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#9fd8c6] text-[#0d3b36] shadow-lg z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                            <path d="M12 20s-7-4.35-9.5-8.5C.9 8.1 2.6 5 6 5c2 0 3.2 1 4 2.2C10.8 6 12 5 14 5c3.4 0 5.1 3.1 3.5 6.5C15 15.65 12 20 12 20z" />
                        </svg>
                    </span>
                    <span className="float-slower absolute bottom-0 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white shadow-lg z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                            <path d="M12 4v16m8-8H4" />
                        </svg>
                    </span>
                </div>

                <div className="relative z-10">
                    <p className="text-xs font-bold tracking-[0.15em] text-[#9fd8c6]">
                        NEW PATIENT
                    </p>
                    <h2 className="mt-1.5 text-xl font-extrabold leading-tight">
                        Bring a new patient into their care space.
                    </h2>
                    <p className="mt-2 text-xs text-white/70 leading-relaxed">
                        They'll be able to log in with this email and start
                        tracking prescriptions and appointments right away.
                    </p>

                    <ul className="mt-4 space-y-2">
                        {[
                            "Secure, doctor-managed records",
                            "Automatic medicine reminders",
                            "Appointments in one place",
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
                    className="fade-up w-full max-w-sm rounded-2xl border border-[#e4dfd2] bg-white p-7 shadow-sm"
                >
                    <p className="text-[11px] font-bold tracking-[0.15em] text-[#0d3b36]">
                        ADD PATIENT
                    </p>
                    <h2 className="mt-1 mb-5 text-2xl font-extrabold text-[#151310]">
                        New patient profile
                    </h2>

                    {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
                    {success && <p className="text-[#0f6e56] text-sm mb-4 text-center">{success}</p>}

                    <div className="mb-3 grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-[#151310]">First name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Ava"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[#151310]">Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Morgan"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                            />
                        </div>
                    </div>

                    <label className="text-sm font-medium text-[#151310]">Email address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 mb-3 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                    />

                    <label className="text-sm font-medium text-[#151310]">Temporary password</label>
                    <div className="relative mt-1 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8a191]">
                            <rect x="4" y="10" width="16" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                        <input
                            type="password"
                            name="password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] py-2.5 pl-10 pr-4 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#0d3b36] text-white py-3 rounded-full text-sm font-semibold transition hover:bg-[#0a2e2a] active:scale-95"
                    >
                        Add patient
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/doctor-dashboard")}
                        className="w-full mt-2 text-[#6b6558] py-2.5 rounded-full text-sm font-medium transition hover:bg-[#faf8f3]"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;
