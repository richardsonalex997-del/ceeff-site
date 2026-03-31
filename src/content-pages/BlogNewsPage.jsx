import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import { Button } from '@/components/ui/button';
import blogContentFallback from '@/data/blogContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { getBlogNews } from '@/lib/content-routes';
import { createBlogArticlesUrl, createBlogNewsItemUrl } from '@/lib/paths';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function BlogNewsPage() {
  const content = useRuntimeContent('/data/blog.json', blogContentFallback);
  const news = getBlogNews(content);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Новости | Блог ЦЭФ</title>
        <meta
          name="description"
          content="Новости ЦЭФ: завершённые проекты, обновления компании и события в работе электролаборатории."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col gap-6 rounded-3xl bg-slate-900 p-8 text-white md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Блог ЦЭФ
            </p>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Новости</h1>
            <p className="text-lg text-slate-300">
              Новости компании, завершённые кейсы и важные обновления по нашим проектам.
            </p>
          </div>
          <Link to={createBlogArticlesUrl()}>
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Смотреть статьи
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {news.map((item) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <Link to={createBlogNewsItemUrl(item.slug)} className="block">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-64 w-full object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {item.date}
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold text-slate-900">
                  <Link to={createBlogNewsItemUrl(item.slug)} className="hover:text-orange-600">
                    {item.title}
                  </Link>
                </h2>
                <p className="mb-6 text-slate-600">{item.excerpt}</p>

                <Link
                  to={createBlogNewsItemUrl(item.slug)}
                  className="inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
                >
                  Открыть новость
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
