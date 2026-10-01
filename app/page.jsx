'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import AmbientLucky from '@/components/AmbientLucky';
import { Sparkles, X, ChevronDown } from 'lucide-react';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [activeImage, setActiveImage] = useState(null);

  // Sync active artworks from Firestore
  useEffect(() => {
    const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setArtworks(items);
      },
      (error) => {
        console.warn('Firebase setup note: Artworks will appear once Firestore credentials are set.', error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white selection:bg-purple-500 selection:text-white">
      
      {/* HERO / ATELIER SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-12">
        {/* Cozy Background Room */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/den-background.jpg"
            alt="Minds Eye Butterfly Studio"
            fill
            priority
            className="object-cover object-center filter brightness-[0.82] contrast-105"
          />
          {/* Subtle magical vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
        </div>

        {/* Ambient Sleeping/Wandering Lucky */}
        <AmbientLucky />

        {/* Top Header */}
        <header className="relative z-10 flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase font-bold text-zinc-100 drop-shadow-md">
              Minds Eye Butterfly
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 font-light tracking-wider">
              Fine Art & Creative Atelier
            </p>
          </div>

          {/* Discreet Dev Key Portal */}
          <Link
            href="/studio"
            className="group flex items-center gap-2 rounded-full border border-purple-500/30 bg-zinc-950/40 px-3.5 py-1.5 backdrop-blur-md transition hover:border-purple-400 hover:bg-purple-950/60"
            title="Studio Portal"
          >
            <Sparkles className="h-4 w-4 text-purple-300 transition-transform group-hover:rotate-12" />
            <span className="text-xs font-medium text-purple-200/90 hidden sm:inline">Studio Gate</span>
          </Link>
        </header>

        {/* Hero Bottom Bar */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 pb-4">
          <a
            href="#gallery"
            className="group flex flex-col items-center gap-1 text-xs uppercase tracking-widest text-zinc-300/80 hover:text-white transition"
          >
            <span>Explore The Collection</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-purple-400 transition group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>

      {/* GALLERY GRID SECTION */}
      <section id="gallery" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="mb-12 text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold tracking-wider text-zinc-100 uppercase">
            The Gallery
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-purple-500/60" />
          <p className="text-sm text-zinc-400">Selected original works</p>
        </div>

        {artworks.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-16 text-center text-zinc-500">
            <p className="text-sm">The gallery is currently being curated.</p>
            <p className="mt-1 text-xs text-zinc-600">
              (Use the Studio Gate or whisper to Lucky to add the first artwork)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveImage(art)}
                className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-purple-950/30"
              >
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <h3 className="font-serif text-lg font-semibold tracking-wide text-white">
                    {art.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 rounded-full border border-zinc-700 bg-zinc-900/80 p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-[80vw] max-w-3xl">
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-serif text-lg font-bold text-zinc-100">
                {activeImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
        <p>© Minds Eye Butterfly Studio. Protected by Wizard Lucky's spells.</p>
      </footer>
    </main>
  );
}
