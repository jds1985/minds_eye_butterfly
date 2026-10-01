'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db, storage } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import WizardBowlUploader from '@/components/WizardBowlUploader';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { KeyRound, Trash2, ArrowLeft, ExternalLink } from 'lucide-react';

export default function StudioDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkForDelete, setSelectedArtworkForDelete] = useState(null);

  // Check saved session in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studio_unlocked');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setArtworks(items);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const correctPasscode = process.env.NEXT_PUBLIC_STUDIO_PASSCODE || 'butterflymagic';
    if (passcode.trim() === correctPasscode) {
      setIsAuthenticated(true);
      localStorage.setItem('studio_unlocked', 'true');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleDelete = async (artwork) => {
    try {
      if (artwork.storagePath) {
        const fileRef = ref(storage, artwork.storagePath);
        await deleteObject(fileRef).catch((err) => console.warn('Storage file deletion note:', err));
      }
      await deleteDoc(doc(db, 'artworks', artwork.id));
    } catch (err) {
      console.error('Error deleting piece:', err);
    }
  };

  // PASSCODE SCREEN
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
        <div className="w-full max-w-sm rounded-3xl border border-purple-500/20 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-900/40 text-purple-400">
            <KeyRound className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">Wizard Sanctum</h1>
          <p className="mt-1 text-xs text-zinc-400">Enter the secret passphrase to unlock the studio.</p>

          <form onSubmit={handlePasscodeSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Dev key passphrase..."
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-center text-sm text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
            />
            {error && <p className="text-xs text-red-400">Incorrect passphrase, try again!</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
            >
              Enter Studio
            </button>
          </form>

          <div className="mt-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300">
              <ArrowLeft className="h-3 w-3" /> Back to Landing Page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // DASHBOARD
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <span>Minds Eye Butterfly Studio</span>
            </h1>
            <p className="text-xs text-zinc-400">Lucky the Wizard Cat's Atelier</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition"
            >
              <span>View Live Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('studio_unlocked');
                setIsAuthenticated(false);
              }}
              className="rounded-xl border border-zinc-800 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition"
            >
              Lock Studio
            </button>
          </div>
        </header>

        {/* Uploader Section */}
        <section>
          <WizardBowlUploader />
        </section>

        {/* Active Gallery Management */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">
              Active Artworks ({artworks.length})
            </h2>
            <span className="text-xs text-zinc-500">Live sync active</span>
          </div>

          {artworks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
              No artworks yet! Feed the magical bowl above to add your first piece.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {artworks.map((art) => (
                <div
                  key={art.id}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 transition hover:border-purple-500/50"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950">
                    <Image
                      src={art.imageUrl}
                      alt={art.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between px-1">
                    <p className="truncate text-xs font-semibold text-zinc-200">
                      {art.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedArtworkForDelete(art)}
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition"
                      title="Delete Artwork"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 3-Step Delete Modal */}
      <DeleteConfirmationModal
        item={selectedArtworkForDelete}
        isOpen={Boolean(selectedArtworkForDelete)}
        onClose={() => setSelectedArtworkForDelete(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
