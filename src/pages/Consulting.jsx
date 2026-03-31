import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, FileText, Shield, TrendingUp } from 'lucide-react';
import * as helmetAsync from 'react-helmet-async';
import { Link } from 'react-router-dom';

import consultingContentFallback from '@/data/consultingContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { createPageUrl } from '@/utils';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

const iconMap = {
  'clipboard-check': ClipboardCheck,
  'file-text': FileText,
  shield: Shield,
  'trending-up': TrendingUp,
};

export default function Consulting() {
  const consultingContent = useRuntimeContent('/data/consulting.json', consultingContentFallback);
  const services = Array.isArray(consultingContent?.services) ? consultingContent.services : consultingContentFallback.services;
  const advantages = Array.isArray(consultingContent?.advantages)
    ? consultingContent.advantages
    : consultingContentFallback.advantages;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{consultingContent.seoTitle || consultingContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={consultingContent.seoDescription || consultingContentFallback.seoDescription}
        />
      </Helmet>

      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-600/20 px-4 py-1.5">
              <FileText className="h-4 w-4 text-green-400" />
              <span className="text-sm font-bold text-green-400">
                {consultingContent.badgeLabel || consultingContentFallback.badgeLabel}
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
              {consultingContent.pageTitle || consultingContentFallback.pageTitle}
            </h1>
            <p className="mb-8 text-lg text-slate-300 sm:text-xl">
              {consultingContent.pageSubtitle || consultingContentFallback.pageSubtitle}
            </p>
            <Link to={createPageUrl('Contacts')}>
              <button className="rounded-xl bg-orange-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-orange-700">
                {consultingContent.ctaButtonLabel || consultingContentFallback.ctaButtonLabel}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-4">
            {advantages.map((item, index) => (
              <div key={`${item.title}-${index}`} className="text-center">
                <div className="mb-1 font-bold text-slate-900">{item.title}</div>
                <div className="text-sm text-slate-600">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-4 text-center text-4xl font-bold">Услуги консалтинга</h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600">
          Решаем технические и организационные задачи для вашего объекта: от проверки проектов
          до подготовки к сдаче и снижению энергозатрат.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || FileText;

            return (
              <motion.div
                key={`${service.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border-2 border-slate-100 bg-white p-6 transition-all hover:border-green-300 hover:shadow-xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-50">
                  <Icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{service.title}</h3>
                <p className="mb-4 text-sm text-slate-600">{service.description}</p>

                <ul className="custom-list mb-4 text-sm text-slate-600">
                  {(service.details || []).map((detail, detailIndex) => (
                    <li key={`${service.title}-detail-${detailIndex}`}>{detail}</li>
                  ))}
                </ul>

                <div className="border-t border-slate-100 pt-4">
                  <span className="font-bold text-orange-600">{service.price}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {consultingContent.ctaTitle || consultingContentFallback.ctaTitle}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-600">
            {consultingContent.ctaText || consultingContentFallback.ctaText}
          </p>
          <Link to={createPageUrl('Contacts')}>
            <button className="rounded-xl bg-orange-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-orange-700">
              {consultingContent.ctaBottomButtonLabel || consultingContentFallback.ctaBottomButtonLabel}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
