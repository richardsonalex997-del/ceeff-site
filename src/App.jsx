import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import * as helmetAsync from 'react-helmet-async';

import { Toaster } from '@/components/ui/toaster';
import BlogArticlePage from '@/content-pages/BlogArticlePage';
import BlogArticlesPage from '@/content-pages/BlogArticlesPage';
import BlogNewsItemPage from '@/content-pages/BlogNewsItemPage';
import BlogNewsPage from '@/content-pages/BlogNewsPage';
import ProjectDetailPage from '@/content-pages/ProjectDetailPage';
import SeoHead from '@/components/SeoHead';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import NavigationTracker from '@/lib/NavigationTracker';
import PageNotFound from '@/lib/PageNotFound';
import {
  createBlogArticlesUrl,
  createBlogNewsUrl,
  createProjectUrl,
  normalizePathname,
} from '@/lib/paths';
import { queryClientInstance } from '@/lib/query-client';
import { staticPageRoutes } from '@/lib/static-pages';
import Layout from '@/Layout';

const { HelmetProvider } = helmetAsync.HelmetProvider ? helmetAsync : helmetAsync.default;

const LoadingState = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
  </div>
);

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;

function CanonicalPathRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const normalizedPathname = normalizePathname(location.pathname);

    if (normalizedPathname !== location.pathname) {
      navigate(`${normalizedPathname}${location.search}${location.hash}`, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
}

function AuthenticatedApp() {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <LoadingState />;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }

    if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <SeoHead />
      <CanonicalPathRedirect />
      <Routes>
        <Route path="/home" element={<Navigate replace to="/" />} />
        <Route
          path={createBlogArticlesUrl()}
          element={
            <LayoutWrapper currentPageName="Blog">
              <BlogArticlesPage />
            </LayoutWrapper>
          }
        />
        <Route
          path={`${createBlogArticlesUrl()}/:slug`}
          element={
            <LayoutWrapper currentPageName="Blog">
              <BlogArticlePage />
            </LayoutWrapper>
          }
        />
        <Route
          path={createBlogNewsUrl()}
          element={
            <LayoutWrapper currentPageName="Blog">
              <BlogNewsPage />
            </LayoutWrapper>
          }
        />
        <Route
          path={`${createBlogNewsUrl()}/:slug`}
          element={
            <LayoutWrapper currentPageName="Blog">
              <BlogNewsItemPage />
            </LayoutWrapper>
          }
        />
        <Route
          path={`${createProjectUrl(':slug')}`}
          element={
            <LayoutWrapper currentPageName="Projects">
              <ProjectDetailPage />
            </LayoutWrapper>
          }
        />
        {staticPageRoutes.map(({ pageName, path, Component }) => (
          <Route
            key={pageName}
            path={path}
            element={
              <LayoutWrapper currentPageName={pageName}>
                <Component />
              </LayoutWrapper>
            }
          />
        ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export function AppProviders({
  Router = BrowserRouter,
  routerProps = {},
  helmetContext,
  queryClient = queryClientInstance,
}) {
  return (
    <HelmetProvider context={helmetContext}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router {...routerProps}>
            <NavigationTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default function App() {
  return <AppProviders />;
}
