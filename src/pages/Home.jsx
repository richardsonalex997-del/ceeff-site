---
hero_title: "Испытания, диагностика и наладка электрооборудования до 110 кВ"
hero_subtitle: "Выполняем полный комплекс пусконаладочных работ под ключ на подстанциях. Выдаем технические отчеты для Ростехнадзора за 24 часа."
hero_button: "Рассчитать стоимость"
---
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Zap, Settings, FileText, ArrowRight } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import ReviewsSection from '../components/home/ReviewsSection';

const directions = [
    {
        icon: Zap,
        title: 'Электролаборатория до 110 кВ',
        description: 'Испытания и диагностика электрооборудования. Наладка релейной защиты и автоматики. Официальные протоколы для Ростехнадзора.',
        features: [
            'Испытания оборудования до 110 кВ',
            'Наладка РЗиА и тепловизионный контроль',
            'Диагностика трансформаторов и кабелей',
            'Протоколы испытаний за 24 часа'
        ],
        link: 'Services',
        color: 'orange'
    },
    {
        icon: Settings,
        title: 'Обслуживание объектов энергетики',
        description: 'Техническое обслуживание до 10 кВ. Капитальный ремонт электроустановок. Оперативное обслуживание и аварийные работы 24/7.',
        features: [
            'Плановое ТО по ПТЭЭП и ПУЭ',
            'Капитальный ремонт оборудования',
            'Оперативное обслуживание объектов',
            'Аварийные бригады 24/7'
        ],
        link: 'Maintenance',
        color: 'blue'
    }
];

export default function Home() {
    React.useEffect(() => {
        document.title = "Электролаборатория и электромонтаж | ЦЭФ";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = "Электролаборатория до 110 кВ с аттестацией Ростехнадзора №1428. Испытания, наладка РЗиА, обслуживание объектов энергетики.";
        }
    }, []);

    return (
        <div>
            <HeroSection />
            
            {/* Основные направления */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Основные направления</h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Полный комплекс услуг электролаборатории с официальной аттестацией Ростехнадзора. 
                        Работаем по всей России.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {directions.map((direction, index) => {
                        const Icon = direction.icon;
                        const colorClasses = {
                            orange: 'bg-orange-50 text-orange-600 border-orange-200',
                            blue: 'bg-blue-50 text-blue-600 border-blue-200',
                            green: 'bg-green-50 text-green-600 border-green-200'
                        };
                        const hoverClasses = {
                            orange: 'hover:border-orange-400',
                            blue: 'hover:border-blue-400',
                            green: 'hover:border-green-400'
                        };

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-2xl border-2 ${hoverClasses[direction.color]} transition-all hover:shadow-xl p-8 flex flex-col h-full group`}
                            >
                                <div className={`w-16 h-16 ${colorClasses[direction.color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{direction.title}</h3>
                                <p className="text-slate-600 mb-6">{direction.description}</p>
                                
                                <ul className="custom-list text-sm text-slate-600 mb-8 flex-grow">
                                    {direction.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                
                                <Link to={createPageUrl(direction.link)}>
                                    <button className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                        Подробнее
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <ReviewsSection />
        </div>
    );
}