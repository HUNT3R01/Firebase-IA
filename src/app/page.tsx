// =============================================================================
// PÁGINA PRINCIPAL - Module 4: Event Pass
// =============================================================================
// Página de inicio con eventos destacados.
//
// ## Server Component con Data Fetching
// Esta página es un Server Component que hace fetch de datos directamente.
// No necesita useEffect ni estados - el fetch sucede en el servidor.
//
// ## ¿Por qué Server Components?
// 1. Fetch en servidor = más rápido, más cerca de la base de datos
// 2. No enviamos código de fetch al cliente
// 3. Los datos están listos en el HTML inicial
// 4. Mejor SEO (contenido indexable)
// =============================================================================

import Link from 'next/link';
import { Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventList } from '@/components/EventList';
import { getEvents, getEventStats } from '@/data/events';

/**
 * Página de inicio.
 *
 * ## async Component
 * En Server Components podemos usar async/await directamente.
 * No necesitamos useEffect ni estados para data fetching.
 */
export default async function HomePage(): Promise<React.ReactElement> {
  // Fetch paralelo de datos
  const [events, stats] = await Promise.all([
    getEvents({ status: 'publicado' }),
    getEventStats(),
  ]);

  // Solo mostrar próximos eventos (máximo 6)
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Descubre y Crea
            <span className="block text-primary">Eventos Increíbles</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            EventPass es tu plataforma para descubrir conferencias, talleres y eventos cerca de ti.
            Regístrate, participa y conecta con tu comunidad.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/events">
                Explorar Eventos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/events/new">Crear Evento</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold">{stats.upcoming}</p>
              <p className="text-muted-foreground">Próximos Eventos</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold">{stats.totalRegistered.toLocaleString()}</p>
              <p className="text-muted-foreground">Asistentes Registrados</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold">{stats.totalCapacity.toLocaleString()}</p>
              <p className="text-muted-foreground">Plazas Totales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Próximos Eventos</h2>
              <p className="mt-2 text-muted-foreground">
                Descubre los eventos que están por venir
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/events">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <EventList
            events={upcomingEvents}
            emptyMessage="No hay eventos próximos. ¡Sé el primero en crear uno!"
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">¿Tienes un evento en mente?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Crea tu evento en minutos y compártelo con miles de personas interesadas.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link href="/events/new">Crear mi Evento</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
