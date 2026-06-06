export interface VideoItem {
  title: string;
  url: string;
  slug: string;
  thumbnail: string;
  duration?: string;
  publishedAt?: string;
  tags?: TagItem[];
  postId?: string;
}

export interface VideoDetail {
  title: string;
  slug: string;
  url: string;
  thumbnail: string;
  description: string;
  genres: TagItem[];
  series?: TagItem;
  publishedAt?: string;
  embedUrl?: string;
  sources?: VideoSource[];
}

export interface VideoSource {
  label: string;
  src: string;
  type?: string;
}

export interface TagItem {
  name: string;
  slug: string;
  url: string;
}

export interface GenreListItem extends TagItem {
  count?: number;
}

export interface GenreDetail {
  name: string;
  slug: string;
  url: string;
  description?: string;
  videos: VideoItem[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ApiSuccess<T> {
  status: 'ok';
  data: T;
  cached?: boolean;
  scrapedAt: string;
}

export interface ApiError {
  status: 'error';
  message: string;
  code?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type FilterType = 'latest' | 'longest' | 'random';

export interface HomeData {
  videos: VideoItem[];
  filter: FilterType;
  pagination: PaginationMeta;
}

export interface HentaiListData {
  videos: VideoItem[];
  pagination: PaginationMeta;
}

export interface SearchData {
  query: string;
  videos: VideoItem[];
  pagination: PaginationMeta;
}
