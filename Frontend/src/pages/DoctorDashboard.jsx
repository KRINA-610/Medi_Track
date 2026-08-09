import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get(`/users/patients/${user.id}`);
                setPatients(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchPatients();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Derived stats — purely presentational, computed from the patients
    // we already fetch, no extra API calls.
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const addedThisWeek = patients.filter((p) => new Date(p.createdAt) >= weekAgo).length;
    const addedThisMonth = patients.filter((p) => {
        const d = new Date(p.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .fade-up { animation: fadeUp .45s ease both; }
                .float-slow { animation: float 4.5s ease-in-out infinite; }
                .float-slower { animation: float 5.5s ease-in-out infinite; animation-delay: .4s; }
            `}</style>

            <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
                <h2 className="text-2xl font-extrabold text-[#151310]">My Patients</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/appointments")}
                        className="bg-white border border-[#e4dfd2] text-[#0d3b36] px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-[#faf8f3] active:scale-95"
                    >
                        Appointments
                    </button>
                    <button
                        onClick={() => navigate("/add-patient")}
                        className="bg-[#0d3b36] text-white px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-[#0a2e2a] active:scale-95"
                    >
                        + Add Patient
                    </button>
                </div>
            </div>

            {/* Quick overview strip */}
            {!loading && patients.length > 0 && (
                <div className="fade-up grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-2xl border border-[#e4dfd2] bg-white p-5 shadow-sm">
                        <p className="text-3xl font-extrabold text-[#0d3b36]">{patients.length}</p>
                        <p className="mt-1 text-sm text-[#6b6558]">Total patients</p>
                    </div>
                    <div className="rounded-2xl border border-[#e4dfd2] bg-white p-5 shadow-sm">
                        <p className="text-3xl font-extrabold text-[#0f6e56]">{addedThisWeek}</p>
                        <p className="mt-1 text-sm text-[#6b6558]">Added this week</p>
                    </div>
                    <div className="rounded-2xl border border-[#e4dfd2] bg-white p-5 shadow-sm">
                        <p className="text-3xl font-extrabold text-amber-600">{addedThisMonth}</p>
                        <p className="mt-1 text-sm text-[#6b6558]">Added this month</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-[#6b6558]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                    Loading your patients...
                </div>
            ) : patients.length === 0 ? (
                <div className="fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dfd2] bg-white/60 py-16 text-center">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e1f5ee]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 text-[#0d3b36]">
                            <circle cx="9" cy="8" r="3" />
                            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                            <path d="M17 10l2 2 4-4" />
                        </svg>
                    </span>
                    <p className="text-base font-medium text-[#151310]">No patients yet</p>
                    <p className="mt-1 text-sm text-[#6b6558]">
                        Add your first patient to start tracking their care.
                    </p>
                    <button
                        onClick={() => navigate("/add-patient")}
                        className="mt-4 bg-[#0d3b36] text-white px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-[#0a2e2a]"
                    >
                        + Add Patient
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {patients.map((p, i) => (
                        <div
                            key={p._id}
                            onClick={() => navigate(`/patient/${p._id}`)}
                            className="fade-up group relative rounded-2xl border border-[#e4dfd2] bg-white p-5 shadow-sm cursor-pointer transition hover:shadow-md hover:-translate-y-0.5 hover:border-[#9fd8c6]"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <span className="pointer-events-none absolute top-4 right-4 text-[#c9c2b2] transition group-hover:text-[#0d3b36] group-hover:translate-x-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                            </span>

                            <div className="flex items-center gap-3 pr-5">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e1f5ee] text-[#0d3b36] font-semibold text-base ring-2 ring-white shadow-sm">
                                    {p.firstName?.[0]}
                                    {p.lastName?.[0]}
                                </span>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base text-[#151310] truncate">
                                        {p.firstName} {p.lastName}
                                    </h3>
                                    <p className="text-[#6b6558] text-sm truncate">{p.email}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-[#f0ece1] pt-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#faf8f3] px-2.5 py-1 text-[11px] font-medium text-[#6b6558]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                                        <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
                                    </svg>
                                    Added {new Date(p.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Illustrated banner — fills the empty space below the patient list */}
            {!loading && (
                <div className="fade-up relative mt-10 overflow-hidden rounded-2xl bg-[#0d3b36] px-8 py-10 text-white">
                    <div className="relative z-10 grid md:grid-cols-5 items-center gap-8">
                        <div className="md:col-span-3">
                            <p className="text-xs font-bold tracking-[0.15em] text-[#9fd8c6]">
                                STAY ON TOP OF CARE
                            </p>
                            <h3 className="mt-2 text-2xl font-extrabold leading-tight">
                                Everything about your patients, in one place.
                            </h3>
                            <p className="mt-2 text-sm text-white/70 max-w-md">
                                Book appointments, prescribe medicine and track reminders
                                without leaving the dashboard.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate("/appointments")}
                                    className="bg-[#9fd8c6] text-[#0d3b36] px-4 py-2.5 rounded-full text-sm font-semibold transition hover:bg-white active:scale-95"
                                >
                                    View appointments
                                </button>
                                <button
                                    onClick={() => navigate("/add-patient")}
                                    className="bg-white/10 border border-white/20 text-white px-4 py-2.5 rounded-full text-sm font-medium transition hover:bg-white/20 active:scale-95"
                                >
                                    + Add patient
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2 relative flex items-center justify-center">
                            <svg viewBox="0 0 220 160" className="w-full max-w-[200px] relative z-10" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="60" cy="60" r="30" fill="#ffffff" fillOpacity="0.08" />
                                <circle cx="60" cy="53" r="14" fill="#9fd8c6" />
                                <path d="M36 88c0-13 10-21 24-21s24 8 24 21" fill="#9fd8c6" />

                                <circle cx="150" cy="60" r="30" fill="#ffffff" fillOpacity="0.08" />
                                <circle cx="150" cy="53" r="14" fill="#ffffff" fillOpacity="0.6" />
                                <path d="M126 88c0-13 10-21 24-21s24 8 24 21" fill="#ffffff" fillOpacity="0.6" />

                                <rect x="70" y="110" width="80" height="34" rx="12" fill="#ffffff" fillOpacity="0.1" />
                                <circle cx="110" cy="127" r="9" fill="#9fd8c6" />
                                <path d="M106 127l3 3 5-5" stroke="#0d3b36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <span className="float-slow absolute top-0 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#9fd8c6] text-[#0d3b36] shadow-lg z-20">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                                    <circle cx="12" cy="13" r="7" /><path d="M12 9v4l3 2M9 3h6" />
                                </svg>
                            </span>
                            <span className="float-slower absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white shadow-lg z-20">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                                    <path d="M12 20s-7-4.35-9.5-8.5C.9 8.1 2.6 5 6 5c2 0 3.2 1 4 2.2C10.8 6 12 5 14 5c3.4 0 5.1 3.1 3.5 6.5C15 15.65 12 20 12 20z" />
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

export default DoctorDashboard;
