import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const priceData = [
    { name: 'Выезд электролаборатории', unit: 'услуга', price: 'от 5 000' },
    { name: 'Замер сопротивления изоляции', unit: 'линия', price: 'от 150' },
    { name: 'Испытание кабеля повышенным напряжением', unit: 'линия', price: 'от 800' },
    { name: 'Поиск повреждения кабеля', unit: 'место', price: 'от 15 000' },
    { name: 'Испытание трансформатора', unit: 'шт.', price: 'от 12 000' },
    { name: 'Испытание автоматических выключателей', unit: 'шт.', price: 'от 350' },
    { name: 'Проверка УЗО и дифавтоматов', unit: 'шт.', price: 'от 250' },
    { name: 'Измерение сопротивления заземления', unit: 'контур', price: 'от 500' },
    { name: 'Измерение сопротивления петли фаза-нуль', unit: 'точка', price: 'от 150' },
    { name: 'Тепловизионный контроль', unit: 'щит', price: 'от 1 500' },
    { name: 'Наладка релейной защиты', unit: 'комплект', price: 'от 8 000' },
    { name: 'Испытание силового кабеля (до 1кВ)', unit: 'линия', price: 'от 800' },
    { name: 'Испытание силового кабеля (6-10кВ)', unit: 'линия', price: 'от 3 500' },
    { name: 'Проверка автоматики и блокировок', unit: 'устройство', price: 'от 2 000' },
    { name: 'Измерение сопротивления контактов', unit: 'соединение', price: 'от 200' },
    { name: 'Прогрузка автоматических выключателей', unit: 'шт.', price: 'от 1 500' },
    { name: 'Техническое обслуживание (до 1кВ)', unit: 'ввод', price: 'от 5 000' },
    { name: 'Техническое обслуживание (6-10кВ)', unit: 'ввод', price: 'от 15 000' },
    { name: 'Капитальный ремонт электрооборудования', unit: 'объект', price: 'договорная' },
    { name: 'Аварийные работы (выезд)', unit: 'вызов', price: 'от 10 000' },
];

export default function Price() {
    const [service, setService] = useState('lab');
    const [volts, setVolts] = useState(1);
    const [urgent, setUrgent] = useState(1);
    const [volume, setVolume] = useState(5);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        calculate();
    }, [service, volts, urgent, volume]);

    const calculate = () => {
        let basePrice = 0;

        if (service === 'lab') basePrice = 1000;
        if (service === 'search') basePrice = 120000; // Аварийные работы
        if (service === 'project') basePrice = 5000;
        if (service === 'mount') basePrice = 3000;

        let calculatedTotal = 0;

        if (service === 'search') {
            calculatedTotal = basePrice * urgent;
        } else {
            calculatedTotal = basePrice * volume * volts * urgent;
        }

        setTotal(Math.round(calculatedTotal));
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-12">Цены и Калькулятор</h1>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Calculator */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                <Calculator className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold">Расчет стоимости</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Вид услуги</label>
                                <select 
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                    className="w-full h-12 px-4 border border-slate-200 rounded-lg bg-slate-50 focus:border-orange-500 outline-none transition-all"
                                >
                                    <option value="lab">Электролаборатория (Испытания)</option>
                                    <option value="search">Поиск повреждения кабеля</option>
                                    <option value="project">Проектирование</option>
                                    <option value="mount">Электромонтаж</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Напряжение</label>
                                    <select 
                                        value={volts}
                                        onChange={(e) => setVolts(parseFloat(e.target.value))}
                                        className="w-full h-12 px-4 border border-slate-200 rounded-lg bg-slate-50 focus:border-orange-500 outline-none transition-all"
                                    >
                                        <option value="1">0.4 кВ</option>
                                        <option value="1.5">6-10 кВ</option>
                                        <option value="2">35-110 кВ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Срочность</label>
                                    <select 
                                        value={urgent}
                                        onChange={(e) => setUrgent(parseFloat(e.target.value))}
                                        className="w-full h-12 px-4 border border-slate-200 rounded-lg bg-slate-50 focus:border-orange-500 outline-none transition-all"
                                    >
                                        <option value="1">Планово</option>
                                        <option value="1.5">Срочно (24ч)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Объем работ (усл. ед.)</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="50" 
                                        value={volume}
                                        onChange={(e) => setVolume(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                                    />
                                    <span className="font-bold text-lg w-8 text-center">{volume}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Кол-во точек, линий или площадь объекта (x100 м²)</p>
                            </div>

                            <div className="bg-slate-900 rounded-xl p-6 text-white text-center mt-6">
                                <div className="text-sm text-slate-400 mb-1">Предварительная стоимость:</div>
                                <div className="text-4xl font-bold text-orange-500">
                                    {new Intl.NumberFormat('ru-RU').format(total)} ₽
                                </div>
                            </div>

                            <Link to={createPageUrl('Contacts')}>
                                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-14 rounded-xl transition-all shadow-lg shadow-orange-600/20">
                                    Заказать по этой цене
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Price Table */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Базовый прайс-лист</h2>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                    <tr>
                                        <th className="p-4 border-b">Наименование</th>
                                        <th className="p-4 border-b">Ед. изм.</th>
                                        <th className="p-4 border-b text-right">Цена</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {priceData.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50">
                                            <td className="p-4">{item.name}</td>
                                            <td className="p-4">{item.unit}</td>
                                            <td className="p-4 font-bold text-right">{item.price} ₽</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
                            <Info className="shrink-0 w-5 h-5" />
                            <p>Минимальная сумма заказа — 10 000 рублей. Выезд инженера для осмотра в черте города — бесплатно.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}