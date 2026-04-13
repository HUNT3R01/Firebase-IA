// =============================================================================
// COMPONENTE DELETE EVENT BUTTON - Module 5: Event Pass Pro
// =============================================================================
// Boton para eliminar un evento con confirmacion.
//
// ## 'use client'
// Este componente es un Client Component porque:
// 1. Maneja estado de confirmacion
// 2. Usa useTransition para estados de carga
// 3. Interactua con el usuario mediante dialogo
// =============================================================================

'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteEventAction } from '@/actions/eventActions';

interface DeleteEventButtonProps {
  /** ID del evento a eliminar */
  eventId: string;
  /** Titulo del evento (para mostrar en confirmacion) */
  eventTitle: string;
}

/**
 * Boton para eliminar un evento.
 *
 * ## Flujo de eliminacion
 * 1. Usuario hace clic en el boton
 * 2. Se muestra dialogo de confirmacion
 * 3. Si confirma, se ejecuta deleteEventAction
 * 4. Se redirige a /events
 *
 * ## Seguridad
 * La Server Action valida autenticacion antes de eliminar.
 */
export function DeleteEventButton({
  eventId,
  eventTitle,
}: DeleteEventButtonProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (): void => {
    setError(null);
    startTransition(async () => {
      const result = await deleteEventAction(eventId);
      if (!result.success) {
        setError(result.message);
      }
      // Si es exitoso, la action hace redirect
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar evento</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no se puede deshacer. Se eliminara permanentemente el evento:
            <span className="mt-2 block font-semibold text-foreground">
              &quot;{eventTitle}&quot;
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
