import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMedicine } from '../context/MedicineContext';
import { ArrowRight, Smartphone, Mail, Lock, ShieldCheck, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useMedicine();
    const [method, setMethod] = useState('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shake, setShake] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        setTimeout(() => {
            const result = login(formData.email, formData.password);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                setLoading(false);
                triggerShake();
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 text-white font-[Inter] antialiased overflow-hidden relative selection:bg-blue-500/30">

            {/* --- Cinematic Background --- */}
            <div className="absolute inset-0 bg-[#0B1220] z-0">
                {/* Aurora Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />

                {/* Heartbeat Line Animation */}
                <div className="absolute top-1/2 left-0 right-0 h-64 -translate-y-1/2 opacity-20 pointer-events-none overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
                        <path
                            d="M0,100 L400,100 L420,100 L430,60 L440,140 L450,80 L460,120 L470,100 L1200,100"
                            fill="none"
                            stroke="url(#pulseGradient)"
                            strokeWidth="2"
                            className="animate-heartbeat"
                        />
                        <defs>
                            <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="30%" stopColor="transparent" />
                                <stop offset="35%" stopColor="#3B82F6" />
                                <stop offset="40%" stopColor="transparent" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
            </div>

            {/* --- Login Card --- */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-[440px] relative z-10 ${shake ? 'animate-shake' : ''}`}
            >
                {/* Floating Glow Behind */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl opacity-50 rounded-[32px] animate-float" />

                <div className="bg-[#111827]/70 backdrop-blur-[25px] border border-white/10 rounded-[24px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] p-10 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">

                    {/* Inner sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-[20px] border border-blue-500/30 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] relative"
                        >
                            <Activity size={32} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <div className="absolute inset-0 rounded-[20px] ring-1 ring-white/20" />
                        </motion.div>

                        <h1 className="text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tight mb-2 drop-shadow-lg">
                            DoseMitra
                        </h1>
                        <p className="text-blue-200/60 text-[15px] tracking-wide font-medium">Healthcare for the future</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, mb: 0 }}
                                animate={{ opacity: 1, height: 'auto', mb: 24 }}
                                exit={{ opacity: 0, height: 0, mb: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 flex items-center gap-3 text-red-400 text-sm overflow-hidden"
                            >
                                <AlertCircle size={16} className="shrink-0" /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Method Toggle */}
                    <div className="grid grid-cols-2 p-1.5 bg-[#0B1220]/50 border border-white/5 rounded-[16px] mb-8 relative">
                        <motion.div
                            className="absolute top-1.5 bottom-1.5 bg-[#1F2937] border border-white/10 rounded-[12px] shadow-sm"
                            layoutId="activeTab"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                left: method === 'phone' ? '6px' : '50%',
                                right: method === 'phone' ? '50%' : '6px',
                                width: 'calc(50% - 12px)'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setMethod('phone')}
                            className={`py-2.5 rounded-[12px] text-[13px] font-medium transition-colors relative z-10 ${method === 'phone' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Phone
                        </button>
                        <button
                            type="button"
                            onClick={() => setMethod('email')}
                            className={`py-2.5 rounded-[12px] text-[13px] font-medium transition-colors relative z-10 ${method === 'email' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Email
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-blue-100/70 ml-1">
                                {method === 'phone' ? 'Mobile Number' : 'Work Email'}
                            </label>
                            <div className="relative group">
                                <input
                                    type={method === 'phone' ? 'tel' : 'email'}
                                    name={method === 'phone' ? 'phone' : 'email'}
                                    value={method === 'phone' ? formData.phone : formData.email}
                                    onChange={handleChange}
                                    placeholder={method === 'phone' ? '+1 (555) 000-0000' : 'name@company.com'}
                                    className="saas-input pl-11 bg-[#0B1220]/50 border-white/10 focus:border-blue-500/50 focus:bg-[#0B1220] transition-all duration-300"
                                    required
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300">
                                    {method === 'phone' ? <Smartphone size={18} /> : <Mail size={18} />}
                                </div>
                            </div>
                        </div>

                        {method === 'email' && (
                            <div className="space-y-2">
                                <label className="text-[13px] font-medium text-blue-100/70 ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="saas-input pl-11 bg-[#0B1220]/50 border-white/10 focus:border-blue-500/50 focus:bg-[#0B1220] transition-all duration-300"
                                        required
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300">
                                        <Lock size={18} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <motion.button
                            whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 20px rgba(37,99,235,0.4)" } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={loading}
                            className="w-full h-[52px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-[14px] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 border border-white/10 relative overflow-hidden mt-2"
                        >
                            {/* Shiny effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]" />

                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </motion.button>
                    </form>

                    <div className="flex flex-col items-center gap-6 mt-10">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="flex flex-col items-center gap-2">
                            <a href="#" className="text-[13px] text-gray-500 hover:text-blue-400 transition-colors">Forgot password?</a>
                            <p className="text-[14px] text-gray-400">
                                Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors ml-1">Get started</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
