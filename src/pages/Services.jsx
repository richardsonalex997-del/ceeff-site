import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Activity, Gauge, Cpu, Cloud } from 'lucide-react';

const tabs = [
    { id: 'high', name: 'Высоковольтные испытания', icon: Zap },
    { id: 'rza', name: 'РЗиА', icon: Cpu },
    { id: 'transformers', name: 'Трансформаторы', icon: Activity },
    { id: 'low', name: 'До 1 кВ', icon: Gauge },
    { id: 'lightning', name: 'Молниезащита', icon: Cloud },
    { id: 'install', name: 'Монтаж', icon: Shield }
];

const servicesData = {
    high: {
        title: 'Высоковольтные испытания (6-110 кВ)',
        description: 'Полный комплекс испытаний электрооборудования высокого напряжения согласно ПТЭЭП и ГОСТ.',
        services: [
            { name: 'Испытание кабельных линий', detail: 'Бумажная изоляция, сшитый полиэтилен' },
            { name: 'Испытание выключателей', detail: 'Масляные, вакуумные, элегазовые' },
            { name: 'Испытание разъединителей', detail: 'До 110 кВ' },
            { name: 'Испытание шин и шинопроводов', detail: 'Измерение сопротивления изоляции' },
            { name: 'Проверка ОПН', detail: 'Ограничители перенапряжений' },
            { name: 'Тангенс диэлектрических потерь', detail: 'Высоковольтные вводы, трансформаторы' }
        ]
    },
    rza: {
        title: 'Релейная защита и автоматика',
        description: 'Наладка, проверка и расчет уставок устройств РЗиА. Новое включение и периодические проверки.',
        services: [
            { name: 'Расчет уставок РЗиА', detail: 'Для всех типов защит' },
            { name: 'Наладка устройств', detail: 'Новое включение оборудования' },
            { name: 'Проверка работоспособности', detail: 'Периодические испытания' },
            { name: 'Снятие характеристик ТТ', detail: 'Проверка трансформаторов тока' },
            { name: 'Проверка выключателей', detail: 'Времятоковые характеристики' },
            { name: 'Монтаж и ТО РЗиА', detail: 'Установка и обслуживание' }
        ]
    },
    transformers: {
        title: 'Трансформаторы и масло',
        description: 'Диагностика силовых трансформаторов до 110 кВ. Анализ трансформаторного масла.',
        services: [
            { name: 'Диагностика трансформаторов', detail: 'До 110 кВ' },
            { name: 'Хроматографический анализ масла', detail: 'ГОСТ 6581-75' },
            { name: 'Испытание масла', detail: 'Пробивное напряжение' },
            { name: 'Тепловизионный контроль', detail: 'Обмотки и контакты' },
            { name: 'Измерение сопротивления обмоток', detail: 'Постоянному току' },
            { name: 'Проверка устройств РПН', detail: 'Регулирование под нагрузкой' }
        ]
    },
    low: {
        title: 'Низковольтное оборудование (до 1 кВ)',
        description: 'Испытания электрооборудования до 1000 В. Измерение изоляции, заземления, петли фаза-ноль.',
        services: [
            { name: 'Сопротивление изоляции', detail: 'Кабелей, электродвигателей, щитов' },
            { name: 'Проверка металлосвязи', detail: 'Непрерывность защитного проводника' },
            { name: 'Испытание автоматов', detail: 'До 1000А' },
            { name: 'Петля «фаза-ноль»', detail: 'Проверка срабатывания защиты' },
            { name: 'Сопротивление заземления', detail: 'Контур заземления' },
            { name: 'Проверка АКБ', detail: 'Аккумуляторные батареи' },
            { name: 'Конденсаторные батареи', detail: 'Компенсация реактивной мощности' }
        ]
    },
    lightning: {
        title: 'Молниезащита и заземление',
        description: 'Проверка систем молниезащиты и заземляющих устройств согласно РД 34.21.122-87 и СО 153-34.21.122-2003.',
        services: [
            { name: 'Измерение сопротивления грунта', detail: 'Удельное сопротивление' },
            { name: 'Проверка контура заземления', detail: 'Сопротивление растеканию тока' },
            { name: 'Испытание заземлителей', detail: 'Естественные и искусственные' },
            { name: 'Проверка устройств молниезащиты', detail: 'Молниеприемники, токоотводы' },
            { name: 'Тепловизионный контроль', detail: 'Контактных соединений' },
            { name: 'Проверка уравнивания потенциалов', detail: 'ГОСТ Р 50571.10-96' }
        ]
    },
    install: {
        title: 'Монтажные работы под ключ',
        description: 'Электромонтаж, реконструкция и модернизация электрооборудования. Ретрофит ячеек 6-10 кВ.',
        services: [
            { name: 'Ретрофит ячеек 6-10 кВ', detail: 'Замена выключателей на современные' },
            { name: 'Монтаж АВР', detail: 'Автоматический ввод резерва' },
            { name: 'Монтаж ЗДЗ', detail: 'Защита от замыканий на землю' },
            { name: 'Монтаж РЗиА под ключ', detail: 'Полный цикл работ' },
            { name: 'Системы телеуправления', detail: 'Диспетчеризация объектов' },
            { name: 'Сборка и монтаж щитов', detail: 'До 1000В' }
        ]
    }
};

export default function Services() {
    const [activeTab, setActiveTab] = useState('high');
    const currentData = servicesData[activeTab];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
                            <Zap className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400 text-sm font-bold">Свидетельство №1428</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">Услуги электролаборатории</h1>
                        <p className="text-xl text-slate-300">
                            Полный спектр испытаний электрооборудования до 110 кВ. Аттестация Ростехнадзора. 
                            Официальные протоколы за 24 часа.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Вкладки */}
            <section className="border-b sticky top-[73px] bg-white z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-orange-600 text-white shadow-lg'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Контент */}
            <section className="container mx-auto px-4 py-16">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="max-w-4xl">
                        <h2 className="text-4xl font-bold mb-4">{currentData.title}</h2>
                        <p className="text-xl text-slate-600 mb-12">{currentData.description}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {currentData.services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white border-2 border-slate-100 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{service.name}</h3>
                                            <p className="text-sm text-slate-600">{service.detail}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="bg-slate-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Нужна консультация по испытаниям?</h2>
                    <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                        Оставьте заявку, и наш инженер свяжется с вами для уточнения деталей и расчета стоимости.
                    </p>
                    <a href={`tel:+79302460077`}>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg">
                            Позвонить: +7 (930) 246-00-77
                        </button>
                    </a>
                </div>
            </section>
        </div>
    );
}