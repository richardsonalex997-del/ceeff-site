import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import logo from './assets/logo.webp';
import FloatingChat from '@/components/home/FloatingChat';
import siteContentFallback from '@/data/siteContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { createPageUrl } from '@/utils';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const siteContent = useRuntimeContent('/data/site.json', siteContentFallback);

  const navigation = Array.isArray(siteContent?.navigation)
    ? siteContent.navigation
    : siteContentFallback.navigation;
  const footerSections = Array.isArray(siteContent?.footerSections)
    ? siteContent.footerSections
    : siteContentFallback.footerSections;
  const footerDocuments = Array.isArray(siteContent?.footerDocuments)
    ? siteContent.footerDocuments
    : siteContentFallback.footerDocuments;
  const brand = siteContent?.brand || siteContentFallback.brand;
  const header = siteContent?.header || siteContentFallback.header;
  const contacts = siteContent?.contacts || siteContentFallback.contacts;
  const footer = siteContent?.footer || siteContentFallback.footer;

  useEffect(() => {
    document.documentElement.lang = 'ru';
    document.body.classList.add('notranslate');

    return () => document.body.classList.remove('notranslate');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPageName]);

  useEffect(() => {
    if (!document.querySelector('meta[name="description"]')) {
      const metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = 'Профессиональные услуги электролаборатории и электромонтажа.';
      document.head.appendChild(metaDescription);
    }

    if (!document.querySelector('meta[name="google"]')) {
      const metaNotranslate = document.createElement('meta');
      metaNotranslate.name = 'google';
      metaNotranslate.content = 'notranslate';
      document.head.appendChild(metaNotranslate);
    }

    if (!document.querySelector('meta[name="google-site-verification"]')) {
      const metaVerification = document.createElement('meta');
      metaVerification.name = 'google-site-verification';
      metaVerification.content = 'googled94aa22da8d8008d';
      document.head.appendChild(metaVerification);
    }

    const initGtm = () => {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XDQF3TRKHM';
      document.head.appendChild(gtagScript);

      const gtagInit = document.createElement('script');
      gtagInit.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XDQF3TRKHM');
      `;
      document.head.appendChild(gtagInit);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(initGtm);
    } else {
      setTimeout(initGtm, 3500);
    }
  }, []);

  return (
    <div className="notranslate flex min-h-screen flex-col" translate="no">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="group flex min-w-0 items-center gap-2 sm:gap-3">
              <img
                src={logo}
                alt={`${brand.shortName} логотип`}
                width="200"
                height="149"
                decoding="async"
                className="h-8 w-auto object-contain sm:h-10"
              />
              <div className="hidden max-w-[200px] leading-tight min-[380px]:block">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-900">
                  {brand.shortName}
                </div>
                <div className="text-[9px] font-medium leading-tight text-slate-500">
                  {brand.licenseNote}
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 xl:flex">
              {navigation.map((item) => (
                <Link
                  key={`${item.href}-${item.name || item.label}`}
                  to={createPageUrl(item.href)}
                  className={`transition-colors hover:text-orange-600 ${
                    currentPageName === item.href ? 'font-bold text-orange-600' : ''
                  }`}
                >
                  {item.name || item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-5 md:flex">
              <div className="flex items-center gap-3">
                <a
                  href={contacts.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.7 8.03c-.128.568-.461.707-.933.441l-2.58-1.901-1.244 1.197c-.138.137-.253.253-.519.253l.186-2.631 4.795-4.332c.208-.185-.045-.288-.324-.103l-5.926 3.733-2.556-.801c-.555-.174-.567-.555.116-.822l9.996-3.852c.461-.171.866.11.715.822z" />
                  </svg>
                </a>
                <a
                  href={contacts.vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white transition-colors hover:bg-blue-800"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.1h-1.34c-.63 0-.82-.5-1.95-1.63-.98-.98-1.41-1.11-1.66-1.11-.34 0-.43.09-.43.52v1.48c0 .4-.13.64-1.17.64-1.71 0-3.61-1.04-4.94-2.97-2-2.89-2.55-5.06-2.55-5.5 0-.25.09-.49.52-.49h1.34c.39 0 .54.18.69.59.77 2.2 2.06 4.13 2.59 4.13.2 0 .29-.09.29-.59V8.68c-.06-.95-.56-1.03-.56-1.37 0-.2.17-.4.43-.4h2.11c.34 0 .47.19.47.57v3.07c0 .34.15.48.25.48.2 0 .36-.14.72-.5 1.1-1.24 1.89-3.16 1.89-3.16.1-.22.29-.43.67-.43h1.34c.4 0 .49.21.4.57-.15.71-1.61 3.01-1.61 3.01-.17.28-.24.4 0 .72.17.23.74.73 1.12 1.17.69.8 1.22 1.47 1.36 1.93.13.47-.08.71-.56.71z" />
                  </svg>
                </a>
              </div>
              <div className="text-right">
                <a
                  href={header.phoneHref}
                  className="block font-bold text-slate-900 transition-colors hover:text-orange-600"
                >
                  {header.phoneDisplay}
                </a>
                <span className="flex items-center justify-end gap-1 text-xs text-green-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                  {header.statusText}
                </span>
              </div>
              <Link to={createPageUrl(header.quoteButtonPage || 'Price')}>
                <button className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-700 active:scale-95">
                  {header.quoteButtonLabel}
                </button>
              </Link>
            </div>

            <button
              aria-label="Открыть мобильное меню"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="shrink-0 p-2 text-slate-700 xl:hidden"
            >
              {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            role="navigation"
            aria-label="Мобильное меню"
            className="absolute left-0 top-full z-50 flex max-h-[80vh] w-full flex-col gap-3 overflow-y-auto border-t border-slate-100 bg-white px-4 py-6 shadow-2xl xl:hidden"
          >
            {navigation.map((item) => (
              <Link
                key={`${item.href}-${item.name || item.label}-mobile`}
                to={createPageUrl(item.href)}
                onClick={() => setMobileMenuOpen(false)}
                className={`border-b border-slate-100 py-3 text-left text-base font-medium transition-colors ${
                  currentPageName === item.href
                    ? 'font-bold text-orange-600'
                    : 'text-slate-700 hover:text-orange-600'
                }`}
              >
                {item.name || item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
              <a href={header.phoneHref} className="text-center text-xl font-bold text-slate-900">
                {header.phoneDisplay}
              </a>
              <Link
                to={createPageUrl(header.quoteButtonPage || 'Price')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <button className="w-full rounded-lg bg-orange-600 px-6 py-3 font-bold text-white shadow-lg">
                  {header.quoteButtonLabel}
                </button>
              </Link>
              <div className="flex justify-center gap-3 pt-2">
                <a
                  href={contacts.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.7 8.03c-.128.568-.461.707-.933.441l-2.58-1.901-1.244 1.197c-.138.137-.253.253-.519.253l.186-2.631 4.795-4.332c.208-.185-.045-.288-.324-.103l-5.926 3.733-2.556-.801c-.555-.174-.567-.555.116-.822l9.996-3.852c.461-.171.866.11.715.822z" />
                  </svg>
                </a>
                <a
                  href={contacts.vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.1h-1.34c-.63 0-.82-.5-1.95-1.63-.98-.98-1.41-1.11-1.66-1.11-.34 0-.43.09-.43.52v1.48c0 .4-.13.64-1.17.64-1.71 0-3.61-1.04-4.94-2.97-2-2.89-2.55-5.06-2.55-5.5 0-.25.09-.49.52-.49h1.34c.39 0 .54.18.69.59.77 2.2 2.06 4.13 2.59 4.13.2 0 .29-.09.29-.59V8.68c-.06-.95-.56-1.03-.56-1.37 0-.2.17-.4.43-.4h2.11c.34 0 .47.19.47.57v3.07c0 .34.15.48.25.48.2 0 .36-.14.72-.5 1.1-1.24 1.89-3.16 1.89-3.16.1-.22.29-.43.67-.43h1.34c.4 0 .49.21.4.57-.15.71-1.61 3.01-1.61 3.01-.17.28-.24.4 0 .72.17.23.74.73 1.12 1.17.69.8 1.22 1.47 1.36 1.93.13.47-.08.71-.56.71z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="relative flex-grow">{children}</main>
      <FloatingChat />

      <footer className="mt-auto bg-slate-950 py-12 text-white">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={logo}
                alt={`${brand.shortName} логотип`}
                width="200"
                height="149"
                loading="lazy"
                decoding="async"
                className="h-auto w-16 object-contain"
              />
              <div>
                <div className="text-xl font-bold text-white">{brand.shortName}</div>
                <div className="text-sm text-slate-400">{brand.fullName}</div>
              </div>
            </div>
            <p className="max-w-sm text-sm text-slate-500">{brand.footerDescription}</p>
          </div>

          <div>
            <h4 className="mb-4 font-bold">{footer.sectionsTitle}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {footerSections.map((item) => (
                <li key={`${item.href}-${item.label}-footer`}>
                  <Link to={createPageUrl(item.href)} className="hover:text-orange-500">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold">{footer.documentsTitle}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {footerDocuments.map((item) => (
                <li key={`${item.href}-${item.label}-docs`}>
                  <Link to={createPageUrl(item.href)} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 px-4 pt-8 text-center text-xs text-slate-600">
          {footer.copyright}
        </div>
      </footer>
    </div>
  );
}
