export function ScoreBadge({ score }: { score: number }) {
  const label = score >= 90 ? 'Sıcak' : score >= 80 ? 'Güçlü' : 'Takip';
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold">
      <span className="h-2 w-2 rounded-full bg-ink" />
      {score}/100 · {label}
    </div>
  );
}
