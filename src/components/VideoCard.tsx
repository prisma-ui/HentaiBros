import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { resolveSlug } from '../utils/slug';
import type { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
  variant?: 'grid' | 'list';
  priority?: boolean;
}

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxYTFmMmUiLz48cGF0aCBkPSJNMTQ4IDgwTDE3MiAxMTJMMTQ4IDE0NEgxNzJMMTk2IDExMkwxNzIgODBIMTQ4WiIgZmlsbD0iIzJhMzE0MiIvPjwvc3ZnPg==';

export default function VideoCard({ video, variant = 'grid', priority = false }: VideoCardProps) {
  const slug = resolveSlug(video.slug, video.url);

  return (
    <Link
      to={`/video/${slug}`}
      className="group block bg-bg-card rounded-xl overflow-hidden border border-border hover:border-accent-blue/40 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width="320"
            height="200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bg-secondary">
            <div className="w-10 h-10 text-border">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}

        {video.duration && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            <FiClock size={10} />
            {video.duration}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>

      <div className="p-2.5">
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug group-hover:text-accent-blue transition-colors">
          {video.title}
        </h3>
        {video.publishedAt && (
          <div className="flex items-center gap-1 mt-1.5 text-text-muted text-xs">
            <FiCalendar size={10} />
            <time>{video.publishedAt}</time>
          </div>
        )}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag.slug} className="text-xs bg-bg-hover text-text-muted px-1.5 py-0.5 rounded font-medium">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
