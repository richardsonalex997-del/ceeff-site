import React from 'react';
import { motion } from 'framer-motion';

const priceData = [
    { name: 'Выезд электролаборатории', unit: 'услуга', price: 'от 5 000 ₽' },
    { name: 'Замер сопротивления изоляции', unit: 'линия', price: '250 ₽' },
    { name: 'Поиск повреждения кабеля', unit: 'место', price: '120 000 ₽' },
    { name: 'Испытание трансформатора до 10кВ', unit: 'шт.', price: '25 000 ₽' },
    { name: 'Тепловизионный контроль', unit: 'точка', price: '300 ₽' },
    { name: 'Ретрофит ячейки 6-10кВ', unit: 'ячейка', price: '350 000 ₽' },
    { name: 'Монтаж системы АВР', unit: 'шкаф', price: '35 000 ₽' },
    { name: 'ТО электроустановок до 10кВ', unit: 'ТП', price: '40 000 ₽' },
];

export default function PriceTable() {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
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
                        <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50"
                        >
                            <td className="p-4">{item.name}</td>
                            <td className="p-4 text-slate-600">{item.unit}</td>
                            <td className="p-4 font-bold text-right text-orange-600">{item.price}</td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            <div className="bg-blue-50 p-4 flex gap-3 text-blue-800 text-sm">
                <span className="text-xl">ℹ️</span>
                <p>Минимальная сумма заказа — 10 000 рублей. Выезд инженера для осмотра в черте города — бесплатно.</p>
            </div>
        </div>
    );
}