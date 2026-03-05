'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import {
    Search,
    MapPin,
    Filter,
    Star,
    Heart,
    MessageCircle,
    Package,
    Clock,
    Home,
    ShoppingBag,
    Calculator,
    FileText,
    User,
    ArrowRight,
    Navigation,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { marketplaceService, Advertisement } from '../services/marketplace.service';
import env from '@/infra/config/env';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, description: 'Visão geral da obra' },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag, description: 'Compra e venda' },
    { path: '/calculator', label: 'Calculadora', icon: Calculator, description: 'Cálculo de materiais' },
    { path: '/planning', label: 'Planejamento', icon: FileText, description: 'Gestão de tarefas' },
];

export default function MarketplacePage() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('all');
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationInput, setLocationInput] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleSearchLocation = async () => {
        if (!locationInput || locationInput.trim().length < 3) {
            alert('Digite o nome da sua cidade ou bairro para calcular distâncias.');
            return;
        }

        setIsGettingLocation(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationInput)}&format=json&limit=5`);
            const data = await response.json();

            if (data && data.length > 0) {
                setLocationSuggestions(data);
            } else {
                alert('Localização não encontrada. Tente digitar de outra forma (ex: Nome do Bairro, Cidade).');
                setLocationSuggestions([]);
            }
        } catch (error) {
            console.error('Erro ao buscar localização:', error);
            alert('Erro ao buscar a localização. Tente novamente mais tarde.');
            setLocationSuggestions([]);
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handleSelectLocation = (result: any) => {
        setUserLocation({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
        setLocationInput(result.display_name.split(',').slice(0, 2).join(', '));
        setLocationSuggestions([]);
    };

    const fetchAdvertisements = async () => {
        setIsLoading(true);
        try {
            const { data, total } = await marketplaceService.getAdvertisements({ page: currentPage, limit: itemsPerPage });
            setAdvertisements(data);
            setTotalPages(Math.ceil(total / itemsPerPage));
        } catch (error) {
            console.error('Failed to fetch advertisements:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements();
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-gray-50 pt-2 pb-8">
            <div className="container mx-auto px-4 space-y-4">
                {/* Interactive Navigation Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path} className="h-full">
                                <Card className={`group relative h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/20'
                                    }`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${isActive ? 'from-primary/10 via-primary/5 to-transparent opacity-100' : 'from-primary/5 to-transparent opacity-0 group-hover:opacity-100'
                                        }`} />
                                    <CardContent className="p-4 flex flex-col items-center text-center relative z-10">
                                        <div className={`mb-3 p-3 rounded-xl transition-colors duration-300 ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                                            }`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className={`font-bold text-sm md:text-base mb-1 ${isActive ? 'text-primary' : 'text-foreground'
                                            }`}>{item.label}</h3>
                                        <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 transition-opacity">
                                            {item.description}
                                        </p>
                                    </CardContent>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                                    )}
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
                        <p className="text-muted-foreground mt-1">Economize até 40% comprando materiais reaproveitáveis</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <Button variant="outline" size="lg" className="w-full h-full min-h-[56px] text-lg font-bold">
                            <ShoppingBag className="mr-3 h-6 w-6" />
                            Meu Carrinho
                        </Button>
                    </div>
                    <div className="md:col-span-3">
                        <Link href="/marketplace/create" className="block w-full h-full">
                            <Button size="lg" className="w-full h-full min-h-[56px] text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                                <Package className="mr-3 h-6 w-6" />
                                Anunciar Material
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Buscar materiais..." className="pl-10" />
                                </div>
                                <div className="relative flex-1 hidden sm:block">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Sua cidade (ex: São Paulo)"
                                        className="pl-10"
                                        value={locationInput}
                                        onChange={(e) => {
                                            setLocationInput(e.target.value);
                                            if (locationSuggestions.length > 0) setLocationSuggestions([]);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSearchLocation();
                                            }
                                        }}
                                    />
                                    {locationSuggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                            {locationSuggestions.map((item: any, index: number) => (
                                                <button
                                                    key={index}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors border-b last:border-b-0"
                                                    onClick={() => handleSelectLocation(item)}
                                                >
                                                    {item.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant={userLocation ? "default" : "outline"}
                                    onClick={handleSearchLocation}
                                    disabled={isGettingLocation || !locationInput}
                                    title="Buscar minha localização aproximada"
                                    className="px-3"
                                >
                                    {isGettingLocation ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className={`h-4 w-4 ${userLocation ? 'text-white' : ''}`} />
                                    )}
                                </Button>
                            </div>

                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas Categorias</SelectItem>
                                    <SelectItem value="revestimentos">Revestimentos</SelectItem>
                                    <SelectItem value="tintas">Tintas</SelectItem>
                                    <SelectItem value="pisos">Pisos</SelectItem>
                                    <SelectItem value="cimento">Cimento/Argamassa</SelectItem>
                                    <SelectItem value="esquadrias">Esquadrias</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="distance">
                                <SelectTrigger>
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="distance">Mais próximo</SelectItem>
                                    <SelectItem value="price-low">Menor preço</SelectItem>
                                    <SelectItem value="price-high">Maior preço</SelectItem>
                                    <SelectItem value="recent">Mais recente</SelectItem>
                                    <SelectItem value="discount">Maior desconto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                                <MapPin className="mr-1 h-3 w-3" />
                                Até 10km
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                                <Filter className="mr-1 h-3 w-3" />
                                Desconto +30%
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                                <Star className="mr-1 h-3 w-3" />
                                Vendedores 5★
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                                Entrega disponível
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Listings */}
                <div className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">Todos ({advertisements.length})</TabsTrigger>
                            <TabsTrigger value="nearby">Próximos</TabsTrigger>
                            <TabsTrigger value="deals">Melhores ofertas</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-6">
                            {isLoading ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <Card key={i} className="h-[400px] animate-pulse bg-gray-200" />
                                    ))}
                                </div>
                            ) : advertisements.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Nenhum anúncio encontrado.
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {advertisements.map((listing) => (
                                        <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={listing.images?.[0]
                                                        ? (listing.images[0].startsWith('http') ? listing.images[0] : `${env.API_URL}${listing.images[0]}`)
                                                        : 'https://images.unsplash.com/photo-1504307651254-35680f356f58?w=400&h=300&fit=crop'}
                                                    alt={listing.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <Badge className="absolute top-3 right-3 bg-green-600">
                                                    -{listing.originalPrice ? Math.round((1 - listing.price / listing.originalPrice) * 100) : 0}%
                                                </Badge>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="absolute top-3 left-3 h-8 w-8"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <CardHeader>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {listing.description}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline">{listing.category}</Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="space-y-4">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-primary">
                                                        R$ {listing.price}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        R$ {listing.originalPrice}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {listing.location || 'Localização não informada'}
                                                    </div>
                                                    {userLocation && listing.latitude && listing.longitude && (
                                                        <div className="flex items-center gap-1 text-primary font-medium text-xs bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                                                            <Navigation className="h-3 w-3" />
                                                            A {calculateDistance(userLocation.lat, userLocation.lng, listing.latitude, listing.longitude).toFixed(1)} km de você
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {new Date(listing.createdAt || Date.now()).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2 border-t">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                                        {listing.sellerName?.charAt(0).toUpperCase() || 'V'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{listing.sellerName || 'Vendedor'}</p>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-xs text-muted-foreground">4.8</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <div className="p-6 pt-0 flex gap-2">
                                                <Link href={`/marketplace/${listing.id}`} className="flex-1">
                                                    <Button className="w-full">
                                                        Ver Detalhes
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="icon">
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center flex-wrap gap-2 mt-8">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </Button>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <Button
                                            key={i}
                                            variant={currentPage === i + 1 ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próximo
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
