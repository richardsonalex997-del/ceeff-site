import fs from 'node:fs';
import path from 'node:path';

import { getContentRoutes } from '../src/lib/content-routes.js';
import { MAIN_PAGE_NAME, staticPageNameToPath } from '../src/lib/paths.js';

const routePriorityMap = {
  Home: '1.0',
  Services: '0.9',
  Maintenance: '0.9',
  Price: '0.8',
  Projects: '0.8',
  About: '0.7',
  Licenses: '0.7',
  Reviews: '0.7',
  Consulting: '0.7',
  Blog: '0.6',
  FAQ: '0.6',
  Contacts: '0.6',
  Privacy: '0.1',
};

function readPublicContentJson(rootDir, fileName) {
  const targetPath = path.join(rootDir, 'public', 'data', fileName);

  if (!fs.existsSync(targetPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  } catch {
    return null;
  }
}

export function getStaticPageNames(rootDir = path.resolve()) {
  const pagesDir = path.join(rootDir, 'src', 'pages');

  return fs
    .readdirSync(pagesDir)
    .filter((fileName) => fileName.endsWith('.jsx'))
    .map((fileName) => path.basename(fileName, '.jsx'))
    .sort((leftName, rightName) => {
      if (leftName === MAIN_PAGE_NAME) {
        return -1;
      }

      if (rightName === MAIN_PAGE_NAME) {
        return 1;
      }

      return leftName.localeCompare(rightName);
    });
}

export function getSeoRoutes(rootDir = path.resolve()) {
  const staticRoutes = getStaticPageNames(rootDir).map((pageName) => ({
    pageName,
    path: staticPageNameToPath(pageName),
    priority: routePriorityMap[pageName] ?? '0.6',
  }));

  const contentRoutes = getContentRoutes({
    blogContent: readPublicContentJson(rootDir, 'blog.json') ?? undefined,
    projectsContent: readPublicContentJson(rootDir, 'projects.json') ?? undefined,
  }).map((routePath) => ({
    pageName: routePath,
    path: routePath,
    priority: routePath.startsWith('/projects/')
      ? '0.7'
      : routePath.startsWith('/blog/')
        ? '0.6'
        : '0.6',
  }));

  return [...staticRoutes, ...contentRoutes];
}
