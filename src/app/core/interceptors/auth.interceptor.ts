import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor que agrega headers de autenticación a todas las requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Obtener userId y conversationId
  const userId = authService.getUserId();
  const conversationId = authService.getConversationId();

  // Clonar request y agregar headers
  let clonedReq = req.clone({
    setHeaders: {
      'X-User-Id': userId
    }
  });

  // Agregar conversationId si existe
  if (conversationId) {
    clonedReq = clonedReq.clone({
      setHeaders: {
        'X-Conversation-Id': conversationId
      }
    });
  }

  return next(clonedReq);
};
