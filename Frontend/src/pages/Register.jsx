import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "patient",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("/users", formData);
            setSuccess("Registered successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-5 bg-[#f5f1e8]">
            {/* Left brand panel - narrower, with illustration */}
            <div className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-[#0d3b36] px-10 py-10 text-white">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                            <path d="M6 4v6a4 4 0 0 0 8 0V4" />
                            <path d="M6 4H5M14 4h1" />
                            <path d="M18 10v2a6 6 0 0 1-12 0v-2" />
                            <circle cx="19" cy="8" r="2" />
                        </svg>
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight">MediTrack</span>
                </div>

                {/* Illustration */}
                <svg viewBox="0 0 300 220" className="w-full max-w-[280px] mx-auto my-8" xmlns="http://www.w3.org/2000/svg">
                    <rect x="30" y="40" width="160" height="110" rx="14" fill="#ffffff" fillOpacity="0.08" />
                    <rect x="55" y="65" width="160" height="110" rx="14" fill="#ffffff" fillOpacity="0.14" />
                    <rect x="80" y="90" width="160" height="110" rx="14" fill="#ffffff" />
                    <rect x="100" y="112" width="70" height="8" rx="4" fill="#0d3b36" fillOpacity="0.15" />
                    <rect x="100" y="128" width="110" height="8" rx="4" fill="#0d3b36" fillOpacity="0.15" />
                    <circle cx="220" cy="160" r="16" fill="#9fd8c6" />
                    <path d="M213 160l5 5 10-10" stroke="#0d3b36" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-[#9fd8c6]">
                        JOIN MEDITRACK
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold leading-tight">
                        Set up your care profile in under a minute.
                    </h2>
                    <p className="mt-3 text-sm text-white/70">
                        MediTrack keeps every visit, prescription and note organized.
                    </p>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-white/60">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                    By continuing, you agree to our terms and privacy policy.
                </p>
            </div>

            {/* Right form panel */}
            <div className="lg:col-span-3 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-sm">
                    <div className="mb-6 flex items-center justify-between lg:hidden">
                        <span className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d3b36] text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                                    <path d="M6 4v6a4 4 0 0 0 8 0V4" />
                                    <path d="M6 4H5M14 4h1" />
                                    <path d="M18 10v2a6 6 0 0 1-12 0v-2" />
                                    <circle cx="19" cy="8" r="2" />
                                </svg>
                            </span>
                            <span className="text-2xl font-extrabold tracking-tight text-[#0d3b36]">
                                MediTrack
                            </span>
                        </span>
                    </div>

                    <p className="text-[11px] font-bold tracking-[0.15em] text-[#0d3b36]">
                        WELCOME TO MEDITRACK
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold leading-tight text-[#151310]">
                        Create your care profile.
                    </h1>
                    <p className="mt-1.5 text-sm text-[#6b6558]">
                        Start with the basics — add more whenever you're ready.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-[#e4dfd2] bg-white p-6 shadow-sm">
                        {error && (
                            <p className="mb-3 text-sm text-red-600">{error}</p>
                        )}
                        {success && (
                            <p className="mb-3 text-sm text-green-600">{success}</p>
                        )}

                        <div className="mb-4 grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-[#151310]">
                                    First name
                                </label>
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
                                <label className="text-sm font-medium text-[#151310]">
                                    Last name
                                </label>
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

                        <label className="text-sm font-medium text-[#151310]">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 mb-4 w-full rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm placeholder:text-[#a8a191] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                        />

                        <label className="text-sm font-medium text-[#151310]">
                            Create a password
                        </label>
                        <div className="relative mt-1 mb-4">
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

                        <label className="text-sm font-medium text-[#151310]">
                            I'm joining as a
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 mb-5 w-full appearance-none rounded-full border border-[#e4dfd2] bg-[#faf8f3] px-4 py-2.5 text-sm text-[#151310] focus:outline-none focus:ring-2 focus:ring-[#0d3b36]/30"
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0d3b36] py-3 text-sm font-semibold text-white transition hover:bg-[#0a2e2a]"
                        >
                            Create account
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-[#6b6558]">
                        Already a member?{" "}
                        <Link to="/login" className="font-semibold text-[#0d3b36]">
                            Log in
                        </Link>
                    </p>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#6b6558] lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-[#0d3b36]">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        By continuing, you agree to our terms and privacy policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
