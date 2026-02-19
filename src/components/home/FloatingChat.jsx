import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Send, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setMessage('');
            setPhone('');
        }, 3000);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform ${isOpen ? 'hidden' : ''}`}
            >
                <MessageCircle className="w-7 h-7 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </span>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">ЦЭ</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Центр Энергоэффективности</h3>
                                        <div className="flex items-center gap-1 text-green-400 text-sm">
                                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                                            Онлайн
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === 'chat' 
                                            ? 'bg-orange-500 text-white' 
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    }`}
                                >
                                    Написать
                                </button>
                                <button
                                    onClick={() => setActiveTab('call')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === 'call' 
                                            ? 'bg-orange-500 text-white' 
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    }`}
                                >
                                    Перезвоните мне
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {submitted ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Сообщение отправлено!</h4>
                                    <p className="text-slate-500 text-sm">Мы ответим в течение 5 минут</p>
                                </motion.div>
                            ) : activeTab === 'chat' ? (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                                        👋 Здравствуйте! Задайте вопрос или опишите вашу задачу, и мы ответим в ближайшее время.
                                    </div>
                                    <Textarea
                                        placeholder="Ваше сообщение..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="resize-none min-h-[100px]"
                                        required
                                    />
                                    <Input
                                        placeholder="Ваш телефон для связи"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                                        <Send className="w-4 h-4 mr-2" />
                                        Отправить
                                    </Button>
                                    <p className="text-xs text-slate-500 text-center">
                                        Нажимая кнопку, вы соглашаетесь с <Link to={createPageUrl('Privacy')} className="text-orange-600 hover:text-orange-700 underline">Политикой конфиденциальности</Link>
                                    </p>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                                        📞 Оставьте номер — перезвоним в течение 5 минут в рабочее время (8:00 - 20:00)
                                    </div>
                                    <Input
                                        placeholder="Ваш телефон"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="text-lg h-12"
                                        required
                                    />
                                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 h-12">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Жду звонка
                                    </Button>
                                    <p className="text-xs text-slate-500 text-center">
                                        Нажимая кнопку, вы соглашаетесь с <Link to={createPageUrl('Privacy')} className="text-orange-600 hover:text-orange-700 underline">Политикой конфиденциальности</Link>
                                    </p>
                                </form>
                            )}
                        </div>

                        {/* Quick contacts */}
                        <div className="px-4 pb-4 pt-2 border-t">
                            <p className="text-xs text-slate-500 mb-2">Или свяжитесь напрямую:</p>
                            <div className="flex gap-2">
                                <a 
                                    href="tel:+79302460077" 
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-lg py-2 text-sm font-medium text-slate-700 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    Позвонить
                                </a>
                                <a 
                                    href="https://wa.me/79302460077" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 rounded-lg py-2 text-sm font-medium text-green-700 transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}