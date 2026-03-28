const fetchWeatherFromAPI = async (city) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found or error fetching weather data');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    return {
        current: {
            temp: currentData.main.temp,
            feels_like: currentData.main.feels_like,
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
            humidity: currentData.main.humidity,
            wind_speed: currentData.wind.speed
        },
        // Fix: Ensure 'item' is strictly scoped inside this map
        forecast: forecastData.list.map((item) => {
            return {
                datetime: item.dt_txt,
                temp: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                rain_chance: Math.round((item.pop || 0) * 100) // Added rain chance safety check
            };
        }),
        city_info: {
            name: forecastData.city.name,
            country: forecastData.city.country
        }
    };
};

module.exports = { fetchWeatherFromAPI };