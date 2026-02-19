import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const priceCategories = [
    {
        title: 'Электроизмерения до 1000В',
        items: [
            { name: 'Визуальный осмотр электроустановки', unit: 'осмотр', price: 'от 2 500', tooltip: 'Проверка соответствия ЭУ требованиям НТД' },
            { name: 'Измерение сопротивления изоляции', unit: 'линия', price: 'от 100', tooltip: 'Измерение изоляции кабельных линий' },
            { name: 'Проверка металлосвязи', unit: 'точка', price: 'от 25', tooltip: 'Проверка цепи между заземлителем и заземляемым элементом' },
            { name: 'Измерение петли фаза-ноль', unit: 'линия', price: 'от 200', tooltip: 'Измерение полного сопротивления цепи' },
            { name: 'Прогрузка автоматов до 250А', unit: 'шт', price: 'от 150', tooltip: 'Проверка срабатывания автоматических выключателей' },
            { name: 'Прогрузка автоматов 250-630А', unit: 'шт', price: 'от 250' },
            { name: 'Прогрузка автоматов 1000-1600А', unit: 'шт', price: 'от 500' },
            { name: 'Проверка УЗО и дифавтоматов', unit: 'шт', price: 'от 300' },
            { name: 'Измерение контура заземления', unit: 'устр-во', price: 'от 3 500' },
            { name: 'Тепловизионный контроль', unit: 'осмотр', price: 'от 5 000', tooltip: 'Выявление перегрева контактных соединений' },
        ]
    },
    {
        title: 'Испытания свыше 1000В (до 110кВ)',
        items: [
            { name: 'Испытание КЛ до 10кВ', unit: 'линия', price: 'от 10 000', tooltip: 'Высоковольтные испытания кабельных линий' },
            { name: 'Испытание КЛ 35кВ', unit: 'линия', price: 'от 25 000' },
            { name: 'Испытание силовых трансформаторов', unit: 'шт', price: 'от 14 000', tooltip: 'Комплекс испытаний силового трансформатора' },
            { name: 'Испытание КРУ/КРУН', unit: 'ячейка', price: 'от 15 000' },
            { name: 'Испытание вакуумных выключателей', unit: 'шт', price: 'от 3 000' },
            { name: 'Наладка устройств РЗиА', unit: 'устр-во', price: 'от 10 000', tooltip: 'Наладка релейной защиты и автоматики' },
            { name: 'Проверка трансформаторов тока', unit: 'шт', price: 'от 500' },
            { name: 'Проверка трансформаторов напряжения', unit: 'шт', price: 'от 3 000' },
            { name: 'Измерение tg δ изоляции', unit: 'измер', price: 'от 5 000' },
            { name: 'Наладка схемы АВР', unit: 'схема', price: 'от 15 000' },
        ]
    },
    {
        title: 'Монтажные работы',
        items: [
            { name: 'Прокладка КЛ 0.4кВ', unit: 'п.м.', price: 'от 350', tooltip: 'Прокладка кабеля в траншее' },
            { name: 'Прокладка КЛ 10кВ', unit: 'п.м.', price: 'от 800' },
            { name: 'Монтаж КТП', unit: 'шт', price: 'от 150 000', tooltip: 'Монтаж комплектной трансформаторной подстанции' },
            { name: 'Монтаж ячейки КРУ', unit: 'шт', price: 'от 35 000' },
            { name: 'Монтаж силового трансформатора', unit: 'шт', price: 'от 80 000' },
            { name: 'Монтаж опоры ВЛ', unit: 'шт', price: 'от 25 000' },
            { name: 'Монтаж контура заземления', unit: 'компл', price: 'от 35 000' },
            { name: 'Монтаж молниезащиты', unit: 'м²', price: 'от 150' },
        ]
    },
    {
        title: 'Техническое обслуживание',
        items: [
            { name: 'ТО трансформаторной подстанции', unit: 'мес', price: 'от 25 000', tooltip: 'Ежемесячное обслуживание ТП' },
            { name: 'Аварийное обслуживание 24/7', unit: 'мес', price: 'от 15 000' },
            { name: 'Диагностика КЛ (дефектоскопия)', unit: 'линия', price: 'от 20 000' },
            { name: 'Поиск повреждения КЛ', unit: 'выезд', price: 'от 15 000' },
            { name: 'Ревизия масляного выключателя', unit: 'шт', price: 'от 8 000' },
            { name: 'Замена масла в трансформаторе', unit: 'л', price: 'от 150' },
        ]
    }
];

export default function PriceSection() {
    const [openCategories, setOpenCategories] = useState(['Электроизмерения до 1000В']);

    const toggleCategory = (title) => {
        setOpenCategories(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

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
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Прайс-лист</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
                        Стоимость услуг
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Прозрачные цены без скрытых платежей. Точная стоимость рассчитывается после осмотра объекта
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto space-y-4">
                    <TooltipProvider>
                        {priceCategories.map((category, catIndex) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                            >
                                <Collapsible
                                    open={openCategories.includes(category.title)}
                                    onOpenChange={() => toggleCategory(category.title)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <button className="w-full bg-slate-50 hover:bg-slate-100 rounded-xl p-5 flex items-center justify-between transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                                                    {catIndex + 1}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900">{category.title}</h3>
                                                <Badge variant="outline" className="text-slate-500">
                                                    {category.items.length} позиций
                                                </Badge>
                                            </div>
                                            {openCategories.includes(category.title) ? (
                                                <ChevronUp className="w-5 h-5 text-slate-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="mt-2 bg-white border border-slate-100 rounded-xl overflow-hidden">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Наименование</th>
                                                        <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600 w-24">Ед. изм.</th>
                                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 w-32">Цена, ₽</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {category.items.map((item, index) => (
                                                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-slate-700">{item.name}</span>
                                                                    {item.tooltip && (
                                                                        <Tooltip>
                                                                            <TooltipTrigger>
                                                                                <HelpCircle className="w-4 h-4 text-slate-400" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p className="max-w-xs">{item.tooltip}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4 text-center text-slate-500 text-sm">{item.unit}</td>
                                                            <td className="py-3 px-4 text-right font-semibold text-orange-500">{item.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </motion.div>
                        ))}
                    </TooltipProvider>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 text-center"
                >
                    <p className="text-slate-500 mb-4">
                        * Указаны ориентировочные цены. Точная стоимость определяется после осмотра объекта
                    </p>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                        Получить точный расчёт
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}