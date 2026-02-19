import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, Users, Wrench, FileCheck } from 'lucide-react';

const advantages = [
    {
        icon: Shield,
        title: 'Лицензированная лаборатория',
        description: 'Электролаборатория зарегистрирована в Ростехнадзоре с правом проведения испытаний до 110кВ',
        color: 'from-blue-500 to-blue-600'
    },
    {
        icon: Award,
        title: 'Опыт более 14 лет',
        description: 'Работаем с 2010 года. Выполнили более 500 проектов различной сложности',
        color: 'from-orange-500 to-orange-600'
    },
    {
        icon: Users,
        title: 'Аттестованный персонал',
        description: 'Все специалисты имеют допуск к работам на объектах повышенной опасности',
        color: 'from-green-500 to-green-600'
    },
    {
        icon: Wrench,
        title: 'Современное оборудование',
        description: 'Используем сертифицированные приборы и инструменты ведущих производителей',
        color: 'from-purple-500 to-purple-600'
    },
    {
        icon: Clock,
        title: 'Соблюдение сроков',
        description: 'Выполняем работы в оговоренные сроки. Штрафные санкции при задержке',
        color: 'from-red-500 to-red-600'
    },
    {
        icon: FileCheck,
        title: 'Полный пакет документов',
        description: 'Оформляем всю техническую документацию, протоколы испытаний, акты',
        color: 'from-teal-500 to-teal-600'
    }
];

export default function AdvantagesSection() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Почему выбирают нас</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
                        Надёжный партнёр в энергетике
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Мы гарантируем качество работ, соблюдение сроков и полное соответствие нормативным требованиям
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advantages.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-6 h-full border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}