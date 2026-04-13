# Módulo 5 - EventPass Pro

## Gestión de Eventos con Firebase y Gemini AI

> Evolución de EventPass con autenticación, base de datos en la nube e inteligencia artificial.

**Deploy:** https://event-pass-pro-tau.vercel.app/

---

## Stack Tecnologico

| Dependencia | Version |
|-------------|---------|
| Next.js | 16.1.1 |
| React | 19.2.1 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.1.8 |
| Firebase | ^12.7.0 |
| Firebase Admin | ^13.6.0 |
| @google/genai | ^1.34.0 |
| Zod | 4.1.9 |

> Ver [TECH_STACK.md](./TECH_STACK.md) para detalles completos.

---

## Descripción del Proyecto

**EventPass Pro** extiende Module 4 añadiendo servicios en la nube y generación de contenido con IA. Este proyecto enseña:

1. **Firebase Authentication** - Login con email/password y Google
2. **Firestore Database** - Base de datos NoSQL en tiempo real
3. **Gemini AI** - Generación de descripciones con IA generativa
4. **React Context** - Gestión de estado de autenticación

---

## Contexto Pedagógico

### 1. Firebase en Next.js

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FIREBASE EN NEXT.JS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   CLIENTE (Browser)                  │    SERVIDOR (Server Actions)      │
│   ──────────────────────────────────────────────────────────────────    │
│                                       │                                   │
│   firebase (SDK cliente)             │    firebase-admin (SDK admin)     │
│                                       │                                   │
│   ✅ Auth interactivo                │    ✅ Acceso privilegiado          │
│   ✅ Listeners tiempo real           │    ✅ Verificar tokens             │
│   ✅ Sign in con popup               │    ✅ Operaciones batch            │
│                                       │                                   │
│   Configuración:                     │    Configuración:                  │
│   NEXT_PUBLIC_FIREBASE_*             │    FIREBASE_ADMIN_*               │
│   (visibles en cliente)              │    (secretos, solo servidor)      │
│                                       │                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Firebase Authentication

```typescript
// AuthContext.tsx - Contexto de autenticación
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase notifica cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
```

### 3. Firestore Database

```typescript
// Estructura NoSQL
// Collection: events
// └── Document: eventId
//     ├── title: "Conferencia Web"
//     ├── description: "..."
//     ├── organizerId: "userId123"  // Referencia al usuario
//     └── createdAt: Timestamp

// Query con filtros
const events = await adminDb
  .collection('events')
  .where('status', '==', 'publicado')
  .orderBy('date', 'asc')
  .get();
```

### 4. Gemini AI Integration

```typescript
// lib/gemini.ts - Configuración del cliente
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getGeminiClient = () => genAI;

// actions/aiActions.ts - Server Action para generar contenido
'use server';
import { getGeminiClient } from '@/lib/gemini';

export async function generateEventDetailsAction(title: string) {
  const client = getGeminiClient();

  const result = await client.models.generateContent({
    model: 'gemini-3-flash-preview',  // Modelo optimizado para velocidad
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(result.text);
}
```

> **Nota:** Usamos Server Actions en lugar de API Routes para la integración con Gemini.
> Esto simplifica el código y mantiene las API keys seguras en el servidor.

---

## Estructura del Proyecto

