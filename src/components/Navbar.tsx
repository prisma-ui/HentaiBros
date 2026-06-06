import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { BsFillPlayFill } from 'react-icons/bs';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 bg-accent-blue rounded flex items-center justify-center">
            <BsFillPlayFill className="text-white text-sm" />
          </div>
          <span className="font-black text-lg leading-none">
            <span className="text-white">Hentai</span>
            <span className="text-accent-blue">Bros</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 ml-2">
          <NavLink to="/" label="Beranda" />
          <NavLink to="/list" label="Daftar Video" />
          <NavLink to="/genres" label="Genre" />
        </div>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center ml-auto bg-bg-secondary border border-border rounded-lg overflow-hidden h-9 w-56">
          <input
            type="text"
            placeholder="Cari video..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-text-primary text-sm px-3 py-1 w-full outline-none placeholder-text-muted"
          />
          <button type="submit" className="px-2.5 text-text-muted hover:text-accent-blue transition-colors">
            <FiSearch size={15} />
          </button>
        </form>

        {/* Mobile right controls */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-text-muted p-1">
            <FiSearch size={18} />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-text-muted p-1">
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-bg-primary">
          <form onSubmit={handleSearch} className="flex items-center bg-bg-secondary border border-border rounded-lg overflow-hidden h-10">
            <input
              ref={inputRef}
              type="text"
              placeholder="Cari video..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="bg-transparent text-text-primary text-sm px-3 w-full outline-none placeholder-text-muted"
            />
            <button type="submit" className="px-3 text-text-muted">
              <FiSearch size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-primary border-t border-border px-4 py-3 flex flex-col gap-1">
          <MobileNavLink to="/" label="Beranda" />
          <MobileNavLink to="/list" label="Daftar Video" />
          <MobileNavLink to="/genres" label="Genre" />
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
        isActive
          ? 'text-text-primary bg-bg-hover'
          : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
      }`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="block py-2.5 px-3 rounded-lg text-text-primary font-semibold hover:bg-bg-hover transition-colors">
      {label}
    </Link>
  );
}
