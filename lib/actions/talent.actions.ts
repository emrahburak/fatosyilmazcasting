'use server';

/**
 * Talent Management Server Actions
 *
 * Talent CRUD işlemleri, fotoğraf yönetimi, audition takibi.
 */

import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import type { ApiResponse } from '@/lib/constants';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createTalentSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().optional(),
  bio: z.string().max(1000).optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  height: z.number().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  instagram: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

const updateTalentSchema = createTalentSchema.partial();

const createAuditionSchema = z.object({
  talentId: z.string(),
  projectId: z.string(),
  notes: z.string().optional(),
});

// ============================================
// TALENT CRUD
// ============================================

/**
 * Talent listesi al (filtreleme ile)
 */
export async function getTalentsAction(
  filters?: {
    search?: string;
    gender?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }
): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    const where: Record<string, unknown> = {};

    // Search
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    // Filters
    if (filters?.gender) {
      where.gender = filters.gender;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    // Agent sadece kendi talent'larını görebilir (ADMIN hariç)
    if (user.role === 'AGENT') {
      where.managedBy = user.userId;
    }

    const talents = await db.talent.findMany({
      where,
      include: {
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        manager: {
          select: { name: true, email: true },
        },
        _count: {
          select: {
            auditions: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: talents };
  } catch (error) {
    console.error('[TALENT] Get talents error:', error);
    return { success: false, error: 'Talent listesi yüklenirken bir hata oluştu' };
  }
}

/**
 * Tek bir talent detayını al
 */
export async function getTalentAction(talentId: string): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    const talent = await db.talent.findUnique({
      where: { id: talentId },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
        manager: {
          select: { name: true, email: true, role: true },
        },
        auditions: {
          include: {
            project: {
              select: {
                title: true,
                type: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!talent) {
      return { success: false, error: 'Talent bulunamadı' };
    }

    // Yetki kontrolü (Agent sadece kendi talent'ını görebilir)
    if (user.role === 'AGENT' && talent.managedBy !== user.userId) {
      return { success: false, error: 'Bu talent\'ı görüntüleme yetkiniz yok' };
    }

    return { success: true, data: talent };
  } catch (error) {
    console.error('[TALENT] Get talent error:', error);
    return { success: false, error: 'Talent detayları yüklenirken bir hata oluştu' };
  }
}

/**
 * Yeni talent oluştur
 */
export async function createTalentAction(
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse<{ talentId?: string }>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    // Yetki kontrolü
    const canCreate = await hasPermission('talents:write');
    if (!canCreate) {
      return { success: false, error: 'Bu işlem için yetkiniz yok' };
    }

    const data = createTalentSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      bio: formData.get('bio'),
      birthDate: formData.get('birthDate'),
      gender: formData.get('gender'),
      height: formData.get('height') ? parseFloat(formData.get('height') as string) : undefined,
      hairColor: formData.get('hairColor'),
      eyeColor: formData.get('eyeColor'),
      instagram: formData.get('instagram'),
      twitter: formData.get('twitter'),
      website: formData.get('website'),
    });

    // E-posta zaten kayıtlı mı?
    const existingTalent = await db.talent.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingTalent) {
      return { success: false, error: 'Bu e-posta adresi zaten kayıtlı' };
    }

    // Talent oluştur
    const talent = await db.talent.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        managedBy: user.role === 'ADMIN' ? undefined : user.userId,
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'create',
        entity: 'talent',
        entityId: talent.id,
        userId: user.userId,
        newValue: JSON.stringify(data),
      },
    });

    return {
      success: true,
      data: { talentId: talent.id },
      message: 'Talent başarıyla oluşturuldu',
    };
  } catch (error) {
    console.error('[TALENT] Create talent error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: 'Talent oluşturulurken bir hata oluştu' };
  }
}

/**
 * Talent güncelle
 */
