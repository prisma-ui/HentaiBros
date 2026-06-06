import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import { getGenres } from '../api/client';
import { useSEO } from '../hooks/useSEO';
import { useStructuredData } from '../hooks/useStructuredData';
import type { GenreListItem } from '../types';

const SITE_URL = (process.env.REACT_APP_SITE_URL || '').replace(/\/$/, '');

const ACCENT_COLORS = [
  'border-l-blue-500', 'border-l-purple-500', 'border-l-green-500', 'border-l-orange-500',
  'border-l-pink-500', 'border-l-cyan-500', 'border-l-yellow-500', 'border-l-red-500',
];

export default function GenresPage() {
  const [genres, setGenres] = useState<GenreListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({
    title: 'Semua Genre',
    description: `Jelajahi semua genre hentai di HentaiBros — vanilla, romance, uncensored, harem, fantasy, dan masih banyak lagi.`,
    url: '/genres',
  });

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Semua Genre — HentaiBros',
    url: `${SITE_URL}/genres`,
    description: 'Daftar semua genre hentai yang tersedia di HentaiBros.',
  });

  useEffect(() => {
    getGenres().then((res) => {
      if (res.status === 'ok') setGenres(res.data as GenreListItem[]);
      else setError(res.message || 'Gagal memuat genre');
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-accent-blue rounded-full" />
        <FiTag size={20} className="text-accent-blue" />
        <div>
          <h1 className="text-xl font-black text-text-primary">Semua Genre</h1>
          {!loading && !error && (
            <p className="text-text-muted text-sm">{genres.length} genre tersedia</p>
          )}
        </div>
      </div>

      {error ? (
        <div className="text-center py-20 text-red-400 font-semibold">{error}</div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-16 bg-bg-card rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {genres.map((genre, i) => (
            <Link
              key={genre.slug}
              to={`/genre/${genre.slug}`}
              className={`group bg-bg-card border border-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-xl px-4 py-3.5 hover:bg-bg-hover transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20`}
            >
              <div className="font-bold text-text-primary text-sm group-hover:text-white transition-colors truncate">
                {genre.name}
              </div>
              {genre.count !== undefined && (
                <div className="text-text-dim text-xs mt-0.5">{genre.count} anime</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
