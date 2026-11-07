import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MapPin, Phone, Mail, Truck, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t, categories, settings, navigateTo } = useStore();

  return (
    <footer className="bg-[#260B1C] text-stone-300 pt-12 pb-8 border-t border-[#3E162F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#E6B89C]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Miss Raja
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {settings?.tagline_ar || 'الأناقة عنوانك ... في باتنة ولجميع ربوع الوطن. أرقى فساتين السهرة والأزياء النسائية الفاخرة.'}
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E6B89C] shrink-0" />
                <span>{settings?.boutique_location || 'شارع الجمهورية، باتنة، الجزائر'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E6B89C] shrink-0" />
                <span dir="ltr" className="font-mono">{settings?.phone || '0561 23 45 67'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E6B89C] shrink-0" />
                <span>{settings?.email || 'contact@miss-raja.dz'}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('clothing')} &amp; {t('accessories')}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo('catalog', cat.id)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {lang === 'ar' ? cat.name_ar : lang === 'fr' ? cat.name_fr : cat.name_en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Customer Care & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              خدمة الزبائن
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[#E6B89C]"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t('track_order')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-white transition-colors cursor-pointer text-stone-500 hover:text-stone-300"
                >
                  {t('admin_portal')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Delivery Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              الشحن والدفع
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#E6B89C] shrink-0 mt-0.5" />
                <span>توصيل سريع يشمل جميع ولايات الوطن الـ 58.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E6B89C] shrink-0 mt-0.5" />
                <span>الدفع نقداً عند استلام الطرد ومعاينة المقاس.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>{t('rights_reserved')}</p>
          <div className="flex items-center gap-1">
            <span>صُنع بشغف للأناقة النسائية في باتنة</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
