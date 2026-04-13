# Stack Tecnológico - Módulo 5

## Versiones de Dependencias (Diciembre 2025)

Este documento registra las versiones exactas de las dependencias utilizadas en este módulo, actualizadas en diciembre de 2025.

---

## Dependencias de Produccion

| Paquete                    | Version  | Proposito                                      |
| -------------------------- | -------- | ---------------------------------------------- |
| next                       | 16.1.1   | Framework React fullstack                      |
| react                      | 19.2.1   | Biblioteca UI                                  |
| react-dom                  | 19.2.1   | Renderizado React para DOM                     |
| firebase                   | ^12.7.0  | SDK cliente de Firebase                        |
| firebase-admin             | ^13.6.0  | SDK admin de Firebase (servidor)               |
| firebase-admin-auth        | ^1.0.0   | Utilidad de autenticacion Firebase Admin        |
| react-firebase-hooks       | ^5.1.1   | Hooks de React para Firebase                   |
| @google/genai              | ^1.34.0  | SDK de Google Gemini AI                        |
| zod                        | 4.1.9    | Validacion de esquemas en runtime              |
| @radix-ui/react-alert-dialog | ^1.1.15 | Componente Alert Dialog accesible              |
| @radix-ui/react-dialog     | 1.1.4    | Componente Dialog accesible                    |
| @radix-ui/react-label      | 2.1.1    | Componente Label accesible                     |
| @radix-ui/react-select     | 2.1.4    | Componente Select accesible                    |
| @radix-ui/react-slot       | 1.1.1    | Utilidad para composición                      |
| @radix-ui/react-toast      | 1.2.4    | Notificaciones toast                           |
| @radix-ui/react-avatar     | 1.1.2    | Componente Avatar accesible                    |
| @radix-ui/react-dropdown-menu | 2.1.4 | Componente Dropdown accesible                  |
| class-variance-authority   | 0.7.1    | Variantes de componentes                       |
| clsx                       | 2.1.1    | Utilidad para clases condicionales             |
| tailwind-merge             | 2.6.0    | Merge de clases Tailwind                       |
| lucide-react               | 0.469.0  | Iconos React                                   |

---

## Dependencias de Desarrollo

| Paquete              | Version  | Proposito                                      |
| -------------------- | -------- | ---------------------------------------------- |
| typescript           | 5.9.3    | Lenguaje con tipado estatico                   |
| tailwindcss          | 4.1.8    | Framework CSS utility-first (v4)               |
| @tailwindcss/postcss | 4.1.8    | Plugin PostCSS para Tailwind v4                |
| eslint               | 9.17.0   | Linter para JavaScript/TypeScript              |
| eslint-config-next   | 16.1.1   | Configuracion ESLint para Next.js              |
| @types/react         | 19.2.1   | Tipos de TypeScript para React                 |
| @types/react-dom     | 19.2.1   | Tipos de TypeScript para React DOM             |
| @types/node          | 22.10.2  | Tipos de TypeScript para Node.js               |

---

## Servicios Externos

| Servicio           | Propósito                                       |
| ------------------ | ----------------------------------------------- |
| Firebase Auth      | Autenticación de usuarios (email/password, Google) |
| Firebase Firestore | Base de datos NoSQL en tiempo real              |
| Firebase Storage   | Almacenamiento de archivos (imágenes de eventos)|
| Google Gemini AI   | Generación de descripciones con IA              |

---

## Notas sobre las versiones

### Firebase 12.7.0

- **Auth**: Soporte para multiples proveedores de autenticacion
- **Firestore**: Base de datos en tiempo real con listeners
- **Storage**: Almacenamiento de archivos con URLs publicas

### Google GenAI SDK 1.34.0

- **Modelo texto**: gemini-3-flash-preview para generacion rapida de texto
- **Modelo imagen**: gemini-3-pro-image-preview para generacion de imagenes
- **SDK**: @google/genai para integracion con Node.js

### Tailwind CSS 4.1.8

- **@tailwindcss/postcss**: Plugin para Next.js
- **Configuración CSS-first**: Sin tailwind.config.js
- **Tema en CSS**: Variables definidas con `@theme inline`

---

## Cambios vs Versión Anterior

| Aspecto              | Antes (v3)           | Ahora (v4)            |
| -------------------- | -------------------- | --------------------- |
| Tailwind CSS         | 3.4.17               | 4.1.8                 |
| PostCSS Plugin       | tailwindcss          | @tailwindcss/postcss  |
| Autoprefixer         | Requerido            | Incluido en Tailwind  |
| tailwind.config.ts   | Requerido            | Eliminado             |
| CSS Import           | `@tailwind base;`    | `@import 'tailwindcss'` |
| Tema Shadcn          | JS config            | `@theme inline`       |

---

## Variables de Entorno Requeridas

```bash
# Firebase Cliente (públicas)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (secretas)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Google Gemini AI (secreta)
GOOGLE_AI_API_KEY=
```

---

## Requisitos del Sistema

| Requisito          | Mínimo    | Recomendado |
| ------------------ | --------- | ----------- |
| Node.js            | 20.19+    | 22.12+      |
| npm                | 10.0+     | 10.9+       |

---

## Navegadores Soportados

Tailwind CSS v4 requiere navegadores modernos:

| Navegador          | Versión Mínima |
| ------------------ | -------------- |
| Chrome             | 111+           |
| Firefox            | 128+           |
| Safari             | 16.4+          |
| Edge               | 111+           |

---

## Verificación de Versiones

```bash
# TypeScript
npx tsc --version

# Next.js
npx next --version

# Node.js
node --version

# npm
npm --version
```
