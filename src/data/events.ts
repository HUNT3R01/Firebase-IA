// =============================================================================
// DATOS DE EVENTOS - Module 4: Event Pass
// =============================================================================
// Almacén de datos en memoria para los eventos.
//
// ## ¿Por qué en memoria?
// Este módulo demuestra Server Components y Server Actions sin necesidad
// de una base de datos real. En Module 5 migraremos a Firebase/Firestore.
//
// ## Importante
// Los datos se resetean cada vez que se reinicia el servidor.
// Esto es intencional para el entorno de desarrollo.
// =============================================================================

import type { Event, EventFilters } from '@/types/event';
import { getEvents as getEventsFirestore, getEventById as getEventByIdFirestore, createEvent as createEventFirestore, updateEvent as updateEventFirestore, deleteEvent as deleteEventFirestore } from '@/lib/firebase/firestore';

export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  return getEventsFirestore(filters);
}

export async function getEventById(id: string): Promise<Event | null> {
  return getEventByIdFirestore(id);
}

export async function createEvent(
  data: Omit<Event, 'id' | 'registeredCount' | 'createdAt' | 'updatedAt'>
): Promise<Event> {
  // Provide default values for required fields that are not in 'data'
  // id, createdAt, updatedAt are handled by Firestore/utility
  const eventData = {
    ...data,
    registeredCount: 0,
    // Optional fields should be handled if missing in data
  };
  return createEventFirestore(eventData as any);
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<Event, 'id' | 'createdAt'>>,
  userId?: string
): Promise<Event | null> {
  const event = await getEventByIdFirestore(id);
  if (!event) return null;

  // Check ownership if userId is provided
  if (userId && event.organizerId !== userId) {
    throw new Error('Unauthorized');
  }

  return updateEventFirestore(id, data as any);
}

export async function deleteEvent(id: string, userId?: string): Promise<boolean> {
  const event = await getEventByIdFirestore(id);
  if (!event) return false;

  // Check ownership if userId is provided
  if (userId && event.organizerId !== userId) {
    throw new Error('Unauthorized');
  }

  await deleteEventFirestore(id);
  return true;
}

export async function registerForEvent(id: string, userId?: string): Promise<Event | null> {
  if (!userId) throw new Error('User ID required for registration');

  try {
    // Import dynamically to avoid circular dependencies if any, or just use the imported one.
    // We are already importing from firestore.ts at the top.
    const { registerForEvent } = await import('@/lib/firebase/firestore');
    return await registerForEvent(id, userId);
  } catch (error: any) {
    if (error.message === 'UserAlreadyRegistered') {
      throw new Error('Ya estás registrado en este evento');
    }
    if (error.message === 'EventFull') {
      throw new Error('El evento está lleno');
    }
    console.error('Registration error:', error);
    return null;
  }
}

export async function getEventStats(): Promise<{
  total: number;
  published: number;
  upcoming: number;
  totalCapacity: number;
  totalRegistered: number;
}> {
  const events = await getEventsFirestore();
  const now = new Date();
  const published = events.filter((e) => e.status === 'publicado');
  const upcoming = published.filter((e) => new Date(e.date) > now);

  return {
    total: events.length,
    published: published.length,
    upcoming: upcoming.length,
    totalCapacity: events.reduce((sum, e) => sum + e.capacity, 0),
    totalRegistered: events.reduce((sum, e) => sum + (e.registeredCount || 0), 0),
  };
}
