import { Sparkles } from 'lucide-react';
import { Shell } from '@/components/Shell';

const findings = [
  'Web sitesi güncelliği kontrol edilecek',
  'İngilizce / Arapça / Almanca dil desteği puanlanacak',
  'Tanıtım filmi ve YouTube varlığı işaretlenecek',
  'LinkedIn karar verici ve şirket aktifliği incelenecek',
  'Fuar katılım geçmişi CRM notuna eklenecek'
];

export default function AiPage() {
  return (
    <Shell>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Satış Asistanı</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">AI Analiz</h1>
      <p className="mt-2 max-w-3xl text-muted">Bu ekran şimdilik mock. Sonraki sprintte URL girince web sitesi analiz eden ve satış önerisi üreten yapıya bağlayacağız.</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold">Firma URL analizi</h2>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none" placeholder="https://firma.com" />
            <button className="rounded-2xl bg-ink px-5 py-3 font-semibold text-white">Analiz Et</button>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-slate-50 p-5 text-sm text-muted">
            Şimdilik veri kaydı yok. İlk gerçek entegrasyonda URL’den sayfa başlığı, açıklama, dil seçenekleri, sosyal linkler ve satış açıkları çıkarılacak.
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-ink p-6 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><Sparkles size={22} /></div>
            <h2 className="text-xl font-bold">AI kontrol listesi</h2>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            {findings.map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
