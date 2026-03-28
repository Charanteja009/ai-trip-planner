const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. STABLE RETRIEVAL: Fetch current weather for the city
const fetchLiveWeather = async (destination) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) return "Live weather currently unavailable.";

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${destination}&units=metric&appid=${apiKey}`);
        const data = await response.json();

        if (data.weather && data.weather.length > 0) {
            return `Condition: ${data.weather[0].description}. Temperature: ${data.main.temp}°C.`;
        }
        return "Typical seasonal weather.";
    } catch (error) {
        console.error("Weather Retrieval Error:", error.message);
        return "Typical seasonal weather."; 
    }
};

// 2. STABLE GENERATION: Standard Itinerary Structure
const generateTripItinerary = async (destination, startDate, endDate, budget) => {
    try {
        const liveWeatherContext = await fetchLiveWeather(destination);
        console.log(`[RAG Pipeline] Weather injected for ${destination}: ${liveWeatherContext}`);

        const prompt = `You are a professional travel planner. 
        Plan a ${budget} trip to ${destination} from ${startDate} to ${endDate}. 
        
        CRITICAL CONTEXT: The live weather forecast for this destination is: "${liveWeatherContext}".
        You MUST adapt the activities to this weather (e.g., if it is raining, heavily prioritize indoor museums, cafes, and covered markets).
        Write a specific packing suggestion based on this exact weather.

        Return ONLY a JSON object with this exact structure: 
        { 
          "destination": "${destination}", 
          "weather_and_packing_suggestion": "string", 
          "itinerary": [
            { 
              "day": 1, 
              "theme": "string", 
              "date": "YYYY-MM-DD",
              "activities": [
                { "time": "morning", "place": "string", "description": "string", "estimated_cost": "string" }
              ] 
            }
          ] 
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            response_format: { type: "json_object" }
        });

        const aiContent = chatCompletion.choices[0].message.content;
        return JSON.parse(aiContent);

    } catch (error) {
        console.error("GROQ API ERROR:", error.message);
        throw new Error("Failed to generate trip with AI");
    }
};

module.exports = { generateTripItinerary };