import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, ZoomIn, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as helmetAsync from 'react-helmet-async';

import licensesContentFallback from '@/data/licensesContent';
import useRuntimeContent from '@/hooks/use-runtime-content';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function Licenses() {
  const content = useRuntimeContent('/data/licenses.json', licensesContentFallback);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLicense, setSelectedLicense] = useState(null);

  const categories = Array.isArray(content?.categories)
    ? content.categories
    : licensesContentFallback.categories;
  const licenses = Array.isArray(content?.items) ? content.items : licensesContentFallback.items;

  const filteredLicenses = useMemo(() => {
    if (activeCategory === 'all') {
      return licenses;
    }

    return licenses.filter((license) => license.category === activeCategory);
  }, [activeCategory, licenses]);

  const previewImage = selectedLicense?.image || selectedLicense?.images?.[0];

  return (
    <div className="min-h-screen bg-white pt-20">
      <Helmet>
        <title>{content.seoTitle || licensesContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={content.seoDescription || licensesContentFallback.seoDescription}
        />
      </Helmet>

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-4 border-orange-500/30 bg-orange-500/20 text-orange-400">
              {content.pageBadge || licensesContentFallback.pageBadge}
            </Badge>
            <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              {content.pageTitle || licensesContentFallback.pageTitle}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-xl">
              {content.pageSubtitle || licensesContentFallback.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.id)}
                className={activeCategory === category.id ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="defer-section py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredLicenses.map((license, index) => (
                <motion.div
                  key={license.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedLicense(license)}
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition-all duration-300 hover:border-orange-200 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden bg-slate-200">
                      <img
                        src={license.previewImage || license.image || license.images?.[0]}
                        alt={license.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <div className="absolute right-4 top-4">
                        <Badge className="bg-green-500 text-white">
                          Действует до {license.validUntil}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="mb-1 flex items-center gap-2 text-sm text-white/80">
                          <Shield className="h-4 w-4" />
                          {license.issuer}
                        </div>
                        <p className="line-clamp-2 font-bold text-white">{license.title}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                          <ZoomIn className="h-6 w-6 text-slate-900" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-500">{license.number}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedLicense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedLicense(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt={selectedLicense.title}
                    decoding="async"
                    className="h-56 w-full object-cover sm:h-80"
                  />
                )}
                <button
                  onClick={() => setSelectedLicense(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <Badge className="mb-3 bg-green-100 text-green-700">
                  Действует до {selectedLicense.validUntil} года
                </Badge>
                <h3 className="mb-2 pr-10 text-xl font-bold text-slate-900 sm:text-2xl">
                  {selectedLicense.title}
                </h3>
                <p className="mb-4 text-slate-600">
                  Выдан: {selectedLicense.issuer}
                  <br />
                  Номер: {selectedLicense.number}
                </p>

                {selectedLicense.images && selectedLicense.images.length > 1 && (
                  <div className="mb-5 grid gap-3 sm:grid-cols-3">
                    {selectedLicense.images.map((image, index) => (
                      <img
                        key={`${selectedLicense.id}-${index}`}
                        src={image}
                        alt={`${selectedLicense.title} - страница ${index + 1}`}
                        className="h-32 w-full rounded-lg border border-slate-200 object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </div>
                )}

                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Download className="mr-2 h-4 w-4" />
                  Скачать документ
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
