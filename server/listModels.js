import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const listModels = async () => {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDuywYrPkhJt-te0dRYBn2Fy1mQeovra78";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        console.log("Available models:");
        response.data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name}`);
            }
        });
    } catch (error) {
        console.error("Error listing models:", error.response?.data?.error?.message || error.message);
    }
}

listModels();
