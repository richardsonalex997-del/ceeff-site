import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const regions = [
    { name: 'Москва и МО', projects: 180, active: true },
    { name: 'Владимирская обл.', projects: 45, active: true },
    { name: 'Нижегородская обл.', projects: 38, active: true },
    { name: 'Рязанская обл.', projects: 32, active: true },
    { name: 'Тульская обл.', projects: 28, active: true },
    { name: 'Калужская обл.', projects: 25, active: true },
    { name: 'Тверская обл.', projects: 22, active: true },
    { name: 'Ярославская обл.', projects: 20, active: true },
    { name: 'Смоленская обл.', projects: 18, active: false },
    { name: 'Воронежская обл.', projects: 15, active: false },
    { name: 'Липецкая обл.', projects: 12, active: false },
    { name: 'Другие регионы', projects: 65, active: false },
];

const advantages = [
    'Бесплатный выезд в пределах 100 км от Москвы',
    'Работа вахтовым методом на удалённых объектах',
    'Собственный автопарк со спецтехникой',
    'Мобильная лаборатория для выездных работ',
];

export default function GeographySection() {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">География</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
                        Работаем по всей России
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Основная зона обслуживания — ЦФО. Выезжаем в любой регион по согласованию
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Map placeholder with regions */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                            <div className="grid grid-cols-2 gap-3">
                                {regions.map((region, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-3 rounded-xl transition-colors ${
                                            region.active 
                                                ? 'bg-orange-500/20 border border-orange-500/30' 
                                                : 'bg-white/5 border border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className={`w-4 h-4 ${region.active ? 'text-orange-400' : 'text-slate-500'}`} />
                                            <span className="text-white text-sm font-medium">{region.name}</span>
                                        </div>
                                        <p className="text-slate-400 text-xs ml-6">{region.projects} проектов</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-6">
                            500+ выполненных проектов
                        </Badge>
                        
                        <h3 className="text-2xl font-bold text-white mb-6">
                            Выезжаем на объекты любой удалённости
                        </h3>

                        <div className="space-y-4 mb-8">
                            {advantages.map((adv, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-300">{adv}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-orange-400">12</p>
                                <p className="text-slate-400 text-sm">регионов</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-orange-400">5</p>
                                <p className="text-slate-400 text-sm">бригад</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-orange-400">24/7</p>
                                <p className="text-slate-400 text-sm">на связи</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}