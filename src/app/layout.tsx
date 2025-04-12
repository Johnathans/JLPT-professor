'use client';

import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider, AppBar, Container, Toolbar, Typography } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { theme } from '@/lib/theme';
import Layout from '@/components/Layout';
import Script from 'next/script';
import styles from './page.module.css'
import Logo from '@/components/Logo'
import { useEffect } from 'react'
import { metadata } from './metadata'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <Head>
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
      </Head>
      <body suppressHydrationWarning>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <JlptLevelProvider>
            <Layout>
              {children}
            </Layout>
          </JlptLevelProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
