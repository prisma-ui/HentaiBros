interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.other';
  noIndex?: boolean;
}

const SITE_NAME = 'HentaiBros';
const SITE_URL = (process.env.REACT_APP_SITE_URL || '').replace(/\/$/, '');
const DEFAULT_DESC = 'HentaiBros — Nonton hentai sub indo terlengkap. Ribuan judul, update setiap hari, gratis.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export function useSEO({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
}: SEOProps = {}) {
  const fullTitle = title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — Nonton Hentai Sub Indo Gratis`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  // Title
  document.title = fullTitle;

  const setMeta = (selector: string, content: string) => {
    let el = document.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      const isOg = selector.includes('property');
      const val = selector.match(/["']([^"']+)["']/)?.[1] || '';
      el.setAttribute(isOg ? 'property' : 'name', val);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', description);
  setMeta('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow');
  setMeta('meta[property="og:title"]', fullTitle);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', image);
  setMeta('meta[property="og:url"]', fullUrl);
  setMeta('meta[property="og:type"]', type);
  setMeta('meta[name="twitter:title"]', fullTitle);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', image);

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = fullUrl;
}
