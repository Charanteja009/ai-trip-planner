import { Plane, User, LogOut, Map, Calendar, CloudSun } from 'lucide-react'; // Added CloudSun
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Plane className="text-brand-accent w-8 h-8" />
            </motion.div>
            <span className="text-xl font-bold tracking-tighter text-brand-dark">
              Sky<span className="text-brand-accent">Sync</span>
            </span>
          </Link>

          {/* Navigation Links - Balanced with Weather integrated */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-brand-muted hover:text-brand-accent transition-all">
              <Map className="w-4 h-4" />
              Plan Trip
            </Link>

            {/* NEW: Weather Link */}
            <Link to="/weather" className="flex items-center gap-1.5 text-sm font-semibold text-brand-muted hover:text-brand-accent transition-all">
              <CloudSun className="w-4 h-4" />
              Weather
            </Link>

            <Link to="/my-trips" className="flex items-center gap-1.5 text-sm font-semibold text-brand-muted hover:text-brand-accent transition-all">
              <Calendar className="w-4 h-4" />
              My Journeys
            </Link>
          </div>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-bold text-brand-dark">{user?.name || 'Explorer'}</span>
              <span className="text-[10px] text-brand-muted uppercase tracking-widest font-medium">Premium Member</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-brand-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;