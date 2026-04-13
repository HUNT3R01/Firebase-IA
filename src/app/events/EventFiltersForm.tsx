// =============================================================================
// COMPONENTE EVENT FILTERS FORM - Module 5: EventPass Pro
// =============================================================================
// Formulario de filtros usando form nativo con method="GET".
//
// ## Server Component
// Este componente es un Server Component (sin 'use client') porque:
// 1. Usa <form method="GET"> nativo de HTML
// 2. No requiere JavaScript para funcionar
// 3. Los filtros se envían como query params automáticamente
//
// ## Progressive Enhancement
// El form funciona incluso sin JavaScript habilitado.
// Los usuarios con JS obtienen navegación sin recarga completa.
//
// ## URL como estado
// Los filtros se guardan en la URL automáticamente:
// - Shareable (el link incluye los filtros)
// - Bookmarkable
// - Funciona con botón atrás del navegador
// - Server-side filtering (mejor performance)
// =============================================================================

import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EVENT_CATEGORIES, CATEGORY_LABELS, type EventCategory } from '@/types/event';

interface EventFiltersFormProps {
  currentFilters: {
    search?: string;
    category?: EventCategory;
    status?: string;
    priceMax?: number;
  };
}

/**
 * Formulario de filtros de eventos (Server Component).
 *
 * ## form method="GET"
 * El formulario usa method="GET" para enviar los filtros como query params.
 * Next.js intercepta la navegación para hacerla más fluida,
 * pero funciona perfectamente sin JavaScript.
 */
export function EventFiltersForm({ currentFilters }: EventFiltersFormProps): React.ReactElement {
  const hasFilters =
    currentFilters.search || currentFilters.category || currentFilters.priceMax;

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Formulario con method GET - no requiere JavaScript */}
      <form method="GET" action="/events" className="space-y-4">
        {/* Búsqueda */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Buscar eventos..."
              defaultValue={currentFilters.search}
              className="pl-9"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </div>

        {/* Filtros adicionales */}
        <div className="flex flex-wrap gap-4">
          {/* Categoría - usando select nativo estilizado */}
          <select
            name="category"
            defaultValue={currentFilters.category ?? ''}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Todas las categorías</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          {/* Precio máximo - usando select nativo estilizado */}
          <select
            name="priceMax"
            defaultValue={currentFilters.priceMax?.toString() ?? ''}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Cualquier precio</option>
            <option value="0">Gratis</option>
            <option value="25">Hasta 25€</option>
            <option value="50">Hasta 50€</option>
            <option value="100">Hasta 100€</option>
            <option value="200">Hasta 200€</option>
          </select>

          {/* Botón aplicar filtros (opcional, ya que submit también los aplica) */}
          <Button type="submit" variant="secondary">
            Aplicar filtros
          </Button>

          {/* Botón limpiar - usando Link para navegar sin filtros */}
          {hasFilters && (
            <Link href="/events">
              <Button type="button" variant="ghost" className="gap-2">
                Limpiar filtros
              </Button>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
