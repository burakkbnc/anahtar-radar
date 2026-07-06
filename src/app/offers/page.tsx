import { FileText } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { offers, formatCurrency } from '@/lib/data';

export default function OffersPage() {
  return (
    <Shell>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Gelir Takibi</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Teklifler</h1>
      <p className="mt-2 text-muted">Açık teklif ve taslakları buradan takip edeceğiz.</p>

      <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <FileText size={20} />
          <h2 className="text-xl font-bold">Teklif listesi</h2>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">Firma</th>
                <th className="p-4">Teklif</th>
                <th className="p-4">Tutar</th>
                <th className="p-4">Durum</th>
                <th className="p-4">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-ink">{offer.company}</td>
                  <td className="p-4 text-muted">{offer.title}</td>
                  <td className="p-4 font-semibold">{formatCurrency(offer.amount)}</td>
                  <td className="p-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{offer.status}</span></td>
                  <td className="p-4 text-muted">{offer.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
