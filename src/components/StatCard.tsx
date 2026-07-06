export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-ink">{value}</div>
      <div className="mt-2 text-sm text-muted">{hint}</div>
    </div>
  );
}
