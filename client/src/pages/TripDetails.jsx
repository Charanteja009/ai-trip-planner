import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ItineraryDisplay from '../components/ItineraryDisplay';

const TripDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Grab the data passed from the MyTrips page button
    const rawData = location.state?.tripData;

    // Safety fallback: If user refreshes the page, send them back to the list
    if (!rawData) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Trip details unavailable</h2>
                <p className="text-brand-muted mb-8">Please select a trip from your journeys page.</p>
                <button 
                    onClick={() => navigate('/my-trips')}
                    className="px-8 py-4 bg-brand-dark text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                    Return to My Journeys
                </button>
            </div>
        );
    }

    // Safely parse the JSON data from PostgreSQL
    const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    const finalData = parsedData.itinerary ? parsedData : (parsedData.trip || parsedData.plan);

    return (
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-dark transition-colors px-5 py-2.5 bg-white rounded-full border border-slate-200 shadow-sm w-fit"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Journeys
            </button>
            
            <ItineraryDisplay tripData={finalData} />
        </div>
    );
};

export default TripDetails;