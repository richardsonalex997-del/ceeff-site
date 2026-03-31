import fs from 'node:fs';
import path from 'node:path';

import { SITE_URL } from '../src/lib/site-config.js';
import { getSeoRoutes } from './seo-routes.mjs';

const rootDir = path.resolve();
const publicDir = path.join(rootDir, 'public');

function writeFile(relativePath, contents) {
  const targetPath = path.join(publicDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents, 'utf8');
}

function buildSitemapXml(routes) {
  const urls = routes
    .map(
      ({ path: routePath, priority }) => `  <url>
    <loc>${new URL(routePath, SITE_URL).toString()}</loc>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', SITE_URL).toString()}
`;
}

function buildHtaccess(routes) {
  return `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  RewriteRule ^index\\.html$ / [R=301,L]
  RewriteRule ^(.+)/index\\.html$ /$1 [R=301,L,NC]
  RewriteRule ^home/?$ / [R=301,L,NC]

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "^assets/.*$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
`;
}

const routes = getSeoRoutes(rootDir);

writeFile('sitemap.xml', buildSitemapXml(routes));
writeFile('robots.txt', buildRobotsTxt());
writeFile('.htaccess', buildHtaccess(routes));
