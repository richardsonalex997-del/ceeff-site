import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingChat from '@/components/home/FloatingChat';

const faqs = [
    {
        question: 'Что такое электролаборатория и зачем она нужна?',
        answer: 'Электролаборатория (ЭТЛ) — это аккредитованная организация, которая проводит испытания и измерения электрооборудования. Она необходима для ввода объектов в эксплуатацию, проверки безопасности электроустановок, получения актов допуска от Ростехнадзора и соблюдения требований пожарной безопасности.'
    },
    {
        question: 'Какие документы вы предоставляете по результатам испытаний?',
        answer: 'По результатам работ мы предоставляем полный комплект документов: технический отчёт с протоколами измерений, ведомость дефектов (при наличии), рекомендации по устранению нарушений. Все документы оформляются в соответствии с требованиями ПТЭЭП и ПУЭ, принимаются Ростехнадзором и МЧС.'
    },
    {
        question: 'Как часто нужно проводить испытания электрооборудования?',
        answer: 'Периодичность испытаний зависит от типа объекта: для офисов и торговых помещений — 1 раз в 3 года, для производств — 1 раз в год, для взрывоопасных зон — 1 раз в 6 месяцев. Также испытания обязательны при вводе в эксплуатацию, после ремонта и реконструкции.'
    },
    {
        question: 'Сколько времени занимают испытания?',
        answer: 'Сроки зависят от объёма работ. Небольшой офис (до 100 м²) — 1-2 часа. Производственный цех — 1-2 дня. Трансформаторная подстанция — 2-3 дня. Точные сроки определяются после осмотра объекта и согласовываются в договоре.'
    },
    {
        question: 'Работаете ли вы в выходные и праздники?',
        answer: 'Да, мы работаем без выходных. Для объектов с непрерывным производством проводим испытания в ночное время и выходные дни без дополнительной наценки. Аварийная служба работает 24/7.'
    },
    {
        question: 'Какова стоимость выезда специалиста?',
        answer: 'Выезд инженера для осмотра объекта и оценки объёма работ — бесплатно. Стоимость самих работ зависит от количества оборудования, класса напряжения и сложности объекта. После осмотра мы предоставляем детальную смету.'
    },
    {
        question: 'Какие допуски имеют ваши специалисты?',
        answer: 'Все наши инженеры имеют группу допуска по электробезопасности не ниже IV (до и выше 1000В), удостоверения по охране труда, допуски к работам на высоте и в электроустановках. Персонал регулярно проходит аттестацию и повышение квалификации.'
    },
    {
        question: 'Можно ли заказать только часть работ?',
        answer: 'Да, вы можете заказать как комплексное обследование, так и отдельные виды измерений: только сопротивление изоляции, только заземление, только прогрузку автоматов и т.д. Мы гибко подходим к потребностям каждого клиента.'
    },
    {
        question: 'В каких регионах вы работаете?',
        answer: 'Мы работаем по всей России. Основная зона обслуживания — Центральный федеральный округ. Для удалённых объектов возможен выезд бригады с проживанием. Транспортные расходы обсуждаются индивидуально.'
    },
    {
        question: 'Что делать, если обнаружены нарушения?',
        answer: 'При обнаружении нарушений мы составляем ведомость дефектов с подробным описанием и рекомендациями по устранению. Мы также можем выполнить ремонтные работы силами нашей организации или проконтролировать работу вашего подрядчика с последующими повторными испытаниями.'
    }
];

export default function FAQ() {
    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Header */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-4">
                            Помощь
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Частые вопросы
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Ответы на популярные вопросы о наших услугах и работе электролаборатории
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AccordionItem value={`item-${index}`} className="bg-white rounded-xl border border-slate-100 px-6 data-[state=open]:shadow-md transition-shadow">
                                        <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-orange-500 py-5">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 pb-5 leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-10 bg-slate-50 rounded-2xl p-8 text-center"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Не нашли ответ на свой вопрос?</h3>
                            <p className="text-slate-600 mb-6">Свяжитесь с нами — мы ответим в течение 15 минут</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="tel:89302460077">
                                    <Button className="bg-orange-500 hover:bg-orange-600">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Позвонить
                                    </Button>
                                </a>
                                <a href="https://wa.me/79302460077" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        WhatsApp
                                    </Button>
                                </a>
                                <Link to={createPageUrl('Contacts')}>
                                    <Button variant="outline">
                                        Оставить заявку
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <FloatingChat />
        </div>
    );
}