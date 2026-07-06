import { TentTree } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { fairs } from '@/lib/data';

export default function FairsPage() {
  return (
    <Shell>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Kaynak Havuzu</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Fuarlar</h1>
      <p className="mt-2 max-w-3xl text-muted">Radar’ın müşteri bulma motoru fuar listeleriyle başlayacak. İlk kaynak Expomed, sonra makine/savunma/iklimlendirme.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {fairs.map((fair) => (
          <section key={fair.id} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100">
              <TentTree size={22} />
            </div>
            <h2 className="mt-5 text-xl font-bold">{fair.name}</h2>
            <p className="mt-1 text-sm text-muted">{fair.city} · {fair.sector}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-line p-3">
                <div className="text-muted">Katılımcı</div>
                <div className="mt-1 text-xl font-bold">{fair.companies}</div>
              </div>
              <div className="rounded-2xl border border-line p-3">
                <div className="text-muted">Sıcak aday</div>
                <div className="mt-1 text-xl font-bold">{fair.hot}</div>
              </div>
            </div>
            <div className="mt-5 rounded-full bg-slate-100 px-3 py-2 text-center text-xs font-semibold">{fair.status}</div>
          </section>
        ))}
      </div>
    </Shell>
  );
}
