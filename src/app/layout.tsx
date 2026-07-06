import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anahtar Radar',
  description: 'Anahtar Creative için satış istihbarat ve CRM MVP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
