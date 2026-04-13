'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function RegisterForm() {
    const { registerWithEmail } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            await registerWithEmail(email, password, name);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setError('El correo ya está registrado');
            } else if (error.code === 'auth/weak-password') {
                setError('La contraseña es muy débil');
            } else {
                setError('Error al registrarse');
            }
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                <CardDescription>Únete a EventPass para crear y gestionar eventos</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" name="password" type="password" required minLength={6} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
                    </div>

                    {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Registrarse
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Inicia Sesión
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
