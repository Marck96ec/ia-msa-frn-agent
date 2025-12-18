# 🎯 Guía Rápida: Crear Evento de Prueba

## ⚠️ Error Común

Si ves este error:

```json
{
  "details": "Evento no encontrado: demo",
  "message": "Error interno del servidor",
  "status": 500
}
```

**Significa que necesitas crear el evento primero en el backend.**

---

## � Opción 1: Usar Scripts (Recomendado)

### Crear evento y regalos automáticamente:

```powershell
# Paso 1: Crear el evento
.\create-demo-event.ps1

# Paso 2: Agregar regalos de ejemplo
.\add-demo-gifts.ps1
```

¡Listo! Ahora puedes acceder a http://localhost:4201/e/demo

---

## 📝 Opción 2: Manualmente (API Calls)

### Paso 1: Crear un Evento

Usa esta petición al backend para crear un evento de prueba:

### **Endpoint:** `POST http://localhost:8080/api/v1/events`

### **Body (JSON):**

```json
{
  "slug": "demo",
  "name": "Baby Shower de María",
  "description": "Celebremos juntos la llegada de nuestra bebé",
  "eventDate": "2025-12-25T15:00:00",
  "location": "Casa de los abuelos",
  "locationUrl": "https://maps.google.com/?q=Casa+Abuelos",
  "welcomeMessage": "¡Te esperamos con mucho cariño!",
  "closingMessage": "Gracias por ser parte de este momento especial",
  "organizerUserId": "org-123",
  "organizerName": "Juan y María",
  "organizerEmail": "maria@example.com",
  "organizerPhone": "+593991234567",
  "allowSharedGifts": true,
  "allowBabyMessages": true,
  "allowIdeas": true,
  "imageUrl": "https://example.com/baby-shower.jpg"
}
```

### **Usando cURL:**

```bash
curl -X POST http://localhost:8080/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "demo",
    "name": "Baby Shower de María",
    "description": "Celebremos juntos la llegada de nuestra bebé",
    "eventDate": "2025-12-25T15:00:00",
    "location": "Casa de los abuelos",
    "locationUrl": "https://maps.google.com/?q=Casa+Abuelos",
    "welcomeMessage": "¡Te esperamos con mucho cariño!",
    "closingMessage": "Gracias por ser parte de este momento especial",
    "organizerUserId": "org-123",
    "organizerName": "Juan y María",
    "organizerEmail": "maria@example.com",
    "organizerPhone": "+593991234567",
    "allowSharedGifts": true,
    "allowBabyMessages": true,
    "allowIdeas": true
  }'
```

### **Usando PowerShell:**

```powershell
$body = @{
    slug = "demo"
    name = "Baby Shower de María"
    description = "Celebremos juntos la llegada de nuestra bebé"
    eventDate = "2025-12-25T15:00:00"
    location = "Casa de los abuelos"
    locationUrl = "https://maps.google.com/?q=Casa+Abuelos"
    welcomeMessage = "¡Te esperamos con mucho cariño!"
    closingMessage = "Gracias por ser parte de este momento especial"
    organizerUserId = "org-123"
    organizerName = "Juan y María"
    organizerEmail = "maria@example.com"
    organizerPhone = "+593991234567"
    allowSharedGifts = $true
    allowBabyMessages = $true
    allowIdeas = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/events" -Method Post -Body $body -ContentType "application/json"
```

---

## 🎁 Paso 2: Agregar Regalos (Opcional)

Una vez creado el evento, agrega algunos regalos de prueba:

### **Endpoint:** `POST http://localhost:8080/api/v1/events/{eventId}/gifts`

### **Body (JSON):**

```json
{
  "name": "Cuna de madera",
  "description": "Cuna clásica de madera blanca",
  "price": 350.0,
  "imageUrl": "https://example.com/cuna.jpg",
  "allowSplit": true,
  "priority": 1
}
```

### **Ejemplos de más regalos:**

```json
[
  {
    "name": "Cuna de madera",
    "description": "Cuna clásica de madera blanca",
    "price": 350.0,
    "allowSplit": true,
    "priority": 1
  },
  {
    "name": "Carriola",
    "description": "Carriola convertible 3 en 1",
    "price": 280.0,
    "allowSplit": true,
    "priority": 2
  },
  {
    "name": "Ropa de bebé",
    "description": "Set de 10 piezas (0-6 meses)",
    "price": 85.0,
    "allowSplit": false,
    "priority": 3
  },
  {
    "name": "Pañalera",
    "description": "Bolsa organizadora para pañales",
    "price": 45.0,
    "allowSplit": false,
    "priority": 4
  },
  {
    "name": "Monitor de bebé",
    "description": "Monitor con cámara y audio",
    "price": 150.0,
    "allowSplit": true,
    "priority": 5
  }
]
```

---

## ✅ Paso 3: Verificar

Ahora puedes acceder a:

- **Frontend:** http://localhost:4201/e/demo
- **API directa:** http://localhost:8080/api/v1/events/demo

---

## 🔧 Troubleshooting

### Error: "Puerto 8080 no responde"

Asegúrate de que el backend esté corriendo en `http://localhost:8080`

### Error: "CORS"

Verifica que el backend tenga configurado CORS para permitir `http://localhost:4201`

### Error: "404 Not Found"

El slug debe coincidir exactamente. Si creaste el evento con slug "demo", accede a `/e/demo`

### Error: "Required request body is missing"

Asegúrate de incluir el header `Content-Type: application/json` en las peticiones POST

---

## 📱 Prueba el Journey Completo

Una vez configurado:

1. **Bienvenida** → http://localhost:4201/e/demo
2. **Confirmar asistencia** → http://localhost:4201/e/demo/rsvp
3. **Elegir apoyo** → http://localhost:4201/e/demo/support
4. **Ver regalos** → http://localhost:4201/e/demo/gifts
5. **Dejar mensaje** → http://localhost:4201/e/demo/baby-message
6. **Chat** → http://localhost:4201/e/demo/chat

---

## 🎨 Personalización

Puedes crear eventos con diferentes slugs:

- `/e/baby-maria-2025`
- `/e/shower-juan`
- `/e/bienvenida-sofia`

Cada uno será un evento independiente.
