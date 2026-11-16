import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Item, SiteConfig, ClaimRequest, ItemStatus, Category } from '../types';
import { INITIAL_ITEMS, INITIAL_SITE_CONFIG } from '../data/initialData';
import confetti from 'canvas-confetti';

interface PortalContextType {
  items: Item[];
  siteConfig: SiteConfig;
  claimRequests: ClaimRequest[];
  activeTab: 'home' | 'browse' | 'admin';
  setActiveTab: (tab: 'home' | 'browse' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | ItemStatus;
  setFilterStatus: (status: 'all' | ItemStatus) => void;
  filterCategory: 'all' | Category;
  setFilterCategory: (category: 'all' | Category) => void;
  isReportModalOpen: boolean;
  reportType: 'lost' | 'found';
  openReportModal: (type?: 'lost' | 'found') => void;
  closeReportModal: () => void;
  selectedItem: Item | null;
  openItemDetail: (item: Item) => void;
  closeItemDetail: () => void;
  editingItem: Item | null;
  openEditModal: (item: Item) => void;
  closeEditModal: () => void;

  // Uploader verification for Reunited / Edit
  uploaderActionItem: { item: Item; action: 'reunite' | 'edit' } | null;
  openUploaderVerify: (item: Item, action: 'reunite' | 'edit') => void;
  closeUploaderVerify: () => void;
  verifyAndExecuteUploaderAction: (inputPhone: string) => { success: boolean; message: string };

  // Admin Portal Auth
  isAdmin: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;

  // Actions
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  markItemAsClaimed: (id: string) => void;
  updateSiteConfig: (updates: Partial<SiteConfig>) => void;
  submitClaimRequest: (claim: Omit<ClaimRequest, 'id' | 'submittedAt' | 'status'>) => void;
  resetToDefaults: () => void;
  isSyncing: boolean;
  lastSavedAt: string | null;
  cloudStatus: 'connected' | 'offline' | 'local';
  testCloudConnection: (url?: string) => Promise<{ success: boolean; message: string }>;
  stats: {
    total: number;
    lost: number;
    found: number;
    claimed: number;
  };
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

// Helper to clean phone numbers for matching
export const normalizePhone = (phone: string): string => {
  return phone.replace(/[^0-9]/g, '').slice(-10);
};

// Helper to resolve the active cloud database URL (from URL query, config, or localStorage)
export const getEffectiveCloudUrl = (config?: SiteConfig): string => {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const dbParam = params.get('db');
      if (dbParam && dbParam.startsWith('http')) {
        localStorage.setItem('cmrtc_cloud_db_url', dbParam);
        const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', cleanUrl);
        return dbParam;
      }
    } catch {
      // ignore
    }
  }

  if (config?.cloudDbUrl && config.cloudDbUrl.trim().startsWith('http')) {
    return config.cloudDbUrl.trim();
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('cmrtc_cloud_db_url');
      if (saved && saved.startsWith('http')) return saved.trim();
    } catch {
      // ignore
    }
  }

  return '';
};

