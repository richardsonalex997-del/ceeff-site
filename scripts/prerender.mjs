import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { getSeoRoutes } from './seo-routes.mjs';

const rootDir = path.resolve();
const distDir = path.join(rootDir, 'dist');
const serverEntryUrl = pathToFileURL(path.join(distDir, 'server', 'entry-server.js')).href;
const { render } = await import(serverEntryUrl);

function injectRenderedApp(template, { appHtml, headTags }) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace('</head>', `${headTags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function getTargetFile(routePath) {
  if (routePath === '/') {
    return path.join(distDir, 'index.html');
  }

  return path.join(distDir, routePath.slice(1), 'index.html');
}

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const routes = getSeoRoutes(rootDir);

for (const route of routes) {
  const renderedPage = render(route.path);
  const html = injectRenderedApp(template, renderedPage);
  const targetFile = getTargetFile(route.path);

  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, html, 'utf8');
}

fs.rmSync(path.join(distDir, 'server'), { recursive: true, force: true });
