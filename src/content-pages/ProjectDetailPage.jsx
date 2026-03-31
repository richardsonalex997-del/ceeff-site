import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import projectsContentFallback from '@/data/projectsContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { findProjectBySlug } from '@/lib/content-routes';
import PageNotFound from '@/lib/PageNotFound';
import { createPageUrl } from '@/utils';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const content = useRuntimeContent('/data/projects.json', projectsContentFallback);
  const project = findProjectBySlug(slug, content);

  if (!project) {
    return <PageNotFound />;
  }

  const images = Array.isArray(project.images) ? project.images : [];
  const galleryImages = images.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{project.title} | Проекты ЦЭФ</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            to={createPageUrl('Projects')}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Ко всем проектам
          </Link>

          <div className="mb-8 rounded-3xl bg-slate-900 p-8 text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              {project.category}
            </p>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{project.title}</h1>
            <p className="max-w-3xl text-lg text-slate-300">{project.description}</p>
          </div>

          <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">О проекте</h2>
            <p className="text-lg leading-relaxed text-slate-700">{project.description}</p>
          </section>

          {galleryImages.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Фотогалерея проекта</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <img
                    key={`${project.slug}-${index}`}
                    src={image}
                    alt={`${project.title} - фото ${index + 2}`}
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
