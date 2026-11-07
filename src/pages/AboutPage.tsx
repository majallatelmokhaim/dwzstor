import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, Award, Clock, Truck, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang, settings, navigateTo } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#581C47] font-bold">
          عاصمة الأوراس · الأصالة والأناقة
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
          بوتيك ميس راجا للأزياء الراقية
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
          وجهتك الأولى في باتنة وعبر ربوع الجزائر للموضة النسائية الفاخرة، فساتين السهرة الكلاسيكية والهوت كوتور، وأطقم البليزرات الرسمية المختارة بعناية لتليق بالمرأة العصرية.
        </p>
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="rounded-3xl overflow-hidden shadow-md aspect-[4/3] bg-stone-100">
          <img
            src="/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png"
            alt="Miss Raja Boutique"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            فلسفة التصميم والإتقان
          </h2>
          <p>
            تأسس بوتيك ميس راجا في قلب مدينة باتنة انطلاقاً من شغف عميق بتفاصيل الخياطة الرفيعة واختيار أنبل الأقمشة من حرير كريب وساتان كوري وصوف طبيعي. نحرص في كل قطعة نوفرها على الجمع بين الحشمة الراقية والتصاميم العالمية الأكثر أناقة.
          </p>
          <p>
            حرصاً على راحة زبوناتنا في جميع أرجاء الجزائر، بنينا منصة تجارة إلكترونية متكاملة تتيح لكِ التسوق بضغطة زر مع خدمة الدفع عند الاستلام (Cash On Delivery) وتوصيل سريع وموثوق إلى جميع الولايات الـ 58.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="px-6 py-2.5 bg-[#581C47] text-white rounded-xl text-xs font-semibold hover:bg-[#431235] transition-colors"
            >
              اكتشفي التشكيلة الآن
            </button>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2 text-center">
          <div className="w-10 h-10 rounded-full bg-[#FAF0F6] text-[#581C47] flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">أقمشة فاخرة</h3>
          <p className="text-xs text-stone-500">خامات مستوردة عالية الجودة مع حياكة وتطريز متقن.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2 text-center">
          <div className="w-10 h-10 rounded-full bg-[#FAF0F6] text-[#581C47] flex items-center justify-center mx-auto mb-3">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">توصيل 58 ولاية</h3>
          <p className="text-xs text-stone-500">تغطية وطنية شاملة حتى باب منزلك مع شركات شحن رائدة.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2 text-center">
          <div className="w-10 h-10 rounded-full bg-[#FAF0F6] text-[#581C47] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">ثقة وأمان</h3>
          <p className="text-xs text-stone-500">الدفع نقداً بعد المعاينة مع إمكانية استبدال المقاس.</p>
        </div>
      </div>
    </div>
  );
};
