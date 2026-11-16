import { useEffect, useState } from 'react';
import { Check, Copy, Minus, Plus, X } from 'lucide-react';
import type { WhatsAppBookingDraft } from '../types/tourism.ts';
import { buildWhatsAppUrl, formatRupiah, getTodayIsoDate } from '../utils/format.ts';
import { WhatsAppIcon } from './WhatsAppIcon.tsx';

interface WhatsAppOrderModalProps {
  draft: WhatsAppBookingDraft | null;
  whatsappNumber: string;
  whatsappDisplay: string;
  villageName: string;
  onClose: () => void;
}

export function WhatsAppOrderModal({
  draft,
  whatsappNumber,
  whatsappDisplay,
  villageName,
  onClose,
}: WhatsAppOrderModalProps) {
  const [visitorName, setVisitorName] = useState('');
  const [visitDate, setVisitDate] = useState(getTodayIsoDate());
  const [pax, setPax] = useState(2);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (draft) {
      setPax(Math.max(1, draft.minPax || 1));
      setCopied(false);
    }
  }, [draft]);

  useEffect(() => {
    if (!draft) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [draft, onClose]);

  if (!draft) return null;

  const totalEstimate = draft.unitPrice > 0 ? draft.unitPrice * pax : 0;
  const displayName = visitorName.trim() || 'Tamu Wisata';

  const messageLines = [
    `Halo Pengelola ${villageName},`,
    '',
    draft.itemType === 'paket'
      ? `Saya ingin memesan *${draft.itemTitle}*.`
      : draft.itemType === 'destinasi'
        ? `Saya ingin bertanya informasi kunjungan ke *${draft.itemTitle}*.`
        : `Saya ingin berkonsultasi mengenai rencana kunjungan ke ${villageName}.`,
    '',
    `- Nama Pemesan: ${displayName}`,
    `- Rencana Tanggal: ${visitDate || 'Belum ditentukan'}`,
    `- Jumlah Peserta: ${pax} orang`,
  ];

  if (totalEstimate > 0) {
    messageLines.push(`- Perkiraan Total: ${formatRupiah(totalEstimate)} (${formatRupiah(draft.unitPrice)}/${draft.priceUnit})`);
  }
  if (notes.trim()) {
    messageLines.push(`- Catatan: ${notes.trim()}`);
  }
  messageLines.push('', 'Mohon info ketersediaan jadwalnya. Terima kasih!');

  const fullMessage = messageLines.join('\n');
  const waHref = buildWhatsAppUrl(whatsappNumber, fullMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#012d1d]/60 backdrop-blur-sm p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-xl bg-[#ffffff] rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#c1c8c2]" />
        </div>

        <div className="px-6 pt-4 pb-5 border-b border-[#2d6a4f]/10 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#2d6a4f]">
              Pemesanan Langsung via WA
            </p>
            <h2 id="wa-modal-title" className="text-xl md:text-2xl font-bold text-[#132a13] mt-1">
              {draft.itemTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela pemesanan"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#414844] hover:bg-[#f2f4f1] hover:text-[#132a13] transition-colors focus-visible:outline-2 focus-visible:outline-[#1b4332]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wa-visitor-name" className="block text-sm font-semibold text-[#132a13] mb-1.5">
                Nama Anda
              </label>
              <input
                id="wa-visitor-name"
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Contoh: Ibu Sari / Pak Budi"
                className="w-full min-h-[48px] px-4 py-2.5 bg-[#ffffff] border border-[#c1c8c2] rounded-xl text-base text-[#132a13] placeholder:text-[#717973] focus:outline-none focus:border-[#2d6a4f] focus:ring-3 focus:ring-[#2d6a4f]/15"
              />
            </div>

            <div>
              <label htmlFor="wa-visit-date" className="block text-sm font-semibold text-[#132a13] mb-1.5">
                Rencana Tanggal Kunjungan
              </label>
              <input
                id="wa-visit-date"
                type="date"
                value={visitDate}
                min={getTodayIsoDate()}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 bg-[#ffffff] border border-[#c1c8c2] rounded-xl text-base text-[#132a13] focus:outline-none focus:border-[#2d6a4f] focus:ring-3 focus:ring-[#2d6a4f]/15"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#f2f4f1]">
            <div>
              <span className="block text-sm font-semibold text-[#132a13]">Jumlah Peserta</span>
              {draft.minPax > 1 && (
                <span className="text-sm text-[#414844]">
                  Ketentuan minimal {draft.minPax} orang
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPax((prev) => Math.max(1, prev - 1))}
                aria-label="Kurangi jumlah peserta"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#ffffff] border border-[#c1c8c2] text-[#1b4332] hover:bg-[#d8f3dc] transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="min-w-[3.5rem] text-center text-lg font-bold text-[#132a13] tabular-nums">
                {pax} org
              </span>
              <button
                type="button"
                onClick={() => setPax((prev) => prev + 1)}
                aria-label="Tambah jumlah peserta"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#ffffff] border border-[#c1c8c2] text-[#1b4332] hover:bg-[#d8f3dc] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {totalEstimate > 0 && (
            <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#d8f3dc] text-[#012d1d]">
              <span className="text-base font-medium">Perkiraan Total Biaya</span>
              <span className="text-xl font-bold tabular-nums">{formatRupiah(totalEstimate)}</span>
            </div>
          )}

          <div>
            <label htmlFor="wa-notes" className="block text-sm font-semibold text-[#132a13] mb-1.5">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              id="wa-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Membawa anak kecil / butuh kursi roda / rombongan bus..."
              className="w-full px-4 py-2.5 bg-[#ffffff] border border-[#c1c8c2] rounded-xl text-base text-[#132a13] placeholder:text-[#717973] focus:outline-none focus:border-[#2d6a4f] focus:ring-3 focus:ring-[#2d6a4f]/15"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#f8faf7] border border-[#c1c8c2]/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#414844]">Pratinjau Pesan WhatsApp</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b4332] hover:text-[#2d6a4f] min-h-[32px] px-2 rounded-lg hover:bg-[#d8f3dc]/60 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-[#12803b]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Pesan Tersalin' : 'Salin Pesan'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-[#414844] leading-relaxed">
              {fullMessage}
            </pre>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[54px] px-6 py-3.5 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-[#012d1d] font-bold text-base sm:text-lg inline-flex items-center justify-center gap-3 shadow-lg shadow-[#25d366]/25 active:scale-[0.99] transition-transform"
            >
              <WhatsAppIcon className="w-6 h-6 shrink-0" />
              <span className="whitespace-nowrap">Kirim Pesan via WhatsApp</span>
            </a>
          </div>
          <p className="text-xs text-center text-[#414844]">
            Tidak perlu pembayaran kartu di web ini. Konfirmasi jadwal & pembayaran dibantu langsung oleh admin desa via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
