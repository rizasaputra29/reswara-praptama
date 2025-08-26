// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import VisitTracker from '@/components/VisitTracker';

const onest = Onest({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reswara Praptama - Konsultan Teknik Semarang | Jasa Konstruksi & Arsitektur Terpercaya',
  description: 'Konsultan teknik Semarang terbaik. Layanan lengkap konstruksi dan arsitektur dari perizinan hingga penyelesaian proyek. Konsultan sipil, dan perencanaan bangunan profesional di Semarang, Jawa Tengah.',
  keywords: [
    'konsultan teknik semarang',
    'konsultan sipil semarang',
    'jasa konstruksi semarang',
    'konsultan arsitektur semarang',
    'konsultan bangunan semarang',
    'perencanaan bangunan semarang',
    'jasa gambar teknik semarang',
    'konsultan struktur semarang',
    'konsultan perizinan semarang',
    'kontraktor semarang',
    'jasa desain bangunan semarang'
  ],
  authors: [{ name: 'Reswara Praptama' }],
  creator: 'Reswara Praptama',
  publisher: 'Reswara Praptama',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://reswarapraptama.com'), // Ganti dengan domain Anda
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Reswara Praptama - Konsultan Teknik Semarang Terpercaya',
    description: 'Konsultan teknik Semarang profesional. Layanan konstruksi, arsitektur, dan perizinan bangunan terlengkap di Semarang, Jawa Tengah.',
    url: 'https://reswarapraptama.com', // Ganti dengan domain Anda
    siteName: 'Reswara Praptama',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/images/logo-merah.svg',
        width: 800,
        height: 600,
        alt: 'Reswara Praptama - Konsultan Teknik Semarang',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo-merah.svg',
  },
  other: {
    'instagram:account': '@reswarapraptama',
    'social:instagram': 'https://instagram.com/reswarapraptama',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" dir="ltr">
      <head>
        {/* Google Site Verification - Manual Method */}
        <meta name="google-site-verification" content="vE9SkoVcQwaj9LJ8jYQGoL1wMRhlyS4yYMYgYUBgnpI" />
        
        {/* Geo Location untuk Local SEO Semarang */}
        <meta name="geo.region" content="ID-JT" />
        <meta name="geo.placename" content="Semarang" />
        <meta name="geo.position" content="-6.966667;110.416664" />
        <meta name="ICBM" content="-6.966667, 110.416664" />
        
        {/* Organization Schema untuk Branding (Tanpa Data Pribadi) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Reswara Praptama",
              "url": "https://reswarapraptama.com", // Ganti dengan domain Anda
              "logo": "https://reswarapraptama.com/images/logo-merah.svg", // Ganti dengan domain Anda
              "description": "Konsultan teknik terpercaya di Semarang untuk layanan konstruksi, arsitektur, dan perizinan bangunan",
              "areaServed": {
                "@type": "Place",
                "name": "Semarang, Jawa Tengah, Indonesia"
              },
              "serviceType": [
                "Konsultan Teknik",
                "Konsultan Sipil", 
                "Konsultan Arsitektur",
                "Jasa Konstruksi",
                "Perencanaan Bangunan",
                "Perizinan Bangunan"
              ],
              "sameAs": [
                "https://instagram.com/reswarapraptama"
              ]
            })
          }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Reswara Praptama - Konsultan Teknik Semarang",
              "url": "https://reswarapraptama.com", // Ganti dengan domain Anda
              "description": "Konsultan teknik Semarang profesional untuk layanan konstruksi dan arsitektur",
              "inLanguage": "id-ID",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://reswarapraptama.com/search?q={search_term_string}" // Opsional
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={onest.className}>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}