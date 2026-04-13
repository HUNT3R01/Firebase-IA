import { LoginForm } from '@/components/auth/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
            <Suspense fallback={<div>Cargando...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
