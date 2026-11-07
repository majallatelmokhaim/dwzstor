export type Language = 'ar' | 'fr' | 'en';

export interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  slug: string;
  image: string;
  display_order: number;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  color_name: string;
  color_hex: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  sku: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_fr: string;
  description_en: string;
  category_id: string;
  price: number; // in DZD
  discount_price: number | null; // in DZD
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_published: boolean;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  variants: ProductVariant[];
  material?: string;
  care_instructions?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price_at_purchase: number;
  size: string;
  color_name: string;
  color_hex: string;
  quantity: number;
  total: number;
}

export interface OrderStatusHistoryItem {
  id: string;
  order_id: string;
  previous_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_by: string;
  notes: string;
  timestamp: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  wilaya_code: string;
  wilaya_name: string;
  commune: string;
  address: string;
  delivery_notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  coupon_code?: string;
  total_amount: number;
  payment_method: 'COD';
  status: OrderStatus;
  status_history: OrderStatusHistoryItem[];
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 1000 for 1000 DZD
  min_order_amount: number;
  is_active: boolean;
  uses_count: number;
  max_uses?: number;
  expires_at?: string;
}

export type StaffRole = 'super_admin' | 'product_manager' | 'order_manager' | 'content_manager';

export interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface HeroSlide {
  id: string;
  title_ar: string;
  title_fr: string;
  subtitle_ar: string;
  subtitle_fr: string;
  button_text_ar: string;
  button_text_fr: string;
  link: string;
  image: string;
  badge_ar?: string;
  badge_fr?: string;
  is_active: boolean;
}

export interface PromotionalBanner {
  id: string;
  title_ar: string;
  title_fr: string;
  subtitle_ar: string;
  subtitle_fr: string;
  tag_ar?: string;
  tag_fr?: string;
  image: string;
  link: string;
  bg_gradient?: string;
}

export interface HomepageCMS {
  hero_slides: HeroSlide[];
  promotional_banners: PromotionalBanner[];
  announcement_ar: string;
  announcement_fr: string;
  announcement_active: boolean;
  editorial_story: {
    title_ar: string;
    title_fr: string;
    content_ar: string;
    content_fr: string;
    image: string;
  };
  instagram_gallery: string[];
}

export interface StoreSettings {
  store_name_ar: string;
  store_name_fr: string;
  tagline_ar: string;
  tagline_fr: string;
  boutique_location: string;
  phone: string;
  email: string;
  currency: string; // "DZD"
  free_shipping_threshold: number; // e.g. 15000 DZD
  default_shipping_fee: number; // 600 DZD
  wilaya_shipping_fees: Record<string, number>;
  social_links: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  policy_shipping_ar: string;
  policy_shipping_fr: string;
  policy_return_ar: string;
  policy_return_fr: string;
  policy_terms_ar: string;
  policy_terms_fr: string;
}

export interface CartItem {
  product_id: string;
  product: Product;
  size: string;
  color_name: string;
  color_hex: string;
  quantity: number;
  price: number;
}

export interface AlgerianWilaya {
  code: string;
  name_ar: string;
  name_fr: string;
  default_fee: number;
}
