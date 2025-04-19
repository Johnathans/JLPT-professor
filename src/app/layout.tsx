'use client';

import './globals.css';
import { Inter, Poppins, Noto_Sans_JP } from 'next/font/google';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '@/lib/theme';
import PwaLayout from '@/components/PwaLayout';
import PublicLayout from '@/components/PublicLayout';
import { usePathname } from 'next/navigation';
import { JlptLevelProvider } from '@/contexts/JlptLevelContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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

// Routes that should use the PWA layout
const pwaRoutes = [
  '/dashboard',
  '/learn',
  '/tests',
  '/profile',
  '/admin',
  '/decks',
  '/search',
  '/history'
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
  '/signup'
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // Check if current path starts with any of the PWA routes
  const isPwaRoute = pwaRoutes.some(route => pathname?.startsWith(route));
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${notoSansJP.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <JlptLevelProvider>
            {isPwaRoute ? (
              <PwaLayout>{children}</PwaLayout>
            ) : isPublicRoute ? (
              <PublicLayout>{children}</PublicLayout>
            ) : (
              <>{children}</>
            )}
          </JlptLevelProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
