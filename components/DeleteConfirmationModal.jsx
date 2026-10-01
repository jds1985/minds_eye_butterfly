'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function DeleteConfirmationModal({ item, isOpen, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !item) return null;

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setDeleting(true);
      await onConfirm(item);
      setDeleting(false);
      setStep(1);
      onClose();
    }
  };

  const handleCancel = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-purple-500/30 bg-zinc-900/95 p-6 shadow-2xl text-center text-white">
        <div className="mx-auto -mt-14 mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-purple-400 bg-zinc-800 shadow-xl overflow-hidden">
          <Image src="/lucky-wizard.png" alt="Wizard Lucky" width={80} height={80} className="object-cover" />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-wide text-zinc-100">
              Are you sure you want to delete <span className="text-purple-300">"{item.title || 'this artwork'}"</span>?
            </h3>
            <p className="text-xs text-zinc-400">Lucky will vanish it into the ether.</p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleCancel} className="w-1/2 rounded-xl border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium hover:bg-zinc-700 transition">Cancel</button>
              <button type="button" onClick={handleNextStep} className="w-1/2 rounded-xl bg-red-600/80 py-2.5 text-sm font-semibold hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-wide text-amber-300">Are you *really* sure?</h3>
            <p className="text-xs text-zinc-400">No take-backsies in the wizard sanctum.</p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleCancel} className="w-1/2 rounded-xl border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium hover:bg-zinc-700 transition">Cancel</button>
              <button type="button" onClick={handleNextStep} className="w-1/2 rounded-xl bg-red-600 py-2.5 text-sm font-bold shadow-lg shadow-red-900/40 hover:bg-red-500 transition">Really Sure</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold tracking-wider text-red-400 uppercase">FOR REALLY REALS?</h3>
            <p className="text-xs text-zinc-300">Final spell cast. It will be gone forever!</p>
            <div className="space-y-2 pt-2">
              <button type="button" disabled={deleting} onClick={handleNextStep} className="w-full rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 py-3 text-sm font-extrabold tracking-wide text-white shadow-xl hover:brightness-110 active:scale-95 transition">
                {deleting ? 'Incinerating...' : 'CONFIRM DELETE'}
              </button>
              <button type="button" onClick={handleCancel} className="w-full py-1 text-xs text-zinc-400 hover:text-zinc-200 transition">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
