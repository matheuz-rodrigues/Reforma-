'use client';

import { useAuthContext } from '@/features/auth/contexts/auth-context';
import { ChatProvider } from '@/features/chat/contexts/chat-context';
import { ChatDrawer } from '@/features/chat/components/ChatDrawer';
import { ChatFAB } from '@/features/chat/components/ChatFAB';
import { ConversationList } from '@/features/chat/components/ConversationList';
import type { ReactNode } from 'react';

export function ChatWrapper({ children }: { children: ReactNode }) {
    const { user } = useAuthContext();
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    return (
        <ChatProvider token={token} currentUserId={user?.id ?? null}>
            {children}
            <ChatDrawer />
            <ConversationList />
            <ChatFAB />
        </ChatProvider>
    );
}
