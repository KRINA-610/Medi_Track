import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditMedicine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const res = await api.get(`/editmedi/${id}`);
                setFormData({
                    medicineName: res.data.medicineName || "",
                    dosage: res.data.dosage || "",
                    medicineTime: res.data.medicineTime || "",
                    frequency: res.data.frequency || "Once Daily",
                    startDate: res.data.startDate?.split("T")[0] || "",
                    endDate: res.data.endDate?.split("T")[0] || "",
                    instructions: res.data.instructions || "",
                    disease: res.data.disease || "",
                });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMedicine();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = await api.put(`/editmedi/${id}`, formData);
            setSuccess("Medicine updated successfully!");
            setTimeout(() => navigate(`/patient/${res.data.patientId}`), 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        }
    };

    const inputClass =
        "w-full rounded-lg border border-[#e4dfd2] bg-[#faf8f3] px-3 py-2 text-sm text-[#151310] placeholder:text-[#a8a191] outline-none transition focus:border-[#0d3b36] focus:bg-white focus:ring-2 focus:ring-[#0d3b36]/10";
    const labelClass = "block text-xs font-semibold text-[#6b6558] mb-1";

    if (loading) {
        return (
            <div className="bg-[#f5f1e8] p-6 flex items-center justify-center h-64">
                <div className="flex items-center gap-2 text-sm text-[#6b6558]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d3b36] border-t-transparent" />
                    Loading medicine...
                </div>
            </div>
        );
    }

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
                <div className="hidden lg:flex lg:w-[34%] relative overflow-hidden bg-[#0d3b36] p-6 flex-col justify-between text-white">
                    <div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-[#9fd8c6]">
                                <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" />
                            </svg>
                        </span>
                        <h3 className="text-lg font-extrabold leading-snug">
                            Every dose, on schedule.
                        </h3>
                        <p className="mt-2 text-xs text-white/60 leading-relaxed">
                            Update dosage, timing or duration and your patient's reminders adjust automatically.
                        </p>
                    </div>

                    <svg viewBox="0 0 160 120" className="w-full max-w-[140px] relative z-10 self-center" xmlns="http://www.w3.org/2000/svg">
                        <rect x="45" y="20" width="70" height="90" rx="12" fill="#ffffff" fillOpacity="0.08" />
                        <rect x="58" y="34" width="44" height="8" rx="4" fill="#9fd8c6" />
                        <rect x="58" y="50" width="44" height="8" rx="4" fill="#ffffff" fillOpacity="0.4" />
                        <rect x="58" y="66" width="30" height="8" rx="4" fill="#ffffff" fillOpacity="0.4" />
                        <circle cx="98" cy="94" r="14" fill="#9fd8c6" />
                        <path d="M92 94l4 4 8-8" stroke="#0d3b36" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>

                    <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#9fd8c6]/10 blur-2xl" />
                </div>

                {/* Form panel */}
                <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5 mb-4">
                        <span className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#0d3b36]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                                <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-lg font-extrabold text-[#151310]">Edit Medicine</h2>
                            <p className="text-xs text-[#a8a191]">Update dosage, schedule and instructions</p>
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
                                <label className={labelClass}>Medicine Name</label>
                                <input type="text" name="medicineName" placeholder="e.g. Paracetamol" value={formData.medicineName} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Dosage</label>
                                <input type="text" name="dosage" placeholder="e.g. 250mg" value={formData.dosage} onChange={handleChange} required className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Medicine Time</label>
                                <input type="time" name="medicineTime" value={formData.medicineTime} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Frequency</label>
                                <select name="frequency" value={formData.frequency} onChange={handleChange} className={inputClass}>
                                    <option value="Once Daily">Once Daily</option>
                                    <option value="Twice Daily">Twice Daily</option>
                                    <option value="Three Times Daily">Three Times Daily</option>
                                    <option value="As Needed">As Needed</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={inputClass} />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Disease / Condition</label>
                                <input type="text" name="disease" placeholder="e.g. Fever" value={formData.disease} onChange={handleChange} required className={inputClass} />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Instructions</label>
                                <input type="text" name="instructions" placeholder="e.g. Take after meals" value={formData.instructions} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 border-t border-[#f0ece1] pt-4">
                            <button type="submit" className="flex-1 bg-[#0d3b36] text-white py-2 rounded-full text-sm font-medium transition hover:bg-[#0a2e2a] active:scale-95">
                                Save Changes
                            </button>
                            <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-white border border-[#e4dfd2] text-[#6b6558] py-2 rounded-full text-sm font-medium transition hover:bg-[#faf8f3] active:scale-95">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditMedicine;
