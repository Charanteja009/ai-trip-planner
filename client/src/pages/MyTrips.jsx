import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, PlaneTakeoff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await axios.get('/api/trips/my-trips');
                setTrips(res.data.trips);
            } catch (err) {
                console.error("Error fetching trips", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
            <p className="text-brand-muted font-medium">Retrieving your journeys...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-brand-dark tracking-tighter">My <span className="text-brand-accent">Journeys</span></h1>
                <p className="text-brand-muted mt-2">All your AI-planned adventures in one place.</p>
            </header>

            {trips.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-200">
                    <PlaneTakeoff className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-dark">No trips planned yet</h3>
                    <p className="text-brand-muted mb-6">Your future masterpieces will appear here.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-brand-dark text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        Plan a Trip
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip, index) => (
                        <motion.div 
                            key={trip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2rem] overflow-hidden shadow-premium border border-slate-100 group hover:shadow-2xl transition-all flex flex-col"
                        >
                            <div className="p-8 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-brand-accent/10 p-3 rounded-2xl">
                                        <MapPin className="text-brand-accent w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full text-brand-muted">
                                        {trip.budget_level}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">{trip.destination}</h3>
                                <div className="flex items-center gap-2 text-brand-muted text-sm mb-8 font-medium">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                </div>
                                {/* THE ROUTING BUTTON */}
                                <button 
                                    onClick={() => navigate(`/trip/${trip.id}`, { state: { tripData: trip.trip_data } })}
                                    className="w-full mt-auto py-4 bg-slate-50 text-brand-dark rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-brand-dark group-hover:text-white transition-all"
                                >
                                    View Full Itinerary
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTrips;