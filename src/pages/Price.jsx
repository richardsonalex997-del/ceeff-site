import React, { useEffect, useMemo, useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import * as helmetAsync from 'react-helmet-async';
import { Link } from 'react-router-dom';

import priceContentFallback from '@/data/priceContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { buildContactPrefillUrl } from '@/lib/contact-prefill';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

function findOption(options, id, fallbackId) {
  return options.find((item) => item.id === id)
    || options.find((item) => item.id === fallbackId)
    || options[0]
    || null;
}

export default function Price() {
  const priceContent = useRuntimeContent('/data/price.json', priceContentFallback);
  const serviceOptions = Array.isArray(priceContent?.serviceOptions) && priceContent.serviceOptions.length > 0
    ? priceContent.serviceOptions
    : priceContentFallback.serviceOptions;
  const voltageOptions = Array.isArray(priceContent?.voltageOptions) && priceContent.voltageOptions.length > 0
    ? priceContent.voltageOptions
    : priceContentFallback.voltageOptions;
  const urgencyOptions = Array.isArray(priceContent?.urgencyOptions) && priceContent.urgencyOptions.length > 0
    ? priceContent.urgencyOptions
    : priceContentFallback.urgencyOptions;
  const defaults = priceContent?.defaults || priceContentFallback.defaults;

  const [service, setService] = useState(defaults.service);
  const [voltage, setVoltage] = useState(defaults.voltage);
  const [urgency, setUrgency] = useState(defaults.urgency);
  const [volume, setVolume] = useState(defaults.volume);

  useEffect(() => {
    setService(defaults.service);
    setVoltage(defaults.voltage);
    setUrgency(defaults.urgency);
    setVolume(defaults.volume);
  }, [defaults.service, defaults.urgency, defaults.voltage, defaults.volume]);

  const selectedService = useMemo(
    () => findOption(serviceOptions, service, defaults.service),
    [defaults.service, service, serviceOptions],
  );
  const selectedVoltage = useMemo(
    () => findOption(voltageOptions, voltage, defaults.voltage),
    [defaults.voltage, voltage, voltageOptions],
  );
  const selectedUrgency = useMemo(
    () => findOption(urgencyOptions, urgency, defaults.urgency),
    [defaults.urgency, urgency, urgencyOptions],
  );

  const total = useMemo(() => {
    if (!selectedService || !selectedVoltage || !selectedUrgency) {
      return 0;
    }

    if (selectedService.id === 'search') {
      return Math.round(selectedService.basePrice * selectedUrgency.multiplier);
    }

    return Math.round(
      selectedService.basePrice * volume * selectedVoltage.multiplier * selectedUrgency.multiplier,
    );
  }, [selectedService, selectedUrgency, selectedVoltage, volume]);

  const formattedTotal = useMemo(
    () => new Intl.NumberFormat('ru-RU').format(total),
    [total],
  );

  const contactPrefillUrl = useMemo(() => {
    if (!selectedService || !selectedVoltage || !selectedUrgency) {
      return buildContactPrefillUrl();
    }

    const summaryLines = [
      'Здравствуйте! Хочу заказать услугу по расчету с страницы цен.',
      `Услуга: ${selectedService.label}`,
      `Класс напряжения: ${selectedVoltage.label}`,
      `Срочность: ${selectedUrgency.label}`,
      selectedService.id === 'search' ? null : `Количество единиц: ${volume}`,
      `Предварительная стоимость: ${formattedTotal} ₽`,
    ].filter(Boolean);

    return buildContactPrefillUrl({
      subject: 'Заявка со страницы цен',
      message: summaryLines.join('\n'),
    });
  }, [formattedTotal, selectedService, selectedUrgency, selectedVoltage, volume]);

  const priceTable = Array.isArray(priceContent?.priceTable)
    ? priceContent.priceTable
    : priceContentFallback.priceTable;
  const tableHeaders = priceContent.tableHeaders || priceContentFallback.tableHeaders;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Helmet>
        <title>{priceContent.seoTitle || priceContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={priceContent.seoDescription || priceContentFallback.seoDescription}
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-12 text-center text-4xl font-bold">
          {priceContent.pageTitle || priceContentFallback.pageTitle}
        </h1>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Calculator className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">
                {priceContent.calculatorTitle || priceContentFallback.calculatorTitle}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {priceContent.serviceLabel || priceContentFallback.serviceLabel}
                </label>
                <select
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 outline-none transition-all focus:border-orange-500"
                >
                  {serviceOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {priceContent.voltageLabel || priceContentFallback.voltageLabel}
                  </label>
                  <select
                    value={voltage}
                    onChange={(event) => setVoltage(event.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 outline-none transition-all focus:border-orange-500"
                  >
                    {voltageOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {priceContent.urgencyLabel || priceContentFallback.urgencyLabel}
                  </label>
                  <select
                    value={urgency}
                    onChange={(event) => setUrgency(event.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 outline-none transition-all focus:border-orange-500"
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {priceContent.volumeLabel || priceContentFallback.volumeLabel}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={defaults.volumeMin}
                    max={defaults.volumeMax}
                    value={volume}
                    onChange={(event) => setVolume(Number.parseInt(event.target.value, 10))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-orange-600"
                  />
                  <span className="w-8 text-center text-lg font-bold">{volume}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {priceContent.volumeHint || priceContentFallback.volumeHint}
                </p>
              </div>

              <div className="mt-6 rounded-xl bg-slate-900 p-6 text-center text-white">
                <div className="mb-1 text-sm text-slate-400">
                  {priceContent.resultLabel || priceContentFallback.resultLabel}
                </div>
                <div className="text-4xl font-bold text-orange-500">{formattedTotal} ₽</div>
              </div>

              <Link to={contactPrefillUrl}>
                <button className="h-14 w-full rounded-xl bg-orange-600 font-bold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700">
                  {priceContent.orderButtonLabel || priceContentFallback.orderButtonLabel}
                </button>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold">
              {priceContent.tableTitle || priceContentFallback.tableTitle}
            </h2>

            <div className="space-y-4 md:hidden">
              {priceTable.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                    <span>{tableHeaders.unit}: {item.unit}</span>
                    <span className="text-base font-bold text-slate-900">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 font-bold uppercase text-slate-500">
                  <tr>
                    <th className="border-b p-4">{tableHeaders.name}</th>
                    <th className="border-b p-4">{tableHeaders.unit}</th>
                    <th className="border-b p-4 text-right">{tableHeaders.price}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priceTable.map((item, index) => (
                    <tr key={`${item.name}-${index}`} className="hover:bg-slate-50">
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">{item.unit}</td>
                      <td className="p-4 text-right font-bold">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <Info className="h-5 w-5 shrink-0" />
              <p>{priceContent.noteText || priceContentFallback.noteText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
