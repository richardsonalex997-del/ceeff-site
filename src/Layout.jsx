import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';
import logo from './assets/logo.png';
const navigation = [
    { name: 'Главная', href: 'Home' },
    { name: 'О компании', href: 'About' },
    { name: 'Услуги', href: 'Services' },
    { name: 'Обслуживание', href: 'Maintenance' },
    { name: 'Цены', href: 'Price' },
    { name: 'Проекты', href: 'Projects' },
    { name: 'Контакты', href: 'Contacts' },
];

export default function Layout({ children, currentPageName }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Установка языка и запрет перевода
    useEffect(() => {
        document.documentElement.lang = 'ru';
        
        // 1. Добавляем класс 'notranslate' к тегу html или body, чтобы отключить переводчик Google
        document.body.classList.add('notranslate');
        
        // Очистка при размонтировании (не обязательно, но хороший тон)
        return () => document.body.classList.remove('notranslate');
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPageName]);

    useEffect(() => {
        // Add meta description if it doesn't exist
        if (!document.querySelector('meta[name="description"]')) {
            const metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            metaDescription.content = 'Профессиональные услуги электролаборатории и электромонтажа.';
            document.head.appendChild(metaDescription);
        }

        // 2. ВАЖНО: Добавляем мета-тег, запрещающий перевод Google
        // Это предотвратит появление панели "Перевести страницу?" и искажение текста
        if (!document.querySelector('meta[name="google"]')) {
            const metaNotranslate = document.createElement('meta');
            metaNotranslate.name = 'google';
            metaNotranslate.content = 'notranslate';
            document.head.appendChild(metaNotranslate);
        }

        // Google Site Verification
        if (!document.querySelector('meta[name="google-site-verification"]')) {
            const metaVerification = document.createElement('meta');
            metaVerification.name = 'google-site-verification';
            metaVerification.content = 'googled94aa22da8d8008d';
            document.head.appendChild(metaVerification);
        }

        // Google Analytics
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

        // Defer analytics script loading
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                const script = document.createElement('script');
                script.innerHTML = `(function(){
      var ENDPOINT='https://ai-ad3e7614.base44.app/functions/collect_analytics';
      var PROJECT='6970cc39fe7272d4c298b4e4';
      try{
        var data={
          project_id: PROJECT,
          event_type:'page_view',
          url: location.href,
          referrer: document.referrer || '',
          page_title: document.title,
          language: navigator.language,
          screen_w: screen.width,
          screen_h: screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        var sid = localStorage.getItem('b44_sid');
        if(!sid){ sid = Math.random().toString(36).slice(2); localStorage.setItem('b44_sid', sid); }
        data.session_id = sid;
        fetch('https://ipapi.co/json').then(r=>r.json()).then(g=>{
          data.country=g.country_name||''; data.city=g.city||'';
        }).catch(function(){}).finally(function(){
          fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(function(){});
        });
      }catch(e){}
    })();`;
                document.head.appendChild(script);
            });
        } else {
            setTimeout(() => {
                const script = document.createElement('script');
                script.innerHTML = `(function(){
      var ENDPOINT='https://ai-ad3e7614.base44.app/functions/collect_analytics';
      var PROJECT='6970cc39fe7272d4c298b4e4';
      try{
        var data={
          project_id: PROJECT,
          event_type:'page_view',
          url: location.href,
          referrer: document.referrer || '',
          page_title: document.title,
          language: navigator.language,
          screen_w: screen.width,
          screen_h: screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        var sid = localStorage.getItem('b44_sid');
        if(!sid){ sid = Math.random().toString(36).slice(2); localStorage.setItem('b44_sid', sid); }
        data.session_id = sid;
        fetch('https://ipapi.co/json').then(r=>r.json()).then(g=>{
          data.country=g.country_name||''; data.city=g.city||'';
        }).catch(function(){}).finally(function(){
          fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(function(){});
        });
      }catch(e){}
    })();`;
                document.head.appendChild(script);
            }, 2000);
        }
    }, []);

    // 3. Добавляем атрибут translate="no" в основной div
    return (
        <div className="flex flex-col min-h-screen notranslate" translate="no">
            {/* Header - Sticky */}
            {/* ... остальной код без изменений ... */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                 {/* Ваш код хедера остается таким же */}
                 <div className="w-full px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* ... */}
                        {/* Просто убедитесь, что остальной код JSX внутри return остался тем же */}
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
                        <img 
  src={logo} 
  alt="ЦЭФ Логотип"
  className="..." // здесь могут быть какие-то классы, их не трогайте
/>
                            <div className="leading-tight max-w-[200px]">
                                <div className="font-bold text-slate-900 uppercase tracking-wide text-xs">ЦЭФ</div>
                                <div className="text-[9px] text-slate-500 font-medium leading-tight">Лицензия №1428 Волжско-Окское управление РТН</div>
                            </div>
                        </Link>
                        {/* ... остальная навигация ... */}
                        <nav className="hidden xl:flex items-center gap-8 font-medium text-sm text-slate-600">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={createPageUrl(item.href)}
                                    className={`hover:text-orange-600 transition-colors ${
                                        currentPageName === item.href ? 'text-orange-600 font-bold' : ''
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        {/* ... Right side ... */}
                        <div className="hidden md:flex items-center gap-5">
                            {/* ... icons and button ... */}
                             <div className="flex items-center gap-3">
                                {/* Telegram/VK icons code... */}
                                 <a href="https://t.me/cefnn" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.7 8.03c-.128.568-.461.707-.933.441l-2.58-1.901-1.244 1.197c-.138.137-.253.253-.519.253l.186-2.631 4.795-4.332c.208-.185-.045-.288-.324-.103l-5.926 3.733-2.556-.801c-.555-.174-.567-.555.116-.822l9.996-3.852c.461-.171.866.11.715.822z"/></svg>
                                </a>
                                <a href="https://vk.com/cefnn" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center text-white transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.1h-1.34c-.63 0-.82-.5-1.95-1.63-.98-.98-1.41-1.11-1.66-1.11-.34 0-.43.09-.43.52v1.48c0 .4-.13.64-1.17.64-1.71 0-3.61-1.04-4.94-2.97-2-2.89-2.55-5.06-2.55-5.5 0-.25.09-.49.52-.49h1.34c.39 0 .54.18.69.59.77 2.2 2.06 4.13 2.59 4.13.2 0 .29-.09.29-.59V8.68c-.06-.95-.56-1.03-.56-1.37 0-.2.17-.4.43-.4h2.11c.34 0 .47.19.47.57v3.07c0 .34.15.48.25.48.2 0 .36-.14.72-.5 1.1-1.24 1.89-3.16 1.89-3.16.1-.22.29-.43.67-.43h1.34c.4 0 .49.21.4.57-.15.71-1.61 3.01-1.61 3.01-.17.28-.24.4 0 .72.17.23.74.73 1.12 1.17.69.8 1.22 1.47 1.36 1.93.13.47-.08.71-.56.71z"/></svg>
                                </a>
                            </div>
                            <div className="text-right">
                                <a href="tel:+79302460077" className="block font-bold text-slate-900 hover:text-orange-600 transition-colors">
                                    +7 (930) 246-00-77
                                </a>
                                <span className="text-xs text-green-600 flex justify-end items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Работаем 24/7
                                </span>
                            </div>
                            <Link to={createPageUrl('Price')}>
                                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                                    Расчет сметы
                                </button>
                            </Link>
                        </div>
                         {/* Mobile menu button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="xl:hidden p-2 text-slate-700"
                        >
                            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                 </div>

                 {/* Mobile menu logic remains same... */}
                 {mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl px-4 py-6 flex flex-col gap-3 z-50 xl:hidden max-h-[80vh] overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={createPageUrl(item.href)}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`py-3 text-base font-medium text-left border-b border-slate-100 transition-colors ${
                                    currentPageName === item.href 
                                        ? 'text-orange-600 font-bold' 
                                        : 'text-slate-700 hover:text-orange-600'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                         <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                            <a href="tel:+79302460077" className="text-center font-bold text-xl text-slate-900">
                                +7 (930) 246-00-77
                            </a>
                            <Link to={createPageUrl('Price')} onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                                    Расчет сметы
                                </button>
                            </Link>
                            <div className="flex justify-center gap-3 pt-2">
                                <a href="https://t.me/cefnn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.7 8.03c-.128.568-.461.707-.933.441l-2.58-1.901-1.244 1.197c-.138.137-.253.253-.519.253l.186-2.631 4.795-4.332c.208-.185-.045-.288-.324-.103l-5.926 3.733-2.556-.801c-.555-.174-.567-.555.116-.822l9.996-3.852c.461-.171.866.11.715.822z"/></svg>
                                </a>
                                <a href="https://vk.com/cefnn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.1h-1.34c-.63 0-.82-.5-1.95-1.63-.98-.98-1.41-1.11-1.66-1.11-.34 0-.43.09-.43.52v1.48c0 .4-.13.64-1.17.64-1.71 0-3.61-1.04-4.94-2.97-2-2.89-2.55-5.06-2.55-5.5 0-.25.09-.49.52-.49h1.34c.39 0 .54.18.69.59.77 2.2 2.06 4.13 2.59 4.13.2 0 .29-.09.29-.59V8.68c-.06-.95-.56-1.03-.56-1.37 0-.2.17-.4.43-.4h2.11c.34 0 .47.19.47.57v3.07c0 .34.15.48.25.48.2 0 .36-.14.72-.5 1.1-1.24 1.89-3.16 1.89-3.16.1-.22.29-.43.67-.43h1.34c.4 0 .49.21.4.57-.15.71-1.61 3.01-1.61 3.01-.17.28-.24.4 0 .72.17.23.74.73 1.12 1.17.69.8 1.22 1.47 1.36 1.93.13.47-.08.71-.56.71z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-grow relative">
                {children}
            </main>
            <footer className="bg-slate-950 text-white py-12 mt-auto">
  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="md:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={logo} 
          alt="ЦЭФ Логотип"
          className="w-16 h-16"
        />
                            <div>
                                <div className="font-bold text-xl text-white">ЦЭФ</div>
                                <div className="text-sm text-slate-400">Центр энергоэффективности</div>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm max-w-sm">
                            Центр Энергоэффективности. Профессиональные услуги электролаборатории и электромонтажа. Работаем по всей России с 2010 года.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Разделы</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to={createPageUrl('About')} className="hover:text-orange-500">О компании</Link></li>
                            <li><Link to={createPageUrl('Services')} className="hover:text-orange-500">Услуги</Link></li>
                            <li><Link to={createPageUrl('Blog')} className="hover:text-orange-500">Блог</Link></li>
                            <li><Link to={createPageUrl('Contacts')} className="hover:text-orange-500">Контакты</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Документы</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to={createPageUrl('Privacy')} className="hover:text-white">Политика конфиденциальности</Link></li>
                            <li><Link to={createPageUrl('Licenses')} className="hover:text-white">Скачать лицензии (Архив)</Link></li>
                        </ul>
                    </div>
               </div>
               <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-600">
                    © 2026 ООО «Центр Энергоэффективности». Все права защищены.
               </div>
            </footer>
        </div>
    );
}