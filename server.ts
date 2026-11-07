import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Helper to extract bearer token or simulated session
const getAuthUser = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const users = db.getUsers();
  return users.find(u => u.id === token || u.username === token) || null;
};

// ================= API ROUTES =================

// Products API
app.get('/api/products', (req: Request, res: Response) => {
  let products = db.getProducts();
  const { category, search, tag, sort } = req.query;

  // Filter out unpublished for public unless admin query
  if (req.query.all !== 'true') {
    products = products.filter(p => p.is_published);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    products = products.filter(p => p.category_id === category);
  }

  if (tag === 'featured') {
    products = products.filter(p => p.is_featured);
  } else if (tag === 'new') {
    products = products.filter(p => p.is_new);
  } else if (tag === 'bestseller') {
    products = products.filter(p => p.is_bestseller);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name_ar.toLowerCase().includes(q) ||
      p.name_fr.toLowerCase().includes(q) ||
      p.name_en.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-asc') {
    products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
  } else if (sort === 'price-desc') {
    products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  res.json({ success: true, count: products.length, products });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

app.post('/api/products', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const newProduct = db.createProduct(req.body, admin);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const updated = db.updateProduct(req.params.id, req.body, admin);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product: updated });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const ok = db.deleteProduct(req.params.id, admin);
  res.json({ success: ok });
});

app.post('/api/products/:id/duplicate', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const copy = db.duplicateProduct(req.params.id, admin);
  if (!copy) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.status(201).json({ success: true, product: copy });
});

// Categories API
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ success: true, categories: db.getCategories() });
});

app.post('/api/categories', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const category = db.saveCategory(req.body, admin);
  res.json({ success: true, category });
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const ok = db.deleteCategory(req.params.id, admin);
  res.json({ success: ok });
});

// Orders & Checkout API
app.post('/api/orders', (req: Request, res: Response) => {
  const result = db.createOrder(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

app.get('/api/orders', (req: Request, res: Response) => {
  let orders = db.getOrders();
  const { status, search } = req.query;

  if (status && typeof status === 'string' && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    orders = orders.filter(o =>
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      o.wilaya_name.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: orders.length, orders });
});

// Order tracking for customer
app.get('/api/orders/track', (req: Request, res: Response) => {
  const { order_number, phone } = req.query;
  if (!order_number) {
    return res.status(400).json({ success: false, error: 'رقم الطلبية مطلوب' });
  }

  const order = db.getOrders().find(o =>
    o.order_number.toUpperCase() === String(order_number).trim().toUpperCase()
  );

  if (!order) {
    return res.status(404).json({ success: false, error: 'الطلبية غير موجودة، يرجى التأكد من رقم الطلب' });
  }

  if (phone) {
    const cleanReqPhone = String(phone).replace(/\s+/g, '');
    const cleanOrderPhone = order.customer_phone.replace(/\s+/g, '');
    if (!cleanOrderPhone.includes(cleanReqPhone) && !cleanReqPhone.includes(cleanOrderPhone)) {
      return res.status(401).json({ success: false, error: 'رقم الهاتف غير مطابق لرقم الطلبية' });
    }
  }

  res.json({ success: true, order });
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const { status, notes } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, admin.full_name, notes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order: updated });
});

app.put('/api/orders/:id/notes', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const { notes } = req.body;
  const updated = db.updateOrderNotes(req.params.id, notes, admin);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order: updated });
});

// Coupons API
app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json({ success: true, coupons: db.getCoupons() });
});

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'رمز الكوبون مطلوب' });
  }

  const coupon = db.getCoupons().find(c => c.code.toUpperCase() === String(code).trim().toUpperCase() && c.is_active);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'الكوبون غير صالح أو منتهي الصلاحية' });
  }

  if (subtotal < coupon.min_order_amount) {
    return res.status(400).json({
      success: false,
      error: `الحد الأدنى للاستفادة من هذا الكوبون هو ${coupon.min_order_amount} د.ج`
    });
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discount = coupon.value;
  }

  res.json({ success: true, coupon, discount });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const newCoupon = db.createCoupon(req.body, admin);
  res.status(201).json({ success: true, coupon: newCoupon });
});

app.delete('/api/coupons/:id', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const ok = db.deleteCoupon(req.params.id, admin);
  res.json({ success: ok });
});

// Store Settings & CMS
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, settings: db.getStoreSettings() });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const updated = db.updateStoreSettings(req.body, admin);
  res.json({ success: true, settings: updated });
});

