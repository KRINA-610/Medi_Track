import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await api.get(`/edituserdet/${id}`);
                setFormData({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                    age: res.data.age || "",
                    gender: res.data.gender || "",
                    phone: res.data.phone || "",
                    address: res.data.address || "",
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchPatient();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await api.put(`/users/${id}`, formData);
            setSuccess("Patient updated successfully!");
            setTimeout(() => navigate(`/patient/${id}`), 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this patient? This cannot be undone.")) return;
        try {
            await api.delete(`/users/${id}`);
            navigate("/doctor-dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-[#e4dfd2] bg-[#faf8f3] px-3 py-2 text-sm text-[#151310] placeholder:text-[#a8a191] outline-none transition focus:border-[#0d3b36] focus:bg-white focus:ring-2 focus:ring-[#0d3b36]/10";
    const labelClass = "block text-xs font-semibold text-[#6b6558] mb-1";

    return (
        <div className="bg-[#f5f1e8] p-4 sm:p-6">
            <button
                onClick={() => navigate(`/patient/${id}`)}
                className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[#0d3b36] hover:underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to patient
            </button>

            <div className="max-w-5xl mx-auto rounded-3xl border border-[#e4dfd2] bg-white shadow-sm overflow-hidden flex flex-col lg:flex-row">
                {/* Decorative side panel — hidden on small screens to keep things compact */}
                <div className="hidden lg:flex lg:w-[34%] relative overflow-hidden bg-[#0d3b36] p-6 flex-col justify-between text-white">
                    <div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-[#9fd8c6]">
                                <circle cx="12" cy="8" r="4" /><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                            </svg>
                        </span>
                        <h3 className="text-lg font-extrabold leading-snug">
                            Keep patient records accurate and up to date.
                        </h3>
                        <p className="mt-2 text-xs text-white/60 leading-relaxed">
                            Changes here reflect instantly across appointments and medicine history.
                        </p>
                    </div>

                    <svg viewBox="0 0 160 120" className="w-full max-w-[150px] relative z-10 self-center" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="80" cy="46" r="24" fill="#ffffff" fillOpacity="0.08" />
                        <circle cx="80" cy="40" r="12" fill="#9fd8c6" />
                        <path d="M60 68c0-11 9-18 20-18s20 7 20 18" fill="#9fd8c6" />
                        <rect x="40" y="82" width="80" height="26" rx="10" fill="#ffffff" fillOpacity="0.1" />
                        <path d="M70 95l6 6 12-12" stroke="#9fd8c6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>

                    <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#9fd8c6]/10 blur-2xl" />
                </div>

                {/* Form panel */}
                <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5 mb-4">
                        <span className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#0d3b36]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                                <circle cx="12" cy="8" r="4" /><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-lg font-extrabold text-[#151310]">Edit Patient</h2>
                            <p className="text-xs text-[#a8a191]">Update this patient's profile details</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-3 rounded-lg bg-[#e1f5ee] border border-[#c7ebe0] px-3 py-2 text-xs text-[#0f6e56]">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>First Name</label>
                                <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required className={inputClass} />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Email</label>
                                <input type="email" name="email" placeholder="patient@email.com" value={formData.email} onChange={handleChange} required className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Age</label>
                                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Phone</label>
                                <input type="text" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} className={inputClass} />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Address</label>
                                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 border-t border-[#f0ece1] pt-4">
                            <button type="submit" className="flex-1 bg-[#0d3b36] text-white py-2 rounded-full text-sm font-medium transition hover:bg-[#0a2e2a] active:scale-95">
                                Save Changes
                            </button>
                            <button type="button" onClick={handleDelete} className="flex-1 bg-red-50 text-red-600 py-2 rounded-full text-sm font-medium transition hover:bg-red-100 active:scale-95">
                                Delete Patient
                            </button>
                            <button type="button" onClick={() => navigate(`/patient/${id}`)} className="flex-1 bg-white border border-[#e4dfd2] text-[#6b6558] py-2 rounded-full text-sm font-medium transition hover:bg-[#faf8f3] active:scale-95">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPatient;
