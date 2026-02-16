'use server';

/**
 * Authentication Server Actions
 *
 * Login, logout, register (invitation-based) işlemleri.
 * Tüm işlemler server-side yapılır, client-side'da sadece form state yönetilir.
 */

import { z } from 'zod';
import { db } from '@/lib/db';
import {
  createSession,
  setSessionCookie,
  deleteSessionCookie,
  getCurrentUser,
  hashPassword,
  verifyPassword,
  createInvitationToken,
  verifyInvitationToken,
  type Role,
} from '@/lib/auth';
import type { ApiResponse } from '@/lib/constants';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  invitationToken: z.string().nonempty('Davetiye kodu gereklidir'),
});

const inviteUserSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  role: z.enum(['ADMIN', 'AGENT', 'TALENT']),
});

// ============================================
// LOGIN / LOGOUT
// ============================================

/**
 * Kullanıcı login işlemi
 */
export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse<{ redirect?: string }>> {
  try {
    const data = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // User'ı bul
    const user = await db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: 'E-posta veya şifre hatalı' };
    }

    // Aktif mi?
    if (!user.isActive) {
      return { success: false, error: 'Hesabınız aktif değil. Lütfen yöneticiyle iletişime geçin.' };
    }

    // Şifre kontrolü
    const isValidPassword = await verifyPassword(data.password, user.password);

    if (!isValidPassword) {
      return { success: false, error: 'E-posta veya şifre hatalı' };
    }

    // Session oluştur
    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
    });

    // Cookie set et
    await setSessionCookie(token);

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'login',
        entity: 'user',
        entityId: user.id,
        userId: user.id,
      },
    });

    return {
      success: true,
      data: { redirect: '/panel' },
      message: 'Giriş başarılı',
    };
  } catch (error) {
    console.error('[AUTH] Login error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
  }
}

/**
 * Kullanıcı logout işlemi
 */
export async function logoutAction(): Promise<void> {
  const user = await getCurrentUser();

  if (user) {
    // Audit log
    await db.auditLog.create({
      data: {
        action: 'logout',
        entity: 'user',
        entityId: user.userId,
        userId: user.userId,
      },
    });
  }

  await deleteSessionCookie();
}

// ============================================
// INVITATION-BASED REGISTRATION
// ============================================

/**
 * Davetiye ile kayıt işlemi
 */
export async function registerAction(
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse<{ redirect?: string }>> {
  try {
    const data = registerSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      invitationToken: formData.get('invitationToken'),
    });

    // Invitation'ı doğrula
    const invitationPayload = await verifyInvitationToken(data.invitationToken);

    if (!invitationPayload) {
      return { success: false, error: 'Geçersiz veya süresi dolmuş davetiye kodu' };
    }

    // E-posta eşleşiyor mu?
    if (invitationPayload.email !== data.email.toLowerCase()) {
      return { success: false, error: 'Davetiye bu e-posta adresi için geçerli değil' };
    }

    // Invitation zaten kullanılmış mı?
    const existingInvitation = await db.invitation.findUnique({
      where: { token: data.invitationToken },
    });

    if (!existingInvitation || existingInvitation.status !== 'pending') {
      return { success: false, error: 'Bu davetiye kodu zaten kullanılmış' };
    }

    // Süresi geçmiş mi?
    if (new Date(existingInvitation.expiresAt) < new Date()) {
      return { success: false, error: 'Davetiye kodunun süresi dolmuş' };
    }

    // User zaten var mı?
    const existingUser = await db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: 'Bu e-posta adresi zaten kayıtlı' };
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // User oluştur
    const user = await db.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        role: invitationPayload.role as Role,
      },
    });

    // Invitation'ı güncelle
    await db.invitation.update({
      where: { id: existingInvitation.id },
      data: {
        status: 'accepted',
        acceptedAt: new Date(),
        invitedUser: user.id,
      },
    });

    // Session oluştur
    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
    });

    await setSessionCookie(token);

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'register',
        entity: 'user',
        entityId: user.id,
        userId: user.id,
        newValue: JSON.stringify({ role: user.role }),
      },
    });

    return {
      success: true,
      data: { redirect: '/panel' },
      message: 'Kayıt başarılı',
    };
  } catch (error) {
    console.error('[AUTH] Register error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: 'Kayıt yapılırken bir hata oluştu' };
  }
}

// ============================================
// INVITATION MANAGEMENT (ADMIN only)
// ============================================

/**
 * Yeni kullanıcı davetiyesi oluştur (ADMIN only)
 */
export async function createInvitationAction(
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse<{ invitationUrl?: string }>> {
  try {
    // Current user kontrolü (ADMIN olmalı)
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Bu işlem için yetkiniz yok' };
    }

    const data = inviteUserSchema.parse({
      email: formData.get('email'),
      role: formData.get('role'),
    });

    // E-posta zaten kayıtlı mı?
    const existingUser = await db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: 'Bu e-posta adresi zaten kayıtlı' };
    }

    // Aktif davetiye var mı?
    const existingInvitation = await db.invitation.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingInvitation && existingInvitation.status === 'pending') {
      const invitationUrl = `${process.env.NEXT_PUBLIC_PANEL_URL}/register?token=${existingInvitation.token}`;
      return {
        success: true,
        data: { invitationUrl },
        message: 'Bu e-posta için zaten bekleyen bir davetiye var',
      };
    }

    // Token oluştur
    const token = await createInvitationToken(data.email, data.role as Role, user.userId);

    // Invitation kaydet
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await db.invitation.create({
      data: {
        email: data.email.toLowerCase(),
        role: data.role as Role,
        token,
        expiresAt,
        invitedBy: user.userId,
      },
    });

    // Invitation URL
    const invitationUrl = `${process.env.NEXT_PUBLIC_PANEL_URL}/register?token=${invitation.token}`;

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'create_invitation',
        entity: 'invitation',
        entityId: invitation.id,
        userId: user.userId,
        newValue: JSON.stringify({ email: data.email, role: data.role }),
      },
    });

    return {
      success: true,
      data: { invitationUrl },
      message: 'Davetiye oluşturuldu',
    };
  } catch (error) {
    console.error('[AUTH] Create invitation error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: 'Davetiye oluşturulurken bir hata oluştu' };
  }
}

/**
 * Bekleyen davetiyeleri listele
 */
export async function getPendingInvitationsAction(): Promise<ApiResponse<unknown[]>> {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Yetkisiz erişim' };
    }

    const invitations = await db.invitation.findMany({
      where: { status: 'pending' },
      include: {
        inviter: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: invitations };
  } catch (error) {
    console.error('[AUTH] Get invitations error:', error);
    return { success: false, error: 'Davetiyeler yüklenirken bir hata oluştu' };
  }
}

/**
 * Davetiyeyi iptal et
 */
export async function revokeInvitationAction(
  invitationId: string
): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Yetkisiz erişim' };
    }

    await db.invitation.update({
      where: { id: invitationId },
      data: { status: 'revoked' },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'revoke_invitation',
        entity: 'invitation',
        entityId: invitationId,
        userId: user.userId,
      },
    });

    return { success: true, data: null, message: 'Davetiye iptal edildi' };
  } catch (error) {
    console.error('[AUTH] Revoke invitation error:', error);
    return { success: false, error: 'Davetiye iptal edilirken bir hata oluştu' };
  }
}
