# Script para agregar regalos de prueba al evento demo
# Uso: .\add-demo-gifts.ps1 [eventId]
# Si no proporcionas eventId, el script intentará obtenerlo del evento con slug "demo"

param(
    [Parameter(Mandatory=$false)]
    [int]$EventId
)

Write-Host "🎁 Agregando regalos de prueba..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api/v1"

# Si no se proporcionó eventId, intentar obtenerlo
if (-not $EventId) {
    Write-Host "📡 Buscando evento 'demo'..." -ForegroundColor Gray
    try {
        $event = Invoke-RestMethod -Uri "$baseUrl/events/demo" -Method Get -ErrorAction Stop
        $EventId = $event.id
        Write-Host "✅ Evento encontrado: ID=$EventId" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "❌ No se pudo encontrar el evento 'demo'" -ForegroundColor Red
        Write-Host "   Crea primero el evento ejecutando: .\create-demo-event.ps1" -ForegroundColor Yellow
        exit 1
    }
}

$gifts = @(
    @{
        name = "Cuna de madera"
        description = "Cuna clásica de madera blanca con colchón incluido"
        price = 350.00
        allowSplit = $true
        priority = 1
    },
    @{
        name = "Carriola"
        description = "Carriola convertible 3 en 1 con asiento para auto"
        price = 280.00
        allowSplit = $true
        priority = 2
    },
    @{
        name = "Ropa de bebé"
        description = "Set de 10 piezas (0-6 meses) - bodys, pijamas y gorros"
        price = 85.00
        allowSplit = $false
        priority = 3
    },
    @{
        name = "Pañalera"
        description = "Bolsa organizadora para pañales con múltiples compartimentos"
        price = 45.00
        allowSplit = $false
        priority = 4
    },
    @{
        name = "Monitor de bebé"
        description = "Monitor con cámara HD y audio bidireccional"
        price = 150.00
        allowSplit = $true
        priority = 5
    },
    @{
        name = "Bañera plegable"
        description = "Bañera ergonómica con termómetro integrado"
        price = 65.00
        allowSplit = $false
        priority = 6
    },
    @{
        name = "Silla para auto"
        description = "Silla de seguridad para auto (0-4 años)"
        price = 220.00
        allowSplit = $true
        priority = 7
    },
    @{
        name = "Juguetes sensoriales"
        description = "Set de 8 juguetes para estimulación temprana"
        price = 55.00
        allowSplit = $false
        priority = 8
    }
)

$giftsUrl = "$baseUrl/events/$EventId/gifts"
$successCount = 0
$errorCount = 0

foreach ($gift in $gifts) {
    try {
        $giftJson = $gift | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $giftsUrl -Method Post -Body $giftJson -ContentType "application/json" -ErrorAction Stop
        
        $status = if ($gift.allowSplit) { "Compartible ✓" } else { "Individual" }
        Write-Host "  ✅ $($gift.name) - `$$($gift.price) ($status)" -ForegroundColor Green
        $successCount++
        
    } catch {
        Write-Host "  ❌ Error al crear: $($gift.name)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "📊 Resumen:" -ForegroundColor Yellow
Write-Host "  - Regalos creados: $successCount" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "  - Errores: $errorCount" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Ver regalos en:" -ForegroundColor Cyan
Write-Host "  http://localhost:4201/e/demo/gifts" -ForegroundColor White
Write-Host ""
