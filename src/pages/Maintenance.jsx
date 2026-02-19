import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Wrench, Hammer, PhoneCall, CheckCircle2, Clock, Shield } from 'lucide-react';

const services = [
    {
        id: 'to',
        icon: Wrench,
        title: 'Техническое обслуживание',
        subtitle: 'Плановое ТО электроустановок до 10 кВ',
        description: 'Регламентное техническое обслуживание электрооборудования РУ-0,4–10 кВ, ТП, КТП по ПТЭЭП и ПУЭ. Комплексная профилактика для предотвращения аварийных ситуаций и продления межремонтного периода. Своевременное выявление дефектов оборудования на ранних стадиях, измерительный контроль изоляции, подтяжка контактных соединений, очистка и смазка коммутационных аппаратов. Документальное оформление актов осмотров и протоколов испытаний для предъявления в Ростехнадзор.',
        works: [
            'Визуальный осмотр РУ, ячеек 6-10 кВ, трансформаторов и КЛ',
            'Измерение сопротивления изоляции и переходных контактов',
            'Тепловизионная диагностика контактных соединений',
            'Проверка исправности устройств РЗиА и цепей управления',
            'Подтяжка и зачистка болтовых соединений',
            'Очистка оборудования от пыли, масляных отложений',
            'Смазка приводов выключателей и разъединителей',
            'Составление дефектных ведомостей и актов осмотров'
        ],
        periodicity: ['Ежемесячно', 'Ежеквартально', 'Ежегодно'],
        price: 'от 40 000 ₽/ТП'
    },
    {
        id: 'repair',
        icon: Hammer,
        title: 'Капитальный ремонт',
        subtitle: 'Восстановление ресурса электроустановок',
        description: 'Капитальный ремонт силовых трансформаторов, высоковольтных ячеек, масляных и вакуумных выключателей с полной заменой изношенных узлов. Восстановление технических характеристик оборудования до паспортных значений, модернизация устаревших систем управления и защиты. Включает дефектовку, разборку, ревизию, замену вводов, изоляторов, контактных систем. После завершения ремонта — полный цикл приемо-сдаточных испытаний согласно нормам ПУЭ и ПТЭЭП с оформлением протоколов и актов.',
        works: [
            'Дефектовка оборудования с оценкой технического состояния',
            'Замена высоковольтных вводов, опорных изоляторов',
            'Ревизия и ремонт силовых трансформаторов 6-10/0,4 кВ',
            'Замена контактной системы масляных и вакуумных выключателей',
            'Модернизация панелей РЗиА, переход на микропроцессорные устройства',
            'Замена коммутационных аппаратов в РУ-0,4 кВ',
            'Ревизия кабельных линий, замена поврежденных участков',
            'Приемо-сдаточные испытания по полному объему ПТЭЭП'
        ],
        periodicity: ['По дефектным ведомостям', 'Раз в 5-10 лет'],
        price: 'от 75 000 ₽/ТП'
    },
    {
        id: 'operative',
        icon: PhoneCall,
        title: 'Оперативно-техническое обслуживание',
        subtitle: 'Выездной дежурный персонал на объекте',
        description: 'Оперативно-техническое обслуживание электроустановок силами аттестованного персонала с группой допуска V до и выше 1000В. Круглосуточное или посменное дежурство на промышленных объектах, ТЦ, БЦ. Оперативные переключения в схемах электроснабжения, допуск подрядчиков, ведение оперативной документации, взаимодействие с диспетчерской службой энергоснабжающей организации. Персонал обеспечивает непрерывный контроль параметров работы электрооборудования, мгновенное реагирование на аварийные ситуации.',
        works: [
            'Оперативные переключения в РУ 6-10 кВ и 0,4 кВ',
            'Допуск и надзор за работой подрядных организаций',
            'Постоянный контроль параметров электроустановок',
            'Ведение оперативного журнала и диспетчерских бланков',
            'Аварийно-восстановительные работы в режиме 24/7',
            'Взаимодействие с энергоснабжающей организацией',
            'Диспетчеризация и мониторинг режимов работы оборудования',
            'Локализация повреждений и восстановление электроснабжения'
        ],
        periodicity: ['24/7', 'По графику', 'Аварийные вызовы'],
        price: 'от 9 000 ₽/ТП'
    },
    {
        id: 'emergency',
        icon: PhoneCall,
        title: 'Аварийные работы 24/7',
        subtitle: 'Экстренное восстановление электроснабжения',
        description: 'Круглосуточная аварийная служба для немедленного реагирования на отключения электроснабжения, короткие замыкания, пожары в электроустановках. Выезд бригады в течение 1–2 часов с момента вызова. Оперативная локализация места повреждения с применением приборов поиска КЗ, восстановление поврежденных участков кабельных линий, замена вышедших из строя аппаратов защиты. Минимизация времени простоя объекта и финансовых потерь заказчика. После восстановления — полный акт о выполненных работах.',
        works: [
            'Экстренный выезд бригады в течение 1-2 часов',
            'Локализация места КЗ с использованием кабелеискателей',
            'Поиск повреждений кабельных линий в земле',
            'Восстановление поврежденных участков кабелей',
            'Замена сгоревших автоматических выключателей и предохранителей',
            'Восстановление схемы электроснабжения после пожара',
            'Временные схемы питания до выполнения капремонта',
            'Оформление актов аварийно-восстановительных работ'
        ],
        periodicity: ['24/7', 'Без выходных'],
        price: 'от 120 000 ₽/кабель'
    }
];

