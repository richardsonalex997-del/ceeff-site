import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
    {
        title: 'Нижегородское метро',
        category: 'Электролаборатория',
        description: 'Комплексные испытания электрооборудования метрополитена, проверка РЗА.',
        images: [
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/6090476b0_.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/5a942d7b3_IMG_20251216_105858.jpg'
        ]
    },
    {
        title: 'ЦОД Ростелеком',
        category: 'Монтаж и наладка',
        description: 'Монтаж систем электроснабжения, РЗА и АВР для центра обработки данных.',
        images: [
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/6517a73d2_IMG_20251216_122240.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/d49d6c8a1_IMG_20251216_122226.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/6f98366ae_IMG_20251113_141930.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/9417566bc_IMG_20251113_135237.jpg'
        ]
    },
    {
        title: 'Школа Кванториум',
        category: 'Электромонтаж',
        description: 'Проектирование и монтаж систем электроснабжения образовательного комплекса.',
        images: [
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/b001938ea_IMG_20250924_105112.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/98b3da661_IMG_20250924_105329.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/63107393f_IMG_20250924_105527.jpg'
        ]
    },
    {
        title: 'Электролаборатория',
        category: 'Оборудование',
        description: 'Оснащение собственной аккредитованной электролаборатории современным оборудованием.',
        images: [
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/c1e18e39f_IMG_20250411_125626.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/6a12799f9_IMG_20250411_132202.jpg'
        ]
    },
    {
        title: 'Автозаводская ТЭЦ',
        category: 'Реконструкция',
        description: 'Модернизация РУ-110кВ, замена высоковольтного оборудования, испытания РЗА.',
        images: [
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/db56244d8_IMG_20241026_104820.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/63e9ce3d6_IMG_20241026_102627.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/b3990eb84_IMG_20241026_102425.jpg'
        ]
    },
    {
        title: 'Молниезащита КБО',
        category: 'Молниезащита',
        description: 'Монтаж системы молниезащиты и заземления, испытания молниезащиты.',
        images: [
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/8c7133c79_IMG_20251012_091656.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/d34c29919_IMG_20251012_091640.jpg',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69676445edfc54152453dadc/2ae236447_IMG_20251009_155738.jpg'
        ]
    }
];

function ProjectCard({ project, index }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentImageIndex}
                    src={project.images[currentImageIndex]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={project.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                />
            </AnimatePresence>

            {project.images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-900" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-900" />
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {project.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-6 flex flex-col justify-end">
                <span className="text-orange-500 font-bold text-xs uppercase mb-2">
                    {project.category}
                </span>
                <h3 className="text-white font-bold text-xl mb-1">{project.title}</h3>
                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {project.description}
                </p>
            </div>
        </motion.div>
    );
}

export default function Projects() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-12">Наши проекты</h1>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}