import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Loader2, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getContactPrefillValuesFromSearch } from '@/lib/contact-prefill';
import { createPageUrl } from '@/utils';
import { submitContactRequest } from '@/utils/contactApi';

export default function TelegramContactForm({
  title = 'Оставить заявку',
  successTitle = 'Заявка отправлена!',
  successText = 'Мы свяжемся с вами в ближайшее время',
  submitLabel = 'Отправить заявку',
  loadingLabel = 'Отправка...',
}) {
  const location = useLocation();
  const prefillValues = useMemo(
    () => getContactPrefillValuesFromSearch(location.search),
    [location.search],
  );
  const [subject, setSubject] = useState(prefillValues.subject);
  const [formData, setFormData] = useState({
    name: prefillValues.name,
    phone: prefillValues.phone,
    email: prefillValues.email,
    message: prefillValues.message,
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSubject(prefillValues.subject);
    setFormData({
      name: prefillValues.name,
      phone: prefillValues.phone,
      email: prefillValues.email,
      message: prefillValues.message,
    });
    setStatus('idle');
    setErrorMessage('');
  }, [prefillValues]);

  const sendToTelegram = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await submitContactRequest({
        formType: 'contacts',
        subject,
        ...formData,
      });

      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Ошибка отправки. Попробуйте позже.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-slate-900">{successTitle}</h3>
        <p className="text-slate-600">{successText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h3 className="mb-6 text-2xl font-bold text-slate-900">{title}</h3>
      <form onSubmit={sendToTelegram} className="space-y-4">
        <Input
          placeholder="Ваше имя *"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          required
          disabled={status === 'loading'}
        />
        <Input
          type="tel"
          placeholder="Телефон *"
          value={formData.phone}
          onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
          required
          disabled={status === 'loading'}
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          disabled={status === 'loading'}
        />
        <Textarea
          placeholder="Ваше сообщение *"
          value={formData.message}
          onChange={(event) => setFormData({ ...formData, message: event.target.value })}
          required
          className="min-h-[120px]"
          disabled={status === 'loading'}
        />
        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingLabel}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
        <p className="text-center text-xs text-slate-500">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <Link
            to={createPageUrl('Privacy')}
            className="text-orange-600 underline hover:text-orange-700"
          >
            Политикой конфиденциальности
          </Link>
        </p>
        {status === 'error' && (
          <p className="text-center text-sm text-red-600">
            {errorMessage || 'Ошибка отправки. Попробуйте позже.'}
          </p>
        )}
      </form>
    </div>
  );
}
