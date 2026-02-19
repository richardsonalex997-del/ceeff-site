import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import TelegramContactForm from '@/components/TelegramContactForm';

export default function Contacts() {

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-12">Контакты</h1>
                
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="grid lg:grid-cols-2">
                        {/* Contact Info */}
                        <div className="p-10 lg:p-16 bg-slate-900 text-white">
                            <h2 className="text-3xl font-bold mb-8">Свяжитесь с нами</h2>
                            <p className="text-slate-400 mb-10">
                                Мы всегда на связи. Оставьте заявку, и инженер перезвонит вам в течение 15 минут для консультации.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Телефон</div>
                                        <a href="tel:+79302460077" className="text-xl font-bold hover:text-orange-400 transition-colors">
                                            +7 (930) 246-00-77
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Email</div>
                                        <a href="mailto:investen@bk.ru" className="text-xl font-bold hover:text-orange-400 transition-colors">
                                            investen@bk.ru
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Офис</div>
                                        <div className="text-lg">г. Нижний Новгород, Казанское шоссе, д. 6</div>
                                    </div>
                                </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="text-sm text-slate-400 mb-4">Мы в соцсетях</div>
                                <div className="flex gap-3">
                                    <a 
                                        href="https://t.me/cefnn" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                        Telegram
                                    </a>
                                    <a 
                                        href="https://vk.com/cefnn" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.1h-1.34c-.63 0-.82-.5-1.95-1.63-.98-.98-1.41-1.11-1.66-1.11-.34 0-.43.09-.43.52v1.48c0 .4-.13.64-1.17.64-1.71 0-3.61-1.04-4.94-2.97-2-2.89-2.55-5.06-2.55-5.5 0-.25.09-.49.52-.49h1.34c.39 0 .54.18.69.59.77 2.2 2.06 4.13 2.59 4.13.2 0 .29-.09.29-.59V8.68c-.06-.95-.56-1.03-.56-1.37 0-.2.17-.4.43-.4h2.11c.34 0 .47.19.47.57v3.07c0 .34.15.48.25.48.2 0 .36-.14.72-.5 1.1-1.24 1.89-3.16 1.89-3.16.1-.22.29-.43.67-.43h1.34c.4 0 .49.21.4.57-.15.71-1.61 3.01-1.61 3.01-.17.28-.24.4 0 .72.17.23.74.73 1.12 1.17.69.8 1.22 1.47 1.36 1.93.13.47-.08.71-.56.71z"/>
                                        </svg>
                                        ВКонтакте
                                    </a>
                                </div>
                                </div>
                                </div>

                        {/* Form */}
                        <div className="p-10 lg:p-16">
                            <TelegramContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}