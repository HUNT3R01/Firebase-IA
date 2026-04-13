import { RegisterForm } from '@/components/auth/RegisterForm';
import { Suspense } from 'react';

export default function RegisterPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
            <Suspense fallback={<div>Cargando...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}
