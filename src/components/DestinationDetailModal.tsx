import { useEffect } from 'react';
import { Clock, MapPin, Ticket, X, CheckCircle2 } from 'lucide-react';
import type { DestinationItem } from '../types/tourism.ts';
import { formatRupiah } from '../utils/format.ts';
import { SafeImage } from './SafeImage.tsx';
import { WhatsAppIcon } from './WhatsAppIcon.tsx';

interface DestinationDetailModalProps {
  destination: DestinationItem | null;
  onClose: () => void;
  onBookWhatsApp: (destination: DestinationItem) => void;
}

export function DestinationDetailModal({
  destination,
  onClose,
  onBookWhatsApp,
}: DestinationDetailModalProps) {
  useEffect(() => {
    if (!destination) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [destination, onClose]);

  if (!destination) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#012d1d]/60 backdrop-blur-sm p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dest-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-2xl bg-[#ffffff] rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-3xl md:rounded-t-2xl bg-[#eceeeb]">
          <SafeImage
            src={destination.imageUrl}
            alt={destination.name}
            fallbackTitle={destination.name}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail destinasi"
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#ffffff]/95 text-[#132a13] shadow-md hover:bg-[#ffffff] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#2d6a4f]">
              <span>Wisata {destination.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{destination.openHours}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold text-[#904d00]">
                Tiket {formatRupiah(destination.ticketPrice)}
              </span>
            </div>
            <h2 id="dest-modal-title" className="text-2xl md:text-3xl font-bold text-[#132a13] mt-2">
              {destination.name}
            </h2>
          </div>

          <p className="text-base md:text-lg text-[#414844] leading-relaxed">
            {destination.fullDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#f2f4f1]">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#132a13]">Jam Operasional</p>
                <p className="text-sm text-[#414844] tabular-nums">{destination.openHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Ticket className="w-5 h-5 text-[#904d00] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#132a13]">Tiket Masuk</p>
                <p className="text-sm text-[#414844] tabular-nums">
                  {formatRupiah(destination.ticketPrice)} / orang
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#132a13]">Akses Lokasi</p>
                <p className="text-sm text-[#414844]">{destination.accessNote}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#132a13] mb-3">Fasilitas Pendukung</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destination.facilities.map((facility, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-base text-[#414844]">
                  <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0" aria-hidden="true" />
                  <span>{facility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onBookWhatsApp(destination)}
              className="flex-1 min-h-[54px] px-6 py-3.5 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-[#012d1d] font-bold text-base inline-flex items-center justify-center gap-2.5 shadow-lg shadow-[#25d366]/20 transition-colors"
            >
              <WhatsAppIcon className="w-6 h-6 shrink-0" />
              <span>Tanya Kunjungan via WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[54px] px-6 py-3.5 rounded-full border border-[#1b4332] text-[#1b4332] font-semibold text-base hover:bg-[#d8f3dc] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
