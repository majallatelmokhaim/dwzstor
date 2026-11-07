import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Check,
  AlertCircle,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { selectedProductId, t, isRTL, navigateTo, setLastPlacedOrder } = useStore();

  const [orderNumberInput, setOrderNumberInput] = useState(selectedProductId || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (orderNum: string, phoneNum?: string) => {
    if (!orderNum.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const query = new URLSearchParams({ order_number: orderNum.trim() });
      if (phoneNum?.trim()) query.append('phone', phoneNum.trim());

      const res = await fetch(`/api/orders/track?${query.toString()}`);
      const data = await res.json();
      if (data.success && data.order) {
        setTrackedOrder(data.order);
      } else {
        setTrackedOrder(null);
        setErrorMsg(data.error || 'لم يتم العثور على طلبية بهذا الرقم.');
      }
    } catch {
      setErrorMsg('فشل الاتصال بخادم التتبع، يرجى المحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      handleTrack(selectedProductId);
    }
  }, [selectedProductId]);

  const statusSteps: { key: OrderStatus; label_ar: string; desc_ar: string }[] = [
    { key: 'pending', label_ar: 'تم تسجيل الطلب', desc_ar: 'بانتظار التأكيد الهاتفي' },
    { key: 'confirmed', label_ar: 'تم التأكيد', desc_ar: 'تم التحقق من المقاس والعنوان' },
    { key: 'processing', label_ar: 'قيد التجهيز', desc_ar: 'تغليف القطع بعناية فائقة' },
    { key: 'shipped', label_ar: 'خرج للتوصيل', desc_ar: 'مع مندوب شركة الشحن' },
    { key: 'delivered', label_ar: 'تم التسليم', desc_ar: 'تم استلام الطرد بنجاح' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = trackedOrder ? getStepIndex(trackedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#FAF0F6] text-[#581C47] flex items-center justify-center mx-auto mb-2">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          تتبع مسار طلبيتك في ميس راجا
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          أدخلي رقم الطلبية (الموجود في الفاتورة أو الرسالة النصية) لمتابعة حالة الشحن في الوقت الفعلي.
        </p>

        {/* Demo shortcuts for convenient testing */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs">
          <span className="text-stone-400">طلبيات تجريبية للمعاينة:</span>
          <button
            onClick={() => { setOrderNumberInput('MR-2508'); handleTrack('MR-2508'); }}
            className="font-mono text-[#581C47] font-semibold underline hover:text-[#401233]"
          >
            MR-2508
          </button>
          <span>·</span>
          <button
            onClick={() => { setOrderNumberInput('MR-2509'); handleTrack('MR-2509'); }}
            className="font-mono text-[#581C47] font-semibold underline hover:text-[#401233]"
          >
            MR-2509
          </button>
          <span>·</span>
          <button
            onClick={() => { setOrderNumberInput('MR-2510'); handleTrack('MR-2510'); }}
            className="font-mono text-[#581C47] font-semibold underline hover:text-[#401233]"
          >
            MR-2510
          </button>
        </div>
      </div>

      {/* Tracking Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleTrack(orderNumberInput, phoneInput); }}
        className="max-w-lg mx-auto bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={orderNumberInput}
            onChange={e => setOrderNumberInput(e.target.value.toUpperCase())}
            placeholder="رقم الطلبية (مثال: MR-2508)"
            className="flex-1 uppercase font-mono bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
          />
          <button
            type="submit"
            disabled={isLoading || !orderNumberInput.trim()}
            className="px-5 py-2.5 bg-[#581C47] hover:bg-[#401233] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'جاري البحث...' : 'تتبع'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Order Status Display */}
      {trackedOrder && (
        <div className="bg-white rounded-3xl border border-[#EDE4DC] p-6 sm:p-8 shadow-xs space-y-8">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">رقم الطلبية:</span>
                <span className="font-mono text-lg font-bold text-[#581C47]">#{trackedOrder.order_number}</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">الزبونة: <strong>{trackedOrder.customer_name}</strong> ({trackedOrder.wilaya_name})</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                trackedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                trackedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                trackedOrder.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {trackedOrder.status === 'pending' ? 'قيد الانتظار' :
                 trackedOrder.status === 'confirmed' ? 'تم التأكيد' :
                 trackedOrder.status === 'processing' ? 'قيد التجهيز' :
                 trackedOrder.status === 'shipped' ? 'في طريقها إليك' :
                 trackedOrder.status === 'delivered' ? 'تم التسليم' : 'ملغاة'}
              </span>

              <button
                onClick={() => {
                  setLastPlacedOrder(trackedOrder);
                  navigateTo('order-success');
                }}
                className="text-xs text-[#581C47] hover:underline font-semibold"
              >
                عرض الفاتورة
              </button>
            </div>
          </div>

          {/* Timeline Visual Progress */}
          {trackedOrder.status !== 'cancelled' ? (
            <div className="py-4">
              <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                <div className="absolute top-1/2 start-0 end-0 h-1 bg-stone-100 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 start-0 h-1 bg-[#581C47] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${Math.max(0, currentStep * 25)}%` }}
                />

                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isDone ? 'bg-[#581C47] text-white shadow-xs' : 'bg-white border-2 border-stone-200 text-stone-400'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-xs mt-2 font-semibold ${isCurrent ? 'text-[#581C47]' : isDone ? 'text-stone-800' : 'text-stone-400'}`}>
                        {step.label_ar}
                      </span>
                      <span className="hidden sm:block text-[10px] text-stone-400 max-w-[90px]">
                        {step.desc_ar}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 text-rose-800 rounded-xl text-xs">
              تم إلغاء هذه الطلبية بناءً على طلب الزبونة أو عدم مطابقة البيانات.
            </div>
          )}

          {/* Detailed Status History Logs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              سجل التحديثات ومسار الطرد
            </h3>
            <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 bg-[#FAF8F5]">
              {trackedOrder.status_history.map((h, i) => (
                <div key={i} className="p-3.5 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{h.notes}</span>
                    </div>
                    <span className="text-[11px] text-stone-500">بواسطة: {h.changed_by}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 whitespace-nowrap">
                    {new Date(h.timestamp).toLocaleString(isRTL ? 'ar-DZ' : 'fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary in Tracking */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-stone-600 gap-2">
            <div>
              <span>محتويات الطلبية: </span>
              <strong className="text-stone-800">{trackedOrder.items.map(it => `${it.product_name} (${it.size})`).join('، ')}</strong>
            </div>
            <div className="text-sm font-bold text-[#581C47]">
              المبلغ الإجمالي عند الاستلام: {trackedOrder.total_amount.toLocaleString()} {t('dzd')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
