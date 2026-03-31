import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Shield, Zap, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { createPageUrl } from '@/utils';
import CalculatorModal from './Calculator';

const defaultHeroData = {
  hero_badge: 'ЦЭФ • Наладка РЗиА',
  hero_title: 'Испытания, диагностика и наладка',
  hero_highlight: 'электрооборудования до 110 кВ',
  hero_subtitle:
    'Выполняем полный комплекс пусконаладочных работ под ключ на подстанциях. Выдаем технические отчеты для Ростехнадзора за 24 часа.',
  hero_button: 'Рассчитать стоимость',
  hero_cards: [
    {
      icon: 'shield',
      title: 'Гарантия легитимности',
      description:
        'Лаборатория зарегистрирована в Ростехнадзоре. Сотрудники аттестованы, а все приборы проходят ежегодную поверку.',
      color: 'blue',
    },
    {
      icon: 'zap',
      title: 'Собственный парк',
      description:
        'Используем свои комплексы Retom-21, АИД-70, Fluke и Testo без аренды оборудования.',
      color: 'orange',
    },
    {
      icon: 'clock',
      title: 'Аварийный выезд',
      description: 'Бригада готова к выезду 24/7 и быстро локализует повреждения кабельных линий.',
      color: 'green',
    },
  ],
};

const cardIcons = {
  shield: Shield,
  zap: Zap,
  clock: Clock3,
};

const cardColorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
  green: 'bg-green-50 text-green-600',
};

export default function HeroSection({ data = defaultHeroData }) {
  const [animationsReady, setAnimationsReady] = React.useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const heroData = { ...defaultHeroData, ...data };
  const heroCards = Array.isArray(heroData.hero_cards)
    ? heroData.hero_cards
    : defaultHeroData.hero_cards;

  React.useEffect(() => {
    setAnimationsReady(true);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-900 pb-32 pt-20 text-white sm:pb-40 sm:pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-transparent"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl">
            <motion.div
              initial={animationsReady ? { opacity: 0, y: 20 } : false}
              animate={animationsReady ? { opacity: 1, y: 0 } : false}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-orange-500/30 bg-orange-600/20 px-4 py-1.5 backdrop-blur-sm sm:mb-8"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></span>
              <span className="text-sm font-bold uppercase tracking-wider text-orange-400">
                {heroData.hero_badge}
              </span>
            </motion.div>

            <h1
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
              className="mb-6 text-3xl font-extrabold leading-tight sm:text-4xl md:mb-8 md:text-6xl lg:text-7xl"
            >
              {heroData.hero_title} <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
                {heroData.hero_highlight}
              </span>
            </h1>

            <p
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
              className="mb-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg md:mb-10 md:text-xl"
            >
              {heroData.hero_subtitle}
            </p>

            <motion.div
              initial={animationsReady ? { opacity: 0, y: 20 } : false}
              animate={animationsReady ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-4 sm:flex-row sm:gap-5"
            >
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-6 py-4 text-base font-bold text-white shadow-xl shadow-orange-600/20 transition-all hover:bg-orange-700 sm:w-auto sm:px-8 sm:text-lg"
              >
                <Calculator className="h-5 w-5" />
                {heroData.hero_button}
              </button>
              <Link to={createPageUrl('Projects')} className="w-full sm:w-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:px-8 sm:text-lg">
                  Наши проекты
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container relative z-20 mx-auto -mt-16 px-4 sm:-mt-24">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {heroCards.map((card, index) => {
            const CardIcon = cardIcons[card.icon] || Shield;
            const colorClass = cardColorClasses[card.color] || cardColorClasses.blue;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-transform duration-300 hover:-translate-y-2 sm:p-8"
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${colorClass}`}
                >
                  <CardIcon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="leading-relaxed text-slate-600">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </>
  );
}
