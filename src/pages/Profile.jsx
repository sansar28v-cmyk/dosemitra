import React, { useState } from 'react';
import { useMedicine } from '../context/MedicineContext';
import { User, Settings, Shield, Moon, Bell, LogOut, ChevronRight, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useMedicine();
    const [darkMode, setDarkMode] = useState(true);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleLogout = () => {
        setUser({ ...user, loggedIn: false });
        navigate('/login');
    };

    const handleFeatureClick = (feature) => {
        if (feature === 'Personal Details') {
            setModalContent({
                title: 'Personal Details',
                data: [
                    { label: 'Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Member ID', value: '#82941' },
                    { label: 'Plan', value: 'Pro Member' }
                ]
            });
            setShowModal(true);
        } else if (feature === 'App Settings') {
            setModalContent({
                title: 'App Settings',
                data: [
                    { label: 'Version', value: '2.1.0' },
                    { label: 'Build', value: 'Mobile Release' },
                    { label: 'Data Saver', value: 'Enabled' },
                    { label: 'Privacy Policy', value: 'dosemitra.com/privacy' }
                ]
            });
            setShowModal(true);
        } else {
            console.log(`Clicked ${feature}`);
            alert(`${feature} feature coming soon!`);
        }
    };

    return (
        <div className="saas-container relative">
            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#1f2937] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{modalContent?.title}</h3>
                            <button onClick={() => setShowModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                                <ChevronRight size={20} className="rotate-90" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {modalContent?.data.map((item, idx) => (
                                <div key={idx} className="flex flex-col bg-black/20 p-3 rounded-lg border border-white/5">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{item.label}</span>
                                    <span className="text-white font-medium text-[15px]">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}

            <header className="mb-8 pt-2">
                <h1 className="text-[20px] font-bold text-white tracking-tight">Account</h1>
            </header>

            {/* Profile Card - SaaS Style */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="saas-card mb-8 flex items-center gap-5 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-600/20 transition-all" />

                <div className="relative">
                    <div className="w-16 h-16 rounded-[12px] bg-[#1F2937] p-1 border border-white/5">
                        <div className="w-full h-full rounded-[8px] overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-[#111827] flex items-center justify-center">
                        <Zap size={10} className="text-white fill-current" />
                    </div>
                </div>

                <div>
                    <h2 className="text-[18px] font-bold text-white mb-0.5">{user.name}</h2>
                    <p className="text-gray-400 text-[13px] font-medium">Pro Member • <span className="text-blue-400">ID: #82941</span></p>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#111827] p-5 rounded-[12px] border border-white/10 flex flex-col items-center justify-center text-center shadow-md">
                    <Award size={20} className="text-yellow-500 mb-2" />
                    <span className="text-[20px] font-bold text-white">12</span>
                    <span className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">Streak</span>
                </div>
                <div className="bg-[#111827] p-5 rounded-[12px] border border-white/10 flex flex-col items-center justify-center text-center shadow-md">
                    <Shield size={20} className="text-emerald-500 mb-2" />
                    <span className="text-[20px] font-bold text-white">98%</span>
                    <span className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">Score</span>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 px-1">General</h3>
                    <div className="bg-[#111827] rounded-[12px] border border-white/5 overflow-hidden">
                        <SettingItem
                            icon={<User size={18} />}
                            title="Personal Details"
                            onClick={() => handleFeatureClick('Personal Details')}
                        />
                        <SettingItem
                            icon={<Shield size={18} />}
                            title="Health Records"
                            badge="3 New"
                            onClick={() => handleFeatureClick('Health Records')}
                        />
                        <SettingItem
                            icon={<Bell size={18} />}
                            title="Notifications"
                            toggle
                            checked={notifications}
                            onChange={() => setNotifications(!notifications)}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 px-1">Preferences</h3>
                    <div className="bg-[#111827] rounded-[12px] border border-white/5 overflow-hidden">
                        <SettingItem
                            icon={<Moon size={18} />}
                            title="Dark Mode"
                            toggle
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <SettingItem
                            icon={<Settings size={18} />}
                            title="App Settings"
                            last
                            onClick={() => handleFeatureClick('App Settings')}
                        />
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full mt-4 p-4 bg-[#1F2937]/50 border border-red-500/20 text-red-400 rounded-[12px] flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium text-[15px]"
                >
                    <LogOut size={18} /> Sign Out
                </button>

                <p className="text-center text-[12px] text-gray-600 mt-6 pb-6">DoseMitra v2.1.0 (Mobile Build)</p>
            </div>
        </div>
    );
};

const SettingItem = ({ icon, title, badge, toggle, checked, onChange, last, onClick }) => (
    <div
        className={`flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group ${!last ? 'border-b border-white/5' : ''}`}
        onClick={toggle ? onChange : onClick}
    >
        <div className="flex items-center gap-3 text-gray-300">
            <div className="text-gray-500 group-hover:text-white transition-colors">
                {icon}
            </div>
            <span className="text-[14px] font-medium group-hover:text-white transition-colors">{title}</span>
        </div>

        <div className="flex items-center gap-3">
            {badge && <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-wide">{badge}</span>}
            {toggle ? (
                <div
                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-blue-600' : 'bg-[#374151]'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            ) : (
                <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            )}
        </div>
    </div>
);

export default Profile;
