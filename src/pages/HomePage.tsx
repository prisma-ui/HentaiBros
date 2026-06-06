import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiPlay, FiList, FiTrendingUp } from 'react-icons/fi';
import VideoCard from '../components/VideoCard';
import SectionHeader from '../components/SectionHeader';
import { GridSkeleton, HeroSkeleton } from '../components/Skeleton';
import { getVideos } from '../api/client';
import { useSEO } from '../hooks/useSEO';
import { useStructuredData } from '../hooks/useStructuredData';
import { resolveSlug } from '../utils/slug';
import type { VideoItem } from '../types';

export default function HomePage() {
  const [latestVideos, setLatestVideos] = useState<VideoItem[]>([]);
  const [popularVideos, setPopularVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  useSEO({
    url: '/',
    type: 'website',
  });

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HentaiBros',
    url: process.env.REACT_APP_SITE_URL ||'',
    description: 'Platform streaming hentai terlengkap. Ribuan judul, update setiap hari.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.REACT_APP_SITE_URL || ''}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [latestRes, popularRes] = await Promise.all([
        getVideos(1, 'latest'),
        getVideos(1, 'random'),
      ]);
      if (latestRes.status === 'ok') setLatestVideos(latestRes.data.videos);
      if (popularRes.status === 'ok') setPopularVideos(popularRes.data.videos);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (heroPaused || latestVideos.length === 0) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % Math.min(8, latestVideos.length)), 5000);
    return () => clearInterval(t);
  }, [heroPaused, latestVideos.length]);

  const heroVideos = latestVideos.slice(0, 8);
  const hero = heroVideos[heroIdx];
  const prevHero = () => setHeroIdx((i) => (i - 1 + heroVideos.length) % heroVideos.length);
  const nextHero = () => setHeroIdx((i) => (i + 1) % heroVideos.length);
  const heroSlug = resolveSlug(hero?.slug, hero?.url);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Slider */}
      <section className="mb-10">
        <SectionHeader label="Episode" highlight="Terbaru" />
        {loading ? (
          <HeroSkeleton />
        ) : hero ? (
          <div
            className="relative rounded-2xl overflow-hidden bg-bg-secondary"
            style={{ aspectRatio: '21/8' }}
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
          >
            <img
              src={hero.thumbnail}
              alt={hero.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 max-w-lg">
              {hero.duration && (
                <span className="inline-flex items-center gap-1 bg-accent-blue text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                  <FiPlay size={10} />
                  {hero.duration} Terbaru
                </span>
              )}
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-1.5 line-clamp-2">
                {hero.title}
              </h2>
              {hero.publishedAt && (
                <p className="text-white/70 text-sm mb-3">{hero.publishedAt}</p>
              )}
              <div className="flex gap-2">
                <Link
                  to={`/video/${heroSlug}`}
                  className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  <FiPlay size={14} />
                  Tonton
                </Link>
                <Link
                  to={`/video/${heroSlug}`}
                  className="flex items-center gap-2 border border-white/30 hover:border-white/60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
                >
                  Detail
                </Link>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {heroVideos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all ${i === heroIdx ? 'w-5 h-1.5 bg-accent-blue' : 'w-1.5 h-1.5 bg-white/40'}`}
                />
              ))}
            </div>

            <button onClick={prevHero} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors">
              <FiChevronLeft size={16} />
            </button>
            <button onClick={nextHero} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors">
              <FiChevronRight size={16} />
            </button>

            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md">
              {String(heroIdx + 1).padStart(2, '0')} / {String(heroVideos.length).padStart(2, '0')}
            </div>
          </div>
        ) : null}
      </section>

      {/* Latest Videos */}
      <section className="mb-10">
        <SectionHeader icon={<FiList size={18} />} label="Video" highlight="Terbaru" viewAllLink="/list" />
        {loading ? (
          <GridSkeleton count={10} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {latestVideos.slice(0, 10).map((v) => (
              <VideoCard key={resolveSlug(v.slug, v.url)} video={v} priority={latestVideos.indexOf(v) < 4} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Videos */}
      <section className="mb-10">
        <SectionHeader icon={<FiTrendingUp size={18} />} label="Video" highlight="Populer" viewAllLink="/list" />
        {loading ? (
          <GridSkeleton count={10} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {popularVideos.slice(0, 10).map((v) => (
              <VideoCard key={resolveSlug(v.slug, v.url)} video={v} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
