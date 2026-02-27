'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, Eye, EyeOff, CreditCard, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useAuth } from '../hooks/use-auth';

export default function RegisterForm() {
    const { register, isLoading, error, setError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Validação de senha
    const passwordRequirements = {
        minLength: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password),
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
    const passwordsMatch = password === confirmPassword && confirmPassword !== '';

    // Formatar CPF
    const formatCPF = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        }
        return cpf;
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isPasswordValid) {
            setError('A senha não atende aos requisitos mínimos');
            return;
        }

        if (!passwordsMatch) {
            setError('As senhas não coincidem');
            return;
        }

        try {
            await register({ name: cpf, email, password, confirmPassword });
            // TODO: redirect após cadastro
        } catch {
            // error is handled by useAuth
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                            <span className="text-white text-3xl font-bold">R+</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Crie sua conta
                    </h1>
                    <p className="text-muted-foreground">
                        Comece a economizar em suas obras hoje mesmo
                    </p>
                </div>

                {/* Cadastro Card */}
                <Card className="border-2 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Cadastro</CardTitle>
                        <CardDescription>
                            Preencha os dados para criar sua conta gratuita
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
                            {/* CPF */}
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="cpf"
                                        type="text"
                                        placeholder="000.000.000-00"
                                        className="pl-9"
                                        value={cpf}
                                        onChange={handleCPFChange}
                                        maxLength={14}
                                        required
                                    />
                                </div>
                            </div>

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
                                <Label htmlFor="password">Senha</Label>
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

                                {/* Password Requirements */}
                                {password && (
                                    <div className="space-y-1 mt-2">
                                        <div className={`flex items-center gap-2 text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordRequirements.minLength ? (
                                                <CheckCircle2 className="h-3 w-3" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                            <span>Mínimo de 8 caracteres</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordRequirements.hasNumber ? (
                                                <CheckCircle2 className="h-3 w-3" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                            <span>Pelo menos um número</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasLetter ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {passwordRequirements.hasLetter ? (
                                                <CheckCircle2 className="h-3 w-3" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                            <span>Pelo menos uma letra</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirmar Senha */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-9 pr-9"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {confirmPassword && (
                                    <div className={`flex items-center gap-2 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordsMatch ? (
                                            <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                            <X className="h-3 w-3" />
                                        )}
                                        <span>
                                            {passwordsMatch ? 'As senhas coincidem' : 'As senhas não coincidem'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Terms */}
                            <Alert className="bg-accent border-primary/20">
                                <AlertDescription className="text-xs text-center">
                                    Ao criar uma conta, você concorda com nossos <Link href="/termos" className="text-primary font-semibold hover:underline">Termos de Uso</Link>
                                    <br />e <Link href="/privacidade" className="text-primary font-semibold hover:underline">Política de Privacidade</Link>.
                                </AlertDescription>
                            </Alert>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full group"
                                size="lg"
                                disabled={!isPasswordValid || !passwordsMatch || isLoading}
                            >
                                {isLoading ? 'Criando conta...' : 'Criar Conta'}
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

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Já tem uma conta?{' '}
                                <Link href="/login" className="text-primary font-semibold hover:underline">
                                    Fazer login
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
