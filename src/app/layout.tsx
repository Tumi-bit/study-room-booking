import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navigation from '@/components/Navigation';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Studienraum-Buchungssystem',
  description: 'Online-Buchungssystem für Studienräume',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}