import React, { useEffect, useState, useRef } from 'react';
import { useMedicine } from '../context/MedicineContext';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Zap, ChevronRight, Activity, Calendar, AlertTriangle, Flame, ShieldAlert, Phone, TrendingUp, MoreHorizontal, Check } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Premium 3D Card Component ---
const Premium3DCard = ({ children, className = "", onClick, disableTilt = false }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const ref = useRef(null);

    // Smooth spring physics for tilt
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (disableTilt) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                rotateX: disableTilt ? 0 : rotateX,
                rotateY: disableTilt ? 0 : rotateY,
                transformStyle: "preserve-3d"
            }}
            initial={{ scale: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}
            whileTap={{ scale: 0.98 }}
            className={`relative group z-0 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Dynamic Spotlight Effect */}
            <div className="absolute inset-0 z-10 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%)`
                }}
            />
            {children}
        </motion.div>
    );
};


const Home = () => {
    const { medicines, getDailyProgress, user, logs, logDose, emergencyMode, setEmergencyMode, refillMedicine, logs: allLogs } = useMedicine();
    const [progress, setProgress] = useState(0);
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const p = getDailyProgress();
        setProgress(p);
    }, [logs, getDailyProgress]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (animatedProgress < progress) {
                setAnimatedProgress(prev => Math.min(prev + 2, progress));
            } else if (animatedProgress > progress) {
                setAnimatedProgress(prev => Math.max(prev - 2, progress));
            }
        }, 10);
        return () => clearTimeout(timer);
    }, [progress, animatedProgress]);

    const greeting = new Date().getHours() < 12 ? 'Good morning,'
        : new Date().getHours() < 18 ? 'Good afternoon,'
            : 'Good evening,';

    const isTaken = (medId) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return logs.some(l => l.medicineId === medId && l.date === today && l.status === 'taken');
    };

    const lowStockMeds = medicines.filter(m => m.quantity <= (m.refillThreshold || 5));

    const getLast7DaysData = () => {
        const today = new Date();
        const days = eachDayOfInterval({
            start: subDays(today, 6),
            end: today
        });

        return days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayLogs = allLogs.filter(l => l.date === dateStr && l.status === 'taken');
            const val = dayLogs.length > 0 ? (dayLogs.length / Math.max(1, medicines.length)) * 100 : Math.floor(Math.random() * 60) + 20;
            return {
                day: format(day, 'EEE'),
                value: val,
                isToday: isSameDay(day, today)
            };
        });
    };

    const chartData = getLast7DaysData();

    // Helper to update mouse vars for spotlight
    const handleSpotlightMove = (e) => {
        const cards = document.querySelectorAll('.group');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleSpotlightMove);
        return () => window.removeEventListener('mousemove', handleSpotlightMove);
    }, []);

    return (
        <div className="saas-container pb-32">

            <AnimatePresence>
                {emergencyMode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-red-900/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#111827] border-2 border-red-500 rounded-[24px] p-8 max-w-sm text-center shadow-[0_0_50px_rgba(239,68,68,0.5)]"
                        >
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <ShieldAlert size={40} className="text-red-500" />
                            </div>
                            <h2 className="text-[24px] font-bold text-white mb-2">Safety Alert</h2>
                            <p className="text-gray-400 mb-8">We noticed you missed 3 consecutive doses. Are you feeling okay?</p>
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-[12px] mb-3 flex items-center justify-center gap-2">
                                <Phone size={18} /> Call Emergency Contact
                            </button>
                            <button
                                onClick={() => setEmergencyMode(false)}
                                className="w-full bg-[#1F2937] text-white font-medium py-3 rounded-[12px]"
                            >
                                I'm Okay, Dismiss
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="flex justify-between items-center mb-8 pt-4 animate-fade-in">
                <div>
                    <h2 className="text-blue-200/60 text-[14px] font-medium mb-1">{greeting}</h2>
                    <h1 className="text-[28px] font-bold text-white tracking-tight">
                        {user.name}
                    </h1>
                </div>
                <Link to="/profile" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-[12px] bg-[#1F2937] border border-white/10 overflow-hidden shadow-sm group-hover:border-blue-500/50 transition-colors">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} alt="User" />
                    </div>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                {/* 1. Large Circular Progress */}
                <Premium3DCard className="col-span-1 md:col-span-2 lg:col-span-2 saas-card p-6 relative overflow-hidden flex items-center justify-between min-h-[180px] bg-gradient-to-br from-[#1F2937]/50 to-blue-900/10 border-blue-500/10">
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[80px]" />

                    <div className="flex flex-col justify-center gap-1 z-10">
                        <h3 className="text-[14px] font-medium text-blue-200/70 uppercase tracking-wider">Today's Focus</h3>
                        <div className="text-[36px] font-bold text-white leading-tight mb-2">
                            {medsRemaining(medicines, logs) === 0 ? "All Clear" : `${medsRemaining(medicines, logs)} Meds Left`}
                        </div>
                        <p className="text-[14px] text-gray-400 max-w-[200px]">
                            {medsRemaining(medicines, logs) === 0
                                ? "Great job! You've completed all your doses for today."
                                : "Keep it up! Consistency is key to your health journey."}
                        </p>
                    </div>

                    <div className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] shrink-0" style={{ transform: 'translateZ(20px)' }}>
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#1F2937" strokeWidth="8" strokeLinecap="round" />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * animatedProgress) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[28px] md:text-[32px] font-bold text-white tracking-tight">{Math.round(animatedProgress)}%</span>
                        </div>
                    </div>
                </Premium3DCard>

                {/* 2. Stats Column */}
                <div className="col-span-1 flex flex-col gap-4">
                    <Premium3DCard className="saas-card p-5 flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-transparent border-orange-500/10">
                        <div>
                            <div className="text-[12px] font-medium text-orange-200/60 uppercase tracking-wider mb-1">Current Streak</div>
                            <div className="text-[24px] font-bold text-white flex items-center gap-2">
                                {user.streak || 0} <span className="text-[14px] font-normal text-orange-400">Days</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-[14px] bg-orange-500/10 flex items-center justify-center border border-orange-500/20" style={{ transform: 'translateZ(10px)' }}>
                            <Flame size={24} className="text-orange-500 fill-orange-500/20 animate-pulse" />
                        </div>
                    </Premium3DCard>

                    <Premium3DCard className="saas-card p-5 flex flex-col justify-between flex-1 bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/10">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-[12px] font-medium text-emerald-200/60 uppercase tracking-wider mb-1">Health Score</div>
                                <div className="text-[24px] font-bold text-white">{user.healthScore}</div>
                            </div>
                            <Activity size={20} className="text-emerald-500" style={{ transform: 'translateZ(10px)' }} />
                        </div>
                        <div className="mt-2">
                            <div className="w-full h-1 bg-[#1F2937] rounded-full overflow-hidden mb-1.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${user.healthScore}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                            <p className="text-[11px] text-emerald-400/80">Top 5% of users this week</p>
                        </div>
                    </Premium3DCard>
                </div>
            </div>

            {/* Weekly Activity Graph */}
            <Premium3DCard disableTilt className="saas-card p-6 mb-8 bg-[#111827]/80">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[16px] font-semibold text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500" /> Weekly Activity
                    </h3>
                    <select className="bg-[#1F2937] border border-white/10 text-[12px] text-gray-400 rounded-[8px] px-2 py-1 outline-none">
                        <option>Last 7 Days</option>
                        <option>This Month</option>
                    </select>
                </div>

                <div className="h-[180px] w-full" style={{ transform: 'translateZ(0)' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#E5E7EB', fontSize: '13px', fontWeight: 500 }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={28}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isToday ? '#3B82F6' : '#1F2937'}
                                        stroke={entry.isToday ? 'none' : 'rgba(255,255,255,0.05)'}
                                        strokeWidth={1}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Premium3DCard>

            <AnimatePresence>
                {lowStockMeds.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-8 space-y-3"
                    >
                        {lowStockMeds.map(med => (
                            <Premium3DCard key={med.id} className="bg-amber-900/10 border border-amber-500/20 rounded-[16px] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[10px] bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" style={{ transform: 'translateZ(10px)' }}>
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-semibold text-white">Low Stock Alert</p>
                                        <p className="text-[12px] text-amber-200/60">Only {med.quantity} {med.name} pills remaining.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => refillMedicine(med.id)}
                                    className="px-4 py-2 bg-amber-500 text-white text-[12px] font-bold rounded-[8px] hover:bg-amber-600 transition-colors shadow-lg shadow-amber-900/20 pointer-events-auto"
                                >
                                    Refill Now
                                </button>
                            </Premium3DCard>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-end mb-6">
                <h3 className="text-[18px] font-bold text-white tracking-tight">Today's Schedule</h3>
                <Link to="/add" className="text-[13px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors px-3 py-1.5 bg-blue-500/10 rounded-[8px] border border-blue-500/20 hover:bg-blue-500/20">
                    <Plus size={14} /> Add Medicine
                </Link>
            </div>

            <div className="space-y-4">
                {medicines.map((med, index) => (
                    <motion.div
                        key={med.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.5 }}
                    >
                        <Premium3DCard className={`saas-card p-5 transition-all duration-300 group ${isTaken(med.id) ? 'bg-[#111827]/40 border-emerald-500/20 opacity-70' : 'hover:border-blue-500/30'}`}>
                            <div className="flex justify-between items-center relative z-10" style={{ transform: 'translateZ(20px)' }}>
                                <div className="flex gap-4 items-center">
                                    <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center text-[20px] font-bold shadow-inner transition-colors duration-500 ${isTaken(med.id) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#1F2937] text-gray-300 group-hover:bg-blue-500/10 group-hover:text-blue-400'}`}>
                                        {med.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className={`text-[16px] font-bold mb-1 transition-colors ${isTaken(med.id) ? 'text-gray-500 line-through' : 'text-white group-hover:text-blue-100'}`}>{med.name}</h4>
                                        <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
                                            <span className="bg-white/5 px-2 py-0.5 rounded-[4px]">{med.dosage}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-700" />
                                            <span>{med.times[0]}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        !isTaken(med.id) && logDose(med.id, 'taken');
                                    }}
                                    disabled={isTaken(med.id)}
                                    className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-300 pointer-events-auto ${isTaken(med.id)
                                        ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-90'
                                        : 'bg-[#1F2937] text-gray-400 hover:text-white hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 border border-white/5'
                                        }`}
                                >
                                    {isTaken(med.id) ? <Check size={22} strokeWidth={3} /> : <div className="w-4 h-4 rounded-full border-2 border-current opacity-50 group-hover:opacity-100" />}
                                </button>
                            </div>
                        </Premium3DCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Helper
const medsRemaining = (medicines, logs) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const takenCount = logs.filter(l => l.date === today && l.status === 'taken').length;
    let totalDoses = 0;
    medicines.forEach(m => totalDoses += m.times.length);
    return Math.max(0, totalDoses - takenCount);
};

export default Home;
