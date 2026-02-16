/**
 * Application Constants & Configuration
 * 
 * Merkezi sabit değerler, enum'lar ve konfigürasyonlar.
 * Form'larda, dropdown'larda ve validation'da kullanılır.
 */

import { Role } from './auth';

// ============================================
// ROLE DEFINITIONS
// ============================================

export const ROLES: { value: Role; label: string; description: string }[] = [
  {
    value: 'ADMIN',
    label: 'Yönetici',
    description: 'Tüm sistem erişimi, kullanıcı yönetimi',
  },
  {
    value: 'AGENT',
    label: 'Agent',
    description: 'Talent ve proje yönetimi',
  },
  {
    value: 'TALENT',
    label: 'Talent',
    description: 'Sadece kendi profili ve başvurular',
  },
];

export const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'bg-red-100 text-red-800 border-red-300',
  AGENT: 'bg-blue-100 text-blue-800 border-blue-300',
  TALENT: 'bg-green-100 text-green-800 border-green-300',
};

// ============================================
// PROJECT TYPES
// ============================================

export const PROJECT_TYPES = [
  { value: 'film', label: 'Sinema Filmi', icon: '🎬' },
  { value: 'series', label: 'TV Dizisi', icon: '📺' },
  { value: 'commercial', label: 'Reklam', icon: '📢' },
  { value: 'shortfilm', label: 'Kısa Film', icon: '🎥' },
  { value: 'musicvideo', label: 'Müzik Videosu', icon: '🎵' },
  { value: 'theater', label: 'Tiyatro', icon: '🎭' },
  { value: 'webseries', label: 'Web Dizisi', icon: '💻' },
  { value: 'documentary', label: 'Belgesel', icon: '📽️' },
];

export const PROJECT_TYPE_OPTIONS = PROJECT_TYPES.map(({ value, label }) => ({
  value,
  label,
}));

// ============================================
// PROJECT STATUS
// ============================================

export const PROJECT_STATUS = [
  { value: 'draft', label: 'Taslak', color: 'bg-gray-100 text-gray-800' },
  { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
  { value: 'casting', label: 'Cast Süreci', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
  { value: 'cancelled', label: 'İptal', color: 'bg-red-100 text-red-800' },
];

// ============================================
// CHARACTER STATUS
// ============================================

export const CHARACTER_STATUS = [
  { value: 'open', label: 'Açık', color: 'bg-green-100 text-green-800' },
  { value: 'casting', label: 'Cast Süreci', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'cast', label: 'Cast Edildi', color: 'bg-blue-100 text-blue-800' },
  { value: 'closed', label: 'Kapalı', color: 'bg-gray-100 text-gray-800' },
];

// ============================================
// AUDITION & CASTING STATUS
// ============================================

export const AUDITION_STATUS = [
  { value: 'pending', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'selected', label: 'Seçildi', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
  { value: 'callback', label: 'Tekrar Çağrı', color: 'bg-blue-100 text-blue-800' },
];

export const CASTING_STATUS = [
  { value: 'pending', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'shortlisted', label: 'Kısa Liste', color: 'bg-blue-100 text-blue-800' },
  { value: 'callback', label: 'Tekrar Çağrı', color: 'bg-purple-100 text-purple-800' },
  { value: 'cast', label: 'Cast Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
];

// ============================================
// INVITATION STATUS
// ============================================

export const INVITATION_STATUS = [
  { value: 'pending', label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'accepted', label: 'Kabul Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'expired', label: 'Süresi Doldu', color: 'bg-gray-100 text-gray-800' },
  { value: 'revoked', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
];

// ============================================
// GENDER OPTIONS
// ============================================

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Kadın' },
  { value: 'male', label: 'Erkek' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Diğer' },
  { value: 'prefer-not-to-say', label: 'Belirtmek İstemiyorum' },
];

// ============================================
// HAIR COLOR OPTIONS
// ============================================

export const HAIR_COLOR_OPTIONS = [
  { value: 'black', label: 'Siyah' },
  { value: 'brown', label: 'Kahverengi' },
  { value: 'blonde', label: 'Sarı' },
  { value: 'red', label: 'Kızıl' },
  { value: 'gray', label: 'Gri' },
  { value: 'white', label: 'Beyaz' },
  { value: 'other', label: 'Diğer' },
];

// ============================================
// EYE COLOR OPTIONS
// ============================================

export const EYE_COLOR_OPTIONS = [
  { value: 'brown', label: 'Kahverengi' },
  { value: 'blue', label: 'Mavi' },
  { value: 'green', label: 'Yeşil' },
  { value: 'hazel', label: 'Ela' },
  { value: 'gray', label: 'Gri' },
  { value: 'other', label: 'Diğer' },
];

// ============================================
// FILE UPLOAD CONFIG
// ============================================

export const FILE_UPLOAD_CONFIG = {
  // Photo limits
  MAX_PHOTO_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_PHOTOS_PER_TALENT: 20,

  // Video limits
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/webm'],

  // Document limits
  MAX_DOCUMENT_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
};

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// ============================================
// DATE FORMATS (TR)
// ============================================

export const DATE_FORMATS = {
  DATE_TR: 'DD.MM.YYYY',
  DATETIME_TR: 'DD.MM.YYYY HH:mm',
  MONTH_YEAR_TR: 'MMMM YYYY',
};

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const API_RESPONSES = {
  success: (data: unknown, message?: string): ApiResponse => ({
    success: true,
    data,
    message,
  }),
  error: (error: string): ApiResponse => ({
    success: false,
    error,
  }),
};

// ============================================
// SITE CONFIGURATION
// ============================================

export const SITE_CONFIG = {
  name: 'Fatoş Yılmaz Management & Casting',
  description: 'Profesyonel Yetenek Yönetimi ve Cast Direktörlüğü',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://fatosyilmazcasting.com',
  panelUrl: process.env.NEXT_PUBLIC_PANEL_URL || 'https://panel.fatosyilmazcasting.com',
  
  social: {
    instagram: 'https://instagram.com/fatosyilmazmanagement',
    // Add more social links as needed
  },
};

// ============================================
// NAVIGATION
// ============================================

export const PANEL_NAVIGATION = [
  {
    title: 'Dashboard',
    href: '/panel',
    icon: 'layout-dashboard',
    roles: ['ADMIN', 'AGENT'] as Role[],
  },
  {
    title: 'Talents',
    href: '/talents',
    icon: 'users',
    roles: ['ADMIN', 'AGENT'] as Role[],
  },
  {
    title: 'Projeler',
    href: '/projects',
    icon: 'film',
    roles: ['ADMIN', 'AGENT'] as Role[],
  },
  {
    title: 'Castings',
    href: '/castings',
    icon: 'clipboard-list',
    roles: ['ADMIN', 'AGENT'] as Role[],
  },
  {
    title: 'Ayarlar',
    href: '/settings',
    icon: 'settings',
    roles: ['ADMIN', 'AGENT', 'TALENT'] as Role[],
  },
];
