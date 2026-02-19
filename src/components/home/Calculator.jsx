import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator as CalcIcon, X, Zap, Building2, Cable, Wrench, ChevronRight, CheckCircle, Phone, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const services = [
    {
        id: 'lab',
        icon: Zap,
        title: 'Электролаборатория',
        description: 'Испытания и измерения',
        color: 'orange',
        params: [
            { id: 'voltage', label: 'Класс напряжения', type: 'select', options: [
                { value: '0.4', label: 'до 1 кВ', multiplier: 1 },
                { value: '10', label: '6-10 кВ', multiplier: 1.5 },
                { value: '35', label: '35 кВ', multiplier: 2.2 },
                { value: '110', label: '110 кВ', multiplier: 3 }
            ]},
            { id: 'equipment', label: 'Количество единиц оборудования', type: 'slider', min: 1, max: 50, default: 5, unit: 'шт', basePrice: 8000 },
            { id: 'type', label: 'Тип работ', type: 'select', options: [
                { value: 'testing', label: 'Испытания', multiplier: 1 },
                { value: 'commissioning', label: 'Наладка РЗиА', multiplier: 1.8 },
                { value: 'retrofit', label: 'Ретрофит', multiplier: 2.5 }
            ]}
        ],
        basePrice: 45000
    },
    {
        id: 'mount',
        icon: Building2,
        title: 'Монтажные работы',
        description: 'Строительство и монтаж',
        color: 'blue',
        params: [
            { id: 'workType', label: 'Тип работ', type: 'select', options: [
                { value: 'substation', label: 'Строительство ПС', multiplier: 1 },
                { value: 'cable', label: 'Прокладка КЛ', multiplier: 0.6 },
                { value: 'overhead', label: 'Строительство ВЛ', multiplier: 0.8 },
                { value: 'internal', label: 'Внутренний электромонтаж', multiplier: 0.4 }
            ]},
            { id: 'length', label: 'Протяжённость линии (км)', type: 'slider', min: 0.1, max: 50, default: 1, unit: 'км', basePrice: 350000, step: 0.1 },
            { id: 'voltage', label: 'Класс напряжения', type: 'select', options: [
                { value: '0.4', label: '0.4 кВ', multiplier: 1 },
                { value: '10', label: '10 кВ', multiplier: 1.8 },
                { value: '35', label: '35 кВ', multiplier: 2.5 },
                { value: '110', label: '110 кВ', multiplier: 4 }
            ]}
        ],
        basePrice: 500000
    },
    {
        id: 'lightning',
        icon: Cable,
        title: 'Молниезащита',
        description: 'Заземление и защита',
        color: 'purple',
        params: [
            { id: 'area', label: 'Площадь объекта (м²)', type: 'number', min: 50, max: 5000, default: 200, unit: 'м²', basePrice: 150 },
            { id: 'buildingType', label: 'Тип здания', type: 'select', options: [
                { value: 'residential', label: 'Жилое здание', multiplier: 1 },
                { value: 'commercial', label: 'Коммерческое', multiplier: 1.3 },
                { value: 'industrial', label: 'Промышленное', multiplier: 1.6 },
                { value: 'special', label: 'Взрывоопасное', multiplier: 2.2 }
            ]},
            { id: 'system', label: 'Система защиты', type: 'select', options: [
                { value: 'basic', label: 'Базовая молниезащита', multiplier: 1 },
                { value: 'full', label: 'Полная система + УЗИП', multiplier: 1.8 },
                { value: 'premium', label: 'Комплексная защита', multiplier: 2.5 }
            ]}
        ],
        basePrice: 35000
    },
    {
        id: 'service',
        icon: Wrench,
        title: 'Обслуживание ТП',
        description: 'Техническое обслуживание',
        color: 'green',
        params: [
            { id: 'substations', label: 'Количество ТП', type: 'slider', min: 1, max: 20, default: 1, unit: 'шт', basePrice: 25000 },
            { id: 'period', label: 'Период обслуживания', type: 'select', options: [
                { value: 'month', label: '1 месяц', multiplier: 1 },
                { value: 'quarter', label: 'Квартал', multiplier: 2.7 },
                { value: 'year', label: 'Год', multiplier: 10 }
            ]},
            { id: 'serviceType', label: 'Тип обслуживания', type: 'select', options: [
                { value: 'basic', label: 'Базовое ТО', multiplier: 1 },
                { value: 'extended', label: 'Расширенное ТО', multiplier: 1.5 },
                { value: 'full', label: 'Полное ТО + аварийка', multiplier: 2 }
            ]}
        ],
        basePrice: 30000
    }
];

const colorClasses = {
    orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-500', border: 'border-orange-500' },
    blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-500' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-500', border: 'border-purple-500' },
    green: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-500', border: 'border-green-500' }
};

