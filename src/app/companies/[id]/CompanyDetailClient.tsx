'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { Shell } from '@/components/Shell';
import { ScoreBadge } from '@/components/ScoreBadge';
import { formatCurrency, type Company, type CompanyStatus } from '@/lib/data';
import { deleteCompany, getCompany, updateCompany } from '@/lib/firebase/companyService';

const statuses: CompanyStatus[] = ['Yeni', 'Aranacak', 'Arandı', 'Toplantı', 'Teklif', 'Takip', 'Kazanıldı', 'Kaybedildi'];

export function CompanyDetailClient({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [message, setMessage] = useState('');

  async function loadCompany() {
    setLoading(true);
    setMessage('');

    try {
      const data = await getCompany(companyId);
      setCompany(data);
    } catch (error) {
      console.error(error);
      setMessage('Firma bilgisi okunamadı.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompany();
  }, [companyId]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!company) return;

    const formData = new FormData(event.currentTarget);

    const payload: Partial<Company> = {
      name: String(formData.get('name') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      sector: String(formData.get('sector') ?? '').trim(),
      productGroup: String(formData.get('sector') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      website: String(formData.get('website') ?? '').trim(),
      firstService: String(formData.get('firstService') ?? '').trim(),
      nextAction: String(formData.get('nextAction') ?? '').trim(),
      owner: String(formData.get('owner') ?? '').trim(),
      status: String(formData.get('status') ?? 'Yeni') as CompanyStatus,
      potentialRevenue: Number(formData.get('potentialRevenue') ?? 0),
    };

    setSaving(true);

    try {
      await updateCompany(company.id, payload);
      setEditOpen(false);
      setMessage('Firma güncellendi.');
      await loadCompany();
    } catch (error) {
      console.error(error);
      setMessage('Firma güncellenemedi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!company) return;

    const confirmed = window.confirm(`${company.name} silinsin mi?`);
    if (!confirmed) return;

    setSaving(true);

    try {
      await deleteCompany(company.id);
      router.push('/companies');
    } catch (error) {
      console.error(error);
      setMessage('Firma silinemedi.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Shell>
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">Firma yükleniyor...</div>
      </Shell>
    );
  }

  if (!company) {
    return (
      <Shell>
        <Link href="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Firmalara dön
        </Link>
        <div className="mt-5 rounded-3xl border border-line bg-white p-6 shadow-soft">Firma bulunamadı.</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Firmalara dön
        </Link>

        <div className="flex gap-2">
          <button
            className="rounded-2xl border border-line px-4 py-3 text-sm font-semibold"
            type="button"
            onClick={() => setEditOpen((value) => !value)}
          >
            Düzenle
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white"
            type="button"
            onClick={handleDelete}
            disabled={saving}
          >
            <Trash2 size={16} /> Sil
          </button>
        </div>
      </div>

      {message ? <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-medium text-muted">{message}</div> : null}

      {editOpen ? (
        <form className="mt-5 grid gap-3 rounded-3xl border border-line bg-white p-5 shadow-soft md:grid-cols-3" onSubmit={handleUpdate}>
          <input name="name" defaultValue={company.name} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Firma adı" required />
          <input name="sector" defaultValue={company.sector} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Sektör" required />
          <input name="city" defaultValue={company.city} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Şehir" required />
          <input name="phone" defaultValue={company.phone} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Telefon" />
          <input name="email" defaultValue={company.email} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Mail" />
          <input name="website" defaultValue={company.website} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Web sitesi" />
          <input name="firstService" defaultValue={company.firstService} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="İlk hizmet" />
          <input name="nextAction" defaultValue={company.nextAction} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Sonraki adım" />
          <input name="owner" defaultValue={company.owner} className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Sorumlu" />
          <input name="potentialRevenue" defaultValue={company.potentialRevenue} type="number" className="rounded-2xl border border-line px-4 py-3 outline-none" placeholder="Potansiyel" />
          <select name="status" defaultValue={company.status} className="rounded-2xl border border-line px-4 py-3 outline-none">
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <button className="rounded-2xl bg-ink px-4 py-3 font-semibold text-white md:col-span-3" type="submit" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      ) : null}

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
              Merhaba, ben Burak. Anahtar Creative olarak üretici firmalara yönelik kurumsal iletişim, fuar içerikleri ve dijital satış materyalleri geliştiriyoruz. Firmanızı PLAT/private label üretici ağı içinde gördük; özellikle ihracat ve B2B satış iletişimi tarafında kısa bir analiz paylaşmak isteriz. Uygunsa kısa bir tanışma toplantısı planlamak isterim.
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