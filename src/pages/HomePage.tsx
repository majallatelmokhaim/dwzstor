import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/store/ProductCard';
import {
  Truck,
  ShieldCheck,
  Headphones,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Send,
  Instagram
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    lang,
    t,
    isRTL,
    products,
    categories,
    cms,
    settings,
    navigateTo
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const heroSlide = cms?.hero_slides?.[0];
  const promotionalBanners = cms?.promotional_banners || [];

  const newArrivals = products.filter(p => p.is_new).slice(0, 4);
  const bestSellers = products.filter(p => p.is_bestseller).slice(0, 4);
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } catch {
      setNewsletterSuccess(true);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Campaign Banner */}
      <section className="relative overflow-hidden bg-[#38102A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text & CTA */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-start z-10">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#E6B89C] border-b border-[#E6B89C]/40 pb-1">
                {heroSlide?.badge_ar || 'المجموعة الحصرية الجديدة 2025/2026'}
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white">
                {lang === 'ar'
                  ? (heroSlide?.title_ar || 'ميس راجا ... الأناقة عنوانك في باتنة')
                  : (heroSlide?.title_fr || 'Miss Raja - L\'Élégance Sublimée')}
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {lang === 'ar'
                  ? (heroSlide?.subtitle_ar || 'أرقى تشكيلة فساتين سهرة، أطقم رسمية، بليزرات صوف وحقائب يد إيطالية مصممة لتبرز جمالك الملكي.')
                  : (heroSlide?.subtitle_fr || 'Créations exclusives, robes d\'exception et tailleurs chics confectionnés avec une attention minutieuse.')}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigateTo('catalog')}
                  className="px-6 py-3 bg-[#E6B89C] hover:bg-[#d8a486] text-[#360D2A] text-xs sm:text-sm font-bold rounded-full transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{t('shop_now')}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => navigateTo('catalog', 'cat-dresses')}
                  className="px-5 py-3 border border-white/30 hover:border-white text-white text-xs sm:text-sm font-medium rounded-full transition-all"
                >
                  فساتين السهرة (Soirée)
                </button>
              </div>
            </div>

            {/* Campaign Visual Asset */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/9] lg:aspect-[4/3] bg-stone-900">
                <img
                  src={heroSlide?.image || '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'}
                  alt="Miss Raja Boutique Campaign"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 start-4 text-white text-xs font-medium bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                  📍 بوتيك ميس راجا - باتنة (Batna, Algérie)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Circular Category Shortcuts (Inspired by the Boutique Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#581C47]" />
            <h2 className="text-base sm:text-xl font-bold text-stone-900">
              {t('all_categories')}
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs text-[#581C47] hover:underline font-semibold flex items-center gap-1"
          >
            <span>مشاهدة الكل</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateTo('catalog', cat.id)}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#EBE1D8] shadow-2xs hover:shadow-md hover:border-[#581C47] transition-all cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2.5 p-1 bg-[#FAF6F2] group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image || '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'}
                  alt={cat.name_ar}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-xs font-semibold text-stone-800 group-hover:text-[#581C47] line-clamp-1">
                {lang === 'ar' ? cat.name_ar : lang === 'fr' ? cat.name_fr : cat.name_en}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Luxury Trust Badges Strip (Algerian COD + Fast Shipping) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF2F7] border border-[#E9D5E2] rounded-2xl p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#E3CADB]">
          {/* Badge 1 */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0">
            <div className="p-2.5 bg-white rounded-xl shadow-2xs text-[#581C47]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">توصيل سريع لـ 58 ولاية</h4>
              <p className="text-[11px] text-stone-500">من 24 إلى 48 ساعة لباب منزلك</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:ps-6">
            <div className="p-2.5 bg-white rounded-xl shadow-2xs text-[#581C47]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">دفع آمن عند الاستلام</h4>
              <p className="text-[11px] text-stone-500">افحصي طلبك وادفعي نقداً (COD)</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:ps-6">
            <div className="p-2.5 bg-white rounded-xl shadow-2xs text-[#581C47]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">جودة أصلية مضمونة</h4>
              <p className="text-[11px] text-stone-500">أقمشة فاخـرة وتفصيل هوت كوتور</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:ps-6">
            <div className="p-2.5 bg-white rounded-xl shadow-2xs text-[#581C47]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">خدمة زبائن ومتابعة</h4>
              <p className="text-[11px] text-stone-500">فريق ميس راجا رهن إشارتك</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Promotional Banners (2-Column Grid) */}
      {promotionalBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotionalBanners.map((banner) => (
              <div
                key={banner.id}
                onClick={() => navigateTo('catalog')}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.bg_gradient || 'from-[#581C47] to-[#360D2A]'} text-white p-6 sm:p-8 flex items-center justify-between shadow-md group cursor-pointer`}
              >
                <div className="space-y-2 z-10 max-w-[65%]">
                  <span className="text-[11px] uppercase tracking-wider text-[#E6B89C] font-semibold">
                    {lang === 'ar' ? banner.tag_ar : banner.tag_fr}
                  </span>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold leading-snug">
                    {lang === 'ar' ? banner.title_ar : banner.title_fr}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2">
                    {lang === 'ar' ? banner.subtitle_ar : banner.subtitle_fr}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E6B89C] group-hover:text-white transition-colors">
                      <span>اكتشفي التشكيلة</span>
                      {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </div>

                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden shadow-lg border border-white/20 transform group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <img
                    src={banner.image}
                    alt={banner.title_ar}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. New Arrivals (Product Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-[#581C47] font-semibold uppercase tracking-wider">
              {t('new_arrivals')}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              أحدث ما وصل لبوتيك ميس راجا
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs text-[#581C47] hover:underline font-semibold flex items-center gap-1"
          >
            <span>عرض كل التشكيلة</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(newArrivals.length > 0 ? newArrivals : products.slice(0, 4)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-[#93664C] font-semibold uppercase tracking-wider">
              {t('best_sellers')}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              القطع الأكثر طلباً ومحبة من زبوناتنا
            </h2>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs text-[#581C47] hover:underline font-semibold flex items-center gap-1"
          >
            <span>مشاهدة الكل</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(bestSellers.length > 0 ? bestSellers : products.slice(2, 6)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Editorial Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F8F2EC] rounded-3xl p-6 sm:p-10 border border-[#E9D8C9] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-lg border border-white aspect-[4/3]">
            <img
              src="/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png"
              alt="Miss Raja Batna"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#581C47] font-bold">
              دار الأزياء الراقية · عاصمة الأوراس
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              {cms?.editorial_story?.title_ar || 'قصة بوتيك ميس راجا في باتنة'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {cms?.editorial_story?.content_ar ||
                'نحن نؤمن بأن كل امرأة تستحق ارتداء قطع تعكس تميزها وتمنحها ثقة مطلقة. من مدينة باتنة العريقة، نصنع ونختار لك أحدث صيحات الموضة المحتشمة والراقية مع خدمة توصيل تصل إلى باب بيتك في جميع ولايات الجزائر الـ 58.'}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-stone-800">
              <span className="px-3 py-1.5 bg-white rounded-lg border border-stone-200">
                📍 باتنة، شارع الجمهورية
              </span>
              <span className="px-3 py-1.5 bg-white rounded-lg border border-stone-200">
                📞 0561 23 45 67
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Instagram Lookbook Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#581C47] font-semibold uppercase tracking-wider mb-1">
            <Instagram className="w-4 h-4" />
            <span>@MissRajaBoutique</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            شاركينا إطلالتك المميزة مع ميس راجا
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            '/src/assets/images/miss_raja_evening_gown_1794059151940.jpg',
            '/src/assets/images/miss_raja_tailored_blazer_1794059152238.jpg',
            '/src/assets/images/miss_raja_silk_blouse_1794059152549.jpg',
            '/src/assets/images/miss_raja_luxury_handbag_1794059153234.jpg'
          ].map((imgSrc, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden group shadow-2xs cursor-pointer"
              onClick={() => navigateTo('catalog')}
            >
              <img
                src={imgSrc}
                alt="Miss Raja Lookbook"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#581C47]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VIP Newsletter Subscription */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#38102A] text-white rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-xl">
          <span className="text-xs uppercase tracking-widest text-[#E6B89C] font-semibold">
            انضمي لنادي الزبائن المميزين
          </span>
          <h3 className="font-serif text-xl sm:text-3xl font-bold">
            {t('newsletter_title')}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            {t('newsletter_sub')}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2 pt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="أدخلي بريدك الإلكتروني"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#E6B89C]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#E6B89C] hover:bg-[#d8a486] text-[#360D2A] text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              {t('subscribe')}
            </button>
          </form>

          {newsletterSuccess && (
            <p className="text-xs text-emerald-300 flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>شكراً لانضمامك! ستصلك أحدث العروض والتشكيلات الحصرية قريباً.</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
