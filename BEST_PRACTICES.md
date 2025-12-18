# 📖 Guía de Mejores Prácticas y Uso

## 🎯 Convenciones de Código

### Naming Conventions

#### Componentes
```typescript
// ✅ Correcto
export class WelcomeComponent { }
export class GiftDetailComponent { }

// ❌ Incorrecto
export class welcome { }
export class GiftDetails { }
```

#### Servicios
```typescript
// ✅ Correcto
export class EventService { }
export class GiftService { }

// ❌ Incorrecto
export class EventsService { }
export class GiftsAPI { }
```

#### Interfaces/Models
```typescript
// ✅ Correcto
export interface Event { }
export interface CreateGiftRequest { }

// ❌ Incorrecto
export interface EventModel { }
export interface IEvent { }
```

---

## 🔧 Uso de Servicios

### Inyección de Dependencias

```typescript
// ✅ Correcto - Inyección en constructor
constructor(
  private eventService: EventService,
  private router: Router
) {}

// ❌ Evitar - Inyección manual
import { inject } from '@angular/core';
eventService = inject(EventService); // Solo en funciones
```

### Manejo de Observables

```typescript
// ✅ Correcto - Subscribe con next/error
this.eventService.getEventBySlug(slug).subscribe({
  next: (event) => {
    this.event = event;
    this.loading = false;
  },
  error: (err) => {
    this.error = this.handleError(err);
    this.loading = false;
  }
});

// ❌ Evitar - Subscribe legacy
this.eventService.getEventBySlug(slug).subscribe(
  (event) => { /* ... */ },
  (error) => { /* ... */ }
);
```

### Unsubscribe

```typescript
// ✅ Correcto - Para subscripciones largas
private destroy$ = new Subject<void>();

ngOnInit() {
  this.stateService.currentEvent$
    .pipe(takeUntil(this.destroy$))
    .subscribe(event => this.event = event);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// ✅ También válido - Subscribe directo si es corto
// (El componente standalone se encarga del cleanup)
this.eventService.getEventBySlug(slug).subscribe({...});
```

---

## 🎨 Uso de Estilos Tailwind

### Clases Predefinidas

```html
<!-- ✅ Usar clases del sistema -->
<button class="btn-primary">Click me</button>
<div class="card">Content</div>

<!-- ❌ Evitar estilos inline custom -->
<button style="background: pink; padding: 10px">Click me</button>
```

### Responsive Design

```html
<!-- ✅ Mobile-first approach -->
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<!-- ❌ Desktop-first -->
<div class="text-lg md:text-base sm:text-sm">
  Wrong approach
</div>
```

---

## 🔐 Gestión de Estado

### Usar StateService para estado compartido

```typescript
// ✅ Correcto - Usar StateService
constructor(private stateService: StateService) {}

ngOnInit() {
  const event = this.stateService.getCurrentEvent();
  // O suscribirse al observable
  this.stateService.currentEvent$.subscribe(event => {
    this.event = event;
  });
}

// ❌ Evitar - Pasar datos por @Input en routes
// (Usar StateService o route params en su lugar)
```

### Guardar en LocalStorage

```typescript
// ✅ Correcto - Usar AuthService
this.authService.setUserName('Juan');
const name = this.authService.getUserName();

// ❌ Evitar - localStorage directo en componentes
localStorage.setItem('name', 'Juan');
```

---

## 🎯 Manejo de Errores

### Mensajes Amigables

```typescript
// ✅ Correcto - Mensaje humano
this.error = {
  title: 'No pudimos cargar el evento',
  message: 'Verifica que el enlace sea correcto o intenta nuevamente.',
  icon: '🤔'
};

// ❌ Evitar - Error técnico
this.error = {
  title: 'Error 404',
  message: err.message,
  icon: '❌'
};
```

### Try-Catch vs Subscribe Error

```typescript
// ✅ Correcto - Manejar error en subscribe
this.service.getData().subscribe({
  next: (data) => { /* ... */ },
  error: (err) => { this.handleError(err); }
});

// ❌ Evitar - try-catch con Observables
try {
  this.service.getData(); // No funciona con async
} catch (e) { }
```

---

## 🚦 Loading States

### Pattern Recomendado

