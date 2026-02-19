import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contactInfo = [
    {
        icon: Phone,
        title: 'Телефон',
        value: '8-930-246-00-77',
        link: 'tel:89302460077',
        description: 'Звоните с 8:00 до 20:00'
    },
    {
        icon: Mail,
        title: 'Email',
        value: 'investen@bk.ru',
        link: 'mailto:investen@bk.ru',
        description: 'Ответим в течение часа'
    },
    {
        icon: Clock,
        title: 'График работы',
        value: 'Пн-Сб: 8:00 - 20:00',
        description: 'Аварийная служба 24/7'
    },
    {
        icon: MapPin,
        title: 'Регион работы',
        value: 'Вся Россия',
        description: 'Выезд на объект бесплатно'
    }
];

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', phone: '', email: '', service: '', message: '' });
        }, 3000);
    };

    return (
        <section id="contacts" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Контакты</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
                        Свяжитесь с нами
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Оставьте заявку — мы перезвоним, ответим на вопросы и подготовим коммерческое предложение
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid sm:grid-cols-2 gap-6">
                            {contactInfo.map((item, index) => (
                                <div 
                                    key={index}
                                    className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                                    {item.link ? (
                                        <a href={item.link} className="text-lg font-bold text-orange-500 hover:text-orange-600 transition-colors">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-lg font-bold text-slate-900">{item.value}</p>
                                    )}
                                    <p className="text-slate-500 text-sm mt-1">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Почему стоит обратиться к нам?</h3>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Бесплатный выезд специалиста на объект для оценки работ</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Фиксированная стоимость в договоре — без скрытых платежей</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Гарантия на все виды работ от 12 месяцев</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Полный комплект документации для сдачи в эксплуатацию</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-slate-50 rounded-3xl p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Оставить заявку</h3>
                            
                            {submitted ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Заявка отправлена!</h4>
                                    <p className="text-slate-600">Мы свяжемся с вами в ближайшее время</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Ваше имя *"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="h-12 bg-white border-slate-200"
                                            required
                                        />
                                        <Input
                                            placeholder="Телефон *"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="h-12 bg-white border-slate-200"
                                            required
                                        />
                                    </div>
                                    
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="h-12 bg-white border-slate-200"
                                    />

                                    <Select
                                        value={formData.service}
                                        onValueChange={(value) => setFormData({...formData, service: value})}
                                    >
                                        <SelectTrigger className="h-12 bg-white border-slate-200">
                                            <SelectValue placeholder="Выберите услугу" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lab">Электролаборатория</SelectItem>
                                            <SelectItem value="mount">Монтажные работы</SelectItem>
                                            <SelectItem value="lightning">Молниезащита и заземление</SelectItem>
                                            <SelectItem value="service">Обслуживание ТП</SelectItem>
                                            <SelectItem value="other">Другое</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea
                                        placeholder="Опишите вашу задачу или вопрос..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="min-h-[120px] bg-white border-slate-200 resize-none"
                                    />

                                    <Button type="submit" className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg">
                                        <Send className="w-5 h-5 mr-2" />
                                        Отправить заявку
                                    </Button>

                                    <p className="text-center text-slate-500 text-sm">
                                        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}