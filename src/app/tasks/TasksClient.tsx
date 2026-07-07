"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getTaskCenterTasks,
  isTaskCompleted,
  isTaskOverdue,
  isTaskToday,
  TaskCenterTask,
} from "@/lib/firebase/taskCenterService";
import { completeDashboardTask } from "@/lib/firebase/dashboardService";

type FilterType = "open" | "today" | "overdue" | "completed" | "all";

function formatDate(date?: Date | null) {
  if (!date) return "Tarih yok";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function TasksClient() {
  const [tasks, setTasks] = useState<TaskCenterTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("open");

  async function refreshTasks() {
    setLoading(true);
    getTaskCenterTasks()
      .then(setTasks)
      .finally(() => setLoading(false));
  }

  async function handleCompleteTask(companyId: string, taskId: string) {
    await completeDashboardTask(companyId, taskId);
    await refreshTasks();
  }

  useEffect(() => {
    refreshTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "open") return !isTaskCompleted(task.status);
      if (filter === "today") {
        return isTaskToday(task.dueDate) && !isTaskCompleted(task.status);
      }
      if (filter === "overdue") {
        return isTaskOverdue(task.dueDate, task.status);
      }
      if (filter === "completed") return isTaskCompleted(task.status);

      return true;
    });
  }, [tasks, filter]);

  const openCount = tasks.filter((task) => !isTaskCompleted(task.status)).length;
  const todayCount = tasks.filter(
    (task) => isTaskToday(task.dueDate) && !isTaskCompleted(task.status)
  ).length;
  const overdueCount = tasks.filter((task) =>
    isTaskOverdue(task.dueDate, task.status)
  ).length;
  const completedCount = tasks.filter((task) =>
    isTaskCompleted(task.status)
  ).length;

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
        Görevler yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Görev Merkezi</h1>
        <p className="text-sm text-slate-500">
          Tüm firma görevlerini tek ekrandan takip edin.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard title="Açık Görev" value={openCount} />
        <SummaryCard title="Bugün" value={todayCount} />
        <SummaryCard title="Geciken" value={overdueCount} />
        <SummaryCard title="Tamamlanan" value={completedCount} />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === "open"} onClick={() => setFilter("open")}>
          Açık
        </FilterButton>
        <FilterButton active={filter === "today"} onClick={() => setFilter("today")}>
          Bugün
        </FilterButton>
        <FilterButton
          active={filter === "overdue"}
          onClick={() => setFilter("overdue")}
        >
          Geciken
        </FilterButton>
        <FilterButton
          active={filter === "completed"}
          onClick={() => setFilter("completed")}
        >
          Tamamlanan
        </FilterButton>
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          Tümü
        </FilterButton>
      </div>

      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Görev Listesi
        </h2>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-sm text-slate-400">
              Bu filtreye uygun görev bulunamadı.
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={`${task.companyId}-${task.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
              >
                <Link href={`/companies/${task.companyId}`} className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <StatusBadge task={task} />
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {task.companyName} · {formatDate(task.dueDate)}
                  </p>
                </Link>

                {!isTaskCompleted(task.status) && (
                  <button
                    type="button"
                    onClick={() => handleCompleteTask(task.companyId, task.id)}
                    className="rounded-lg border px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Tamamla
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          : "rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}

function StatusBadge({ task }: { task: TaskCenterTask }) {
  if (isTaskCompleted(task.status)) {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
        Tamamlandı
      </span>
    );
  }

  if (isTaskOverdue(task.dueDate, task.status)) {
    return (
      <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
        Gecikmiş
      </span>
    );
  }

  if (isTaskToday(task.dueDate)) {
    return (
      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
        Bugün
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
      Açık
    </span>
  );
}