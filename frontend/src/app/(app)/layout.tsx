'use client';

import { Navigation } from '@/shared/components/navigation';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navigation />
            {children}
        </>
    );
}
