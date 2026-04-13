// =============================================================================
// TIPOS DE EVENTO - Module 5: EventPass Pro
// =============================================================================
// Define los tipos de datos para eventos usando Zod para validación.
//
// ## Zod en Next.js
// Zod es especialmente útil con Server Actions porque:
// 1. Valida datos del cliente antes de procesarlos
// 2. Genera tipos TypeScript automáticamente
// 3. Proporciona mensajes de error estructurados
// =============================================================================

import { z } from 'zod';

// =============================================================================
// ENUMS Y CONSTANTES
// =============================================================================

/**
 * Categorías de eventos disponibles.
 */
export const EVENT_CATEGORIES = [
  'conferencia',
  'taller',
  'concierto',
  'exposicion',
  'networking',
  'deportivo',
  'cultural',
  'otro',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/**
 * Estados posibles de un evento.
 */
export const EVENT_STATUSES = ['borrador', 'publicado', 'cancelado', 'finalizado'] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

/**
 * Etiquetas para mostrar en español.
 */
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  conferencia: 'Conferencia',
  taller: 'Taller',
  concierto: 'Concierto',
  exposicion: 'Exposición',
  networking: 'Networking',
  deportivo: 'Deportivo',
  cultural: 'Cultural',
  otro: 'Otro',
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  borrador: 'Borrador',
  publicado: 'Publicado',
  cancelado: 'Cancelado',
  finalizado: 'Finalizado',
};

// =============================================================================
// ESQUEMAS ZOD
// =============================================================================

/**
 * Esquema base para un evento.
 * Usamos Zod para validación tanto en cliente como en servidor.
 */
export const eventSchema = z.object({
  id: z.string().cuid2(),
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  category: z.enum(EVENT_CATEGORIES),
  status: z.enum(EVENT_STATUSES),
  date: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string().min(5, 'La ubicación debe tener al menos 5 caracteres'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  capacity: z.number().int().min(1, 'La capacidad mínima es 1'),
  registeredCount: z.number().int().min(0).default(0),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  imageUrl: z.string().url().optional(),
  organizerName: z.string().min(2, 'El nombre del organizador es requerido'),
  organizerEmail: z.string().email('Email del organizador inválido'),
  organizerId: z.string().optional(), // ID del usuario de Firebase
  tags: z.array(z.string()).max(5, 'Máximo 5 etiquetas'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Esquema para crear un evento (sin id, timestamps ni registeredCount).
 */
export const createEventSchema = eventSchema.omit({
  id: true,
  registeredCount: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Esquema para actualizar un evento (todos los campos opcionales).
 */
export const updateEventSchema = createEventSchema.partial();

// =============================================================================
// TIPOS INFERIDOS
// =============================================================================

/**
 * Tipo completo de un evento.
 */
export type Event = z.infer<typeof eventSchema>;

/**
 * Tipo para crear un evento.
 */
export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * Tipo para actualizar un evento.
 */
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// =============================================================================
// TIPOS PARA FORMULARIOS Y UI
// =============================================================================

/**
 * Estado del formulario para Server Actions.
 *
 * ## ¿Por qué este patrón?
 * Los Server Actions retornan un estado que indica:
 * - Si la operación fue exitosa
 * - Errores de validación por campo
 * - Mensaje general para el usuario
 */
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: Event;
  payload?: any;
}

/**
 * Filtros para buscar eventos.
 */
export interface EventFilters {
  search?: string;
  category?: EventCategory;
  status?: EventStatus;
  dateFrom?: string;
  dateTo?: string;
  priceMax?: number;
  organizerId?: string;
}
