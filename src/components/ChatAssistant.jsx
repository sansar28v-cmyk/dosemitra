import React, { useState, useRef, useEffect } from 'react';
import { useMedicine } from '../context/MedicineContext';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatAssistant = () => {
    const { medicines } = useMedicine();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm DoseMitra AI. How can I help you with your medications today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };

        // Optimistic UI update
        const newHistory = [...messages, userMessage];
        setMessages(newHistory);
        setInput('');
        setLoading(true);

        try {
            const context = {
                medicines: medicines.map(m => ({ name: m.name, dosage: m.dosage }))
            };

            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: messages, // Send previous history
                    context
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to connect to AI service");
            }

            if (data.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            } else {
                throw new Error("No response content received");
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = error.message.includes("Failed to fetch")
                ? "Cannot reach server. Is the backend running?"
                : error.message;

            setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button - BOTTOM RIGHT (Absolute) */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-24 right-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center text-white z-[50] border border-white/20 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-shadow"
            >
                {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
            </motion.button>

            {/* Chat Panel - Above Button (Absolute) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-40 right-4 w-[calc(100%-32px)] max-w-[360px] max-h-[500px] h-[55vh] bg-[#111827]/95 backdrop-blur-[20px] border border-white/10 rounded-[24px] shadow-2xl flex flex-col overflow-hidden z-[49]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                                    <Sparkles size={16} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-[14px]">DoseMitra AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-gray-400 text-[11px]">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-gray-700/50 border border-white/10'}`}>
                                        {msg.role === 'user' ? <User size={12} className="text-indigo-400" /> : <Bot size={12} className="text-gray-400" />}
                                    </div>
                                    <div className={`max-w-[85%] p-3 rounded-[18px] text-[13px] leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                                        : 'bg-[#1F2937] text-gray-200 border border-white/5 rounded-tl-sm'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gray-700/50 border border-white/10 flex items-center justify-center shrink-0">
                                        <Bot size={12} className="text-gray-400" />
                                    </div>
                                    <div className="bg-[#1F2937] border border-white/5 rounded-[18px] rounded-tl-sm p-3 flex gap-1 items-center">
                                        <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-[#0B1220]/80 border-t border-white/5">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for guidance..."
                                    className="w-full h-[42px] bg-[#1F2937] border border-white/10 rounded-full pl-4 pr-10 text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-1 top-1 w-[34px] h-[34px] bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
                                </button>
                            </form>
                            <p className="text-center text-[9px] text-gray-600 mt-2">
                                AI can make mistakes. Consult a doctor for medical advice.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatAssistant;
