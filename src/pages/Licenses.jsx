import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, ZoomIn, Download } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FloatingChat from '@/components/home/FloatingChat';

const licenses = [
    {
        id: 1,
        title: 'Свидетельство о регистрации электролаборатории',
        issuer: 'Ростехнадзор',
        number: '№ ЭТЛ-0000-2023',
        validUntil: '2028',
        image: 'https://images.unsplash.com/photo-1568057373547-ac4f9e8a9b73?w=800&auto=format&fit=crop',
        category: 'lab'
    },
    {
        id: 2,
        title: 'Лицензия на строительство объектов I и II уровня',
        issuer: 'Минстрой России',
        number: '№ ГС-2-000-00000',
        validUntil: '2027',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop',
        category: 'construction'
    },
    {
        id: 3,
        title: 'Допуск СРО на проектирование',
        issuer: 'СРО "Энергопроект"',
        number: '№ СРО-П-000-0000',
        validUntil: '2026',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop',
        category: 'design'
    },
    {
        id: 4,
        title: 'Допуск СРО на строительство',
        issuer: 'СРО "ЭнергоСтрой"',
        number: '№ СРО-С-000-0000',
        validUntil: '2026',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
        category: 'construction'
    },
    {
        id: 5,
        title: 'Сертификат ISO 9001:2015',
        issuer: 'TÜV SÜD',
        number: '№ ISO-9001-0000',
        validUntil: '2025',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
        category: 'quality'
    },
    {
        id: 6,
        title: 'Аттестат аккредитации лаборатории',
        issuer: 'Росаккредитация',
        number: '№ RA.RU.000000',
        validUntil: '2027',
        image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&auto=format&fit=crop',
        category: 'lab'
    }
];

const categories = [
    { id: 'all', label: 'Все документы' },
    { id: 'lab', label: 'Электролаборатория' },
    { id: 'construction', label: 'Строительство' },
    { id: 'design', label: 'Проектирование' },
    { id: 'quality', label: 'Качество' }
];

export default function Licenses() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedLicense, setSelectedLicense] = useState(null);

    const filteredLicenses = activeCategory === 'all' 
        ? licenses 
        : licenses.filter(l => l.category === activeCategory);

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
                            Документы
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Лицензии и сертификаты
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Все работы выполняются на основании действующих лицензий и допусков
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? "default" : "outline"}
                                onClick={() => setActiveCategory(cat.id)}
                                className={activeCategory === cat.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Licenses Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredLicenses.map((license, index) => (
                                <motion.div
                                    key={license.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedLicense(license)}
                                >
                                    <div className="bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-orange-200">
                                        <div className="relative h-48 overflow-hidden bg-slate-200">
                                            <img 
                                                src={license.image} 
                                                alt={license.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                            <div className="absolute top-4 right-4">
                                                <Badge className="bg-green-500 text-white">
                                                    Действует до {license.validUntil}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                                                    <Shield className="w-4 h-4" />
                                                    {license.issuer}
                                                </div>
                                                <p className="text-white font-bold">{license.title}</p>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                                    <ZoomIn className="w-6 h-6 text-slate-900" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-slate-500 text-sm">{license.number}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedLicense && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                        onClick={() => setSelectedLicense(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <img 
                                    src={selectedLicense.image} 
                                    alt={selectedLicense.title}
                                    className="w-full h-80 object-cover"
                                />
                                <button 
                                    onClick={() => setSelectedLicense(null)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <Badge className="bg-green-100 text-green-700 mb-3">
                                    Действует до {selectedLicense.validUntil} года
                                </Badge>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedLicense.title}</h3>
                                <p className="text-slate-600 mb-4">
                                    Выдан: {selectedLicense.issuer}<br />
                                    Номер: {selectedLicense.number}
                                </p>
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    <Download className="w-4 h-4 mr-2" />
                                    Скачать документ
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <FloatingChat />
        </div>
    );
}