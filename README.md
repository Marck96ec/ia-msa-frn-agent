# 🍼 Baby Shower - Frontend Conversacional

Frontend Angular para sistema de eventos Baby Shower con UX conversacional, mobile-first y flujo guiado tipo chat.

## ✨ Características

- **UX Conversacional**: Interacción guiada paso a paso sin formularios largos
- **Mobile-First**: Optimizado para acceso desde QR en dispositivos móviles
- **Diseño Emocional**: Mensajes cálidos, tipografía grande, alto contraste
- **Quick Replies**: Botones/chips siempre visibles para respuestas rápidas
- **Sin Login**: Gestión de identidad anónima transparente
- **Admin Dashboard**: Panel para padres/organizadores

## 🚀 Tecnologías

- Angular 17.3 (Standalone Components)
- TypeScript 5.4
- Tailwind CSS 3.4
- RxJS 7.8
- UUID para identidad anónima

## 📦 Instalación y Setup

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# La aplicación se abrirá en http://localhost:4201
```

### ⚠️ Primer Uso

**Antes de probar la aplicación, debes crear un evento en el backend.**

Lee la guía completa: **[SETUP_EVENTO.md](./SETUP_EVENTO.md)**

**Resumen rápido:**

1. El backend debe estar corriendo en `http://localhost:8080`
2. Crea un evento con slug "demo" usando POST `/api/v1/events`
3. Accede al frontend en `http://localhost:4201/e/demo`

Si ves error "Evento no encontrado", consulta [SETUP_EVENTO.md](./SETUP_EVENTO.md) para instrucciones detalladas.

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── core/                  # Servicios core, interceptors, guards
│   │   ├── services/          # API services
│   │   ├── interceptors/      # HTTP interceptors
│   │   ├── guards/            # Route guards
│   │   └── models/            # TypeScript interfaces/types
│   ├── features/              # Features por módulo
│   │   ├── event/             # Journey del invitado
│   │   │   ├── welcome/
│   │   │   ├── rsvp/
│   │   │   ├── support/
│   │   │   ├── gifts/
│   │   │   ├── ideas/
│   │   │   ├── baby-message/
│   │   │   ├── chat/
│   │   │   └── thanks/
│   │   └── admin/             # Módulo admin/padres
│   │       ├── dashboard/
│   │       ├── gifts-manager/
│   │       ├── attendees/
│   │       ├── ideas-list/
│   │       └── baby-messages-list/
│   ├── shared/                # Componentes compartidos
│   │   ├── components/        # UI components
│   │   ├── layouts/           # Layout components
│   │   └── pipes/             # Custom pipes
│   └── app.routes.ts          # Configuración de rutas
└── environments/              # Environment configs
```

## 🛣️ Rutas Principales

### Journey Invitado

- `/e/:slug` - Punto de entrada
- `/e/:slug/welcome` - Bienvenida
- `/e/:slug/rsvp` - Confirmación de asistencia
- `/e/:slug/support` - Elegir tipo de apoyo
- `/e/:slug/gifts` - Lista de regalos
- `/e/:slug/ideas` - Dejar idea de regalo
- `/e/:slug/baby-message` - Mensaje para el bebé
- `/e/:slug/chat` - Chat con MCG
- `/e/:slug/thanks` - Agradecimiento final

### Admin/Padres

- `/admin/:eventId/dashboard` - Resumen general
- `/admin/:eventId/gifts` - Gestión de regalos
- `/admin/:eventId/attendees` - Lista de asistentes
- `/admin/:eventId/ideas` - Ideas sugeridas
- `/admin/:eventId/baby-messages` - Mensajes para el bebé

## 🎨 Guía de UX

### Principios

1. **Una pantalla = una decisión**: No abrumar al usuario
2. **Contenido emocional**: Mensajes cálidos y humanos
3. **Quick Replies**: Siempre visible cuando aplica
4. **Inputs mínimos**: Máximo 1 input por paso
5. **Estados claros**: Loading, success, error con feedback amable

### Mensajes Mejorados

- ✅ "¡Quiero regalarlo!" (vs "Me hago cargo completo")
- ✅ "Aportar con cariño" (vs "Contribuir")
- ✅ "¡Ahí estaré!" (vs "Confirmar asistencia: Sí")
- ✅ "Me encantaría, pero no puedo" (vs "No")

## 🔐 Gestión de Identidad

El sistema maneja identidad anónima automáticamente:

- Genera `anonymousId` (UUID) al primer ingreso
- Almacena en localStorage
- Envía en headers a todas las requests
- Mantiene `conversationId` para continuidad del chat

## 🌐 Integración con Backend

El frontend consume la API REST del backend. Configurar la URL base en:

- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

## 📱 Responsive Design

- **Mobile**: < 768px (diseño principal)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test:coverage
```

## 🏗️ Build para Producción

```bash
# Build optimizado estándar
npm run build

# Build listo para Render (inyecta NG_APP_API_URL si está configurada)
npm run render-build

# Los archivos se generarán en dist/
```

## 📄 Licencia

MIT
