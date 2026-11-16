import { Item, SiteConfig } from '../types';

export const CAMPUS_PRESET_IMAGES = [
  {
    id: 'campus-cmrtc-main',
    name: 'CMRTC Main Campus (Official College Building)',
    url: '/cmrtc-campus.jpeg',
    description: 'CMR Technical Campus Academic Block and Grounds',
  },
  {
    id: 'campus-brick-quad',
    name: 'Brick Quad & Students',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
    description: 'Vibrant college campus with brick architecture, trees, and students walking',
  },
  {
    id: 'campus-lawn-hall',
    name: 'University Grand Hall & Lawn',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
    description: 'Classic university administration building with manicured front lawn',
  },
  {
    id: 'campus-modern-courtyard',
    name: 'Modern Glass Academic Courtyard',
    url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1920&q=80',
    description: 'Contemporary university engineering & science complex',
  },
  {
    id: 'campus-autumn-walk',
    name: 'Sunny Campus Walkway',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
    description: 'Students walking on a warm autumn day across campus paths',
  },
  {
    id: 'campus-library-interior',
    name: 'University Library Hall',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80',
    description: 'High ceiling study tables and bookshelves in university central library',
  },
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  portalName: 'CMRTC ReFind',
  collegeName: 'CMR Technical Campus (CMRTC)',
  tagline: 'Lost something? CMRTC ReFind is here to help.',
  subtagline: 'Report lost or found belongings and reconnect with your CMRTC campus community.',
  heroImage: '/cmrtc-campus.jpeg',
  heroOverlayOpacity: 45,
  themeColor: 'blue',
  announcement: '📢 Welcome to CMRTC ReFind – Report or claim lost belongings across campus.',
  showAnnouncement: true,
  adminPin: 'cmrtc123',
  cloudDbUrl: 'https://cmrtc-refind-default-rtdb.firebaseio.com/portalData.json',
  contactDesk: {
    location: 'CMRTC Campus, Main Academic Block, Ground Floor (Admin / Security Desk)',
    phone: '+91 91007 60559',
    hours: 'Monday – Saturday: 8:30 AM – 4:30 PM',
  },
};

export const INITIAL_ITEMS: Item[] = [];
