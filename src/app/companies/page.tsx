import { Shell } from '@/components/Shell';
import { CompanyCRM } from '@/components/CompanyCRM';

export default function CompaniesPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">CRM</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink">Firmalar</h1>
        <p className="text-muted">PLAT hedef listesi. Import butonu ile demo firmaları Firestore’a aktarabilir, durumları CRM içinde güncelleyebilirsin.</p>
      </div>
      <CompanyCRM />
    </Shell>
  );
}
