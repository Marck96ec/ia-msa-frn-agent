# 🚀 Guía de Inicio Rápido

## ⚠️ IMPORTANTE: Primero Crea el Evento

**Antes de probar la aplicación**, debes crear el evento en el backend.

### Opción Rápida (Recomendada):

```powershell
# 1. Crear evento
.\create-demo-event.ps1

# 2. Agregar regalos (opcional)
.\add-demo-gifts.ps1
```

### O crea el evento manualmente:

Ver instrucciones completas en [SETUP_EVENTO.md](./SETUP_EVENTO.md)

---

## Prerrequisitos

- Node.js 18.x o superior
- npm 9.x o superior
- Backend corriendo en http://localhost:8080

## Instalación y Ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:4201](http://localhost:4201)

### 3. Acceder al journey de invitado

Navega a: `http://localhost:4201/e/demo`

(Reemplaza `demo` con el slug real de tu evento)

### 4. Acceder al panel admin

Navega a: `http://localhost:4200/admin/{eventId}/dashboard`

(Reemplaza `{eventId}` con el ID real del evento)

## Configuración del Backend

Actualiza la URL del backend en los archivos de environment:

**Desarrollo** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1' // ← Cambiar aquí
};
```

**Producción** (`src/environments/environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: '/api/v1' // URL relativa para producción
};
```

## Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en `dist/baby-shower-frontend/`

## Testing

```bash
# Ejecutar tests unitarios
npm test

# Coverage
npm run test:coverage
```

## Estructura de Archivos Clave

```
src/app/
├── core/
│   ├── models/           # TypeScript interfaces
│   ├── services/         # API services
│   └── interceptors/     # HTTP interceptors
├── features/
│   ├── event/            # Componentes journey invitado
│   └── admin/            # Componentes admin
├── shared/
│   └── components/       # Componentes reutilizables
└── app.routes.ts         # Configuración de rutas
```

## Flujo del Usuario (Journey)

1. **Welcome** (`/e/:slug/welcome`) - Bienvenida con detalles del evento
2. **RSVP** (`/e/:slug/rsvp`) - Confirmación de asistencia
3. **Support** (`/e/:slug/support`) - Elegir tipo de participación
4. **Gifts** (`/e/:slug/gifts`) - Lista de regalos
5. **Gift Detail** (`/e/:slug/gifts/:id`) - Detalle y acciones sobre regalo
6. **Ideas** (`/e/:slug/ideas`) - Sugerir ideas de regalo
7. **Baby Message** (`/e/:slug/baby-message`) - Mensaje para el bebé
8. **Chat** (`/e/:slug/chat`) - Chat con asistente MCG
9. **Thanks** (`/e/:slug/thanks`) - Agradecimiento final

## Características Destacadas

### 🎨 UX Conversacional

- Una decisión por pantalla
- Mensajes cálidos y humanos
- Quick replies (chips) siempre visibles
- Inputs mínimos (máximo 1 por paso)

### 📱 Mobile-First

- Diseño optimizado para dispositivos móviles
- Acceso típico via QR
- Touch-friendly buttons
- Safe areas para iOS

### 🔐 Sin Login

- Identidad anónima automática (UUID)
- Persistencia en localStorage
- Headers automáticos en todas las requests

### ✨ Animaciones

- Slide-up para contenido nuevo
- Bounce-soft para éxitos
- Fade-in suave
- Transiciones fluidas

## Problemas Comunes

### El servidor no arranca

Verifica que no haya otro proceso usando el puerto 4200:

```bash
# Windows
netstat -ano | findstr :4200

# Linux/Mac
lsof -i :4200
```

### Error de compilación de Tailwind

Asegúrate de que `tailwind.config.js` y `postcss.config.js` estén en la raíz del proyecto.

### Errores de CORS

El backend debe permitir CORS desde `http://localhost:4200` en desarrollo.

## Soporte

Para cualquier duda o problema, revisa:

- README.md principal
- Documentación de endpoints del backend
- Comentarios en el código fuente

---

¡Disfruta construyendo experiencias emocionales! 🍼💝