```
module5-event-pass-pro/
├── package.json                 # Firebase + Gemini dependencies
├── next.config.ts               # Configuración de Next.js
├── .env.example                 # Variables de entorno (Firebase + Gemini)
├── README.md                    # Esta documentación
└── src/
    ├── app/
    │   ├── layout.tsx           # + AuthProvider
    │   ├── page.tsx
    │   ├── auth/                # Página de login/registro
    │   │   └── page.tsx
    │   └── events/
    │       └── ...
    ├── actions/                 # Server Actions
    │   ├── eventActions.ts      # CRUD de eventos
    │   └── aiActions.ts         # Generación con Gemini AI
    ├── contexts/                # Contextos de React
    │   └── AuthContext.tsx      # Estado de autenticación
    ├── components/
    │   ├── auth/                # Componentes de autenticación
    │   │   ├── LoginForm.tsx
    │   │   └── UserMenu.tsx
    │   ├── EventForm.tsx        # Formulario con botón "Generar con IA"
    │   └── ui/
    │       ├── avatar.tsx
    │       └── dropdown-menu.tsx
    ├── lib/
    │   ├── firebase/            # Configuración Firebase
    │   │   ├── config.ts        # Cliente (browser)
    │   │   ├── admin.ts         # Admin SDK (servidor)
    │   │   ├── firestore.ts     # Data layer
    │   │   └── storage.ts       # Firebase Storage
    │   ├── gemini.ts            # Cliente Gemini AI
    │   └── utils.ts
    └── types/
        └── event.ts             # + organizerId
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA EVENTPASS PRO                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   BROWSER (Client Components)                                            │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  AuthProvider (React Context)                                   │   │
│   │  ┌─────────────────────────────────────────────────────────┐   │   │
│   │  │  Firebase Auth SDK (cliente)                            │   │   │
│   │  │  - signInWithEmailAndPassword()                         │   │   │
│   │  │  - signInWithPopup(GoogleProvider)                      │   │   │
│   │  │  - onAuthStateChanged()                                 │   │   │
│   │  └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                 │   │
│   │  EventForm.tsx ─────────────────────────────────────────────┐   │   │
│   │  │  Botón "Generar con IA" → Llama Server Actions          │   │   │
│   │  └──────────────────────────────────────────────────────────┘   │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   ════════════════════════════════│══════════════════════════════════   │
│                                   │ Server Actions                       │
│   SERVER                          ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  ┌─────────────────────────────────────────────────────────┐   │   │
│   │  │               Server Actions (actions/)                  │   │   │
│   │  │  ┌─────────────────┐    ┌─────────────────┐             │   │   │
│   │  │  │ eventActions.ts │    │  aiActions.ts   │             │   │   │
│   │  │  │  CRUD eventos   │    │ Gemini AI gen   │             │   │   │
│   │  │  └────────┬────────┘    └────────┬────────┘             │   │   │
│   │  └───────────┼──────────────────────┼───────────────────────┘   │   │
│   │              ▼                      ▼                            │   │
│   │  ┌─────────────────┐    ┌─────────────────┐                    │   │
│   │  │ Firebase Admin  │    │   Gemini AI     │                    │   │
│   │  │  (Firestore)    │    │  (@google/genai)│                    │   │
│   │  └─────────────────┘    └─────────────────┘                    │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

> **Server Actions vs API Routes:** Este proyecto usa Server Actions para todas las
> operaciones del servidor (CRUD + AI). Esto simplifica el código al eliminar la
> necesidad de crear endpoints REST manuales.

---

## Configuracion de Firebase

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto (o usa uno existente)
3. Habilita los servicios necesarios:
   - **Authentication**: Email/Password + Google
   - **Firestore Database**: Base de datos NoSQL
   - **Storage** (opcional): Para almacenar imagenes de posters

### Security

By default, we use standard Firestore and Storage rules requiring authentication for writes.

### Firestore Indexes
If you encounter a `FAILED_PRECONDITION` error related to indexes, check the browser console. Firestore usually provides a direct link to create the required compound index in your Firebase Console. This is common when filtering events by multiple fields (e.g., status + date).

### 2. Configurar Authentication

1. Firebase Console → Authentication → Sign-in method
2. Habilita **Correo electronico/Contrasena**
3. Habilita **Google** (configura el email de soporte)
4. En **Authorized domains**, agrega `localhost` para desarrollo

### 3. Configurar Firestore

1. Firebase Console → Firestore Database → Crear base de datos
2. Selecciona **modo de prueba** para desarrollo (o configura reglas)
3. Elige una ubicacion cercana a tus usuarios

**Reglas de seguridad sugeridas:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Cualquiera puede leer eventos publicados
      allow read: if resource.data.status == 'publicado';

      // Solo usuarios autenticados pueden crear
      allow create: if request.auth != null;

      // Solo el organizador puede modificar su evento
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.organizerId;
    }
  }
}
```

### 4. Obtener Credenciales del Cliente

1. Firebase Console → Configuracion del proyecto (icono de engranaje)
2. Seccion **Tus apps** → Agrega una app web
3. Copia los valores de configuracion:

```
apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
```

### 5. Obtener Credenciales de Admin (Servidor)

1. Firebase Console → Configuracion → **Cuentas de servicio**
2. Clic en **Generar nueva clave privada**
3. Descarga el archivo JSON
4. Copia `project_id`, `client_email` y `private_key`

### 6. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```bash
# Cliente (visibles en el navegador)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Admin/Servidor (secretos)
FIREBASE_ADMIN_PROJECT_ID=tu-proyecto
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANTE:**
- Las variables `NEXT_PUBLIC_*` son visibles en el cliente (no son secretas)
- Las variables `FIREBASE_ADMIN_*` son secretas (solo servidor)
- NUNCA subas `.env.local` a git

---

## Configuracion de Gemini AI

