// =============================================================================
// PAGINA DE EDICION DE EVENTO - Module 5: Event Pass Pro
// =============================================================================
// Pagina para editar un evento existente.
//
// ## Ruta dinamica anidada
// Esta pagina usa /events/[id]/edit donde [id] es el ID del evento.
// =============================================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/EventForm';
import { getEventById } from '@/data/events';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

/**
 * Props de la pagina con params dinamicos.
 */
interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Genera metadata dinamica para SEO.
 */
export async function generateMetadata({ params }: EditEventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return {
      title: 'Evento no encontrado',
    };
  }

  return {
    title: `Editar: ${event.title}`,
    description: `Editar evento: ${event.title}`,
  };
}

/**
 * Pagina de edicion de evento.
 */
export default async function EditEventPage({
  params,
}: EditEventPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const event = await getEventById(id);

  // Si no existe el evento, mostramos 404
  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Boton volver */}
      <Button asChild variant="ghost" className="mb-6 gap-2">
        <Link href={`/events/${id}`}>
          <ArrowLeft className="h-4 w-4" />
          Volver al evento
        </Link>
      </Button>

      {/* Formulario de edicion */}
      <ProtectedRoute>
        <EventForm event={event} mode="edit" />
      </ProtectedRoute>
    </div>
  );
}
