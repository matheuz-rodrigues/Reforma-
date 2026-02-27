'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // SW registration failed silently
            });
        }
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowBanner(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
    };

    if (isInstalled || !showBanner) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <div className="bg-white border-2 border-primary/20 rounded-xl shadow-2xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">R+</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Instalar Reforma+</p>
                    <p className="text-xs text-muted-foreground">Acesse rápido direto da sua tela inicial</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" onClick={handleInstall}>
                        <Download className="mr-1 h-3 w-3" />
                        Instalar
                    </Button>
                    <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground p-1">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
