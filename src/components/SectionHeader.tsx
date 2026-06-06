import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

interface SectionHeaderProps {
  icon?: React.ReactNode;
  label: string;
  highlight: string;
  viewAllLink?: string;
  viewAllLabel?: string;
}

export default function SectionHeader({
  icon,
  label,
  highlight,
  viewAllLink,
  viewAllLabel = 'Lihat Semua',
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-6 bg-accent-blue rounded-full" />
        {icon && <span className="text-text-muted">{icon}</span>}
        <h2 className="text-lg font-bold text-text-primary">
          {label}{' '}
          <span className="text-accent-blue">{highlight}</span>
        </h2>
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-accent-blue transition-colors font-semibold"
        >
          {viewAllLabel}
          <FiChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
