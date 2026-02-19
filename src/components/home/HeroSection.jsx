import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import CalculatorModal from './Calculator';

export default function HeroSection() {
    // Reduce animation overhead on initial load
    const [animationsReady, setAnimationsReady] = React.useState(false);
    React.useEffect(() => {
        setAnimationsReady(true);
    }, []);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

    return (
        <>
            <section className="relative bg-slate-900 text-white pt-24 pb-40 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=60')] md:bg-[url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-transparent"></div>
                
                {/* Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={animationsReady ? { opacity: 0, y: 20 } : false}
                            animate={animationsReady ? { opacity: 1, y: 0 } : false}
                            className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            <span className="text-orange-400 text-sm font-bold uppercase tracking-wider">ЦЭФ • Наладка РЗиА</span>
                        </motion.div>

                        <motion.h1
                            initial={animationsReady ? { opacity: 0, y: 20 } : false}
                            animate={animationsReady ? { opacity: 1, y: 0 } : false}
                            transition={{ delay: 0.05 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight"
                        >
                            Испытания, диагностика и наладка <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                                электрооборудования до 110 кВ
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={animationsReady ? { opacity: 0, y: 20 } : false}
                            animate={animationsReady ? { opacity: 1, y: 0 } : false}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed"
                        >
                            Выполняем полный комплекс пусконаладочных работ под ключ на подстанциях. 
                            Выдаем технические отчеты для Ростехнадзора за 24 часа.
                        </motion.p>

                        <motion.div
                            initial={animationsReady ? { opacity: 0, y: 20 } : false}
                            animate={animationsReady ? { opacity: 1, y: 0 } : false}
                            transition={{ delay: 0.15 }}
                            className="flex flex-col sm:flex-row gap-5"
                        >
                            <button
                                onClick={() => setIsCalculatorOpen(true)}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2"
                            >
                                <Calculator className="w-5 h-5" />
                                Рассчитать стоимость
                            </button>
                            <Link to={createPageUrl('Projects')}>
                                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-2">
                                    Наши проекты
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <div className="container mx-auto px-4 -mt-24 relative z-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 group hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Гарантия легитимности</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Лаборатория зарегистрирована в Ростехнадзоре. Сотрудники аттестованы в Волжско-Окском управлении. Все приборы проходят ежегодную поверку в ЦСМ.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 group hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Собственный парк</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Не арендуем оборудование. Используем свои комплексы Retom-21, АИД-70, Fluke, Testo.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 group hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Аварийный выезд</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Бригада готова к выезду 24/7. Находим повреждение кабеля в земле с точностью до 0.5 метра.
                        </p>
                    </motion.div>
                </div>
            </div>

            <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
        </>
    );
}