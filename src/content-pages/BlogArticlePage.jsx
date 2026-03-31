import React from 'react';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import { Button } from '@/components/ui/button';
import blogContentFallback from '@/data/blogContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { findBlogArticleBySlug } from '@/lib/content-routes';
import PageNotFound from '@/lib/PageNotFound';
import { createBlogArticlesUrl } from '@/lib/paths';
import { createPageUrl } from '@/utils';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

function renderArticleContent(content = '') {
  return content.split('\n').map((paragraph, index) => {
    if (paragraph.startsWith('## ')) {
      return (
        <h2 key={index} className="mb-4 mt-10 text-2xl font-bold text-slate-900">
          {paragraph.slice(3)}
        </h2>
      );
    }

    if (paragraph.startsWith('### ')) {
      return (
        <h3 key={index} className="mb-3 mt-8 text-xl font-bold text-slate-900">
          {paragraph.slice(4)}
        </h3>
      );
    }

    if (paragraph.startsWith('- ')) {
      return (
        <li key={index} className="mb-2 ml-6 text-slate-700">
          {paragraph.slice(2)}
        </li>
      );
    }

    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
      return (
        <p key={index} className="mt-6 font-bold text-slate-900">
          {paragraph.slice(2, -2)}
        </p>
      );
    }

    if (paragraph.trim()) {
      return (
        <p key={index} className="mb-4 leading-relaxed text-slate-700">
          {paragraph}
        </p>
      );
    }

    return null;
  });
}

export default function BlogArticlePage() {
  const { slug } = useParams();
  const content = useRuntimeContent('/data/blog.json', blogContentFallback);
  const article = findBlogArticleBySlug(slug, content);

  if (!article) {
    return <PageNotFound />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{article.title} | Блог ЦЭФ</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            to={createBlogArticlesUrl()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Ко всем статьям
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
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

          <h1 className="mb-6 text-4xl font-bold text-slate-900 sm:text-5xl">{article.title}</h1>
          <p className="mb-8 text-lg text-slate-600">{article.excerpt}</p>

          <img
            src={article.image}
            alt={article.title}
            loading="eager"
            decoding="async"
            fetchpriority="high"
            className="mb-10 w-full rounded-3xl border border-slate-200"
          />

          <div className="prose prose-slate max-w-none">{renderArticleContent(article.content)}</div>

          <div className="mt-12 rounded-3xl border border-orange-200 bg-orange-50 p-6 sm:p-8">
            <h2 className="mb-3 text-2xl font-bold text-slate-900">Нужна консультация по испытаниям?</h2>
            <p className="mb-6 text-slate-600">
              Подберём правильную методику испытаний, подготовим протоколы и поможем безопасно
              сдать объект.
            </p>
            <Link to={createPageUrl('Contacts')}>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Обсудить задачу
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
