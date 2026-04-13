'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createEventAction, updateEventAction } from '@/actions/eventActions';
import { generateEventDetailsAction, generateEventPosterAction } from '@/actions/aiActions';
import { EVENT_CATEGORIES, EVENT_STATUSES, CATEGORY_LABELS, STATUS_LABELS } from '@/types/event';
import type { FormState, Event } from '@/types/event';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface EventFormProps {
  event?: Event;
  mode?: 'create' | 'edit';
}

const initialState: FormState = {
  success: false,
  message: '',
};

function MagicGenerateButton({ onGenerate, onStart, onEnd, tone }: { onGenerate: (data: any) => void, onStart: () => void, onEnd: () => void, tone: string }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const title = titleInput?.value;

    if (!title || title.length < 5) {
      toast({ title: "Error", description: "Escribe un título descriptivo primero (mínimo 5 caracteres)", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    onStart();
    try {
      const result = await generateEventDetailsAction(title, tone); // Pasamos el tono

      if (result.success && result.data) {
        onGenerate(result.data);
        toast({ title: "✨ Variantes Generadas", description: "Revisa y elige tu descripción favorita." });
      } else {
        toast({ title: "Error", description: result.error || "No se pudo generar el contenido", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error inesperado", variant: "destructive" });
    } finally {
      setIsGenerating(false);
      onEnd();
    }
  };

  return (
    <Button
      type="button" variant="ghost" size="sm"
      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary"
      onClick={handleGenerate} disabled={isGenerating}
    >
      <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating ? 'Generando...' : 'Generar con IA'}
    </Button>
  );
}

function PosterGenerator({ onImageGenerated, onStart, onEnd }: { onImageGenerated: (url: string) => void, onStart?: () => void, onEnd?: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const descInput = document.getElementById('description') as HTMLTextAreaElement;
    const tagsInput = document.getElementById('tags') as HTMLInputElement;

    // Use current values if available, otherwise just title + optional desc + tags
    const prompt = `Title: ${titleInput?.value || ''}. Description: ${descInput?.value ? descInput.value.slice(0, 100) : ''}. Tags: ${tagsInput?.value || ''}`;

    if (!prompt || prompt.length < 5) {
      toast({
        title: "Error",
        description: "Primero completa el título para generar un poster.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    // Optionally block UI here too if desired, but sticking to requested blocking on text generation
    if (onStart) onStart();

    try {
      const result = await generateEventPosterAction(prompt);

      if (result.success && result.imageUrl) {
        onImageGenerated(result.imageUrl);
        toast({
          title: "🎨 Poster Generado",
          description: "Se ha generado y subido un nuevo poster.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo generar el poster",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      if (onEnd) onEnd();
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="w-full sm:w-auto"
    >
      <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating ? 'Creando Arte...' : 'Generar Poster IA'}
    </Button>
  );
}

function SubmitButton({ isEditing, isLoading }: { isEditing: boolean, isLoading: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || isLoading} className="w-full">
      {pending
        ? isEditing
          ? 'Guardando cambios...'
          : 'Creando evento...'
        : isEditing
          ? 'Guardar Cambios'
          : 'Crear Evento'}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-1 text-sm text-destructive">
      {errors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
}

function toDatetimeLocal(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
}

export function EventForm({ event, mode = 'create' }: EventFormProps) {
  const isEditing = mode === 'edit' && !!event;
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isPosterGenerating, setIsPosterGenerating] = useState(false);
  const { user } = useAuth(); // Import useAuth from context
  const router = useRouter();

  const [aiVariants, setAiVariants] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState<string>('casual');

  const action = isEditing
    ? updateEventAction.bind(null, event.id)
    : createEventAction;

  const [state, formAction] = useActionState(action, initialState);

  // Helper to get default value from state payload (if error) or initial event
  const getDefault = (key: string, fallback: any = '') => {
    if (state.payload && state.payload[key] !== undefined) {
      return state.payload[key];
    }
    return event ? (event as any)[key] : fallback;
  };

  useEffect(() => {
    if (state.success && state.message) {
      toast({
        title: isEditing ? 'Evento Actualizado' : 'Evento Creado',
        description: state.message,
      });

      if (isEditing && event) {
        // Redirect to detail page after a short delay to let toast show
        const timer = setTimeout(() => {
          router.push(`/events/${event.id}`);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [state.success, state.message, isEditing, event, router]);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Modifica los datos del evento. Los campos marcados con * son obligatorios.'
            : 'Completa el formulario para publicar tu evento. Los campos marcados con * son obligatorios.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!state.success && state.message && (
          <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
            <p>{state.message}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>
            <div className="space-y-2">
              <Label htmlFor="title">Título del evento *</Label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Input id="title" name="title" placeholder="Ej: Conferencia de Desarrollo Web 2025" defaultValue={getDefault('title')} required />
                  {!isEditing && (
                    <MagicGenerateButton
                      tone={selectedTone}
                      onStart={() => { setIsAiGenerating(true); setAiVariants([]); }}
                      onEnd={() => setIsAiGenerating(false)}
                      onGenerate={(data) => {
                        setAiVariants(data.descriptions || []);
                        // Auto-completar categoría y tags (suponiendo IDs estándar)
                        const catSelect = document.querySelector('[name="category"]') as HTMLInputElement;
                        if (catSelect && data.category) catSelect.value = data.category;
                        const tagsInput = document.getElementById('tags') as HTMLInputElement;
                        if (tagsInput && data.tags) tagsInput.value = data.tags.join(', ');
                      }}
                    />
                  )}
                </div>
                {/* Selector de Tono */}
                {!isEditing && (
                  <Select value={selectedTone} onValueChange={setSelectedTone} disabled={isAiGenerating}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Tono" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="exciting">Emocionante</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* 🔥 NUEVO: Cartas de Selección de Variantes de IA */}
            {aiVariants.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 my-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Variantes Generadas
                  </h4>
                  <Button 
                    type="button" variant="outline" size="sm" 
                    onClick={() => { document.querySelector('button:has(.lucide-sparkles)')?.dispatchEvent(new MouseEvent('click', { bubbles: true })); }}
                  >
                    Regenerar Variantes
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {aiVariants.map((variant, idx) => (
                    <Card key={idx} className="flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition">
                      <p className="text-sm text-muted-foreground line-clamp-6 mb-4">{variant}</p>
                      <Button 
                        type="button" 
                        onClick={() => {
                          const descArea = document.getElementById('description') as HTMLTextAreaElement;
                          if (descArea) descArea.value = variant;
                          setAiVariants([]); // Oculta las cartas tras elegir
                          toast({ title: "Descripción aplicada", description: "¡Excelente elección!" });
                        }}
                      >
                        Usar esta
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe tu evento en detalle (mínimo 20 caracteres)"
                defaultValue={getDefault('description')}
                rows={4}
                required
                disabled={isAiGenerating}
                className={isAiGenerating ? 'opacity-50 cursor-not-allowed bg-muted' : ''}
              />
              <FieldError errors={state.errors?.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select name="category" defaultValue={getDefault('category')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={state.errors?.category} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select name="status" defaultValue={getDefault('status', 'borrador')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={state.errors?.status} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fecha y Ubicación</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha de inicio *</Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  defaultValue={state.payload?.date || toDatetimeLocal(event?.date)}
                  required
                />
                <FieldError errors={state.errors?.date} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de fin</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  defaultValue={state.payload?.endDate || toDatetimeLocal(event?.endDate)}
                />
                <FieldError errors={state.errors?.endDate} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lugar *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ej: Centro de Convenciones"
                defaultValue={getDefault('location')}
                required
              />
              <FieldError errors={state.errors?.location} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección completa *</Label>
              <Input
                id="address"
                name="address"
                placeholder="Ej: Calle Principal 123, 28001 Madrid"
                defaultValue={getDefault('address')}
                required
              />
              <FieldError errors={state.errors?.address} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Capacidad y Precio</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad máxima *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="100"
                  defaultValue={getDefault('capacity')}
                  required
                />
                <FieldError errors={state.errors?.capacity} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0 para eventos gratuitos"
                  defaultValue={getDefault('price')}
                  required
                />
                <FieldError errors={state.errors?.price} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Imagen y Etiquetas</h3>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de imagen</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                defaultValue={getDefault('imageUrl')}
                disabled={isAiGenerating || isPosterGenerating}
                className={isPosterGenerating ? 'opacity-50 cursor-not-allowed bg-muted' : ''}
              />
              <FieldError errors={state.errors?.imageUrl} />
              <div className="flex justify-end mt-2">
                <PosterGenerator
                  onStart={() => setIsPosterGenerating(true)}
                  onEnd={() => setIsPosterGenerating(false)}
                  onImageGenerated={(url) => {
                    const input = document.getElementById('imageUrl') as HTMLInputElement;
                    if (input) input.value = url;
                  }} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="react, javascript, conferencia"
                defaultValue={state.payload?.tags ? state.payload.tags.join(', ') : event?.tags.join(', ')}
              />
              <p className="text-sm text-muted-foreground">Máximo 5 etiquetas</p>
              <FieldError errors={state.errors?.tags} />
            </div>
          </div>

          {/* Hidden fields for organizer info, automatically populated */}
          <input type="hidden" name="organizerName" value={getDefault('organizerName', user?.displayName || 'Anónimo')} />
          <input type="hidden" name="organizerEmail" value={getDefault('organizerEmail', user?.email || '')} />
          {state.errors?.organizerName && <FieldError errors={state.errors.organizerName} />}
          {state.errors?.organizerEmail && <FieldError errors={state.errors.organizerEmail} />}

          <SubmitButton isEditing={isEditing} isLoading={isAiGenerating || isPosterGenerating} />

          {state.success && state.message && (
            <div className="rounded-md bg-green-100 p-4 text-green-800">
              <p>{state.message}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card >
  );
}
