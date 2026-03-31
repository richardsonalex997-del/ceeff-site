import { normalizePathname, staticPageNameToPath } from '@/lib/paths.js';

export function createPageUrl(pageNameOrPath: string) {
  if (!pageNameOrPath) {
    return '/';
  }

  if (pageNameOrPath.startsWith('/')) {
    return normalizePathname(pageNameOrPath);
  }

  return staticPageNameToPath(pageNameOrPath);
}
