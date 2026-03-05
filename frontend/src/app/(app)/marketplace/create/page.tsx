import { CreateAdvertisementForm } from '@/features/marketplace/components/create-advertisement-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateAdvertisementPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Link
                        href="/marketplace"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o Marketplace
                    </Link>
                </div>

                <CreateAdvertisementForm />
            </div>
        </div>
    );
}
