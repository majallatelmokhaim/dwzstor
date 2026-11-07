import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    applyCouponCode,
    removeCoupon,
    t,
    isRTL,
    settings,
    navigateTo
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings?.free_shipping_threshold || 15000;
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const total = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCouponCode(couponInput.trim());
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.error || 'الكوبون غير صالح');
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE0D5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#581C47]" />
              <h2 className="text-base font-bold text-stone-900">{t('cart')}</h2>
              <span className="text-xs text-stone-500 font-mono">({cart.length} {t('details')})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#F6EDF3] border-b border-[#E9D9E4]">
            <div className="flex items-center justify-between text-xs text-[#581C47] font-medium mb-1.5">
              <span>{remainingForFree === 0 ? '🎉 مبروك! حصلت على توصيل مجاني لولايتك' : `أضيفي ${remainingForFree.toLocaleString()} ${t('dzd')} للشحن المجاني`}</span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#581C47] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-semibold text-stone-800">{t('empty_cart')}</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">{t('empty_cart_sub')}</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('catalog');
                  }}
                  className="mt-4 px-4 py-2 bg-[#581C47] text-white text-xs font-semibold rounded-lg hover:bg-[#431235] transition-colors"
                >
                  {t('shop_now')}
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product_id}-${item.size}-${item.color_name}-${index}`}
                  className="flex gap-3 bg-white p-3 rounded-xl border border-[#EDE4DC] shadow-2xs"
                >
                  <img
                    src={item.product.images[0] || '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'}
                    alt={item.product.name_ar}
                    className="w-20 h-24 object-cover rounded-lg bg-stone-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.product.name_ar}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product_id, item.size, item.color_name)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded-xs font-mono">
                          {t('size')}: {item.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-300"
                            style={{ backgroundColor: item.color_hex }}
                          />
                          <span>{item.color_name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.size, item.color_name, -1)}
                          className="p-1 hover:bg-stone-200 rounded-s transition-colors"
                        >
                          <Minus className="w-3 h-3 text-stone-600" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.size, item.color_name, 1)}
                          className="p-1 hover:bg-stone-200 rounded-e transition-colors"
                        >
                          <Plus className="w-3 h-3 text-stone-600" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-[#581C47] tabular-nums">
                        {(item.price * item.quantity).toLocaleString()} {t('dzd')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#EAE0D5] space-y-3">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>كوبون {appliedCoupon.code} (-{discountAmount.toLocaleString()} {t('dzd')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-stone-700 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder={t('coupon_placeholder')}
                      className="w-full uppercase text-xs bg-stone-50 border border-stone-200 rounded-lg py-2 ps-8 pe-3 focus:outline-none focus:border-[#581C47]"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute start-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="px-3.5 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors"
                  >
                    {isApplying ? '...' : t('apply')}
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-600">{couponError}</p>}

              {/* Subtotal & Totals */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-mono tabular-nums">{cartSubtotal.toLocaleString()} {t('dzd')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>خصم الكوبون</span>
                    <span className="font-mono tabular-nums">-{discountAmount.toLocaleString()} {t('dzd')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>{t('shipping')}</span>
                  <span>{remainingForFree === 0 ? 'مجاني (Offert)' : 'يُحسب عند اختيار الولاية'}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>{t('total')}</span>
                  <span className="font-mono text-[#581C47] tabular-nums">
                    {total.toLocaleString()} {t('dzd')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-[#581C47] hover:bg-[#431235] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('checkout')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
