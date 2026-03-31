/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import React from 'react';
const About = React.lazy(() => import('./pages/About'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Consulting = React.lazy(() => import('./pages/Consulting'));
const Contacts = React.lazy(() => import('./pages/Contacts'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Home = React.lazy(() => import('./pages/Home'));
const Licenses = React.lazy(() => import('./pages/Licenses'));
const Maintenance = React.lazy(() => import('./pages/Maintenance'));
const Price = React.lazy(() => import('./pages/Price'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Reviews = React.lazy(() => import('./pages/Reviews'));
const Services = React.lazy(() => import('./pages/Services'));
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Blog": Blog,
    "Consulting": Consulting,
    "Contacts": Contacts,
    "FAQ": FAQ,
    "Home": Home,
    "Licenses": Licenses,
    "Maintenance": Maintenance,
    "Price": Price,
    "Privacy": Privacy,
    "Projects": Projects,
    "Reviews": Reviews,
    "Services": Services,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};