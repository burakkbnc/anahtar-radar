"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  completeDashboardTask,
  DashboardStats,
  getDashboardStats,
} from "@/lib/firebase/dashboardService";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshDashboard() {
    setLoading(true);
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }

  async function handleCompleteTask(companyId: string, taskId: string) {
    await completeDashboardTask(companyId, taskId);
    await refreshDashboard();
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
        Dashboard verileri yükleniyor...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-red-500">
        Dashboard verileri alınamadı.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Satış operasyonunun canlı özeti
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <KpiCard title="Toplam Firma" value={stats.totalCompanies} href="/tasks" />
        <KpiCard title="Açık Görev" value={stats.openTasks} href="/tasks"/>
        <KpiCard title="Bugün Aranacak" value={stats.todayCalls} href="/tasks" />
        <KpiCard title="Geciken Görev" value={stats.overdueTasks} href="/tasks" />
        <KpiCard title="Potansiyel Ciro" value={formatCurrency(stats.potentialRevenue)} href="/pipeline" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Pipeline Özeti
          </h2>

          <div className="space-y-3">
            {stats.pipelineSummary.length === 0 ? (
              <EmptyText text="Pipeline verisi bulunamadı." />
            ) : (
              stats.pipelineSummary.map((item) => (
                <Link
                  key={item.stage}
                  href="/pipeline"
                  className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.stage}</p>
                    <p className="text-xs text-slate-500">
                      {item.count} firma
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    {formatCurrency(item.potentialRevenue)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Bugünkü Görevler
          </h2>

          <div className="space-y-3">
            {stats.todayTasks.length === 0 ? (
              <EmptyText text="Bugün için açık görev yok." />
            ) : (
              stats.todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border px-4 py-3 transition hover:bg-slate-50"
                >
                  <Link href={`/companies/${task.companyId}`} className="flex-1">
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.companyName}</p>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleCompleteTask(task.companyId, task.id)}
                    className="ml-4 rounded-lg border px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Tamamla
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Son Aktiviteler
        </h2>

        <div className="space-y-3">
          {stats.recentActivities.length === 0 ? (
            <EmptyText text="Henüz aktivite bulunmuyor." />
          ) : (
            stats.recentActivities.map((activity) => (
              <Link
                key={activity.id}
                href={`/companies/${activity.companyId}`}
                className="block rounded-xl border px-4 py-3 transition hover:bg-slate-50"
              >
                <p className="font-medium text-slate-900">{activity.title}</p>
                <p className="text-xs text-slate-500">
                  {activity.companyName}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string | number;
  href?: string;
}) {
  const card = (
    <div className="rounded-2xl border bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );

  if (!href) return card;

  return <Link href={href}>{card}</Link>;
}

function EmptyText({ text }: { text: string }) {
  return <p className="text-sm text-slate-400">{text}</p>;
}