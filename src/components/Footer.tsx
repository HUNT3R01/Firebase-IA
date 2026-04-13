// =============================================================================
// COMPONENTE FOOTER - Module 5: EventPass Pro
// =============================================================================
// Footer de la aplicación.
// =============================================================================

import { Calendar, Sparkles } from 'lucide-react';

/**
 * Footer de la aplicación.
 */
export function Footer(): React.ReactElement {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold">EventPass</span>
            <span className="flex items-center gap-1 text-xs text-primary">
              <Sparkles className="h-3 w-3" />
              Pro
            </span>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} EventPass Pro. Creado con Next.js 16, Firebase y Gemini AI.
          </p>

          {/* Links */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Términos
            </a>
            <a href="#" className="hover:text-foreground">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
