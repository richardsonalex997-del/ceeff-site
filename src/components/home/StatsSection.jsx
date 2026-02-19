import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: '14+', label: 'Лет на рынке', description: 'Работаем с 2010 года' },
    { value: '500+', label: 'Проектов', description: 'Успешно завершено' },
    { value: '150+', label: 'Клиентов', description: 'Доверяют нам' },
    { value: '24/7', label: 'Аварийная служба', description: 'Всегда на связи' }
];

export default function StatsSection() {
    return (
        <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">О компании</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-6">
                            Центр Энергоэффективности — надёжность, проверенная временем
                        </h2>
                        <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                            <p>
                                Мы специализируемся на комплексном выполнении электромонтажных работ, 
                                испытаниях и обслуживании электрооборудования напряжением до 110 кВ.
                            </p>
                            <p>
                                Наша электролаборатория зарегистрирована в органах Ростехнадзора и укомплектована 
                                современным измерительным оборудованием ведущих мировых производителей.
                            </p>
                            <p>
                                Работаем с промышленными предприятиями, энергосбытовыми компаниями, 
                                застройщиками и управляющими компаниями по всей России.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right - Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-white font-semibold text-lg mb-1">{stat.label}</div>
                                    <div className="text-slate-400 text-sm">{stat.description}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}