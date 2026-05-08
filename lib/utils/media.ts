const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.timerightproduction.org';

type MediaFolder = 'afis' | 'general' | 'instructor' | 'education' | 'catalog';

const FOLDER_PATHS: Record<MediaFolder, string> = {
  afis:       'fatosyilmazcasting/afis',
  general:    'fatosyilmazcasting',
  instructor: 'fatosyilmazcasting/instructor',
  education:  'fatosyilmazcasting/education',
  catalog:    'fatosyilmazcasting/catalog',
};

export const getMediaUrl = (filename: string | null, folder: MediaFolder = 'general'): string => {
  if (!filename) return '/placeholder-thumbnail.svg';
  const cleanFilename = filename.replace(/^\/+/, '');
  return `${CDN_BASE_URL}/${FOLDER_PATHS[folder]}/${cleanFilename}`;
};

export const getCatalogPdfUrl = (filename: string = 'fatosyilmazcasting-catalog.pdf'): string => {
  return `${CDN_BASE_URL}/${FOLDER_PATHS['catalog']}/${filename}`;
};
