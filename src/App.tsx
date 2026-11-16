import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { RecentItemsSection } from './components/RecentItemsSection';
import { BrowseView } from './components/BrowseView';
import { AdminPortal } from './components/AdminPortal';
import { ReportModal } from './components/ReportModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { EditItemModal } from './components/EditItemModal';
import { UploaderVerifyModal } from './components/UploaderVerifyModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { activeTab } = usePortal();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-blue-500 selection:text-white">
      {/* Main Header */}
      <Header />

      {/* View routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero />
            <StatsBar />
            <RecentItemsSection />
          </>
        )}

        {activeTab === 'browse' && <BrowseView />}

        {activeTab === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ReportModal />
      <ItemDetailModal />
      <EditItemModal />
      <UploaderVerifyModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortalProvider>
      <MainContent />
    </PortalProvider>
  );
};

export default App;
