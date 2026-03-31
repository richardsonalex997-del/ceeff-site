import React from 'react';
import * as helmetAsync from 'react-helmet-async';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

import TelegramContactForm from '@/components/TelegramContactForm';
import contactsContentFallback from '@/data/contactsContent';
import siteContentFallback from '@/data/siteContent';
import useRuntimeContent from '@/hooks/use-runtime-content';

const { Helmet } = helmetAsync.Helmet ? helmetAsync : helmetAsync.default;

export default function Contacts() {
  const contactsPage = useRuntimeContent('/data/contacts.json', contactsContentFallback);
  const siteContent = useRuntimeContent('/data/site.json', siteContentFallback);
  const siteContacts = siteContent?.contacts || siteContentFallback.contacts;
  const header = siteContent?.header || siteContentFallback.header;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{contactsPage.seoTitle || contactsContentFallback.seoTitle}</title>
        <meta
          name="description"
          content={contactsPage.seoDescription || contactsContentFallback.seoDescription}
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-12 text-center text-4xl font-bold">
          {contactsPage.pageTitle || contactsContentFallback.pageTitle}
        </h1>

        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
          <div className="grid lg:grid-cols-2">
            <div className="bg-slate-900 p-10 text-white lg:p-16">
              <h2 className="mb-8 text-3xl font-bold">
                {contactsPage.infoTitle || contactsContentFallback.infoTitle}
              </h2>
              <p className="mb-10 text-slate-400">
                {contactsPage.introText || contactsContentFallback.introText}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">
                      {contactsPage.phoneLabel || contactsContentFallback.phoneLabel}
                    </div>
                    <a
                      href={header.phoneHref}
                      className="text-xl font-bold transition-colors hover:text-orange-400"
                    >
                      {header.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">
                      {contactsPage.emailLabel || contactsContentFallback.emailLabel}
                    </div>
                    <a
                      href={`mailto:${siteContacts.email}`}
                      className="text-xl font-bold transition-colors hover:text-orange-400"
                    >
                      {siteContacts.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">
                      {contactsPage.addressLabel || contactsContentFallback.addressLabel}
                    </div>
                    <div className="text-lg">{siteContacts.address}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <div className="mb-4 text-sm text-slate-400">
                  {contactsPage.socialsLabel || contactsContentFallback.socialsLabel}
                </div>
                <div className="flex gap-3">
                  <a
                    href={siteContacts.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                    {contactsPage.telegramLabel || contactsContentFallback.telegramLabel}
                  </a>
                  <a
                    href={siteContacts.vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-800"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.1h-1.34c-.63 0-.82-.5-1.95-1.63-.98-.98-1.41-1.11-1.66-1.11-.34 0-.43.09-.43.52v1.48c0 .4-.13.64-1.17.64-1.71 0-3.61-1.04-4.94-2.97-2-2.89-2.55-5.06-2.55-5.5 0-.25.09-.49.52-.49h1.34c.39 0 .54.18.69.59.77 2.2 2.06 4.13 2.59 4.13.2 0 .29-.09.29-.59V8.68c-.06-.95-.56-1.03-.56-1.37 0-.2.17-.4.43-.4h2.11c.34 0 .47.19.47.57v3.07c0 .34.15.48.25.48.2 0 .36-.14.72-.5 1.1-1.24 1.89-3.16 1.89-3.16.1-.22.29-.43.67-.43h1.34c.4 0 .49.21.4.57-.15.71-1.61 3.01-1.61 3.01-.17.28-.24.4 0 .72.17.23.74.73 1.12 1.17.69.8 1.22 1.47 1.36 1.93.13.47-.08.71-.56.71z" />
                    </svg>
                    {contactsPage.vkLabel || contactsContentFallback.vkLabel}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-10 lg:p-16">
              <TelegramContactForm
                title={contactsPage.formTitle}
                successTitle={contactsPage.formSuccessTitle}
                successText={contactsPage.formSuccessText}
                submitLabel={contactsPage.formSubmitLabel}
                loadingLabel={contactsPage.formLoadingLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
