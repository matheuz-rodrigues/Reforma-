'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
    User,
    MapPin,
    Star,
    Award,
    TrendingUp,
    ShoppingBag,
    Package,
    Settings,
    Bell,
    Shield,
    CreditCard,
} from 'lucide-react';

const userStats = [
    { label: 'Materiais Vendidos', value: '18', icon: ShoppingBag, color: 'text-green-600' },
    { label: 'Materiais Comprados', value: '12', icon: Package, color: 'text-blue-600' },
    { label: 'Avaliação Média', value: '4.8', icon: Star, color: 'text-yellow-600' },
    { label: 'Economia Total', value: 'R$ 4.850', icon: TrendingUp, color: 'text-primary' },
];

const achievements = [
    { title: 'Primeiro Anúncio', description: 'Publicou seu primeiro material', icon: Package, earned: true },
    { title: 'Vendedor Bronze', description: 'Vendeu 10 materiais', icon: Award, earned: true },
    { title: 'Economizador', description: 'Economizou mais de R$ 3.000', icon: TrendingUp, earned: true },
    { title: 'Vendedor Prata', description: 'Vendeu 25 materiais', icon: Award, earned: false },
    { title: 'Sustentável', description: 'Reaproveitou 50+ itens', icon: Shield, earned: false },
    { title: '5 Estrelas', description: 'Manteve avaliação 5.0', icon: Star, earned: false },
];

const recentReviews = [
    { buyer: 'Maria Silva', rating: 5, comment: 'Excelente vendedor! Material em perfeito estado.', item: 'Cerâmica 60x60', date: 'Há 3 dias' },
    { buyer: 'João Santos', rating: 5, comment: 'Entrega rápida e produto conforme descrito.', item: 'Tinta acrílica', date: 'Há 1 semana' },
    { buyer: 'Ana Costa', rating: 4, comment: 'Bom negócio, material de qualidade.', item: 'Piso laminado', date: 'Há 2 semanas' },
];

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Perfil</h1>
                    <p className="text-muted-foreground mt-1">Gerencie suas informações e configurações</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarFallback className="bg-primary text-white text-2xl">JS</AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-xl">João Silva</h3>
                                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            São Paulo, SP
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-semibold">4.8</span>
                                    </div>

                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                        <Award className="mr-1 h-3 w-3" />
                                        Vendedor Bronze
                                    </Badge>

                                    <Button className="w-full">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Editar Perfil
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Estatísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {userStats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center ${stat.color}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className="text-sm text-muted-foreground">{stat.label}</span>
                                            </div>
                                            <span className="font-bold">{stat.value}</span>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Progress to Next Level */}
                        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/80 text-sm">Próximo nível</span>
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">Vendedor Prata</p>
                                    <p className="text-white/80 text-sm mt-1">7 vendas restantes</p>
                                </div>
                                <Progress value={72} className="h-2 bg-white/20" />
                                <p className="text-xs text-white/80">Mantenha o bom trabalho! Você está quase lá.</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="info">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="info">Informações</TabsTrigger>
                                <TabsTrigger value="achievements">Conquistas</TabsTrigger>
                                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                                <TabsTrigger value="settings">Configurações</TabsTrigger>
                            </TabsList>

                            {/* Info Tab */}
                            <TabsContent value="info" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informações Pessoais</CardTitle>
                                        <CardDescription>Atualize seus dados de cadastro</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nome completo</Label>
                                                <Input id="name" defaultValue="João Silva" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" defaultValue="joao.silva@email.com" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Telefone</Label>
                                                <Input id="phone" defaultValue="(11) 98765-4321" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cpf">CPF</Label>
                                                <Input id="cpf" defaultValue="123.456.789-00" />
                                            </div>
                                        </div>
                                        <Button>Salvar Alterações</Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Endereço</CardTitle>
                                        <CardDescription>Informações de localização</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="cep">CEP</Label>
                                                <Input id="cep" defaultValue="01234-567" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">Cidade</Label>
                                                <Input id="city" defaultValue="São Paulo" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="address">Endereço</Label>
                                                <Input id="address" defaultValue="Rua das Flores, 123" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="neighborhood">Bairro</Label>
                                                <Input id="neighborhood" defaultValue="Centro" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">Estado</Label>
                                                <Input id="state" defaultValue="SP" />
                                            </div>
                                        </div>
                                        <Button>Salvar Endereço</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Achievements Tab */}
                            <TabsContent value="achievements" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Conquistas</CardTitle>
                                        <CardDescription>Desbloqueie conquistas vendendo e comprando materiais</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {achievements.map((achievement, index) => {
                                                const Icon = achievement.icon;
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-4 rounded-lg border-2 transition-all ${achievement.earned
                                                                ? 'bg-primary/5 border-primary'
                                                                : 'bg-gray-50 border-gray-200 opacity-60'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'
                                                                }`}>
                                                                <Icon className="h-6 w-6" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                                                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                                                {achievement.earned && (
                                                                    <Badge className="mt-2" variant="secondary">
                                                                        <Award className="mr-1 h-3 w-3" />
                                                                        Desbloqueado
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Reviews Tab */}
                            <TabsContent value="reviews" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Avaliações Recebidas</CardTitle>
                                        <CardDescription>Veja o que os compradores dizem sobre você</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentReviews.map((review, index) => (
                                                <div key={index} className="p-4 rounded-lg border">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                                                {review.buyer.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">{review.buyer}</p>
                                                                <p className="text-xs text-muted-foreground">{review.date}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                                                    <Badge variant="outline" className="text-xs">{review.item}</Badge>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 p-4 bg-accent rounded-lg text-center">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Você tem <span className="font-bold text-foreground">23 avaliações</span> no total
                                            </p>
                                            <Button variant="outline" size="sm">Ver Todas</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent value="settings" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5" />
                                            Notificações
                                        </CardTitle>
                                        <CardDescription>Gerencie suas preferências de notificação</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            { title: 'Novas mensagens', desc: 'Receba notificações de novas mensagens', checked: true },
                                            { title: 'Novos anúncios próximos', desc: 'Materiais disponíveis na sua região', checked: true },
                                            { title: 'Lembretes de orçamento', desc: 'Alertas sobre gastos da obra', checked: false },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={item.checked}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5" />
                                            Privacidade e Segurança
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button variant="outline" className="w-full justify-start">Alterar senha</Button>
                                        <Button variant="outline" className="w-full justify-start">Autenticação em duas etapas</Button>
                                        <Button variant="outline" className="w-full justify-start">Gerenciar dispositivos conectados</Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Pagamento
                                        </CardTitle>
                                        <CardDescription>Métodos de pagamento e recebimento</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button variant="outline" className="w-full justify-start">Adicionar cartão de crédito</Button>
                                        <Button variant="outline" className="w-full justify-start">Configurar conta bancária</Button>
                                        <Button variant="outline" className="w-full justify-start">Ver histórico de transações</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
