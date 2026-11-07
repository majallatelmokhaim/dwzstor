import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/store/ProductCard';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
  Share2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    categories,
    lang,
    t,
    isRTL,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo
  } = useStore();

  const product = products.find(p => p.id === selectedProductId || p.slug === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || { name: '', hex: '' });
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-600">المنتج غير موجود.</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="mt-4 px-4 py-2 bg-[#581C47] text-white rounded-lg text-xs"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const title = lang === 'ar' ? product.name_ar : lang === 'fr' ? product.name_fr : product.name_en;
  const description = lang === 'ar' ? product.description_ar : lang === 'fr' ? product.description_fr : product.description_en;
  const category = categories.find(c => c.id === product.category_id);
  const categoryName = category ? (lang === 'ar' ? category.name_ar : lang === 'fr' ? category.name_fr : category.name_en) : '';

  const activePrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
  const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discount_price!) / product.price) * 100) : 0;

  // Selected variant stock check
  const currentVariant = product.variants.find(
    v => v.size === selectedSize && v.color_name === selectedColor.name
  );
  const currentStock = currentVariant ? currentVariant.stock : 5;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor.name, selectedColor.hex, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const relatedProducts = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => navigateTo('home')} className="hover:text-[#581C47]">
          {t('home')}
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('catalog', product.category_id)} className="hover:text-[#581C47]">
          {categoryName}
        </button>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-xs">{title}</span>
      </div>

      {/* 2. Main Product Grid: Sticky Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full bg-[#FAF5F0] rounded-2xl overflow-hidden border border-[#ECE0D5] shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0] || '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'}
              alt={title}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 start-4 bg-[#581C47] text-white text-xs font-bold px-3 py-1 rounded-sm shadow-md">
                تخفيض -{discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === i ? 'border-[#581C47] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE4DC] shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-1.5">
              <span>SKU: {product.sku}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold">
                {currentStock > 0 ? t('in_stock') : t('out_of_stock')}
              </span>
            </div>

            <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
              {title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#581C47] tabular-nums">
                {activePrice.toLocaleString()} {t('dzd')}
              </span>
              {hasDiscount && (
                <span className="font-mono text-base text-stone-400 line-through tabular-nums">
                  {product.price.toLocaleString()} {t('dzd')}
                </span>
              )}
            </div>
          </div>

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-stone-800 mb-2">
                <span>{t('size')}: <strong className="font-mono text-[#581C47]">{selectedSize}</strong></span>
                <span className="text-[11px] text-stone-500 font-normal">
                  {currentStock > 0 ? `${currentStock} قطع متوفرة بالمخزون` : 'غير متوفر'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#581C47] bg-[#581C47] text-white shadow-xs font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                {t('color')}: <span className="font-normal text-stone-600">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedColor.name === col.name ? 'border-[#581C47] scale-110 shadow-sm' : 'border-stone-300'
                    } flex items-center justify-center`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColor.name === col.name && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2">
              {t('quantity')}
            </label>
            <div className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 text-stone-600 hover:bg-stone-200 rounded-s-xl transition-colors font-bold"
              >
                -
              </button>
              <span className="px-4 font-mono text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                className="px-3.5 py-2 text-stone-600 hover:bg-stone-200 rounded-e-xl transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart & Wishlist Actions */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={currentStock <= 0}
              className={`flex-1 py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#581C47] hover:bg-[#431235] text-white'
              } disabled:opacity-50`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>تمت الإضافة للسلة بنجاح !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t('add_to_cart')} ({((activePrice * quantity)).toLocaleString()} {t('dzd')})</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                isFavorite
                  ? 'border-[#581C47] bg-[#581C47]/10 text-[#581C47]'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
              }`}
              title={t('wishlist')}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3.5 rounded-2xl border border-stone-200 bg-white text-stone-600 hover:border-stone-400 transition-colors"
              title="مشاركة رابط المنتج"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {copiedShare && (
            <p className="text-xs text-emerald-600 text-center font-medium">
              تم نسخ رابط المنتج إلى الحافظة!
            </p>
          )}

          {/* Quick Trust Badges for COD */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#581C47]" />
              <span>توصيل سريع لباب منزلك في 58 ولاية مع الدفع عند الاستلام (COD)</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#581C47]" />
              <span>إمكانية معاينة المقاس والاستبدال خلال 7 أيام</span>
            </div>
          </div>

          {/* Product Description, Material & Care */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              الوصف وتفاصيل القماش
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {description}
            </p>

            {product.material && (
              <div className="text-xs bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                <span className="font-semibold text-stone-800">نوع القماش: </span>
                <span className="text-stone-600">{product.material}</span>
              </div>
            )}

            {product.care_instructions && (
              <div className="text-xs bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                <span className="font-semibold text-stone-800">إرشادات الغسيل والعناية: </span>
                <span className="text-stone-600">{product.care_instructions}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              منتجات مشابهة قد تعجبكِ
            </h2>
            <button
              onClick={() => navigateTo('catalog', product.category_id)}
              className="text-xs text-[#581C47] hover:underline font-semibold"
            >
              مشاهدة المزيد من هذا القسم
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
