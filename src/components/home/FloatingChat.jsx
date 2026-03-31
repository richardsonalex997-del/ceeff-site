import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import siteContentFallback from '@/data/siteContent';
import useRuntimeContent from '@/hooks/use-runtime-content';
import { createPageUrl } from '@/utils';
import { submitContactRequest } from '@/utils/contactApi';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const siteContent = useRuntimeContent('/data/site.json', siteContentFallback);
  const brand = siteContent?.brand || siteContentFallback.brand;
  const header = siteContent?.header || siteContentFallback.header;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await submitContactRequest({
        formType: activeTab === 'chat' ? 'floating-chat' : 'callback',
        subject:
          activeTab === 'chat'
            ? 'Сообщение из плавающего чата'
            : 'Запрос обратного звонка',
        phone,
        message: activeTab === 'chat' ? message : 'Клиент запросил обратный звонок.',
      });

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        setPhone('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Не удалось отправить сообщение.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-2xl transition-transform hover:scale-110 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 ${
          isOpen ? 'hidden' : ''
        }`}
      >
        <MessageCircle className="h-6 w-6 text-white sm:h-7 sm:w-7" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-2 right-2 z-50 w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:w-[360px] sm:max-w-[calc(100vw-48px)]"
          >
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                    <span className="text-white font-bold">{brand.shortName}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{brand.fullName}</h3>
                    <div className="flex items-center gap-1 text-sm text-green-400">
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      {header.statusText}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 transition-colors hover:bg-white/10"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Написать
                </button>
                <button
                  onClick={() => setActiveTab('call')}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                    activeTab === 'call'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Перезвоните мне
                </button>
              </div>
            </div>

            <div className="p-4">
              {status === 'success' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Send className="h-8 w-8 text-green-500" />
                  </div>
                  <h4 className="mb-1 font-bold text-slate-900">Сообщение отправлено!</h4>
                  <p className="text-sm text-slate-500">Мы ответим в ближайшее время</p>
                </motion.div>
              ) : activeTab === 'chat' ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    Привет! Задайте вопрос или опишите вашу задачу, и мы ответим в ближайшее
                    время.
                  </div>
                  <Textarea
                    placeholder="Ваше сообщение..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="min-h-[100px] resize-none"
                    required
                    disabled={status === 'loading'}
                  />
                  <Input
                    placeholder="Ваш телефон для связи"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    disabled={status === 'loading'}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={status === 'loading'}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {status === 'loading' ? 'Отправляем...' : 'Отправить'}
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
                    <p className="text-center text-xs text-red-600">
                      {errorMessage || 'Не удалось отправить сообщение.'}
                    </p>
                  )}
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    Оставьте номер, и мы перезвоним в течение 5 минут в рабочее время (8:00 - 20:00).
                  </div>
                  <Input
                    placeholder="Ваш телефон"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-12 text-lg"
                    required
                    disabled={status === 'loading'}
                  />
                  <Button
                    type="submit"
                    className="h-12 w-full bg-orange-500 hover:bg-orange-600"
                    disabled={status === 'loading'}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {status === 'loading' ? 'Отправляем...' : 'Жду звонка'}
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
                    <p className="text-center text-xs text-red-600">
                      {errorMessage || 'Не удалось отправить сообщение.'}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="border-t px-4 pb-4 pt-2">
              <p className="mb-2 text-xs text-slate-500">Или свяжитесь напрямую:</p>
              <div className="flex gap-2">
                <a
                  href={header.phoneHref}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <Phone className="h-4 w-4" />
                  Позвонить
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
