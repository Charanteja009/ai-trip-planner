import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Wind, Droplets, CloudRain, MapPin, Loader2, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherPage = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleSearch(null, "Dharmavaram");
    }, []);

    const handleSearch = async (e, customCity) => {
        if (e) e.preventDefault();
        const searchCity = customCity || city;
        if (!searchCity) return;

        setLoading(true);
        try {
            const res = await axios.get(`/api/weather/${searchCity}`);
            setWeather(res.data.data);
        } catch (err) {
            alert("Location not found");
        } finally {
            setLoading(false);
        }
    };

    // To make them look balanced, we'll take the full forecast list for Hourly
    const hourlyForecast = weather?.forecast || [];
    const dailyForecast = weather?.forecast?.filter(item => item.datetime.includes("12:00:00")) || [];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans">
            
            {/* 1. CENTERED SEARCH HEADER */}
            <div className="pt-16 pb-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-6 text-blue-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">SkySync Terminal</span>
                    </motion.div>

                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search destination..."
                            className="w-full pl-16 pr-36 py-5 bg-white border border-slate-200 rounded-[2.5rem] text-lg focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-xl shadow-slate-200/50 outline-none"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-8 rounded-[1.8rem] font-bold text-xs hover:bg-blue-600 transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'LOCATE'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    {weather ? (
                        <div className="space-y-12">
                            {/* 2. MAIN HUB CARD */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center">
                                <h2 className="text-7xl font-black text-slate-900 tracking-tighter mb-2">{weather.city_info.name}</h2>
                                <p className="text-sm text-slate-400 font-black uppercase tracking-[0.3em] mb-10">{weather.city_info.country}</p>
                                
                                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                                    <img src={`https://openweathermap.org/img/wn/${weather.current.icon}@4x.png`} className="w-56 h-56" alt="Icon" />
                                    <div className="text-center md:text-left">
                                        <div className="text-[10rem] font-black text-slate-900 leading-none tracking-tighter flex">
                                            {Math.round(weather.current.temp)}<span className="text-blue-500 text-6xl mt-6">°</span>
                                        </div>
                                        <p className="text-xl font-bold text-slate-300 uppercase tracking-widest -mt-4">{weather.current.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-2">Humidity</p>
                                        <p className="text-2xl font-black">{weather.current.humidity}%</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-2">Wind</p>
                                        <p className="text-2xl font-black">{weather.current.wind_speed} <small className="text-xs">m/s</small></p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 3. SYMMETRICAL VERTICAL LISTS */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                
                                {/* HOURLY FORECAST BOX */}
                                <div className="bg-white rounded-[3.5rem] p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-3 mb-8 px-4">
                                        <div className="p-2 bg-blue-50 rounded-xl"><Clock className="w-5 h-5 text-blue-600" /></div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hourly Step</h3>
                                    </div>
                                    
                                    {/* FIXED HEIGHT + SCROLL */}
                                    <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        {hourlyForecast.map((hour, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                                                <span className="w-20 text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors">
                                                    {new Date(hour.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <img src={`https://openweathermap.org/img/wn/${hour.icon}.png`} className="w-10 h-10" alt="icon" />
                                                <div className="flex-1 text-center"><span className="text-[10px] font-black text-blue-500">☔ {hour.rain_chance}%</span></div>
                                                <span className="text-2xl font-black text-slate-900 w-12 text-right">{Math.round(hour.temp)}°</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* DAILY FORECAST BOX */}
                                <div className="bg-white rounded-[3.5rem] p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-3 mb-8 px-4">
                                        <div className="p-2 bg-emerald-50 rounded-xl"><Calendar className="w-5 h-5 text-emerald-600" /></div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Extended Outlook</h3>
                                    </div>

                                    {/* SAME FIXED HEIGHT + SCROLL */}
                                    <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        {dailyForecast.map((day, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                                <span className="w-24 text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors">
                                                    {new Date(day.datetime).toLocaleDateString([], { weekday: 'long' })}
                                                </span>
                                                <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} className="w-12 h-12" alt="icon" />
                                                <div className="flex-1 px-4 text-center">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate">{day.description}</span>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-[10px] font-black text-blue-500">☔ {day.rain_chance}%</span>
                                                    <span className="text-2xl font-black text-slate-900 w-12 text-right">{Math.round(day.temp)}°</span>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Added a filler message if the daily list is short */}
                                        <div className="p-10 text-center opacity-20 font-black text-[10px] uppercase tracking-[0.5em] pt-20">
                                            End of Forecast
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40">
                            <Loader2 className="w-10 h-10 text-slate-200 animate-spin mb-4" />
                            <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.5em]">Fetching Skies...</p>
                        </div>
                    )}
                </AnimatePresence>

                {/* CSS for a beautiful thin scrollbar */}
                <style dangerouslySetInnerHTML={{ __html: `
                    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                `}} />
            </div>
        </div>
    );
};

export default WeatherPage;