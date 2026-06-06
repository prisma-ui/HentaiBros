import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import GenresPage from './pages/GenresPage';
import GenreDetailPage from './pages/GenreDetailPage';
import SearchPage from './pages/SearchPage';
import VideoDetailPage from './pages/VideoDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/genre/:slug" element={<GenreDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/video/:slug" element={<VideoDetailPage />} />
            <Route path="*" element={
              <div className="flex items-center justify-center py-32 text-text-muted font-semibold text-lg">
                Halaman tidak ditemukan
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
