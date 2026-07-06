import type { Metadata } from 'next';
import './globals.css';
import { AuthGate } from '@/components/AuthGate';

export const metadata: Metadata = {
  title: 'Anahtar Radar',
  description: 'Anahtar Creative için satış istihbarat ve CRM MVP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body><AuthGate>{children}</AuthGate></body>
    </html>
  );
}
