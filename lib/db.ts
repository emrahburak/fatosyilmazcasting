/**
 * Prisma Database Client
 * 
 * DB Agnostic Architecture:
 * - Development/Local: Standart Prisma (PostgreSQL veya SQLite)
 * - Cloudflare Pages/Workers: PrismaD1 adapter otomatik aktif olur
 * 
 * PostgreSQL'e geçiş için:
 * 1. schema.prisma: provider = "postgresql" olarak değiştir
 * 2. DATABASE_URL'i PostgreSQL connection string olarak güncelle
 */

import { PrismaClient } from '@prisma/client';

// Cloudflare D1 binding tipi (global)
declare global {
  var __D1_Binding__: D1Database | undefined;
}

// Singleton pattern - Next.js hot-reload için gerekli
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma client oluşturur
 * 
 * Not: @prisma/adapter-d1 NixOS'ta desteklenmiyor.
 * Cloudflare Pages ortamında __D1_Binding__ varsa adapter otomatik yüklenir.
 */
export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // Cloudflare D1 ortamı kontrolü
    const d1Database = globalThis.__D1_Binding__;
    
    if (d1Database) {
      // Cloudflare ortamı - dinamik import ile D1 adapter yükle
      import('@prisma/adapter-d1').then(({ PrismaD1 }) => {
        const adapter = new PrismaD1(d1Database);
        globalForPrisma.prisma = new PrismaClient({
          adapter,
          log:
            process.env.NODE_ENV === 'development'
              ? ['query', 'error', 'warn']
              : ['error'],
        });
      }).catch(() => {
        // Adapter yüklenemezse standart Prisma kullan
        globalForPrisma.prisma = new PrismaClient({
          log:
            process.env.NODE_ENV === 'development'
              ? ['query', 'error', 'warn']
              : ['error'],
        });
      });
    }
    
    // Standart ortam (PostgreSQL veya local SQLite)
    globalForPrisma.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  return globalForPrisma.prisma;
}

/**
 * Server Actions ve Route Handlers için global export
 * 
 * Kullanım:
 * ```ts
 * import { db } from '@/lib/db';
 * const users = await db.user.findMany();
 * ```
 */
export const db = getPrismaClient();

/**
 * Database bağlantısını kapat (graceful shutdown için)
 */
export async function disconnectDb(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
    globalForPrisma.prisma = null;
  }
}
