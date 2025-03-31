import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  ogType?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title,
  description,
  ogType = 'website',
  ogImage = '/images/og-image.jpg',
  canonicalUrl,
}: SEOProps) {
  // Ensure title has the site name
  const fullTitle = title.includes('JLPT Professor') 
    ? title 
    : `${title} | JLPT Professor`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
  );
}
