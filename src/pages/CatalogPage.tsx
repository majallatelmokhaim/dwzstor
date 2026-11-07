import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/store/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    lang,
    t,
    products,
    categories,
    selectedCategorySlug
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('newest');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<'all' | 'new' | 'bestseller' | 'sale'>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available sizes across all products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.sizes.forEach(s => set.add(s)));
    return Array.from(set);
  }, [products]);

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (activeCategory !== 'all') {
        const matchesCat = product.category_id === activeCategory ||
          categories.find(c => c.id === activeCategory || c.slug === activeCategory)?.id === product.category_id;
        if (!matchesCat) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name_ar.toLowerCase().includes(q) ||
          product.name_fr.toLowerCase().includes(q) ||
          product.name_en.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q);
        if (!matchesName) return false;
      }

      // Size filter
      if (selectedSize !== 'all') {
        if (!product.sizes.includes(selectedSize)) return false;
      }

      // Tag filter
      if (filterTag === 'new' && !product.is_new) return false;
      if (filterTag === 'bestseller' && !product.is_bestseller) return false;
      if (filterTag === 'sale') {
        const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;
        if (!hasDiscount) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discount_price && a.discount_price > 0 ? a.discount_price : a.price;
      const priceB = b.discount_price && b.discount_price > 0 ? b.discount_price : b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
  }, [products, categories, activeCategory, searchQuery, selectedSize, filterTag, sortBy]);

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedSize('all');
    setFilterTag('all');
    setSortBy('newest');
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery !== '' || selectedSize !== 'all' || filterTag !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* 1. Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold text-[#581C47] tracking-widest uppercase">
          التشكيلة الحصرية · بوتيك باتنة
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
          {t('catalog')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2">
          تصفحي أحدث تصميمات الأزياء النسائية الفاخرة، مع إمكانية التوصيل لجميع ولايات الجزائر والدفع عند الاستلام.
        </p>
      </div>

      {/* 2. Top Filter Controls & Category Tabs */}
      <div className="space-y-4 mb-8">
        {/* Category Pills/Tabs (Functional Interactive Segmented Controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#581C47] text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
            }`}
          >
            {t('all_categories')} ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#581C47] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
              }`}
            >
              {lang === 'ar' ? cat.name_ar : lang === 'fr' ? cat.name_fr : cat.name_en}
            </button>
          ))}
        </div>

        {/* Search, Tag & Sorting Toolbar */}
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 ps-9 pe-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#581C47]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute start-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Tag Filter */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterTag(filterTag === 'sale' ? 'all' : 'sale')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                filterTag === 'sale'
                  ? 'bg-[#581C47] text-white border-[#581C47]'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              🔥 عروض خاصة
            </button>
            <button
              onClick={() => setFilterTag(filterTag === 'new' ? 'all' : 'new')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                filterTag === 'new'
                  ? 'bg-[#581C47] text-white border-[#581C47]'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              وصل حديثاً
            </button>
            <button
              onClick={() => setFilterTag(filterTag === 'bestseller' ? 'all' : 'bestseller')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                filterTag === 'bestseller'
                  ? 'bg-[#581C47] text-white border-[#581C47]'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              الأكثر طلباً
            </button>
          </div>

          {/* Size Filter Dropdown */}
          <select
            value={selectedSize}
            onChange={e => setSelectedSize(e.target.value)}
            className="bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:border-[#581C47]"
          >
            <option value="all">كل المقاسات ({t('size')})</option>
            {allSizes.map(s => (
              <option key={s} value={s}>المقاس {s}</option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:border-[#581C47]"
          >
            <option value="newest">{t('newest')}</option>
            <option value="price-asc">{t('price_low_high')}</option>
            <option value="price-desc">{t('price_high_low')}</option>
          </select>

          {/* Reset Filters button if any active */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Products Count & Result Grid */}
      <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
        <span>عرض <strong className="text-stone-800 font-mono">{filteredProducts.length}</strong> من أصل {products.length} منتج</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800">لم يتم العثور على أي منتج</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            جربي البحث بكلمات أخرى أو إزالة بعض خيارات التصفية لعرض المزيد من المنتجات.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-[#581C47] text-white text-xs font-semibold rounded-lg hover:bg-[#401233] transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
