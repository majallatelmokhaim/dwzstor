import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminUser,
  CartItem,
  Category,
  Coupon,
  HomepageCMS,
  Language,
  Order,
  Product,
  StoreSettings
} from '../types';

interface StoreContextType {
  // Localization
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;

  // Data
  products: Product[];
  categories: Category[];
  settings: StoreSettings | null;
  cms: HomepageCMS | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, colorName: string, colorHex: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (productId: string, size: string, colorName: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupon
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCouponCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Navigation
  currentPage: string;
  selectedProductId: string | null;
  selectedCategorySlug: string | null;
  lastPlacedOrder: Order | null;
  navigateTo: (page: string, param?: string | null) => void;
  setLastPlacedOrder: (order: Order | null) => void;

  // Admin Auth
  adminUser: AdminUser | null;
  adminToken: string | null;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  ar: {
    home: 'الرئيسية',
    catalog: 'مجموعاتنا',
    clothing: 'الملابس',
    accessories: 'الإكسسوارات',
    about: 'حول المتجر',
    contact: 'اتصل بنا',
    track_order: 'تتبع طلبيتك',
    cart: 'سلة المشتريات',
    wishlist: 'المفضلة',
    admin_portal: 'لوحة الإدارة',
    shop_now: 'تسوقي الآن',
    new_arrivals: 'وصل حديثاً',
    best_sellers: 'الأكثر طلباً',
    all_categories: 'جميع الفئات',
    filter_by: 'تصفية حسب',
    sort_by: 'ترتيب حسب',
    price_low_high: 'السعر: من الأقل للأعلى',
    price_high_low: 'السعر: من الأعلى للأقل',
    newest: 'الأحدث أولاً',
    in_stock: 'متوفر بالمخزون',
    out_of_stock: 'نفذت الكمية',
    add_to_cart: 'أضيفي للسلة',
    quick_view: 'نظرة سريعة',
    details: 'تفاصيل المنتج',
    size: 'المقاس',
    color: 'اللون',
    quantity: 'الكمية',
    subtotal: 'المجموع الفرعي',
    shipping: 'مصاريف التوصيل',
    total: 'المبلغ الإجمالي',
    checkout: 'إتمام الطلب',
    order_now: 'تأكيد الطلبية الآن',
    free_shipping: 'توصيل مجاني',
    free_shipping_hint: 'شحن مجاني للطلبات فوق 15,000 د.ج',
    coupon_placeholder: 'أدخلي رمز الكوبون',
    apply: 'تطبيق',
    coupon_applied: 'تم تطبيق الخصم',
    customer_info: 'معلومات الزبونة والتوصيل',
    full_name: 'الاسم واللقب',
    phone: 'رقم الهاتف (ضروري للتأكيد)',
    wilaya: 'الولاية (58 ولاية)',
    commune: 'البلدية',
    address: 'العنوان الكامل بدقة',
    notes: 'ملاحظات إضافية للتوصيل',
    cod_badge: 'الدفع نقداً عند استلام الطرد (COD)',
    dzd: 'د.ج',
    secure_checkout: 'طلب آمن وسري 100%',
    order_success_title: 'تهانينا! تم تسجيل طلبيتك بنجاح',
    order_success_desc: 'سيتصل بك فريق ميس راجا هاتفياً لتأكيد المقاسات وتحديد موعد التسليم.',
    track_code: 'رقم التتبع',
    back_home: 'العودة للمتجر',
    print_invoice: 'طباعة الفاتورة',
    search_placeholder: 'ابحثي عن فستان، بليزر، حقيبة...',
    empty_cart: 'سلتك فارغة حالياً',
    empty_cart_sub: 'تصفحي أحدث تشكيلاتنا الفاخرة وأضيفي ما يعجبك.',
    newsletter_title: 'انضمي لنادي ميس راجا الخاص',
    newsletter_sub: 'كوني أول من يكتشف التشكيلات الحصرية وعروض التخفيض الخاصة بأعضائنا.',
    subscribe: 'اشتراك',
    rights_reserved: 'جميع الحقوق محفوظة لبوتيك ميس راجا © 2025/2026',
    batna_algeria: 'باتنة، الجزائر'
  },
  fr: {
    home: 'Accueil',
    catalog: 'Nos Collections',
    clothing: 'Vêtements',
    accessories: 'Accessoires',
    about: 'Notre Maison',
    contact: 'Contact',
    track_order: 'Suivre ma commande',
    cart: 'Panier',
    wishlist: 'Favoris',
    admin_portal: 'Administration',
    shop_now: 'Découvrir',
    new_arrivals: 'Nouveautés',
    best_sellers: 'Meilleures Ventes',
    all_categories: 'Toutes les catégories',
    filter_by: 'Filtrer par',
    sort_by: 'Trier par',
    price_low_high: 'Prix: Croissant',
    price_high_low: 'Prix: Décroissant',
    newest: 'Plus récents',
    in_stock: 'En stock',
    out_of_stock: 'Épuisé',
    add_to_cart: 'Ajouter au panier',
    quick_view: 'Aperçu rapide',
    details: 'Détails du produit',
    size: 'Taille',
    color: 'Couleur',
    quantity: 'Quantité',
    subtotal: 'Sous-total',
    shipping: 'Frais de livraison',
    total: 'Total TTC',
    checkout: 'Valider la commande',
    order_now: 'Commander Maintenant',
    free_shipping: 'Livraison Gratuite',
    free_shipping_hint: 'Livraison gratuite dès 15 000 DZD d\'achats',
    coupon_placeholder: 'Code promo',
    apply: 'Appliquer',
    coupon_applied: 'Réduction appliquée',
    customer_info: 'Informations de livraison',
    full_name: 'Nom & Prénom',
    phone: 'Numéro de téléphone',
    wilaya: 'Wilaya (58 wilayas)',
    commune: 'Commune',
    address: 'Adresse de livraison exacte',
    notes: 'Instructions pour le livreur',
    cod_badge: 'Paiement en espèces à la livraison (COD)',
    dzd: 'DZD',
    secure_checkout: 'Commande 100% sécurisée',
    order_success_title: 'Félicitations ! Commande enregistrée',
    order_success_desc: 'Notre service client vous contactera par téléphone pour confirmer la taille et l\'expédition.',
    track_code: 'Numéro de suivi',
    back_home: 'Retour à la boutique',
    print_invoice: 'Imprimer la facture',
    search_placeholder: 'Rechercher une robe, veste, sac...',
    empty_cart: 'Votre panier est vide',
    empty_cart_sub: 'Découvrez nos créations exclusives et commencez vos achats.',
    newsletter_title: 'Rejoignez le Cercle Privilège Miss Raja',
    newsletter_sub: 'Soyez informée en avant-première de nos collections capsules et ventes privées.',
    subscribe: 'S\'inscrire',
    rights_reserved: 'Tous droits réservés Miss Raja Boutique © 2025/2026',
    batna_algeria: 'Batna, Algérie'
  },
  en: {
    home: 'Home',
    catalog: 'Collections',
    clothing: 'Apparel',
    accessories: 'Accessories',
    about: 'About Us',
    contact: 'Contact',
    track_order: 'Track Order',
    cart: 'Shopping Bag',
    wishlist: 'Wishlist',
    admin_portal: 'Admin Dashboard',
    shop_now: 'Shop Now',
    new_arrivals: 'New Arrivals',
    best_sellers: 'Best Sellers',
    all_categories: 'All Categories',
    filter_by: 'Filter By',
    sort_by: 'Sort By',
    price_low_high: 'Price: Low to High',
    price_high_low: 'Price: High to Low',
    newest: 'Newest Arrivals',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    add_to_cart: 'Add to Bag',
    quick_view: 'Quick View',
    details: 'Product Details',
    size: 'Size',
    color: 'Color',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    shipping: 'Delivery Fee',
    total: 'Grand Total',
    checkout: 'Proceed to Checkout',
    order_now: 'Place Order Now',
    free_shipping: 'Free Shipping',
    free_shipping_hint: 'Free delivery on orders over 15,000 DZD',
    coupon_placeholder: 'Coupon code',
    apply: 'Apply',
    coupon_applied: 'Discount applied',
    customer_info: 'Shipping & Customer Information',
    full_name: 'Full Name',
    phone: 'Phone Number',
    wilaya: 'Wilaya (Province)',
    commune: 'Commune / City',
    address: 'Delivery Address',
    notes: 'Delivery notes (optional)',
    cod_badge: 'Cash on Delivery (COD)',
    dzd: 'DZD',
    secure_checkout: '100% Guaranteed & Safe',
    order_success_title: 'Thank you! Order Confirmed',
    order_success_desc: 'Our boutique team will call you to confirm your measurements and dispatch schedule.',
    track_code: 'Order Number',
    back_home: 'Return to Store',
    print_invoice: 'Print Invoice',
    search_placeholder: 'Search dresses, blazers, bags...',
    empty_cart: 'Your shopping bag is empty',
    empty_cart_sub: 'Explore our latest luxury creations.',
    newsletter_title: 'Join the Miss Raja VIP Circle',
    newsletter_sub: 'Be the first to receive exclusive drops and preview collections.',
    subscribe: 'Subscribe',
    rights_reserved: 'All rights reserved Miss Raja Boutique © 2025/2026',
    batna_algeria: 'Batna, Algeria'
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('mr_lang') as Language) || 'ar';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [cms, setCms] = useState<HomepageCMS | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mr_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Admin Auth
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('mr_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('mr_admin_token') || null;
  });

