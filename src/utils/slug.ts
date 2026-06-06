/**
 * Convert any string to a clean, pretty URL slug.
 * "Sword Art Online Ep.1" → "sword-art-online-ep-1"
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extract slug from a URL path: "/anime/sword-art/" → "sword-art"
 */
export function slugFromUrl(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() || '';
}

/**
 * Prefer explicit slug, fall back to extracting from URL.
 */
export function resolveSlug(slug?: string, url?: string): string {
  if (slug) return slug;
  if (url) return slugFromUrl(url);
  return '';
}
