import { motion } from 'framer-motion';
import { Sun, CloudRain, Clock, DollarSign, MapPin, Sparkles } from 'lucide-react';

const ItineraryDisplay = ({ tripData }) => {
    // Safety check: Ensure tripData and itinerary exist before rendering
    if (!tripData || !tripData.itinerary) {
        return (
            <div className="max-w-4xl mx-auto p-10 bg-white rounded-3xl shadow-premium text-center">
                <Sparkles className="w-10 h-10 text-brand-accent mx-auto mb-4" />
                <h2 className="text-xl font-bold text-brand-dark">Building your masterpiece...</h2>
                <p className="text-brand-muted mt-2">If this takes too long, please try refreshing.</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto pb-20"
        >
            {/* 1. Header & Weather Summary */}
            <div className="bg-brand-dark text-white rounded-[2.5rem] p-10 md:p-14 mb-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-brand-accent mb-4">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">AI Generated Plan</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
                        {tripData.destination}
                    </h1>
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <CloudRain className="w-6 h-6 text-brand-accent" />
                        <div className="max-w-md">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Weather Advice</p>
                            <p className="text-sm font-medium leading-tight">
                                {tripData.weather_and_packing_suggestion || "Check local forecast before departure."}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-[100px]" />
            </div>

            {/* 2. The Timeline (Cleaned and Safely Chained) */}
            <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {tripData?.itinerary?.map((day, dIdx) => (
                    <motion.div 
                        key={dIdx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative pl-12"
                    >
                        {/* The "Day" Dot */}
                        <div className="absolute left-0 top-1 w-9 h-9 bg-white border-4 border-brand-accent rounded-full z-10 flex items-center justify-center shadow-sm">
                            <span className="text-[10px] font-black text-brand-dark">{day?.day || dIdx + 1}</span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-brand-dark tracking-tight">{day?.theme || "Exploring"}</h3>
                            <p className="text-brand-muted text-sm font-semibold uppercase tracking-wide">
                                {day?.date ? new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : `Day ${dIdx + 1}`}
                            </p>
                        </div>

                        {/* Activity Cards */}
                        <div className="grid gap-4">
                            {day?.activities?.map((act, aIdx) => (
                                <motion.div 
                                    key={aIdx}
                                    whileHover={{ x: 10, borderColor: 'var(--color-brand-accent)' }}
                                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col md:flex-row md:items-center gap-6 group transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-brand-accent" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-brand-muted">{act?.time || "Anytime"}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-brand-dark group-hover:text-brand-accent transition-colors">
                                            {act?.place || "Surprise Location"}
                                        </h4>
                                        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{act?.description || "Enjoy the sights."}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl shrink-0">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-bold text-slate-700">{act?.estimated_cost || "Varies"}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 3. Footer Action */}
            <div className="mt-16 flex justify-center">
                <button 
                    onClick={() => window.location.reload()} 
                    className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-brand-dark rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Sparkles className="w-4 h-4 text-brand-accent" />
                    Plan Another Adventure
                </button>
            </div>
        </motion.div>
    );
};

export default ItineraryDisplay;