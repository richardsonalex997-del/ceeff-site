import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Settings, ArrowRight } from 'lucide-react';
import * as helmetAsync from 'react-helmet-async';

import HeroSection from '@/components/home/HeroSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import useRuntimeContent from '@/hooks/use-runtime-content';
import homeContentFallback from '@/data/homeContent';
import { createPageUrl } from '@/utils';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

const directionIcons = {
  zap: Zap,
  settings: Settings,
};

export default function Home() {
  const homeContent = useRuntimeContent('/data/home.json', homeContentFallback);
  const directions = Array.isArray(homeContent?.directions)
    ? homeContent.directions
    : homeContentFallback.directions;

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{homeContent.seoTitle || homeContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={homeContent.seoDescription || homeContentFallback.seoDescription}
        />
      </Helmet>

      <HeroSection data={homeContent} />

      <section className="defer-section container mx-auto px-4 py-16 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {homeContent.directions_title || homeContentFallback.directions_title}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-slate-600 sm:text-xl">
            {homeContent.directions_subtitle || homeContentFallback.directions_subtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {directions.map((direction, index) => {
            const Icon = directionIcons[direction.icon] || Zap;
            const colorClasses = {
              orange: 'border-orange-200 bg-orange-50 text-orange-600',
              blue: 'border-blue-200 bg-blue-50 text-blue-600',
              green: 'border-green-200 bg-green-50 text-green-600',
            };
            const hoverClasses = {
              orange: 'hover:border-orange-400',
              blue: 'hover:border-blue-400',
              green: 'hover:border-green-400',
            };

            return (
              <motion.div
                key={direction.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group flex h-full flex-col rounded-2xl border-2 bg-white p-6 transition-all hover:shadow-xl sm:p-8 ${
                  hoverClasses[direction.color] || hoverClasses.orange
                }`}
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110 ${
                    colorClasses[direction.color] || colorClasses.orange
                  }`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
                  {direction.title}
                </h3>
                <p className="mb-6 text-slate-600">{direction.description}</p>

                <ul className="custom-list mb-8 flex-grow text-sm text-slate-600">
                  {(direction.features || []).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <Link to={createPageUrl(direction.link || 'Services')}>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white transition-all hover:bg-orange-600">
                    Подробнее
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <ReviewsSection />
    </div>
  );
}
