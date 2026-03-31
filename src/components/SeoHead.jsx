import { useLocation } from 'react-router-dom';
import * as helmetAsync from 'react-helmet-async';

import {
  DEFAULT_LOCALE,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_TITLE,
  GOOGLE_SITE_VERIFICATION,
} from '@/lib/site-config.js';
import { createCanonicalUrl } from '@/lib/paths.js';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function SeoHead() {
  const location = useLocation();
  const canonicalUrl = createCanonicalUrl(location.pathname);

  return (
    <Helmet prioritizeSeoTags>
      <html lang={DEFAULT_LOCALE} />
      <title>{DEFAULT_META_TITLE}</title>
      <meta name="description" content={DEFAULT_META_DESCRIPTION} />
      <meta name="google" content="notranslate" />
      <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
}
