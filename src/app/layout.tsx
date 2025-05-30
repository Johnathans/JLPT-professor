'use client';

import './globals.css';
import { Inter, Poppins, Noto_Sans_JP } from 'next/font/google';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '@/lib/theme';
import PublicLayout from '@/components/PublicLayout';
import { usePathname } from 'next/navigation';
import { JlptLevelProvider } from '@/contexts/JlptLevelContext';
import { StudySessionProvider } from '@/contexts/StudySessionContext';
import { ColorModeProvider } from '@/contexts/ThemeContext';
import { StudyProgressProvider } from '@/contexts/StudyProgressContext';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-poppins',
  display: 'swap'
});

const notoSansJP = Noto_Sans_JP({
  weight: ['900'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  preload: false,
  display: 'swap'
});

// Routes that should use custom layouts
const customLayoutRoutes = [
  '/dashboard',  // Dashboard has its own layout
  '/learn',      // Learn pages use dashboard layout
  '/decks'       // Decks pages use dashboard layout
];

// Public routes that should use PublicLayout
const publicRoutes = [
  '/',
  '/n1-kanji-list',
  '/n2-kanji-list',
  '/n3-kanji-list',
  '/n4-kanji-list',
  '/n5-kanji-list',
  '/n5-vocabulary',
  '/n5-verbs',
  '/n5-nouns',
  '/n5-adjectives',
  '/n5-stories',
  '/n5-listening',
  '/login',
  '/signup',
  '/study-guide'  // Added study guide to public routes
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // Check if current path matches exactly with any of our route patterns
  const matchRoute = (path: string, routes: string[]) => {
    return routes.some(route => {
      // Exact match or matches the start with a following slash
      return path === route || (path.startsWith(route) && path[route.length] === '/');
    });
  };

  const isCustomLayout = matchRoute(pathname || '', customLayoutRoutes);
  const isPublicRoute = !isCustomLayout && matchRoute(pathname || '', publicRoutes);

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${notoSansJP.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="DjXH6N1fV_93QxiTStPwWgYW0RE1gRffr1FZxjDqT4g" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark-mode');
              }
            } catch (e) {}
          })()
        `}} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B0MKGKNBV2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B0MKGKNBV2');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <ColorModeProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <JlptLevelProvider>
              <StudyProgressProvider>
                <StudySessionProvider>
                  {isCustomLayout ? (
                    children
                  ) : isPublicRoute ? (
                    <PublicLayout>{children}</PublicLayout>
                  ) : (
                    children
                  )}
                </StudySessionProvider>
              </StudyProgressProvider>
            </JlptLevelProvider>
          </ThemeProvider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
