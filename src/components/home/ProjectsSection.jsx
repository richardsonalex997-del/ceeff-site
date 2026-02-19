import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const projects = [
    {
        title: 'ПС 110/10 кВ "Промышленная"',
        location: 'Московская область',
        year: '2023',
        type: 'Строительство под ключ',
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop',
        description: 'Полный цикл работ: проектирование, строительство, монтаж оборудования, пуско-наладка'
    },
    {
        title: 'КЛ 10 кВ для ЖК "Новый город"',
        location: 'Владимирская область',
        year: '2023',
        type: 'Кабельная линия',
        image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop',
        description: 'Прокладка 15 км кабельной линии 10 кВ, монтаж 8 трансформаторных подстанций'
    },
    {
        title: 'Модернизация РУ-10 кВ завода',
        location: 'Нижегородская область',
        year: '2022',
        type: 'Реконструкция',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop',
        description: 'Замена устаревшего оборудования, установка современных вакуумных выключателей'
    },
    {
        title: 'ВЛ 35 кВ для агрокомплекса',
        location: 'Рязанская область',
        year: '2022',
        type: 'Воздушная линия',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
        description: 'Строительство ВЛ 35 кВ протяжённостью 12 км с установкой 45 опор'
    }
];

export default function ProjectsSection() {
    return (
        <section id="projects" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Портфолио</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
                        Реализованные проекты
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Примеры наших работ — от небольших объектов до масштабных энергетических комплексов
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={project.image} 
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
                                    
                                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                                        {project.type}
                                    </Badge>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                        <div className="flex items-center gap-4 text-slate-300 text-sm">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {project.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {project.year}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <p className="text-slate-600">{project.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}