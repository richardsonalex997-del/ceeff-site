import blogContentFallback from '../data/blogContent.js';
import projectsContentFallback from '../data/projectsContent.js';
import {
  createBlogArticleUrl,
  createBlogArticlesUrl,
  createBlogNewsItemUrl,
  createBlogNewsUrl,
  createProjectUrl,
} from './paths.js';

export function getBlogArticles(content = blogContentFallback) {
  return Array.isArray(content?.articles) ? content.articles : [];
}

export function getBlogNews(content = blogContentFallback) {
  return Array.isArray(content?.news) ? content.news : [];
}

export function findBlogArticleBySlug(slug, content = blogContentFallback) {
  return getBlogArticles(content).find((item) => item.slug === slug) || null;
}

export function findBlogNewsBySlug(slug, content = blogContentFallback) {
  return getBlogNews(content).find((item) => item.slug === slug) || null;
}

export function getProjects(content = projectsContentFallback) {
  return Array.isArray(content?.projects) ? content.projects : [];
}

export function findProjectBySlug(slug, content = projectsContentFallback) {
  return getProjects(content).find((item) => item.slug === slug) || null;
}

export function getContentRoutes({
  blogContent = blogContentFallback,
  projectsContent = projectsContentFallback,
} = {}) {
  const articleRoutes = getBlogArticles(blogContent).map((article) => createBlogArticleUrl(article.slug));
  const newsRoutes = getBlogNews(blogContent).map((item) => createBlogNewsItemUrl(item.slug));
  const projectRoutes = getProjects(projectsContent).map((project) => createProjectUrl(project.slug));

  return [
    createBlogArticlesUrl(),
    createBlogNewsUrl(),
    ...articleRoutes,
    ...newsRoutes,
    ...projectRoutes,
  ];
}
