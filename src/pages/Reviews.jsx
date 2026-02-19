import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import FloatingChat from '@/components/home/FloatingChat';

const reviews = [
    {
        id: 1,
        text: 'Обращались для поиска обрыва кабеля на производстве. Ребята приехали через час, нашли место с точностью до 20 см. Очень выручили, простой был минимальным.',
        author: 'Валерий К.',
        position: 'Главный инженер завода',
        rating: 5,
        initials: 'ИП'
    },
    {
        id: 2,
        text: 'Сделали технический отчет для пожарной инспекции за один день. Все четко, грамотно, сшито в папку. Инспектор принял без вопросов.',
        author: 'Анна В.',
        position: 'Управляющая рестораном',
        rating: 5,
        initials: 'AB'
    },
    {
        id: 3,
        text: 'Монтировали нам трансформаторную подстанцию для коттеджного поселка. Сделали проект, согласовали, построили. Рекомендую как надежных партнеров.',
        author: 'ООО "СтройГрад"',
        position: 'Застройщик',
        rating: 5,
        initials: 'СК'
    },
    {
        id: 4,
        text: 'Профессиональная наладка РЗА на нашем заводе. Все уставки рассчитали, проверили работоспособность, обучили персонал. Теперь спим спокойно.',
        author: 'Михаил П.',
        position: 'Энергетик промпредприятия',
        rating: 5,
        initials: 'МП'
    },
    {
        id: 5,
        text: 'Оперативно устранили аварию на кабельной линии в выходной день. Приехали ночью, за 6 часов нашли и устранили повреждение. Спасибо!',
        author: 'Дмитрий С.',
        position: 'Главный энергетик ТЦ',
        rating: 5,
        initials: 'ДС'
    },
    {
        id: 6,
        text: 'Делали периодические испытания всего электрооборудования нашего бизнес-центра. Работали быстро, аккуратно, не мешали арендаторам. Документы в полном порядке.',
        author: 'Елена М.',
        position: 'Технический директор БЦ',
        rating: 5,
        initials: 'ЕМ'
    }
];

export default function Reviews() {
    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            {/* Header */}
            <section className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Что говорят наши клиенты
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Реальные отзывы от компаний, с которыми мы работаем
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="flex text-orange-500 mb-4 gap-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="fill-current w-4 h-4" />
                                    ))}
                                </div>
                                <p className="text-slate-600 italic mb-6 leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm">
                                        {review.initials}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{review.author}</div>
                                        <div className="text-xs text-slate-500">{review.position}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <FloatingChat />
        </div>
    );
}