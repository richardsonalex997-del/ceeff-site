import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ListChecks } from 'lucide-react';
import ServicesModal from './ServicesModal';

const services = [
    {
        title: 'Электролаборатория 110кВ',
        description: 'Комплексные испытания электрооборудования, наладка релейной защиты и автоматики.',
        image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/936f9911d_Gemini_Generated_Image_k4yg16k4yg16k4yg.png',
        features: [
            'Испытания и измерения до 110кВ',
            'Наладка устройств РЗиА',
            'Ретрофит (модернизация) ячеек',
            'Тепловизионный контроль контактов'
        ],
        popular: true
    },
    {
        title: 'Электромонтажные работы',
        description: 'Строительство, реконструкция и ремонт объектов энергетики под ключ.',
        image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/1c3227def_Gemini_Generated_Image_plm5qmplm5qmplm5.png',
        features: [
            'Монтаж ТП, КТП, РП',
            'Прокладка кабельных линий (КЛ)',
            'Монтаж воздушных линий (ВЛ)',
            'Сборка щитового оборудования'
        ]
    },
    {
        title: 'Обслуживание объектов энергетики',
        description: 'Техническое обслуживание и капитальный ремонт электроустановок.',
        image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/cf2af069a_Gemini_Generated_Image_xis7zlxis7zlxis7.png',
        features: [
            'ТО электроустановок до 10кВ',
            'Капитальный ремонт',
            'Оперативное обслуживание',
            'Аварийные работы 24/7'
        ]
    }
];

export default function ServicesSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Наши услуги</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold transition-colors"
                >
                    <ListChecks className="w-5 h-5" />
                    Полный спектр услуг
                </button>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full group"
                    >
                        <div className="h-56 bg-slate-100 relative overflow-hidden">
                            <img 
                                src={service.image} 
                                loading="lazy"
                                decoding="async"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={service.title}
                            />
                            {service.popular && (
                                <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                                    ТОП Услуга
                                </div>
                            )}
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-bold mb-3 text-slate-900">{service.title}</h3>
                            <p className="text-slate-600 mb-6 text-sm">{service.description}</p>
                            
                            <ul className="custom-list text-sm text-slate-600 mb-8 flex-grow">
                                {service.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                            
                            <Link to={createPageUrl('Price')}>
                                <button className="w-full border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                                    Подробнее об услуге
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
                </div>

                <ServicesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </section>
                );
                }