export default function Calculator({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [params, setParams] = useState({});
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (selectedService) {
            const initialParams = {};
            selectedService.params.forEach(param => {
                if (param.type === 'slider') {
                    initialParams[param.id] = param.default;
                } else if (param.type === 'select') {
                    initialParams[param.id] = param.options[0].value;
                }
            });
            setParams(initialParams);
        }
    }, [selectedService]);

    const calculatePrice = () => {
        if (!selectedService) return 0;
        
        let price = selectedService.basePrice;
        
        selectedService.params.forEach(param => {
            const value = params[param.id];
            if (param.type === 'slider' && param.basePrice) {
                price += value * param.basePrice;
            } else if (param.type === 'select') {
                const option = param.options.find(o => o.value === value);
                if (option) {
                    price *= option.multiplier;
                }
            }
        });
        
        return Math.round(price);
    };

    const handleCalculate = () => {
        const price = calculatePrice();
        setCalculatedPrice(price);
        setShowResult(true);
        setStep(3);
    };

    const resetCalculator = () => {
        setStep(1);
        setSelectedService(null);
        setParams({});
        setShowResult(false);
        setCalculatedPrice(0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                    <CalcIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Калькулятор стоимости</h2>
                                    <p className="text-slate-400 text-sm">Предварительный расчёт</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Progress */}
                        <div className="flex items-center gap-2 mt-6">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex-1 flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                        step >= s ? 'bg-orange-500' : 'bg-slate-700'
                                    }`}>
                                        {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                                    </div>
                                    {s < 3 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-orange-500' : 'bg-slate-700'}`} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Select Service */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Выберите тип услуги</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {services.map((service) => {
                                            const colors = colorClasses[service.color];
                                            const isSelected = selectedService?.id === service.id;
                                            return (
                                                <button
                                                    key={service.id}
                                                    onClick={() => setSelectedService(service)}
                                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                                        isSelected 
                                                            ? `${colors.border} ${colors.light}` 
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-3`}>
                                                        <service.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h4 className="font-bold text-slate-900">{service.title}</h4>
                                                    <p className="text-sm text-slate-500">{service.description}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Parameters */}
                            {step === 2 && selectedService && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Укажите параметры</h3>
                                    
                                    {selectedService.params.map((param) => (
                                        <div key={param.id} className="space-y-3">
                                            <Label className="text-slate-700 font-medium">{param.label}</Label>

                                            {param.type === 'slider' && (
                                                <div className="space-y-3 pt-2">
                                                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                                                        <span className="text-2xl font-bold text-orange-500">
                                                            {Math.round(params[param.id] || param.default)} {param.unit}
                                                        </span>
                                                    </div>
                                                    <Slider
                                                        value={[params[param.id] || param.default]}
                                                        onValueChange={([value]) => setParams({...params, [param.id]: value})}
                                                        min={param.min}
                                                        max={param.max}
                                                        step={param.step || 1}
                                                        className="py-2"
                                                    />
                                                    <div className="flex justify-between text-xs text-slate-500">
                                                        <span>{param.min}</span>
                                                        <span>{param.max}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {param.type === 'number' && (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={param.min}
                                                        max={param.max}
                                                        value={params[param.id] || param.default}
                                                        onChange={(e) => {
                                                            let value = Number(e.target.value);
                                                            if (value < param.min) value = param.min;
                                                            if (value > param.max) value = param.max;
                                                            setParams({...params, [param.id]: value});
                                                        }}
                                                        className="h-12 text-lg"
                                                    />
                                                    <span className="text-slate-600 font-medium whitespace-nowrap">{param.unit}</span>
                                                </div>
                                            )}

                                            {param.type === 'select' && (
                                                <Select
                                                    value={params[param.id] || param.options[0].value}
                                                    onValueChange={(value) => setParams({...params, [param.id]: value})}
                                                >
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {param.options.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Step 3: Result */}
                            {step === 3 && showResult && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-6"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Предварительная стоимость</h3>
                                    <p className="text-slate-500 mb-6">{selectedService?.title}</p>
                                    
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 mb-6">
                                        <p className="text-orange-100 text-sm mb-1">Ориентировочная стоимость:</p>
                                        <p className="text-4xl font-bold text-white">
                                            {formatPrice(calculatedPrice)} ₽
                                        </p>
                                        <p className="text-orange-200 text-sm mt-2">
                                            * Точная стоимость после осмотра объекта
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 text-left mb-6">
                                        <h4 className="font-semibold text-slate-900 mb-3">Что входит в стоимость:</h4>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Выезд специалиста на объект
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Выполнение работ под ключ
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Полный комплект документации
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Гарантия на все работы
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button 
                                            variant="outline" 
                                            onClick={resetCalculator}
                                            className="flex-1"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Новый расчёт
                                        </Button>
                                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Заказать звонок
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    {step < 3 && (
                        <div className="p-6 border-t bg-slate-50 flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => step > 1 ? setStep(step - 1) : onClose}
                            >
                                {step > 1 ? 'Назад' : 'Отмена'}
                            </Button>
                            <Button
                                onClick={() => step === 1 ? setStep(2) : handleCalculate()}
                                disabled={step === 1 && !selectedService}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                {step === 2 ? 'Рассчитать' : 'Далее'}
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}