import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <h2 className="text-3xl font-bold">Página não encontrada</h2>
                    <p className="text-muted-foreground">
                        Desculpe, a página que você está procurando não existe ou foi movida.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/login">
                        <Button size="lg" className="w-full sm:w-auto">
                            <Home className="mr-2 h-4 w-4" />
                            Ir para Login
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
