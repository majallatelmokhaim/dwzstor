import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AdminUser,
  AdminActivityLog,
  Category,
  Coupon,
  HomepageCMS,
  Order,
  OrderItem,
  OrderStatus,
  OrderStatusHistoryItem,
  Product,
  ProductVariant,
  StoreSettings
} from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../../data/database.json');

export interface DatabaseSchema {
  users: (AdminUser & { password_hash: string })[];
  roles: { id: string; name: string; description: string; permissions: string[] }[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  store_settings: StoreSettings;
  homepage_cms: HomepageCMS;
  newsletter_subscribers: { id: string; email: string; subscribed_at: string }[];
  admin_activity_logs: AdminActivityLog[];
}

// Initial seed data
const getInitialSeed = (): DatabaseSchema => {
  const now = new Date().toISOString();

  const categories: Category[] = [
    {
      id: 'cat-dresses',
      name_ar: 'الفساتين الراقية',
      name_fr: 'Robes & Kaftans',
      name_en: 'Dresses & Kaftans',
      slug: 'dresses',
      image: '/src/assets/images/miss_raja_evening_gown_1794059151940.jpg',
      display_order: 1,
      is_active: true
    },
    {
      id: 'cat-blouses',
      name_ar: 'البلوزات والقمصان',
      name_fr: 'Chemisiers & Tops',
      name_en: 'Blouses & Tops',
      slug: 'blouses',
      image: '/src/assets/images/miss_raja_silk_blouse_1794059152549.jpg',
      display_order: 2,
      is_active: true
    },
    {
      id: 'cat-jackets',
      name_ar: 'الجاكيتات والمعاطف',
      name_fr: 'Vestes & Manteaux',
      name_en: 'Jackets & Blazers',
      slug: 'jackets',
      image: '/src/assets/images/miss_raja_tailored_blazer_1794059152238.jpg',
      display_order: 3,
      is_active: true
    },
    {
      id: 'cat-bags',
      name_ar: 'الإكسسوارات والحقائب',
      name_fr: 'Sacs & Accessoires',
      name_en: 'Bags & Accessories',
      slug: 'accessories',
      image: '/src/assets/images/miss_raja_luxury_handbag_1794059153234.jpg',
      display_order: 4,
      is_active: true
    },
    {
      id: 'cat-pants',
      name_ar: 'البناطيل والجينز',
      name_fr: 'Pantalons & Jeans',
      name_en: 'Pants & Trousers',
      slug: 'pants',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
      display_order: 5,
      is_active: true
    },
    {
      id: 'cat-skirts',
      name_ar: 'التنانير الأنيقة',
      name_fr: 'Jupes Élégantes',
      name_en: 'Skirts',
      slug: 'skirts',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80',
      display_order: 6,
      is_active: true
    }
  ];

  const products: Product[] = [
    {
      id: 'prod-001',
      sku: 'MR-DRS-001',
      name_ar: 'فستان السهرة الملكي من الساتان الزمردي والمخمل المطرز',
      name_fr: 'Robe de Soirée Émeraude Haute Couture',
      name_en: 'Royal Emerald Satin & Velvet Evening Gown',
      slug: 'robe-soiree-emeraude-haute-couture',
      description_ar: 'تصميم ملكي فاخر يجمع بين الساتان الحريري الفاخر والمخمل الملكي، مع تطريز يدوي بخيوط القصب الذهبية العريقة. مثالي للأفراح والمناسبات الفخمة في باتنة وجميع أنحاء الجزائر.',
      description_fr: 'Création haute couture associant satin de soie impérial et velours de luxe, brodé à la main aux fils d\'or. Élégance intemporelle pour vos grandes réceptions.',
      description_en: 'Exquisite haute couture evening gown in emerald silk satin and embroidered velvet with handcrafted golden thread work.',
      category_id: 'cat-dresses',
      price: 24500,
      discount_price: 21900,
      is_featured: true,
      is_new: true,
      is_bestseller: true,
      is_published: true,
      images: [
        '/src/assets/images/miss_raja_evening_gown_1794059151940.jpg',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['38', '40', '42', '44'],
      colors: [
        { name: 'أخضر زمردي / Émeraude', hex: '#0B4D3C' },
        { name: 'عنابي ملكي / Pourpre', hex: '#581C47' }
      ],
      variants: [
        { id: 'v-001-1', size: '38', color_name: 'أخضر زمردي', color_hex: '#0B4D3C', stock: 5, sku: 'MR-DRS-001-38-EM' },
        { id: 'v-001-2', size: '40', color_name: 'أخضر زمردي', color_hex: '#0B4D3C', stock: 4, sku: 'MR-DRS-001-40-EM' },
        { id: 'v-001-3', size: '42', color_name: 'أخضر زمردي', color_hex: '#0B4D3C', stock: 3, sku: 'MR-DRS-001-42-EM' },
        { id: 'v-001-4', size: '44', color_name: 'أخضر زمردي', color_hex: '#0B4D3C', stock: 2, sku: 'MR-DRS-001-44-EM' }
      ],
      material: 'ساتان حريري كوري أصلي ومخمل إيطالي 100%',
      care_instructions: 'تنظيف جاف فقط (Dry Clean Only) للحفاظ على التطريز الذهبي الفاخر.',
      created_at: now,
      updated_at: now
    },
    {
      id: 'prod-002',
      sku: 'MR-BLZ-002',
      name_ar: 'بليزر كلاسيكي صوف كاميل بأزرار ذهبية ملكية',
      name_fr: 'Blazer Tailleur Camel en Laine & Boutons Dorés',
      name_en: 'Tailored Camel Wool Double-Breasted Blazer',
      slug: 'blazer-tailleur-camel-laine',
      description_ar: 'جاكيت بليزر بقصة راقية ومزدوجة الأزرار من الصوف الطبيعي الناعم بلون الكاميل الأنيق، مع أزرار ذهبية منقوشة. قطعة أساسية لكل إطلالة عمل أو مناسبة راقية.',
      description_fr: 'Blazer croisé structuré confectionné en drap de laine camel noble, rehaussé de boutons gravés dorés. Coupe impeccable et tombé structuré.',
      description_en: 'Structured double-breasted camel wool blazer with embossed gold buttons. The epitome of modern tailored luxury.',
      category_id: 'cat-jackets',
      price: 16800,
      discount_price: 14900,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
      is_published: true,
      images: [
        '/src/assets/images/miss_raja_tailored_blazer_1794059152238.jpg',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['36', '38', '40', '42'],
      colors: [
        { name: 'كاميل بيج / Camel', hex: '#C29B72' },
        { name: 'أسود ملكي / Noir', hex: '#1C1C1C' }
      ],
      variants: [
        { id: 'v-002-1', size: '36', color_name: 'كاميل بيج', color_hex: '#C29B72', stock: 6, sku: 'MR-BLZ-002-36-CA' },
        { id: 'v-002-2', size: '38', color_name: 'كاميل بيج', color_hex: '#C29B72', stock: 8, sku: 'MR-BLZ-002-38-CA' },
        { id: 'v-002-3', size: '40', color_name: 'كاميل بيج', color_hex: '#C29B72', stock: 4, sku: 'MR-BLZ-002-40-CA' },
        { id: 'v-002-4', size: '42', color_name: 'كاميل بيج', color_hex: '#C29B72', stock: 3, sku: 'MR-BLZ-002-42-CA' }
      ],
      material: 'صوف كشمير مخلوط وفيسكوز عالي الجودة',
      care_instructions: 'تنظيف جاف، كي بالبخار بدرجة حرارة معتدلة.',
      created_at: now,
      updated_at: now
    },
    {
      id: 'prod-003',
      sku: 'MR-BLS-003',
      name_ar: 'بلوزة حرير كريب روز بودرة بياقة بليسيه كلاسيكية',
      name_fr: 'Chemisier en Soie Crêpe Rose Poudré & Col Plissé',
      name_en: 'Dusty Rose Pleated Collar Silk Crepe Blouse',
      slug: 'chemisier-soie-rose-poudre-col-plisse',
      description_ar: 'بلوزة حريرية ناعمة بلون الروز بودر الأثري، تتميز بياقة بليسيه مطوية بعناية وربطة عنق متدلية. نسيج خفيف ومريح يضفي لمسة من الأنوثة الراقية.',
      description_fr: 'Blouse vaporeuse en crêpe de soie rose poudré délicat, ornée d\'un col plissé soleil raffiné et liens lavallière.',
      description_en: 'Ultra-feminine pleated collar silk blouse in vintage dusty rose with soft fluid drape.',
      category_id: 'cat-blouses',
      price: 11500,
      discount_price: 9800,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
      is_published: true,
      images: [
        '/src/assets/images/miss_raja_silk_blouse_1794059152549.jpg',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'روز بودرة / Rose Poudré', hex: '#C89F9B' },
        { name: 'أبيض عاجي / Blanc Crème', hex: '#FDFBF7' }
      ],
      variants: [
        { id: 'v-003-1', size: 'S', color_name: 'روز بودرة', color_hex: '#C89F9B', stock: 7, sku: 'MR-BLS-003-S-RP' },
        { id: 'v-003-2', size: 'M', color_name: 'روز بودرة', color_hex: '#C89F9B', stock: 9, sku: 'MR-BLS-003-M-RP' },
        { id: 'v-003-3', size: 'L', color_name: 'روز بودرة', color_hex: '#C89F9B', stock: 5, sku: 'MR-BLS-003-L-RP' },
        { id: 'v-003-4', size: 'XL', color_name: 'روز بودرة', color_hex: '#C89F9B', stock: 2, sku: 'MR-BLS-003-XL-RP' }
      ],
      material: 'حرير كريب طبيعي 100%',
      care_instructions: 'غسيل يدوي بماء بارد ومنظف الحرير، أو تنظيف جاف.',
      created_at: now,
      updated_at: now
    },
    {
      id: 'prod-004',
      sku: 'MR-BAG-004',
      name_ar: 'حقيبة يد ملكية ميس راجا من الجلد الإيطالي الفاخر بلون البورغندي',
      name_fr: 'Sac à Main Haute Maroquinerie Cuir Prune & Chaîne Dorée',
      name_en: 'Miss Raja Signature Plum Leather Handbag with Gold Hardware',
      slug: 'sac-main-cuir-prune-chaine-doree',
      description_ar: 'الحقيبة الأيقونية لبوتيك ميس راجا باتنة مصنوعة يدوياً من الجلد الطبيعي المحبب بلون البرقوق الملكي، مع قفل ذهبي منقوش وسلسلة قابلة للتعديل.',
      description_fr: 'Pièce emblématique Miss Raja Batna en cuir grainé pleine fleur teinte prune royale, fermoir pivotant doré et bandoulière chaîne.',
      description_en: 'Iconic structured handbag in full-grain plum leather with gleaming gold turn-lock closure and versatile chain strap.',
      category_id: 'cat-bags',
      price: 18500,
      discount_price: null,
      is_featured: true,
      is_new: true,
      is_bestseller: true,
      is_published: true,
      images: [
        '/src/assets/images/miss_raja_luxury_handbag_1794059153234.jpg'
      ],
      sizes: ['One Size (قياس موحد)'],
      colors: [
        { name: 'برقوقي ملكي / Pourpre Prune', hex: '#581C47' },
        { name: 'أسود كافيار / Noir Caviar', hex: '#111111' }
      ],
      variants: [
        { id: 'v-004-1', size: 'One Size', color_name: 'برقوقي ملكي', color_hex: '#581C47', stock: 5, sku: 'MR-BAG-004-OS-PR' },
        { id: 'v-004-2', size: 'One Size', color_name: 'أسود كافيار', color_hex: '#111111', stock: 4, sku: 'MR-BAG-004-OS-BK' }
      ],
      material: 'جلد بقري طبيعي 100% مستورد من إيطاليا',
      care_instructions: 'مسح بقطعة قماش ناعمة وجافة، وتجنب التعرض المباشر للماء.',
      created_at: now,
      updated_at: now
    },
    {
      id: 'prod-005',
      sku: 'MR-SKT-005',
      name_ar: 'تنورة بليسيه ماكسي كلاسيكية من الساتان الفاخر بلون الشمبانيا',
      name_fr: 'Jupe Plissée Maxi Satin Champagne Élégante',
      name_en: 'Champagne Satin Pleated Maxi Skirt',
      slug: 'jupe-plissee-maxi-satin-champagne',
      description_ar: 'تنورة بليسيه طويلة وواسعة بانسيابية ساحرة، بحزام خصر مطاطي أنيق وتفاصيل ناعمة تناسب الإطلالات اليومية الراقية والمناسبات.',
      description_fr: 'Jupe longue plissée soleil en satin fluide reflets champagne, taille élastiquée haute pour une allure gracieuse.',
      description_en: 'Flowing pleated maxi skirt in lustrous champagne satin with a comfortable high waist.',
      category_id: 'cat-skirts',
      price: 9500,
      discount_price: 8200,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
      is_published: true,
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['38', '40', '42'],
      colors: [
        { name: 'شمبانيا / Champagne', hex: '#EED9C4' },
        { name: 'عنابي / Bordeaux', hex: '#5B1B4A' }
      ],
      variants: [
        { id: 'v-005-1', size: '38', color_name: 'شمبانيا', color_hex: '#EED9C4', stock: 6, sku: 'MR-SKT-005-38-CH' },
        { id: 'v-005-2', size: '40', color_name: 'شمبانيا', color_hex: '#EED9C4', stock: 5, sku: 'MR-SKT-005-40-CH' },
        { id: 'v-005-3', size: '42', color_name: 'شمبانيا', color_hex: '#EED9C4', stock: 3, sku: 'MR-SKT-005-42-CH' }
      ],
      material: 'ساتان بوليستر تركي ممتاز عالي الجودة',
      care_instructions: 'غسيل رقيق 30 درجة، تجنب العصر الشديد للحفاظ على طيات البليسيه.',
      created_at: now,
      updated_at: now
    },
    {
      id: 'prod-006',
      sku: 'MR-PNT-006',
      name_ar: 'بنطال قماشي رسمي بخصر عالي وقصة مستقيمة واسعة',
      name_fr: 'Pantalon Tailleur Palazzo Taille Haute Écru',
      name_en: 'High-Waisted Tailored Palazzo Trousers',
      slug: 'pantalon-tailleur-palazzo-taille-haute',
      description_ar: 'بنطال رسمي أنيق بقصة قصر القامة المريحة (Palazzo)، خصر مرتفع مع طيات أمامية دقيقة، يمنح قواماً ممشوقاً وأناقة فورية.',
      description_fr: 'Pantalon ample coupe palazzo chic, taille haute ceinturée et pinces élégantes, confectionné dans un sergé fluide infroissable.',
      description_en: 'Sophisticated wide-leg palazzo trousers with crisp front pleats and tailored high waist.',
      category_id: 'cat-pants',
      price: 8800,
      discount_price: null,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
      is_published: true,
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['36', '38', '40', '42'],
      colors: [
        { name: 'عاجي / Écru', hex: '#F5F2EB' },
        { name: 'أسود كلاسيكي / Noir', hex: '#1C1C1C' }
      ],
      variants: [
        { id: 'v-006-1', size: '36', color_name: 'عاجي', color_hex: '#F5F2EB', stock: 4, sku: 'MR-PNT-006-36-EC' },
        { id: 'v-006-2', size: '38', color_name: 'عاجي', color_hex: '#F5F2EB', stock: 7, sku: 'MR-PNT-006-38-EC' },
        { id: 'v-006-3', size: '40', color_name: 'عاجي', color_hex: '#F5F2EB', stock: 5, sku: 'MR-PNT-006-40-EC' }
      ],
      material: 'كريب غاباردين ناعم غير قابل للتجعد',
      care_instructions: 'غسيل آلي ببرنامج خفيف 30°، كي خفيف.',
      created_at: now,
      updated_at: now
    }
  ];

  const orders: Order[] = [
    {
      id: 'ord-1001',
      order_number: 'MR-2508',
      customer_name: 'أمينة بن علي',
      customer_phone: '0661 45 88 12',
      customer_email: 'amina.benali@gmail.com',
      wilaya_code: '05',
      wilaya_name: 'باتنة (المقر الرئيسي)',
      commune: 'باتنة وسط',
      address: 'حي بوزوران، عمارة 14 شقة 03',
      delivery_notes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
      items: [
        {
          id: 'item-1',
          product_id: 'prod-001',
          product_name: 'فستان السهرة الملكي من الساتان الزمردي والمخمل المطرز',
          product_image: '/src/assets/images/miss_raja_evening_gown_1794059151940.jpg',
          price_at_purchase: 21900,
          size: '40',
          color_name: 'أخضر زمردي',
          color_hex: '#0B4D3C',
          quantity: 1,
          total: 21900
        }
      ],
      subtotal: 21900,
      shipping_fee: 0, // Free shipping because subtotal >= 15000
      discount_amount: 0,
      total_amount: 21900,
      payment_method: 'COD',
      status: 'shipped',
      status_history: [
        {
          id: 'sh-1',
          order_id: 'ord-1001',
          previous_status: null,
          new_status: 'pending',
          changed_by: 'النظام الآلي / Client Web',
          notes: 'تم تسجيل الطلب بنجاح عبر المتجر',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
        },
        {
          id: 'sh-2',
          order_id: 'ord-1001',
          previous_status: 'pending',
          new_status: 'confirmed',
          changed_by: 'مدير الطلبيات (Order Manager)',
          notes: 'تم تأكيد الطلب هاتفياً مع الزبونة',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'sh-3',
          order_id: 'ord-1001',
          previous_status: 'confirmed',
          new_status: 'shipped',
          changed_by: 'مدير الطلبيات',
          notes: 'تم تسليم الطرد لشركة التوصيل Yalidine Express',
          timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
        }
      ],
      internal_notes: 'زبونة وفية، تم إرفاق هدية عينة عطر ميس راجا مع الطلب.',
      created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
    },
    {
      id: 'ord-1002',
      order_number: 'MR-2509',
      customer_name: 'سارة مرابطي',
      customer_phone: '0550 12 34 56',
      customer_email: 'sarah.mrb@hotmail.com',
      wilaya_code: '16',
      wilaya_name: 'الجزائر العاصمة',
      commune: 'سيدي يحيى، حيدرة',
      address: 'إقامة النرجس، مدخل B رقم 12',
      delivery_notes: 'الدفع نقداً عند الاستلام',
      items: [
        {
          id: 'item-2',
          product_id: 'prod-002',
          product_name: 'بليزر كلاسيكي صوف كاميل بأزرار ذهبية ملكية',
          product_image: '/src/assets/images/miss_raja_tailored_blazer_1794059152238.jpg',
          price_at_purchase: 14900,
          size: '38',
          color_name: 'كاميل بيج',
          color_hex: '#C29B72',
          quantity: 1,
          total: 14900
        }
      ],
      subtotal: 14900,
      shipping_fee: 600,
      discount_amount: 1490, // Coupon WELCOME10 applied
      coupon_code: 'WELCOME10',
      total_amount: 14010,
      payment_method: 'COD',
      status: 'confirmed',
      status_history: [
        {
          id: 'sh-4',
          order_id: 'ord-1002',
          previous_status: null,
          new_status: 'pending',
          changed_by: 'النظام الآلي / Client Web',
          notes: 'تم تقديم الطلب مع قسيمة WELCOME10',
          timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
        },
        {
          id: 'sh-5',
          order_id: 'ord-1002',
          previous_status: 'pending',
          new_status: 'confirmed',
          changed_by: 'فاطمة الزهراء (مكلفة التأكيد)',
          notes: 'تم التحقق من المقاس ورقم الهاتف شغال',
          timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
        }
      ],
      created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    {
      id: 'ord-1003',
      order_number: 'MR-2510',
      customer_name: 'ياسمين خضراوي',
      customer_phone: '0770 99 88 77',
      customer_email: 'yasmine.kh@gmail.com',
      wilaya_code: '25',
      wilaya_name: 'قسنطينة',
      commune: 'علي منجلي',
      address: 'الوحدة الجوارية 07 بجانب المركز التجاري رتاج مول',
      delivery_notes: '',
      items: [
        {
          id: 'item-3',
          product_id: 'prod-004',
          product_name: 'حقيبة يد ملكية ميس راجا من الجلد الإيطالي الفاخر',
          product_image: '/src/assets/images/miss_raja_luxury_handbag_1794059153234.jpg',
          price_at_purchase: 18500,
          size: 'One Size',
          color_name: 'برقوقي ملكي',
          color_hex: '#581C47',
          quantity: 1,
          total: 18500
        }
      ],
      subtotal: 18500,
      shipping_fee: 0, // Free shipping
      discount_amount: 0,
      total_amount: 18500,
      payment_method: 'COD',
      status: 'pending',
      status_history: [
        {
          id: 'sh-6',
          order_id: 'ord-1003',
          previous_status: null,
          new_status: 'pending',
          changed_by: 'النظام الآلي / Client Web',
          notes: 'طلب جديد بانتظار التأكيد الهاتفي',
          timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
        }
      ],
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    }
  ];

  const coupons: Coupon[] = [
    {
      id: 'coup-1',
      code: 'WELCOME10',
      discount_type: 'percentage',
      value: 10,
      min_order_amount: 5000,
      is_active: true,
      uses_count: 14,
      max_uses: 100
    },
    {
      id: 'coup-2',
      code: 'BATNA2025',
      discount_type: 'fixed',
      value: 2000, // 2000 DZD discount
      min_order_amount: 15000,
      is_active: true,
      uses_count: 8,
      max_uses: 50
    }
  ];

  const store_settings: StoreSettings = {
    store_name_ar: 'ميس راجا - بوتيك الأزياء الراقية',
    store_name_fr: 'Miss Raja - Mode & Élégance',
    tagline_ar: 'الأناقة عنوانك ... في باتنة ولجميع ربوع الوطن',
    tagline_fr: 'L\'élégance sublimée au cœur de Batna & livraison 58 wilayas',
    boutique_location: 'شارع الجمهورية، باتنة، الجزائر (Batna Centre)',
    phone: '0561 23 45 67',
    email: 'contact@miss-raja.dz',
    currency: 'د.ج', // DZD
    free_shipping_threshold: 15000,
    default_shipping_fee: 600,
    wilaya_shipping_fees: {
      '05': 350, // Batna special local rate
      '16': 600,
      '25': 500,
      '31': 700
    },
    social_links: {
      facebook: 'https://facebook.com/missrajabatna',
      instagram: 'https://instagram.com/missrajaboutique',
      tiktok: 'https://tiktok.com/@missraja_dz',
      youtube: 'https://youtube.com/@missraja_mode'
    },
    policy_shipping_ar: 'نوفر التوصيل السريع إلى باب منزلك أو المكتب لجميع الـ 58 ولاية جزائرية خلال 24 إلى 48 ساعة للشمال و 3 إلى 5 أيام لولايات الجنوب الكبير مع خدمة الدفع عند الاستلام (COD). الشحن مجاني لجميع الطلبات بقيمة 15,000 د.ج فما فوق.',
    policy_shipping_fr: 'Livraison express à domicile ou en point relais dans les 58 wilayas d\'Algérie sous 24h à 48h (3 à 5 jours pour le Grand Sud) avec paiement à la livraison (COD). Livraison offerte dès 15 000 DZD d\'achats.',
    policy_return_ar: 'يحق لزبائننا الكرام معاينة واستبدال المقاس أو المنتج خلال 7 أيام من تاريخ الاستلام شريطة أن تكون القطعة في حالتها الأصلية وببطاقتها السعرية.',
    policy_return_fr: 'Échange de taille ou remboursement sous 7 jours ouvrés après réception, article neuf dans son emballage avec étiquette d\'origine intacte.',
    policy_terms_ar: 'جميع الأسعار المعروضة هي بالدينار الجزائري (DZD). يتم تأكيد كل طلبية هاتفياً مع الزبونة قبل خروج الطرد مع مندوب التوصيل.',
    policy_terms_fr: 'Tous les prix sont en Dinars Algériens (DZD). Chaque commande est vérifiée par téléphone avant expédition.'
  };

  const homepage_cms: HomepageCMS = {
    hero_slides: [
      {
        id: 'slide-1',
        title_ar: 'ميس راجا ... الأناقة عنوانك في باتنة',
        title_fr: 'Miss Raja - L\'incarnation du Raffinement',
        subtitle_ar: 'تشكيلة خريف وشتاء 2025/2026 الحصرية، فساتين وبليزرات مصممة بأعلى معايير الهوت كوتور',
        subtitle_fr: 'Collection Automne/Hiver exclusive, pièces de maître taillées dans les matières les plus nobles',
        button_text_ar: 'تسوقي الآن',
        button_text_fr: 'Découvrir la Collection',
        link: '#catalog',
        image: '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png',
        badge_ar: 'المجموعة الحصرية الجديدة',
        badge_fr: 'Nouvelle Collection',
        is_active: true
      }
    ],
    promotional_banners: [
      {
        id: 'promo-1',
        title_ar: 'عروض خاصة لفترة محدودة',
        title_fr: 'Offres Privilèges',
        subtitle_ar: 'تخفيضات تصل إلى 30% على فساتين السهرة المختارة',
        subtitle_fr: 'Jusqu\'à -30% sur une sélection de robes d\'exception',
        tag_ar: 'تخفيض حصري',
        tag_fr: 'Édition Limitée',
        image: '/src/assets/images/miss_raja_evening_gown_1794059151940.jpg',
        link: '#catalog',
        bg_gradient: 'from-[#581C47] to-[#360D2A]'
      },
      {
        id: 'promo-2',
        title_ar: 'حقائب وأكسسوارات ميس راجا',
        title_fr: 'Haute Maroquinerie',
        subtitle_ar: 'جلد إيطالي طبيعي ولمسات معدنية مذهبة لإطلالة متكاملة',
        subtitle_fr: 'Sacs en cuir véritable confectionnés avec passion',
        tag_ar: 'تصميم أيقوني',
        tag_fr: 'Signature',
        image: '/src/assets/images/miss_raja_luxury_handbag_1794059153234.jpg',
        link: '#catalog',
        bg_gradient: 'from-[#2B1B26] to-[#140B13]'
      }
    ],
    announcement_ar: '✨ توصيل متوفر لجميع 58 ولاية الوطن | دفع آمن عند الاستلام (COD) | شحن مجاني للطلبات فوق 15,000 د.ج',
    announcement_fr: '✨ Livraison disponible dans les 58 Wilayas | Paiement à la livraison | Livraison gratuite dès 15 000 DZD',
    announcement_active: true,
    editorial_story: {
      title_ar: 'عن بوتيك ميس راجا - باتنة',
      title_fr: 'L\'Atelier Miss Raja à Batna',
      content_ar: 'من قلب عاصمة الأوراس الأبية باتنة، وُلد بوتيك ميس راجا ليعيد تعريف الأناقة النسائية المعاصرة. نجمع بين عراقة التراث وجماليات الموضة العالمية، منتقين أرقى الأقمشة والتطريزات لتشعر كل امرأة جزائرية بالفخامة والتميز.',
      content_fr: 'Au cœur de Batna, Miss Raja s\'impose comme la référence de la mode féminine haut de gamme. Chaque pièce est sélectionnée avec une rigueur absolue pour sublimer votre allure.',
      image: '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'
    },
    instagram_gallery: [
      '/src/assets/images/miss_raja_evening_gown_1794059151940.jpg',
      '/src/assets/images/miss_raja_tailored_blazer_1794059152238.jpg',
      '/src/assets/images/miss_raja_silk_blouse_1794059152549.jpg',
      '/src/assets/images/miss_raja_luxury_handbag_1794059153234.jpg'
    ]
  };

  const users: (AdminUser & { password_hash: string })[] = [
    {
      id: 'usr-admin-1',
      username: 'admin',
      full_name: 'رجاء بوزيان (Super Admin)',
      email: 'admin@miss-raja.dz',
      role: 'super_admin',
      is_active: true,
      password_hash: 'MissRaja2025!', // Initial secure admin password
      created_at: now
    },
    {
      id: 'usr-admin-2',
      username: 'products_mgr',
      full_name: 'ليليا مسعودي (Product Manager)',
      email: 'lilia.products@miss-raja.dz',
      role: 'product_manager',
      is_active: true,
      password_hash: 'Products2025!',
      created_at: now
    },
    {
      id: 'usr-admin-3',
      username: 'orders_mgr',
      full_name: 'طارق حداد (Order Manager)',
      email: 'tarek.orders@miss-raja.dz',
      role: 'order_manager',
      is_active: true,
      password_hash: 'Orders2025!',
      created_at: now
    }
  ];

  const roles = [
    {
      id: 'role-super',
      name: 'Super Admin',
      description: 'صلاحيات كاملة غير محدودة لإدارة المتجر والموظفين والإعدادات والمبيعات',
      permissions: ['*']
    },
    {
      id: 'role-prod',
      name: 'Product Manager',
      description: 'إدارة المنتجات، الأصناف، المخزون، الأسعار والعروض',
      permissions: ['products:read', 'products:write', 'categories:read', 'categories:write', 'inventory:write']
    },
    {
      id: 'role-order',
      name: 'Order Manager',
      description: 'معالجة وتأكيد الطلبات، متابعة الشحن، تحديث الحالات وطباعة الفواتير',
      permissions: ['orders:read', 'orders:write', 'orders:invoice']
    },
    {
      id: 'role-content',
      name: 'Content Manager',
      description: 'تعديل بنرات الصفحة الرئيسية، الإعلانات، القصص التحريرية، والسياسات',
      permissions: ['cms:read', 'cms:write']
    }
  ];

  const admin_activity_logs: AdminActivityLog[] = [
    {
      id: 'log-1',
      admin_id: 'usr-admin-1',
      admin_name: 'رجاء بوزيان (Super Admin)',
      action: 'SYSTEM_INITIALIZED',
      details: 'تهيئة قاعدة بيانات متجر ميس راجا باتنة مع تفعيل المنتجات وتوصيل 58 ولاية',
      timestamp: now
    }
  ];

  return {
    users,
    roles,
    categories,
    products,
    orders,
    coupons,
    store_settings,
    homepage_cms,
    newsletter_subscribers: [
      { id: 'sub-1', email: 'client.vip@gmail.com', subscribed_at: now }
    ],
    admin_activity_logs
  };
};

// Database class with ACID-like atomic writes
class JsonDatabase {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.orders && parsed.categories) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading database, regenerating initial seed:', err);
    }
    const seed = getInitialSeed();
    this.persist(seed);
    return seed;
  }

