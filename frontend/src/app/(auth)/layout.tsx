import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reforma+ | Login',
    description: 'Acesse sua conta Reforma+',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
