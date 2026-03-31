import { SITE_URL } from './site-config.js';

export const MAIN_PAGE_NAME = 'Home';

export function staticPageNameToPath(pageName) {
  if (!pageName || pageName === MAIN_PAGE_NAME) {
    return '/';
  }

  return `/${pageName.toLowerCase()}`;
}

export function createBlogArticlesUrl() {
  return '/blog/articles';
}

export function createBlogNewsUrl() {
  return '/blog/news';
}

export function createBlogArticleUrl(slug) {
  return `${createBlogArticlesUrl()}/${slug}`;
}

export function createBlogNewsItemUrl(slug) {
  return `${createBlogNewsUrl()}/${slug}`;
}

export function createProjectUrl(slug) {
  return `/projects/${slug}`;
}

export function normalizePathname(pathname = '/') {
  const [rawPath] = pathname.split('?');
  const cleanedPath = rawPath.replace(/\/{2,}/g, '/').trim() || '/';
  const withoutTrailingSlash =
    cleanedPath.length > 1 && cleanedPath.endsWith('/')
      ? cleanedPath.slice(0, -1)
      : cleanedPath;
  const lowerPath = withoutTrailingSlash.toLowerCase();

  if (lowerPath === '/home') {
    return '/';
  }

  return lowerPath || '/';
}

export function createCanonicalUrl(pathname = '/') {
  return new URL(normalizePathname(pathname), SITE_URL).toString();
}

