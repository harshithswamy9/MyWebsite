export type ItemStatus = 'lost' | 'found' | 'claimed';

export type Category =
  | 'Electronics'
  | 'Books & Notes'
  | 'Wallets & Bags'
  | 'Clothing & Shoes'
  | 'ID & Cards'
  | 'Keys'
  | 'Bottles & Tumblers'
  | 'Jewelry & Watches'
  | 'Miscellaneous';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: ItemStatus;
  location: string;
  date: string;
  time?: string;
  imageUrl: string;
  reporterName: string; // Mandatory
  contactPhone: string; // Mandatory
  reward?: string;
  isCustomImage?: boolean;
  createdAt: number;
}

export interface SiteConfig {
  portalName: string;
  collegeName: string;
  tagline: string;
  subtagline: string;
  heroImage: string;
  heroOverlayOpacity: number;
  themeColor: 'blue' | 'emerald' | 'crimson' | 'indigo' | 'amber' | 'slate';
  announcement: string;
  showAnnouncement: boolean;
  adminPin: string; // For Admin Portal access
  cloudDbUrl?: string; // Optional Firebase / REST cloud database URL for Netlify sync
  contactDesk: {
    location: string;
    phone: string;
    hours: string;
  };
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantName: string; // Mandatory
  claimantPhone: string; // Mandatory
  proofDetails: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
