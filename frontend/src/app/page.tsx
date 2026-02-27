import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import {
    Calculator,
    ShoppingBag,
    TrendingDown,
    Recycle,
    Users,
    CheckCircle,
    ArrowRight,
    BarChart3,
    MapPin,
} from 'lucide-react';

const features = [
    { icon: Calculator, title: 'Calculadora de Materiais', description: 'Estime com precisão a quantidade de insumos necessários para sua obra' },
    { icon: ShoppingBag, title: 'Marketplace de Sobras', description: 'Compre e venda materiais excedentes com segurança e praticidade' },
    { icon: BarChart3, title: 'Dashboard Completo', description: 'Visualize métricas importantes e acompanhe o progresso da sua obra' },
    { icon: TrendingDown, title: 'Redução de Custos', description: 'Economize até 40% comprando materiais reaproveitáveis' },
    { icon: Recycle, title: 'Sustentabilidade', description: 'Contribua para redução de desperdício na construção civil' },
    { icon: MapPin, title: 'Geolocalização', description: 'Encontre materiais disponíveis perto de você' },
];

const benefits = [
    'Zero desperdício de materiais',
    'Economia de até 40% nos custos',
    'Processo 100% digital e seguro',
    'Suporte especializado',
    'Comunidade ativa de construtores',
    'Dicas e tutoriais gratuitos',
];

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent">
                {/* Header */}
                <header className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">R+</span>
                            </div>
                            <span className="text-2xl font-bold text-primary">Reforma+</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="lg">Entrar</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" className="group">
                                    Cadastrar
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-block">
                                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm">
                                    Plataforma #1 para Pequenas Obras
                                </span>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                Transforme sobras em{' '}
                                <span className="text-primary">economia</span>
                            </h1>

                            <p className="text-lg text-muted-foreground max-w-xl">
                                A plataforma completa para quem constrói ou reforma.
                                Calcule, planeje, compre e venda materiais de forma inteligente.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="w-full sm:w-auto group">
                                        Começar Agora
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/marketplace">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                        Ver Marketplace
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-primary">15K+</p>
                                    <p className="text-sm text-muted-foreground">Usuários ativos</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">40%</p>
                                    <p className="text-sm text-muted-foreground">Economia média</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">25K+</p>
                                    <p className="text-sm text-muted-foreground">Materiais vendidos</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1646592491550-6ef7a11ecc58?w=1080&h=500&fit=crop"
                                    alt="Renovação de casa"
                                    className="w-full h-[500px] object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border">
                                <Users className="h-8 w-8 text-primary mb-2" />
                                <p className="font-bold">Comunidade Ativa</p>
                                <p className="text-sm text-muted-foreground">+500 materiais/mês</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Tudo que você precisa em um só lugar
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Ferramentas especializadas para obras de pequeno porte
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-accent/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="rounded-2xl overflow-hidden shadow-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1770823556202-2eba715a415b?w=1080&h=400&fit=crop"
                                alt="Materiais de construção"
                                className="w-full h-[400px] object-cover"
                            />
                        </div>

                        <div className="space-y-8">
                            <div>
                                <span className="text-primary font-semibold">Por que escolher Reforma+?</span>
                                <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">
                                    Benefícios exclusivos para sua obra
                                </h2>
                                <p className="text-muted-foreground">
                                    Desenvolvido especificamente para pessoas físicas, pequenas construtoras
                                    e profissionais autônomos da construção civil.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/register">
                                <Button size="lg" className="group">
                                    Começar Gratuitamente
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl lg:text-4xl font-bold">
                            Pronto para economizar e reduzir desperdícios?
                        </h2>
                        <p className="text-lg text-white/90">
                            Junte-se a milhares de construtores que já estão aproveitando os benefícios da Reforma+
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                    Criar Conta Grátis
                                </Button>
                            </Link>
                            <Link href="/marketplace">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-primary">
                                    Ver Marketplace
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                    <span className="text-white font-bold">R+</span>
                                </div>
                                <span className="font-bold text-lg">Reforma+</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Plataforma digital especializada em reaproveitamento de materiais para pequenas obras.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Produto</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
                                <li><Link href="/marketplace" className="hover:text-primary">Marketplace</Link></li>
                                <li><Link href="/calculator" className="hover:text-primary">Calculadora</Link></li>
                                <li><Link href="/planning" className="hover:text-primary">Planejamento</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary">Sobre nós</a></li>
                                <li><a href="#" className="hover:text-primary">Blog</a></li>
                                <li><a href="#" className="hover:text-primary">Contato</a></li>
                                <li><a href="#" className="hover:text-primary">Carreiras</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary">Privacidade</a></li>
                                <li><a href="#" className="hover:text-primary">Termos</a></li>
                                <li><a href="#" className="hover:text-primary">Cookies</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                        <p>© 2026 Reforma+. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
