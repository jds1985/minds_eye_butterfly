'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function WizardBowlUploader({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Meow! Offer an artwork to my magical bowl.");
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) selectFile(e.dataTransfer.files[0]);
  };

  const selectFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      setStatusMessage("Hiss! Lucky only accepts images (PNG, JPG, WEBP).");
      return;
    }
    setFile(selectedFile);
    if (!title) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
    setStatusMessage("A worthy offering! Now name it and summon it into the gallery.");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setStatusMessage("Lucky is casting the enchantment...");
      
      const fileExt = file.name.split('.').pop();
      const filename = `artworks/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (error) => {
          console.error(error);
          setStatusMessage("The spell fizzled! Check your Firebase connection.");
          setUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'artworks'), {
            title: title.trim() || 'Untitled Spell',
            imageUrl: downloadUrl,
            storagePath: filename,
            createdAt: serverTimestamp(),
          });

          setStatusMessage("Purrr! The artwork has manifested in your gallery!");
          setFile(null);
          setTitle('');
          setProgress(0);
          setUploading(false);
          if (onUploadComplete) onUploadComplete();
        }
      );
    } catch (err) {
      console.error(err);
      setStatusMessage("An arcane error occurred while saving.");
      setUploading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-3xl border border-purple-500/30 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-purple-400 bg-zinc-800 shadow-md">
          <Image src="/lucky-wizard.png" alt="Wizard Lucky" fill className="object-cover" />
        </div>
        <div className="relative rounded-2xl rounded-tl-none border border-purple-400/40 bg-purple-950/50 p-3 text-sm text-purple-200 shadow-md">
          <p>{statusMessage}</p>
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
          dragActive ? 'border-purple-400 bg-purple-900/20 scale-[1.01]' : 'border-zinc-700 bg-zinc-900/50 hover:border-purple-500/50 hover:bg-zinc-900/80'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && selectFile(e.target.files[0])} />
        <div className="relative mb-3 h-32 w-44 transition-transform group-hover:scale-105">
          <Image src="/cat-bowl.png" alt="Cat's Bowl" fill className="object-contain drop-shadow-[0_10px_15px_rgba(168,85,247,0.2)]" />
        </div>

        {file ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Ready: {file.name}</span>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-200">
              Drop artwork in Lucky's bowl or <span className="text-purple-400 underline underline-offset-4">tap to browse</span>
            </p>
            <p className="text-xs text-zinc-500">PNG, JPG, WEBP up to 25MB</p>
          </div>
        )}
      </div>

      {file && (
        <form onSubmit={handleUpload} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Artwork Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Butterfly"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {uploading && (
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-right text-xs text-purple-300">{progress}% summoned</p>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition"
          >
            <Sparkles className="h-4 w-4" />
            {uploading ? 'Casting Spell...' : 'Summon into Gallery'}
          </button>
        </form>
      )}
    </div>
  );
}
