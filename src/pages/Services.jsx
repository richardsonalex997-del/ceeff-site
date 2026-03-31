import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cloud, Cpu, Gauge, Shield, Zap } from 'lucide-react';
import * as helmetAsync from 'react-helmet-async';

import servicesContentFallback from '@/data/servicesContent';
import siteContentFallback from '@/data/siteContent';
import useRuntimeContent from '@/hooks/use-runtime-content';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

const tabIcons = {
  activity: Activity,
  cloud: Cloud,
  cpu: Cpu,
  gauge: Gauge,
  shield: Shield,
  zap: Zap,
};

export default function Services() {
  const servicesContent = useRuntimeContent('/data/services.json', servicesContentFallback);
  const siteContent = useRuntimeContent('/data/site.json', siteContentFallback);
  const tabs = Array.isArray(servicesContent?.tabs) && servicesContent.tabs.length > 0
    ? servicesContent.tabs
    : servicesContentFallback.tabs;
  const sections = Array.isArray(servicesContent?.sections) && servicesContent.sections.length > 0
    ? servicesContent.sections
    : servicesContentFallback.sections;
  const header = siteContent?.header || siteContentFallback.header;
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'high');

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0]?.id || 'high');
    }
  }, [activeTab, tabs]);

  const currentSection = useMemo(() => {
    return sections.find((section) => section.id === activeTab) || sections[0] || null;
  }, [activeTab, sections]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Helmet>
        <title>{servicesContent.seoTitle || servicesContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={servicesContent.seoDescription || servicesContentFallback.seoDescription}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-600/20 px-4 py-1.5">
              <Zap className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400">
                {servicesContent.badgeLabel || servicesContentFallback.badgeLabel}
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
              {servicesContent.pageTitle || servicesContentFallback.pageTitle}
            </h1>
            <p className="text-lg text-slate-300 sm:text-xl">
              {servicesContent.pageSubtitle || servicesContentFallback.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-[73px] z-40 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 py-4">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab.icon] || Shield;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-bold transition-all sm:w-auto ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {currentSection && (
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{currentSection.title}</h2>
              <p className="mb-12 text-lg text-slate-600">{currentSection.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {(currentSection.services || []).map((service, index) => (
                  <motion.div
                    key={`${currentSection.id}-${service.name}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border-2 border-slate-100 bg-white p-6 transition-all hover:border-orange-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-600" />
                      <div>
                        <h3 className="mb-1 font-bold text-slate-900">{service.name}</h3>
                        <p className="text-sm text-slate-600">{service.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {servicesContent.ctaTitle || servicesContentFallback.ctaTitle}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-600">
            {servicesContent.ctaText || servicesContentFallback.ctaText}
          </p>
          <a href={header.phoneHref}>
            <button className="rounded-xl bg-orange-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-orange-700">
              {(servicesContent.ctaButtonLabel || servicesContentFallback.ctaButtonLabel)}: {header.phoneDisplay}
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
