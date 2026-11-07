import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastPlacedOrder, navigateTo, t, isRTL, settings } = useStore();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-600">لا توجد تفاصيل طلبية معروضة.</p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-5 py-2.5 bg-[#581C47] text-white rounded-xl text-xs font-semibold"
        >
          {t('back_home')}
        </button>
      </div>
    );
  }

  const order = lastPlacedOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* 1. Header Banner */}
      <div className="text-center space-y-3 no-print">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          {t('order_success_title')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          {t('order_success_desc')}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('print_invoice')}</span>
          </button>
          <button
            onClick={() => navigateTo('track-order', order.order_number)}
            className="px-4 py-2 bg-[#581C47] hover:bg-[#431235] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>تتبع مسار الطلبية الآن</span>
          </button>
        </div>
      </div>

      {/* 2. Official Printable Invoice Sheet */}
      <div
        id="printable-invoice"
        className="bg-white rounded-3xl border border-[#EDE4DC] p-6 sm:p-10 shadow-xs space-y-8"
      >
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-[#581C47]">Miss Raja</span>
              <span className="text-xs text-stone-400">· Mode &amp; Élégance</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">{settings?.boutique_location || 'باتنة، الجزائر'}</p>
            <p className="text-xs text-stone-500">هاتف: {settings?.phone || '0561 23 45 67'}</p>
          </div>

          <div className="text-start sm:text-end">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400">
              فاتورة طلبية رسمية
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#581C47] mt-0.5">
              #{order.order_number}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1 sm:justify-end">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-DZ' : 'fr-FR')}</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 sm:p-6 bg-[#FAF8F5] rounded-2xl border border-stone-200 text-xs">
          <div>
            <h4 className="font-bold text-stone-800 mb-2 uppercase tracking-wider text-[11px]">
              بيانات الزبونة:
            </h4>
            <p className="font-semibold text-stone-900 text-sm">{order.customer_name}</p>
            <p className="text-stone-600 mt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span dir="ltr">{order.customer_phone}</span>
            </p>
            {order.customer_email && (
              <p className="text-stone-600 mt-0.5">{order.customer_email}</p>
            )}
          </div>

          <div>
            <h4 className="font-bold text-stone-800 mb-2 uppercase tracking-wider text-[11px]">
              عنوان التوصيل:
            </h4>
            <p className="font-semibold text-stone-900">{order.wilaya_name}</p>
            <p className="text-stone-600 mt-1">{order.commune} - {order.address}</p>
            {order.delivery_notes && (
              <p className="text-stone-500 italic mt-1 bg-white p-2 rounded-lg border border-stone-200">
                ملاحظات: {order.delivery_notes}
              </p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                <th className="pb-3 text-start">المنتج والمواصفات</th>
                <th className="pb-3 text-center">المقاس واللون</th>
                <th className="pb-3 text-center">الكمية</th>
                <th className="pb-3 text-end">السعر</th>
                <th className="pb-3 text-end">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50">
                  <td className="py-3.5">
                    <div className="font-semibold text-stone-900">{item.product_name}</div>
                  </td>
                  <td className="py-3.5 text-center font-mono">
                    <span className="bg-stone-100 px-2 py-0.5 rounded-sm">
                      {item.size} / {item.color_name}
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-mono font-medium">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 text-end font-mono tabular-nums">
                    {item.price_at_purchase.toLocaleString()} {t('dzd')}
                  </td>
                  <td className="py-3.5 text-end font-mono font-bold text-[#581C47] tabular-nums">
                    {item.total.toLocaleString()} {t('dzd')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-xs text-stone-500 space-y-1">
            <p>• طريقة الدفع: <strong>الدفع نقداً عند الاستلام (COD)</strong></p>
            <p>• الحالة الحالية: <strong>قيد المراجعة والتأكيد الهاتفي</strong></p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>المجموع الفرعي:</span>
              <span className="font-mono tabular-nums">{order.subtotal.toLocaleString()} {t('dzd')}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>الخصم ({order.coupon_code || 'كوبون'}):</span>
                <span className="font-mono tabular-nums">-{order.discount_amount.toLocaleString()} {t('dzd')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>مصاريف الشحن:</span>
              <span className="font-mono tabular-nums">
                {order.shipping_fee === 0 ? 'مجاني' : `${order.shipping_fee.toLocaleString()} ${t('dzd')}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-300">
              <span>الإجمالي للدفع:</span>
              <span className="font-mono text-[#581C47] text-lg tabular-nums">
                {order.total_amount.toLocaleString()} {t('dzd')}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Guarantee */}
        <div className="pt-6 border-t border-stone-200 text-center text-xs text-stone-400">
          شكراً لتسوقكِ من بوتيك ميس راجا باتنة. نحرص دائماً على تقديم الأفضل لإطلالتك الراقية.
        </div>
      </div>

      {/* Return to shop */}
      <div className="text-center pt-4 no-print">
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          {t('back_home')}
        </button>
      </div>
    </div>
  );
};
