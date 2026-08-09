import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PatientLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#f5f1e8]">
            <nav className="bg-[#0d3b36] sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center flex-wrap gap-3">
                    <Link to="/patient-dashboard" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-white">
                                <path d="M6 4v6a4 4 0 0 0 8 0V4" />
                                <path d="M6 4H5M14 4h1" />
                                <path d="M18 10v2a6 6 0 0 1-12 0v-2" />
                                <circle cx="19" cy="8" r="2" />
                            </svg>
                        </span>
                        <span className="text-xl font-extrabold tracking-tight text-white">
                            MediTrack
                        </span>
                    </Link>

                    <div className="flex items-center gap-1">
                        <Link
                            to="/patient-dashboard"
                            className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${isActive("/patient-dashboard")
                                ? "bg-white text-[#0d3b36]"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/patient-appointments"
                            className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${isActive("/patient-appointments")
                                ? "bg-white text-[#0d3b36]"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Appointments
                        </Link>
                        <Link
                            to="/reminder-history"
                            className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${isActive("/reminder-history")
                                ? "bg-white text-[#0d3b36]"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            History
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-white/60">Patient</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-[#9fd8c6] text-[#0d3b36] flex items-center justify-center font-semibold text-sm">
                            {user?.firstName?.[0]}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-white/10 text-white px-3.5 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Care reminder strip */}
            <div className="border-b border-[#e4dfd2] bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e1f5ee]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-[#0d3b36]">
                            <path d="M6 4v6a4 4 0 0 0 8 0V4" />
                            <path d="M6 4H5M14 4h1" />
                            <path d="M18 10v2a6 6 0 0 1-12 0v-2" />
                            <circle cx="19" cy="8" r="2" />
                        </svg>
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-[#151310]">
                            Welcome back, {user?.firstName}
                        </p>
                        <p className="text-xs text-[#6b6558]">
                            Your prescriptions and appointments, all in one place.
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default PatientLayout;
