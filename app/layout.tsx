// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import TransitionProvider from '@/components/TransitionProvider';
import VisitTracker from '@/components/VisitTracker';

const onest = Onest({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reswara Praptama - Construction & Architectural Services',
  description: 'Comprehensive construction and architectural services from permits to project completion',
  icons: {
    icon: '/images/logo-merah.svg', // Add this line
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={onest.className}>
        <TransitionProvider>
          <VisitTracker />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}