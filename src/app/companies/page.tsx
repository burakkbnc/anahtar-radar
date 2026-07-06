import Link from 'next/link';
import { Search } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { ScoreBadge } from '@/components/ScoreBadge';
import { companies, formatCurrency } from '@/lib/data';

export default function CompaniesPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">CRM</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink">Firmalar</h1>
        <p className="text-muted">Medikal üretici hedef listesi. Buradaki bilgiler ilk satış operasyonu için mock/araştırma kuyruğu mantığında hazırlandı.</p>
      </div>

      <div className="mt-8 rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
          <Search size={18} className="text-muted" />
          <input className="w-full outline-none" placeholder="Firma, şehir, sektör ara..." />
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">Firma</th>
                <th className="p-4">Şehir</th>
                <th className="p-4">İlk Satılacak Hizmet</th>
                <th className="p-4">Puan</th>
                <th className="p-4">Durum</th>
                <th className="p-4">Potansiyel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-ink">
                    <Link href={`/companies/${company.id}`}>{company.name}</Link>
                    <div className="mt-1 text-xs font-normal text-muted">{company.productGroup}</div>
                  </td>
                  <td className="p-4 text-muted">{company.city}</td>
                  <td className="p-4 text-muted">{company.firstService}</td>
                  <td className="p-4"><ScoreBadge score={company.score} /></td>
                  <td className="p-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{company.status}</span></td>
                  <td className="p-4 font-semibold">{formatCurrency(company.potentialRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
