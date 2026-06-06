import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import VideoCard from '../components/VideoCard';
import Pagination from '../components/Pagination';
import { GridSkeleton } from '../components/Skeleton';
import { getHentaiList } from '../api/client';
import { useSEO } from '../hooks/useSEO';
import type { VideoItem, PaginationMeta } from '../types';

export default function ListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({
    title: `Daftar Video${page > 1 ? ` — Halaman ${page}` : ''}`,
    description: 'Daftar lengkap semua video hentai di HentaiBros. Update setiap hari dengan judul-judul terbaru.',
    url: `/list${page > 1 ? `?page=${page}` : ''}`,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError('');
    getHentaiList(page).then((res) => {
      if (res.status === 'ok') {
        setVideos(res.data.videos);
        setPagination(res.data.pagination);
      } else {
        setError(res.message || 'Gagal memuat data');
      }
      setLoading(false);
    });
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-accent-blue rounded-full" />
        <FiFilter size={20} className="text-accent-blue" />
        <div>
          <h1 className="text-xl font-black text-text-primary">Daftar Video</h1>
          {pagination && (
            <p className="text-text-muted text-sm">
              Halaman {pagination.currentPage} dari {pagination.totalPages}
            </p>
          )}
        </div>
      </div>

      {error ? (
        <div className="text-center py-20">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      ) : loading ? (
        <GridSkeleton count={20} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {videos.map((v) => (
              <VideoCard key={v.slug || v.url} video={v} />
            ))}
          </div>
          {pagination && (
            <>
              <div className="text-center text-text-muted text-sm mt-6">
                Halaman {pagination.currentPage} dari {pagination.totalPages}
              </div>
              <Pagination pagination={pagination} onPageChange={(p) => setSearchParams({ page: String(p) })} />
            </>
          )}
        </>
      )}
    </div>
  );
}
