import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
    {
        text: 'Обращались для поиска обрыва кабеля на производстве. Ребята приехали через час, нашли место с точностью до 20 см. Очень выручили, простой был минимальным.',
        author: 'Валерий К.',
        position: 'Главный инженер завода',
        initials: 'ИП'
    },
    {
        text: 'Сделали технический отчет для пожарной инспекции за один день. Все четко, грамотно, сшито в папку. Инспектор принял без вопросов.',
        author: 'Анна В.',
        position: 'Управляющая рестораном',
        initials: 'AB'
    },
    {
        text: 'Монтировали нам трансформаторную подстанцию для коттеджного поселка. Сделали проект, согласовали, построили. Рекомендую как надежных партнеров.',
        author: 'ООО "СтройГрад"',
        position: 'Застройщик',
        initials: 'СК'
    }
];

export default function ReviewsSection() {
    return (
        <section className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center mb-12">Что говорят наши клиенты</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex text-orange-500 mb-4 gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="fill-current w-4 h-4" />
                            ))}
                        </div>
                        <p className="text-slate-600 italic mb-6">"{review.text}"</p>
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
        </section>
    );
}