import React from 'react';

export function VideoCardSkeleton() {
  return (
    <div className="bg-bg-card rounded-xl overflow-hidden border border-border animate-pulse">
      <div className="aspect-[16/10] bg-bg-hover" />
      <div className="p-2.5 space-y-2">
        <div className="h-3.5 bg-bg-hover rounded w-full" />
        <div className="h-3.5 bg-bg-hover rounded w-3/4" />
        <div className="h-3 bg-bg-hover rounded w-1/2 mt-1" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[21/7] bg-bg-hover animate-pulse">
      <div className="absolute bottom-6 left-6 space-y-3">
        <div className="h-5 bg-bg-card rounded w-32" />
        <div className="h-8 bg-bg-card rounded w-72" />
        <div className="h-4 bg-bg-card rounded w-56" />
        <div className="flex gap-2 mt-2">
          <div className="h-9 bg-bg-card rounded-lg w-28" />
          <div className="h-9 bg-bg-card rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
