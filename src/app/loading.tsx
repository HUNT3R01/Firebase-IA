// =============================================================================
// PÁGINA DE CARGA - Module 4: Event Pass
// =============================================================================
// Loading UI que se muestra mientras las páginas cargan.
//
// ## loading.tsx
// Archivo especial de Next.js que crea un Suspense boundary automático.
// Se muestra mientras el Server Component está renderizando.
//
// ## React Suspense
// Next.js usa Suspense internamente para streaming de Server Components.
// loading.tsx es el fallback de ese Suspense.
// =============================================================================

import { Calendar } from 'lucide-react';

/**
 * UI de carga global.
 */
export default function Loading(): React.ReactElement {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
      <Calendar className="h-12 w-12 animate-pulse text-primary" />
      <p className="mt-4 text-muted-foreground">Cargando...</p>
    </div>
  );
}
