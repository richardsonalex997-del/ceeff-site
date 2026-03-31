import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import reviewsContentFallback from '@/data/reviewsContent';
import useRuntimeContent from '@/hooks/use-runtime-content';

export default function ReviewsSection() {
  const reviewsContent = useRuntimeContent('/data/reviews.json', reviewsContentFallback);
  const reviews = Array.isArray(reviewsContent?.items)
    ? reviewsContent.items.slice(0, 3)
    : reviewsContentFallback.items.slice(0, 3);

  return (
    <section className="defer-section container mx-auto px-4 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold sm:mb-12 sm:text-4xl">
        {reviewsContent.homeTitle || reviewsContent.title || reviewsContentFallback.homeTitle}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id || `${review.author}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-4 flex gap-1 text-orange-500">
              {[...Array(review.rating || 5)].map((_, starIndex) => (
                <Star key={starIndex} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mb-6 italic text-slate-600">"{review.text}"</p>
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
    </section>
  );
}
