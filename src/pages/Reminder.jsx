import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, Bell, X, Pill } from 'lucide-react';
import { useMedicine } from '../context/MedicineContext';

const Reminder = () => {
    const navigate = useNavigate();
    const { medicines, logDose } = useMedicine();
    const [activeMed, setActiveMed] = useState(null);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        // Pick the first medicine for demo purposes
        if (medicines.length > 0) {
            setActiveMed(medicines[0]);
        }
    }, [medicines]);

    const handleTake = () => {
        setComplete(true);
        setTimeout(() => {
            if (activeMed) logDose(activeMed.id, 'taken');
            navigate('/');
        }, 1500);
    };

    const handleSnooze = () => {
        navigate('/');
    };

    if (!activeMed) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center bg-[#0B1220] text-gray-400">
            <div>
                <p className="mb-4">No scheduled reminders.</p>
                <button onClick={() => navigate('/')} className="text-blue-500 hover:text-blue-400 font-medium transition-colors">Return Home</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
            {/* Premium Blur Backdrop */}
            <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-xl transition-all duration-1000" />

            {/* Background Pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <div className="w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse duration-[4s]" />
            </div>

            <AnimatePresence>
                {!complete ? (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-[400px] bg-[#111827] border border-white/10 rounded-[24px] shadow-2xl p-8 text-center"
                    >
                        {/* Icon Container */}
                        <div className="mb-8 relative inline-block">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-[20px] flex items-center justify-center shadow-inner border border-white/5 relative z-10">
                                <Pill size={40} className="text-blue-500 transform rotate-45" strokeWidth={1.5} />
                            </div>
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-[20px] -z-10 animate-pulse" />
                        </div>

                        <div className="mb-10">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[12px] font-semibold tracking-wide uppercase mb-3 border border-blue-500/20">
                                Time to take
                            </span>
                            <h1 className="text-[28px] font-bold text-white mb-2 tracking-tight leading-tight">{activeMed.name}</h1>
                            <p className="text-gray-400 text-[16px] font-medium">
                                {activeMed.dosage} • <span className="text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ y: -2, boxShadow: '0 8px 25px -8px rgba(37, 99, 235, 0.5)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleTake}
                                className="w-full h-[56px] bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-[16px] font-semibold text-[18px] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 transition-all border-t border-white/10"
                            >
                                <Check size={20} strokeWidth={2.5} /> Mark as Taken
                            </motion.button>

                            <button
                                onClick={handleSnooze}
                                className="w-full h-[50px] bg-transparent text-gray-400 hover:text-white font-medium text-[16px] rounded-[16px] transition-colors flex items-center justify-center gap-2 hover:bg-white/5"
                            >
                                <Clock size={18} /> Snooze for 10 min
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="flex flex-col items-center justify-center z-10"
                    >
                        <div className="w-[120px] h-[120px] bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] mb-8 relative">
                            <Check size={48} className="text-white drop-shadow-sm" strokeWidth={3} />
                            <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping opacity-50" />
                        </div>
                        <h2 className="text-[32px] font-bold text-white mb-2 tracking-tight">All set!</h2>
                        <p className="text-emerald-400/80 text-[18px] font-medium">Streak maintained.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Reminder;
