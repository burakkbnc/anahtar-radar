import { CheckCircle2, Clock3 } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { tasks } from '@/lib/data';

export default function TasksPage() {
  return (
    <Shell>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Operasyon</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Görevler</h1>
      <p className="mt-2 text-muted">Bugünkü arama, araştırma ve teklif takipleri.</p>

      <div className="mt-8 grid gap-4">
        {tasks.map((task) => (
          <div key={`${task.time}-${task.company}`} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100">
                  <Clock3 size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold">{task.time} · {task.company}</div>
                  <p className="mt-1 text-muted">{task.action}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{task.type}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{task.priority}</span>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                <CheckCircle2 size={16} /> Tamamlandı
              </button>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
