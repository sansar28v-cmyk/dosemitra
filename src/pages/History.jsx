import React, { useMemo, useState } from 'react';
import { useMedicine } from '../context/MedicineContext';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, subDays, startOfWeek, addDays, isSameDay, subMonths } from 'date-fns';
import { Check, X, AlertCircle, Activity, Calendar, Download, FileText, Share2 } from 'lucide-react';

const History = () => {
    const { logs, medicines, user } = useMedicine();
    const [downloading, setDownloading] = useState(false);

    // Generate data for the last 7 days (Weekly View)
    const weeklyData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dayStr = format(date, 'yyyy-MM-dd');
            const totalDue = medicines.length;
            const taken = logs.filter(l => l.date === dayStr && l.status === 'taken').length;
            const percentage = totalDue === 0 ? 0 : Math.round((taken / totalDue) * 100);

            data.push({
                name: format(date, 'EEE'),
                adherence: percentage,
                fullDate: dayStr
            });
        }
        return data;
    }, [logs, medicines]);

    // Generate Monthly Performance Data (Simulated for Demo)
    const monthlyData = useMemo(() => {
        return [
            { name: 'Week 1', taken: 24, missed: 4 },
            { name: 'Week 2', taken: 26, missed: 2 },
            { name: 'Week 3', taken: 28, missed: 0 },
            { name: 'Week 4', taken: 25, missed: 3 },
        ];
    }, []);

    const handleDownload = () => {
        setDownloading(true);
        setTimeout(() => {
            setDownloading(false);
            alert("Health Report downloaded successfully!");
        }, 2000);
    };

    return (
        <div className="saas-container">
            <header className="flex justify-between items-start mb-8 pt-2">
                <div>
                    <h1 className="text-[20px] font-bold text-white tracking-tight">Analytics & Reports</h1>
                    <p className="text-gray-400 text-[14px]">Deep dive into your health data</p>
                </div>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-10 h-10 rounded-[10px] bg-[#1F2937] border border-white/5 flex items-center justify-center hover:bg-[#374151] transition-all text-blue-400"
                >
                    {downloading ? (
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Download size={20} />
                    )}
                </button>
            </header>

            {/* Export Card */}
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-[16px] p-5 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-[15px]">Doctor's Report</h3>
                        <p className="text-blue-200/60 text-[12px]">Last 30 days summary</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium rounded-[8px] transition-colors shadow-lg shadow-blue-900/20">
                    Generate
                </button>
            </div>

            {/* Weekly Trend Chart */}
            <div className="saas-card p-5 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white text-[15px] flex items-center gap-2">
                        <Activity size={16} className="text-blue-500" /> Weekly Adherence
                    </h3>
                </div>
                <div className="h-48 w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="adherence" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorAdherence)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Performance Bar Chart */}
            <div className="saas-card p-5 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white text-[15px]">Monthly Overview</h3>
                    <select className="bg-[#1F2937] text-gray-400 text-[12px] border border-white/5 rounded-[6px] px-2 py-1 outline-none">
                        <option>Feb 2026</option>
                        <option>Jan 2026</option>
                    </select>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="taken" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} barSize={20} />
                            <Bar dataKey="missed" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-[12px] text-gray-400">
                        <div className="w-3 h-3 rounded-[2px] bg-emerald-500" /> Taken
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400">
                        <div className="w-3 h-3 rounded-[2px] bg-red-500" /> Missed
                    </div>
                </div>
            </div>

            {/* Recent Logs List */}
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-4">Detailed Log</h3>
            <div className="space-y-0 relative border border-white/5 rounded-[12px] overflow-hidden bg-[#111827]">
                {logs.slice().reverse().slice(0, 10).map((log, i) => {
                    const med = medicines.find(m => m.id === log.medicineId);
                    if (!med) return null;
                    return (
                        <div
                            key={log.id}
                            className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.status === 'taken'
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {log.status === 'taken' ? <Check size={14} strokeWidth={2.5} /> : <AlertCircle size={14} />}
                                </div>
                                <div>
                                    <p className="font-medium text-white text-[14px]">{med.name}</p>
                                    <p className="text-[12px] text-gray-500">{format(new Date(log.timestamp), 'MMM d, h:mm a')}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default History;
