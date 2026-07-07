import { formatCurrency, type Company } from '@/lib/data';

export function CompanyAiCard({ company }: { company: Company }) {
  return (
    <section className="rounded-3xl border border-line bg-ink p-6 text-white shadow-soft">
      <h2 className="text-xl font-bold">AI satış önerisi</h2>
      <p className="mt-4 leading-7 text-slate-200">{company.note}</p>

      <div className="mt-5 rounded-2xl bg-white/10 p-4">
        <div className="text-sm text-slate-300">Tahmini proje potansiyeli</div>
        <div className="mt-2 text-2xl font-bold">
          {formatCurrency(company.potentialRevenue)}
        </div>
      </div>
    </section>
  );
}