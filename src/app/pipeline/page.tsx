import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { ScoreBadge } from '@/components/ScoreBadge';
import { pipelineStages, formatCurrency } from '@/lib/data';

export default function PipelinePage() {
  return (
    <Shell>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Satış Operasyonu</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Pipeline</h1>
      <p className="mt-2 max-w-3xl text-muted">MVP’de sürükle-bırak yok; ama kolon yapısı ve satış aşamaları hazır. Sonraki sprintte gerçek etkileşim eklenir.</p>

      <div className="mt-8 grid gap-4 xl:grid-cols-5">
        {pipelineStages.map((stage) => (
          <section key={stage.key} className="min-h-[520px] rounded-3xl border border-line bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{stage.title}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{stage.companies.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {stage.companies.map((company) => (
                <Link href={`/companies/${company.id}`} key={company.id} className="block rounded-2xl border border-line p-4 hover:bg-slate-50">
                  <div className="font-semibold text-ink">{company.name}</div>
                  <div className="mt-1 text-xs text-muted">{company.city} · {company.firstService}</div>
                  <div className="mt-3"><ScoreBadge score={company.score} /></div>
                  <div className="mt-3 text-sm font-semibold">{formatCurrency(company.potentialRevenue)}</div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}
