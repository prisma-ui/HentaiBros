import React from 'react';
import { Link } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import { FiMail, FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-1.5 mb-3">
              <div className="w-7 h-7 bg-accent-blue rounded flex items-center justify-center">
                <BsFillPlayFill className="text-white text-sm" />
              </div>
              <span className="font-black text-lg">
                <span className="text-white">Hentai</span>
                <span className="text-accent-blue">Bros</span>
              </span>
            </Link>
            <p className="text-text-muted text-xs leading-relaxed mb-4">
              Platform streaming hentai dengan ribuan judul. Nonton gratis, kualitas HD, update setiap hari tanpa ribet.
            </p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5 text-xs text-text-muted hover:text-text-primary hover:border-text-dim transition-colors">
                <FiMail size={12} />
                Hubungi Kami
              </button>
              <button className="flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5 text-xs text-text-muted hover:text-text-primary hover:border-text-dim transition-colors">
                <FiShield size={12} />
                DMCA
              </button>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-accent-blue rounded-full inline-block" />
              NAVIGASI
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/list', label: 'Daftar Video' },
                { to: '/genres', label: 'Genre' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-text-muted text-sm hover:text-text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genre */}
          <div>
            <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-orange-500 rounded-full inline-block" />
              GENRE
            </h4>
            <ul className="space-y-2">
              {[
                { slug: 'vanilla', label: 'Vanilla' },
                { slug: 'romance', label: 'Romance' },
                { slug: 'uncensored', label: 'Uncensored' },
                { slug: 'harem', label: 'Harem' },
                { slug: 'fantasy', label: 'Fantasy' },
                { slug: 'school', label: 'School' },
              ].map((g) => (
                <li key={g.slug}>
                  <Link to={`/genre/${g.slug}`} className="text-text-muted text-sm hover:text-text-primary transition-colors">
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-0.5 h-4 bg-accent-blue rounded-full inline-block" />
              INFORMASI
            </h4>
            <ul className="space-y-2">
              {['Tentang Kami', 'Kontak', 'DMCA', 'Kebijakan Privasi'].map((item) => (
                <li key={item}>
                  <span className="text-text-muted text-sm cursor-pointer hover:text-text-primary transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-text-dim">
          <span>2026 HentaiBros — Semua hak dilindungi.</span>
          <span>Video berasal dari pihak ketiga. Tidak menghosting file apapun.</span>
        </div>
      </div>
    </footer>
  );
}
