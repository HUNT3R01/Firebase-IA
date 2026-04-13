// =============================================================================
// ROOT LAYOUT - Module 5: EventPass Pro
// =============================================================================
// Layout raíz de la aplicación Next.js con autenticación.
//
// ## App Router Layouts
// Los layouts en App Router:
// 1. Se aplican a todas las rutas hijas
// 2. Preservan estado entre navegaciones
// 3. Son Server Components por defecto
//
// ## AuthProvider
// El AuthProvider es un Client Component que envuelve toda la app
// para proporcionar el contexto de autenticación.
// =============================================================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

/**
 * Fuente Inter de Google Fonts.
 *
 * ## next/font
 * Next.js optimiza las fuentes automáticamente:
 * - Descarga en tiempo de build
 * - Self-hosting (sin llamadas a Google)
 * - Sin layout shift
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Metadata de la aplicación.
 *
 * ## Metadata API
 * Define metadatos SEO para la aplicación.
 * Estos se aplican a toda la app (pueden ser override por páginas).
 */
export const metadata: Metadata = {
  title: {
    template: '%s | EventPass Pro',
    default: 'EventPass Pro - Gestiona tus Eventos con IA',
  },
  description:
    'Plataforma de gestión de eventos con Firebase y Gemini AI. Crea, promociona y gestiona eventos fácilmente.',
  keywords: [
    'eventos',
    'conferencias',
    'talleres',
    'networking',
    'gestión de eventos',
    'firebase',
    'ia',
  ],
};

/**
 * Layout raíz de la aplicación.
 *
 * ## AuthProvider
 * Envolvemos toda la app con AuthProvider para que todos los
 * componentes tengan acceso al estado de autenticación.
 *
 * @param children - Contenido de la página actual
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="es" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <AuthProvider>
          {/* Header global */}
          <Header />

          {/* Contenido principal */}
          <main className="flex-1">{children}</main>

          {/* Footer global */}
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
