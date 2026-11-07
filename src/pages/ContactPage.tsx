import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#581C47] font-bold">
          فريق خدمة الزبائن
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          تواصل مع بوتيك ميس راجا
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          نسعد دائماً باستقبال استفساراتكِ بخصوص المقاسات، توفر الموديلات، أو مواعيد التوصيل.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="md:col-span-5 bg-[#38102A] text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-md">
          <h2 className="font-serif text-xl font-bold text-[#E6B89C]">
            معلومات البوتيك
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#E6B89C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">المقر الرئيسي والبوتيك:</strong>
                <span className="text-stone-300">{settings?.boutique_location || 'شارع الجمهورية، باتنة، الجزائر'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#E6B89C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">خدمة الزبائن والطلبيات:</strong>
                <span className="text-stone-300 font-mono" dir="ltr">{settings?.phone || '0561 23 45 67'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#E6B89C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">البريد الإلكتروني:</strong>
                <span className="text-stone-300">{settings?.email || 'contact@miss-raja.dz'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#E6B89C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">أوقات العمل:</strong>
                <span className="text-stone-300">السبت إلى الخميس: 09:00 صباحاً - 20:00 مساءً</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-xs text-stone-300">
            🚚 التوصيل متاح لجميع ولايات الجزائر الـ 58 مع الدفع عند الاستلام.
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">
            أرسلي لنا استفساركِ
          </h2>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>شكراً لتواصلكِ معنا! سنتواصل معكِ هاتفياً في أقرب وقت.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مريم بن عيسى"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0661 23 45 67"
                  dir="ltr"
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">رسالتكِ أو استفساركِ *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="اكتبي استفساركِ هنا بخصوص أي فستان، مقاس، أو طريقة التوصيل..."
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#581C47]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#581C47] hover:bg-[#431235] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
