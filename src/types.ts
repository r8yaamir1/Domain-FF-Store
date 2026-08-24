export interface AccountImage {
  url: string;
  category: 'Profile' | 'Vault' | 'Evo Guns' | 'Bundles' | 'Emotes' | 'Badges';
  title: string;
}

export interface GamingAccount {
  id: string;
  idNo: number;
  uid: string;
  title: string;
  serverRegion: string;
  price: number;
  originalPrice: number;
  level: number;
  primeLevel: number;
  bundlesCount: number;
  likesCount: number;
  evoGunsCount: number;
  accountAge: string;
  loginType: 'Clean Google (Fresh Gmail)' | 'Facebook (Full Access)' | 'Twitter / VK';
  isVerified: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
  isTopTier?: boolean;
  badgeHistory: string[];
  rareItems: string[];
  images: AccountImage[];
  description: string;
  category: 'God Tier' | 'Season 1 & 2' | 'Evo Gun Max' | 'Criminal & Angelic' | 'Budget Friendly';
  safeTransferGuarantee: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minLevel: number;
  selectedTags: string[];
  sortBy: 'price-desc' | 'price-asc' | 'level-desc' | 'popular' | 'newest';
  onlyVerified: boolean;
  onlyEvoMax: boolean;
}

export interface DealProof {
  id: string;
  buyerName: string;
  city: string;
  idNo: number;
  amount: string;
  date: string;
  rating: number;
  paymentMethod: 'UPI (GPay / PhonePe / Paytm)' | 'Bank Transfer' | 'QR Scan';
  review: string;
  imageProof: string;
  verifiedBuyer: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
