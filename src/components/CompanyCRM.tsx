'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Database, Plus, RefreshCcw, Search } from 'lucide-react';
import { ScoreBadge } from '@/components/ScoreBadge';
import { companies as seedData, formatCurrency, type Company, type CompanyStatus } from '@/lib/data';
import { addCompany, getCompanies, seedCompanies, updateCompanyStatus } from '@/lib/firebase/companyService';

const statuses: CompanyStatus[] = ['Yeni', 'Aranacak', 'Arandı', 'Toplantı', 'Teklif', 'Takip', 'Kazanıldı', 'Kaybedildi'];

export function CompanyCRM() {
  const [items, setItems] = useState<Company[]>(seedData);
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('Tümü');
  const [status, setStatus] = useState<CompanyStatus | 'Tümü'>('Tümü');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  async function loadCompanies() {
    setLoading(true);
    setMessage('');
    try {
      const firestoreCompanies = await getCompanies();
      if (firestoreCompanies.length) {
        setItems(firestoreCompanies);
        setMessage(`${firestoreCompanies.length} firma Firestore’dan yüklendi.`);
      } else {
        setItems(seedData);
        setMessage('Firestore boş. Demo PLAT verisi gösteriliyor. İstersen tek tıkla içeri aktar.');
      }
    } catch (error) {
      console.error(error);
      setItems(seedData);
      setMessage('Firestore okunamadı. Demo PLAT verisi gösteriliyor. Rules ve env kontrol edilebilir.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  const sectors = useMemo(() => ['Tümü', ...Array.from(new Set(items.map((item) => item.sector))).sort()], [items]);

  const filtered = useMemo(() => {
    return items.filter((company) => {
      const text = `${company.name} ${company.city} ${company.sector} ${company.firstService}`.toLocaleLowerCase('tr-TR');
      const q = query.toLocaleLowerCase('tr-TR');
      const matchesQuery = !q || text.includes(q);
      const matchesSector = sector === 'Tümü' || company.sector === sector;
      const matchesStatus = status === 'Tümü' || company.status === status;
      return matchesQuery && matchesSector && matchesStatus;
    });
  }, [items, query, sector, status]);

  async function handleSeed() {
    setLoading(true);
    setMessage('PLAT firmaları Firestore’a aktarılıyor...');
    try {
      await seedCompanies(seedData);
      await loadCompanies();
      setMessage(`${seedData.length} PLAT firması Firestore’a aktarıldı.`);
    } catch (error) {
      console.error(error);
      setMessage('Aktarım başarısız. Firestore Rules alanında read/write iznini kontrol et.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(companyId: string, nextStatus: CompanyStatus) {
    setItems((current) => current.map((company) => company.id === companyId ? { ...company, status: nextStatus } : company));
    try {
      await updateCompanyStatus(companyId, nextStatus);
    } catch (error) {
      console.error(error);
      setMessage('Durum yerelde değişti ama Firestore’a yazılamadı. Rules kontrol et.');
    }
  }

  async function handleAddCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const city = String(formData.get('city') ?? '').trim();
    const newSector = String(formData.get('sector') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim() || 'Santral araştırılacak';
    const email = String(formData.get('email') ?? '').trim() || 'Genel mail araştırılacak';
    const website = String(formData.get('website') ?? '').trim() || 'Araştırılacak';

    if (!name || !city || !newSector) return;

    setLoading(true);
    try {
      await addCompany({
        name,
        city,
        sector: newSector,
        score: 70,
        status: 'Yeni',
        website,
        email,
        phone,
        linkedin: 'LinkedIn firma/karar verici araştırılacak',
        firstService: 'İlk hizmet araştırılacak',
        nextAction: 'İlk arama yapılacak',
        owner: 'Burak',
      });
      setFormOpen(false);
      await loadCompanies();
      setMessage(`${name} eklendi.`);
    } catch (error) {
      console.error(error);
      setMessage('Firma eklenemedi. Firestore Rules kontrol et.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr] xl:min-w-[760px]">
            <div className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
              <Search size={18} className="text-muted" />
              <input className="w-full outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Firma, şehir, sektör ara..." />
            </div>
            <select className="rounded-2xl border border-line px-4 py-3 outline-none" value={sector} onChange={(event) => setSector(event.target.value)}>
              {sectors.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="rounded-2xl border border-line px-4 py-3 outline-none" value={status} onChange={(event) => setStatus(event.target.value as CompanyStatus | 'Tümü')}>
              <option>Tümü</option>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-semibold" onClick={loadCompanies} type="button" disabled={loading}>
              <RefreshCcw size={16} /> Yenile
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-semibold" onClick={handleSeed} type="button" disabled={loading}>
              <Database size={16} /> PLAT import
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white" onClick={() => setFormOpen((value) => !value)} type="button">
              <Plus size={16} /> Firma Ekle
            </button>
          </div>
        </div>

        {message ? <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-medium text-muted">{message}</div> : null}

        {formOpen ? (
          <form className="mt-5 grid gap-3 rounded-2xl border border-line bg-slate-50 p-4 md:grid-cols-3" onSubmit={handleAddCompany}>
            <input name="name" className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Firma adı" required />
            <input name="sector" className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Sektör" required />
            <input name="city" className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Şehir" required />
            <input name="phone" className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Telefon" />
            <input name="email" className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Genel e-posta" />
            <input name="website" className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Web sitesi" />
            <button className="rounded-2xl bg-ink px-4 py-3 font-semibold text-white md:col-span-3" type="submit" disabled={loading}>Kaydet</button>
          </form>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="p-4">Firma</th>
              <th className="p-4">Şehir</th>
              <th className="p-4">İlk Satılacak Hizmet</th>
              <th className="p-4">Puan</th>
              <th className="p-4">Durum</th>
              <th className="p-4">Potansiyel</th>
              <th className="p-4">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((company) => (
              <tr key={company.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-ink">
                  <Link href={`/companies/${company.id}`}>{company.name}</Link>
                  <div className="mt-1 text-xs font-normal text-muted">{company.sector}</div>
                </td>
                <td className="p-4 text-muted">{company.city}</td>
                <td className="p-4 text-muted">{company.firstService}</td>
                <td className="p-4"><ScoreBadge score={company.score} /></td>
                <td className="p-4">
                  <select className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold outline-none" value={company.status} onChange={(event) => handleStatusChange(company.id, event.target.value as CompanyStatus)}>
                    {statuses.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </td>
                <td className="p-4 font-semibold">{formatCurrency(company.potentialRevenue)}</td>
                <td className="p-4">
                  <Link className="rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white" href={`/companies/${company.id}`}>Kart</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-muted">Gösterilen: <strong className="text-ink">{filtered.length}</strong> / {items.length} firma</div>
    </div>
  );
}
