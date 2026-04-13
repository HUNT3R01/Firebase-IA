// =============================================================================
// COMPONENTE EVENT LIST - Module 4: Event Pass
// =============================================================================
// Lista de eventos con layout responsive.
//
// ## Server Component
// Este componente es un Server Component que recibe los eventos
// como props desde un parent que hace el fetch.
// =============================================================================

import { EventCard } from './EventCard';
import type { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  emptyMessage?: string;
  currentUserId?: string;
}

/**
 * Lista de eventos en grid responsive.
 */
export function EventList({
  events,
  emptyMessage = 'No se encontraron eventos',
}: EventListProps): React.ReactElement {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Intenta con otros filtros o crea un nuevo evento
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
