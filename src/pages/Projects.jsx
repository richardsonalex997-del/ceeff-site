import React from 'react';
import { motion } from 'framer-motion';
import { Building2, BadgeCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import projectsContentFallback from '@/data/projectsContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { createProjectUrl } from '@/lib/paths';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

function ProjectCard({ project, index }) {
  const previewImage = project.images?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <Link to={createProjectUrl(project.slug)} className="block">
        {previewImage && (
          <img
            src={previewImage}
            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={project.title}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={index === 0 ? 'high' : 'auto'}
          />
        )}
      </Link>

      <div className="p-6">
        <span className="mb-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase text-orange-700">
          {project.category}
        </span>
        <h2 className="mb-3 text-2xl font-bold text-slate-900">
          <Link to={createProjectUrl(project.slug)} className="hover:text-orange-600">
            {project.title}
          </Link>
        </h2>
        <p className="mb-5 text-slate-600">{project.description}</p>
        <Link
          to={createProjectUrl(project.slug)}
          className="inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
        >
          Смотреть проект
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const content = useRuntimeContent('/data/projects.json', projectsContentFallback);
  const projects = Array.isArray(content?.projects) ? content.projects : projectsContentFallback.projects;
  const clients = Array.isArray(content?.clients) ? content.clients : projectsContentFallback.clients;
  const featuredClient = content?.featuredClient || projectsContentFallback.featuredClient;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Выполненные проекты электролаборатории | Примеры работ | ЦЭФ</title>
        <meta
          name="description"
          content="Портфолио проектов ЦЭФ. Для каждого проекта доступна отдельная страница с описанием и фотогалереей."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Наши проекты</h1>
          <p className="mx-auto max-w-3xl text-base text-slate-600 sm:text-lg">
            Для каждого проекта теперь есть отдельная страница с собственным URL, крупной
            фотогалереей и кратким описанием выполненных работ.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id || project.slug} project={project} index={index} />
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-2xl sm:p-8 md:p-10">
            <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1.4fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-300">
                  <BadgeCheck className="h-4 w-4" />
                  Нам доверяют
                </div>
                <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
                  Среди наших заказчиков и партнёров
                </h2>
                <p className="mt-4 leading-relaxed text-slate-300">
                  Выполняем работы для крупных промышленных предприятий, городских структур,
                  исследовательских центров и федеральных компаний.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.2em] text-orange-300">
                        {featuredClient.eyebrow}
                      </div>
                      <div className="mt-1 text-xl font-bold sm:text-2xl">{featuredClient.title}</div>
                      <p className="mt-2 text-sm text-slate-300">{featuredClient.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {clients.map((client, index) => (
                  <motion.div
                    key={client}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className={`rounded-2xl border px-4 py-4 text-sm font-medium leading-snug ${
                      client === featuredClient.title
                        ? 'border-orange-300 bg-orange-500 text-white shadow-lg shadow-orange-950/20 sm:col-span-2 xl:col-span-3'
                        : 'border-white/10 bg-white/5 text-slate-100'
                    }`}
                  >
                    {client}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
