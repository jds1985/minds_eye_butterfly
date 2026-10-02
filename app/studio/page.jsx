'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

export default function StudioCurator() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('Digital Fine Art & Acrylic Base');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArtworks(data);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setMessage(`Selected: ${selected.name}`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setMessage('Please provide both an artwork title and an image file.');
      return;
    }

    setUploading(true);
    setMessage('Uploading canvas...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { data: newDoc, error: insertError } = await supabase
        .from('artworks')
        .insert([{ title, medium, image_url: imageUrl }])
        .select()
        .single();

      if (insertError) throw insertError;

      setArtworks((prev) => [newDoc, ...prev]);
      setTitle('');
      setFile(null);
      setPreview(null);
      setMessage(`"${title}" added to the atelier.`);
    } catch (err) {
      console.error(err);
      setMessage(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (artwork) => {
    const confirmDelete = window.confirm(`Remove "${artwork.title}" from the atelier archive?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artwork.id);

      if (error) throw error;

      setArtworks((prev) => prev.filter((item) => item.id !== artwork.id));
      setMessage(`"${artwork.title}" removed.`);
    } catch (err) {
      setMessage(`Delete error: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-8 font-sans selection:bg-amber-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 border border-stone-700 px-4 py-2 rounded-full transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Den</span>
          </Link>

          <span className="text-xs font-mono tracking-widest text-stone-500 uppercase">
            Curator Sanctum
          </span>
        </div>

        {/* Lucky Memorial Card */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="relative shrink-0 w-28 h-28 rounded-2xl overflow-hidden border border-amber-600/30 bg-stone-950 flex items-center justify-center">
            <img
              src="/Lucky_wizard.png"
              alt="Lucky"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="h-full w-full object-cover"
            />
            {/* Fallback if lucky.png is not yet in public/ */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 text-stone-500 text-[10px]">
              <span>In Memory of</span>
              <span className="font-serif font-bold text-stone-300 text-xs">Lucky</span>
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h1 className="font-serif text-xl font-bold text-stone-100">
              Lucky's Atelier Sanctuary
            </h1>
            <p className="text-xs text-stone-400">
              Archive curator for Minds Eye Butterfly. Preserving canvases and creative works.
            </p>
            {message && (
              <p className="text-xs font-mono text-amber-300/90 pt-1">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Clean Upload Form */}
        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 shadow-lg">
          <h2 className="text-sm font-serif font-bold text-stone-200 mb-4 flex items-center gap-2">
            <Upload className="h-4 w-4 text-amber-400" />
            <span>Add Artwork to Atelier</span>
          </h2>

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Artwork title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oil on Belgian Linen"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                  File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-stone-200 hover:file:bg-stone-700 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 rounded-lg bg-stone-100 hover:bg-white text-stone-950 font-semibold text-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Publish to Gallery</span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center rounded-xl border border-stone-800 bg-stone-950 p-4 min-h-[180px]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 max-w-full rounded object-contain"
                />
              ) : (
                <div className="text-center text-stone-500 space-y-1">
                  <ImageIcon className="h-6 w-6 mx-auto opacity-30" />
                  <p className="text-xs font-mono">No canvas chosen</p>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* Gallery Archive with Lucky's Bowl Discard */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-serif font-bold text-stone-200">
              Current Gallery Works ({artworks.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-stone-500 text-xs font-mono">
              Loading archive...
            </div>
          ) : artworks.length === 0 ? (
            <div className="p-8 rounded-xl border border-stone-800 bg-stone-900/30 text-center text-stone-500 text-xs font-mono">
              No artworks stored yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {artworks.map((art) => (
                <div
                  key={art.id}
                  className="group rounded-xl border border-stone-800 bg-stone-900/60 p-3 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded bg-black mb-2 flex items-center justify-center">
                    <img
                      src={art.image_url || art.imageUrl}
                      alt={art.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="truncate pr-2">
                      <p className="font-serif font-bold text-xs text-stone-200 truncate">{art.title}</p>
                      <p className="text-[10px] text-stone-400 italic truncate">{art.medium}</p>
                    </div>

                    <button
                      onClick={() => handleDelete(art)}
                      title="Discard to Lucky's bowl"
                      className="p-1.5 rounded-lg border border-stone-800 hover:border-rose-900 bg-stone-950 text-stone-400 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
