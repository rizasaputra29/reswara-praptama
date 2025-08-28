// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import VisitTracker from '@/components/VisitTracker';

const onest = Onest({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reswara Praptama - Konsultan Teknik Semarang',
  description: 'Konsultan teknik Semarang terbaik. Layanan lengkap konstruksi dan arsitektur dari perizinan hingga penyelesaian proyek.',
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
  metadataBase: new URL('https://reswarapraptama.com/'),
  alternates: {
    canonical: 'https://reswarapraptama.com/',
  },
  openGraph: {
    title: 'Reswara Praptama - Konsultan Teknik Semarang Terpercaya',
    description: 'Konsultan teknik Semarang profesional. Layanan konstruksi, arsitektur, dan perizinan bangunan terlengkap di Semarang, Jawa Tengah.',
    url: 'https://reswarapraptama.com/',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" dir="ltr">
      <head>
        <meta name="google-site-verification" content="vE9SkoVcQwaj9LJ8jYQGoL1wMRhlyS4yYMYgYUBgnpI" />
        <meta name="geo.region" content="ID-JT" />
        <meta name="geo.placename" content="Semarang" />
        <meta name="geo.position" content="-6.966667;110.416664" />
        <meta name="ICBM" content="-6.966667, 110.416664" />
      </head>
      <body className={onest.className}>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}