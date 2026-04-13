// =============================================================================
// PÁGINA 404 - Module 4: Event Pass
// =============================================================================
// Página personalizada para rutas no encontradas.
//
// ## not-found.tsx
// Archivo especial de Next.js que se muestra cuando:
// 1. Se navega a una ruta que no existe
// 2. Se llama a notFound() desde un Server Component
// =============================================================================

import Link from 'next/link';
import { Calendar, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Página 404 personalizada.
 */
export default function NotFound(): React.ReactElement {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Calendar className="h-16 w-16 text-muted-foreground" />
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <h2 className="mt-2 text-xl text-muted-foreground">Página no encontrada</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        Lo sentimos, no pudimos encontrar la página que buscas. Es posible que haya sido movida o
        eliminada.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/events">Ver eventos</Link>
        </Button>
      </div>
    </div>
  );
}
