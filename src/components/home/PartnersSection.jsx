import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Factory, Store, Hospital, GraduationCap, Warehouse } from 'lucide-react';

const clientTypes = [
    { icon: Factory, name: 'Промышленные предприятия', count: '50+' },
    { icon: Building2, name: 'Застройщики и девелоперы', count: '30+' },
    { icon: Store, name: 'Торговые сети', count: '25+' },
    { icon: Hospital, name: 'Медицинские учреждения', count: '15+' },
    { icon: GraduationCap, name: 'Образовательные учреждения', count: '20+' },
    { icon: Warehouse, name: 'Логистические комплексы', count: '10+' },
];

const partners = [
    { name: 'Россети', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Rosseti_logo.svg/200px-Rosseti_logo.svg.png' },
    { name: 'МОЭСК', logo: 'https://upload.wikimedia.org/wikipedia/ru/thumb/4/4e/MOESK_logo.svg/200px-MOESK_logo.svg.png' },
    { name: 'Ростехнадзор', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Rostechnadzor.svg/200px-Rostechnadzor.svg.png' },
];

export default function PartnersSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Клиенты</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
                        Нам доверяют более 150 компаний
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Работаем с предприятиями различных отраслей по всей России
                    </p>
                </motion.div>

                {/* Client Types */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
                    {clientTypes.map((type, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-50 rounded-2xl p-5 text-center hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all group"
                        >
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:bg-orange-100 transition-colors">
                                <type.icon className="w-7 h-7 text-slate-600 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <p className="text-2xl font-bold text-orange-500 mb-1">{type.count}</p>
                            <p className="text-sm text-slate-600">{type.name}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12"
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Работаем с ведущими энергетическими компаниями
                            </h3>
                            <p className="text-slate-300 mb-6">
                                Наша электролаборатория аккредитована и имеет все необходимые допуски 
                                для работы на объектах повышенной опасности. Протоколы испытаний 
                                принимаются всеми надзорными органами.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/10 rounded-lg px-4 py-2">
                                    <p className="text-orange-400 font-bold text-2xl">14+</p>
                                    <p className="text-slate-400 text-sm">лет опыта</p>
                                </div>
                                <div className="bg-white/10 rounded-lg px-4 py-2">
                                    <p className="text-orange-400 font-bold text-2xl">500+</p>
                                    <p className="text-slate-400 text-sm">проектов</p>
                                </div>
                                <div className="bg-white/10 rounded-lg px-4 py-2">
                                    <p className="text-orange-400 font-bold text-2xl">0</p>
                                    <p className="text-slate-400 text-sm">аварий</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-10 h-10 text-white/40" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}