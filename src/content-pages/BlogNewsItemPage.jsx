import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import blogContentFallback from '@/data/blogContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { findBlogNewsBySlug } from '@/lib/content-routes';
import PageNotFound from '@/lib/PageNotFound';
import { createBlogNewsUrl } from '@/lib/paths';
import { createPageUrl } from '@/utils';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function BlogNewsItemPage() {
  const { slug } = useParams();
  const content = useRuntimeContent('/data/blog.json', blogContentFallback);
  const item = findBlogNewsBySlug(slug, content);

  if (!item) {
    return <PageNotFound />;
  }

  const paragraphs = item.content
    ? item.content.split('\n').filter(Boolean)
    : [
        item.excerpt,
        'Подробности по проекту и условиям выполнения работ можно уточнить у специалистов ЦЭФ.',
      ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{item.title} | Новости ЦЭФ</title>
        <meta name="description" content={item.excerpt} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            to={createBlogNewsUrl()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Ко всем новостям
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
              {item.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {item.date}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl">{item.title}</h1>
          <img
            src={item.image}
            alt={item.title}
            loading="eager"
            decoding="async"
            fetchpriority="high"
            className="mb-8 w-full rounded-3xl border border-slate-200"
          />

          <div className="space-y-4 text-lg leading-relaxed text-slate-700">
            {paragraphs.map((paragraph, index) => (
              <p key={`${item.slug}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-slate-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-slate-900">Обсудить похожий проект</h2>
            <p className="mb-4 text-slate-600">
              Если вам нужен похожий результат или расчёт по объекту, оставьте заявку на странице
              контактов.
            </p>
            <Link to={createPageUrl('Contacts')} className="font-semibold text-orange-600 hover:text-orange-700">
              Перейти к заявке
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
