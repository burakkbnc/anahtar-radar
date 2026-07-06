import Link from 'next/link';
import { ArrowRight, Phone, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { StatCard } from '@/components/StatCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import { companies, formatCurrency, tasks, offers } from '@/lib/data';

export default function BugünPage() {
  const totalPotential = companies.reduce((sum, company) => sum + company.potentialRevenue, 0);
  const hotCompanies = companies.filter((company) => company.score >= 88);
  const offerTotal = offers.reduce((sum, offer) => sum + offer.amount, 0);

  return (
    <Shell>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Anahtar Creative</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink">Satış Radar Bugün</h1>
        <p className="max-w-3xl text-muted">Bugün kimi arayacağımızı, neden arayacağımızı ve hangi hizmetle yaklaşacağımızı gösteren satış istihbarat ekranı.</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sıcak Firma" value={String(hotCompanies.length)} hint="88+ radar puanı" />
        <StatCard label="Bugünkü Görev" value={String(tasks.length)} hint="Arama ve takip" />
        <StatCard label="Teklif Hacmi" value={formatCurrency(offerTotal)} hint="Açık/taslak teklifler" />
        <StatCard label="Potansiyel Ciro" value={formatCurrency(totalPotential)} hint="CRM toplamı" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Bugün aranacak firmalar</h2>
              <p className="text-sm text-muted">Önce yüksek puanlı PLAT üreticileri.</p>
            </div>
            <Link href="/companies" className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white">
              Tüm firmalar <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-5 divide-y divide-line">
            {companies.slice().sort((a, b) => b.score - a.score).slice(0, 5).map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`} className="flex items-center justify-between gap-4 py-4 hover:bg-slate-50">
                <div>
                  <div className="font-semibold text-ink">{company.name}</div>
                  <div className="mt-1 text-sm text-muted">{company.city} · {company.firstService}</div>
                </div>
                <ScoreBadge score={company.score} />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-ink p-6 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI satış önerisi</h2>
              <p className="text-sm text-slate-300">İlk kampanya metni</p>
            </div>
          </div>
          <p className="mt-6 text-lg leading-8 text-slate-100">Anahtar Creative’in TÜYAP, Enerjisa, TÜMAD, Safi Holding ve kurumsal referanslarını kullanarak PLAT üreticilerine “ihracat odaklı dijital satış kiti” yaklaşımıyla ulaş.</p>
          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
            İlk teklif paketi: İngilizce web + kurumsal/fabrika filmi + fuar içerik üretimi + LinkedIn B2B iletişimi.
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center gap-3">
            <Phone size={20} />
            <h2 className="text-xl font-bold">Günün görevleri</h2>
          </div>
          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
              <div key={`${task.time}-${task.company}`} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between">
                  <strong>{task.time} · {task.company}</strong>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{task.priority}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{task.action}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Target size={20} />
            <h2 className="text-xl font-bold">Sprint hedefi</h2>
          </div>
          <div className="mt-5 space-y-4 text-sm text-muted">
            <p><strong className="text-ink">Hafta 1:</strong> 50 PLAT firması, 20 telefon, 5 toplantı.</p>
            <p><strong className="text-ink">Satış açısı:</strong> Web sitesi satma. İhracat odaklı dijital satış kiti öner.</p>
            <p><strong className="text-ink">Referans:</strong> Anahtar Creative kurumsal referansları ilk 30 saniyede güven unsuru olarak kullanılacak.</p>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <TrendingUp size={20} />
          <h2 className="text-xl font-bold">Pipeline özeti</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-5">
          {['Yeni', 'Aranacak', 'Arandı', 'Teklif', 'Takip'].map((stage) => (
            <div key={stage} className="rounded-2xl border border-line p-4">
              <div className="text-sm font-semibold text-muted">{stage}</div>
              <div className="mt-2 text-3xl font-bold">{companies.filter((c) => c.status === stage).length}</div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
