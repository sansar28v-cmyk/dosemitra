import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Plus, Calendar, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
    const location = useLocation();

    if (location.pathname === '/login') return null;

    return (
        <div className="absolute bottom-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
            <nav className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <NavItem to="/" icon={<Home size={22} />} label="Home" />
                <NavItem to="/history" icon={<Calendar size={22} />} label="History" />

                <div className="px-2">
                    <NavLink
                        to="/add"
                        className="group relative w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 rounded-full border border-white/20" />
                        <Plus size={28} />
                    </NavLink>
                </div>

                {/* Replaced Reminder/Alerts with Smart Features "Insights" for next step preparation, or keep alerts? User asked for next step. Let's keep alerts but maybe change icon to Zap for "Actions" or something? Let's stick to Alerts for now but style it better. */}
                <NavItem to="/reminder" icon={<Zap size={22} />} label="Actions" />
                <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
            </nav>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 group ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`
        }
    >
        {({ isActive }) => (
            <>
                <motion.div
                    whileTap={{ scale: 0.8 }}
                    animate={isActive ? { y: -2 } : { y: 0 }}
                >
                    {icon}
                </motion.div>
                <span className={`text-[9px] font-medium mt-0.5 transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute bottom-1'}`}>
                    {label}
                </span>
                {isActive && (
                    <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full"
                    />
                )}
            </>
        )}
    </NavLink>
);

export default Navigation;
