import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import blogContentFallback from '@/data/blogContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { getBlogArticles, getBlogNews } from '@/lib/content-routes';
import {
  createBlogArticleUrl,
  createBlogNewsItemUrl,
  createBlogArticlesUrl,
  createBlogNewsUrl,
} from '@/lib/paths';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function Blog() {
  const content = useRuntimeContent('/data/blog.json', blogContentFallback);
  const articles = getBlogArticles(content);
  const news = getBlogNews(content);
  const featuredArticle = articles[0];
  const featuredNews = news[0];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Блог ЦЭФ | Статьи и новости</title>
        <meta
          name="description"
          content="Блог ЦЭФ: статьи по испытаниям и диагностике электрооборудования, новости компании и завершённых проектов."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-8 text-white sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Блог ЦЭФ
          </p>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Статьи и новости в отдельных разделах</h1>
          <p className="max-w-3xl text-lg text-slate-300">
            Разделили блог на два самостоятельных направления: экспертные статьи и новости
            компании. У каждого материала теперь свой уникальный URL.
          </p>
        </div>

        <div className="mb-14 grid gap-6 lg:grid-cols-2">
          <Link
            to={createBlogArticlesUrl()}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
          >
            <FileText className="mb-4 h-10 w-10 text-orange-600" />
            <h2 className="mb-3 text-3xl font-bold text-slate-900">Статьи</h2>
            <p className="mb-6 text-slate-600">
              Разборы, технические объяснения и практические материалы по испытаниям и
              эксплуатации электрооборудования.
            </p>
            <span className="inline-flex items-center gap-2 font-semibold text-orange-600">
              Перейти к статьям
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            to={createBlogNewsUrl()}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
          >
            <Newspaper className="mb-4 h-10 w-10 text-blue-600" />
            <h2 className="mb-3 text-3xl font-bold text-slate-900">Новости</h2>
            <p className="mb-6 text-slate-600">
              Новости компании, завершённые проекты и важные обновления по нашей работе.
            </p>
            <span className="inline-flex items-center gap-2 font-semibold text-orange-600">
              Перейти к новостям
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {featuredArticle && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                Свежая статья
              </p>
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                loading="lazy"
                decoding="async"
                className="mb-5 h-64 w-full rounded-2xl object-cover"
              />
              <h2 className="mb-3 text-2xl font-bold text-slate-900">{featuredArticle.title}</h2>
              <p className="mb-5 text-slate-600">{featuredArticle.excerpt}</p>
              <Link
                to={createBlogArticleUrl(featuredArticle.slug)}
                className="inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
              >
                Читать
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          )}

          {featuredNews && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
                Последняя новость
              </p>
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                loading="lazy"
                decoding="async"
                className="mb-5 h-64 w-full rounded-2xl object-cover"
              />
              <h2 className="mb-3 text-2xl font-bold text-slate-900">{featuredNews.title}</h2>
              <p className="mb-5 text-slate-600">{featuredNews.excerpt}</p>
              <Link
                to={createBlogNewsItemUrl(featuredNews.slug)}
                className="inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
              >
                Открыть
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
