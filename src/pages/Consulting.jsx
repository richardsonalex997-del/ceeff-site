import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FileText, Calculator, ClipboardCheck, Shield, TrendingUp, Award } from 'lucide-react';

const services = [
    {
        icon: FileText,
        title: 'Аудит проектной документации на соответствие ПУЭ и ПТЭЭП',
        description: 'Экспертная проверка проектов электроснабжения перед сдачей в Ростехнадзор или госэкспертизу. Выявление ошибок в однолинейных схемах, несоответствий требованиям ПУЭ, СП, ГОСТ. Анализ расчетов токов КЗ, выбора сечений кабелей, уставок защитных аппаратов. Предоставление письменного заключения эксперта с рекомендациями по доработке. Минимизация риска возврата проекта на доработку контролирующими органами.',
        details: [
            'Проверка проектов РУ-0,4–10 кВ, ТП, КТП на соответствие ПУЭ-7',
            'Анализ однолинейных схем и расчетов токов короткого замыкания',
            'Проверка выбора сечений кабелей и защитных аппаратов',
            'Выявление нарушений требований ПТЭЭП и СП 256.1325800',
            'Экспертное заключение с перечнем замечаний и рекомендациями'
        ],
        price: 'от 60 000 ₽'
    },
    {
        icon: Shield,
        title: 'Помощь в получении акта допуска в эксплуатацию от Ростехнадзора',
        description: 'Комплексное сопровождение процедуры ввода в эксплуатацию электроустановок 6-10 кВ. Подготовка пакета документов для подачи в Ростехнадзор: технические отчеты, протоколы испытаний, акты наладки РЗиА, исполнительная документация. Проведение контрольных измерений и испытаний по программе приемо-сдаточных работ. Устранение замечаний инспектора на объекте. Получение акта допуска электроустановки в эксплуатацию в минимальные сроки.',
        details: [
            'Подготовка технической документации для подачи в РТН',
            'Приемо-сдаточные испытания по полной программе ПТЭЭП',
            'Оформление протоколов, актов наладки РЗиА и технического отчета',
            'Сопровождение проверки инспектором Ростехнадзора на объекте',
            'Получение официального акта допуска в эксплуатацию'
        ],
        price: 'от 60 000 ₽'
    },
    {
        icon: TrendingUp,
        title: 'Оптимизация затрат на электроэнергию и анализ тарифов',
        description: 'Энергоаудит промышленных и коммерческих объектов с выявлением зон избыточного потребления и потерь электроэнергии. Анализ существующих договоров энергоснабжения, расчет оптимальной тарифной группы. Тепловизионное обследование для выявления перегревов оборудования. Рекомендации по внедрению систем компенсации реактивной мощности, замене устаревших энергоемких устройств. Расчет окупаемости мероприятий по энергосбережению.',
        details: [
            'Анализ структуры энергопотребления предприятия',
            'Тепловизионная диагностика электрооборудования',
            'Расчет технических потерь в кабельных линиях и трансформаторах',
            'Оптимизация тарифов, выбор группы потребителей',
            'Разработка плана мероприятий по снижению энергозатрат с ROI'
        ],
        price: 'от 35 000 ₽'
    },
    {
        icon: ClipboardCheck,
        title: 'Разработка однолинейных схем электроснабжения и регламентов обслуживания',
        description: 'Разработка исполнительных однолинейных схем электроснабжения объекта с актуализацией после реконструкций и модернизаций. Подготовка паспортов электроустановок, инструкций по эксплуатации для оперативного и ремонтного персонала. Составление графиков планово-предупредительных ремонтов и технического обслуживания в соответствии с требованиями ПТЭЭП. Разработка внутренних регламентов безопасности при работе в электроустановках.',
        details: [
            'Однолинейные схемы электроснабжения в формате AutoCAD/DWG',
            'Паспорта РУ-0,4–10 кВ, трансформаторов, кабельных линий',
            'Инструкции по эксплуатации и охране труда для персонала',
            'Графики ППР и регламенты технического обслуживания',
            'Журналы учета, бланки нарядов-допусков, оперативные журналы'
        ],
        price: 'от 9 000 ₽'
    }
];

const advantages = [
    { title: 'Экспертный опыт 14+ лет', description: 'Работаем с объектами всех уровней напряжения' },
    { title: 'Знание нормативной базы', description: 'ПУЭ, ПТЭЭП, СП, ГОСТ в актуальных редакциях' },
    { title: 'Практический подход', description: 'Решения для реальных производств, ТЦ, БЦ' },
    { title: 'Гарантия результата', description: 'Устраняем замечания РТН за свой счет' }
];

export default function Consulting() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
                            <FileText className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-bold">Консалтинг</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">
                            Консалтинг и техническая экспертиза <br />для объектов энергетики
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Помощь главным энергетикам, собственникам производств и управляющим компаниям в вопросах соответствия требованиям Ростехнадзора, оптимизации энергопотребления, подготовки проектной документации. Работаем с РУ, ТП, КТП до 110 кВ.
                        </p>
                        <Link to={createPageUrl('Contacts')}>
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
                                Получить консультацию
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Преимущества */}
            <section className="py-12 border-b">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-6">
                        {advantages.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                                <div className="text-sm text-slate-600">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Услуги */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center mb-4">Услуги консалтинга</h2>
                <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
                    Решаем бюрократические и технические задачи для вашего объекта: от проверки проектов до получения актов РТН
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-green-300 hover:shadow-xl transition-all"
                            >
                                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                                    <Icon className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                                
                                <ul className="custom-list text-sm text-slate-600 mb-4">
                                    {service.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                                
                                <div className="pt-4 border-t border-slate-100">
                                    <span className="text-orange-600 font-bold">{service.price}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-slate-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Нужна консультация по вашему объекту?</h2>
                    <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                        Оставьте заявку, и наш эксперт свяжется с вами в течение часа для обсуждения задачи.
                    </p>
                    <Link to={createPageUrl('Contacts')}>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg">
                            Связаться с экспертом
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}