'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function ForgotPasswordForm() {
    const { resetPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        try {
            await resetPassword(email);
            setIsSuccess(true);
        } catch (error: any) {
            setError('Error al enviar el correo. Verifique que el email sea correcto.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MailCheck className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Correo Enviado</CardTitle>
                    <CardDescription>
                        Si existe una cuenta con ese correo, recibirás las instrucciones para restablecer tu contraseña.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                    <Button asChild variant="ghost">
                        <Link href="/auth/login">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al inicio de sesión
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
                <CardDescription>Ingresa tu correo para recibir las instrucciones</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                    </div>

                    {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Enviar instrucciones
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button asChild variant="link" className="text-muted-foreground p-0">
                    <Link href="/auth/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio de sesión
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
