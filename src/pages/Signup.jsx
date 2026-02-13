import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMedicine } from '../context/MedicineContext';
import { ArrowRight, Smartphone, Mail, Lock, ShieldCheck, User, Eye, EyeOff, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useMedicine();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [shake, setShake] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Validation State
    const [errors, setErrors] = useState({});

    const validate = (field, value) => {
        let newErrors = { ...errors };

        switch (field) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) newErrors.email = "Invalid email format";
                else delete newErrors.email;
                break;
            case 'phone':
                if (value.length !== 10 || isNaN(value)) newErrors.phone = "Must be exactly 10 digits";
                else delete newErrors.phone;
                break;
            case 'password':
                // Strict: Min 8, 1 Upper, 1 Lower, 1 Number
                const strictRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
                if (!strictRegex.test(value)) {
                    newErrors.password = "Min 8 chars, 1 Upper, 1 Lower, 1 Number";
                } else {
                    delete newErrors.password;
                }

                if (formData.confirmPassword && value !== formData.confirmPassword) {
                    newErrors.confirmPassword = "Passwords do not match";
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) newErrors.confirmPassword = "Passwords do not match";
                else delete newErrors.confirmPassword;
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validate(name, value);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation check
        if (Object.keys(errors).length > 0 || !formData.email || !formData.password || !formData.name) {
            triggerShake();
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const result = register(formData);

            if (result && result.success) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 2000);
            } else {
                setErrors({ ...errors, api: result.message || 'Registration failed' });
                setLoading(false);
                triggerShake();
            }
        }, 1500);
    };

    const isValid = Object.keys(errors).length === 0 &&
        formData.email &&
        formData.phone.length === 10 &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword;

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B1220] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0B1220] z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center relative z-10"
                >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                        <CheckCircle size={48} className="text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Access Granted</h2>
                    <p className="text-gray-400 text-lg">Initializing dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 text-white font-[Inter] antialiased overflow-hidden relative selection:bg-blue-500/30">

            {/* --- Cinematic Background --- */}
            <div className="absolute inset-0 bg-[#0B1220] z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '9s' }} />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '2s' }} />

                {/* Heartbeat Line Animation */}
                <div className="absolute bottom-1/4 left-0 right-0 h-64 opacity-10 pointer-events-none overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
                        <path
                            d="M0,100 L400,100 L420,100 L430,60 L440,140 L450,80 L460,120 L470,100 L1200,100"
                            fill="none"
                            stroke="url(#pulseGradient)"
                            strokeWidth="2"
                            className="animate-heartbeat"
                            style={{ animationDelay: '2s' }}
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
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-[420px] relative z-10 ${shake ? 'animate-shake' : ''}`}
            >
                {/* Floating Glow */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl opacity-50 rounded-[32px] animate-float" style={{ animationDelay: '1s' }} />

                <div className="bg-[#111827]/70 backdrop-blur-[25px] border border-white/10 rounded-[24px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/20 mb-4 shadow-inner">
                            <User size={24} className="text-indigo-400" strokeWidth={2} />
                        </div>
                        <h1 className="text-[24px] font-bold tracking-tight text-white mb-1">Create Account</h1>
                        <p className="text-white/60 text-[14px]">Join the future of health</p>
                    </div>

                    {errors.api && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-[8px] flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} /> {errors.api}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-[12px] font-medium text-gray-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Alexander Smith"
                                    className="saas-input pl-10 h-[42px] bg-[#0B1220]/50 border-white/10 focus:border-indigo-500/50"
                                    required
                                />
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-[12px] font-medium text-gray-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="alex@example.com"
                                    className={`saas-input pl-10 h-[42px] bg-[#0B1220]/50 border-white/10 focus:border-indigo-500/50 ${errors.email ? 'border-red-500/50' : ''}`}
                                    required
                                />
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                            {errors.email && <p className="text-red-400 text-[10px] ml-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-[12px] font-medium text-gray-400 ml-1">Phone Number</label>
                            <div className="relative group">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    className={`saas-input pl-10 h-[42px] bg-[#0B1220]/50 border-white/10 focus:border-indigo-500/50 ${errors.phone ? 'border-red-500/50' : ''}`}
                                    required
                                />
                                <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                            {errors.phone && <p className="text-red-400 text-[10px] ml-1">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-[12px] font-medium text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`saas-input pl-10 h-[42px] bg-[#0B1220]/50 border-white/10 focus:border-indigo-500/50 ${errors.password ? 'border-red-500/50' : ''}`}
                                    required
                                />
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-[10px] ml-1">{errors.password}</p>}

                            {/* Strength Meter */}
                            {formData.password && !errors.password && (
                                <div className="flex gap-1 mt-1 h-0.5 opacity-50">
                                    <div className={`flex-1 rounded-full ${formData.password.length > 8 ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                    <div className={`flex-1 rounded-full ${formData.password.length > 10 ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                                    <div className={`flex-1 rounded-full ${formData.password.length > 12 ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-[12px] font-medium text-gray-400 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`saas-input pl-10 h-[42px] bg-[#0B1220]/50 border-white/10 focus:border-indigo-500/50 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                                    required
                                />
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-[10px] ml-1">{errors.confirmPassword}</p>}
                        </div>

                        <motion.button
                            whileHover={!loading && isValid ? { scale: 1.02, boxShadow: "0 0 20px rgba(99,102,241,0.4)" } : {}}
                            whileTap={!loading && isValid ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={loading || !isValid}
                            className="w-full h-[48px] mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[15px] font-semibold rounded-[12px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 border border-white/10 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]" />
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight size={16} /></>
                            )}
                        </motion.button>
                    </form>

                    <div className="flex flex-col items-center gap-4 mt-6 border-t border-white/5 pt-4">
                        <p className="text-[13px] text-gray-500">
                            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:border-b hover:border-indigo-300 pb-0.5 ml-1">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
