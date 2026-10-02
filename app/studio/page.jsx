'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, Trash2, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function WizardCatStudio() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('Digital Fine Art & Acrylic Base');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [catSpeech, setCatSpeech] = useState(
    'Mrow! Welcome to my sanctum. Feed me your art and I shall enshrine it into the atelier!'
  );

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
      setCatSpeech(`*Sniff sniff* Ah, "${selected.name}"... a fine offering! Name it and seal the spell.`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setCatSpeech('*Hiss* I need both an image and a title to cast the enshrinement spell!');
      return;
    }

    setUploading(true);
    setCatSpeech('*Chants arcane cat spells... weaving your painting into reality...*');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 1. Upload to Supabase Storage bucket 'gallery'
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Insert record into artworks table
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
      setCatSpeech(`*Purrrrr!* "${title}" has been permanently bound to the Atelier walls!`);
    } catch (err) {
      console.error(err);
      setCatSpeech(`*Coughs up hairball* The spell faltered: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (artwork) => {
    const confirmDelete = window.confirm(`Shall the Wizard Cat banish "${artwork.title}" from the atelier forever?`);
    if (!confirmDelete) return;

    setCatSpeech(`*SWAT!* Banishment spell cast upon "${artwork.title}"!`);

    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artwork.id);

      if (error) throw error;

      setArtworks((prev) => prev.filter((item) => item.id !== artwork.id));
      setCatSpeech(`*Licks paw smugly.* "${artwork.title}" was swatted into the void.`);
    } catch (err) {
      setCatSpeech(`Failed to banish: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8 font-sans selection:bg-purple-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white bg-zinc-900 border border-purple-500/30 px-3.5 py-1.5 rounded-full transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Atelier Room</span>
          </Link>

          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            Sanctum Studio Engine
          </span>
        </div>

        {/* Wizard Cat Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/80 via-zinc-900 to-zinc-950 p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-purple-900/40 border-2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            <span className="text-5xl select-none animate-bounce">🧙‍♂️🐱</span>
            <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-amber-300 animate-spin" />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-purple-100">
                Archmage Whisker’s Atelier Sanctum
              </h1>
            </div>
            <div className="relative mt-2 p-3 rounded-xl bg-black/60 border border-purple-500/30 font-mono text-xs sm:text-sm text-purple-200">
              "{catSpeech}"
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-serif font-bold text-amber-200 mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-purple-400" />
            <span>Enshrine New Masterpiece</span>
          </h2>

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Artwork Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Celestial Moth over Chimney"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Medium & Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oil on Linen, Acrylic, or Digital Study"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Select Canvas File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-900 file:text-purple-200 hover:file:bg-purple-800 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enshrining Artwork...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Cast Enshrinement Spell</span>
                  </>
                )}
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950/80 p-4 min-h-[220px]">
              {preview ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-56 max-w-full rounded-lg object-contain shadow-md"
                  />
                </div>
              ) : (
                <div className="text-center text-zinc-500 space-y-2">
                  <ImageIcon className="h-10 w-10 mx-auto opacity-40" />
                  <p className="text-xs font-mono">No canvas chosen yet</p>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* Current Gallery Roster */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-zinc-200">
              Active Atelier Gallery ({artworks.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span>Summoning gallery artifacts...</span>
            </div>
          ) : artworks.length === 0 ? (
            <div className="p-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-center text-zinc-500 text-sm font-mono">
              The sanctum shelves are empty. Upload your first artwork above!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {artworks.map((art) => (
                <div
                  key={art.id}
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 shadow-lg hover:border-purple-500/50 transition flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-center">
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-zinc-100">{art.title}</h3>
                      <p className="text-[11px] text-zinc-400 italic">{art.medium}</p>
                    </div>

                    <button
                      onClick={() => handleDelete(art)}
                      title="Paw of Banishment (Delete)"
                      className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-300 hover:bg-rose-900 hover:text-white transition"
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
    </main>
  );
}
