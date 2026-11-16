export enum DestinationCategory {
  ALAM = 'Alam',
  BUDAYA = 'Budaya',
  KELUARGA = 'Keluarga',
}

export enum PackageCategory {
  HARIAN = 'Harian',
  MENGINAP = 'Menginap',
  ROMBONGAN = 'Rombongan',
}

export interface DestinationItem {
  id: string;
  name: string;
  category: DestinationCategory;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  openHours: string;
  ticketPrice: number;
  facilities: string[];
  accessNote: string;
  featured: boolean;
}

export interface TourPackageItem {
  id: string;
  title: string;
  category: PackageCategory;
  duration: string;
  price: number;
  priceUnit: string;
  minPax: number;
  imageUrl: string;
  summary: string;
  highlights: string[];
  popular: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  location: string;
  imageUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface VillageProfile {
  villageName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutHeading: string;
  aboutText: string;
  elevationText: string;
  travelTimeText: string;
  openHoursText: string;
  ratingText: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  address: string;
  routeCarInfo: string;
  routeBusInfo: string;
  mapEmbedUrl: string;
  mapExternalUrl: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialOrigin: string;
}

export interface SiteData {
  profile: VillageProfile;
  destinations: DestinationItem[];
  packages: TourPackageItem[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
  updatedAt: string;
}

export interface WhatsAppBookingDraft {
  itemType: 'paket' | 'destinasi' | 'umum';
  itemTitle: string;
  unitPrice: number;
  priceUnit: string;
  minPax: number;
}
