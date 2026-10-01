'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AmbientLucky from '@/components/AmbientLucky';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Sparkles, Palette, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArtworks(docs);
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      {/* Hero Studio Room Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-10">
        {/* Fullscreen Room Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
          style={{ backgroundImage: "url('/den-background.jpg')" }}
        >
          {/* Atmospheric Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
        </div>

        {/* Top Header Bar */}
        <header className="relative z-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif tracking-wider text-white drop-shadow-md">
              MINDS EYE BUTTERFLY
            </h1>
            <p className="text-xs sm:text-sm tracking-widest text-zinc-300 uppercase drop-shadow">
              Fine Art & Creative Atelier
            </p>
          </div>

          <Link
            href="/studio"
            className="flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-950/60 px-4 py-2 text-xs font-semibold text-purple-200 backdrop-blur-md shadow-lg hover:bg-purple-900/80 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
            <span>Studio Sanctum</span>
          </Link>
        </header>

        {/* Lucky Wandering / Snoozing in the Room */}
        <AmbientLucky />

        {/* Bottom Banner & Scroll Prompt */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center pb-4">
          <a
            href="#gallery"
            className="group flex flex-col items-center gap-1 text-xs tracking-widest text-zinc-300 uppercase transition hover:text-white drop-shadow"
          >
            <span>Explore The Collection</span>
            <span className="text-lg transition-transform group-hover:translate-y-1">↓</span>
          </a>
        </div>
      </section>

      {/* Artwork Gallery Showcase */}
      <section id="gallery" className="relative z-20 min-h-screen px-6 py-20 sm:px-12 max-w-7xl mx-auto">
        <div className="mb-12 text-center space-y-2">
          <h2 className="text-3xl sm:text-5xl font-serif text-white">The Atelier Gallery</h2>
          <p className="text-sm text-zinc-400">Original fine art, curated paintings, and mystical creations</p>
        </div>

        {artworks.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center backdrop-blur-sm">
            <Palette className="mx-auto h-10 w-10 text-purple-400 mb-3 opacity-80" />
            <h3 className="text-lg font-medium text-zinc-200">The Gallery is Awakening</h3>
            <p className="mt-2 text-xs text-zinc-400">
              No works are currently displayed. Head into the Studio Sanctum or wake Lucky to summon the first piece.
            </p>
            <Link
              href="/studio"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
            >
              Enter Sanctum
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArtwork(art)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl transition-all hover:-translate-y-1 hover:border-purple-500/50"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-zinc-950">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h4 className="font-medium text-zinc-200 text-sm tracking-wide">{art.title}</h4>
                  <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-purple-400 transition" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal viewer for artwork */}
        {selectedArtwork && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedArtwork(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-purple-500/30 bg-zinc-950 p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="max-h-[75vh] w-auto mx-auto rounded-lg object-contain"
              />
              <div className="mt-4 flex items-center justify-between px-2">
                <h3 className="text-lg font-serif text-white">{selectedArtwork.title}</h3>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="rounded-lg bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <p>© Minds Eye Butterfly Studio. Protected by Wizard Lucky's spells.</p>
      </footer>
    </main>
  );
}
