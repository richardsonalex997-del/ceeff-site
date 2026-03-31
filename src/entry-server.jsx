import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import { AppProviders } from '@/App.jsx';
import { createQueryClient } from '@/lib/query-client';

function buildHelmetHead(helmet) {
  return [
    helmet.title?.toString(),
    helmet.priority?.toString(),
    helmet.meta?.toString(),
    helmet.link?.toString(),
    helmet.style?.toString(),
    helmet.script?.toString(),
  ]
    .filter(Boolean)
    .join('\n');
}

export function render(url) {
  const helmetContext = {};
  const appHtml = renderToString(
    <AppProviders
      Router={StaticRouter}
      routerProps={{ location: url }}
      helmetContext={helmetContext}
      queryClient={createQueryClient()}
    />,
  );

  return {
    appHtml,
    headTags: buildHelmetHead(helmetContext.helmet ?? {}),
  };
}
