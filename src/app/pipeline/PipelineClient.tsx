'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { ScoreBadge } from '@/components/ScoreBadge';
import { formatCurrency, type Company, type CompanyStatus } from '@/lib/data';
import { getCompanies, updateCompanyStatus } from '@/lib/firebase/companyService';

const statuses: CompanyStatus[] = ['Yeni', 'Aranacak', 'Arandı', 'Toplantı', 'Teklif', 'Takip', 'Kazanıldı', 'Kaybedildi'];

export function PipelineClient() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadCompanies() {
    setLoading(true);
    setMessage('');

    try {
      const data = await getCompanies();
      setCompanies(data);
      setMessage(`${data.length} firma Firestore’dan yüklendi.`);
    } catch (error) {
      console.error(error);
      setMessage('Pipeline verisi okunamadı. Firebase ayarlarını kontrol et.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  const stages = useMemo(() => {
    return statuses.map((status) => ({
      key: status,
      title: status,
      companies: companies.filter((company) => company.status === status),
    }));
  }, [companies]);

  async function handleMove(companyId: string, nextStatus: CompanyStatus) {
    const previous = companies;

    setCompanies((current) =>
      current.map((company) =>
        company.id === companyId ? { ...company, status: nextStatus } : company
      )
    );

    try {
      await updateCompanyStatus(companyId, nextStatus);
      setMessage('Pipeline güncellendi.');
    } catch (error) {
      console.error(error);
      setCompanies(previous);
      setMessage('Durum güncellenemedi. Firestore Rules kontrol et.');
    }
  }

  if (loading) {
    return <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-soft">Pipeline yükleniyor...</div>;
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {message ? <div className="rounded-2xl bg-slate-50 p-3 text-sm font-medium text-muted">{message}</div> : <div />}
        <button
          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold"
          type="button"
          onClick={loadCompanies}
        >
          <RefreshCcw size={16} /> Yenile
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-5">
        {stages.map((stage) => (
          <section key={stage.key} className="min-h-[520px] rounded-3xl border border-line bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{stage.title}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{stage.companies.length}</span>
            </div>

            <div className="mt-4 space-y-3">
              {stage.companies.map((company) => (
                <div key={company.id} className="rounded-2xl border border-line p-4 hover:bg-slate-50">
                  <Link href={`/companies/${company.id}`} className="block">
                    <div className="font-semibold text-ink">{company.name}</div>
                    <div className="mt-1 text-xs text-muted">{company.city} · {company.firstService}</div>
                    <div className="mt-3"><ScoreBadge score={company.score} /></div>
                    <div className="mt-3 text-sm font-semibold">{formatCurrency(company.potentialRevenue)}</div>
                  </Link>

                  <select
                    className="mt-4 w-full rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold outline-none"
                    value={company.status}
                    onChange={(event) => handleMove(company.id, event.target.value as CompanyStatus)}
                  >
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              ))}

              {!stage.companies.length ? (
                <div className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">
                  Bu aşamada firma yok.
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}