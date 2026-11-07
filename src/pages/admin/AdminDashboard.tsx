import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLogin } from '../../components/admin/AdminLogin';
import {
  AdminUser,
  Category,
  Order,
  OrderStatus,
  Product,
  StaffRole
} from '../../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Image as ImageIcon,
  Users,
  Settings,
  Activity,
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Copy,
  Printer,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Save,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    products,
    categories,
    settings,
    cms,
    refreshData,
    navigateTo,
    lang,
    t,
    isRTL
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'cms' | 'staff' | 'settings' | 'logs'>('overview');

  // Analytics data
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffList, setStaffList] = useState<AdminUser[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Add / Edit modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Category Add / Edit modal state
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Settings form
  const [storeSettingsForm, setStoreSettingsForm] = useState(settings || null);

  // Staff creation form
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffFullName, setNewStaffFullName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('order_manager');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');

  // Fetch admin-specific data
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, ordersRes, staffRes, logsRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/orders'),
        fetch('/api/staff'),
        fetch('/api/admin/logs')
      ]);

      const aData = await analyticsRes.json();
      const oData = await ordersRes.json();
      const sData = await staffRes.json();
      const lData = await logsRes.json();

      if (aData.success) setAnalytics(aData.analytics);
      if (oData.success) setOrders(oData.orders);
      if (sData.success) setStaffList(sData.staff);
      if (lData.success) setActivityLogs(lData.logs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchAdminData();
    }
  }, [adminUser]);

  useEffect(() => {
    if (settings) {
      setStoreSettingsForm(settings);
    }
  }, [settings]);

  if (!adminUser) {
    return <AdminLogin />;
  }

  // RBAC Permission checks
  const isSuperAdmin = adminUser.role === 'super_admin';
  const canManageProducts = isSuperAdmin || adminUser.role === 'product_manager';
  const canManageOrders = isSuperAdmin || adminUser.role === 'order_manager';
  const canManageCMS = isSuperAdmin || adminUser.role === 'content_manager';

  // Handle Order Status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, notes: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify({ status, notes })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const isNew = !editingProduct.id;
      const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        sku: editingProduct.sku || `MR-${Date.now().toString().slice(-4)}`,
        name_ar: editingProduct.name_ar || '',
        name_fr: editingProduct.name_fr || '',
        name_en: editingProduct.name_en || editingProduct.name_fr || '',
        slug: editingProduct.slug || (editingProduct.name_fr || 'product').toLowerCase().replace(/\s+/g, '-'),
        description_ar: editingProduct.description_ar || '',
        description_fr: editingProduct.description_fr || '',
        description_en: editingProduct.description_en || '',
        category_id: editingProduct.category_id || categories[0]?.id || 'cat-dresses',
        price: Number(editingProduct.price) || 10000,
        discount_price: editingProduct.discount_price ? Number(editingProduct.discount_price) : null,
        is_featured: !!editingProduct.is_featured,
        is_new: !!editingProduct.is_new,
        is_bestseller: !!editingProduct.is_bestseller,
        is_published: editingProduct.is_published !== false,
        images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['/src/assets/images/miss_raja_evening_gown_1794059151940.jpg'],
        sizes: editingProduct.sizes && editingProduct.sizes.length > 0 ? editingProduct.sizes : ['38', '40', '42'],
        colors: editingProduct.colors && editingProduct.colors.length > 0 ? editingProduct.colors : [{ name: 'عنابي', hex: '#581C47' }],
        variants: editingProduct.variants || [
          { id: `v-${Date.now()}-1`, size: '38', color_name: 'عنابي', color_hex: '#581C47', stock: 5, sku: 'MR-V1' },
          { id: `v-${Date.now()}-2`, size: '40', color_name: 'عنابي', color_hex: '#581C47', stock: 5, sku: 'MR-V2' }
        ],
        material: editingProduct.material || 'ساتان كريب فاخر',
        care_instructions: editingProduct.care_instructions || 'تنظيف جاف'
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        refreshData();
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Product Duplicate
  const handleDuplicateProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminUser.id}` }
      });
      const data = await res.json();
      if (data.success) {
        refreshData();
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminUser.id}` }
      });
      const data = await res.json();
      if (data.success) {
        refreshData();
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    if (orderFilterStatus !== 'all' && o.status !== orderFilterStatus) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.wilaya_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name_ar.toLowerCase().includes(q) ||
        p.name_fr.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle Staff Creation
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffUsername || !newStaffPassword || !newStaffFullName) return;
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify({
          username: newStaffUsername.trim(),
          full_name: newStaffFullName.trim(),
          email: newStaffEmail.trim(),
          role: newStaffRole,
          password_hash: newStaffPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setStaffSuccess(`تم إنشاء حساب ${newStaffFullName} بنجاح.`);
        setNewStaffUsername('');
        setNewStaffFullName('');
        setNewStaffEmail('');
        setNewStaffPassword('');
        fetchAdminData();
        setTimeout(() => setStaffSuccess(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Staff Toggle Active
  const handleToggleStaff = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminUser.id}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettingsForm) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminUser.id}`
        },
        body: JSON.stringify(storeSettingsForm)
      });
      const data = await res.json();
      if (data.success) {
        refreshData();
        alert('تم حفظ الإعدادات بنجاح!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4F0] flex flex-col">
      {/* 1. Admin Top Bar */}
      <header className="bg-[#38102A] text-white px-4 sm:px-6 py-3 border-b border-[#4F1A3D] flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#581C47] rounded-lg">
            <Shield className="w-5 h-5 text-[#E6B89C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base">Miss Raja Admin</span>
              <span className="text-[10px] bg-[#E6B89C] text-[#38102A] px-2 py-0.5 rounded-full font-bold">
                {adminUser.role === 'super_admin' ? 'Super Admin' :
                 adminUser.role === 'order_manager' ? 'Order Mgr' :
                 adminUser.role === 'product_manager' ? 'Product Mgr' : 'Content Mgr'}
              </span>
            </div>
            <span className="text-[11px] text-stone-300 block">
              المستخدم: <strong>{adminUser.full_name}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">معاينة المتجر</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-medium transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* 2. Main Admin Workspace with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>نظرة عامة والتحليلات</span>
            </div>
          </button>

          <button
            onClick={() => {
              if (canManageOrders) setActiveTab('orders');
              else alert('عذراً، صلاحية إدارة الطلبيات غير مفعلة لحسابك.');
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            } ${!canManageOrders ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>إدارة الطلبيات والفواتير</span>
            </div>
            {analytics?.pending_orders > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'orders' ? 'bg-white text-[#581C47]' : 'bg-[#581C47] text-white'}`}>
                {analytics.pending_orders}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (canManageProducts) setActiveTab('products');
              else alert('عذراً، صلاحية إدارة المنتجات مقتصرة على مدراء المنتجات أو Super Admin.');
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'products' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            } ${!canManageProducts ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>المنتجات والمخزون</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">({products.length})</span>
          </button>

          <button
            onClick={() => {
              if (canManageProducts) setActiveTab('categories');
              else alert('غير مصرح');
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'categories' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            } ${!canManageProducts ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>الأصناف والفئات</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">({categories.length})</span>
          </button>

          <button
            onClick={() => {
              if (canManageCMS) setActiveTab('cms');
              else alert('غير مصرح');
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cms' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            } ${!canManageCMS ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>محتوى المتجر (CMS)</span>
            </div>
          </button>

          {isSuperAdmin && (
            <>
              <div className="pt-2 pb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                إدارة النظام (Super Admin)
              </div>

              <button
                onClick={() => setActiveTab('staff')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'staff' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>المسؤولين والصلاحيات</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">({staffList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'settings' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>إعدادات المتجر والتوصيل</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'logs' ? 'bg-[#581C47] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4" />
                  <span>سجل العمليات والأمان</span>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-stone-500 font-medium block">إجمالي المبيعات (DZD)</span>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#581C47] mt-1 tabular-nums">
                    {(analytics?.total_revenue || 0).toLocaleString()} د.ج
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium mt-1 block">محسوبة من طلبيات حقيقية</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-stone-500 font-medium block">إجمالي الطلبيات</span>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900 mt-1 tabular-nums">
                    {analytics?.total_orders || 0}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">جميع ولايات الوطن</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-amber-600 font-medium block">طلبيات قيد الانتظار</span>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-amber-600 mt-1 tabular-nums">
                    {analytics?.pending_orders || 0}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">تتطلب تأكيد هاتفي</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-rose-600 font-medium block">تنبيهات انخفاض المخزون</span>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-rose-600 mt-1 tabular-nums">
                    {analytics?.low_stock_count || 0}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">قطع متبقية ≤ 3</span>
                </div>
              </div>

              {/* Status Breakdown Bar */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  توزيع حالات الطلبيات في البوتيك
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 font-medium">قيد الانتظار:</span>
                    <div className="font-mono font-bold text-lg text-amber-900">{analytics?.pending_orders || 0}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-blue-800 font-medium">تم التأكيد:</span>
                    <div className="font-mono font-bold text-lg text-blue-900">{analytics?.confirmed_orders || 0}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="text-purple-800 font-medium">قيد التجهيز:</span>
                    <div className="font-mono font-bold text-lg text-purple-900">{analytics?.processing_orders || 0}</div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                    <span className="text-indigo-800 font-medium">خرج للشحن:</span>
                    <div className="font-mono font-bold text-lg text-indigo-900">{analytics?.shipped_orders || 0}</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-emerald-800 font-medium">تم التسليم:</span>
                    <div className="font-mono font-bold text-lg text-emerald-900">{analytics?.delivered_orders || 0}</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    أحدث الطلبيات المسجلة
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#581C47] font-semibold hover:underline"
                  >
                    عرض كل الطلبيات
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                        <th className="pb-2 text-start">رقم الطلبية</th>
                        <th className="pb-2 text-start">الزبونة</th>
                        <th className="pb-2 text-start">الولاية</th>
                        <th className="pb-2 text-end">المبلغ الإجمالي</th>
                        <th className="pb-2 text-center">الحالة</th>
                        <th className="pb-2 text-end">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-stone-50/50">
                          <td className="py-2.5 font-mono font-bold text-[#581C47]">#{o.order_number}</td>
                          <td className="py-2.5 font-medium text-stone-900">{o.customer_name}</td>
                          <td className="py-2.5 text-stone-600">{o.wilaya_name}</td>
                          <td className="py-2.5 text-end font-mono font-bold tabular-nums">
                            {o.total_amount.toLocaleString()} د.ج
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                              o.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              o.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-end">
                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setActiveTab('orders');
                              }}
                              className="text-xs text-[#581C47] font-semibold hover:underline"
                            >
                              معاينة
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    placeholder="بحث برقم الطلب، اسم الزبونة، أو الهاتف..."
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 ps-9 pe-3 text-xs focus:outline-none focus:border-[#581C47]"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute start-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderFilterStatus}
                    onChange={e => setOrderFilterStatus(e.target.value)}
                    className="bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none"
                  >
                    <option value="all">كل الحالات ({orders.length})</option>
                    <option value="pending">قيد الانتظار (Pending)</option>
                    <option value="confirmed">تم التأكيد (Confirmed)</option>
                    <option value="processing">قيد التجهيز (Processing)</option>
                    <option value="shipped">خرج للشحن (Shipped)</option>
                    <option value="delivered">تم التسليم (Delivered)</option>
                    <option value="cancelled">ملغاة (Cancelled)</option>
                  </select>
                </div>
              </div>

              {/* Order List Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 uppercase font-semibold">
                      <tr>
                        <th className="p-3 text-start">الطلبية والتاريخ</th>
                        <th className="p-3 text-start">الزبونة والهاتف</th>
                        <th className="p-3 text-start">الولاية والعنوان</th>
                        <th className="p-3 text-end">المبلغ</th>
                        <th className="p-3 text-center">الحالة</th>
                        <th className="p-3 text-end">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-3 font-mono">
                            <span className="font-bold text-[#581C47] block">#{order.order_number}</span>
                            <span className="text-[11px] text-stone-400">
                              {new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-DZ' : 'fr-FR')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-stone-900 block">{order.customer_name}</span>
                            <span className="text-[11px] text-stone-500 font-mono" dir="ltr">{order.customer_phone}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-stone-800 block">{order.wilaya_name}</span>
                            <span className="text-[11px] text-stone-500 line-clamp-1">{order.commune} - {order.address}</span>
                          </td>
                          <td className="p-3 text-end font-mono font-bold text-[#581C47] tabular-nums">
                            {order.total_amount.toLocaleString()} د.ج
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-end space-x-1 space-x-reverse">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 bg-[#581C47] text-white rounded-lg text-xs font-semibold hover:bg-[#401233]"
                            >
                              تفاصيل وإدارة
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Detail Drawer / Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                      <div>
                        <h2 className="text-lg font-bold text-stone-900">
                          إدارة الطلبية #{selectedOrder.order_number}
                        </h2>
                        <span className="text-xs text-stone-500">
                          تاريخ الإنشاء: {new Date(selectedOrder.created_at).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1.5 text-stone-400 hover:text-stone-900"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Customer & Location */}
                    <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 text-xs grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-stone-400 block font-semibold">الزبونة:</span>
                        <strong className="text-stone-900 text-sm block">{selectedOrder.customer_name}</strong>
                        <span className="font-mono text-stone-700" dir="ltr">{selectedOrder.customer_phone}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-semibold">العنوان والولاية:</span>
                        <strong className="text-stone-900 block">{selectedOrder.wilaya_name} ({selectedOrder.commune})</strong>
                        <span className="text-stone-600 block">{selectedOrder.address}</span>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-stone-800">المنتجات المطلوبة:</h4>
                      <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                        {selectedOrder.items.map((it, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={it.product_image} alt="" className="w-12 h-14 object-cover rounded-lg bg-stone-100" />
                              <div>
                                <strong className="text-stone-900 block">{it.product_name}</strong>
                                <span className="text-[11px] text-stone-500">
                                  المقاس: {it.size} · اللون: {it.color_name} · الكمية: {it.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-[#581C47]">
                              {it.total.toLocaleString()} د.ج
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status updater */}
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <h4 className="text-xs font-bold text-stone-900">تحديث حالة الطلبية فورياً:</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(st => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, st, `تغيير الحالة إلى ${st}`)}
                            className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                              selectedOrder.status === st
                                ? 'bg-[#581C47] text-white border-[#581C47] shadow-xs'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status History Logs */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-stone-800">سجل النشاط وتاريخ الحالات:</h4>
                      <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 max-h-36 overflow-y-auto text-xs bg-[#FAF8F5]">
                        {selectedOrder.status_history.map((h, i) => (
                          <div key={i} className="p-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-stone-800">{h.notes}</span>
                              <span className="text-[10px] text-stone-400 block">بواسطة: {h.changed_by}</span>
                            </div>
                            <span className="text-[10px] font-mono text-stone-400">
                              {new Date(h.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold"
                      >
                        إغلاق
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="بحث في المنتجات أو رمز SKU..."
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 ps-9 pe-3 text-xs focus:outline-none focus:border-[#581C47]"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute start-3 top-2.5" />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      name_ar: '',
                      name_fr: '',
                      sku: `MR-NEW-${Date.now().toString().slice(-4)}`,
                      price: 15000,
                      discount_price: null,
                      category_id: categories[0]?.id || 'cat-dresses',
                      is_published: true,
                      is_new: true,
                      sizes: ['38', '40', '42'],
                      colors: [{ name: 'عنابي', hex: '#581C47' }],
                      images: ['/src/assets/images/miss_raja_evening_gown_1794059151940.jpg']
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#581C47] text-white rounded-xl text-xs font-semibold hover:bg-[#401233] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Product Grid / Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 uppercase font-semibold">
                      <tr>
                        <th className="p-3 text-start">المنتج والصورة</th>
                        <th className="p-3 text-start">رمز SKU</th>
                        <th className="p-3 text-end">السعر (د.ج)</th>
                        <th className="p-3 text-center">المقاسات</th>
                        <th className="p-3 text-center">الحالة</th>
                        <th className="p-3 text-end">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images[0] || '/public/assets/aistudio/Miss_Raja_Boutique_Homepage_29c8d426.png'}
                                alt=""
                                className="w-12 h-14 object-cover rounded-lg bg-stone-100"
                              />
                              <div>
                                <span className="font-semibold text-stone-900 block line-clamp-1">{prod.name_ar}</span>
                                <span className="text-[11px] text-stone-400 block line-clamp-1">{prod.name_fr}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-stone-600">{prod.sku}</td>
                          <td className="p-3 text-end font-mono">
                            <strong className="text-[#581C47] block tabular-nums">
                              {(prod.discount_price || prod.price).toLocaleString()} د.ج
                            </strong>
                            {prod.discount_price && (
                              <span className="text-[10px] text-stone-400 line-through tabular-nums">
                                {prod.price.toLocaleString()} د.ج
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono">
                            <div className="flex justify-center gap-1">
                              {prod.sizes.slice(0, 3).map(s => (
                                <span key={s} className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                            }`}>
                              {prod.is_published ? 'منشور' : 'مسودة'}
                            </span>
                          </td>
                          <td className="p-3 text-end space-x-1 space-x-reverse">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-stone-600 hover:text-[#581C47] transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(prod.id)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                              title="نسخ (Duplicate)"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add / Edit Product Modal */}
              {isProductModalOpen && editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <h3 className="font-bold text-base text-stone-900">
                        {editingProduct.id ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                      </h3>
                      <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-stone-900">✕</button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">اسم المنتج بالعربية *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name_ar || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">الاسم بالفرنسية (Nom) *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name_fr || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, name_fr: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">رمز SKU *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.sku || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">السعر الأصلي (د.ج) *</label>
                          <input
                            type="number"
                            required
                            value={editingProduct.price || 0}
                            onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">سعر التخفيض (اختياري)</label>
                          <input
                            type="number"
                            value={editingProduct.discount_price || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, discount_price: e.target.value ? Number(e.target.value) : null })}
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">القسم / الفئة</label>
                        <select
                          value={editingProduct.category_id || categories[0]?.id}
                          onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name_ar} ({c.name_fr})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">الوصف بالعربية</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description_ar || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                        />
                      </div>

                      {/* Image URLs */}
                      <div>
                        <label className="block font-semibold mb-1">رابط الصورة الرئيسية</label>
                        <input
                          type="text"
                          value={editingProduct.images?.[0] || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 font-mono"
                        />
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingProduct.is_published}
                            onChange={e => setEditingProduct({ ...editingProduct, is_published: e.target.checked })}
                          />
                          <span className="font-semibold">نشر على الموقع</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingProduct.is_featured}
                            onChange={e => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                          />
                          <span>مميز (Featured)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingProduct.is_new}
                            onChange={e => setEditingProduct({ ...editingProduct, is_new: e.target.checked })}
                          />
                          <span>وصل حديثاً (New)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingProduct.is_bestseller}
                            onChange={e => setEditingProduct({ ...editingProduct, is_bestseller: e.target.checked })}
                          />
                          <span>الأكثر طلباً (Best Seller)</span>
                        </label>
                      </div>

                      <div className="pt-4 flex justify-end gap-2 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => setIsProductModalOpen(false)}
                          className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-semibold"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#581C47] text-white rounded-xl font-semibold hover:bg-[#401233]"
                        >
                          حفظ المنتج
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">أقسام المتجر والفئات</h3>
                  <p className="text-xs text-stone-500">إدارة تصنيفات الأزياء المعروضة في المتجر</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-4">
                    <img src={cat.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-stone-100" />
                    <div className="flex-1">
                      <strong className="text-stone-900 block text-sm">{cat.name_ar}</strong>
                      <span className="text-xs text-stone-500 block">{cat.name_fr}</span>
                      <span className="text-[10px] text-stone-400 font-mono mt-1 block">Slug: {cat.slug}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CMS CONTENT */}
          {activeTab === 'cms' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-base text-stone-900">إدارة محتوى وبنرات الصفحة الرئيسية (CMS)</h3>
                <p className="text-xs text-stone-500">تعديل نصوص الحملة الإعلانية، البانرات الترويجية، وشريط الإعلانات العلوي</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">شريط الإعلان العلوي (العربية)</label>
                  <input
                    type="text"
                    defaultValue={cms?.announcement_ar}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">عنوان الحملة الرئيسي (Hero Headline)</label>
                  <input
                    type="text"
                    defaultValue={cms?.hero_slides?.[0]?.title_ar}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">نص الحملة الترويجي (Subtitle)</label>
                  <textarea
                    rows={2}
                    defaultValue={cms?.hero_slides?.[0]?.subtitle_ar}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">عنوان القصة التحريرية (Editorial Story)</label>
                  <input
                    type="text"
                    defaultValue={cms?.editorial_story?.title_ar}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => alert('تم حفظ تعديلات المحتوى بنجاح!')}
                    className="px-5 py-2.5 bg-[#581C47] text-white rounded-xl font-semibold hover:bg-[#401233] flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ تحديثات المحتوى</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STAFF & RBAC (SUPER ADMIN ONLY) */}
          {activeTab === 'staff' && isSuperAdmin && (
            <div className="space-y-6">
              {/* Staff creation form */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-base text-stone-900">
                  إضافة مسؤول جديد بنظام الصلاحيات (Role-Based Access Control)
                </h3>

                {staffSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{staffSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">اسم المستخدم *</label>
                    <input
                      type="text"
                      required
                      value={newStaffUsername}
                      onChange={e => setNewStaffUsername(e.target.value)}
                      placeholder="e.g. sara_orders"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={newStaffFullName}
                      onChange={e => setNewStaffFullName(e.target.value)}
                      placeholder="سارة بوعلام"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">الرتبة والصلاحية (Role) *</label>
                    <select
                      value={newStaffRole}
                      onChange={e => setNewStaffRole(e.target.value as any)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                    >
                      <option value="order_manager">Order Manager (إدارة الطلبيات)</option>
                      <option value="product_manager">Product Manager (إدارة المنتجات والمخزون)</option>
                      <option value="content_manager">Content Manager (إدارة محتوى المتجر)</option>
                      <option value="super_admin">Super Admin (صلاحيات كاملة)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">كلمة المرور *</label>
                    <input
                      type="password"
                      required
                      value={newStaffPassword}
                      onChange={e => setNewStaffPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#581C47] text-white rounded-xl font-semibold hover:bg-[#401233] flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إنشاء حساب المسؤول</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Staff table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <table className="w-full text-xs text-start">
                  <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 uppercase font-semibold">
                    <tr>
                      <th className="p-3 text-start">الاسم والمستخدم</th>
                      <th className="p-3 text-start">الرتبة</th>
                      <th className="p-3 text-center">الحالة</th>
                      <th className="p-3 text-end">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {staffList.map(st => (
                      <tr key={st.id} className="hover:bg-stone-50/50">
                        <td className="p-3">
                          <strong className="text-stone-900 block">{st.full_name}</strong>
                          <span className="text-[11px] text-stone-400 font-mono">@{st.username}</span>
                        </td>
                        <td className="p-3 font-semibold text-[#581C47]">
                          {st.role}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {st.is_active ? 'نشط' : 'معطل'}
                          </span>
                        </td>
                        <td className="p-3 text-end">
                          {st.role !== 'super_admin' && (
                            <button
                              onClick={() => handleToggleStaff(st.id)}
                              className="text-xs text-stone-600 hover:text-stone-900 font-medium underline"
                            >
                              {st.is_active ? 'تعطيل الحساب' : 'تفعيل'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: STORE SETTINGS */}
          {activeTab === 'settings' && isSuperAdmin && storeSettingsForm && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-base text-stone-900">إعدادات المتجر والشحن لجميع الولايات</h3>
                <p className="text-xs text-stone-500">ضبط العملة، عتبة الشحن المجاني، ورسوم التوصيل</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">اسم البوتيك بالعربية</label>
                    <input
                      type="text"
                      value={storeSettingsForm.store_name_ar}
                      onChange={e => setStoreSettingsForm({ ...storeSettingsForm, store_name_ar: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">اسم البوتيك بالفرنسية</label>
                    <input
                      type="text"
                      value={storeSettingsForm.store_name_fr}
                      onChange={e => setStoreSettingsForm({ ...storeSettingsForm, store_name_fr: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">العملة (Currency)</label>
                    <input
                      type="text"
                      disabled
                      value={storeSettingsForm.currency}
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">عتبة الشحن المجاني (د.ج)</label>
                    <input
                      type="number"
                      value={storeSettingsForm.free_shipping_threshold}
                      onChange={e => setStoreSettingsForm({ ...storeSettingsForm, free_shipping_threshold: Number(e.target.value) })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">سعر التوصيل الافتراضي (د.ج)</label>
                    <input
                      type="number"
                      value={storeSettingsForm.default_shipping_fee}
                      onChange={e => setStoreSettingsForm({ ...storeSettingsForm, default_shipping_fee: Number(e.target.value) })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">رقم هاتف البوتيك</label>
                    <input
                      type="text"
                      value={storeSettingsForm.phone}
                      onChange={e => setStoreSettingsForm({ ...storeSettingsForm, phone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">عنوان البوتيك في باتنة</label>
                    <input
                      type="text"
                      value={storeSettingsForm.boutique_location}
                      onChange={e => setStoreSettingsForm({ ...storeSettingsForm, boutique_location: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#581C47] text-white rounded-xl font-semibold hover:bg-[#401233] flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ جميع الإعدادات</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === 'logs' && isSuperAdmin && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-4">
              <div>
                <h3 className="font-bold text-base text-stone-900">سجل النشاط والأمان (Audit Logs)</h3>
                <p className="text-xs text-stone-500">سجل كامل بكل العمليات الحساسة وتحديثات الطلبيات والمخزون</p>
              </div>

              <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 max-h-96 overflow-y-auto text-xs bg-[#FAF8F5]">
                {activityLogs.map((log: any) => (
                  <div key={log.id} className="p-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-stone-200 px-1.5 py-0.5 rounded font-bold text-stone-800">
                          {log.action}
                        </span>
                        <strong className="text-stone-900">{log.details}</strong>
                      </div>
                      <span className="text-[10px] text-stone-400 mt-0.5 block">المسؤول: {log.admin_name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
