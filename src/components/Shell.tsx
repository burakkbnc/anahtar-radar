import Link from 'next/link';
import { BarChart3, Building2, CalendarDays, CheckSquare, FileText, Radar, Settings, Sparkles, KanbanSquare, TentTree, Search, } from 'lucide-react';

const nav = [
  { href: '/', label: 'Bugün', icon: BarChart3 },
  { href: '/companies', label: 'Firmalar', icon: Building2 },
  { href: '/leads', label: 'Lead Radar', icon: Search },
  { href: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { href: '/tasks', label: 'Görevler', icon: CheckSquare },
  { href: '/offers', label: 'Teklifler', icon: FileText },
  { href: '/fairs', label: 'Fuarlar', icon: TentTree },
  { href: '/ai', label: 'AI Analiz', icon: Sparkles },
  { href: '#', label: 'Ayarlar', icon: Settings }
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-white p-6 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
            <Radar size={22} />
          </div>
          <div>
            <div className="text-lg font-bold">Anahtar Radar</div>
            <div className="text-xs text-muted">Satış Operasyonu MVP</div>
          </div>
        </Link>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-ink p-5 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold"><CalendarDays size={16} /> Bugünün odağı</div>
          <p className="mt-2 text-sm text-slate-300">PLAT üreticilerinde ilk 20 telefon ve 5 toplantı hedefi.</p>
        </div>
      </aside>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
