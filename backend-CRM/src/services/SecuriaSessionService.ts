import { AuthRequest } from '../types/types';
import logger from '../../utils/logger';

// In-memory store for Securia sessions (in production, use Redis or database)
const securiaSessionStore = new Map<string, { userId: string, timestamp: number }>();

// Session timeout: 8 hours
const SECURIA_SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

/**
 * Service class for managing Securia user sessions
 */
export class SecuriaSessionService {
  /**
   * Clean expired sessions from memory
   */
  static cleanExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of securiaSessionStore.entries()) {
      if (now - session.timestamp > SECURIA_SESSION_TIMEOUT) {
        securiaSessionStore.delete(sessionId);
        logger.info(`Cleaned expired Securia session: ${sessionId}`);
      }
    }
  }

  /**
   * Generate a unique session ID
   */
  static generateSessionId(userId: string): string {
    return `securia_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if user has a valid Securia session
   */
  static hasValidSession(userId: string): boolean {
    this.cleanExpiredSessions();
    for (const [sessionId, session] of securiaSessionStore.entries()) {
      if (session.userId === userId && (Date.now() - session.timestamp) < SECURIA_SESSION_TIMEOUT) {
        return true;
      }
    }
    return false;
  }

  /**
   * Create a new Securia session for user
   */
  static createSession(userId: string): string {
    this.cleanExpiredSessions();
    const sessionId = this.generateSessionId(userId);
    securiaSessionStore.set(sessionId, { userId, timestamp: Date.now() });
    logger.info(`Created Securia session for user: ${userId}`);
    return sessionId;
  }

  /**
   * Invalidate all sessions for a specific user
   */
  static invalidateUserSessions(userId: string): void {
    this.cleanExpiredSessions();
    const sessionsToDelete: string[] = [];
    
    for (const [sessionId, session] of securiaSessionStore.entries()) {
      if (session.userId === userId) {
        sessionsToDelete.push(sessionId);
      }
    }
    
    sessionsToDelete.forEach(sessionId => {
      securiaSessionStore.delete(sessionId);
      logger.info(`Invalidated Securia session: ${sessionId}`);
    });
  }

  /**
   * Get session information
   */
  static getSessionInfo(userId: string): { active: boolean; count: number; lastActivity?: number } {
    this.cleanExpiredSessions();
    let activeSessions = 0;
    let lastActivity: number | undefined;

    for (const [sessionId, session] of securiaSessionStore.entries()) {
      if (session.userId === userId) {
        activeSessions++;
        if (!lastActivity || session.timestamp > lastActivity) {
          lastActivity = session.timestamp;
        }
      }
    }

    return {
      active: activeSessions > 0,
      count: activeSessions,
      lastActivity
    };
  }

  /**
   * Update session timestamp (refresh session)
   */
  static refreshSession(userId: string): boolean {
    this.cleanExpiredSessions();
    let refreshed = false;

    for (const [sessionId, session] of securiaSessionStore.entries()) {
      if (session.userId === userId) {
        session.timestamp = Date.now();
        refreshed = true;
      }
    }

    if (refreshed) {
      logger.debug(`Refreshed Securia session for user: ${userId}`);
    }

    return refreshed;
  }

  /**
   * Get all active sessions (admin only)
   */
  static getAllActiveSessions(): Array<{ sessionId: string; userId: string; timestamp: number }> {
    this.cleanExpiredSessions();
    const sessions: Array<{ sessionId: string; userId: string; timestamp: number }> = [];

    for (const [sessionId, session] of securiaSessionStore.entries()) {
      sessions.push({
        sessionId,
        userId: session.userId,
        timestamp: session.timestamp
      });
    }

    return sessions;
  }
}
 