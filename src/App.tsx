import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/store/Navbar';
import { Footer } from './components/store/Footer';
import { CartDrawer } from './components/store/CartDrawer';
import { QuickViewModal } from './components/store/QuickViewModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentPage } = useStore();

  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#242424] selection:bg-[#581C47] selection:text-white">
      <Navbar />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CatalogPage />}
        {currentPage === 'product-detail' && <ProductDetailPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'order-success' && <OrderSuccessPage />}
        {currentPage === 'track-order' && <TrackOrderPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer />
      <CartDrawer />
      <QuickViewModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
