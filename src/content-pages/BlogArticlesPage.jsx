import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import { Button } from '@/components/ui/button';
import blogContentFallback from '@/data/blogContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { getBlogArticles } from '@/lib/content-routes';
import { createBlogArticleUrl, createBlogNewsUrl } from '@/lib/paths';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function BlogArticlesPage() {
  const content = useRuntimeContent('/data/blog.json', blogContentFallback);
  const articles = getBlogArticles(content);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Статьи | Блог ЦЭФ</title>
        <meta
          name="description"
          content="Статьи ЦЭФ об электролаборатории, испытаниях, РЗиА и эксплуатации электрооборудования."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col gap-6 rounded-3xl bg-slate-900 p-8 text-white md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Блог ЦЭФ
            </p>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Статьи</h1>
            <p className="text-lg text-slate-300">
              Практические материалы по испытаниям, диагностике и безопасной эксплуатации
              электрооборудования.
            </p>
          </div>
          <Link to={createBlogNewsUrl()}>
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Смотреть новости
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <Link to={createBlogArticleUrl(article.slug)} className="block">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="h-56 w-full object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-700">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold text-slate-900">
                  <Link to={createBlogArticleUrl(article.slug)} className="hover:text-orange-600">
                    {article.title}
                  </Link>
                </h2>
                <p className="mb-6 text-slate-600">{article.excerpt}</p>

                <Link
                  to={createBlogArticleUrl(article.slug)}
                  className="inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
                >
                  Читать статью
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
