'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { DeleteEventButton } from '@/components/DeleteEventButton';

interface EventOwnerActionsProps {
    eventId: string;
    eventTitle: string;
    organizerId?: string;
}

export function EventOwnerActions({ eventId, eventTitle, organizerId }: EventOwnerActionsProps) {
    const { user } = useAuth();

    // If no user logic or no organizerId, hide actions (security handled on server too)
    if (!user || user.uid !== organizerId) {
        return null;
    }

    return (
        <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-2">
                <Link href={`/events/${eventId}/edit`}>
                    <Pencil className="h-4 w-4" />
                    Editar
                </Link>
            </Button>
            <DeleteEventButton eventId={eventId} eventTitle={eventTitle} />
        </div>
    );
}
