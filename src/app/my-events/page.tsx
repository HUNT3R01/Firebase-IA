import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { adminAuth } from '@/lib/firebase/admin';
import { getEvents } from '@/data/events';
import { EventList } from '@/components/EventList';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Mis Eventos | EventPass',
};

export default async function MyEventsPage() {
  // 1. Verificación de Autenticación (Ruta Protegida)
  const cookieStore = await cookies();
  const token = cookieStore.get('firebase-auth-token')?.value;

  if (!token) {
    redirect('/auth'); // Redirige si no hay token
  }

  let uid: string;
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    uid = decodedToken.uid;
  } catch (error) {
    redirect('/auth'); // Redirige si el token expiró o es inválido
  }

  // 2. Filtro de usuario: Traer solo eventos de este organizador
  const myEvents = await getEvents({ organizerId: uid });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Eventos</h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona, edita y elimina los eventos que has creado.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Evento
          </Link>
        </Button>
      </div>

      {/* 3. Empty State (Si no tiene eventos) */}
      {myEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <h3 className="mb-2 text-xl font-medium">Aún no tienes eventos</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            No has creado ningún evento todavía. ¡Anímate a organizar tu primer evento!
          </p>
          <Button asChild>
            <Link href="/events/new">Crear mi primer evento</Link>
          </Button>
        </div>
      ) : (
        /* Lista de eventos, pasamos currentUserId para que active los botones */
        <EventList events={myEvents} currentUserId={uid}  emptyMessage={uid}/>
      )}
    </div>
  );
}