  const isRTL = lang === 'ar';

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('mr_lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  useEffect(() => {
    localStorage.setItem('mr_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mr_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch initial data from server
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [prodsRes, catsRes, setsRes, cmsRes] = await Promise.all([
        fetch('/api/products?all=true'),
        fetch('/api/categories'),
        fetch('/api/settings'),
        fetch('/api/cms')
      ]);

      const prodsData = await prodsRes.json();
      const catsData = await catsRes.json();
      const setsData = await setsRes.json();
      const cmsData = await cmsRes.json();

      if (prodsData.success) setProducts(prodsData.products);
      if (catsData.success) setCategories(catsData.categories);
      if (setsData.success) setSettings(setsData.settings);
      if (cmsData.success) setCms(cmsData.cms);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['ar'][key] || key;
  };

  // Cart operations
  const addToCart = (
    product: Product,
    size: string,
    colorName: string,
    colorHex: string,
    quantity = 1
  ): boolean => {
    const activePrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;

    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product_id === product.id && item.size === size && item.color_name === colorName
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            product,
            size,
            color_name: colorName,
            color_hex: colorHex,
            quantity,
            price: activePrice
          }
        ];
      }
    });

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (productId: string, size: string, colorName: string) => {
    setCart(prev => prev.filter(
      item => !(item.product_id === productId && item.size === size && item.color_name === colorName)
    ));
  };

  const updateQuantity = (productId: string, size: string, colorName: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product_id === productId && item.size === size && item.color_name === colorName) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Apply Coupon
  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discount);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'تعذر التحقق من الكوبون' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Navigation
  const navigateTo = (page: string, param?: string | null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
    if (page === 'product-detail' && param) {
      setSelectedProductId(param);
    } else if (page === 'catalog') {
      setSelectedCategorySlug(param || null);
    }
  };

  // Quick View
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Admin Auth
  const loginAdmin = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setAdminToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem('mr_admin_token', data.token);
        localStorage.setItem('mr_admin_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'فشل الاتصال بالخادم' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('mr_admin_token');
    localStorage.removeItem('mr_admin_user');
    navigateTo('home');
  };

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        t,
        isRTL,
        products,
        categories,
        settings,
        cms,
        isLoading,
        refreshData,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        discountAmount,
        applyCouponCode,
        removeCoupon,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        currentPage,
        selectedProductId,
        selectedCategorySlug,
        lastPlacedOrder,
        navigateTo,
        setLastPlacedOrder,
        adminUser,
        adminToken,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
