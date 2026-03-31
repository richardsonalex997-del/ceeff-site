import { createPageUrl } from '@/utils';

const DEFAULT_SUBJECT = 'Заявка со страницы контактов';

export function buildContactPrefillUrl({
  subject = DEFAULT_SUBJECT,
  message = '',
  name = '',
  phone = '',
  email = '',
} = {}) {
  const params = new URLSearchParams();

  if (subject) {
    params.set('subject', subject);
  }

  if (message) {
    params.set('message', message);
  }

  if (name) {
    params.set('name', name);
  }

  if (phone) {
    params.set('phone', phone);
  }

  if (email) {
    params.set('email', email);
  }

  const search = params.toString();
  const contactsUrl = createPageUrl('Contacts');

  return search ? `${contactsUrl}?${search}` : contactsUrl;
}

export function getContactPrefillValuesFromSearch(search = '') {
  const params = new URLSearchParams(search);

  return {
    subject: params.get('subject') || DEFAULT_SUBJECT,
    name: params.get('name') || '',
    phone: params.get('phone') || '',
    email: params.get('email') || '',
    message: params.get('message') || '',
  };
}
