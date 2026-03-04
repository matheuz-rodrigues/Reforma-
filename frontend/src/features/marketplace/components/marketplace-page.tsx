'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const listings = [
    {
        id: 1,
        title: 'Cerâmica Portobello 60x60cm',
        description: 'Sobra de obra, 15m² em perfeito estado',
        price: 450,
        originalPrice: 720,
        discount: 37,
        seller: 'João Silva',
        rating: 4.8,
        location: 'São Paulo, SP',
        distance: '2.5 km',
        category: 'Revestimentos',
        image: 'https://images.unsplash.com/photo-1770823556202-2eba715a415b?w=400&h=300&fit=crop',
        postedAt: 'Há 2 dias',
    },
    {
        id: 2,
        title: 'Tinta Acrílica Suvinil 18L',
        description: 'Branco neve, lata fechada',
        price: 320,
        originalPrice: 480,
        discount: 33,
        seller: 'Maria Costa',
        rating: 5.0,
        location: 'São Paulo, SP',
        distance: '4.1 km',
        category: 'Tintas',
        image: 'https://images.unsplash.com/photo-1763926062529-1edf8664c366?w=400&h=300&fit=crop',
        postedAt: 'Há 1 dia',
    },
    {
        id: 3,
        title: 'Piso Laminado Eucafloor',
        description: '20m² cor carvalho, nunca usado',
        price: 680,
        originalPrice: 1200,
        discount: 43,
        seller: 'Pedro Santos',
        rating: 4.6,
        location: 'São Paulo, SP',
        distance: '5.8 km',
        category: 'Pisos',
        image: 'https://images.unsplash.com/photo-1646592491550-6ef7a11ecc58?w=400&h=300&fit=crop',
        postedAt: 'Há 3 dias',
    },
    {
        id: 4,
        title: 'Cimento CP II - 10 Sacos',
        description: '50kg cada, armazenado corretamente',
        price: 280,
        originalPrice: 350,
        discount: 20,
        seller: 'Ana Paula',
        rating: 4.9,
        location: 'São Paulo, SP',
        distance: '3.2 km',
        category: 'Cimento',
        image: 'https://images.unsplash.com/photo-1770823556202-2eba715a415b?w=400&h=300&fit=crop',
        postedAt: 'Há 5 dias',
    },
    {
        id: 5,
        title: 'Janela PVC Branca 100x120cm',
        description: '2 folhas, com vidro e ferragens',
        price: 550,
        originalPrice: 890,
        discount: 38,
        seller: 'Carlos Mendes',
        rating: 4.7,
        location: 'São Paulo, SP',
        distance: '6.5 km',
        category: 'Esquadrias',
        image: 'https://images.unsplash.com/photo-1646592491550-6ef7a11ecc58?w=400&h=300&fit=crop',
        postedAt: 'Há 4 dias',
    },
    {
        id: 6,
        title: 'Telhas Cerâmicas Americana',
        description: '150 unidades, cor natural',
        price: 420,
        originalPrice: 600,
        discount: 30,
        seller: 'Roberto Lima',
        rating: 4.5,
        location: 'São Paulo, SP',
        distance: '7.3 km',
        category: 'Cobertura',
        image: 'https://images.unsplash.com/photo-1763926062529-1edf8664c366?w=400&h=300&fit=crop',
        postedAt: 'Há 1 semana',
    },
];

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, description: 'Visão geral da obra' },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag, description: 'Compra e venda' },
    { path: '/calculator', label: 'Calculadora', icon: Calculator, description: 'Cálculo de materiais' },
    { path: '/planning', label: 'Planejamento', icon: FileText, description: 'Gestão de tarefas' },
];

export default function MarketplacePage() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('all');

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
                        <Button variant="outline" size="lg" className="w-full h-full min-h-[56px]">
                            Minhas Compras
                        </Button>
                    </div>
                    <div className="md:col-span-3">
                        <Button size="lg" className="w-full h-full min-h-[56px] text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                            <Package className="mr-3 h-6 w-6" />
                            Anunciar Material
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Buscar materiais..." className="pl-10" />
                                </div>
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
                            <TabsTrigger value="all">Todos ({listings.length})</TabsTrigger>
                            <TabsTrigger value="nearby">Próximos</TabsTrigger>
                            <TabsTrigger value="deals">Melhores ofertas</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={listing.image}
                                                alt={listing.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <Badge className="absolute top-3 right-3 bg-green-600">
                                                -{listing.discount}%
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

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {listing.distance}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {listing.postedAt}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2 border-t">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                                    {listing.seller.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{listing.seller}</p>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs text-muted-foreground">{listing.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="grid grid-cols-2 gap-2">
                                            <Button variant="outline">
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                Mensagem
                                            </Button>
                                            <Button>Ver Detalhes</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center gap-2 mt-8">
                                <Button variant="outline" size="sm">Anterior</Button>
                                <Button variant="outline" size="sm">1</Button>
                                <Button size="sm">2</Button>
                                <Button variant="outline" size="sm">3</Button>
                                <Button variant="outline" size="sm">Próximo</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
