import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
    // Updated for 2026 model names discovered via listModels
    const models = ["gemini-3-flash-preview", "gemini-3.1-flash-lite-preview", "gemini-flash-latest", "gemini-pro-latest"];
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDuywYrPkhJt-te0dRYBn2Fy1mQeovra78";
    
    let lastError = null;

    for (const model of models) {
        try {
            console.log(`Trying Gemini model: ${model}...`);
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
            
            Your task is to understand the user's natural language input and respond with a JSON object like this:
            
            {
                "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "whatsapp-open" | "twitter-open" | "github-open" | "spotify-open" | "netflix-open" | "general-search" | "weather-show" | "open-app",
                "userInput":"<clean query text>",
                "response":"<a short friendly response>"
            } 
            
            Important: Respond ONLY with JSON.
            Current command: ${command}`;

            const result = await axios.post(apiUrl, {
                "contents": [{
                    "parts": [{ "text": prompt }]
                }]
            });
            
            const text = result.data.candidates[0].content.parts[0].text;
            console.log(`Success with model: ${model}`);
            return text;
        } catch (error) {
            lastError = error.response?.data?.error?.message || error.message;
            console.log(`Gemini ${model} Error:`, lastError);
        }
    }

    console.error("All Gemini models failed. Last error:", lastError);
    return JSON.stringify({ 
        type: "general", 
        response: "I'm having a bit of a connection issue with my AI brain. Please check your internet or API key." 
    });
}

export default geminiResponse;