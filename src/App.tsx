import { useEffect, useState } from 'react';
import {
  Bus,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  ExternalLink,
  Home,
  Lock,
  MapPin,
  Mountain,
  Package,
  Phone,
  Sparkles,
  Users,
} from 'lucide-react';
import { AdminCmsModal } from './components/AdminCmsModal.tsx';
import { DestinationDetailModal } from './components/DestinationDetailModal.tsx';
import { GalleryLightbox } from './components/GalleryLightbox.tsx';
import { SafeImage } from './components/SafeImage.tsx';
import { WhatsAppIcon } from './components/WhatsAppIcon.tsx';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal.tsx';
import { DEFAULT_SITE_DATA } from './data/defaultSiteData.ts';
import { DestinationCategory, PackageCategory } from './types/tourism.ts';
import type {
  DestinationItem,
  SiteData,
  TourPackageItem,
  WhatsAppBookingDraft,
} from './types/tourism.ts';
import { formatRupiah } from './utils/format.ts';

const LOCAL_CACHE_KEY = 'lereng_asri_site_data_v1';

export default function App() {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as SiteData;
        if (parsed && parsed.profile && Array.isArray(parsed.destinations)) {
          return parsed;
        }
      }
    } catch {
      // Fall back to bundled seed data
    }
    return DEFAULT_SITE_DATA;
  });

  const [destFilter, setDestFilter] = useState<'Semua' | DestinationCategory>('Semua');
  const [pkgFilter, setPkgFilter] = useState<'Semua' | PackageCategory>('Semua');
  const [openFaqId, setOpenFaqId] = useState<string | null>(DEFAULT_SITE_DATA.faqs[0]?.id ?? null);

  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [bookingDraft, setBookingDraft] = useState<WhatsAppBookingDraft | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/site-data')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteData | null) => {
        if (!cancelled && data && data.profile && Array.isArray(data.destinations)) {
          setSiteData(data);
          try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
          } catch {
            // Ignore storage quota issues
          }
        }
      })
      .catch(() => {
        // Keep cached or default data silently if offline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDataUpdated = (updated: SiteData) => {
    setSiteData(updated);
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota issues
    }
  };

  const openGeneralWhatsApp = () => {
    setBookingDraft({
      itemType: 'umum',
      itemTitle: `Konsultasi Wisata ${siteData.profile.villageName}`,
      unitPrice: 0,
      priceUnit: 'orang',
      minPax: 2,
    });
  };

  const openPackageWhatsApp = (pkg: TourPackageItem) => {
    setBookingDraft({
      itemType: 'paket',
      itemTitle: pkg.title,
      unitPrice: pkg.price,
      priceUnit: pkg.priceUnit,
      minPax: pkg.minPax,
    });
  };

  const openDestinationWhatsApp = (dest: DestinationItem) => {
    setSelectedDestination(null);
    setBookingDraft({
      itemType: 'destinasi',
      itemTitle: dest.name,
      unitPrice: dest.ticketPrice,
      priceUnit: 'orang',
      minPax: 1,
    });
  };

  const filteredDestinations =
    destFilter === 'Semua'
      ? siteData.destinations
      : siteData.destinations.filter((d) => d.category === destFilter);

  const filteredPackages =
    pkgFilter === 'Semua'
      ? siteData.packages
      : siteData.packages.filter((p) => p.category === pkgFilter);

  const { profile } = siteData;

  return (
    <div className="min-h-screen bg-[#f8faf7] text-[#132a13] pb-20 md:pb-0">
      {/* Top Bar: Strict 3-Zone Contract */}
      <header className="relative md:sticky md:top-0 z-40 bg-[#f8faf7]/95 backdrop-blur-md border-b border-[#2d6a4f]/10">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-8">
          <a
            href="#beranda"
            className="font-display text-xl md:text-2xl font-bold tracking-tight text-[#1b4332] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#1b4332] rounded-md"
          >
            Lereng Asri
          </a>

          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-7 text-sm lg:text-base font-medium text-[#414844]"
          >
            <a
              href="#beranda"
              className="hover:text-[#1b4332] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Beranda
            </a>
            <a
              href="#destinasi"
              className="hover:text-[#1b4332] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Destinasi
            </a>
            <a
              href="#paket"
              className="hover:text-[#1b4332] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Paket Wisata
            </a>
            <a
              href="#galeri"
              className="hover:text-[#1b4332] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Galeri
            </a>
            <a
              href="#lokasi"
              className="hover:text-[#1b4332] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Lokasi & FAQ
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={openGeneralWhatsApp}
              className="min-h-[44px] px-4 md:px-5 py-2.5 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-[#012d1d] font-bold text-sm inline-flex items-center gap-2 shadow-sm shadow-[#25d366]/25 transition-colors whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="w-5 h-5 shrink-0" />
              <span>Pesan WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="beranda" className="pt-6 pb-10 md:pt-12 md:pb-16">
          <div className="max-w-[1240px] mx-auto px-5 md:px-10 space-y-8 md:space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center space-y-5 md:space-y-6 order-2 lg:order-1">
                <p className="text-sm md:text-base font-semibold text-[#2d6a4f]">
                  {profile.villageName} · Wisata Alam & Budaya Jawa Tengah
                </p>

                <h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold text-[#132a13] leading-[1.14] tracking-[-0.02em] text-balance">
                  {profile.heroTitle}
                </h1>

                <p className="text-base md:text-lg text-[#414844] leading-relaxed max-w-[54ch]">
                  {profile.heroSubtitle}
                </p>

                <div className="pt-1 flex flex-col sm:flex-row gap-3.5">
                  <button
                    type="button"
                    onClick={openGeneralWhatsApp}
                    className="min-h-[54px] px-7 py-3.5 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-[#012d1d] font-bold text-base md:text-lg inline-flex items-center justify-center gap-3 shadow-lg shadow-[#25d366]/30 active:scale-[0.99] transition-transform whitespace-nowrap"
                  >
                    <WhatsAppIcon className="w-6 h-6 shrink-0" />
                    <span>Tanya & Pesan via WhatsApp</span>
                  </button>

                  <a
                    href="#paket"
                    className="min-h-[54px] px-7 py-3.5 rounded-full border-[1.5px] border-[#1b4332] text-[#1b4332] hover:bg-[#d8f3dc] font-bold text-base md:text-lg inline-flex items-center justify-center transition-colors whitespace-nowrap"
                  >
                    Lihat Paket & Harga
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="w-full h-full min-h-[240px] sm:min-h-[340px] lg:min-h-[430px] aspect-[16/10] lg:aspect-auto rounded-3xl overflow-hidden shadow-[0_12px_28px_-4px_rgba(27,67,50,0.12)] bg-[#eceeeb]">
                  <SafeImage
                    src={profile.heroImageUrl}
                    alt={`Panorama ${profile.villageName}`}
                    fallbackTitle={profile.villageName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 4-Column Information Strip Below Hero Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 md:p-6 rounded-2xl bg-[#f2f4f1] border border-[#2d6a4f]/10">
              <div className="flex items-start gap-3">
                <Mountain className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#414844]">Ketinggian Lereng</p>
                  <p className="text-base font-bold text-[#132a13] tabular-nums">
                    {profile.elevationText}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#414844]">Waktu Tempuh</p>
                  <p className="text-base font-bold text-[#132a13] tabular-nums">
                    {profile.travelTimeText}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#414844]">Jam Operasional</p>
                  <p className="text-base font-bold text-[#132a13] tabular-nums">
                    {profile.openHoursText}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[#904d00] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#414844]">Kepuasan Pengunjung</p>
                  <p className="text-base font-bold text-[#132a13] tabular-nums">
                    {profile.ratingText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Destinasi Wisata (FR-02) */}
        <section id="destinasi" className="py-12 md:py-16 border-t border-[#2d6a4f]/10">
          <div className="max-w-[1240px] mx-auto px-5 md:px-10 space-y-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <p className="text-sm font-semibold text-[#2d6a4f]">01. Jelajah Daya Tarik Desa</p>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#132a13] text-balance">
                  Destinasi Asri yang Mudah Dijangkau
                </h2>
                <p className="text-base text-[#414844]">
                  Pilih lokasi wisata sesuai minat keluarga atau rombongan Anda. Ketuk kartu untuk melihat fasilitas dan akses jalan.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Filter kategori destinasi"
                className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-[#eceeeb] self-start md:self-auto overflow-x-auto max-w-full no-scrollbar"
              >
                {(['Semua', ...Object.values(DestinationCategory)] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={destFilter === category}
                    onClick={() => setDestFilter(category)}
                    className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      destFilter === category
                        ? 'bg-[#1b4332] text-[#f8faf7] shadow-sm'
                        : 'text-[#414844] hover:text-[#132a13]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredDestinations.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-[#ffffff] border border-[#c1c8c2]/60">
                <p className="text-base text-[#414844]">
                  Belum ada destinasi pada kategori ini. Silakan pilih kategori lain.
                </p>
              </div>
            ) : (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 md:gap-7 no-scrollbar">
                {filteredDestinations.map((dest) => (
                  <article
                    key={dest.id}
                    className="w-[84vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none bg-[#ffffff] rounded-2xl border border-[#2d6a4f]/10 shadow-[0_4px_20px_-2px_rgba(27,67,50,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(27,67,50,0.10)] transition-shadow flex flex-col overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDestination(dest)}
                      className="block w-full aspect-[4/3] overflow-hidden bg-[#eceeeb] text-left group focus-visible:outline-2 focus-visible:outline-[#1b4332]"
                    >
                      <SafeImage
                        src={dest.imageUrl}
                        alt={dest.name}
                        fallbackTitle={dest.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </button>

                    <div className="p-5 md:p-6 flex-1 flex flex-col justify-between gap-5">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#2d6a4f]">
                          <span>{dest.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{dest.openHours}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-bold text-[#904d00]">
                            Tiket {formatRupiah(dest.ticketPrice)}
                          </span>
                        </div>

                        <h3 className="font-display text-xl md:text-2xl font-bold text-[#132a13]">
                          {dest.name}
                        </h3>

                        <p className="text-base text-[#414844] leading-relaxed">
                          {dest.shortDesc}
                        </p>

                        <p className="text-sm text-[#414844] pt-1">
                          <span className="font-semibold text-[#1b4332]">Fasilitas:</span>{' '}
                          {dest.facilities.join(' · ')}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#2d6a4f]/10">
                        <button
                          type="button"
                          onClick={() => setSelectedDestination(dest)}
                          className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#f2f4f1] hover:bg-[#d8f3dc] text-[#1b4332] font-semibold text-sm transition-colors whitespace-nowrap"
                        >
                          Detail & Fasilitas
                        </button>
                        <button
                          type="button"
                          onClick={() => openDestinationWhatsApp(dest)}
                          className="flex-1 min-h-[46px] px-4 py-2.5 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-[#012d1d] font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <WhatsAppIcon className="w-4 h-4 shrink-0" />
                          <span>Tanya Destinasi</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="text-xs text-[#414844] md:hidden">
              Geser kartu ke samping untuk melihat destinasi lainnya.
            </p>
          </div>
        </section>

        {/* Paket Wisata & Harga (FR-03 & FR-04) */}
        <section id="paket" className="py-12 md:py-16 bg-[#f2f4f1] border-t border-[#2d6a4f]/10">
          <div className="max-w-[1240px] mx-auto px-5 md:px-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <p className="text-sm font-semibold text-[#904d00]">02. Daftar Paket & Harga Resmi</p>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#132a13] text-balance">
                  Paket Wisata Transparan Tanpa Biaya Tersembunyi
                </h2>
                <p className="text-base text-[#414844]">
                  Semua harga sudah jelas sejak awal. Klik tombol pesan untuk menghitung perkiraan biaya dan konsultasi jadwal langsung via WhatsApp.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Filter kategori paket wisata"
                className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-[#ffffff] border border-[#2d6a4f]/10 self-start md:self-auto overflow-x-auto max-w-full no-scrollbar"
              >
                {(['Semua', ...Object.values(PackageCategory)] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={pkgFilter === cat}
                    onClick={() => setPkgFilter(cat)}
                    className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      pkgFilter === cat
                        ? 'bg-[#1b4332] text-[#f8faf7]'
                        : 'text-[#414844] hover:text-[#132a13]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredPackages.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-[#ffffff] border border-[#c1c8c2]/60">
                <p className="text-base text-[#414844]">
                  Belum ada paket wisata pada kategori ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {filteredPackages.map((pkg) => (
                  <article
                    key={pkg.id}
                    className="bg-[#ffffff] rounded-2xl border border-[#2d6a4f]/12 shadow-[0_4px_20px_-2px_rgba(27,67,50,0.05)] overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[#eceeeb]">
                      <SafeImage
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        fallbackTitle={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6 md:p-7 flex-1 flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold">
                          {pkg.popular && (
                            <>
                              <span className="text-[#904d00]">Pilihan Favorit Tamu</span>
                              <span aria-hidden="true" className="text-[#717973]">·</span>
                            </>
                          )}
                          <span className="text-[#2d6a4f]">Paket {pkg.category}</span>
                          <span aria-hidden="true" className="text-[#717973]">·</span>
                          <span className="text-[#414844] tabular-nums">{pkg.duration}</span>
                        </div>

                        <h3 className="font-display text-xl md:text-2xl font-bold text-[#132a13]">
                          {pkg.title}
                        </h3>

                        <div className="flex flex-wrap items-baseline gap-2 pt-1">
                          <span className="text-2xl md:text-3xl font-bold text-[#904d00] tabular-nums">
                            {formatRupiah(pkg.price)}
                          </span>
                          <span className="text-base text-[#414844]">
                            / {pkg.priceUnit} · Min. {pkg.minPax} orang
                          </span>
                        </div>

                        <p className="text-base text-[#414844] leading-relaxed">
                          {pkg.summary}
                        </p>

                        <div className="pt-2">
                          <p className="text-sm font-bold text-[#132a13] mb-2">
                            Sudah Termasuk:
                          </p>
                          <ul className="space-y-2">
                            {pkg.highlights.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-sm md:text-base text-[#414844]"
                              >
                                <CheckCircle2
                                  className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openPackageWhatsApp(pkg)}
                        className="w-full min-h-[54px] px-6 py-3.5 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-[#012d1d] font-bold text-base md:text-lg inline-flex items-center justify-center gap-3 shadow-md shadow-[#25d366]/20 active:scale-[0.99] transition-transform"
                      >
                        <WhatsAppIcon className="w-6 h-6 shrink-0" />
                        <span>Pesan Sekarang via WhatsApp</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Claim-to-Proof Adjacency: Warm Hospitality Testimonial */}
            <div className="rounded-2xl bg-[#d8f3dc] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <p className="text-base md:text-lg font-medium text-[#012d1d] leading-relaxed">
                  “{profile.testimonialQuote}”
                </p>
                <p className="text-sm font-semibold text-[#1b4332]">
                  {profile.testimonialAuthor} · {profile.testimonialOrigin}
                </p>
              </div>
              <button
                type="button"
                onClick={openGeneralWhatsApp}
                className="min-h-[50px] px-6 py-3 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#f8faf7] font-bold text-sm md:text-base shrink-0 transition-colors whitespace-nowrap"
              >
                Konsultasi Paket Rombongan
              </button>
            </div>
          </div>
        </section>

        {/* Galeri Foto (FR-01) */}
        <section id="galeri" className="py-12 md:py-16 border-t border-[#2d6a4f]/10">
          <div className="max-w-[1240px] mx-auto px-5 md:px-10 space-y-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <p className="text-sm font-semibold text-[#2d6a4f]">03. Potret Suasana Lereng Asri</p>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#132a13] text-balance">
                  Galeri Alam, Budaya, dan Penginapan
                </h2>
              </div>
              <p className="text-sm md:text-base text-[#414844]">
                Ketuk foto mana saja untuk memperbesar tampilan layar penuh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {siteData.gallery.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-2xl overflow-hidden bg-[#eceeeb] aspect-[4/3] text-left focus-visible:outline-2 focus-visible:outline-[#1b4332] shadow-[0_4px_20px_-2px_rgba(27,67,50,0.05)]"
                >
                  <SafeImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    fallbackTitle={photo.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5">
                    <span className="text-xs font-medium text-[#d8f3dc]">{photo.location}</span>
                    <span className="text-base md:text-lg font-bold text-[#ffffff] mt-0.5">
                      {photo.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Peta Lokasi, Informasi Akses, Kontak & FAQ (FR-05) */}
        <section id="lokasi" className="py-12 md:py-16 bg-[#f2f4f1] border-t border-[#2d6a4f]/10">
          <div className="max-w-[1240px] mx-auto px-5 md:px-10 space-y-8">
            <div className="space-y-2 max-w-2xl">
              <p className="text-sm font-semibold text-[#2d6a4f]">04. Lokasi, Rute & Tanya Jawab</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#132a13] text-balance">
                Petunjuk Arah Menuju Desa Wisata
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Peta & Informasi Akses */}
              <div className="lg:col-span-6 bg-[#ffffff] rounded-2xl border border-[#2d6a4f]/10 p-5 md:p-7 space-y-6">
                <div className="w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden bg-[#eceeeb] border border-[#c1c8c2]/60">
                  <iframe
                    title={`Peta Lokasi ${profile.villageName}`}
                    src={profile.mapEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#1b4332] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-base font-bold text-[#132a13]">Alamat Resmi</h3>
                      <p className="text-base text-[#414844] leading-relaxed mt-0.5">
                        {profile.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-[#1b4332] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-base font-bold text-[#132a13]">Kendaraan Pribadi</h3>
                      <p className="text-sm md:text-base text-[#414844] leading-relaxed mt-0.5">
                        {profile.routeCarInfo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Bus className="w-5 h-5 text-[#1b4332] shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-base font-bold text-[#132a13]">Bus Rombongan</h3>
                      <p className="text-sm md:text-base text-[#414844] leading-relaxed mt-0.5">
                        {profile.routeBusInfo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={profile.mapExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[50px] px-5 py-3 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#f8faf7] font-bold text-sm md:text-base inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>Buka Google Maps</span>
                  </a>

                  <button
                    type="button"
                    onClick={openGeneralWhatsApp}
                    className="flex-1 min-h-[50px] px-5 py-3 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-[#012d1d] font-bold text-sm md:text-base inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    <span>Hubungi Pengelola</span>
                  </button>
                </div>
              </div>

              {/* FAQ & Profil Pengelola */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-[#ffffff] rounded-2xl border border-[#2d6a4f]/10 p-6 md:p-7 space-y-3">
                  <h3 className="font-display text-xl font-bold text-[#132a13]">
                    {profile.aboutHeading}
                  </h3>
                  <p className="text-base text-[#414844] leading-relaxed">
                    {profile.aboutText}
                  </p>
                  <div className="pt-2 flex items-center gap-2.5 text-sm md:text-base font-semibold text-[#1b4332]">
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Layanan Informasi: {profile.whatsappDisplay} ({profile.openHoursText})</span>
                  </div>
                </div>

                <div className="bg-[#ffffff] rounded-2xl border border-[#2d6a4f]/10 p-6 md:p-7">
                  <h3 className="font-display text-xl font-bold text-[#132a13] mb-4">
                    Pertanyaan yang Sering Diajukan (FAQ)
                  </h3>
                  <div className="divide-y divide-[#2d6a4f]/10">
                    {siteData.faqs.map((faq) => {
                      const isExpanded = openFaqId === faq.id;
                      return (
                        <div key={faq.id} className="py-3 first:pt-0 last:pb-0">
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => setOpenFaqId(isExpanded ? null : faq.id)}
                            className="w-full min-h-[48px] py-2 flex items-center justify-between gap-4 text-left font-bold text-base text-[#132a13] hover:text-[#1b4332] transition-colors"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`w-5 h-5 text-[#1b4332] shrink-0 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                          {isExpanded && (
                            <p className="pb-2 pt-1 text-base text-[#414844] leading-relaxed">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-[#012d1d] text-[#eff1ee] py-10 md:py-12">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <p className="font-display text-xl font-bold text-[#ffffff]">{profile.villageName}</p>
            <p className="text-sm text-[#a5d0b9] leading-relaxed">{profile.address}</p>
            <p className="text-xs text-[#86af99]">
              © {new Date().getFullYear()} Kelompok Sadar Wisata (Pokdarwis) {profile.villageName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#destinasi"
              className="min-h-[44px] px-3 inline-flex items-center text-sm font-medium text-[#d8f3dc] hover:text-[#ffffff]"
            >
              Destinasi
            </a>
            <a
              href="#paket"
              className="min-h-[44px] px-3 inline-flex items-center text-sm font-medium text-[#d8f3dc] hover:text-[#ffffff]"
            >
              Paket Wisata
            </a>
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-sm font-semibold text-[#f8faf7] inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span>Masuk Panel Pengelola</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Sticky Navigation & Quick WhatsApp Bar (<= 64px height, < 10% mobile viewport) */}
      <nav
        aria-label="Menu cepat seluler"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#2d6a4f]/15 px-2 grid grid-cols-4 items-center gap-1 shadow-[0_-4px_20px_rgba(19,42,19,0.08)]"
      >
        <a
          href="#beranda"
          className="h-12 flex flex-col items-center justify-center rounded-xl text-[#1b4332] hover:bg-[#f2f4f1]"
        >
          <Home className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px] font-semibold mt-0.5">Beranda</span>
        </a>
        <a
          href="#destinasi"
          className="h-12 flex flex-col items-center justify-center rounded-xl text-[#1b4332] hover:bg-[#f2f4f1]"
        >
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px] font-semibold mt-0.5">Destinasi</span>
        </a>
        <a
          href="#paket"
          className="h-12 flex flex-col items-center justify-center rounded-xl text-[#1b4332] hover:bg-[#f2f4f1]"
        >
          <Package className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px] font-semibold mt-0.5">Paket</span>
        </a>
        <button
          type="button"
          onClick={openGeneralWhatsApp}
          className="h-11 rounded-full bg-[#25d366] text-[#012d1d] font-bold text-xs flex items-center justify-center gap-1.5 px-2 shadow-sm"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Pesan WA</span>
        </button>
      </nav>

      {/* Modals */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onBookWhatsApp={openDestinationWhatsApp}
      />

      <WhatsAppOrderModal
        draft={bookingDraft}
        whatsappNumber={profile.whatsappNumber}
        whatsappDisplay={profile.whatsappDisplay}
        villageName={profile.villageName}
        onClose={() => setBookingDraft(null)}
      />

      <GalleryLightbox
        items={siteData.gallery}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />

      <AdminCmsModal
        isOpen={isAdminOpen}
        siteData={siteData}
        onClose={() => setIsAdminOpen(false)}
        onDataUpdated={handleDataUpdated}
      />
    </div>
  );
}
