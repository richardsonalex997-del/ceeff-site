import { MAIN_PAGE_NAME, staticPageNameToPath } from './paths.js';

const pageModules = import.meta.glob('../pages/*.jsx', { eager: true });

export const staticPageRegistry = Object.fromEntries(
  Object.entries(pageModules)
    .map(([filePath, module]) => {
      const match = filePath.match(/\/([^/]+)\.jsx$/);

      if (!match || typeof module.default !== 'function') {
        return null;
      }

      return [match[1], module.default];
    })
    .filter(Boolean)
    .sort(([leftName], [rightName]) => {
      if (leftName === MAIN_PAGE_NAME) {
        return -1;
      }

      if (rightName === MAIN_PAGE_NAME) {
        return 1;
      }

      return leftName.localeCompare(rightName);
    }),
);

export const staticPageRoutes = Object.entries(staticPageRegistry).map(([pageName, Component]) => ({
  pageName,
  path: staticPageNameToPath(pageName),
  Component,
}));
