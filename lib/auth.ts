/**
 * RBAC - Role Based Access Control & Authentication
 * 
 * Features:
 * - JWT-based session management
 * - Role hierarchy (ADMIN > AGENT > TALENT)
 * - Permission-based access control
 * - Invitation-only onboarding support
 * 
 * Usage in Server Actions:
 * ```ts
 * const user = await requireAuth();
 * await requireRole('ADMIN');
 * const hasAccess = await hasPermission('talents:write');
 * ```
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type Role = 'ADMIN' | 'AGENT' | 'TALENT';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  exp: number;
  iat: number;
}

export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | '*';
}

// ============================================
// ROLE HIERARCHY & PERMISSIONS
// ============================================

/**
 * Rol hiyerarşisi - Sayısal değerler karşılaştırma için
 * ADMIN (3) > AGENT (2) > TALENT (1)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  TALENT: 1,
  AGENT: 2,
  ADMIN: 3,
};

/**
 * Rol bazlı izinler
 * 
 * Permission format: "resource:action"
 * Örnek: "talents:read", "projects:write"
 * 
 * "*" tüm izinleri kapsar (ADMIN için)
 */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ['*'], // Tüm yetkiler

  AGENT: [
    'talents:read',
    'talents:write',
    'talents:delete',
    'photos:read',
    'photos:write',
    'photos:delete',
    'projects:read',
    'projects:write',
    'auditions:read',
    'auditions:write',
    'castings:read',
    'castings:write',
    'profile:read',
    'profile:write',
  ],

  TALENT: [
    'profile:read',
    'profile:write',
    'photos:read',
    'auditions:read',
    'projects:read',
  ],
};

// ============================================
// JWT CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

if (JWT_SECRET === 'fallback-secret-change-in-production') {
  console.warn(
    '[AUTH] Warning: JWT_SECRET not set. Using fallback (INSECURE for production!)'
  );
}

const secretKey = new TextEncoder().encode(JWT_SECRET);
const JWT_EXPIRES_IN = '7d'; // 7 days

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Yeni JWT session oluştur
 * 
 * @param payload - User info (without exp)
 * @returns Signed JWT token
 */
export async function createSession(
  payload: Omit<SessionPayload, 'exp' | 'iat'>
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);

  return token;
}

/**
 * JWT token'ı doğrula ve payload'ı çöz
 * 
 * @param token - JWT token
 * @returns Decoded payload or null if invalid
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error('[AUTH] Session verification failed:', error);
    return null;
  }
}

/**
 * Cookie'e session token'ı set et
 * 
 * @param token - JWT token
 * @param rememberMe - Uzun süreli session flag
 */
export async function setSessionCookie(token: string, rememberMe = false): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days or 7 days

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
}

/**
 * Session cookie'ini sil (logout)
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// ============================================
// SERVER ACTION HELPERS
// ============================================

/**
 * Mevcut kullanıcı session'ını al
 * 
 * Server Actions'da kullanım:
 * ```ts
 * const user = await getCurrentUser();
 * if (!user) throw new Error('Unauthorized');
 * ```
 * 
 * @returns Current user session or null
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  return await verifySession(token);
}

/**
 * Kullanıcı authenticated değilse login'e yönlendir
 * 
 * Server Actions'da kullanım:
 * ```ts
 * const user = await requireAuth();
 * // Continue with authenticated logic
 * ```
 * 
 * @returns Current user session (never null)
 * @throws Redirects to /login if not authenticated
 */
export async function requireAuth(): Promise<SessionPayload> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Belirli bir role sahip değilse unauthorized'a yönlendir
 * 
 * Server Actions'da kullanım:
 * ```ts
 * await requireRole('ADMIN');
 * // Only ADMIN users reach here
 * ```
 * 
 * @param allowedRoles - Allowed roles
 * @returns Current user session
 * @throws Redirects to /unauthorized if role doesn't match
 */
export async function requireRole(...allowedRoles: Role[]): Promise<SessionPayload> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }

  return user;
}

/**
 * Belirli bir izne sahip olup olmadığını kontrol et
 * 
 * Server Actions'da kullanım:
 * ```ts
 * const canEdit = await hasPermission('talents:write');
 * if (!canEdit) throw new Error('Forbidden');
 * ```
 * 
 * @param permission - Permission string (e.g., "talents:write")
 * @returns true if user has permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) return false;

  const userPermissions = ROLE_PERMISSIONS[user.role];

  // ADMIN has all permissions
  if (userPermissions.includes('*')) return true;

  return userPermissions.includes(permission);
}

/**
 * Rol hiyerarşisine göre kullanıcının yetkisini kontrol et
 * 
 * @param userRole - User's role
 * @param requiredRole - Minimum required role
 * @returns true if user has equal or higher role
 */
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// ============================================
// INVITATION TOKEN HELPERS
// ============================================

/**
 * Invitation-only onboarding için token oluştur
 * 
 * @param email - Invited user email
 * @param role - User role
 * @param inviterId - Who sent the invitation
 * @returns Signed invitation token
 */
export async function createInvitationToken(
  email: string,
  role: Role,
  inviterId: string
): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const token = await new SignJWT({ email, role, inviterId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  return token;
}

/**
 * Invitation token'ı doğrula
 * 
 * @param token - Invitation token
 * @returns Decoded payload or null
 */
export async function verifyInvitationToken(
  token: string
): Promise<{ email: string; role: Role; inviterId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      email: payload.email as string,
      role: payload.role as Role,
      inviterId: payload.inviterId as string,
    };
  } catch {
    return null;
  }
}

// ============================================
// PASSWORD UTILITIES
// ============================================

/**
 * Password'u hash'le (bcrypt替代 - Web Crypto API)
 * 
 * Not: Production için bcrypt kullanılması önerilir.
 * Bu sadece basit implementation örneğidir.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Password'u doğrula
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}
