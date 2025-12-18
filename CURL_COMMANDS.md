# 📋 Comandos cURL - Evento Demo

## 📝 Paso 1: Crear Evento

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

---

## 🔍 Paso 2: Obtener ID del Evento

```bash
curl http://localhost:8080/api/v1/events/demo
```

**⚠️ Importante:** Guarda el `id` que aparece en la respuesta JSON. Lo necesitarás para el siguiente paso.

Ejemplo de respuesta:

```json
{
  "id": 1,
  "slug": "demo",
  "name": "Baby Shower de María",
  ...
}
```

---

## 🎁 Paso 3: Agregar Regalos

**Reemplaza `1` con el ID real del evento que obtuviste en el paso anterior.**

### Regalo 1: Cuna de madera ($350)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cuna de madera",
    "description": "Cuna clásica de madera blanca con colchón incluido",
    "price": 350.00,
    "allowSplit": true,
    "priority": 1
  }'
```

### Regalo 2: Carriola ($280)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carriola",
    "description": "Carriola convertible 3 en 1 con asiento para auto",
    "price": 280.00,
    "allowSplit": true,
    "priority": 2
  }'
```

### Regalo 3: Ropa de bebé ($85)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ropa de bebé",
    "description": "Set de 10 piezas (0-6 meses) - bodys, pijamas y gorros",
    "price": 85.00,
    "allowSplit": false,
    "priority": 3
  }'
```

### Regalo 4: Pañalera ($45)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pañalera",
    "description": "Bolsa organizadora para pañales con múltiples compartimentos",
    "price": 45.00,
    "allowSplit": false,
    "priority": 4
  }'
```

### Regalo 5: Monitor de bebé ($150)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monitor de bebé",
    "description": "Monitor con cámara HD y audio bidireccional",
    "price": 150.00,
    "allowSplit": true,
    "priority": 5
  }'
```

### Regalo 6: Bañera plegable ($65)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bañera plegable",
    "description": "Bañera ergonómica con termómetro integrado",
    "price": 65.00,
    "allowSplit": false,
    "priority": 6
  }'
```

### Regalo 7: Silla para auto ($220)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Silla para auto",
    "description": "Silla de seguridad para auto (0-4 años)",
    "price": 220.00,
    "allowSplit": true,
    "priority": 7
  }'
```

### Regalo 8: Juguetes sensoriales ($55)

```bash
curl -X POST http://localhost:8080/api/v1/events/1/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juguetes sensoriales",
    "description": "Set de 8 juguetes para estimulación temprana",
    "price": 55.00,
    "allowSplit": false,
    "priority": 8
  }'
```

---

## ✅ Paso 4: Verificar Regalos

```bash
curl http://localhost:8080/api/v1/events/1/gifts
```

---

## 🌐 Paso 5: Acceder al Frontend

Ahora puedes abrir tu navegador en:

**http://localhost:4201/e/demo**

---

## 💡 Notas

- Todos los comandos asumen que el backend está en `http://localhost:8080`
- Reemplaza `1` con el ID real del evento en todos los comandos de regalos
- Los regalos con `"allowSplit": true` permiten aportes parciales
- Los regalos con `"allowSplit": false` solo pueden ser reservados completos

---

## 🐛 Troubleshooting

### Error de conexión

```bash
# Verifica que el backend esté corriendo
curl http://localhost:8080/api/v1/events
```

### Error 404

```bash
# Verifica que el endpoint exista
curl -I http://localhost:8080/api/v1/events
```

### Error 500

- Revisa los logs del backend
- Verifica que la base de datos esté disponible
- Confirma que el JSON esté bien formado
