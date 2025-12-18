# Script para crear evento de prueba en el backend
# Uso: .\create-demo-event.ps1

Write-Host "🍼 Creando evento de prueba 'demo'..." -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:8080/api/v1/events"

$eventData = @{
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

try {
    Write-Host "📡 Enviando petición a: $apiUrl" -ForegroundColor Gray
    Write-Host ""
    
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $eventData -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ ¡Evento creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Detalles del evento:" -ForegroundColor Yellow
    Write-Host "  - ID: $($response.id)"
    Write-Host "  - Slug: $($response.slug)"
    Write-Host "  - Nombre: $($response.name)"
    Write-Host ""
    Write-Host "🌐 Accede al frontend en:" -ForegroundColor Cyan
    Write-Host "  http://localhost:4201/e/$($response.slug)" -ForegroundColor White
    Write-Host ""
    Write-Host "🎁 Para agregar regalos, consulta SETUP_EVENTO.md" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error al crear el evento" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response.StatusCode -eq 'NotFound') {
        Write-Host "⚠️  El backend no está disponible en $apiUrl" -ForegroundColor Yellow
        Write-Host "   Asegúrate de que el backend esté corriendo en http://localhost:8080" -ForegroundColor Gray
    }
    elseif ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Código de error: $statusCode" -ForegroundColor Gray
        
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            $errorJson = $errorBody | ConvertFrom-Json
            
            Write-Host "   Mensaje: $($errorJson.message)" -ForegroundColor Gray
            if ($errorJson.details) {
                Write-Host "   Detalles: $($errorJson.details)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "   $($_.Exception.Message)" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "💡 Verifica que:" -ForegroundColor Yellow
    Write-Host "   1. El backend esté corriendo en http://localhost:8080"
    Write-Host "   2. El endpoint /api/v1/events esté disponible"
    Write-Host "   3. No exista ya un evento con slug 'demo'"
    Write-Host ""
    
    exit 1
}
