// =============================================================================
// CONFIGURACIÓN DE NEXT.JS - Module 4: Event Pass
// =============================================================================
// Next.js 15+ con App Router y Turbopack.
//
// ## Turbopack
// Turbopack es el nuevo bundler de Rust que reemplaza a Webpack.
// Es significativamente más rápido en desarrollo.
//
// ## App Router
// Next.js 13+ introdujo el App Router con Server Components por defecto.
// Este proyecto usa exclusivamente el App Router (carpeta /app).
// =============================================================================

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack se habilita con --turbopack en el script dev
  // No requiere configuración adicional aquí

  // Imágenes externas permitidas (para eventos con imágenes de demostración)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'i.blogs.es',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  // Configuración experimental para React 19
  experimental: {
    // Server Actions están habilitados por defecto en Next.js 14+
  },
};

export default nextConfig;
