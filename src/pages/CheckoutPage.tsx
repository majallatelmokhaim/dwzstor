import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import confetti from 'canvas-confetti';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    applyCouponCode,
    removeCoupon,
    clearCart,
    setLastPlacedOrder,
    navigateTo,
    settings,
    lang,
    t,
    isRTL
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('05'); // Default: Batna
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-3">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">{t('empty_cart')}</h2>
        <p className="text-xs text-stone-500 mt-1">{t('empty_cart_sub')}</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="mt-6 px-6 py-2.5 bg-[#581C47] text-white text-xs font-semibold rounded-xl hover:bg-[#431235] transition-colors"
        >
          {t('shop_now')}
        </button>
      </div>
    );
  }

  // Calculate dynamic shipping fee based on Wilaya
  const selectedWilaya = ALGERIAN_WILAYAS.find(w => w.code === selectedWilayaCode) || ALGERIAN_WILAYAS[4]; // Batna
  const freeShippingThreshold = settings?.free_shipping_threshold || 15000;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const baseShippingFee = settings?.wilaya_shipping_fees?.[selectedWilayaCode] ?? selectedWilaya.default_fee;
  const calculatedShippingFee = isFreeShipping ? 0 : baseShippingFee;

  const grandTotal = Math.max(0, cartSubtotal + calculatedShippingFee - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phone.trim() || !commune.trim() || !address.trim()) {
      setFormError('يرجى ملء جميع الحقول الإلزامية (الاسم، الهاتف، البلدية، والعنوان).');
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 9) {
      setFormError('يرجى إدخال رقم هاتف جزائري صحيح للتمكن من تأكيد الطلبية.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: fullName.trim(),
        customer_phone: cleanPhone,
        customer_email: email.trim() || undefined,
        wilaya_code: selectedWilaya.code,
        wilaya_name: `${selectedWilaya.name_ar} (${selectedWilaya.name_fr})`,
        commune: commune.trim(),
        address: address.trim(),
        delivery_notes: deliveryNotes.trim() || undefined,
        items: cart.map(item => ({
          product_id: item.product_id,
          size: item.size,
          color_name: item.color_name,
          color_hex: item.color_hex,
          quantity: item.quantity
        })),
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.order) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}

        setLastPlacedOrder(data.order);
        clearCart();
        navigateTo('order-success');
      } else {
        setFormError(data.error || 'حدث خطأ أثناء تسجيل الطلبية، يرجى المحاولة ثانية.');
      }
    } catch {
      setFormError('تعذر الاتصال بالخادم، يرجى التأكد من اتصالك بالإنترنت.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-8 text-center sm:text-start">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          {t('checkout')} · الدفع عند الاستلام (COD)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          أدخلي عنوانك لتسليم الطرد لباب منزلك. لا داعي للدفع مسبقاً، الدفع يتم نقداً عند الاستلام.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Delivery Details Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE4DC] shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <Truck className="w-5 h-5 text-[#581C47]" />
            <h2 className="text-base font-bold text-stone-900">{t('customer_info')}</h2>
          </div>

          {formError && (
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                {t('full_name')} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="مثال: مريم بوخالفة"
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
              />
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  {t('phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0661 23 45 67 أو 0550..."
                  dir="ltr"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  سنتصل بك لتأكيد القياس قبل الشحن
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  البريد الإلكتروني (اختياري للإيصال)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
                />
              </div>
            </div>

            {/* Wilaya & Commune Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  {t('wilaya')} *
                </label>
                <select
                  value={selectedWilayaCode}
                  onChange={e => setSelectedWilayaCode(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
                >
                  {ALGERIAN_WILAYAS.map(w => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name_ar} ({w.name_fr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  {t('commune')} *
                </label>
                <input
                  type="text"
                  required
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  placeholder="اسم البلدية أو المدينة"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
                />
              </div>
            </div>

            {/* Full Street Address */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                {t('address')} *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="الحي، رقم العمارة أو المنزل، معلم قريب لتسهيل وصول المندوب..."
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
              />
            </div>

            {/* Delivery Instructions */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                {t('notes')}
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={e => setDeliveryNotes(e.target.value)}
                placeholder="مثال: يرجى الاتصال قبل الوصول بساعة"
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
              />
            </div>

            {/* Payment Method Notice */}
            <div className="p-4 bg-[#F8F1F6] border border-[#E8D4E2] rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#581C47] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#581C47]">طريقة الدفع: الدفع نقداً عند استلام الطرد (COD)</span>
                <p className="text-stone-600 mt-0.5">
                  يتم الدفع نقداً لمندوب شركة التوصيل بعد معاينة الطرد والتأكد من سلامة طلبيتك.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#581C47] hover:bg-[#431235] text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>جاري تسجيل الطلبية...</span>
              ) : (
                <>
                  <span>{t('order_now')} ({grandTotal.toLocaleString()} {t('dzd')})</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-3xl border border-[#EDE4DC] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="font-bold text-sm text-stone-900">ملخص الطلبية ({cart.length} منتجات)</h3>
            <span className="text-xs text-[#581C47] font-semibold">ميس راجا باتنة</span>
          </div>

          {/* Items */}
          <div className="space-y-3 max-h-72 overflow-y-auto pe-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 bg-white p-2.5 rounded-xl border border-stone-200">
                <img
                  src={item.product.images[0] || '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'}
                  alt={item.product.name_ar}
                  className="w-14 h-16 object-cover rounded-lg bg-stone-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                      {item.product.name_ar}
                    </h4>
                    <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                      <span>المقاس: {item.size}</span>
                      <span>•</span>
                      <span>اللون: {item.color_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-mono">x{item.quantity}</span>
                    <span className="font-mono font-bold text-[#581C47] tabular-nums">
                      {(item.price * item.quantity).toLocaleString()} {t('dzd')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping details for selected wilaya */}
          <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
            <div className="flex justify-between text-stone-600">
              <span>وجهة التوصيل:</span>
              <span className="font-semibold text-stone-800">{selectedWilaya.name_ar} ({selectedWilaya.code})</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>مصاريف التوصيل:</span>
              <span className="font-mono font-bold text-stone-800">
                {isFreeShipping ? (
                  <span className="text-emerald-700">مجاني (تجاوز 15,000 د.ج)</span>
                ) : (
                  `${calculatedShippingFee} ${t('dzd')}`
                )}
              </span>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="pt-2 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-mono tabular-nums">{cartSubtotal.toLocaleString()} {t('dzd')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>خصم الكوبون ({appliedCoupon?.code}):</span>
                <span className="font-mono tabular-nums">-{discountAmount.toLocaleString()} {t('dzd')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>التوصيل:</span>
              <span className="font-mono tabular-nums">
                {calculatedShippingFee === 0 ? '0 د.ج' : `${calculatedShippingFee.toLocaleString()} د.ج`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-300">
              <span>المبلغ الإجمالي عند الاستلام:</span>
              <span className="font-mono text-[#581C47] text-lg tabular-nums">
                {grandTotal.toLocaleString()} {t('dzd')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
