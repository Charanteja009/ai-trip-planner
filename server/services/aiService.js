const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateTripItinerary = async (destination, startDate, endDate, budget) => {
    
    // 1. RAG STEP: Retrieve Real-Time Weather Context
    let weatherContext = "Rely on historical seasonal weather for this time of year.";
    try {
        console.log(`🌤️ Fetching weather context for ${destination}...`);
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
        const response = await fetch(weatherUrl);
        
        if (response.ok) {
            const weatherData = await response.json();
            // Grab a summary of the next few days (temp and conditions)
            const forecasts = weatherData.list.slice(0, 10).map(w => 
                `${w.dt_txt.split(' ')[0]}: ${w.weather[0].description}, ${w.main.temp}°C`
            ).join(' | ');
            
            weatherContext = `Here is the real-time forecast for the upcoming days: ${forecasts}. 
            CRITICAL INSTRUCTION: If the user's trip dates fall within this forecast, you MUST plan outdoor activities on clear/sunny days and indoor activities on rainy/stormy days. If the trip is months in the future, ignore this forecast and use general seasonal averages.`;
        }
    } catch (error) {
        console.error("DETAILED GROQ ERROR:", error.response?.data || error.message || error);
    throw new Error("Failed to generate trip with AI");
    }

    // 2. The Strict System Prompt (Data Contract)
    const systemPrompt = `You are a professional, expert travel planner. You MUST output ONLY valid JSON. Do not include any markdown styling, conversational text, or introductions. 
    
    You must strictly adhere to this exact JSON structure:
    {
      "destination": "${destination}",
      "start_date": "${startDate}",
      "end_date": "${endDate}",
      "estimated_budget_level": "${budget}",
      "weather_and_packing_suggestion": "Specific advice based on the dates and weather.",
      "itinerary": [
        {
          "date": "YYYY-MM-DD",
          "theme": "Theme for the day",
          "expected_weather": "Short guess of weather for this specific day",
          "activities": [
            {
              "time": "Morning",
              "place": "Name of place",
              "description": "Brief description of why to go here",
              "estimated_cost": "Cost in USD"
            }
          ]
        }
      ]
    }`;

    const userPrompt = `Plan a highly optimized trip to ${destination} from ${startDate} to ${endDate} on a ${budget} budget. 
    ${weatherContext}`;

    // 3. The API Call to Groq
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.1-8b-instant', 
            temperature: 0.7,
            response_format: { type: 'json_object' } 
        });

        const aiResponseString = chatCompletion.choices[0].message.content;
        return JSON.parse(aiResponseString);

    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to generate trip with AI");
    }
};

module.exports = { generateTripItinerary };