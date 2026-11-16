import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '../types/tourism.ts';
import { SafeImage } from './SafeImage.tsx';

interface GalleryLightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChangeIndex((activeIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onChangeIndex((activeIndex - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, items.length, onClose, onChangeIndex]);

  if (activeIndex === null || !items[activeIndex]) return null;

  const current = items[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#012d1d]/92 backdrop-blur-md p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-[#f8faf7]">
          <span className="text-sm font-medium text-[#d8f3dc] tabular-nums">
            Foto {activeIndex + 1} dari {items.length} · {current.location}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup galeri"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#1b4332] text-[#f8faf7] hover:bg-[#2d6a4f] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-[#132a13] aspect-[16/10]">
          <SafeImage
            src={current.imageUrl}
            alt={current.title}
            fallbackTitle={current.title}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={() => onChangeIndex((activeIndex - 1 + items.length) % items.length)}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-[#012d1d]/75 text-[#ffffff] hover:bg-[#012d1d] transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-[#012d1d]/75 text-[#ffffff] hover:bg-[#012d1d] transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="text-[#f8faf7] px-1">
          <h3 className="text-xl font-bold">{current.title}</h3>
          <p className="text-base text-[#d8f3dc] mt-1">{current.caption}</p>
        </div>
      </div>
    </div>
  );
}
