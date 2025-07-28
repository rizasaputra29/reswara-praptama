import './globals.css';
import type { Metadata } from 'next';
import { Onest } from 'next/font/google'; // Import Onest instead of Inter

// Initialize the Onest font with desired subsets and weights
// You can specify weights like ['400', '700'] if you don't need the full range
const onest = Onest({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechConstruct - Construction & Architectural Services',
  description: 'Comprehensive construction and architectural services from permits to project completion'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the Onest font's class name to the body */}
      <body className={onest.className}>{children}</body>
    </html>
  );
}
