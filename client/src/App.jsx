import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Globe, ShieldCheck } from 'lucide-react';

// Components & Pages
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import TripWizard from './components/TripWizard';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails'; // <--- NEW IMPORT
import { useAuth } from './context/AuthContext';

// --- HOME COMPONENT ---
const Home = () => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-64px)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-brand-accent/5 rounded-full blur-[100px]" />
      </div>

      <section className="max-w-7xl mx-auto px-4 pt-16 pb-32">
        <AnimatePresence mode="wait">
          {!showWizard ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Travel Intelligence
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-brand-dark tracking-tighter leading-[0.9]">
                Plan your next <br />
                <span className="text-brand-accent">masterpiece.</span>
              </h1>

              <p className="mt-8 text-brand-muted text-xl leading-relaxed">
                SkySync combines real-time weather data with Llama 3 intelligence 
                to build itineraries that actually work.
              </p>

              <div className="mt-10 flex justify-center">
                <button 
                  onClick={() => setShowWizard(true)}
                  className="bg-brand-dark text-white px-10 py-4 rounded-2xl font-bold shadow-premium hover:bg-slate-800 transition-all flex items-center gap-2 group"
                >
                  Start Planning
                  <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-premium">
                <div className="flex items-start gap-4 p-4 text-left">
                  <Globe className="text-brand-accent w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-dark text-sm text-left">Global Coverage</h4>
                    <p className="text-xs text-brand-muted">Data for 200k+ cities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 text-left border-y md:border-y-0 md:border-x border-slate-100">
                  <Sparkles className="text-emerald-600 w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-dark text-sm">Llama 3 Core</h4>
                    <p className="text-xs text-brand-muted">Advanced AI reasoning.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 text-left">
                  <ShieldCheck className="text-amber-600 w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-dark text-sm">Weather-Sync</h4>
                    <p className="text-xs text-brand-muted">Real-time forecast integration.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
                <div className="flex justify-center mb-8">
                    <button 
                        onClick={() => setShowWizard(false)}
                        className="text-sm font-bold text-brand-muted hover:text-brand-dark transition-colors px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm"
                    >
                        ← Back to Overview
                    </button>
                </div>
                <TripWizard />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-brand-light font-sans">
        {user && <Navbar />} 
        <Routes>
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/my-trips" element={user ? <MyTrips /> : <Navigate to="/auth" />} />
          {/* NEW ROUTE ADDED HERE */}
          <Route path="/trip/:id" element={user ? <TripDetails /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}