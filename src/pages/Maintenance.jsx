import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Hammer,
  PhoneCall,
  Shield,
  Wrench,
} from 'lucide-react';
import * as helmetAsync from 'react-helmet-async';
import { Link } from 'react-router-dom';

import maintenanceContentFallback from '@/data/maintenanceContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { createPageUrl } from '@/utils';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

const iconMap = {
  'check-circle-2': CheckCircle2,
  clock: Clock,
  hammer: Hammer,
  'phone-call': PhoneCall,
  shield: Shield,
  siren: AlertTriangle,
  wrench: Wrench,
};

export default function Maintenance() {
  const maintenanceContent = useRuntimeContent('/data/maintenance.json', maintenanceContentFallback);
  const advantages = Array.isArray(maintenanceContent?.advantages) && maintenanceContent.advantages.length > 0
    ? maintenanceContent.advantages
    : maintenanceContentFallback.advantages;
  const services = Array.isArray(maintenanceContent?.services) && maintenanceContent.services.length > 0
    ? maintenanceContent.services
    : maintenanceContentFallback.services;
  const [activeService, setActiveService] = useState(services[0]?.id || 'to');

  useEffect(() => {
    if (!services.some((service) => service.id === activeService)) {
      setActiveService(services[0]?.id || 'to');
    }
  }, [activeService, services]);

  const currentService = useMemo(() => {
    return services.find((service) => service.id === activeService) || services[0] || null;
  }, [activeService, services]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{maintenanceContent.seoTitle || maintenanceContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={maintenanceContent.seoDescription || maintenanceContentFallback.seoDescription}
        />
      </Helmet>

      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-1.5">
              <Wrench className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-bold text-blue-400">
                {maintenanceContent.badgeLabel || maintenanceContentFallback.badgeLabel}
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
              {maintenanceContent.pageTitle || maintenanceContentFallback.pageTitle}
            </h1>
            <p className="text-lg text-slate-300 sm:text-xl">
              {maintenanceContent.pageSubtitle || maintenanceContentFallback.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {advantages.map((item, index) => {
              const Icon = iconMap[item.icon] || Shield;

              return (
                <div key={`${item.title}-${index}`} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-600">{item.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Wrench;

            return (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-all ${
                  activeService === service.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                {service.title}
              </button>
            );
          })}
        </div>

        {currentService && (
          <motion.div
            key={currentService.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl"
          >
            <h2 className="mb-4 text-3xl font-bold">{currentService.subtitle}</h2>
            <p className="mb-8 text-slate-600">{currentService.description}</p>

            <h3 className="mb-4 text-xl font-bold">Состав работ:</h3>
            <ul className="custom-list mb-8">
              {(currentService.works || []).map((work, index) => (
                <li key={`${currentService.id}-work-${index}`}>{work}</li>
              ))}
            </ul>

            <div className="mb-6 rounded-xl bg-slate-50 p-6">
              <div className="mb-2 font-bold">Периодичность:</div>
              <div className="flex flex-wrap gap-2">
                {(currentService.periodicity || []).map((period, index) => (
                  <span
                    key={`${currentService.id}-period-${index}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm"
                  >
                    {period}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6">
              <div className="mb-1 text-sm text-slate-600">Стоимость:</div>
              <div className="text-3xl font-bold text-orange-600">{currentService.price}</div>
            </div>
          </motion.div>
        )}
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {maintenanceContent.estimateTitle || maintenanceContentFallback.estimateTitle}
            </h2>
            <p className="mb-8 text-slate-600">
              {maintenanceContent.estimateText || maintenanceContentFallback.estimateText}
            </p>
            <Link to={createPageUrl('Contacts')}>
              <button className="rounded-xl bg-orange-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-orange-700">
                {maintenanceContent.estimateButtonLabel || maintenanceContentFallback.estimateButtonLabel}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
