import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, User, Key, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, isRTL, navigateTo } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('MissRaja2025!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    const res = await loginAdmin(username, password);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'فشل تسجيل الدخول');
    }
  };

  const handleFastLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF8F5]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#EDE4DC] shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#581C47] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            لوحة الإدارة والتحكم
          </h1>
          <p className="text-xs text-stone-500">
            Miss Raja Boutique Admin Portal (Batna)
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              اسم المستخدم أو البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 ps-10 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
              />
              <User className="w-4 h-4 text-stone-400 absolute start-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 ps-10 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
              />
              <Key className="w-4 h-4 text-stone-400 absolute start-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#581C47] hover:bg-[#401233] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}</span>
          </button>
        </form>

        {/* Demo Fast Login presets */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <span className="block text-[11px] font-semibold text-stone-400 text-center uppercase tracking-wider">
            حسابات تجريبية للاختبار السريع (Role-Based Access)
          </span>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              onClick={() => handleFastLogin('admin', 'MissRaja2025!')}
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-center font-medium text-stone-800 transition-colors"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleFastLogin('orders_mgr', 'Orders2025!')}
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-center font-medium text-stone-800 transition-colors"
            >
              Order Mgr
            </button>
            <button
              onClick={() => handleFastLogin('products_mgr', 'Products2025!')}
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-center font-medium text-stone-800 transition-colors"
            >
              Product Mgr
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-stone-500 hover:text-[#581C47] transition-colors"
          >
            ← العودة لمتجر ميس راجا
          </button>
        </div>
      </div>
    </div>
  );
};
