import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, FileCheck, Award, Shield, Clock, Zap, Building2, TrendingUp, X } from 'lucide-react';

import { Dialog, DialogContent } from "@/components/ui/dialog";

const licenses = [
        { 
            category: 'lab', 
            icon: 'file-text', 
            title: 'Свидетельство ЭТЛ №1428',
            number: '1428 от 15.03.2024',
            validity: 'до 15.03.2027',
            image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/816087ca8__page-0001.jpg'
        },
        { 
            category: 'design', 
            icon: 'pen-tool', 
            title: 'СРО Проектное',
            number: 'П-153-005260481249-4155',
            validity: 'от 04.12.2025',
            images: [
                'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/a80763916__pages-to-jpg-0001.jpg',
                'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/4394afe9b__pages-to-jpg-0002.jpg'
            ]
        },
    ];

const stats = [
    { value: '14+', label: 'лет на рынке', icon: TrendingUp },
    { value: '500+', label: 'выполненных проектов', icon: Building2 },
    { value: '20', label: 'инженеров в штате', icon: Users },
    { value: '24/7', label: 'аварийная служба', icon: Clock },
];

export default function About() {
        const [selectedLicense, setSelectedLicense] = useState(null);

        React.useEffect(() => {
            document.title = 'О компании | ЦЭФ - Электролаборатория и электромонтаж';
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', 'Узнайте о ЦЭФ — компании с 14+ летним опытом. Профессиональная электролаборатория, лицензия Ростехнадзора, собственный штат инженеров, гарантия качества.');
            }
        }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-center"
                    >
                        О компании
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto text-center"
                    >
                        Команда профессионалов, объединившая опыт советской школы энергетики и современные цифровые технологии диагностики
                    </motion.p>
                </div>
            </div>

            {/* Stats */}
            <div className="container mx-auto px-4 -mt-12">
                <div className="grid md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-center"
                        >
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                            <div className="text-slate-600 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto mb-20"
                >
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 text-center">Почему мы надежный партнер?</h2>
                    <div className="text-slate-600 text-lg mb-8 space-y-4 text-center">
                        <p>
                            Мы работаем на рынке электроэнергетики более 14 лет. За это время мы не просто накопили опыт, 
                            а создали систему контроля качества, которая исключает ошибки при измерениях и монтаже.
                        </p>
                        <p>
                            Электролаборатория зарегистрирована в Волжско-Окском управлении Ростехнадзора (свидетельство №1428). 
                            Весь персонал имеет аттестацию Ростехнадзора, группа допуска V до и выше 1000В.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">Финансовая гарантия</h4>
                                <p className="text-slate-600">
                                    Наша ответственность застрахована на 10 млн рублей. Вы защищены юридически при любых обстоятельствах.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">Собственный штат</h4>
                                <p className="text-slate-600">
                                    20 инженеров с группами допуска IV и V до и выше 1000В. Все специалисты имеют профильное образование и регулярно проходят аттестацию.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                                <FileCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">Прозрачность</h4>
                                <p className="text-slate-600">
                                    Работаем с НДС, предоставляем сметы в ФЕР/ТЕР или коммерческих ценах. Полный пакет закрывающих документов с печатями и подписями.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">Собственное оборудование</h4>
                                <p className="text-slate-600">
                                    Не арендуем приборы. Работаем на комплексах Retom, Fluke, Testo, АИД. Все оборудование прошло поверку в ЦСМ.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Our Approach */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-12 mb-20">
                    <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Наш подход к работе</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-600">1</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Анализ объекта</h3>
                            <p className="text-slate-600 text-sm">
                                Выезжаем на объект, проводим предварительное обследование и согласовываем объем работ
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-600">2</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Выполнение работ</h3>
                            <p className="text-slate-600 text-sm">
                                Проводим испытания/монтаж строго по ПТЭЭП и ПУЭ, фиксируем все параметры в протоколах
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-600">3</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Сдача документов</h3>
                            <p className="text-slate-600 text-sm">
                                Оформляем технический отчет с печатями и подписями. Готово к предъявлению в Ростехнадзор
                            </p>
                        </div>
                    </div>
                </div>

                {/* Regulatory Base Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold mb-4 text-center">Нормативная база</h2>
                    <p className="text-center text-slate-500 mb-10">
                        Все работы выполняются в строгом соответствии с действующими нормативными документами РФ
                    </p>

                    <div className="max-w-4xl mx-auto space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2 text-slate-900">ПТЭЭП</h3>
                            <p className="text-slate-600 text-sm">
                                Правила технической эксплуатации электроустановок потребителей электрической энергии. 
                                Приказ Минэнерго России от 12.08.2022 № 811
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2 text-slate-900">ПУЭ</h3>
                            <p className="text-slate-600 text-sm">
                                Правила устройства электроустановок. Седьмое издание с изменениями и дополнениями
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2 text-slate-900">Правила по охране труда</h3>
                            <p className="text-slate-600 text-sm">
                                Правила по охране труда при эксплуатации электроустановок. 
                                Приказ Минтруда России от 15.12.2020 № 903н
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2 text-slate-900">Правила переключений</h3>
                            <p className="text-slate-600 text-sm">
                                Правила переключений в электроустановках. Приказ Минэнерго России от 13.09.2018 № 757
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2 text-slate-900">ГОСТ и межотраслевые нормы</h3>
                            <p className="text-slate-600 text-sm">
                                Государственные стандарты на электрооборудование, методы испытаний и эксплуатации. 
                                Технические регламенты Таможенного союза
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2 text-slate-900">Правила технологического функционирования</h3>
                            <p className="text-slate-600 text-sm">
                                Правила технологического функcionирования электроэнергетических систем. 
                                Постановление Правительства РФ от 13.08.2018 № 937
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="font-bold text-lg mb-2 text-slate-900">Тарифы на технологическое присоединение</h3>
                            <p className="text-slate-600 text-sm">
                                Стандартизированные тарифные ставки для расчета платы за технологическое присоединение к электрическим сетям. 
                                Решение региональной службы по тарифам Нижегородской области от 27.11.2025 № 52/1
                            </p>
                        </motion.div>
                        </div>
                        </div>

                {/* Licenses Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-center">Лицензии и сертификаты</h2>
                    <p className="text-center text-slate-500 mb-10">
                        Все наши работы выполняются на основании действующих лицензий и допусков
                    </p>

                    <div className="grid md:grid-cols-4 gap-6">
                        {licenses.map((license, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => (license.image || license.images) && setSelectedLicense(license)}
                            >
                                <div className="bg-slate-50 h-64 border border-slate-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                                    {license.image || license.images ? (
                                        <>
                                            <img 
                                                       src={license.image || license.images[0]} 
                                                       alt={license.title}
                                                       loading="lazy"
                                                       className="w-full h-full object-cover"
                                                    />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                                    <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Просмотреть</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-center font-bold mt-3 text-sm">{license.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* License Viewer Modal */}
            <Dialog open={!!selectedLicense} onOpenChange={() => setSelectedLicense(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    {selectedLicense && (
                        <div className="relative">
                            <button
                                onClick={() => setSelectedLicense(null)}
                                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-4">{selectedLicense.title}</h3>
                                {selectedLicense.image ? (
                                    <img 
                                         src={selectedLicense.image} 
                                         alt={selectedLicense.title}
                                         loading="lazy"
                                         className="w-full rounded-lg"
                                     />
                                ) : selectedLicense.images ? (
                                    <div className="space-y-4">
                                        {selectedLicense.images.map((img, idx) => (
                                            <img 
                                                 key={idx}
                                                 src={img} 
                                                 alt={`${selectedLicense.title} - страница ${idx + 1}`}
                                                 loading="lazy"
                                                 className="w-full rounded-lg"
                                             />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>


        </div>
    );
}