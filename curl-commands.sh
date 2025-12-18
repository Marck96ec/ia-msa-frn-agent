#!/bin/bash
# Comandos cURL para crear evento de prueba y regalos
# Ejecuta estos comandos en orden

echo "🍼 Creando evento 'demo'..."
echo ""

# ============================================================================
# 1. CREAR EVENTO
# ============================================================================

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

echo ""
echo ""
echo "✅ Evento creado. Ahora obteniendo ID del evento..."
echo ""

# ============================================================================
# 2. OBTENER ID DEL EVENTO
# ============================================================================

EVENT_RESPONSE=$(curl -s http://localhost:8080/api/v1/events/demo)
EVENT_ID=$(echo $EVENT_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "Event ID: $EVENT_ID"
echo ""
echo "🎁 Agregando regalos..."
echo ""

# ============================================================================
# 3. AGREGAR REGALOS
# ============================================================================

# Regalo 1: Cuna de madera
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cuna de madera",
    "description": "Cuna clásica de madera blanca con colchón incluido",
    "price": 350.00,
    "allowSplit": true,
    "priority": 1
  }'

echo ""

# Regalo 2: Carriola
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carriola",
    "description": "Carriola convertible 3 en 1 con asiento para auto",
    "price": 280.00,
    "allowSplit": true,
    "priority": 2
  }'

echo ""

# Regalo 3: Ropa de bebé
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ropa de bebé",
    "description": "Set de 10 piezas (0-6 meses) - bodys, pijamas y gorros",
    "price": 85.00,
    "allowSplit": false,
    "priority": 3
  }'

echo ""

# Regalo 4: Pañalera
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pañalera",
    "description": "Bolsa organizadora para pañales con múltiples compartimentos",
    "price": 45.00,
    "allowSplit": false,
    "priority": 4
  }'

echo ""

# Regalo 5: Monitor de bebé
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monitor de bebé",
    "description": "Monitor con cámara HD y audio bidireccional",
    "price": 150.00,
    "allowSplit": true,
    "priority": 5
  }'

echo ""

# Regalo 6: Bañera plegable
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bañera plegable",
    "description": "Bañera ergonómica con termómetro integrado",
    "price": 65.00,
    "allowSplit": false,
    "priority": 6
  }'

echo ""

# Regalo 7: Silla para auto
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Silla para auto",
    "description": "Silla de seguridad para auto (0-4 años)",
    "price": 220.00,
    "allowSplit": true,
    "priority": 7
  }'

echo ""

# Regalo 8: Juguetes sensoriales
curl -X POST http://localhost:8080/api/v1/events/$EVENT_ID/gifts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juguetes sensoriales",
    "description": "Set de 8 juguetes para estimulación temprana",
    "price": 55.00,
    "allowSplit": false,
    "priority": 8
  }'

echo ""
echo ""
echo "✅ ¡Listo! Evento y regalos creados"
echo ""
echo "🌐 Accede al frontend en:"
echo "   http://localhost:4201/e/demo"
echo ""
