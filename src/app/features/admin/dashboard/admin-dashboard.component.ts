import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900">🎉 Panel de Administración</h1>
          <p class="text-gray-600 mt-1">Gestiona tu evento desde aquí</p>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Navigation Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Gifts Report -->
          <a
            [routerLink]="['/admin', eventSlug, 'gifts']"
            class="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div class="flex items-center gap-4">
              <div class="text-5xl group-hover:scale-110 transition-transform">🎁</div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900 group-hover:text-primary-600">Reporte de Regalos</h2>
                <p class="text-gray-600 mt-1">Ver lista de regalos reservados y quién los apartó</p>
              </div>
              <div class="text-gray-400 group-hover:text-primary-600 text-2xl">→</div>
            </div>
          </a>

          <!-- Attendees Summary -->
          <a
            [routerLink]="['/admin', eventSlug, 'attendees']"
            class="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div class="flex items-center gap-4">
              <div class="text-5xl group-hover:scale-110 transition-transform">👥</div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900 group-hover:text-primary-600">Lista de Invitados</h2>
                <p class="text-gray-600 mt-1">Ver asistentes confirmados y conteo de acompañantes</p>
              </div>
              <div class="text-gray-400 group-hover:text-primary-600 text-2xl">→</div>
            </div>
          </a>

          <!-- Ideas -->
          <a
            [routerLink]="['/admin', eventSlug, 'ideas']"
            class="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div class="flex items-center gap-4">
              <div class="text-5xl group-hover:scale-110 transition-transform">💡</div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900 group-hover:text-primary-600">Ideas de Colaboración</h2>
                <p class="text-gray-600 mt-1">Ver propuestas de apoyo de los invitados</p>
              </div>
              <div class="text-gray-400 group-hover:text-primary-600 text-2xl">→</div>
            </div>
          </a>

          <!-- Baby Messages -->
          <a
            [routerLink]="['/admin', eventSlug, 'baby-messages']"
            class="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div class="flex items-center gap-4">
              <div class="text-5xl group-hover:scale-110 transition-transform">💌</div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900 group-hover:text-primary-600">Mensajes para el Bebé</h2>
                <p class="text-gray-600 mt-1">Ver mensajes de cariño de los invitados</p>
              </div>
              <div class="text-gray-400 group-hover:text-primary-600 text-2xl">→</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  eventSlug = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.eventSlug = this.route.snapshot.paramMap.get('eventId') || '';
  }
}
