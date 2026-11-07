import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShoppingBag, Heart, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    lang,
    t,
    isRTL,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo
  } = useStore();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorite = isInWishlist(product.id);
  const title = lang === 'ar' ? product.name_ar : lang === 'fr' ? product.name_fr : product.name_en;
  const description = lang === 'ar' ? product.description_ar : lang === 'fr' ? product.description_fr : product.description_en;

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: '', hex: '' });
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const activePrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
  const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;

  // Find variant stock
  const currentVariant = product.variants.find(
    v => v.size === selectedSize && v.color_name === selectedColor.name
  );
  const stock = currentVariant ? currentVariant.stock : 5;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor.name, selectedColor.hex, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      closeQuickView();
    }, 1200);
  };

  const handleViewFullPage = () => {
    closeQuickView();
    navigateTo('product-detail', product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeQuickView}
      />

      <div className="relative bg-[#FAF8F5] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E9DFD5] z-10 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 end-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="md:w-1/2 bg-[#F6F1EC] p-4 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-xs">
            <img
              src={selectedImage || product.images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#581C47]' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1">
              SKU: {product.sku}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
              {title}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-xl font-bold text-[#581C47] tabular-nums">
                {activePrice.toLocaleString()} {t('dzd')}
              </span>
              {hasDiscount && (
                <span className="font-mono text-sm text-stone-400 line-through tabular-nums">
                  {product.price.toLocaleString()} {t('dzd')}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 mt-3 line-clamp-3 leading-relaxed">
              {description}
            </p>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-stone-800 mb-1.5">
                  <span>{t('size')}</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    {stock > 0 ? `${stock} قطع متوفرة` : t('out_of_stock')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all ${
                        selectedSize === size
                          ? 'border-[#581C47] bg-[#581C47] text-white shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  {t('color')}: <span className="font-normal text-stone-600">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map(col => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        selectedColor.name === col.name ? 'border-[#581C47] scale-110 shadow-xs' : 'border-stone-300'
                      } flex items-center justify-center`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {selectedColor.name === col.name && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-stone-200 space-y-2.5">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#581C47] hover:bg-[#401233] text-white'
                } disabled:opacity-50`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تمت الإضافة للسلة !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('add_to_cart')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'border-[#581C47] bg-[#581C47]/10 text-[#581C47]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                }`}
                title={t('wishlist')}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleViewFullPage}
              className="w-full text-center text-xs text-stone-600 hover:text-[#581C47] font-medium py-1 transition-colors flex items-center justify-center gap-1"
            >
              <span>{t('details')}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
