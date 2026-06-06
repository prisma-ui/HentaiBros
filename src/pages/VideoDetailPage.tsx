import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiTag, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { getVideoDetail } from '../api/client';
import { useSEO } from '../hooks/useSEO';
import { useStructuredData } from '../hooks/useStructuredData';
import type { VideoDetail } from '../types';

const SITE_URL = (process.env.REACT_APP_SITE_URL || '').replace(/\/$/, '');

export default function VideoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSource, setActiveSource] = useState(0);

  useSEO(
    data
      ? {
          title: data.title,
          description: data.description
            ? data.description.slice(0, 155)
            : `Nonton ${data.title} di HentaiBros — streaming gratis kualitas HD.`,
          image: data.thumbnail || undefined,
          url: `/video/${slug}`,
          type: 'video.other',
        }
      : { noIndex: true }
  );

  useStructuredData(
    data
      ? {
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: data.title,
          description: data.description || data.title,
          thumbnailUrl: data.thumbnail,
          uploadDate: data.publishedAt,
          url: `${SITE_URL}/video/${slug}`,
          embedUrl: data.embedUrl || data.sources?.[0]?.src,
          genre: data.genres?.map((g) => g.name),
        }
      : { '@context': 'https://schema.org', '@type': 'WebPage' }
  );

  useEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError('');
    setData(null);
    getVideoDetail(slug).then((res) => {
      if (res.status === 'ok') setData(res.data);
      else setError(res.message || 'Video tidak ditemukan');
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-5 bg-bg-hover rounded w-24 mb-4" />
        <div className="aspect-video bg-bg-hover rounded-2xl mb-4" />
        <div className="h-7 bg-bg-hover rounded w-3/4 mb-3" />
        <div className="h-4 bg-bg-hover rounded w-full mb-2" />
        <div className="h-4 bg-bg-hover rounded w-5/6" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400 font-semibold text-lg mb-4">{error || 'Video tidak ditemukan'}</p>
        <Link to="/" className="text-accent-blue hover:underline font-semibold">Kembali ke Beranda</Link>
      </div>
    );
  }

  const embedSrc = data.sources?.[activeSource]?.src || data.embedUrl;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-primary text-sm font-semibold mb-4 transition-colors">
        <FiArrowLeft size={15} />
        Kembali
      </Link>

      {/* Player */}
      <div className="rounded-2xl overflow-hidden bg-black aspect-video mb-4 shadow-xl shadow-black/40">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            title={data.title}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-dim">
            <div className="w-16 h-16 mb-3 opacity-30">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <p className="text-sm">Sumber video tidak tersedia</p>
            {data.url && (
              <a href={data.url} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 text-accent-blue text-sm hover:underline">
                <FiExternalLink size={14} />
                Tonton di sumber asli
              </a>
            )}
          </div>
        )}
      </div>

      {/* Source selector */}
      {data.sources && data.sources.length > 1 && (
        <div className="flex gap-2 mb-4">
          {data.sources.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveSource(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                i === activeSource
                  ? 'bg-accent-blue text-white border-accent-blue'
                  : 'bg-bg-card border-border text-text-muted hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              {src.label || `Server ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <h1 className="text-xl font-black text-text-primary leading-snug mb-3">{data.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-4">
          {data.publishedAt && (
            <div className="flex items-center gap-1.5">
              <FiCalendar size={14} />
              <time dateTime={data.publishedAt}>{data.publishedAt}</time>
            </div>
          )}
          {data.series && (
            <div className="flex items-center gap-1.5">
              <FiTag size={14} />
              <Link to={`/genre/${data.series.slug}`} className="hover:text-accent-blue transition-colors">
                {data.series.name}
              </Link>
            </div>
          )}
        </div>

        {data.genres && data.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.genres.map((g) => (
              <Link
                key={g.slug}
                to={`/genre/${g.slug}`}
                className="px-2.5 py-1 bg-bg-hover border border-border text-text-muted text-xs font-semibold rounded-lg hover:text-text-primary hover:border-accent-blue/40 transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>
        )}

        {data.description && (
          <div className="border-t border-border pt-4">
            <p className="text-text-muted text-sm leading-relaxed">{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