```typescript
// ✅ Correcto - Loading antes de la request
submit() {
  this.loading = true;
  this.error = null;

  this.service.save(data).subscribe({
    next: (result) => {
      this.loading = false;
      this.success = true;
    },
    error: (err) => {
      this.loading = false;
      this.error = this.handleError(err);
    }
  });
}

// ❌ Evitar - Loading sin reset en error
submit() {
  this.loading = true;
  this.service.save(data).subscribe({
    next: () => { this.loading = false; }
    // Error: loading queda en true
  });
}
```

---

## 🎨 Componentes Template

### Uso de *ngIf y *ngFor

```html
<!-- ✅ Correcto - ng-container para lógica -->
<ng-container *ngIf="!loading && !error">
  <div class="content">...</div>
</ng-container>

<!-- ❌ Evitar - divs innecesarios -->
<div *ngIf="!loading">
  <div *ngIf="!error">
    <div class="content">...</div>
  </div>
</div>
```

### Binding

```html
<!-- ✅ Correcto - Property binding -->
<img [src]="gift.imageUrl" [alt]="gift.name">

<!-- ❌ Evitar - Interpolación donde no es necesario -->
<img src="{{ gift.imageUrl }}" alt="{{ gift.name }}">
```

---

## 📱 Navegación

### Router Navigation

```typescript
// ✅ Correcto - Navegación programática
navigate(path: string) {
  this.router.navigate([`/e/${this.slug}/${path}`]);
}

// ✅ También válido - RouterLink en template
<a [routerLink]="['/e', slug, 'gifts']">Ver regalos</a>

// ❌ Evitar - window.location
window.location.href = `/e/${this.slug}/gifts`;
```

---

## 🎯 Quick Wins

### 1. Reutilizar Componentes Compartidos

```typescript
// ✅ Siempre importar de shared/components
import { LoadingSpinnerComponent } from '@shared/components';

// No duplicar código de loading en cada componente
```

### 2. Usar Path Aliases

```typescript
// ✅ Correcto
import { EventService } from '@core/services';
import { Event } from '@core/models';

// ❌ Evitar paths relativos largos
import { EventService } from '../../../core/services/event.service';
```

### 3. TypeScript Estricto

```typescript
// ✅ Correcto - Tipado explícito
userName: string = '';
event: Event | null = null;

// ❌ Evitar - any o sin tipo
userName;
event: any;
```

---

## 🚀 Performance

### Lazy Loading

```typescript
// ✅ Ya implementado en routes
{
  path: 'welcome',
  loadComponent: () => import('./welcome/welcome.component')
    .then(m => m.WelcomeComponent)
}

// Esto carga el componente solo cuando se navega a esa ruta
```

### Change Detection

```typescript
// ✅ Usar OnPush cuando sea posible (futuro)
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Por ahora, Default está bien para este proyecto
```

---

## 📦 Build y Deploy

### Desarrollo

```bash
npm start
# http://localhost:4200
```

### Producción

```bash
npm run build
# Output: dist/baby-shower-frontend/
```

### Environment Variables

```typescript
// Usar environment files
import { environment } from '@environments/environment';

const apiUrl = environment.apiUrl;
```

---

## 🧪 Testing (Preparado)

### Test Unitario Básico

```typescript
describe('WelcomeComponent', () => {
  it('should create', () => {
    const component = new WelcomeComponent(/* deps */);
    expect(component).toBeTruthy();
  });

  it('should load event on init', () => {
    // Test implementation
  });
});
```

---

## 🎉 Checklist de Calidad

Antes de hacer commit:

- [ ] ✅ No hay errores de TypeScript
- [ ] ✅ Imports organizados (core, shared, features)
- [ ] ✅ Nombres descriptivos y consistentes
- [ ] ✅ Mensajes amigables (revisar MENSAJES_AMIGABLES.md)
- [ ] ✅ Loading y error states implementados
- [ ] ✅ Responsive design verificado
- [ ] ✅ No hay console.log olvidados
- [ ] ✅ Componentes standalone correctamente configurados

---

## 📚 Recursos

- [Angular Docs](https://angular.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [RxJS Docs](https://rxjs.dev)
- MENSAJES_AMIGABLES.md (este proyecto)

---

**¡Happy Coding! 🎉**