  private persist(data: DatabaseSchema) {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save() {
    this.persist(this.data);
  }

  // Getters
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id || p.slug === id);
  }

  public getCategories(): Category[] {
    return this.data.categories.sort((a, b) => a.display_order - b.display_order);
  }

  public getOrders(): Order[] {
    return this.data.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.order_number === id);
  }

  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public getStoreSettings(): StoreSettings {
    return this.data.store_settings;
  }

  public getHomepageCMS(): HomepageCMS {
    return this.data.homepage_cms;
  }

  public getUsers(): (AdminUser & { password_hash: string })[] {
    return this.data.users;
  }

  public getActivityLogs(): AdminActivityLog[] {
    return this.data.admin_activity_logs.slice(-100).reverse();
  }

  // Mutations
  public addActivityLog(adminId: string, adminName: string, action: string, details: string) {
    const log: AdminActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      admin_id: adminId,
      admin_name: adminName,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.admin_activity_logs.push(log);
    this.save();
    return log;
  }

  public createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>, adminUser: AdminUser): Product {
    const now = new Date().toISOString();
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      created_at: now,
      updated_at: now
    };
    this.data.products.unshift(newProduct);
    this.addActivityLog(adminUser.id, adminUser.full_name, 'CREATE_PRODUCT', `إضافة منتج جديد: ${newProduct.name_ar} (${newProduct.sku})`);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>, adminUser: AdminUser): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated: Product = {
      ...this.data.products[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.data.products[index] = updated;
    this.addActivityLog(adminUser.id, adminUser.full_name, 'UPDATE_PRODUCT', `تعديل المنتج: ${updated.name_ar} (${updated.sku})`);
    this.save();
    return updated;
  }

  public deleteProduct(id: string, adminUser: AdminUser): boolean {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    const prod = this.data.products[index];
    this.data.products.splice(index, 1);
    this.addActivityLog(adminUser.id, adminUser.full_name, 'DELETE_PRODUCT', `حذف المنتج: ${prod.name_ar} (${prod.sku})`);
    this.save();
    return true;
  }

  public duplicateProduct(id: string, adminUser: AdminUser): Product | null {
    const original = this.getProductById(id);
    if (!original) return null;
    const now = new Date().toISOString();
    const newId = `prod-${Date.now()}`;
    const copy: Product = {
      ...original,
      id: newId,
      sku: `${original.sku}-COPY`,
      name_ar: `${original.name_ar} (نسخة)`,
      name_fr: `${original.name_fr} (Copie)`,
      name_en: `${original.name_en} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    this.data.products.unshift(copy);
    this.addActivityLog(adminUser.id, adminUser.full_name, 'DUPLICATE_PRODUCT', `نسخ المنتج ${original.name_ar} إلى ${copy.name_ar}`);
    this.save();
    return copy;
  }

  // Categories
  public saveCategory(category: Category, adminUser: AdminUser): Category {
    const index = this.data.categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      this.data.categories[index] = category;
      this.addActivityLog(adminUser.id, adminUser.full_name, 'UPDATE_CATEGORY', `تعديل قسم: ${category.name_ar}`);
    } else {
      this.data.categories.push(category);
      this.addActivityLog(adminUser.id, adminUser.full_name, 'CREATE_CATEGORY', `إضافة قسم جديد: ${category.name_ar}`);
    }
    this.save();
    return category;
  }

  public deleteCategory(id: string, adminUser: AdminUser): boolean {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    const cat = this.data.categories[index];
    this.data.categories.splice(index, 1);
    this.addActivityLog(adminUser.id, adminUser.full_name, 'DELETE_CATEGORY', `حذف قسم: ${cat.name_ar}`);
    this.save();
    return true;
  }

  // Order Placement & Inventory Transactions (ACID Server Guarantee)
  public createOrder(orderPayload: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    wilaya_code: string;
    wilaya_name: string;
    commune: string;
    address: string;
    delivery_notes?: string;
    items: { product_id: string; size: string; color_name: string; color_hex: string; quantity: number }[];
    coupon_code?: string;
  }): { success: boolean; order?: Order; error?: string } {
    if (!orderPayload.items || orderPayload.items.length === 0) {
      return { success: false, error: 'سلة المشتريات فارغة.' };
    }

    // 1. Validate items and calculate prices strictly on the server
    const orderItems: OrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const itemReq of orderPayload.items) {
      const product = this.getProductById(itemReq.product_id);
      if (!product) {
        return { success: false, error: `المنتج غير موجود: ${itemReq.product_id}` };
      }

      const activePrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
      const itemTotal = activePrice * itemReq.quantity;
      calculatedSubtotal += itemTotal;

      // Inventory check & update
      const variant = product.variants.find(v => v.size === itemReq.size && v.color_name === itemReq.color_name);
      if (variant) {
        if (variant.stock < itemReq.quantity) {
          return { success: false, error: `الكمية المطلوبة غير متوفرة للمنتج "${product.name_ar}" (المقاس ${itemReq.size})` };
        }
        // Deduct inventory
        variant.stock -= itemReq.quantity;
      }

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product_id: product.id,
        product_name: product.name_ar,
        product_image: product.images[0] || '',
        price_at_purchase: activePrice,
        size: itemReq.size,
        color_name: itemReq.color_name,
        color_hex: itemReq.color_hex,
        quantity: itemReq.quantity,
        total: itemTotal
      });
    }

    // 2. Calculate shipping fees
    const settings = this.data.store_settings;
    let shippingFee = settings.wilaya_shipping_fees[orderPayload.wilaya_code] ?? settings.default_shipping_fee;
    if (calculatedSubtotal >= settings.free_shipping_threshold) {
      shippingFee = 0; // Free shipping rule applied
    }

    // 3. Apply coupon if provided
    let discountAmount = 0;
    if (orderPayload.coupon_code) {
      const coupon = this.data.coupons.find(c => c.code.toUpperCase() === orderPayload.coupon_code?.toUpperCase() && c.is_active);
      if (coupon && calculatedSubtotal >= coupon.min_order_amount) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = Math.round((calculatedSubtotal * coupon.value) / 100);
        } else {
          discountAmount = coupon.value;
        }
        coupon.uses_count += 1;
      }
    }

    const totalAmount = Math.max(0, calculatedSubtotal + shippingFee - discountAmount);
    const now = new Date().toISOString();
    const orderNumber = `MR-${new Date().getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: orderPayload.customer_name,
      customer_phone: orderPayload.customer_phone,
      customer_email: orderPayload.customer_email,
      wilaya_code: orderPayload.wilaya_code,
      wilaya_name: orderPayload.wilaya_name,
      commune: orderPayload.commune,
      address: orderPayload.address,
      delivery_notes: orderPayload.delivery_notes,
      items: orderItems,
      subtotal: calculatedSubtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      coupon_code: orderPayload.coupon_code,
      total_amount: totalAmount,
      payment_method: 'COD',
      status: 'pending',
      status_history: [
        {
          id: `sh-${Date.now()}`,
          order_id: `ord-${Date.now()}`,
          previous_status: null,
          new_status: 'pending',
          changed_by: 'الزبون (Web Checkout)',
          notes: 'تسجيل طلب جديد عبر الموقع بنجاح - الدفع عند الاستلام',
          timestamp: now
        }
      ],
      created_at: now,
      updated_at: now
    };

    this.data.orders.unshift(newOrder);
    this.addActivityLog('system', 'Client Web', 'NEW_ORDER', `طلب جديد #${newOrder.order_number} بمبلغ ${newOrder.total_amount} د.ج للزبونة ${newOrder.customer_name} في ولاية ${newOrder.wilaya_name}`);
    this.save();

    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, changedBy: string, notes: string): Order | null {
    const order = this.data.orders.find(o => o.id === orderId || o.order_number === orderId);
    if (!order) return null;

    const previousStatus = order.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    const historyItem: OrderStatusHistoryItem = {
      id: `sh-${Date.now()}`,
      order_id: order.id,
      previous_status: previousStatus,
      new_status: newStatus,
      changed_by: changedBy,
      notes: notes || `تغيير الحالة من ${previousStatus} إلى ${newStatus}`,
      timestamp: new Date().toISOString()
    };

    order.status_history.push(historyItem);
    this.addActivityLog('admin', changedBy, 'UPDATE_ORDER_STATUS', `تحديث حالة الطلب #${order.order_number} إلى ${newStatus}`);
    this.save();
    return order;
  }

  public updateOrderNotes(orderId: string, notes: string, adminUser: AdminUser): Order | null {
    const order = this.data.orders.find(o => o.id === orderId || o.order_number === orderId);
    if (!order) return null;
    order.internal_notes = notes;
    order.updated_at = new Date().toISOString();
    this.addActivityLog(adminUser.id, adminUser.full_name, 'UPDATE_ORDER_NOTES', `تحديث الملاحظات الداخلية للطلب #${order.order_number}`);
    this.save();
    return order;
  }

  // CMS & Settings Updates
  public updateHomepageCMS(cms: HomepageCMS, adminUser: AdminUser): HomepageCMS {
    this.data.homepage_cms = cms;
    this.addActivityLog(adminUser.id, adminUser.full_name, 'UPDATE_CMS', 'تحديث محتوى وبنرات الصفحة الرئيسية');
    this.save();
    return this.data.homepage_cms;
  }

  public updateStoreSettings(settings: StoreSettings, adminUser: AdminUser): StoreSettings {
    this.data.store_settings = settings;
    this.addActivityLog(adminUser.id, adminUser.full_name, 'UPDATE_SETTINGS', 'تحديث إعدادات المتجر والشحن');
    this.save();
    return this.data.store_settings;
  }

  // Coupons
  public createCoupon(coupon: Omit<Coupon, 'id' | 'uses_count'>, adminUser: AdminUser): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      uses_count: 0
    };
    this.data.coupons.push(newCoupon);
    this.addActivityLog(adminUser.id, adminUser.full_name, 'CREATE_COUPON', `إنشاء كوبون تخفيض: ${newCoupon.code}`);
    this.save();
    return newCoupon;
  }

  public deleteCoupon(id: string, adminUser: AdminUser): boolean {
    const index = this.data.coupons.findIndex(c => c.id === id);
    if (index === -1) return false;
    const c = this.data.coupons[index];
    this.data.coupons.splice(index, 1);
    this.addActivityLog(adminUser.id, adminUser.full_name, 'DELETE_COUPON', `حذف كوبون: ${c.code}`);
    this.save();
    return true;
  }

  // Staff & Admin Management
  public createAdminUser(userData: { username: string; full_name: string; email: string; role: any; password_hash: string }, superAdmin: AdminUser): AdminUser {
    const newUser = {
      id: `usr-${Date.now()}`,
      username: userData.username,
      full_name: userData.full_name,
      email: userData.email,
      role: userData.role,
      is_active: true,
      password_hash: userData.password_hash,
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.addActivityLog(superAdmin.id, superAdmin.full_name, 'CREATE_STAFF', `إضافة مسؤول جديد: ${newUser.full_name} برتبة ${newUser.role}`);
    this.save();
    const { password_hash, ...safeUser } = newUser;
    return safeUser;
  }

  public toggleAdminStatus(userId: string, superAdmin: AdminUser): AdminUser | null {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return null;
    user.is_active = !user.is_active;
    this.addActivityLog(superAdmin.id, superAdmin.full_name, 'TOGGLE_STAFF', `تعديل حالة حساب ${user.full_name} إلى ${user.is_active ? 'نشط' : 'معطل'}`);
    this.save();
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  public addSubscriber(email: string): boolean {
    if (this.data.newsletter_subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    this.data.newsletter_subscribers.push({
      id: `sub-${Date.now()}`,
      email,
      subscribed_at: new Date().toISOString()
    });
    this.save();
    return true;
  }
}

export const db = new JsonDatabase();
