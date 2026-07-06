import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Mail, Phone, Sparkles, Users, MapPin, BriefcaseBusiness } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { ScoreBadge } from '@/components/ScoreBadge';
import { companies, formatCurrency } from '@/lib/data';

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = companies.find((item) => item.id === params.id);
  if (!company) return notFound();

  return (
    <Shell>
      <Link href="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft size={16} /> Firmalara dön
      </Link>

      <div className="mt-5 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Firma Detayı</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">{company.name}</h1>
              <p className="mt-2 text-muted">{company.city} · {company.productGroup}</p>
            </div>
            <ScoreBadge score={company.score} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Info icon={<ExternalLink size={18} />} label="Web" value={company.website} />
            <Info icon={<Mail size={18} />} label="Mail" value={company.email} />
            <Info icon={<Phone size={18} />} label="Telefon" value={company.phone} />
            <Info icon={<Sparkles size={18} />} label="Referans" value={company.reference} />
            <Info icon={<MapPin size={18} />} label="Konum" value={`${company.city}${company.district ? ` · ${company.district}` : ''}`} />
            <Info icon={<Users size={18} />} label="Ölçek" value={company.employeeBand} />
            <Info icon={<BriefcaseBusiness size={18} />} label="İlk Hizmet" value={company.firstService} />
            <Info icon={<Sparkles size={18} />} label="Sonraki Adım" value={company.nextAction} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Panel title="Radar Sinyalleri" items={company.signals} />
            <Panel title="Dijital Açıklar" items={company.weaknesses} />
            <Panel title="Satılabilecek Hizmetler" items={company.services} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-line bg-ink p-6 text-white shadow-soft">
            <h2 className="text-xl font-bold">AI satış önerisi</h2>
            <p className="mt-4 leading-7 text-slate-200">{company.note}</p>
            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <div className="text-sm text-slate-300">Tahmini proje potansiyeli</div>
              <div className="mt-2 text-2xl font-bold">{formatCurrency(company.potentialRevenue)}</div>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold">İlk arama metni</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Merhaba, ben Burak. Anahtar Creative olarak medikal sektörde Üzümcü Hastane Ekipmanları ile yürüttüğümüz çalışmalardan dolayı sizi de yakından takip ediyoruz. Özellikle fuar ve ihracat iletişimi tarafında üretici firmalara tek ekipten video, web ve katalog desteği veriyoruz. Uygunsa kısa bir tanışma toplantısı planlamak isterim.
            </p>
          </section>
        </aside>
      </div>
    </Shell>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted">{icon}{label}</div>
      <div className="mt-2 font-medium text-ink">{value}</div>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-line p-4">
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {items.map((item) => <li key={item}>✓ {item}</li>)}
      </ul>
    </div>
  );
}
