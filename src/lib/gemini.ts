// =============================================================================
// GEMINI AI CLIENT CONFIGURATION - Module 5: EventPass Pro
// =============================================================================
//
// ## Educational Note: AI Integration in Server Components
//
// Este archivo configura el cliente de Google Generative AI (Gemini).
// La integración con IA generativa en Next.js sigue estos principios:
//
// 1. Las API keys NUNCA deben exponerse al cliente
// 2. Las llamadas a Gemini se hacen desde Server Actions
// 3. El cliente se inicializa una sola vez (singleton pattern)
//
// ## Selección de Modelos
//
// Gemini ofrece varios modelos optimizados para diferentes casos de uso:
//
// - gemini-3-flash-preview: Velocidad optimizada, ideal para generación de texto
//   en tiempo real. Menor costo, respuestas rápidas.
//
// - gemini-3-pro-image-preview: Calidad optimizada para generación de imágenes.
//   Más costoso pero produce mejores resultados visuales.
//
// ## Uso con @google/genai SDK
//
// El SDK @google/genai (v1.34+) usa una API simplificada:
// ```typescript
// const result = await client.models.generateContent({
//   model: 'gemini-2.0-flash',
//   contents: [{ role: 'user', parts: [{ text: prompt }] }]
// });
// ```
// =============================================================================

import { GoogleGenAI } from '@google/genai';

// =============================================================================
// INICIALIZACIÓN DEL CLIENTE
// =============================================================================
// Usamos el patrón Singleton para evitar crear múltiples instancias del cliente.
// La API key se obtiene de las variables de entorno del servidor.
// =============================================================================

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// =============================================================================
// MODELOS DISPONIBLES
// =============================================================================
// Constantes para los modelos de Gemini. Usar constantes evita errores de typo
// y facilita actualizar los modelos cuando Google lance nuevas versiones.
// =============================================================================

export const GEMINI_MODELS = {
  /** Modelo de texto optimizado para velocidad - ideal para generación interactiva */
  TEXT: 'gemini-3-flash-preview',
  /** Modelo de imagen con capacidades de generación visual */
  IMAGE: 'gemini-3-pro-image-preview',
} as const;

// =============================================================================
// EXPORTACIÓN DEL CLIENTE
// =============================================================================
// Exportamos una función getter en lugar del cliente directamente.
// Esto permite:
// 1. Lazy initialization si fuera necesario
// 2. Facilitar testing con mocks
// 3. Agregar validaciones en el futuro
// =============================================================================

/**
 * Obtiene el cliente de Gemini AI.
 * Solo debe usarse desde Server Actions o API Routes.
 */
export const getGeminiClient = () => {
  return genAI;
};
