import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import VideoCard from '../components/VideoCard';
import Pagination from '../components/Pagination';
import { GridSkeleton } from '../components/Skeleton';
import { searchVideos } from '../api/client';
import { useSEO } from '../hooks/useSEO';
import type { VideoItem, PaginationMeta } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useSEO(
    q
      ? {
          title: `Hasil pencarian: ${q}`,
          description: `Hasil pencarian hentai untuk "${q}" di HentaiBros.`,
          url: `/search?q=${encodeURIComponent(q)}`,
          noIndex: true, // search result pages shouldn't be indexed
        }
      : { title: 'Pencarian', noIndex: true }
  );

  useEffect(() => {
    if (!q) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError('');
    searchVideos(q, page).then((res) => {
      if (res.status === 'ok') {
        setVideos(res.data.videos);
        setPagination(res.data.pagination);
      } else {
        setError(res.message || 'Pencarian gagal');
        setVideos([]);
      }
      setLoading(false);
    });
  }, [q, page]);

  if (!q) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiSearch size={48} className="text-text-dim mx-auto mb-4" />
        <p className="text-text-muted text-lg font-semibold">Masukkan kata kunci untuk mencari</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-7 bg-accent-blue rounded-full" />
        <FiSearch size={18} className="text-accent-blue" />
        <h1 className="text-xl font-black text-text-primary">
          Hasil pencarian: <span className="text-accent-blue">"{q}"</span>
        </h1>
      </div>
      {pagination && !loading && (
        <p className="text-text-muted text-sm mb-6 ml-4">
          {videos.length} video ditemukan (halaman {pagination.currentPage} dari {pagination.totalPages})
        </p>
      )}

      {error ? (
        <div className="text-center py-20 text-red-400 font-semibold">{error}</div>
      ) : loading ? (
        <GridSkeleton count={20} />
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <FiSearch size={48} className="text-text-dim mx-auto mb-4" />
          <p className="text-text-muted font-semibold">Tidak ada hasil untuk "{q}"</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {videos.map((v) => (
              <VideoCard key={v.slug || v.url} video={v} />
            ))}
          </div>
          {pagination && (
            <Pagination pagination={pagination} onPageChange={(p) => setSearchParams({ q, page: String(p) })} />
          )}
        </>
      )}
    </div>
  );
}
