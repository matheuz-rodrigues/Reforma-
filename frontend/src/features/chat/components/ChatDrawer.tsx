'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Send, MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { useChatContext } from '../contexts/chat-context';
import { useAuthContext } from '@/features/auth/contexts/auth-context';

export function ChatDrawer() {
    const { activeConversation, messages, sendMessage, closeChat, isConnected } = useChatContext();
    const { user } = useAuthContext();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!activeConversation) return null;

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;
        sendMessage(text);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col w-80 sm:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                        {activeConversation.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-tight">{activeConversation.userName}</p>
                        <div className="flex items-center gap-1">
                            {isConnected
                                ? <Wifi className="h-3 w-3 text-green-300" />
                                : <WifiOff className="h-3 w-3 text-red-300" />}
                            <span className="text-[10px] text-white/70">{isConnected ? 'conectado' : 'desconectado'}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={closeChat}
                    className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                        <MessageCircle className="h-10 w-10 text-primary/30" />
                        <p className="text-sm">Nenhuma mensagem ainda.<br />Inicie a conversa!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId === user?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${isMine
                                        ? 'bg-primary text-white rounded-br-sm'
                                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                                        }`}
                                >
                                    <p className="leading-relaxed">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t bg-white">
                <input
                    type="text"
                    className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Digite uma mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-all"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
