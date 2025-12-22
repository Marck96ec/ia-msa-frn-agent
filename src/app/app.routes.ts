import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect root
  {
    path: '',
    redirectTo: '/e/demo/welcome',
    pathMatch: 'full'
  },

  // Event Journey (Invitado)
  {
    path: 'e/:slug',
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      },
      {
        path: 'welcome',
        loadComponent: () => import('./features/event/welcome/welcome.component').then(m => m.WelcomeComponent)
      },
      {
        path: 'rsvp',
        loadComponent: () => import('./features/event/rsvp/rsvp.component').then(m => m.RsvpComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./features/event/support/support.component').then(m => m.SupportComponent)
      },
      {
        path: 'gifts',
        loadComponent: () => import('./features/event/gifts-list/gifts-list.component').then(m => m.GiftsListComponent)
      },
      {
        path: 'gifts/:giftId',
        loadComponent: () =>
          import('./features/event/gift-detail/gift-detail.component').then(m => m.GiftDetailComponent)
      },
      {
        path: 'ideas',
        loadComponent: () => import('./features/event/ideas/ideas.component').then(m => m.IdeasComponent)
      },
      {
        path: 'baby-message',
        loadComponent: () =>
          import('./features/event/baby-message/baby-message.component').then(m => m.BabyMessageComponent)
      },
      {
        path: 'chat',
        loadComponent: () => import('./features/event/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'thanks',
        loadComponent: () => import('./features/event/thanks/thanks.component').then(m => m.ThanksComponent)
      }
    ]
  },

  // Admin/Padres
  {
    path: 'admin/:eventId',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'gifts',
        loadComponent: () =>
          import('./features/admin/gifts-report/admin-gifts-report.component').then(m => m.AdminGiftsReportComponent)
      },
      {
        path: 'attendees',
        loadComponent: () =>
          import('./features/admin/attendees/admin-attendees.component').then(m => m.AdminAttendeesComponent)
      },
      {
        path: 'ideas',
        loadComponent: () => import('./features/admin/ideas/admin-ideas.component').then(m => m.AdminIdeasComponent)
      },
      {
        path: 'baby-messages',
        loadComponent: () =>
          import('./features/admin/baby-messages/admin-baby-messages.component').then(m => m.AdminBabyMessagesComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: '/e/demo/welcome'
  }
];
