import type {
  ApiResponse,
  HomeData,
  VideoDetail,
  GenreListItem,
  GenreDetail,
  SearchData,
  HentaiListData,
  FilterType,
} from '../types';

/**
 * All requests go to /api/* on the same origin.
 * On Vercel, rewrites in vercel.json proxy /api/* → backend.
 * REACT_APP_API_URL is NEVER exposed to the browser.
 */
async function apiFetch<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(path, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { status: 'error', message: `HTTP ${res.status}`, code: res.status };
    }
    return res.json();
  } catch {
    return { status: 'error', message: 'Koneksi gagal', code: 0 };
  }
}

export function getVideos(page = 1, filter: FilterType = 'latest') {
  return apiFetch<HomeData>(`/api/videos?page=${page}&filter=${filter}`);
}

export function getVideoDetail(slug: string) {
  return apiFetch<VideoDetail>(`/api/video/${encodeURIComponent(slug)}`);
}

export function getGenres() {
  return apiFetch<GenreListItem[]>('/api/genres');
}

export function getGenreDetail(slug: string, page = 1, filter: FilterType = 'latest') {
  return apiFetch<GenreDetail>(`/api/genre/${encodeURIComponent(slug)}?page=${page}&filter=${filter}`);
}

export function searchVideos(q: string, page = 1) {
  return apiFetch<SearchData>(`/api/search?q=${encodeURIComponent(q)}&page=${page}`);
}

export function getHentaiList(page = 1) {
  return apiFetch<HentaiListData>(`/api/hentai-list?page=${page}`);
}
