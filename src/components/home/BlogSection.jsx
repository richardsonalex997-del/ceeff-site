import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const articles = [
    {
        id: 1,
        title: 'Новые требования к испытаниям электрооборудования в 2024 году',
        excerpt: 'Обзор изменений в нормативной базе и их влияние на периодичность и объём испытаний силового оборудования.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop',
        category: 'Нормативы',
        date: '15 января 2024',
        readTime: '5 мин',
        featured: true
    },
    {
        id: 2,
        title: 'Как выбрать подрядчика для обслуживания трансформаторной подстанции',
        excerpt: 'Критерии выбора надёжной компании: лицензии, опыт, оборудование, гарантии и отзывы клиентов.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop',
        category: 'Советы',
        date: '10 января 2024',
        readTime: '7 мин',
        featured: false
    },
    {
        id: 3,
        title: 'Модернизация систем релейной защиты: когда это необходимо',
        excerpt: 'Признаки устаревания РЗА, преимущества микропроцессорной защиты и этапы модернизации.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop',
        category: 'Технологии',
        date: '5 января 2024',
        readTime: '6 мин',
        featured: false
    },
    {
        id: 4,
        title: 'Молниезащита промышленных объектов: комплексный подход',
        excerpt: 'Современные методы защиты от прямых ударов молнии и вторичных воздействий на электрооборудование.',
        image: 'https://images.unsplash.com/photo-1509390836518-e0c85c2e3188?w=800&auto=format&fit=crop',
        category: 'Обзоры',
        date: '28 декабря 2023',
        readTime: '8 мин',
        featured: false
    }
];

const categoryColors = {
    'Нормативы': 'bg-blue-100 text-blue-700',
    'Советы': 'bg-green-100 text-green-700',
    'Технологии': 'bg-purple-100 text-purple-700',
    'Обзоры': 'bg-orange-100 text-orange-700'
};

export default function BlogSection() {
    const featuredArticle = articles.find(a => a.featured);
    const otherArticles = articles.filter(a => !a.featured);

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-12"
                >
                    <div>
                        <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Блог</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
                            Новости и статьи
                        </h2>
                        <p className="text-slate-600 text-lg max-w-2xl">
                            Полезные материалы об электроэнергетике, обзоры оборудования и изменения в законодательстве
                        </p>
                    </div>
                    <Button variant="outline" className="mt-4 md:mt-0">
                        Все статьи
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Article */}
                    {featuredArticle && (
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="group cursor-pointer"
                        >
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full">
                                <div className="relative h-72 overflow-hidden">
                                    <img 
                                        src={featuredArticle.image} 
                                        alt={featuredArticle.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                                        Рекомендуем
                                    </Badge>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <Badge className={categoryColors[featuredArticle.category]}>
                                            {featuredArticle.category}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-500 transition-colors">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="text-slate-600 mb-4 leading-relaxed">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {featuredArticle.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {featuredArticle.readTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Other Articles */}
                    <div className="space-y-6">
                        {otherArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex">
                                    <div className="w-1/3 min-w-[140px] relative overflow-hidden">
                                        <img 
                                            src={article.image} 
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 p-4">
                                        <Badge className={`${categoryColors[article.category]} text-xs mb-2`}>
                                            {article.category}
                                        </Badge>
                                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                                            {article.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {article.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {article.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}