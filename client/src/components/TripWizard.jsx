import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, CircleDollarSign, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import ItineraryDisplay from './ItineraryDisplay';

const TripWizard = () => {
    // 1. All States Declared at the Top
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [itineraryData, setItineraryData] = useState(null);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: 'moderate'
    });

    // 2. The API Call & Data Guard
    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/trips/generate', formData);
            
            // Extract and parse the data safely
            const rawResponse = res.data.trip.trip_data;
            const parsedData = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

            // Normalize structure just in case AI wraps it differently
            const finalData = parsedData.itinerary ? parsedData : (parsedData.trip || parsedData.plan);

            if (finalData && finalData.itinerary) {
                setItineraryData(finalData);
            } else {
                throw new Error("Invalid AI Response Format");
            }
        } catch (err) {
            console.error("Generation Error:", err);
            alert("Failed to generate trip. The AI might be overloaded. Try again!");
        } finally {
            setLoading(false);
        }
    };

    // 3. Navigation Helpers
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    // 4. THE VIEW SWITCHER
    // If we have AI data, show the beautiful timeline instead of the form
    if (itineraryData) {
        return <ItineraryDisplay tripData={itineraryData} />;
    }

    // 5. THE MULTI-STEP WIZARD UI
    return (
        <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 flex">
                    <motion.div 
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="h-full bg-brand-accent transition-all"
                    />
                </div>

                <div className="p-10 md:p-14">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-brand-dark tracking-tighter">Where to?</h2>
                                    <p className="text-brand-muted font-medium">Enter a city, and our AI will handle the rest.</p>
                                </div>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-accent group-focus-within:scale-110 transition-transform" />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Kyoto, Japan"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-accent/20 focus:bg-white rounded-2xl outline-none text-xl font-bold transition-all shadow-inner"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                    />
                                </div>
                                <button 
                                    disabled={!formData.destination}
                                    onClick={nextStep}
                                    className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next: Select Dates <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-brand-dark tracking-tighter">When are you going?</h2>
                                    <p className="text-brand-muted font-medium">We'll check the forecast for these exact dates.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-muted px-2">Departure</label>
                                        <input 
                                            type="date"
                                            className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none outline-none font-semibold focus:ring-2 focus:ring-brand-accent/20 text-slate-700"
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-muted px-2">Return</label>
                                        <input 
                                            type="date"
                                            className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none outline-none font-semibold focus:ring-2 focus:ring-brand-accent/20 text-slate-700"
                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={prevStep} className="flex-1 py-4 font-bold text-brand-muted hover:text-brand-dark transition-colors">Back</button>
                                    <button 
                                        onClick={nextStep} 
                                        disabled={!formData.startDate || !formData.endDate}
                                        className="flex-[2] py-4 bg-brand-dark text-white rounded-xl font-bold disabled:opacity-50 transition-all"
                                    >
                                        Next: Budget
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-brand-dark tracking-tighter">Set your budget</h2>
                                    <p className="text-brand-muted font-medium">AI will adjust activity costs accordingly.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {['budget', 'moderate', 'luxury'].map((lvl) => (
                                        <button
                                            key={lvl}
                                            onClick={() => setFormData({...formData, budget: lvl})}
                                            className={`py-6 rounded-2xl border-2 transition-all capitalize font-bold flex flex-col items-center gap-2 ${
                                                formData.budget === lvl 
                                                ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' 
                                                : 'border-slate-100 text-brand-muted hover:border-slate-200'
                                            }`}
                                        >
                                            <CircleDollarSign className="w-6 h-6" />
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <button onClick={prevStep} className="flex-1 py-5 font-bold text-brand-muted hover:text-brand-dark transition-colors">Back</button>
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="flex-[2] py-5 bg-brand-accent text-white rounded-2xl font-black text-lg shadow-lg shadow-brand-accent/30 hover:brightness-110 flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Consulting AI...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-6 h-6" />
                                                Generate Itinerary
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TripWizard;