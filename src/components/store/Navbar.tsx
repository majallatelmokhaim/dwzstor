import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Phone,
  Truck,
  MapPin,
  ShieldCheck,
  User,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    isRTL,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    wishlist,
    navigateTo,
    categories,
    settings,
    adminUser
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('catalog', searchQuery.trim());
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EADFD5] shadow-xs">
      {/* 1. Slim Top Bar: Trust markers & phone */}
      <div className="bg-[#401233] text-[#F3E5EC] text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-medium tracking-wide">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E6B89C]" />
              <span>{settings?.boutique_location || 'باتنة، الجزائر (Batna)'}</span>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#E6B89C]" />
              <span>التوصيل متوفر لجميع الـ 58 ولاية (Livraison 58 Wilayas)</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${settings?.phone || '0561234567'}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-[#E6B89C]" />
              <span className="font-mono text-xs">{settings?.phone || '0561 23 45 67'}</span>
            </a>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-0.5 px-1.5 rounded-sm bg-white/10"
              >
                <span className="font-medium uppercase text-[11px]">{lang}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute end-0 mt-1 w-28 bg-white text-stone-800 rounded-md shadow-lg border border-stone-200 py-1 text-xs z-50">
                  <button
                    onClick={() => { setLang('ar'); setIsLangDropdownOpen(false); }}
                    className={`w-full text-start px-3 py-1.5 hover:bg-stone-50 ${lang === 'ar' ? 'font-bold text-[#581C47]' : ''}`}
                  >
                    العربية (RTL)
                  </button>
                  <button
                    onClick={() => { setLang('fr'); setIsLangDropdownOpen(false); }}
                    className={`w-full text-start px-3 py-1.5 hover:bg-stone-50 ${lang === 'fr' ? 'font-bold text-[#581C47]' : ''}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => { setLang('en'); setIsLangDropdownOpen(false); }}
                    className={`w-full text-start px-3 py-1.5 hover:bg-stone-50 ${lang === 'en' ? 'font-bold text-[#581C47]' : ''}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Zone & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-800 hover:text-[#581C47] transition-colors"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center relative w-64 lg:w-72"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-[#F3EFEA] border border-[#E2D7CC] rounded-full py-2 ps-9 pe-4 text-xs text-stone-800 placeholder-stone-500 focus:outline-none focus:border-[#581C47] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-stone-500 absolute start-3 pointer-events-none" />
          </form>

          {/* Central Luxury Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#581C47]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#3A102E] group-hover:text-[#581C47] transition-colors">
                Miss Raja
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-stone-500 font-medium">
              Mode &amp; Élégance · Batna
            </span>
          </button>

          {/* Right Action Icons: Track, Wishlist, Cart, Admin */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Order Tracking */}
            <button
              onClick={() => navigateTo('track-order')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-stone-700 hover:text-[#581C47] transition-colors py-1.5 px-2 rounded-md hover:bg-stone-100"
              title={t('track_order')}
            >
              <Truck className="w-4 h-4 text-stone-600" />
              <span className="font-medium">{t('track_order')}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('catalog')}
              className="relative p-2 text-stone-700 hover:text-[#581C47] transition-colors rounded-full hover:bg-stone-100"
              title={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 end-1 bg-[#581C47] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#581C47] hover:bg-[#431235] text-white py-2 px-3.5 rounded-full transition-all shadow-xs cursor-pointer"
              title={t('cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold tabular-nums">
                {cartSubtotal > 0 ? `${cartSubtotal.toLocaleString()} ${t('dzd')}` : t('cart')}
              </span>
              {cartCount > 0 && (
                <span className="bg-[#E6B89C] text-[#360D2A] text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Shortcut */}
            <button
              onClick={() => navigateTo('admin')}
              className="p-2 text-stone-500 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
              title={adminUser ? `لوحة الإدارة (${adminUser.username})` : 'دخول المسؤولين'}
            >
              <User className={`w-5 h-5 ${adminUser ? 'text-[#581C47]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Navigation Links Bar */}
      <nav className="hidden lg:block border-t border-[#ECE4DB] bg-white/70">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8 py-2.5 text-xs font-medium text-stone-700">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#581C47] transition-colors py-1 cursor-pointer font-semibold"
          >
            {t('home')}
          </button>
          <button
            onClick={() => navigateTo('catalog')}
            className="hover:text-[#581C47] transition-colors py-1 cursor-pointer"
          >
            {t('all_categories')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigateTo('catalog', cat.id)}
              className="hover:text-[#581C47] transition-colors py-1 cursor-pointer"
            >
              {lang === 'ar' ? cat.name_ar : lang === 'fr' ? cat.name_fr : cat.name_en}
            </button>
          ))}
          <button
            onClick={() => navigateTo('about')}
            className="hover:text-[#581C47] transition-colors py-1 cursor-pointer text-stone-500"
          >
            {t('about')}
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className="hover:text-[#581C47] transition-colors py-1 cursor-pointer text-stone-500"
          >
            {t('contact')}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-[#FAF8F5] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <span className="font-serif text-xl font-bold text-[#581C47]">Miss Raja</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full bg-[#EFE9E2] border border-stone-300 rounded-lg py-2 ps-9 pe-3 text-xs"
                />
                <Search className="w-4 h-4 text-stone-500 absolute start-3 top-2.5" />
              </form>

              {/* Links */}
              <div className="mt-6 flex flex-col gap-3 text-sm font-medium text-stone-800">
                <button
                  onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
                  className="text-start py-2 border-b border-stone-100 hover:text-[#581C47]"
                >
                  {t('home')}
                </button>
                <button
                  onClick={() => { navigateTo('catalog'); setIsMobileMenuOpen(false); }}
                  className="text-start py-2 border-b border-stone-100 hover:text-[#581C47]"
                >
                  {t('all_categories')}
                </button>

                <div className="py-2 text-xs uppercase tracking-wider text-stone-400 font-bold">
                  {t('clothing')} &amp; {t('accessories')}
                </div>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { navigateTo('catalog', cat.id); setIsMobileMenuOpen(false); }}
                    className="text-start ps-3 py-1.5 text-stone-600 hover:text-[#581C47]"
                  >
                    {lang === 'ar' ? cat.name_ar : lang === 'fr' ? cat.name_fr : cat.name_en}
                  </button>
                ))}

                <button
                  onClick={() => { navigateTo('track-order'); setIsMobileMenuOpen(false); }}
                  className="text-start py-2 border-b border-stone-100 hover:text-[#581C47] flex items-center gap-2 text-[#581C47]"
                >
                  <Truck className="w-4 h-4" />
                  <span>{t('track_order')}</span>
                </button>
                <button
                  onClick={() => { navigateTo('about'); setIsMobileMenuOpen(false); }}
                  className="text-start py-2 border-b border-stone-100 hover:text-[#581C47]"
                >
                  {t('about')}
                </button>
                <button
                  onClick={() => { navigateTo('contact'); setIsMobileMenuOpen(false); }}
                  className="text-start py-2 border-b border-stone-100 hover:text-[#581C47]"
                >
                  {t('contact')}
                </button>
                <button
                  onClick={() => { navigateTo('admin'); setIsMobileMenuOpen(false); }}
                  className="text-start py-2 text-stone-500 hover:text-[#581C47]"
                >
                  {t('admin_portal')}
                </button>
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-6 border-t border-stone-200 text-xs text-stone-500">
              <p className="font-semibold text-stone-800">{settings?.store_name_ar}</p>
              <p className="mt-1">{settings?.phone}</p>
              <p className="mt-1">{settings?.boutique_location}</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
