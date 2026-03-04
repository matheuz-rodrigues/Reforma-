import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaInstallPrompt } from '@/shared/components/pwa-install-prompt';
import { AuthWrapper } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Reforma+',
    description: 'Plataforma digital para reaproveitamento de materiais de construção',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Reforma+',
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: '#FF6B00',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <head>
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            </head>
            <body>
                <AuthWrapper>
                    {children}
                </AuthWrapper>
                <PwaInstallPrompt />
            </body>
        </html>
    );
}