### 1. Obtener API Key

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea una nueva API key

### 2. Configurar Variable de Entorno

En tu archivo `.env.local`:

```bash
GOOGLE_AI_API_KEY=tu_gemini_api_key_aqui
```

### 3. Uso en la Aplicacion

El boton "Generar con IA" en el formulario de eventos usa Gemini para crear descripciones atractivas automaticamente.

---

## Configuración y Ejecución

### Prerrequisitos

- Node.js 20.19+ o 22.12+
- npm 10+
- Cuenta de Firebase
- Cuenta de Google AI Studio

### Instalación

```bash
# Navegar al directorio del módulo
cd web/module5-event-pass-pro

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales reales
```

### Comandos Disponibles

```bash
# Servidor de desarrollo con Turbopack
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Build de producción
npm run build

# Ejecutar versión de producción
npm start

# Ejecutar linter
npm run lint
```

---

## Características Nuevas vs Module 4

| Característica         | Module 4              | Module 5 (Pro)            |
| ---------------------- | --------------------- | ------------------------- |
| Almacenamiento         | Memoria (volátil)     | Firestore (persistente)   |
| Autenticación          | No                    | Firebase Auth             |
| Generación contenido   | Manual                | Gemini AI                 |
| Eventos por usuario    | No                    | Sí (organizerId)          |
| Login social           | No                    | Google OAuth              |

---

## Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FLUJO DE AUTENTICACIÓN                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. USUARIO HACE CLIC EN "INICIAR SESIÓN"                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  → Navega a /auth                                               │   │
│   │  → LoginForm muestra formulario                                 │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   2. USUARIO INGRESA CREDENCIALES (o Google)                            │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  signInWithEmailAndPassword(auth, email, password)              │   │
│   │  // o signInWithPopup(auth, GoogleProvider)                     │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   3. FIREBASE NOTIFICA CAMBIO DE ESTADO                                 │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  onAuthStateChanged(auth, (user) => {                           │   │
│   │    setUser(user);  // AuthContext se actualiza                  │   │
│   │  });                                                            │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   4. UI REACCIONA AUTOMÁTICAMENTE                                       │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  - Header muestra avatar del usuario                            │   │
│   │  - Botón "Crear Evento" usa organizerId                         │   │
│   │  - "Mis Eventos" filtra por usuario                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Seguridad

### Reglas de Firestore (ejemplo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Cualquiera puede leer eventos publicados
      allow read: if resource.data.status == 'publicado';

      // Solo el organizador puede modificar su evento
      allow write: if request.auth != null
        && request.auth.uid == resource.data.organizerId;
    }
  }
}
```

### Variables de Entorno

- `NEXT_PUBLIC_*`: Visibles en el cliente (no sensibles)
- `FIREBASE_ADMIN_*`: Solo servidor (secretos)
- `GOOGLE_AI_API_KEY`: Solo servidor (secreto)

---

## Experimentos Sugeridos

1. **Firestore Rules**: Implementa reglas de seguridad completas
2. **Realtime Updates**: Usa onSnapshot para actualizaciones en tiempo real
3. **Cloud Functions**: Envía emails cuando alguien se registra
4. **Storage**: Permite subir imágenes de eventos
5. **Analytics**: Integra Firebase Analytics

---

## Notas Educativas

### Client vs Server SDK

```typescript
// ❌ INCORRECTO: Usar firebase-admin en el cliente
import { adminDb } from '@/lib/firebase/admin';
// Expone credenciales del servidor

// ✅ CORRECTO: Usar firebase (cliente) en componentes 'use client'
import { auth } from '@/lib/firebase/config';

// ✅ CORRECTO: Usar firebase-admin solo en Server Actions/API Routes
// 'use server' o route.ts
import { adminDb } from '@/lib/firebase/admin';
```

### API Keys de IA

```typescript
// ❌ INCORRECTO: Llamar a Gemini desde el cliente
// Expone la API key en el navegador
const genAI = new GoogleGenAI({ apiKey: 'sk-...' }); // ¡PELIGRO!

// ✅ CORRECTO: Usar Server Actions
// El cliente llama a la Server Action, que ejecuta en el servidor
// La API key NUNCA llega al navegador
'use server';
export async function generateEventDetailsAction(title: string) {
  const client = getGeminiClient(); // API key solo en servidor
  // ...
}
```

---

## Licencia

Este proyecto es de uso educativo y fue creado como material de aprendizaje.

---

## Créditos

> Este proyecto ha sido generado usando Claude Code y adaptado con fines educativos por Adrián Catalán.
