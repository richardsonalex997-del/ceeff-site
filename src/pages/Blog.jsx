import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const articles = [
    {
        id: 1,
        type: 'article',
        title: 'Проверка металлосвязи: почему заземление есть, а защита не работает?',
        excerpt: 'Цель измерения металлосвязи — убедиться в целостности и надежности соединения всех заземляющих проводников.',
        category: 'Статьи',
        date: '21 января 2026',
        readTime: '7 мин',
        image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/af938557d_Gemini_Generated_Image_vvv67evvv67evvv6.png',
        content: `
Цель измерения металлосвязи — убедиться в целостности и надежности соединения всех заземляющих проводников. Простыми словами: мы проверяем, действительно ли металлический корпус вашего станка, щитка или конвейера надежно соединен с заземляющим устройством.

Если металлосвязь нарушена («плохой контакт»), то при пробое изоляции защита не сработает, и корпус оборудования окажется под опасным напряжением.

## Важно знать каждому собственнику и главному инженеру

Согласно ПТЭЭП (Правила технической эксплуатации электроустановок потребителей), периодичность проверки металлосвязи — не реже 1 раза в 3 года, а также обязательно при вводе объекта в эксплуатацию и после любых ремонтов системы заземления.

### Игнорирование этих замеров ведет к:

- Риску поражения персонала электрическим током (вплоть до летального исхода)
- Отказу чувствительной электроники из-за «блуждающих» токов
- Штрафам от надзорных органов

## Кейс из нашей практики: Пищевое производство

К нам обратился главный механик пищевого комбината.

**Проблема:** Рабочий персонал жаловался, что от корпусов оборудования периодически «бьет током».

**Диагностика:** Наши специалисты провели визуальный осмотр и инструментальные замеры. Было выявлено отсутствие надежного контакта в цепи заземления: частично из-за коррозии сварных швов, частично — из-за ослабления болтовых соединений (вибрация станков).

**Решение:** Мы выявили все участки с высоким переходным сопротивлением. Была спроектирована и смонтирована система дополнительного уравнивания потенциалов.

**Результат:** Жалобы персонала прекратились, электробезопасность на производстве восстановлена, риск травматизма сведен к нулю.

## Техническое оснащение

Обычным мультиметром качественный замер не сделать. В нашем приборном парке используются современные поверенные микроомметры, способные уловить малейшее переходное сопротивление (до тысячных долей Ома).

## Стоимость и состав работ

**Цена проверки металлосвязи — от 20 рублей за 1 точку измерения.**

### Что включено в услугу:

1. **Визуальный осмотр:** Проверка сварных и болтовых соединений на наличие ржавчины, разрывов и ослаблений.
2. **Инструментальный контроль:** Замер переходного сопротивления контактов микроомметром.
3. **Документация:** Внесение результатов в протокол испытаний установленного образца и анализ динамики (сравнение с предыдущими показателями).

## Вывод

Визуально заземление может выглядеть целым, но приборы не обманешь. Закажите проверку металлосвязи, чтобы быть уверенными в безопасности ваших сотрудников.
        `
    }
];

const news = [
    {
        id: 1,
        type: 'news',
        title: 'Успешно завершили проект по модернизации ЦОД Ростелеком',
        excerpt: 'Завершили монтаж систем электроснабжения, РЗА и АВР для центра обработки данных.',
        category: 'Новости',
        date: '16 декабря 2025',
        image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/6517a73d2_IMG_20251216_122240.jpg'
    },
    {
        id: 2,
        type: 'news',
        title: 'Получили новую аккредитацию лаборатории',
        excerpt: 'Наша электролаборатория успешно прошла переаккредитацию в Ростехнадзоре до 2027 года.',
        category: 'Новости',
        date: '15 марта 2024',
        image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/c1e18e39f_IMG_20250411_125626.jpg'
    }
];



export default function Blog() {
    const [activeTab, setActiveTab] = useState('articles');
    const [selectedArticle, setSelectedArticle] = useState(null);

    const renderContent = () => {
        if (selectedArticle) {
            return (
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setSelectedArticle(null)}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-medium"
                    >
                        ← Назад к статьям
                    </button>
                    
                    <article>
                        <div className="mb-6">
                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded uppercase">
                                {selectedArticle.category}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            {selectedArticle.title}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-slate-500 mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{selectedArticle.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{selectedArticle.readTime}</span>
                            </div>
                        </div>

                        <img 
                            src={selectedArticle.image} 
                            alt={selectedArticle.title}
                            className="w-full h-[400px] object-cover rounded-2xl mb-8"
                        />

                        <div className="prose prose-lg max-w-none">
                            {selectedArticle.content.split('\n').map((paragraph, idx) => {
                                if (paragraph.startsWith('## ')) {
                                    return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(3)}</h2>;
                                } else if (paragraph.startsWith('### ')) {
                                    return <h3 key={idx} className="text-xl font-bold mt-6 mb-3">{paragraph.slice(4)}</h3>;
                                } else if (paragraph.startsWith('- ')) {
                                    return <li key={idx} className="ml-6 mb-2">{paragraph.slice(2)}</li>;
                                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                    return <p key={idx} className="font-bold mt-4">{paragraph.slice(2, -2)}</p>;
                                } else if (paragraph.trim().match(/^\d+\./)) {
                                    return <li key={idx} className="ml-6 mb-2">{paragraph}</li>;
                                } else if (paragraph.trim()) {
                                    return <p key={idx} className="mb-4 text-slate-700 leading-relaxed">{paragraph}</p>;
                                }
                                return null;
                            })}
                        </div>

                        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">Нужна консультация?</h3>
                            <p className="text-slate-600 mb-6">
                                Закажите проверку металлосвязи и будьте уверены в безопасности вашего оборудования
                            </p>
                            <Link to={createPageUrl('Contacts')}>
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    Заказать услугу
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </article>
                </div>
            );
        }

        if (activeTab === 'articles') {
            return (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                        >
                            <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                                <img 
                                    src={article.image} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt={article.title}
                                />
                                <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded uppercase">
                                    {article.category}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {article.date}
                                </span>
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {article.readTime}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-slate-600 line-clamp-2">{article.excerpt}</p>
                        </motion.div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'news') {
            return (
                <div className="grid md:grid-cols-2 gap-8">
                    {news.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                                <img 
                                    src={item.image} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt={item.title}
                                />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase">
                                    {item.category}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                                <Calendar className="w-4 h-4" />
                                <span>{item.date}</span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-600">{item.excerpt}</p>
                        </motion.div>
                    ))}
                </div>
            );
        }


    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16">
                {!selectedArticle && (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">Блог энергетиков</h1>
                            <p className="text-slate-500 max-w-2xl mx-auto">
                                Полезные материалы об электроэнергетике, кейсы из практики и обзор нормативной базы
                            </p>
                        </div>
                        
                        <div className="flex justify-center gap-2 mb-12">
                            <button 
                                onClick={() => setActiveTab('articles')}
                                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                                    activeTab === 'articles' 
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Статьи
                            </button>
                            <button 
                                onClick={() => setActiveTab('news')}
                                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                                    activeTab === 'news' 
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Новости
                            </button>
                        </div>
                    </>
                )}

                {renderContent()}
            </div>
        </div>
    );
}