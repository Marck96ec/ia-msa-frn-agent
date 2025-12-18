import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_ID_KEY = 'baby_shower_user_id';
  private readonly CONVERSATION_ID_KEY = 'baby_shower_conversation_id';
  private readonly USER_NAME_KEY = 'baby_shower_user_name';

  /**
   * Obtiene o crea el userId anónimo
   */
  getUserId(): string {
    let userId = localStorage.getItem(this.USER_ID_KEY);
    if (!userId) {
      userId = `anon_${uuidv4()}`;
      localStorage.setItem(this.USER_ID_KEY, userId);
    }
    return userId;
  }

  /**
   * Establece el nombre del usuario
   */
  setUserName(name: string): void {
    localStorage.setItem(this.USER_NAME_KEY, name);
  }

  /**
   * Obtiene el nombre del usuario
   */
  getUserName(): string | null {
    return localStorage.getItem(this.USER_NAME_KEY);
  }

  /**
   * Obtiene el conversationId actual
   */
  getConversationId(): string | null {
    return localStorage.getItem(this.CONVERSATION_ID_KEY);
  }

  /**
   * Establece el conversationId
   */
  setConversationId(conversationId: string): void {
    localStorage.setItem(this.CONVERSATION_ID_KEY, conversationId);
  }

  /**
   * Limpia el conversationId (nueva conversación)
   */
  clearConversationId(): void {
    localStorage.removeItem(this.CONVERSATION_ID_KEY);
  }

  /**
   * Limpia todos los datos del usuario
   */
  clearAll(): void {
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.CONVERSATION_ID_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
  }
}
