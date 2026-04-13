import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Suspense } from 'react';

export default function ForgotPasswordPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
            <Suspense fallback={<div>Cargando...</div>}>
                <ForgotPasswordForm />
            </Suspense>
        </div>
    );
}