export async function updateTalentAction(
  talentId: string,
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    // Yetki kontrolü
    const canUpdate = await hasPermission('talents:write');
    if (!canUpdate) {
      return { success: false, error: 'Bu işlem için yetkiniz yok' };
    }

    const data = updateTalentSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      bio: formData.get('bio'),
      birthDate: formData.get('birthDate'),
      gender: formData.get('gender'),
      height: formData.get('height') ? parseFloat(formData.get('height') as string) : undefined,
      hairColor: formData.get('hairColor'),
      eyeColor: formData.get('eyeColor'),
      instagram: formData.get('instagram'),
      twitter: formData.get('twitter'),
      website: formData.get('website'),
    });

    // Mevcut talent'ı kontrol et
    const existingTalent = await db.talent.findUnique({
      where: { id: talentId },
    });

    if (!existingTalent) {
      return { success: false, error: 'Talent bulunamadı' };
    }

    // Agent sadece kendi talent'ını güncelleyebilir
    if (user.role === 'AGENT' && existingTalent.managedBy !== user.userId) {
      return { success: false, error: 'Bu talent\'ı düzenleme yetkiniz yok' };
    }

    // E-posta kontrolü (başka bir talent tarafından kullanılıyor mu?)
    if (data.email && data.email !== existingTalent.email) {
      const emailExists = await db.talent.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (emailExists) {
        return { success: false, error: 'Bu e-posta adresi başka bir talent tarafından kullanılıyor' };
      }
      data.email = data.email.toLowerCase();
    }

    // Güncelle
    await db.talent.update({
      where: { id: talentId },
      data,
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'update',
        entity: 'talent',
        entityId: talentId,
        userId: user.userId,
        newValue: JSON.stringify(data),
      },
    });

    return { success: true, data: null, message: 'Talent başarıyla güncellendi' };
  } catch (error) {
    console.error('[TALENT] Update talent error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: 'Talent güncellenirken bir hata oluştu' };
  }
}

/**
 * Talent sil (soft delete - isActive = false)
 */
export async function deleteTalentAction(talentId: string): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    // Yetki kontrolü
    const canDelete = await hasPermission('talents:delete');
    if (!canDelete) {
      return { success: false, error: 'Bu işlem için yetkiniz yok' };
    }

    // Talent'ı kontrol et
    const existingTalent = await db.talent.findUnique({
      where: { id: talentId },
    });

    if (!existingTalent) {
      return { success: false, error: 'Talent bulunamadı' };
    }

    // Agent sadece kendi talent'ını silebilir
    if (user.role === 'AGENT' && existingTalent.managedBy !== user.userId) {
      return { success: false, error: 'Bu talent\'ı silme yetkiniz yok' };
    }

    // Soft delete
    await db.talent.update({
      where: { id: talentId },
      data: { isActive: false },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'delete',
        entity: 'talent',
        entityId: talentId,
        userId: user.userId,
      },
    });

    return { success: true, data: null, message: 'Talent başarıyla silindi' };
  } catch (error) {
    console.error('[TALENT] Delete talent error:', error);
    return { success: false, error: 'Talent silinirken bir hata oluştu' };
  }
}

// ============================================
// AUDITION MANAGEMENT
// ============================================

/**
 * Yeni audition oluştur
 */
export async function createAuditionAction(
  prevState: unknown,
  formData: FormData
): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    // Yetki kontrolü
    const canCreate = await hasPermission('auditions:write');
    if (!canCreate) {
      return { success: false, error: 'Bu işlem için yetkiniz yok' };
    }

    const data = createAuditionSchema.parse({
      talentId: formData.get('talentId'),
      projectId: formData.get('projectId'),
      notes: formData.get('notes'),
    });

    // Mevcut audition kontrolü
    const existingAudition = await db.audition.findUnique({
      where: {
        talentId_projectId: {
          talentId: data.talentId,
          projectId: data.projectId,
        },
      },
    });

    if (existingAudition) {
      return { success: false, error: 'Bu talent zaten bu projeye başvurmuş' };
    }

    // Audition oluştur
    const audition = await db.audition.create({
      data,
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'create',
        entity: 'audition',
        entityId: audition.id,
        userId: user.userId,
        newValue: JSON.stringify(data),
      },
    });

    return { success: true, data: null, message: 'Başvuru başarıyla oluşturuldu' };
  } catch (error) {
    console.error('[TALENT] Create audition error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { success: false, error: 'Başvuru oluşturulurken bir hata oluştu' };
  }
}

/**
 * Audition status güncelle
 */
export async function updateAuditionStatusAction(
  auditionId: string,
  status: string
): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Oturum bulunamadı' };
    }

    // Yetki kontrolü
    const canUpdate = await hasPermission('auditions:write');
    if (!canUpdate) {
      return { success: false, error: 'Bu işlem için yetkiniz yok' };
    }

    await db.audition.update({
      where: { id: auditionId },
      data: { status },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'update',
        entity: 'audition',
        entityId: auditionId,
        userId: user.userId,
        newValue: JSON.stringify({ status }),
      },
    });

    return { success: true, data: null, message: 'Başvuru durumu güncellendi' };
  } catch (error) {
    console.error('[TALENT] Update audition status error:', error);
    return { success: false, error: 'Başvuru durumu güncellenirken bir hata oluştu' };
  }
}
