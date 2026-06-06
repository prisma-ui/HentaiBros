import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import VideoCard from '../components/VideoCard';
import Pagination from '../components/Pagination';
import { GridSkeleton } from '../components/Skeleton';
import { getGenreDetail } from '../api/client';
import { useSEO } from '../hooks/useSEO';
import { useStructuredData } from '../hooks/useStructuredData';
import type { GenreDetail, FilterType } from '../types';

const SITE_URL = (process.env.REACT_APP_SITE_URL || '').replace(/\/$/, '');

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'latest', label: 'Terbaru' },
  { value: 'longest', label: 'Terpanjang' },
  { value: 'random', label: 'Acak' },
];

export default function GenreDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const filter = (searchParams.get('filter') || 'latest') as FilterType;

  const [data, setData] = useState<GenreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const displayName = data?.name || slug?.replace(/-/g, ' ') || '';

  useSEO({
    title: `Genre ${displayName}${page > 1 ? ` - Halaman ${page}` : ''}`,
    description: `Nonton hentai genre ${displayName} terlengkap di HentaiBros. Ribuan judul tersedia, update setiap hari.`,
    url: `/genre/${slug}${page > 1 ? `?page=${page}` : ''}`,
  });

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Genre ${displayName} — HentaiBros`,
    url: `${SITE_URL}/genre/${slug}`,
    description: `Koleksi hentai genre ${displayName} terlengkap.`,
  });

  useEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError('');
    getGenreDetail(slug, page, filter).then((res) => {
      if (res.status === 'ok') setData(res.data);
      else setError(res.message || 'Genre tidak ditemukan');
      setLoading(false);
    });
  }, [slug, page, filter]);

  const setFilter = (f: FilterType) => setSearchParams({ page: '1', filter: f });
  const handlePageChange = (p: number) => setSearchParams({ page: String(p), filter });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-accent-blue rounded-full" />
          <FiTag size={18} className="text-accent-blue" />
          <div>
            <h1 className="text-xl font-black text-text-primary capitalize">{displayName}</h1>
            {data?.pagination && (
              <p className="text-text-muted text-sm">
                Halaman {data.pagination.currentPage} dari {data.pagination.totalPages}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                filter === opt.value
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-card border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="text-center py-20 text-red-400 font-semibold">{error}</div>
      ) : loading ? (
        <GridSkeleton count={20} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {data?.videos.map((v) => (
              <VideoCard key={v.slug || v.url} video={v} />
            ))}
          </div>
          {data?.pagination && (
            <Pagination pagination={data.pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
