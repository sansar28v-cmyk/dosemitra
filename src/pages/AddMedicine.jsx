import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Calendar, Clock, RotateCw, Pill, ChevronDown, Camera, ScanLine, Check, Loader2 } from 'lucide-react';
import { useMedicine } from '../context/MedicineContext';

const AddMedicine = () => {
    const navigate = useNavigate();
    const { addMedicine } = useMedicine();
    const [scanning, setScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: 'Once daily',
        dateTime: '09:00',
        startDate: new Date().toISOString().split('T')[0],
        quantity: '30',
        refillThreshold: '5'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleScan = () => {
        setScanning(true);
        // Simulate AI Scan Process
        setTimeout(() => {
            setScanning(false);
            setScanComplete(true);
            setFormData({
                name: 'Atorvastatin',
                dosage: '20mg',
                frequency: 'Once daily',
                dateTime: '20:00', // PM med
                startDate: new Date().toISOString().split('T')[0],
                quantity: '90',
                refillThreshold: '10'
            });
            setTimeout(() => setScanComplete(false), 3000);
        }, 2500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.dosage) return;

        addMedicine({
            ...formData,
            times: [formData.dateTime],
            endDate: null,
            reminder: true,
            type: 'pill'
        });

        navigate('/');
    };

    return (
        <div className="saas-container">
            {/* Scanner Overlay */}
            <AnimatePresence>
                {scanning && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1220]/90 backdrop-blur-xl">
                        <div className="relative w-64 h-64 border-2 border-blue-500 rounded-[24px] overflow-hidden flex items-center justify-center mb-8 bg-black/20">
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                            />
                            <ScanLine size={48} className="text-blue-500/50" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Scanning Label...</h3>
                        <p className="text-gray-400">Extracting medication details</p>
                    </div>
                )}
            </AnimatePresence>

            <header className="flex items-center justify-between mb-8 pt-2">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-[10px] bg-[#1F2937] border border-white/5 flex items-center justify-center hover:bg-[#374151] transition-all text-gray-400">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-[20px] font-bold text-white tracking-tight">Add Medicine</h1>
                </div>
            </header>

            {/* Scan Button - AI Feature */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScan}
                className="w-full bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-blue-500/30 text-blue-400 p-4 rounded-[16px] flex items-center justify-center gap-3 mb-8 font-semibold hover:bg-blue-500/20 transition-all group"
            >
                <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow">
                    <Camera size={20} />
                </div>
                <span>Auto-fill from Rx Label</span>
            </motion.button>

            {scanComplete && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[12px] flex items-center gap-3 text-emerald-400 text-sm font-medium"
                >
                    <Check size={16} /> Details extracted successfully!
                </motion.div>
            )}

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="saas-card"
            >
                <div className="space-y-6">
                    <div>
                        <label className="saas-label">Medicine Name</label>
                        <div className="relative group">
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Lisinopril"
                                className="saas-input pl-11"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Pill size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="saas-label">Dosage</label>
                            <input
                                type="text"
                                name="dosage"
                                placeholder="mg"
                                className="saas-input"
                                value={formData.dosage}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="saas-label">Frequency</label>
                            <div className="relative group">
                                <select
                                    name="frequency"
                                    className="saas-input appearance-none pr-10 cursor-pointer"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                >
                                    <option>Once daily</option>
                                    <option>Twice daily</option>
                                    <option>Every 8 hours</option>
                                    <option>As needed</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="saas-label">Timings</label>
                            <div className="relative group">
                                <input
                                    type="time"
                                    name="dateTime"
                                    className="saas-input pl-11"
                                    value={formData.dateTime}
                                    onChange={handleChange}
                                />
                                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="saas-label">Start Date</label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    name="startDate"
                                    className="saas-input pl-11"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* New Inventory Section */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                            <label className="saas-label">Total Qty</label>
                            <input
                                type="number"
                                name="quantity"
                                className="saas-input" // Fixed: using saas-input for styling consistency
                                value={formData.quantity} // Should use quantity not totalQuantity for initial fill
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="saas-label">Low Stock Alert</label>
                            <input
                                type="number"
                                name="refillThreshold"
                                className="saas-input"
                                value={formData.refillThreshold}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="saas-btn mt-8"
                >
                    <Save size={18} /> Save Medicine
                </motion.button>
            </motion.form>
        </div>
    );
};

export default AddMedicine;
