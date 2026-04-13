// =============================================================================
// PÁGINA DE ERROR - Module 4: Event Pass
// =============================================================================
// Error boundary para manejar errores en tiempo de ejecución.
//
// ## error.tsx
// Archivo especial de Next.js que actúa como Error Boundary.
// Captura errores en el árbol de componentes y muestra una UI de error.
//
// ## 'use client'
// Los Error Boundaries DEBEN ser Client Components porque usan
// el ciclo de vida de React para capturar errores.
// =============================================================================

'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Componente de error.
 *
 * @param error - El error capturado
 * @param reset - Función para reintentar (re-renderiza el segmento)
 */
export default function ErrorPage({ error, reset }: ErrorPageProps): React.ReactElement {
  // Log del error en desarrollo
  useEffect(() => {
    console.error('Error capturado:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <h1 className="mt-6 text-2xl font-bold">Algo salió mal</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.
      </p>
      {error.digest && (
        <p className="mt-2 text-sm text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <div className="mt-8 flex gap-4">
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          Ir al inicio
        </Button>
      </div>
    </div>
  );
}
