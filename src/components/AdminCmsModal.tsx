import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { IMAGE_CATALOG } from '../data/defaultSiteData.ts';
import { DestinationCategory, PackageCategory } from '../types/tourism.ts';
import type {
  DestinationItem,
  FaqItem,
  SiteData,
  TourPackageItem,
} from '../types/tourism.ts';

interface AdminCmsModalProps {
  isOpen: boolean;
  siteData: SiteData;
  onClose: () => void;
  onDataUpdated: (updated: SiteData) => void;
}

type AdminTab = 'profil' | 'destinasi' | 'paket' | 'faq';

const TOKEN_STORAGE_KEY = 'lereng_asri_admin_token';

export function AdminCmsModal({
  isOpen,
  siteData,
  onClose,
  onDataUpdated,
}: AdminCmsModalProps) {
  const [token, setToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('profil');
  const [draft, setDraft] = useState<SiteData>(siteData);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(JSON.parse(JSON.stringify(siteData)) as SiteData);
      setStatusMessage(null);
      setConfirmReset(false);
    }
  }, [isOpen, siteData]);

  useEffect(() => {
    if (!isOpen || !token) return;
    let cancelled = false;
    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!cancelled) {
          setIsAuthenticated(res.ok);
          if (!res.ok) {
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            setToken('');
          }
        }
      })
      .catch(() => {
        if (!cancelled) setIsAuthenticated(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, token]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !json.token) {
        setAuthError(json.error || 'Kata sandi salah.');
        return;
      }
      sessionStorage.setItem(TOKEN_STORAGE_KEY, json.token);
      setToken(json.token);
      setIsAuthenticated(true);
      setPassword('');
    } catch {
      setAuthError('Tidak dapat terhubung ke server pengelola.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken('');
    setIsAuthenticated(false);
    setPassword('');
    setStatusMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/site-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      const json = (await res.json()) as SiteData & { error?: string };
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
        }
        setStatusMessage({
          type: 'error',
          text: json.error || 'Gagal menyimpan data. Silakan coba lagi.',
        });
        return;
      }
      onDataUpdated(json);
      setStatusMessage({
        type: 'success',
        text: 'Perubahan berhasil disimpan dan langsung tampil di website.',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Gagal terhubung ke server saat menyimpan.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as SiteData & { error?: string };
      if (!res.ok) {
        setStatusMessage({ type: 'error', text: json.error || 'Gagal mereset data.' });
        return;
      }
      setDraft(json);
      onDataUpdated(json);
      setConfirmReset(false);
      setStatusMessage({ type: 'success', text: 'Konten dikembalikan ke data bawaan.' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Gagal terhubung ke server.' });
    } finally {
      setIsSaving(false);
    }
  };

  const addDestination = () => {
    const newItem: DestinationItem = {
      id: `dest-${Date.now()}`,
      name: 'Destinasi Baru',
      category: DestinationCategory.ALAM,
      shortDesc: 'Deskripsi singkat daya tarik wisata baru di Desa Lereng Asri.',
      fullDesc: 'Ceritakan suasana, keunikan alam atau budaya, dan pengalaman pengunjung di lokasi ini.',
      imageUrl: IMAGE_CATALOG[0].url,
      openHours: '07.00 – 17.00 WIB',
      ticketPrice: 15000,
      facilities: ['Area Parkir', 'Mushola', 'Toilet Bersih'],
      accessNote: 'Akses jalan mudah dijangkau dari pendopo utama.',
      featured: false,
    };
    setDraft((prev) => ({
      ...prev,
      destinations: [newItem, ...prev.destinations],
    }));
  };

  const updateDestination = (id: string, patch: Partial<DestinationItem>) => {
    setDraft((prev) => ({
      ...prev,
      destinations: prev.destinations.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const removeDestination = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((item) => item.id !== id),
    }));
  };

  const addPackage = () => {
    const newPkg: TourPackageItem = {
      id: `pkg-${Date.now()}`,
      title: 'Paket Wisata Baru',
      category: PackageCategory.HARIAN,
      duration: '1 Hari (08.00 – 16.00 WIB)',
      price: 150000,
      priceUnit: 'orang',
      minPax: 2,
      imageUrl: IMAGE_CATALOG[1].url,
      summary: 'Penjelasan ringkas mengenai pengalaman wisata dalam paket ini.',
      highlights: ['Tiket masuk wisata', 'Makan siang tradisional', 'Pemandu lokal'],
      popular: false,
    };
    setDraft((prev) => ({
      ...prev,
      packages: [newPkg, ...prev.packages],
    }));
  };

  const updatePackage = (id: string, patch: Partial<TourPackageItem>) => {
    setDraft((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) => (pkg.id === id ? { ...pkg, ...patch } : pkg)),
    }));
  };

  const removePackage = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      packages: prev.packages.filter((pkg) => pkg.id !== id),
    }));
  };

  const addFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: 'Pertanyaan baru wisatawan?',
      answer: 'Jawaban jelas dan ramah untuk calon pengunjung.',
    };
    setDraft((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }));
  };

  const updateFaq = (id: string, patch: Partial<FaqItem>) => {
    setDraft((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) => (faq.id === id ? { ...faq, ...patch } : faq)),
    }));
  };

  const removeFaq = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((faq) => faq.id !== id),
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#012d1d]/65 backdrop-blur-sm p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#f8faf7] rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-[#2d6a4f]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 md:px-7 py-4 bg-[#1b4332] text-[#f8faf7] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Lock className="w-5 h-5 text-[#d8f3dc] shrink-0" aria-hidden="true" />
            <h2 id="admin-modal-title" className="text-lg md:text-xl font-bold truncate">
              Panel Pengelola Desa Wisata
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#2d6a4f] hover:bg-[#3f6653] text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel pengelola"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-[#2d6a4f] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="p-6 md:p-10 max-w-md mx-auto w-full my-auto">
            <div className="bg-[#ffffff] p-6 md:p-8 rounded-2xl border border-[#c1c8c2]/60 shadow-sm space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[#132a13]">Masuk sebagai Pengelola</h3>
                <p className="text-sm text-[#414844] mt-1.5 leading-relaxed">
                  Gunakan kata sandi pengelola untuk memperbarui teks beranda, destinasi, paket wisata, harga, dan FAQ.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-password" className="block text-sm font-semibold text-[#132a13] mb-1.5">
                    Kata Sandi Pengelola
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Masukkan kata sandi"
                      className="w-full min-h-[48px] pl-4 pr-12 py-2.5 bg-[#ffffff] border border-[#c1c8c2] rounded-xl text-base text-[#132a13] focus:outline-none focus:border-[#2d6a4f] focus:ring-3 focus:ring-[#2d6a4f]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                      className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#414844] hover:text-[#132a13]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <p className="text-sm font-medium text-[#ba1a1a] bg-[#ffdad6] px-3.5 py-2.5 rounded-lg" role="alert">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full min-h-[50px] px-6 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-60 text-[#f8faf7] font-bold text-base transition-colors"
                >
                  {isLoggingIn ? 'Memeriksa...' : 'Masuk ke Panel Pengelola'}
                </button>
              </form>

              <p className="text-xs text-[#414844] bg-[#f2f4f1] p-3 rounded-lg">
                Catatan uji coba: sandi bawaan pengelola adalah <strong className="text-[#132a13]">lerengasri2026</strong> (dapat diubah lewat variabel lingkungan <code className="font-mono">ADMIN_PASSWORD</code>).
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 md:px-7 pt-3 pb-0 bg-[#ffffff] border-b border-[#c1c8c2]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(
                [
                  ['profil', 'Profil & Kontak'],
                  ['destinasi', `Destinasi (${draft.destinations.length})`],
                  ['paket', `Paket & Harga (${draft.packages.length})`],
                  ['faq', `FAQ (${draft.faqs.length})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`min-h-[44px] px-4 py-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === key
                      ? 'border-[#1b4332] text-[#1b4332]'
                      : 'border-transparent text-[#414844] hover:text-[#132a13]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6">
              {statusMessage && (
                <div
                  role="status"
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold ${
                    statusMessage.type === 'success'
                      ? 'bg-[#d8f3dc] text-[#012d1d]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {activeTab === 'profil' && (
                <div className="bg-[#ffffff] p-5 md:p-6 rounded-2xl border border-[#c1c8c2]/60 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#132a13] mb-1">
                        Nama Desa Wisata
                      </label>
                      <input
                        type="text"
                        value={draft.profile.villageName}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            profile: { ...p.profile, villageName: e.target.value },
                          }))
                        }
                        className="w-full min-h-[44px] px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#132a13] mb-1">
                        Nomor WhatsApp Pengelola (format 628...)
                      </label>
                      <input
                        type="text"
                        value={draft.profile.whatsappNumber}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            profile: { ...p.profile, whatsappNumber: e.target.value },
                          }))
                        }
                        className="w-full min-h-[44px] px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#132a13] mb-1">
                        Tampilan Nomor WhatsApp
                      </label>
                      <input
                        type="text"
                        value={draft.profile.whatsappDisplay}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            profile: { ...p.profile, whatsappDisplay: e.target.value },
                          }))
                        }
                        className="w-full min-h-[44px] px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#132a13] mb-1">
                        Jam Operasional Desa
                      </label>
                      <input
                        type="text"
                        value={draft.profile.openHoursText}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            profile: { ...p.profile, openHoursText: e.target.value },
                          }))
                        }
                        className="w-full min-h-[44px] px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#132a13] mb-1">
                      Judul Utama Beranda (Hero)
                    </label>
                    <input
                      type="text"
                      value={draft.profile.heroTitle}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          profile: { ...p.profile, heroTitle: e.target.value },
                        }))
                      }
                      className="w-full min-h-[44px] px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#132a13] mb-1">
                      Subjudul Sambutan Beranda
                    </label>
                    <textarea
                      rows={3}
                      value={draft.profile.heroSubtitle}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          profile: { ...p.profile, heroSubtitle: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#132a13] mb-1">
                      Foto Utama Beranda
                    </label>
                    <select
                      value={draft.profile.heroImageUrl}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          profile: { ...p.profile, heroImageUrl: e.target.value },
                        }))
                      }
                      className="w-full min-h-[44px] px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base bg-[#ffffff]"
                    >
                      {IMAGE_CATALOG.map((img) => (
                        <option key={img.url} value={img.url}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#132a13] mb-1">
                      Alamat Lengkap Desa Wisata
                    </label>
                    <textarea
                      rows={2}
                      value={draft.profile.address}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          profile: { ...p.profile, address: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#132a13] mb-1">
                      Tautan Google Maps Tujuan (Tombol Buka Peta)
                    </label>
                    <input
                      type="url"
                      value={draft.profile.mapExternalUrl}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          profile: { ...p.profile, mapExternalUrl: e.target.value },
                        }))
                      }
                      className="w-full min-h-[44px] px-3.5 py-2 border border-[#c1c8c2] rounded-xl text-base"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'destinasi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#414844]">
                      Tambah atau perbarui daftar objek wisata beserta tarif tiket dan fasilitasnya.
                    </p>
                    <button
                      type="button"
                      onClick={addDestination}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-[#f8faf7] text-sm font-semibold inline-flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Destinasi</span>
                    </button>
                  </div>

                  {draft.destinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="bg-[#ffffff] p-5 rounded-2xl border border-[#c1c8c2]/60 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-bold text-[#132a13] text-base">{dest.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeDestination(dest.id)}
                          aria-label={`Hapus ${dest.name}`}
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Nama Destinasi
                          </label>
                          <input
                            type="text"
                            value={dest.name}
                            onChange={(e) => updateDestination(dest.id, { name: e.target.value })}
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Kategori
                          </label>
                          <select
                            value={dest.category}
                            onChange={(e) =>
                              updateDestination(dest.id, {
                                category: e.target.value as DestinationCategory,
                              })
                            }
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm bg-[#ffffff]"
                          >
                            {Object.values(DestinationCategory).map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Tiket Masuk (Rp)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={dest.ticketPrice}
                            onChange={(e) =>
                              updateDestination(dest.id, {
                                ticketPrice: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm tabular-nums"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Jam Operasional
                          </label>
                          <input
                            type="text"
                            value={dest.openHours}
                            onChange={(e) => updateDestination(dest.id, { openHours: e.target.value })}
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Pilihan Foto
                          </label>
                          <select
                            value={dest.imageUrl}
                            onChange={(e) => updateDestination(dest.id, { imageUrl: e.target.value })}
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm bg-[#ffffff]"
                          >
                            {IMAGE_CATALOG.map((img) => (
                              <option key={img.url} value={img.url}>
                                {img.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#414844] mb-1">
                          Deskripsi Singkat
                        </label>
                        <textarea
                          rows={2}
                          value={dest.shortDesc}
                          onChange={(e) => updateDestination(dest.id, { shortDesc: e.target.value })}
                          className="w-full px-3 py-2 border border-[#c1c8c2] rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#414844] mb-1">
                          Fasilitas (pisahkan dengan tanda koma)
                        </label>
                        <input
                          type="text"
                          value={dest.facilities.join(', ')}
                          onChange={(e) =>
                            updateDestination(dest.id, {
                              facilities: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'paket' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#414844]">
                      Kelola paket wisata harian, menginap, maupun rombongan beserta harga transparan.
                    </p>
                    <button
                      type="button"
                      onClick={addPackage}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-[#f8faf7] text-sm font-semibold inline-flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Paket</span>
                    </button>
                  </div>

                  {draft.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-[#ffffff] p-5 rounded-2xl border border-[#c1c8c2]/60 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-bold text-[#132a13] text-base">{pkg.title}</h3>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1b4332] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pkg.popular}
                              onChange={(e) => updatePackage(pkg.id, { popular: e.target.checked })}
                              className="w-4 h-4 accent-[#1b4332]"
                            />
                            <span>Tandai Pilihan Favorit</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removePackage(pkg.id)}
                            aria-label={`Hapus ${pkg.title}`}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Nama Paket Wisata
                          </label>
                          <input
                            type="text"
                            value={pkg.title}
                            onChange={(e) => updatePackage(pkg.id, { title: e.target.value })}
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Kategori
                          </label>
                          <select
                            value={pkg.category}
                            onChange={(e) =>
                              updatePackage(pkg.id, {
                                category: e.target.value as PackageCategory,
                              })
                            }
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm bg-[#ffffff]"
                          >
                            {Object.values(PackageCategory).map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Harga (Rp)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={5000}
                            value={pkg.price}
                            onChange={(e) =>
                              updatePackage(pkg.id, {
                                price: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm tabular-nums"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Durasi Paket
                          </label>
                          <input
                            type="text"
                            value={pkg.duration}
                            onChange={(e) => updatePackage(pkg.id, { duration: e.target.value })}
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Minimal Peserta
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={pkg.minPax}
                            onChange={(e) =>
                              updatePackage(pkg.id, {
                                minPax: Math.max(1, Number(e.target.value) || 1),
                              })
                            }
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Foto Paket
                          </label>
                          <select
                            value={pkg.imageUrl}
                            onChange={(e) => updatePackage(pkg.id, { imageUrl: e.target.value })}
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm bg-[#ffffff]"
                          >
                            {IMAGE_CATALOG.map((img) => (
                              <option key={img.url} value={img.url}>
                                {img.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#414844] mb-1">
                          Ringkasan Paket
                        </label>
                        <textarea
                          rows={2}
                          value={pkg.summary}
                          onChange={(e) => updatePackage(pkg.id, { summary: e.target.value })}
                          className="w-full px-3 py-2 border border-[#c1c8c2] rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#414844] mb-1">
                          Rincian Fasilitas Termasuk (satu baris per poin)
                        </label>
                        <textarea
                          rows={3}
                          value={pkg.highlights.join('\n')}
                          onChange={(e) =>
                            updatePackage(pkg.id, {
                              highlights: e.target.value
                                .split('\n')
                                .map((line) => line.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 border border-[#c1c8c2] rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#414844]">
                      Atur daftar pertanyaan umum yang sering ditanyakan wisatawan.
                    </p>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-[#f8faf7] text-sm font-semibold inline-flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah FAQ</span>
                    </button>
                  </div>

                  {draft.faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-[#ffffff] p-5 rounded-2xl border border-[#c1c8c2]/60 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-[#414844] mb-1">
                            Pertanyaan
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                            className="w-full min-h-[42px] px-3 py-1.5 border border-[#c1c8c2] rounded-lg text-sm font-semibold"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFaq(faq.id)}
                          aria-label="Hapus FAQ"
                          className="min-w-[40px] min-h-[40px] mt-5 flex items-center justify-center rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#414844] mb-1">
                          Jawaban
                        </label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                          className="w-full px-3 py-2 border border-[#c1c8c2] rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 md:px-7 py-4 bg-[#ffffff] border-t border-[#c1c8c2]/60 flex flex-wrap items-center justify-between gap-3">
              <div>
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-[#c1c8c2] text-sm font-semibold text-[#414844] hover:bg-[#f2f4f1] inline-flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Data Bawaan</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#93000a]">Kembalikan ke awal?</span>
                    <button
                      type="button"
                      onClick={handleResetDefault}
                      disabled={isSaving}
                      className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#ba1a1a] text-white text-xs font-bold"
                    >
                      Ya, Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#f2f4f1] text-[#132a13] text-xs font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl border border-[#c1c8c2] text-[#132a13] font-semibold text-sm hover:bg-[#f2f4f1] transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:opacity-60 text-[#f8faf7] font-bold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
