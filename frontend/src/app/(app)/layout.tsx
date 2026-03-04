'use client';

import { Navigation } from '@/shared/components/navigation';
import { ProtectedRoute } from '@/features/auth';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <Navigation />
            {children}
        </ProtectedRoute>
    );
}
