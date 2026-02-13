import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, TrendingUp, AlertTriangle, CheckCircle, Brain, ChevronRight, Shield, Award } from 'lucide-react';
import { useMedicine } from '../context/MedicineContext';

const SmartInsights = () => {
    const navigate = useNavigate();
    const { user, medicines } = useMedicine();

    // Find low stock meds for dynamic insight
    const lowStock = medicines.filter(m => m.quantity <= (m.refillThreshold || 5));

    return (
        <div className="saas-container pb-32">
            <header className="flex items-center gap-4 mb-8 pt-2">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-[10px] bg-[#1F2937] border border-white/5 flex items-center justify-center hover:bg-[#374151] transition-all text-gray-400">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-[20px] font-bold text-white tracking-tight">Health Intelligence</h1>
            </header>

            <div className="space-y-6">
                {/* Main Score Card - Premium Feature Highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#1F2937] to-[#111827] border border-purple-500/20 rounded-[16px] p-6 relative overflow-hidden text-center shadow-lg group"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />

                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-[16px] bg-[#1F2937] border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)] relative z-10">
                        <Brain size={32} />
                    </div>
                    <h2 className="text-[36px] font-bold text-white mb-1 tracking-tight">{user.healthScore}</h2>
                    <p className="text-purple-400 text-[12px] font-bold uppercase tracking-widest mb-4">Wellness Score</p>
                    <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs mx-auto">
                        Your adherence is in the top <span className="text-white font-semibold flex items-center justify-center gap-1 mt-1"><Award size={14} className="text-yellow-500" /> 5% of users</span>. Keep up the great work!
                    </p>
                </motion.div>

                <div>
                    <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-4 px-1">AI Recommendations</h3>
                    <div className="space-y-4">
                        {/* Dynamic Low Stock Insight */}
                        {lowStock.length > 0 ? (
                            lowStock.map(med => (
                                <InsightCard
                                    key={med.id}
                                    icon={<AlertTriangle size={18} />}
                                    color="amber"
                                    title="Refill Prediction"
                                    description={`Based on your usage, you will run out of '${med.name}' in approx ${med.quantity} days.`}
                                    action="Order Now"
                                />
                            ))
                        ) : (
                            <InsightCard
                                icon={<CheckCircle size={18} />}
                                color="blue"
                                title="Stock Levels Healthy"
                                description="You have sufficient medication stock for the next 14 days."
                                action="View Inventory"
                            />
                        )}

                        <InsightCard
                            icon={<TrendingUp size={18} />}
                            color="emerald"
                            title="Optimization Detected"
                            description="Taking 'Metformin' at 8:30 AM aligns better with your breakfast routine based on your log history."
                        />

                        <InsightCard
                            icon={<Shield size={18} />}
                            color="indigo"
                            title="Interaction Check"
                            description="No adverse interactions found between 'Lisinopril' and your new supplements."
                            badge="Verified"
                        />
                    </div>
                </div>

                {/* Achievements Section */}
                <div>
                    <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-4 px-1">Achievements</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="saas-card p-4 flex flex-col items-center text-center opacity-100 border-yellow-500/20 bg-yellow-500/5">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-2">
                                <Award size={20} />
                            </div>
                            <span className="text-white font-semibold text-[13px]">7 Day Streak</span>
                            <span className="text-gray-500 text-[11px]">Unlocked</span>
                        </div>
                        <div className="saas-card p-4 flex flex-col items-center text-center opacity-50 grayscale">
                            <div className="w-10 h-10 rounded-full bg-[#1F2937] text-gray-400 flex items-center justify-center mb-2">
                                <Award size={20} />
                            </div>
                            <span className="text-gray-300 font-semibold text-[13px]">Perfect Month</span>
                            <span className="text-gray-600 text-[11px]">Locked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InsightCard = ({ icon, color, title, description, action, badge }) => {
    const theme = {
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20' },
    };

    const t = theme[color] || theme.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="saas-card p-5 hover:border-white/10 transition-colors group cursor-pointer"
        >
            <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${t.bg} ${t.text}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-white text-[15px] flex items-center gap-2">
                            {title}
                            {badge && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase tracking-wide">{badge}</span>}
                        </h4>
                        <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                    <p className="text-[13px] text-gray-400 leading-relaxed mb-3">{description}</p>
                    {action && (
                        <button className="text-[12px] font-medium text-white bg-[#1F2937] hover:bg-[#374151] px-3 py-1.5 rounded-[8px] transition-colors border border-white/5 hover:border-white/10">
                            {action}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SmartInsights;
