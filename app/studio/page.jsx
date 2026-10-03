'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, UploadCloud, Trash2, Sparkles, 
  Check, Lock, Shirt, Laptop, BookOpen, Palette, Frame, ShieldAlert 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DESTINATIONS = [
  { id: 'laptop', label: 'Laptop Gallery', icon: Laptop, room: 'Studio Den' },
  { id: 'sketchbook', label: 'Drawing Pad Study', icon: BookOpen, room: 'Studio Den' },
  { id: 'easel', label: 'Studio Easel (Focal)', icon: Palette, room: 'Studio Den' },
  { id: 'wallArt', label: 'Wall Masterpiece', icon: Frame, room: 'Studio Den' },
  { id: 'wardrobe_top', label: 'Wardrobe: Top / Outerwear', icon: Shirt, room: 'Dressing Room' },
  { id: 'wardrobe_bottom', label: 'Wardrobe: Bottom / Skirt', icon: Shirt, room: 'Dressing Room' },
  { id: 'vault', label: 'Corvid Chest (Patron Vault)', icon: Lock, room: 'Dressing Room' },
];

export default function StudioCuratorDashboard() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [mediumOrDetail, setMediumOrDetail] = useState('');
  const [category, setCategory] = useState('laptop');
  const [price, setPrice] = useState('');
  const [rarity, setRarity] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Filter State
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage('Please provide an image and title.');
      return;
    }

    setUploading(true);
    setMessage('Uploading artifact to Supabase...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `atelier/${fileName}`;

      // Upload file to Supabase storage bucket
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Insert record
      const { error: insertError } = await supabase
        .from('artworks')
        .insert([
          {
            title: title.trim(),
            medium: mediumOrDetail.trim() || 'Atelier Original',
            category: category,
            price: price.trim() || null,
            rarity: rarity.trim() || null,
            image_url: publicUrl,
          }
        ]);

      if (insertError) throw insertError;

      setMessage('Artifact successfully curated and cataloged!');
      setTitle('');
      setMediumOrDetail('');
      setPrice('');
      setRarity('');
      setFile(null);
      setPreviewUrl('');
      fetchItems();
    } catch (err) {
      console.error(err);
      setMessage(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm('Are you sure you want to remove this piece from the atelier?')) return;
    
    try {
      await supabase.from('artworks').delete().eq('id', id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(item => (item.category || 'laptop') === activeFilter);

  const isMerch = category.startsWith('wardrobe') || category === 'vault';

  return (
    <main className="min-h-screen bg-[#070509] text-stone-200 font-sans p-4 sm:p-8 selection:bg-purple-950">
      
      {/* Top Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-stone-850 pb-5 mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/90 px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white hover:border-purple-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Den</span>
        </Link>

        <div className="text-center">
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-amber-200 uppercase">
            Atelier Curator Matrix
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mt-0.5">
            Single Hub Universal Uploader & Dispatch
          </p>
        </div>

        <Link
          href="/wardrobe"
          className="flex items-center gap-2 rounded-full border border-amber-600/40 bg-amber-950/40 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-950/70 transition"
        >
          <span>View Dressing Room</span>
        </Link>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Universal Upload Form */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-800 bg-stone-950/80 p-6 shadow-2xl backdrop-blur-md space-y-5">
          <div className="border-b border-stone-800/80 pb-3">
            <h2 className="font-serif text-base font-bold text-amber-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Curate New Artifact</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Select destination to automatically route across rooms.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            
            {/* Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Placement & Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-stone-900 border border-stone-750 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    [{d.room}] {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Title / Name
              </label>
              <input
                type="text"
                placeholder="e.g. Heavyweight Metamorphosis Hoodie"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl bg-stone-900 border border-stone-750 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Medium or Fabric Specs */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                {isMerch ? 'Fabric / Material Detail' : 'Medium / Description'}
              </label>
              <input
                type="text"
                placeholder={isMerch ? "e.g. 450 GSM French Terry with silver stitch" : "e.g. Oil on Belgian Linen"}
                value={mediumOrDetail}
                onChange={(e) => setMediumOrDetail(e.target.value)}
                className="w-full rounded-xl bg-stone-900 border border-stone-750 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Merch Specific Fields: Price & Rarity */}
            {isMerch && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-amber-300/80">
                    Price
                  </label>
                  <input
                    type="text"
                    placeholder="$78"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl bg-stone-900 border border-stone-750 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-amber-300/80">
                    Rarity / Edition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1-of-1 Archive"
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value)}
                    className="w-full rounded-xl bg-stone-900 border border-stone-750 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Image File Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Image Artifact
              </label>
              <div className="relative border-2 border-dashed border-stone-800 hover:border-purple-400/60 rounded-2xl p-4 text-center cursor-pointer transition bg-stone-900/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="h-32 w-auto object-contain rounded-lg border border-stone-700 shadow"
                    />
                    <span className="text-[10px] text-purple-300 font-mono">Click to change image</span>
                  </div>
                ) : (
                  <div className="py-4 space-y-2">
                    <UploadCloud className="w-8 h-8 mx-auto text-stone-500" />
                    <p className="text-xs text-stone-400">Click or drag image file here</p>
                    <p className="text-[10px] text-stone-500 font-mono">Supports PNG, JPG, WebP</p>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <p className="text-xs font-mono text-amber-400 text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-600 text-white font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition shadow-lg"
            >
              {uploading ? 'Processing Dispatch...' : 'Curate & Publish'}
            </button>
          </form>
        </div>

        {/* Right Column: Curated Inventory Management */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition ${
                activeFilter === 'all'
                  ? 'bg-amber-600 text-black font-bold'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              All Items ({items.length})
            </button>
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveFilter(d.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition ${
                  activeFilter === d.id
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Item Grid */}
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-stone-500">
              Loading atelier archive...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-stone-850 bg-stone-950/40 p-12 text-center text-stone-500 space-y-2">
              <p className="text-xs">No artifacts cataloged in this category yet.</p>
              <p className="text-[10px] font-mono">Use the form on the left to upload your first piece.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const dest = DESTINATIONS.find(d => d.id === (item.category || 'laptop'));
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-stone-800 bg-stone-950/90 p-4 flex flex-col justify-between space-y-3 shadow-lg hover:border-stone-750 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">
                          {dest?.room}: {dest?.label}
                        </span>
                        {item.price && (
                          <span className="text-xs font-serif font-bold text-amber-300">
                            {item.price}
                          </span>
                        )}
                      </div>

                      <div className="relative h-40 w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-850 flex items-center justify-center">
                        <img
                          src={item.image_url || item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-sm text-stone-200">{item.title}</h3>
                        <p className="text-[11px] text-stone-400 line-clamp-1">{item.medium}</p>
                        {item.rarity && (
                          <span className="text-[9px] font-mono text-amber-400/90 mt-1 block">
                            ★ {item.rarity}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-900/30 text-xs font-mono transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Artifact</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </main>
  );
}
