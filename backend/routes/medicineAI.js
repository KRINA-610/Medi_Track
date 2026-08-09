const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
    try {
        const { medicineName, disease } = req.body;

        if (!medicineName || !disease) {
            return res.status(400).json({
                message: "Medicine name and disease are required",
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a helpful medical information assistant inside a patient medicine-tracking app.

Explain the medicine "${medicineName}" to a patient who has been prescribed it for "${disease}".

Cover, in simple plain language:
- What this specific medicine is and what it actually does in the body (its real mechanism, not a generic template)
- Why it's used for ${disease} specifically
- Any general precaution relevant to this medicine (e.g. take with food, avoid alcohol, common side effects) — only if genuinely relevant to this medicine
- End with a short reminder to always follow the doctor's specific instructions

Keep it to 4-6 sentences, easy to understand for a non-medical person. Do NOT use a generic filler template — be specific to ${medicineName} and ${disease}.`;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        return res.status(200).json({
            success: true,
            answer: answer,
        });

    } catch (error) {
        console.error("MEDICINE AI ERROR:", error);

        // Fallback so the UI never breaks even if Gemini call fails
        const { medicineName, disease } = req.body;
        const fallback = `${medicineName} is commonly prescribed to help manage symptoms related to ${disease}. Please take it exactly as directed by your doctor, and contact your doctor if you notice any unusual side effects.`;

        return res.status(200).json({
            success: true,
            answer: fallback,
        });
    }
});

module.exports = router;