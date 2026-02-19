import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TelegramContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const sendToTelegram = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const telegramToken = "8585940417:AAGXn4rgBB2FW57ApIzKU4RfV-kvGTBlU8k";
        const chatId = "-5166880366";

        const text = `🆕 Новая заявка с сайта!\n\n👤 Имя: ${formData.name}\n📞 Телефон: ${formData.phone}\n📧 Email: ${formData.email}\n💬 Сообщение: ${formData.message}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML'
                })
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', phone: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка отправлена!</h3>
                <p className="text-slate-600">Мы свяжемся с вами в ближайшее время</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Оставить заявку</h3>
            <form onSubmit={sendToTelegram} className="space-y-4">
                <div>
                    <Input
                        placeholder="Ваше имя *"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        disabled={status === 'loading'}
                    />
                </div>
                <div>
                    <Input
                        type="tel"
                        placeholder="Телефон *"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        disabled={status === 'loading'}
                    />
                </div>
                <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={status === 'loading'}
                    />
                </div>
                <div>
                    <Textarea
                        placeholder="Ваше сообщение *"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                        className="min-h-[120px]"
                        disabled={status === 'loading'}
                    />
                </div>
                <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Отправка...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Отправить заявку
                        </>
                    )}
                </Button>
                <p className="text-xs text-slate-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с <Link to={createPageUrl('Privacy')} className="text-orange-600 hover:text-orange-700 underline">Политикой конфиденциальности</Link>
                </p>
                {status === 'error' && (
                    <p className="text-red-600 text-sm text-center">Ошибка отправки. Попробуйте позже.</p>
                )}
            </form>
        </div>
    );
}