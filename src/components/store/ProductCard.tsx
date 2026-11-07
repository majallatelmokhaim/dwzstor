import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    lang,
    t,
    addToCart,
    openQuickView,
    toggleWishlist,
    isInWishlist,
    navigateTo
  } = useStore();

  const isFavorite = isInWishlist(product.id);
  const title = lang === 'ar' ? product.name_ar : lang === 'fr' ? product.name_fr : product.name_en;
  const activePrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
  const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discount_price!) / product.price) * 100) : 0;

  const defaultSize = product.sizes[0] || 'Standard';
  const defaultColor = product.colors[0] || { name: 'Standard', hex: '#000000' };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, defaultSize, defaultColor.name, defaultColor.hex, 1);
  };

  return (
    <div
      onClick={() => navigateTo('product-detail', product.id)}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#EDE4DC] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F3EF]">
        <img
          src={product.images[0] || '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'}
          alt={title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback gracefully if image fails
            (e.target as HTMLElement).style.opacity = '0.9';
          }}
        />

        {/* Badges: only 1 subtle tag */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
          {hasDiscount ? (
            <span className="bg-[#581C47] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-xs tabular-nums">
              -{discountPercent}%
            </span>
          ) : product.is_new ? (
            <span className="bg-[#242424] text-white text-[11px] font-medium px-2 py-0.5 rounded-sm shadow-xs">
              {t('new_arrivals')}
            </span>
          ) : product.is_bestseller ? (
            <span className="bg-[#93664C] text-white text-[11px] font-medium px-2 py-0.5 rounded-sm shadow-xs">
              {t('best_sellers')}
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 end-3 p-2 rounded-full transition-all duration-200 shadow-xs cursor-pointer z-10 ${
            isFavorite
              ? 'bg-[#581C47] text-white'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-[#581C47]'
          }`}
          title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-[#581C47]/95 hover:bg-[#401233] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('add_to_cart')}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="p-2 bg-white/95 hover:bg-white text-stone-800 rounded-lg shadow-md transition-colors cursor-pointer"
            title={t('quick_view')}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Colors palette circles */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              {product.colors.slice(0, 4).map((c, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-stone-400 font-mono">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-stone-800 line-clamp-2 group-hover:text-[#581C47] transition-colors">
            {title}
          </h3>
        </div>

        {/* Price & Sizes */}
        <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm sm:text-base font-bold text-[#581C47] tabular-nums">
              {activePrice.toLocaleString()} {t('dzd')}
            </span>
            {hasDiscount && (
              <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                {product.price.toLocaleString()} {t('dzd')}
              </span>
            )}
          </div>

          {/* Sizes */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-stone-500 font-mono">
            {product.sizes.slice(0, 3).map(s => (
              <span key={s} className="px-1 py-0.5 bg-stone-100 rounded-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
