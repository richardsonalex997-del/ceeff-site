import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Gauge, Cpu } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const equipment = [
    {
        category: 'Высоковольтные испытания',
        items: [
            { name: 'АИД-70М', description: 'Аппарат испытания диэлектриков до 70 кВ', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&auto=format&fit=crop' },
            { name: 'РЕТОМ-51', description: 'Комплекс для проверки РЗА', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop' },
            { name: 'СА7100', description: 'Мост для измерения tg δ', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop' },
        ]
    },
    {
        category: 'Измерительные приборы',
        items: [
            { name: 'Fluke 1760', description: 'Анализатор качества электроэнергии', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop' },
            { name: 'Metrel MI 3152', description: 'Измеритель сопротивления изоляции', image: 'https://images.unsplash.com/photo-1509390836518-e0c85c2e3188?w=400&auto=format&fit=crop' },
            { name: 'Flir E60', description: 'Тепловизор для диагностики', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&auto=format&fit=crop' },
        ]
    }
];

const certifications = [
    { icon: Shield, title: 'Поверка', desc: 'Все приборы проходят ежегодную поверку' },
    { icon: Award, title: 'Сертификаты', desc: 'Оборудование имеет сертификаты соответствия' },
    { icon: Gauge, title: 'Точность', desc: 'Класс точности 0.1-0.5 по ГОСТ' },
    { icon: Cpu, title: 'Современность', desc: 'Приборы ведущих мировых производителей' },
];

export default function EquipmentSection() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Оборудование</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
                        Современное измерительное оборудование
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Используем сертифицированные приборы ведущих производителей для точных измерений
                    </p>
                </motion.div>

                {/* Certifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 text-center border border-slate-100"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <cert.icon className="w-6 h-6 text-orange-500" />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">{cert.title}</h4>
                            <p className="text-sm text-slate-500">{cert.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Equipment Grid */}
                {equipment.map((category, catIndex) => (
                    <div key={catIndex} className="mb-10">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">{category.category}</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {category.items.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow group"
                                >
                                    <div className="h-48 overflow-hidden">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <Badge className="bg-orange-100 text-orange-700 mb-2">Сертифицировано</Badge>
                                        <h4 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h4>
                                        <p className="text-slate-500 text-sm">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}