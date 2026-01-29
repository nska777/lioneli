"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductLightbox({
  open,
  title,
  gallery,
  idx,
  setIdx,
  onClose,
  onPrev,
  onNext,
}: {
  open: boolean;
  title: string;
  gallery: string[];
  idx: number;
  setIdx: (n: number) => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!open) return null;

  const maxLen = Math.max(1, gallery.length);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85" onClick={onClose}>
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-[1200px]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-black">
            <Image
              src={gallery[idx]}
              alt={`${title} ${idx + 1}`}
              fill
              className="object-contain"
              sizes="1200px"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white/95 grid place-items-center cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5 text-black/70" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => {
                  onPrev();
                  // setIdx управляется снаружи через onPrev/onNext, но оставим API если захочешь
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/95 grid place-items-center cursor-pointer"
                aria-label="Назад"
              >
                <ChevronLeft className="h-6 w-6 text-black/70" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/95 grid place-items-center cursor-pointer"
                aria-label="Вперёд"
              >
                <ChevronRight className="h-6 w-6 text-black/70" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-[12px] text-black/70">
                {idx + 1} / {maxLen}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
