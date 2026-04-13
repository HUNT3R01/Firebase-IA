// =============================================================================
// FIREBASE ADMIN SDK CONFIGURATION - Module 5: EventPass Pro
// =============================================================================
//
// ## Educational Note: Server-Only Firebase Admin
//
// Este archivo configura el Firebase Admin SDK para uso EXCLUSIVO en el servidor.
// A diferencia del SDK de cliente (firebase), el Admin SDK:
//
// 1. Tiene acceso privilegiado a todos los recursos de Firebase
// 2. Puede verificar tokens de autenticación
// 3. Puede realizar operaciones batch y administrativas
// 4. NUNCA debe exponerse al cliente (por eso usamos 'server-only')
//
// ## Seguridad de Credenciales
//
// Las credenciales del Admin SDK son SECRETAS y deben:
// - Configurarse via variables de entorno
// - NUNCA hardcodearse en el código
// - NUNCA subirse a repositorios públicos
//
// Si las variables no están configuradas, la app fallará con un error claro
// en lugar de usar valores por defecto inseguros.
// =============================================================================

import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// =============================================================================
// VALIDACIÓN DE CREDENCIALES
// =============================================================================
// Verificamos que todas las variables de entorno necesarias estén configuradas.
// Esto previene errores silenciosos en producción.
// =============================================================================

function validateEnvironmentVariables(): void {
  const requiredVars = [
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Firebase Admin SDK: Missing required environment variables: ${missingVars.join(', ')}. ` +
        `Please check your .env.local file and ensure all Firebase Admin credentials are configured.`
    );
  }
}

// =============================================================================
// INICIALIZACIÓN DEL ADMIN SDK
// =============================================================================
// Usamos el patrón Singleton para evitar múltiples inicializaciones.
// getApps() retorna las apps ya inicializadas.
// =============================================================================

let adminApp: App;

// Solo validamos e inicializamos si no hay una app existente
if (getApps().length === 0) {
  validateEnvironmentVariables();

  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    // La private key viene con \n literales desde el .env, necesitamos convertirlos
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  adminApp = getApps()[0];
}

// =============================================================================
// EXPORTACIÓN DE SERVICIOS
// =============================================================================
// Exportamos instancias de Firestore y Auth para uso en Server Actions y API Routes.
// =============================================================================

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminDb, adminAuth, adminApp };
