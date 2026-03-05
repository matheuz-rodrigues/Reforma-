'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { marketplaceService, Advertisement } from '@/features/marketplace/services/marketplace.service';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ArrowLeft, MapPin, Tag, Package, Calendar, Share2, Heart, MessageCircle, Trash2 } from 'lucide-react';
import env from '@/infra/config/env';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdvertisementDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        async function loadAdvertisement() {
            try {
                const data = await marketplaceService.getAdvertisementById(id as string);
                setAdvertisement(data);
            } catch (error) {
                console.error('Error loading advertisement:', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (id) {
            loadAdvertisement();
        }
    }, [id]);

    async function executeDelete() {
        setIsDeleting(true);
        try {
            await marketplaceService.deleteAdvertisement(id as string);
            toast('Anúncio apagado com sucesso!', {
                style: {
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                },
            });
            router.push('/marketplace');
        } catch (error) {
            console.error('Falha ao apagar anúncio:', error);
            toast.error('Não foi possível apagar o anúncio. Tente novamente mais tarde.');
        } finally {
            setIsDeleting(false);
        }
    }

    function handleDelete() {
        toast('Tem certeza que deseja apagar este anúncio?', {
            description: 'Esta ação não pode ser desfeita.',
            action: {
                label: 'Apagar',
                onClick: () => executeDelete(),
            },
            actionButtonStyle: {
                backgroundColor: '#ef4444',
                color: 'white',
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => console.log('Cancelado'),
            },
        });
    }

    async function handleShare() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copiado para a área de transferência!');
        } catch (error) {
            toast.error('Falha ao copiar o link.');
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!advertisement) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Anúncio não encontrado</h1>
                <Button onClick={() => router.push('/marketplace')}>Voltar ao Marketplace</Button>
            </div>
        );
    }

    const images = advertisement.images && advertisement.images.length > 0
        ? advertisement.images.map((img: string) => img.startsWith('http') ? img : `${env.API_URL}${img}`)
        : ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop'];

    const discount = advertisement.originalPrice
        ? Math.round((1 - advertisement.price / advertisement.originalPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/marketplace" className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o Marketplace
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleDelete} disabled={isDeleting}>
                            <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Images */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border shadow-sm relative group">
                            <img
                                src={images[activeImageIndex]}
                                alt={advertisement.title}
                                className="w-full h-full object-contain"
                            />
                            {discount > 0 && (
                                <Badge className="absolute top-4 left-4 bg-green-600 text-lg py-1 px-3">
                                    -{discount}%
                                </Badge>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {images.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="uppercase tracking-wider font-semibold">
                                    {advertisement.category}
                                </Badge>
                                <Badge className="bg-blue-600">
                                    {advertisement.condition === 'sobra' ? 'Sobra de Obra' : advertisement.condition}
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{advertisement.title}</h1>
                            <div className="flex items-center text-muted-foreground text-sm">
                                <MapPin className="h-4 w-4 mr-1" />
                                {advertisement.location || 'Localização não informada'}
                                <span className="mx-2 font-light">•</span>
                                <Calendar className="h-4 w-4 mr-1" />
                                Publicado em {new Date(advertisement.createdAt || '').toLocaleDateString('pt-BR')}
                            </div>
                        </div>

                        <Card className="border-none shadow-md bg-white">
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-black text-primary">R$ {advertisement.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        {advertisement.originalPrice && (
                                            <span className="text-lg text-muted-foreground line-through decoration-red-400">R$ {advertisement.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">À vista no PIX ou dinheiro</p>
                                </div>

                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Button size="lg" className="w-full h-14 text-lg font-bold">
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Falar com Vendedor
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full h-14 text-lg font-bold border-2">
                                        <Package className="mr-2 h-5 w-5" />
                                        Solicitar Entrega
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                Descrição do Produto
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                {advertisement.description}
                            </p>
                        </div>

                        <div className="pt-6 border-t">
                            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        M
                                    </div>
                                    <div>
                                        <p className="font-bold">Matheus Rodrigues</p>
                                        <p className="text-sm text-muted-foreground px">Vendedor verificado 5.0 ★ </p>
                                    </div>
                                </div>
                                <Button variant="link" className="font-bold">Ver Perfil</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
