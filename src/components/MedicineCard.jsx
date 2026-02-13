import React from 'react';
import { Check, Clock, AlertCircle, Pill, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MedicineCard = ({ medicine, onTake, status = 'pending' }) => {
    const isTaken = status === 'taken';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className={`relative group overflow-hidden rounded-2xl transition-all duration-300 ${isTaken
                    ? 'bg-emerald-900/10 border border-emerald-500/20'
                    : 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/5 hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]'
                }`}
        >
            {/* Background Glow Effect */}
            {!isTaken && (
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            <div className="relative p-5 flex justify-between items-center z-10">
                <div className="flex gap-4 items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isTaken
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-blue-600/10 text-blue-400 group-hover:bg-blue-600/20 group-hover:text-blue-300 transition-colors'
                        }`}>
                        {isTaken ? <Check size={24} strokeWidth={3} /> : <Pill size={24} />}
                    </div>

                    <div>
                        <h3 className={`font-bold text-lg leading-tight mb-1 ${isTaken ? 'text-slate-500 line-through' : 'text-white group-hover:text-blue-200 transition-colors'}`}>
                            {medicine.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs font-medium">
                            <span className={`px-2 py-0.5 rounded-md border ${isTaken ? 'border-emerald-500/20 text-emerald-500/50' : 'border-slate-700 text-slate-400 bg-slate-800/50'}`}>
                                {medicine.dosage}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                                <Clock size={12} /> {medicine.times[0]}
                            </span>
                        </div>
                    </div>
                </div>

                {!isTaken && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTake(medicine.id);
                        }}
                        className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-emerald-500 hover:border-emerald-400 hover:text-white text-slate-400 transition-all duration-300 flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95"
                    >
                        <Check size={20} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* Active Indicator Line */}
            {!isTaken && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            )}
        </motion.div>
    );
};

export default MedicineCard;