// Helper to normalize Firebase data (handles both JSON arrays and Firebase sparse objects)
export const parseFirebaseArray = <T,>(val: any): T[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'object') return Object.values(val);
  return [];
};

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'local'>('local');

  // Admin Auth state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('cmrtc_admin_auth') === 'true';
  });

  const stateRef = useRef({ items, siteConfig, claimRequests });
  stateRef.current = { items, siteConfig, claimRequests };

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ItemStatus>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | Category>('all');

  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [uploaderActionItem, setUploaderActionItem] = useState<{
    item: Item;
    action: 'reunite' | 'edit';
  } | null>(null);

  // Save to backend endpoint, Cloud DB, & localStorage fallback
  const saveToServer = async (
    newConfig: SiteConfig,
    newItems: Item[],
    newClaims: ClaimRequest[]
  ) => {
    setIsSyncing(true);
    const payload = {
      siteConfig: newConfig,
      items: newItems,
      claimRequests: newClaims,
    };

    // 1. Always save to local storage immediately
    try {
      localStorage.setItem('cmrtc_items_v5', JSON.stringify(newItems));
      localStorage.setItem('cmrtc_config_v5', JSON.stringify(newConfig));
      localStorage.setItem('cmrtc_claims_v5', JSON.stringify(newClaims));
    } catch {
      // ignore
    }

    // 2. Save to Cloud Database (e.g. Firebase Realtime Database) if configured
    const cloudUrl = getEffectiveCloudUrl(newConfig);
    if (cloudUrl) {
      try {
        const cloudRes = await fetch(cloudUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (cloudRes.ok) {
          setCloudStatus('connected');
          setLastSavedAt(new Date().toLocaleTimeString());
          setIsSyncing(false);
          return;
        } else {
          setCloudStatus('offline');
        }
      } catch (err) {
        console.warn('Cloud DB save error:', err);
        setCloudStatus('offline');
      }
    } else {
      setCloudStatus('local');
    }

    // 3. Also save to server API if available (local dev / server)
    try {
      const response = await fetch('/api/portal-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch {
      // Running on static cloud host (Netlify / Vercel / GitHub Pages)
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial load from Cloud DB, server API, or localStorage
  useEffect(() => {
    const fetchServerData = async () => {
      let loaded = false;

      // Check Cloud DB first (for Netlify worldwide multi-device sync)
      const cloudUrl = getEffectiveCloudUrl(stateRef.current.siteConfig);
      if (cloudUrl) {
        try {
          const res = await fetch(cloudUrl);
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data === 'object') {
              const remoteItems = parseFirebaseArray<Item>(data.items);
              setItems(remoteItems);
              if (data.siteConfig) {
                setSiteConfig((prev) => ({
                  ...prev,
                  ...data.siteConfig,
                  cloudDbUrl: prev.cloudDbUrl || cloudUrl,
                }));
              }
              const remoteClaims = parseFirebaseArray<ClaimRequest>(data.claimRequests);
              setClaimRequests(remoteClaims);
              setCloudStatus('connected');
              setLastSavedAt('Synced with Cloud DB');
              loaded = true;
            } else if (data === null) {
              // Cloud DB is completely empty (e.g. new Firebase), initialize with current portal state
              await saveToServer(stateRef.current.siteConfig, stateRef.current.items, stateRef.current.claimRequests);
              setCloudStatus('connected');
              loaded = true;
            }
          } else {
            setCloudStatus('offline');
          }
        } catch (err) {
          console.warn('Cloud DB fetch error:', err);
          setCloudStatus('offline');
        }
      }

      if (!loaded) {
        try {
          const res = await fetch('/api/portal-data');
          if (res.ok) {
            const data = await res.json();
            if (data.items && Array.isArray(data.items)) {
              setItems(data.items);
              loaded = true;
            }
            if (data.siteConfig) {
              setSiteConfig(data.siteConfig);
            }
            if (data.claimRequests && Array.isArray(data.claimRequests)) {
              setClaimRequests(data.claimRequests);
            }
            setLastSavedAt('Loaded from server');
          }
        } catch {
          // server API not available
        }
      }

      // If not loaded from cloud/server API, check localStorage
      if (!loaded) {
        try {
          const savedItems = localStorage.getItem('cmrtc_items_v5') || localStorage.getItem('cmrtc_items_v4');
          if (savedItems) {
            setItems(JSON.parse(savedItems));
          }
          const savedConfig = localStorage.getItem('cmrtc_config_v5') || localStorage.getItem('cmrtc_config_v4');
          if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            if (!parsed.heroImage || parsed.heroImage.includes('unsplash.com')) {
              parsed.heroImage = INITIAL_SITE_CONFIG.heroImage;
            }
            setSiteConfig((prev) => ({ ...prev, ...parsed }));
          }
          const savedClaims = localStorage.getItem('cmrtc_claims_v5') || localStorage.getItem('cmrtc_claims_v4');
          if (savedClaims) {
            setClaimRequests(JSON.parse(savedClaims));
          }
        } catch {
          // ignore
        }
      }
    };

    fetchServerData();

    // Live sync polling every 3.5 seconds
    const pollInterval = setInterval(async () => {
      const cloudUrl = getEffectiveCloudUrl(stateRef.current.siteConfig);
      try {
        const fetchUrl = cloudUrl || '/api/portal-data';
        const res = await fetch(fetchUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            const remoteItems = parseFirebaseArray<Item>(data.items);
            if (JSON.stringify(remoteItems) !== JSON.stringify(stateRef.current.items)) {
              setItems(remoteItems);
            }
            if (
              data.siteConfig &&
              JSON.stringify(data.siteConfig) !==
                JSON.stringify(stateRef.current.siteConfig)
            ) {
              setSiteConfig((prev) => ({
                ...prev,
                ...data.siteConfig,
                cloudDbUrl: prev.cloudDbUrl || data.siteConfig.cloudDbUrl || cloudUrl,
              }));
            }
            const remoteClaims = parseFirebaseArray<ClaimRequest>(data.claimRequests);
            if (JSON.stringify(remoteClaims) !== JSON.stringify(stateRef.current.claimRequests)) {
              setClaimRequests(remoteClaims);
            }
            if (cloudUrl) setCloudStatus('connected');
          }
        } else if (cloudUrl) {
          setCloudStatus('offline');
        }
      } catch {
        if (cloudUrl) setCloudStatus('offline');
      }
    }, 3500);

    return () => clearInterval(pollInterval);
  }, []);

  const adminLogin = (pin: string): boolean => {
    if (pin.trim() === siteConfig.adminPin.trim()) {
      setIsAdmin(true);
      sessionStorage.setItem('cmrtc_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('cmrtc_admin_auth');
    setActiveTab('home');
  };

  const openReportModal = (type: 'lost' | 'found' = 'lost') => {
    setReportType(type);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const openItemDetail = (item: Item) => {
    setSelectedItem(item);
  };

  const closeItemDetail = () => {
    setSelectedItem(null);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const openUploaderVerify = (item: Item, action: 'reunite' | 'edit') => {
    // If admin is logged in, bypass phone verification
    if (isAdmin) {
      if (action === 'reunite') {
        markItemAsClaimed(item.id);
      } else {
        openEditModal(item);
      }
      return;
    }
    setUploaderActionItem({ item, action });
  };

  const closeUploaderVerify = () => {
    setUploaderActionItem(null);
  };

  const verifyAndExecuteUploaderAction = (
    inputPhone: string
  ): { success: boolean; message: string } => {
    if (!uploaderActionItem) {
      return { success: false, message: 'No item selected' };
    }

    const cleanInput = normalizePhone(inputPhone);
    const cleanUploader = normalizePhone(uploaderActionItem.item.contactPhone);

    if (cleanInput.length < 10 || cleanInput !== cleanUploader) {
      return {
        success: false,
        message: 'Phone number does not match the uploader who reported this item.',
      };
    }

    // Success! Execute action
    const currentItem = uploaderActionItem.item;
    const currentAction = uploaderActionItem.action;
    setUploaderActionItem(null);

    if (currentAction === 'reunite') {
      markItemAsClaimed(currentItem.id);
      return { success: true, message: 'Item successfully marked as Reunited!' };
    } else {
      openEditModal(currentItem);
      return { success: true, message: 'Identity verified. Opening editor.' };
    }
  };

  const addItem = (newItemData: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...newItemData,
      id: `item-${Date.now()}`,
      createdAt: Date.now(),
    };
    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    saveToServer(siteConfig, updatedItems, claimRequests);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setItems(updatedItems);
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, ...updates } : null));
    }
    saveToServer(siteConfig, updatedItems, claimRequests);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
    saveToServer(siteConfig, updatedItems, claimRequests);
  };

  const markItemAsClaimed = (id: string) => {
    updateItem(id, { status: 'claimed' });
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const updateSiteConfig = (updates: Partial<SiteConfig>) => {
    const updatedConfig: SiteConfig = {
      ...siteConfig,
      ...updates,
      contactDesk: updates.contactDesk
        ? { ...siteConfig.contactDesk, ...updates.contactDesk }
        : siteConfig.contactDesk,
    };
    setSiteConfig(updatedConfig);
    if (updates.cloudDbUrl !== undefined) {
      try {
        if (updates.cloudDbUrl && updates.cloudDbUrl.trim()) {
          localStorage.setItem('cmrtc_cloud_db_url', updates.cloudDbUrl.trim());
        } else {
          localStorage.removeItem('cmrtc_cloud_db_url');
        }
      } catch {
        // ignore
      }
    }
    saveToServer(updatedConfig, items, claimRequests);
  };

  const testCloudConnection = async (testUrl?: string): Promise<{ success: boolean; message: string }> => {
    const targetUrl = (testUrl || getEffectiveCloudUrl(siteConfig)).trim();
    if (!targetUrl || !targetUrl.startsWith('http')) {
      return { success: false, message: 'Please provide a valid database REST URL starting with https://' };
    }

    try {
      // 1. Test Read
      const readRes = await fetch(targetUrl);
      if (!readRes.ok) {
        return {
          success: false,
          message: `Read failed: HTTP ${readRes.status} (${readRes.statusText}). Check database URL.`,
        };
      }
      const data = await readRes.json();

      // 2. Test Write (PUT current state)
      const payload = {
        siteConfig: { ...siteConfig, cloudDbUrl: targetUrl },
        items,
        claimRequests,
      };

      const writeRes = await fetch(targetUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!writeRes.ok) {
        return {
          success: false,
          message: `Write failed (HTTP ${writeRes.status}). In Firebase, ensure Rules are set to: ".read": true, ".write": true`,
        };
      }

      setCloudStatus('connected');
      setLastSavedAt(new Date().toLocaleTimeString());
      return {
        success: true,
        message: 'Cloud database verified successfully! Multi-device sync is ACTIVE across all devices worldwide.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Connection error: ${err.message || 'CORS or Network error'}. Ensure the URL is accessible over HTTPS.`,
      };
    }
  };

  const submitClaimRequest = (
    claimData: Omit<ClaimRequest, 'id' | 'submittedAt' | 'status'>
  ) => {
    const newClaim: ClaimRequest = {
      ...claimData,
      id: `claim-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'pending',
    };
    const updatedClaims = [newClaim, ...claimRequests];
    setClaimRequests(updatedClaims);
    saveToServer(siteConfig, items, updatedClaims);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const resetToDefaults = () => {
    setItems(INITIAL_ITEMS);
    setSiteConfig(INITIAL_SITE_CONFIG);
    setClaimRequests([]);
    saveToServer(INITIAL_SITE_CONFIG, INITIAL_ITEMS, []);
  };

  const stats = {
    total: items.length,
    lost: items.filter((i) => i.status === 'lost').length,
    found: items.filter((i) => i.status === 'found').length,
    claimed: items.filter((i) => i.status === 'claimed').length,
  };

  return (
    <PortalContext.Provider
      value={{
        items,
        siteConfig,
        claimRequests,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        filterCategory,
        setFilterCategory,
        isReportModalOpen,
        reportType,
        openReportModal,
        closeReportModal,
        selectedItem,
        openItemDetail,
        closeItemDetail,
        editingItem,
        openEditModal,
        closeEditModal,
        uploaderActionItem,
        openUploaderVerify,
        closeUploaderVerify,
        verifyAndExecuteUploaderAction,
        isAdmin,
        adminLogin,
        adminLogout,
        addItem,
        updateItem,
        deleteItem,
        markItemAsClaimed,
        updateSiteConfig,
        submitClaimRequest,
        resetToDefaults,
        isSyncing,
        lastSavedAt,
        cloudStatus,
        testCloudConnection,
        stats,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
