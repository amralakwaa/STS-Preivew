import type { Metadata, Viewport } from 'next';
import './globals.css';
import { kufiAr, kufiLa, plexAr, plexLa } from './fonts';

export const metadata: Metadata = {
  title: 'STS — أنظمة أمنية وتقنيات ذكية',
  description: 'نصمم أنظمة المراقبة والتحكم في الدخول وإنذار الحريق ومراكز البيانات، ونركّبها ونصونها للمنشآت في المملكة.',
};
export const viewport: Viewport = { themeColor: '#0C1626' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${plexAr.variable} ${plexLa.variable} ${kufiAr.variable} ${kufiLa.variable}`}>

      <body>{children}</body>
    </html>
  );
}
