import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as helmetAsync from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

import faqContentFallback from '@/data/faqContent';
import siteContentFallback from '@/data/siteContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { createPageUrl } from '@/utils';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function FAQ() {
  const faqContent = useRuntimeContent('/data/faq.json', faqContentFallback);
  const siteContent = useRuntimeContent('/data/site.json', siteContentFallback);
  const items = Array.isArray(faqContent?.items) ? faqContent.items : faqContentFallback.items;
  const header = siteContent?.header || siteContentFallback.header;

  return (
    <div className="min-h-screen bg-white pt-20">
      <Helmet>
        <title>{faqContent.seoTitle || faqContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={faqContent.seoDescription || faqContentFallback.seoDescription}
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
              {faqContent.badge || faqContentFallback.badge}
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {faqContent.title || faqContentFallback.title}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-300">
              {faqContent.subtitle || faqContentFallback.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {items.map((faq, index) => (
                <motion.div
                  key={`${faq.question}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="rounded-xl border border-slate-100 bg-white px-6 transition-shadow data-[state=open]:shadow-md"
                  >
                    <AccordionTrigger className="py-5 text-left font-semibold text-slate-900 hover:text-orange-500">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 leading-relaxed text-slate-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 rounded-2xl bg-slate-50 p-8 text-center"
            >
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                {faqContent.ctaTitle || faqContentFallback.ctaTitle}
              </h3>
              <p className="mb-6 text-slate-600">{faqContent.ctaText || faqContentFallback.ctaText}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href={header.phoneHref}>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {faqContent.callButtonLabel || faqContentFallback.callButtonLabel}
                  </Button>
                </a>
                <Link to={createPageUrl('Contacts')}>
                  <Button variant="outline">
                    {faqContent.formButtonLabel || faqContentFallback.formButtonLabel}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