const advantages = [
    { icon: Shield, title: 'Аттестованный персонал', text: 'Группа допуска V до и выше 1000В' },
    { icon: Clock, title: 'Быстрый выезд', text: 'В течение 2 часов' },
    { icon: CheckCircle2, title: 'Официальные акты', text: 'По ПТЭЭП и ПУЭ' }
];

export default function Maintenance() {
    const [activeService, setActiveService] = useState('to');
    const currentService = services.find(s => s.id === activeService);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
                            <Wrench className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-sm font-bold">Обслуживание объектов</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">
                            Техническое обслуживание <br />объектов энергетики
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            ТО, капремонт и оперативное обслуживание электроустановок до 10 кВ. 
                            Работаем по ПТЭЭП, ПУЭ, ГОСТ. Аварийные выезды 24/7.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Преимущества */}
            <section className="py-12 border-b">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        {advantages.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        <div className="text-sm text-slate-600">{item.text}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Вкладки услуг */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <button
                                key={service.id}
                                onClick={() => setActiveService(service.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                    activeService === service.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {service.title}
                            </button>
                        );
                    })}
                </div>

                {currentService && (
                    <motion.div
                        key={currentService.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-4">{currentService.subtitle}</h2>
                        <p className="text-slate-600 mb-8">{currentService.description}</p>

                        <h3 className="text-xl font-bold mb-4">Состав работ:</h3>
                        <ul className="custom-list mb-8">
                            {currentService.works.map((work, i) => (
                                <li key={i}>{work}</li>
                            ))}
                        </ul>

                        <div className="bg-slate-50 rounded-xl p-6 mb-6">
                            <div className="font-bold mb-2">Периодичность:</div>
                            <div className="flex gap-2 flex-wrap">
                                {currentService.periodicity.map((period, i) => (
                                    <span key={i} className="bg-white px-3 py-1 rounded-lg text-sm border border-slate-200">
                                        {period}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                            <div className="text-sm text-slate-600 mb-1">Стоимость:</div>
                            <div className="text-3xl font-bold text-orange-600">{currentService.price}</div>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* Калькулятор */}
            <section className="bg-slate-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Индивидуальный расчет стоимости обслуживания вашего объекта</h2>
                        <p className="text-slate-600 mb-8">
                            Стоимость зависит от мощности объекта, количества оборудования и периодичности работ. Оставьте заявку — подготовим коммерческое предложение в течение 24 часов.
                        </p>
                        <Link to={createPageUrl('Contacts')}>
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg">
                                Получить расчет
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}