import type { Metadata, Viewport } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({ variable: '--font-pixel', subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Arya's Birthday Adventure",
  description: 'A tiny pixel-art birthday adventure made especially for Arya.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffe5ef',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geistMono.variable}>{children}</body></html>;
}
