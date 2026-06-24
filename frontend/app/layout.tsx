import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo',
  description: 'Daily todo list',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        className="font-sans bg-app-bg text-text-main min-h-screen flex items-start justify-center px-4 pt-12 pb-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(103,43,224,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(103,43,224,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {children}
      </body>
    </html>
  );
}