app.get('/api/cms', (_req: Request, res: Response) => {
  res.json({ success: true, cms: db.getHomepageCMS() });
});

app.put('/api/cms', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  const updated = db.updateHomepageCMS(req.body, admin);
  res.json({ success: true, cms: updated });
});

// Admin Auth & Staff Management
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const users = db.getUsers();
  const user = users.find(u => (u.username.toLowerCase() === String(username).toLowerCase() || u.email.toLowerCase() === String(username).toLowerCase()));

  if (!user || user.password_hash !== password) {
    return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  }

  if (!user.is_active) {
    return res.status(403).json({ success: false, error: 'هذا الحساب معطل، يرجى مراجعة المسؤول الرئيسي' });
  }

  user.last_login = new Date().toISOString();
  db.save();
  db.addActivityLog(user.id, user.full_name, 'LOGIN', `تسجيل دخول ناجح للمسؤول ${user.full_name}`);

  const { password_hash, ...safeUser } = user;
  res.json({
    success: true,
    token: user.id,
    user: safeUser
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'غير مصرح' });
  }
  const { password_hash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.get('/api/staff', (_req: Request, res: Response) => {
  const safeUsers = db.getUsers().map(({ password_hash, ...rest }) => rest);
  res.json({ success: true, staff: safeUsers });
});

app.post('/api/staff', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  if (admin.role !== 'super_admin') {
    return res.status(403).json({ success: false, error: 'صلاحية إضافة موظفين محصورة في Super Admin فقط' });
  }
  const newUser = db.createAdminUser(req.body, admin);
  res.status(201).json({ success: true, user: newUser });
});

app.post('/api/staff/:id/toggle', (req: Request, res: Response) => {
  const admin = getAuthUser(req) || db.getUsers()[0];
  if (admin.role !== 'super_admin') {
    return res.status(403).json({ success: false, error: 'غير مصرح' });
  }
  const updated = db.toggleAdminStatus(req.params.id, admin);
  res.json({ success: !!updated, user: updated });
});

// Admin Dashboard Analytics
app.get('/api/admin/analytics', (_req: Request, res: Response) => {
  const orders = db.getOrders();
  const products = db.getProducts();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  // Identify low stock variants (stock <= 3)
  const lowStockItems: { product_name: string; size: string; color: string; stock: number }[] = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock <= 3) {
        lowStockItems.push({
          product_name: p.name_ar,
          size: v.size,
          color: v.color_name,
          stock: v.stock
        });
      }
    });
  });

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  res.json({
    success: true,
    analytics: {
      total_revenue: totalRevenue,
      total_orders: orders.length,
      pending_orders: pendingOrders,
      confirmed_orders: confirmedOrders,
      processing_orders: processingOrders,
      shipped_orders: shippedOrders,
      delivered_orders: deliveredOrders,
      cancelled_orders: cancelledOrders,
      total_products: products.length,
      low_stock_count: lowStockItems.length,
      low_stock_items: lowStockItems,
      recent_orders: recentOrders
    }
  });
});

app.get('/api/admin/logs', (_req: Request, res: Response) => {
  res.json({ success: true, logs: db.getActivityLogs() });
});

// Newsletter subscription
app.post('/api/subscribers', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'البريد الإلكتروني غير صحيح' });
  }
  const added = db.addSubscriber(email);
  res.json({ success: true, message: added ? 'تم الاشتراك بنجاح' : 'أنت مشترك بالفعل في نشرتنا' });
});

// Image Upload API (Store base64 or saved files)
app.post('/api/upload', (req: Request, res: Response) => {
  const { imageBase64, filename } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ success: false, error: 'No image data provided' });
  }

  try {
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // In case raw base64 or URL is sent
      return res.json({ success: true, url: imageBase64 });
    }

    const ext = matches[1].split('/')[1] || 'jpg';
    const cleanBase64 = matches[2];
    const safeName = (filename || `upload_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '');
    const outDir = path.resolve(__dirname, 'src/assets/images');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const filePath = path.join(outDir, `${safeName}.${ext}`);
    fs.writeFileSync(filePath, Buffer.from(cleanBase64, 'base64'));

    const publicUrl = `/src/assets/images/${safeName}.${ext}`;
    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'Failed to save image' });
  }
});

// Server boot & Vite integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ Miss Raja E-Commerce Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
