'use client';

import { Navigation } from '@/shared/components/navigation';
import { ProtectedRoute } from '@/features/auth';
import { ChatWrapper } from '@/features/chat/components/ChatWrapper';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <ChatWrapper>
                <Navigation />
                {children}
            </ChatWrapper>
        </ProtectedRoute>
    );
}

