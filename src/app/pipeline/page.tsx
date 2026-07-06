import { Shell } from '@/components/Shell';
import { PipelineClient } from './PipelineClient';

export default function PipelinePage() {
  return (
    <Shell>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Satış Operasyonu</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Pipeline</h1>
      <p className="mt-2 max-w-3xl text-muted">
        Firestore’daki firmaları satış aşamalarına göre canlı gösterir. Kart üzerinden aşama değiştirilebilir.
      </p>

      <PipelineClient />
    </Shell>
  );
}