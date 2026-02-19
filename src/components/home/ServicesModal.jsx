import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const allServices = [
    {
        category: 'Электролаборатория до 110кВ',
        items: [
            'Испытания силовых трансформаторов',
            'Испытания кабельных линий 0.4-110кВ',
            'Испытания масляных и вакуумных выключателей',
            'Испытания оборудования до 1кВ',
            'Тепловизионный контроль',
            'Испытания молниезащиты и заземления',
            'Измерение качества электроэнергии',
            'Проверка изоляции и металлосвязи',
            'Испытания автоматических выключателей',
            'Измерение сопротивления петли фаза-ноль'
        ]
    },
    {
        category: 'Монтажные работы',
        items: [
            'Ретрофит (модернизация) ячеек 6-10кВ',
            'Монтаж систем АВР (автоматический ввод резерва)',
            'Монтаж защиты от дуговых замыканий (ЗДЗ)',
            'Монтаж трансформаторных подстанций',
            'Монтаж комплектных трансформаторных подстанций',
            'Прокладка кабельных линий',
            'Монтаж воздушных линий',
            'Сборка распределительных щитов',
            'Монтаж систем освещения',
            'Монтаж систем заземления'
        ]
    },
    {
        category: 'Релейная защита и автоматика',
        items: [
            'Расчет уставок защит',
            'Проверка при новом включении (наладка)',
            'Проверка исправности и работоспособности',
            'Проверка характеристик трансформаторов тока',
            'Проверка высоковольтных выключателей',
            'Наладка микропроцессорных защит',
            'Модернизация устаревших защит',
            'Техническое обслуживание РЗиА',
            'Монтаж систем телеуправления',
            'Интеграция с АСКУЭ'
        ]
    },
    {
        category: 'Обслуживание и ремонт',
        items: [
            'Техническое обслуживание до 10кВ',
            'Капитальный ремонт электроустановок',
            'Оперативно-техническое обслуживание',
            'Аварийные работы 24/7',
            'Восстановление кабельных линий',
            'Поиск повреждения кабеля',
            'Диагностика оборудования',
            'Планово-предупредительный ремонт',
            'Замена масла в трансформаторах',
            'Ремонт силовых выключателей'
        ]
    },
    {
        category: 'Проектирование',
        items: [
            'Расчет электрических нагрузок',
            'Разработка однолинейных схем',
            'Проектирование внешнего электроснабжения',
            'Проектирование внутреннего электроснабжения',
            'Проектирование систем освещения',
            'Согласование в Ростехнадзоре',
            'Авторский надзор за строительством',
            'Разработка технических условий'
        ]
    }
];

export default function ServicesModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Полный спектр услуг</h2>
                                    <p className="text-slate-400 text-sm">Все виды работ по электроэнергетике</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
                                <div className="space-y-8">
                                    {allServices.map((category, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                                                </div>
                                                {category.category}
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {category.items.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                                        <span className="text-slate-700 text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-200 p-6 bg-slate-50">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-slate-600 text-sm">
                                        Нужна консультация? Звоните: <a href="tel:+79302460077" className="font-bold text-orange-600 hover:text-orange-700">+7 (930) 246-00-77</a>
                                    </p>
                                    <Button onClick={onClose} className="bg-orange-600 hover:bg-orange-700">
                                        Закрыть
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}