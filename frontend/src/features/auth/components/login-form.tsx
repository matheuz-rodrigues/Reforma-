'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuth } from '../hooks/use-auth';

export default function LoginForm() {
    const { login, isLoading, error, setError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Preencha todos os campos');
            return;
        }

        try {
            await login({ email, password });
            // TODO: redirect após login
        } catch {
            // error is handled by useAuth
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                            <span className="text-white text-3xl font-bold">R+</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Bem-vindo de volta!
                    </h1>
                    <p className="text-muted-foreground">
                        Entre para acessar sua conta
                    </p>
                </div>

                {/* Login Card */}
                <Card className="border-2 shadow-xl">
                    <CardHeader className="flex flex-col items-center justify-center space-y-1">
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Digite suas credenciais para acessar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Error Alert */}
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <a href="#" className="text-sm text-primary hover:underline">
                                        Esqueci a senha
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-9 pr-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full group" size="lg" disabled={isLoading}>
                                {isLoading ? 'Entrando...' : 'Entrar'}
                                {!isLoading && (
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">Ou</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Não tem uma conta?{' '}
                                <Link href="/register" className="text-primary font-semibold hover:underline">
                                    Cadastre-se gratuitamente
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        ← Voltar para página inicial
                    </Link>
                </div>
            </div>
        </div>
    );
}
