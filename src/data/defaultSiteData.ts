import { DestinationCategory, PackageCategory } from '../types/tourism.ts';
import type { SiteData } from '../types/tourism.ts';

export const IMAGE_CATALOG = [
  {
    label: 'Panorama Desa & Terasering Pagi',
    url: '/src/assets/images/hero_lereng_asri_1794827147148.jpg',
  },
  {
    label: 'Jembatan Kayu Hutan Pinus',
    url: '/src/assets/images/dest_hutan_pinus_1794827148152.jpg',
  },
  {
    label: 'Air Terjun Curug Asri',
    url: '/src/assets/images/dest_curug_asri_1794827148054.jpg',
  },
  {
    label: 'Kampung Budaya & Pendopo Joglo',
    url: '/src/assets/images/dest_kampung_budaya_1794827148255.jpg',
  },
  {
    label: 'Homestay & Glamping Lereng',
    url: '/src/assets/images/pkg_glamping_homestay_1794827149914.jpg',
  },
  {
    label: 'Gardu Pandang Matahari Terbit',
    url: '/src/assets/images/gal_sunrise_bukit_1794827149906.jpg',
  },
];

export const DEFAULT_SITE_DATA: SiteData = {
  profile: {
    villageName: 'Desa Wisata Lereng Asri',
    heroTitle: 'Pulang ke Kesejukan Alam Lereng Gunung',
    heroSubtitle:
      'Nikmati udara segar 1.150 mdpl, hutan pinus yang teduh, gemericik curug alami, dan keramahan warga desa dengan sajian kuliner tradisional hangat.',
    heroImageUrl: '/src/assets/images/hero_lereng_asri_1794827147148.jpg',
    aboutHeading: 'Tentang Lereng Asri',
    aboutText:
      'Dikelola bersama oleh masyarakat adat dan Kelompok Sadar Wisata (Pokdarwis) setempat sejak 2018, Lereng Asri menjaga kelestarian mata air pegunungan sekaligus menghadirkan wisata ramah keluarga dan rombongan.',
    elevationText: '1.150 mdpl sejuk alami',
    travelTimeText: '45 menit dari pusat kota',
    openHoursText: '06.00 – 17.30 WIB setiap hari',
    ratingText: '4,9 dari 1.240+ ulasan tamu',
    whatsappNumber: '6281234567890',
    whatsappDisplay: '+62 812-3456-7890',
    address:
      'Dusun Krajan Timur, Desa Lereng Asri, Kec. Bandungan Atas, Kab. Semarang, Jawa Tengah 50614',
    routeCarInfo:
      'Jalan beraspal mulus dua arah, mudah dilalui mobil keluarga. Tersedia area parkir luas teduh dekat pendopo utama.',
    routeBusInfo:
      'Bus medium hingga bus besar (30–50 kursi) dapat parkir di Terminal Wisata Desa, tersedia angkutan antar-jemput gratis menuju lokasi.',
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=110.3350%2C-7.2450%2C110.3950%2C-7.2050&layer=mapnik&marker=-7.2250%2C110.3650',
    mapExternalUrl: 'https://maps.google.com/?q=-7.2250,110.3650',
    testimonialQuote:
      'Jalan menuju pendopo sangat rapi untuk orang tua saya yang berusia 68 tahun. Anak-anak senang membatik dan bermain di sungai jernih, makan siangnya hangat luar biasa.',
    testimonialAuthor: 'Hendra Wijaya',
    testimonialOrigin: 'Wisatawan Keluarga dari Yogyakarta · Oktober 2025',
  },
  destinations: [
    {
      id: 'dest-hutan-pinus',
      name: 'Wana Wisata Hutan Pinus',
      category: DestinationCategory.ALAM,
      shortDesc:
        'Jalur jembatan kayu yang landai di bawah naungan pohon pinus tinggi dan kabut pagi yang menenangkan.',
      fullDesc:
        'Terbentang seluas 12 hektar di lereng timur desa, Wana Wisata Hutan Pinus dilengkapi jalur papan kayu yang rata dan aman bagi anak-anak maupun lansia. Di pagi hari, sinar matahari menembus kabut tipis menciptakan suasana teduh untuk berjalan santai atau menyeruput wedang jahe di gardu pandang.',
      imageUrl: '/src/assets/images/dest_hutan_pinus_1794827148152.jpg',
      openHours: '06.00 – 17.00 WIB',
      ticketPrice: 15000,
      facilities: ['Jalur Kayu Landai', 'Gazebo Istirahat', 'Mushola Bersih', 'Warung Wedang'],
      accessNote: 'Jarak 150 meter dari area parkir utama, kemiringan landai.',
      featured: true,
    },
    {
      id: 'dest-curug-asri',
      name: 'Curug Tirta Lereng Asri',
      category: DestinationCategory.ALAM,
      shortDesc:
        'Air terjun alami bertingkat dengan kolam batu jernih berair sejuk yang aman untuk bermain air di tepian.',
      fullDesc:
        'Bersumber langsung dari mata air hutan lindung, Curug Tirta mengalir jernih sepanjang tahun. Area kolam tepi dirancang dangkal dengan pengawasan petugas desa sehingga keluarga dapat merasakan kesegaran air pegunungan dengan aman.',
      imageUrl: '/src/assets/images/dest_curug_asri_1794827148054.jpg',
      openHours: '07.00 – 16.30 WIB',
      ticketPrice: 20000,
      facilities: ['Kamar Bilas Hangat', 'Loker Barang', 'Petugas Keamanan', 'Pendopo Tunggu'],
      accessNote: 'Berjalan kaki santai 10 menit melalui tangga batu berpegangan bambu.',
      featured: true,
    },
    {
      id: 'dest-kampung-budaya',
      name: 'Kampung Budaya & Sanggar Batik',
      category: DestinationCategory.BUDAYA,
      shortDesc:
        'Pengalaman membatik canting, sangrai kopi tradisional, dan mencicipi jamuan pendopo bersama warga.',
      fullDesc:
        'Kunjungi rumah joglo kayu jati berusia ratusan tahun di jantung desa. Tamu diajak mencoba membatik tulis motif daun pakis, menyangrai biji kopi arabika lereng dengan wajan tanah liat, serta menikmati jajanan pasar hangat langsung dari dapur warga.',
      imageUrl: '/src/assets/images/dest_kampung_budaya_1794827148255.jpg',
      openHours: '08.00 – 17.00 WIB',
      ticketPrice: 25000,
      facilities: ['Pendopo Joglo', 'Alat Membatik', 'Kedai Kopi Desa', 'Toilet Ramah Lansia'],
      accessNote: 'Tepat di sisi area parkir utama tanpa tanjakan.',
      featured: true,
    },
    {
      id: 'dest-bukit-sunrise',
      name: 'Gardu Pandang Bukit Awan',
      category: DestinationCategory.KELUARGA,
      shortDesc:
        'Anjungan kayu menghadap hamparan samudra awan dan puncak gunung di waktu fajar.',
      fullDesc:
        'Titik tertinggi yang mudah dijangkau di Desa Lereng Asri. Pengunjung dapat memesan kopi tubruk panas dan pisang goreng gula aren sambil menyaksikan matahari terbit perlahan menyinari lembah hijau di bawahnya.',
      imageUrl: '/src/assets/images/gal_sunrise_bukit_1794827149906.jpg',
      openHours: '05.00 – 17.30 WIB',
      ticketPrice: 15000,
      facilities: ['Anjungan Foto Luas', 'Kantin Fajar', 'Sewa Jaket Tebal', 'Lampu Penerangan'],
      accessNote: 'Tersedia layanan ojek wisata desa bagi tamu yang tidak ingin berjalan.',
      featured: false,
    },
  ],
  packages: [
    {
      id: 'pkg-sehari-asri',
      title: 'Paket Sehari Menyapa Alam',
      category: PackageCategory.HARIAN,
      duration: '1 Hari (08.00 – 16.00 WIB)',
      price: 135000,
      priceUnit: 'orang',
      minPax: 2,
      imageUrl: '/src/assets/images/dest_hutan_pinus_1794827148152.jpg',
      summary:
        'Pilihan favorit untuk keluarga atau pasangan yang ingin menikmati hutan pinus, curug, dan makan siang khas desa tanpa repot.',
      highlights: [
        'Tiket masuk seluruh destinasi utama',
        '1x Makan siang nasi liwet & sayur desa',
        'Minuman selamat datang wedang jahe hangat',
        'Pemandu lokal ramah selama perjalanan',
      ],
      popular: true,
    },
    {
      id: 'pkg-edukasi-budaya',
      title: 'Paket Edukasi Kampung & Batik',
      category: PackageCategory.ROMBONGAN,
      duration: 'Setengah Hari (4–5 Jam)',
      price: 110000,
      priceUnit: 'orang',
      minPax: 10,
      imageUrl: '/src/assets/images/dest_kampung_budaya_1794827148255.jpg',
      summary:
        'Cocok untuk rombongan sekolah, komunitas, atau wisata kantor. Belajar membatik, tanam sayur organik, dan minum kopi sangrai.',
      highlights: [
        'Workshop membatik (kain hasil dibawa pulang)',
        'Praktik sangrai & seduh kopi tradisional',
        'Snack jajanan pasar & teh poci desa',
        'Pendopo pertemuan kapasitas hingga 80 orang',
      ],
      popular: false,
    },
    {
      id: 'pkg-homestay-glamping',
      title: 'Paket Menginap Homestay & Glamping 2H1M',
      category: PackageCategory.MENGINAP,
      duration: '2 Hari 1 Malam',
      price: 385000,
      priceUnit: 'orang',
      minPax: 2,
      imageUrl: '/src/assets/images/pkg_glamping_homestay_1794827149914.jpg',
      summary:
        'Menginap nyaman di kabin kayu atau rumah warga yang bersih dengan air panas, api unggun malam, dan tur fajar ke Bukit Awan.',
      highlights: [
        'Penginapan 1 malam (kamar mandi air panas)',
        '3x Makan hidangan tradisional + jagung bakar malam',
        'Tur pagi menyaksikan sunrise di Bukit Awan',
        'Dokumentasi foto keluarga & pemandu desa',
      ],
      popular: true,
    },
    {
      id: 'pkg-outbound-keluarga',
      title: 'Paket Outbound & Gathering Rombongan',
      category: PackageCategory.ROMBONGAN,
      duration: '1 Hari Penuh (08.00 – 16.30 WIB)',
      price: 165000,
      priceUnit: 'orang',
      minPax: 20,
      imageUrl: '/src/assets/images/hero_lereng_asri_1794827147148.jpg',
      summary:
        'Kegiatan kebersamaan tim di lapangan rumput pinus lengkap dengan permainan kelompok ringan, sound system, dan prasmanan.',
      highlights: [
        'Fasilitator & peralatan permainan kelompok',
        'Lapangan rumput teduh + sound system pendopo',
        '1x Makan siang prasmanan + 2x rehat kopi',
        'Spanduk selamat datang & parkir bus gratis',
      ],
      popular: false,
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Terasering Pagi di Pendopo Utama',
      caption: 'Kabut lembut menyelimuti sawah terasering saat matahari terbit di balik gunung.',
      location: 'Area Pendopo Lereng Asri',
      imageUrl: '/src/assets/images/hero_lereng_asri_1794827147148.jpg',
    },
    {
      id: 'gal-2',
      title: 'Ngopi Hangat di Atas Awan',
      caption: 'Menikmati kopi robusta lereng gunung dari anjungan kayu Bukit Awan.',
      location: 'Gardu Pandang Bukit Awan',
      imageUrl: '/src/assets/images/gal_sunrise_bukit_1794827149906.jpg',
    },
    {
      id: 'gal-3',
      title: 'Jembatan Kayu Tengah Pinus',
      caption: 'Jalur pejalan kaki yang aman dan sejuk di antara pepohonan pinus tua.',
      location: 'Wana Wisata Hutan Pinus',
      imageUrl: '/src/assets/images/dest_hutan_pinus_1794827148152.jpg',
    },
    {
      id: 'gal-4',
      title: 'Kesegaran Curug Tirta',
      caption: 'Kolam alami berair jernih yang dikelilingi pakis hutan yang asri.',
      location: 'Curug Tirta Lereng Asri',
      imageUrl: '/src/assets/images/dest_curug_asri_1794827148054.jpg',
    },
    {
      id: 'gal-5',
      title: 'Keramahan Sanggar Batik & Anyaman',
      caption: 'Warga lokal mendampingi wisatawan belajar membatik dan menyeduh kopi desa.',
      location: 'Kampung Budaya',
      imageUrl: '/src/assets/images/dest_kampung_budaya_1794827148255.jpg',
    },
    {
      id: 'gal-6',
      title: 'Senja Hangat di Kabin Lereng',
      caption: 'Cahaya lentera hangat menyambut waktu istirahat di homestay kayu pinus.',
      location: 'Kawasan Glamping & Homestay',
      imageUrl: '/src/assets/images/pkg_glamping_homestay_1794827149914.jpg',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Bagaimana cara memesan paket wisata atau homestay?',
      answer:
        'Cukup tekan tombol "Pesan via WhatsApp" pada paket yang Anda pilih. Isi nama, tanggal kunjungan, dan jumlah peserta, lalu kirim pesan ke admin desa. Tim kami membalas dalam hitungan menit pada jam kerja (06.00 – 20.00 WIB).',
    },
    {
      id: 'faq-2',
      question: 'Apakah akses jalan aman untuk lansia, balita, dan bus pariwisata?',
      answer:
        'Ya. Jalan menuju area utama beraspal baik dan mampu dilewati bus besar hingga 50 kursi. Di area Kampung Budaya dan Hutan Pinus tersedia jalur landai bebas anak tangga terjal serta toilet ramah lansia.',
    },
    {
      id: 'faq-3',
      question: 'Bagaimana sistem pembayaran dan uang muka (DP)?',
      answer:
        'Pembayaran dilakukan langsung melalui transfer bank resmi Pokdarwis atau tunai di pendopo setelah Anda berkonsultasi via WhatsApp. Untuk paket harian di bawah 5 orang, Anda dapat membayar langsung di lokasi saat kedatangan.',
    },
    {
      id: 'faq-4',
      question: 'Apakah jadwal bisa diubah jika cuaca hujan?',
      answer:
        'Tentu bisa. Jika terjadi hujan deras, kegiatan luar ruang dapat dialihkan ke Pendopo Joglo untuk aktivitas membatik dan kuliner, atau Anda dapat menjadwal ulang tanggal kunjungan tanpa biaya tambahan (konfirmasi minimal H-1).',
    },
  ],
  updatedAt: '2026-11-16T00:00:00.000Z',
};
