import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileCheck,
  Shield,
  Clock,
  Zap,
  Building2,
  TrendingUp,
  X,
} from 'lucide-react';
import * as helmetAsync from 'react-helmet-async';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import aboutContentFallback from '@/data/aboutContent';
import licensesContentFallback from '@/data/licensesContent';
import useRuntimeContent from '@/hooks/use-runtime-content';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

const statIcons = {
  'trending-up': TrendingUp,
  'building-2': Building2,
  users: Users,
  clock: Clock,
};

const advantageIcons = {
  shield: Shield,
  users: Users,
  'file-check': FileCheck,
  zap: Zap,
};

const advantageColorClasses = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
};

export default function About() {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const aboutContent = useRuntimeContent('/data/about.json', aboutContentFallback);
  const licensesContent = useRuntimeContent('/data/licenses.json', licensesContentFallback);

  const stats = Array.isArray(aboutContent?.stats) ? aboutContent.stats : aboutContentFallback.stats;
  const advantages = Array.isArray(aboutContent?.advantages)
    ? aboutContent.advantages
    : aboutContentFallback.advantages;
  const approachSteps = Array.isArray(aboutContent?.approachSteps)
    ? aboutContent.approachSteps
    : aboutContentFallback.approachSteps;
  const regulations = Array.isArray(aboutContent?.regulations)
    ? aboutContent.regulations
    : aboutContentFallback.regulations;
  const licenses = Array.isArray(licensesContent?.items)
    ? licensesContent.items
    : licensesContentFallback.items;
  const introParagraphs = Array.isArray(aboutContent?.introParagraphs)
    ? aboutContent.introParagraphs
    : aboutContentFallback.introParagraphs;

  const visibleLicenses = useMemo(() => licenses.slice(0, 4), [licenses]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{aboutContent.seoTitle || aboutContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={aboutContent.seoDescription || aboutContentFallback.seoDescription}
        />
      </Helmet>

      <div className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center text-3xl font-bold md:text-5xl"
          >
            {aboutContent.heroTitle || aboutContentFallback.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-center text-base text-slate-400 sm:text-lg"
          >
            {aboutContent.heroSubtitle || aboutContentFallback.heroSubtitle}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto -mt-12 px-4">
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = statIcons[stat.icon] || TrendingUp;

            return (
              <motion.div
                key={`${stat.label}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                  <Icon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="mb-1 text-3xl font-bold text-slate-900 sm:text-4xl">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-4xl"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            {aboutContent.introTitle || aboutContentFallback.introTitle}
          </h2>
          <div className="mb-8 space-y-4 text-center text-base text-slate-600 sm:text-lg">
            {introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {advantages.map((advantage) => {
              const Icon = advantageIcons[advantage.icon] || Shield;
              const colorClass =
                advantageColorClasses[advantage.color] || advantageColorClasses.green;

              return (
                <div key={advantage.title} className="flex gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{advantage.title}</h4>
                    <p className="text-slate-600">{advantage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="mb-20 rounded-3xl bg-gradient-to-br from-slate-50 to-white p-8 md:p-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            {aboutContent.approachTitle || aboutContentFallback.approachTitle}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {approachSteps.map((step) => (
              <div key={`${step.step}-${step.title}`} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                  <span className="text-2xl font-bold text-orange-600">{step.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            {aboutContent.regulationsTitle || aboutContentFallback.regulationsTitle}
          </h2>
          <p className="mb-10 text-center text-slate-500">
            {aboutContent.regulationsSubtitle || aboutContentFallback.regulationsSubtitle}
          </p>

          <div className="mx-auto max-w-4xl space-y-4">
            {regulations.map((regulation, index) => (
              <motion.div
                key={regulation.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <h3 className="mb-2 text-lg font-bold text-slate-900">{regulation.title}</h3>
                <p className="text-sm text-slate-600">{regulation.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            {aboutContent.licensesTitle || aboutContentFallback.licensesTitle}
          </h2>
          <p className="mb-10 text-center text-slate-500">
            {aboutContent.licensesSubtitle || aboutContentFallback.licensesSubtitle}
          </p>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {visibleLicenses.map((license, index) => (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => (license.image || license.images) && setSelectedLicense(license)}
              >
                <div className="relative flex h-56 flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-64">
                  <img
                    src={license.previewImage || license.image || license.images?.[0]}
                    alt={license.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                    <div className="text-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <svg
                        className="mx-auto mb-2 h-10 w-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Просмотреть</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center text-sm font-bold">{license.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedLicense} onOpenChange={() => setSelectedLicense(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-4xl overflow-y-auto p-0 sm:w-full">
          {selectedLicense && (
            <div className="relative">
              <button
                onClick={() => setSelectedLicense(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-4 sm:p-6">
                <h3 className="mb-4 pr-10 text-xl font-bold sm:text-2xl">{selectedLicense.title}</h3>
                {selectedLicense.image ? (
                  <img
                    src={selectedLicense.image}
                    alt={selectedLicense.title}
                    decoding="async"
                    className="w-full rounded-lg"
                  />
                ) : selectedLicense.images ? (
                  <div className="space-y-4">
                    {selectedLicense.images.map((image, index) => (
                      <img
                        key={`${selectedLicense.id}-${index}`}
                        src={image}
                        alt={`${selectedLicense.title} - страница ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
