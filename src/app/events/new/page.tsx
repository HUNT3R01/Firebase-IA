// =============================================================================
// PÁGINA CREAR EVENTO - Module 4: Event Pass
// =============================================================================
// Página para crear nuevos eventos usando Server Actions.
//
// ## Formulario con Server Action
// El formulario usa una Server Action directamente en el atributo `action`.
// No necesitamos JavaScript del cliente para enviar el formulario.
//
// ## Progressive Enhancement
// El formulario funciona incluso sin JavaScript (se envía como POST).
// Con JavaScript, se mejora la experiencia con estados de carga.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/EventForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

/**
 * Metadata de la página.
 */
export const metadata: Metadata = {
  title: 'Crear Evento',
  description: 'Crea un nuevo evento para compartir con tu comunidad.',
};

/**
 * Página de creación de eventos.
 */
export default function NewEventPage(): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón volver */}
      <Button asChild variant="ghost" className="mb-6 gap-2">
        <Link href="/events">
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>
      </Button>

      {/* Formulario de creación */}
      <ProtectedRoute>
        <EventForm />
      </ProtectedRoute>
    </div>
  );
}
