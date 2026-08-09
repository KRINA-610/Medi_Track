import api from "../api/axios";

export const askAboutMedicine = async (medicineName, disease) => {
    try {
        if (!medicineName) {
            return "Medicine name is missing.";
        }

        const response = await api.post("/medicine-ai", {
            medicineName,
            disease: disease || "not specified",
        });

        return response.data.answer;
    } catch (error) {
        console.error(
            "GEMINI ERROR:",
            error.response?.data || error.message
        );

        return (
            error.response?.data?.message ||
            "Sorry, couldn't fetch information right now. Please ask your doctor."
        );
    }
};