import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MedicineProvider, useMedicine } from './context/MedicineContext';
import Navigation from './components/Navigation';

import Home from './pages/Home';
import AddMedicine from './pages/AddMedicine';
import Reminder from './pages/Reminder';
import History from './pages/History';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SmartInsights from './pages/SmartInsights';

const RequireAuth = ({ children }) => {
  const { user } = useMedicine();
  if (!user.loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import ChatAssistant from './components/ChatAssistant';

const AppContent = () => {
  const location = useLocation();
  const hideNav = ['/login', '/reminder', '/signup'].includes(location.pathname);

  return (
    <div className="mx-auto max-w-[480px] h-[100dvh] bg-[#020617] relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-sans text-slate-100 border-x border-white/5">

      {/* Global Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-20%] w-[150%] h-[150%] bg-emerald-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[30%] w-[100%] h-[100%] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        {/* Starfield noise texture */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.15\'/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar pb-28">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />

            <Route path="/" element={<RequireAuth><PageWrapper><Home /></PageWrapper></RequireAuth>} />
            <Route path="/add" element={<RequireAuth><PageWrapper><AddMedicine /></PageWrapper></RequireAuth>} />
            <Route path="/reminder" element={<RequireAuth><PageWrapper><Reminder /></PageWrapper></RequireAuth>} />
            <Route path="/history" element={<RequireAuth><PageWrapper><History /></PageWrapper></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><PageWrapper><Profile /></PageWrapper></RequireAuth>} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Overlays (Fixed to Mobile Frame) */}
      {!hideNav && (
        <>
          <Navigation />
        </>
      )}
    </div>
  );
};

// Page Transition Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="min-h-full"
  >
    {children}
  </motion.div>
);


function App() {
  return (
    <MedicineProvider>
      <AppContent />
    </MedicineProvider>
  );
}

export default App;
