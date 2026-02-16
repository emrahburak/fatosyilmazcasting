/**
 * Cloudflare R2 Storage Client (AWS S3 Compatible)
 * 
 * AWS SDK v3 kullanarak Cloudflare R2 ile entegrasyon sağlar.
 * 
 * Features:
 * - Presigned upload URL (client-side direct upload)
 * - Presigned download URL (private files)
 * - Direct upload (server-side)
 * - Delete objects
 * - List objects
 * 
 * Environment Variables:
 * - CLOUDFLARE_R2_ENDPOINT: https://<account-id>.r2.cloudflarestorage.com
 * - CLOUDFLARE_R2_ACCESS_KEY: R2 Access Key ID
 * - CLOUDFLARE_R2_SECRET_KEY: R2 Secret Access Key
 * - CLOUDFLARE_R2_BUCKET: Bucket name
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  type PutObjectCommandInput,
  type GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 Configuration from environment
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT!;
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY!;
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_KEY!;
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;

// Validate required environment variables
if (!R2_ENDPOINT || !R2_ACCESS_KEY || !R2_SECRET_KEY || !R2_BUCKET) {
  console.warn(
    '[R2] Warning: Cloudflare R2 environment variables are not fully configured. Storage features will not work.'
  );
}

/**
 * S3 Client configured for Cloudflare R2
 */
export const r2Client = new S3Client({
  region: 'auto', // Cloudflare R2 için 'auto' kullanılır
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
  forcePathStyle: true, // Cloudflare R2 için gerekli
});

// ============================================
// UPLOAD OPERATIONS
// ============================================

/**
 * Server-side direct upload to R2
 * 
 * @param key - Object key (file path in bucket)
 * @param body - File content as Buffer or Uint8Array
 * @param contentType - MIME type of the file
 * @returns Public URL of uploaded object
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const command: PutObjectCommandInput = {
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  await r2Client.send(new PutObjectCommand(command));

  // Public URL döndür (R2 public bucket varsayılır)
  return getPublicUrl(key);
}

/**
 * Client-side upload için presigned URL oluştur
 * 
 * Kullanım:
 * 1. Bu fonksiyonu server-side çağır
 * 2. Dönen URL'e client-side PUT request gönder
 * 3. File doğrudan R2'ye yüklenir (server üzerinden geçmez)
 * 
 * @param key - Object key
 * @param contentType - MIME type
 * @param expiresIn - URL geçerlilik süresi (saniye, default: 1 saat)
 * @returns Presigned upload URL
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

// ============================================
// DOWNLOAD OPERATIONS
// ============================================

/**
 * Private dosyalar için presigned download URL oluştur
 * 
 * @param key - Object key
 * @param expiresIn - URL geçerlilik süresi (saniye, default: 1 saat)
 * @returns Presigned download URL
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * R2'den dosya içeriğini oku (Buffer olarak)
 * 
 * @param key - Object key
 * @returns File content as Buffer
 */
export async function downloadFromR2(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  const response = await r2Client.send(command);
  const arrayBuffer = await response.Body!.transformToByteArray();
  return Buffer.from(arrayBuffer);
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * R2'den dosya sil
 * 
 * @param key - Object key
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * R2'den birden fazla dosya sil
 * 
 * @param keys - Object keys array
 */
export async function deleteMultipleFromR2(keys: string[]): Promise<void> {
  // S3 SDK v3'te DeleteObjectsCommand var ama R2 bazen tek tek silmeyi gerektirir
  await Promise.all(
    keys.map((key) =>
      r2Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
        })
      )
    )
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * R2 bucket'taki objeleri listele
 * 
 * @param prefix - Key prefix filter (optional)
 * @returns Array of object keys
 */
export async function listR2Objects(prefix?: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: prefix,
  });

  const response = await r2Client.send(command);
  return response.Contents?.map((obj) => obj.Key!) || [];
}

/**
 * Objenin metadata bilgilerini al
 * 
 * @param key - Object key
 * @returns Object metadata (size, contentType, lastModified, etc.)
 */
export async function getR2ObjectMetadata(key: string) {
  const command = new HeadObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  return await r2Client.send(command);
}

/**
 * Public URL oluştur (R2 public bucket varsayılır)
 * 
 * @param key - Object key
 * @returns Public URL string
 */
export function getPublicUrl(key: string): string {
  // Endpoint URL'ini parse et (https://account-id.r2.cloudflarestorage.com)
  const url = new URL(R2_ENDPOINT);
  const hostname = url.hostname;
  
  // R2 public URL format: https://bucket.account-id.r2.cloudflarestorage.com/key
  // Veya custom domain kullanılıyorsa: https://custom-domain.com/key
  return `https://${R2_BUCKET}.${hostname}/${key}`;
}

/**
 * Unique key oluştur (timestamp + random string)
 * 
 * @param filename - Original filename
 * @param folder - Optional folder prefix
 * @returns Unique key string
 */
export function generateUniqueKey(filename: string, folder?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (folder) {
    return `${folder}/${timestamp}-${random}-${sanitizedFilename}`;
  }
  
  return `${timestamp}-${random}-${sanitizedFilename}`;
}

// ============================================
// CONTENT TYPE HELPERS
// ============================================

export const CONTENT_TYPES = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
} as const;

/**
 * File extension'dan MIME type al
 * 
 * @param filename - Filename with extension
 * @returns MIME type or 'application/octet-stream'
 */
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() as keyof typeof CONTENT_TYPES;
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}
