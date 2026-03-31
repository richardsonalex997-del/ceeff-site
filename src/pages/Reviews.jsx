import React from 'react';
import { motion } from 'framer-motion';
import * as helmetAsync from 'react-helmet-async';
import { Star } from 'lucide-react';

import reviewsContentFallback from '@/data/reviewsContent';
import useRuntimeContent from '@/hooks/use-runtime-content';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function Reviews() {
  const reviewsContent = useRuntimeContent('/data/reviews.json', reviewsContentFallback);
  const reviews = Array.isArray(reviewsContent?.items)
    ? reviewsContent.items
    : reviewsContentFallback.items;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Helmet>
        <title>{reviewsContent.seoTitle || reviewsContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={reviewsContent.seoDescription || reviewsContentFallback.seoDescription}
        />
      </Helmet>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {reviewsContent.title || reviewsContentFallback.title}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              {reviewsContent.subtitle || reviewsContentFallback.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id || `${review.author}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex gap-1 text-orange-500">
                  {[...Array(review.rating || 5)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mb-6 italic leading-relaxed text-slate-600">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                    {review.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{review.author}</div>
                    <div className="text-xs text-slate-500">{review.position}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
