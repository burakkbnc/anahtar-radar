import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

const db = getFirebaseDb();
export type DashboardTask = {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  status?: string;
  type?: string;
  dueDate?: Date | null;
};

export type DashboardActivity = {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  type?: string;
  createdAt?: Date | null;
};

export type PipelineStageSummary = {
  stage: string;
  count: number;
  potentialRevenue: number;
};

export type DashboardStats = {
  totalCompanies: number;
  openTasks: number;
  todayCalls: number;
  overdueTasks: number;
  potentialRevenue: number;
  pipelineSummary: PipelineStageSummary[];
  todayTasks: DashboardTask[];
  recentActivities: DashboardActivity[];
};

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

function isToday(date?: Date | null) {
  if (!date) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isOverdue(date?: Date | null) {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  return taskDate < today;
}

function isOpenStatus(status?: string) {
  const normalized = String(status || "").toLowerCase();
  return !["done", "completed", "complete", "closed", "tamamlandı"].includes(
    normalized
  );
}

function getCompanyRevenue(company: any) {
  return Number(
    company.potentialRevenue ||
      company.estimatedRevenue ||
      company.expectedRevenue ||
      company.revenue ||
      0
  );
}

function getCompanyStage(company: any) {
  return company.stage || company.pipelineStage || company.status || "Yeni";
}

function isCallTask(task: any) {
  const text = `${task.title || ""} ${task.type || ""} ${
    task.category || ""
  }`.toLowerCase();

  return (
    text.includes("ara") ||
    text.includes("arama") ||
    text.includes("call") ||
    text.includes("telefon")
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const companiesSnapshot = await getDocs(collection(db, "companies"));

  const companies = companiesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];

  let openTasks = 0;
  let todayCalls = 0;
  let overdueTasks = 0;
  let potentialRevenue = 0;

  const todayTasks: DashboardTask[] = [];
  const recentActivities: DashboardActivity[] = [];
  const pipelineMap = new Map<string, PipelineStageSummary>();

  for (const company of companies) {
    const companyName = company.name || company.title || "İsimsiz Firma";
    const revenue = getCompanyRevenue(company);
    const stage = getCompanyStage(company);

    potentialRevenue += revenue;

    const currentStage = pipelineMap.get(stage) || {
      stage,
      count: 0,
      potentialRevenue: 0,
    };

    currentStage.count += 1;
    currentStage.potentialRevenue += revenue;
    pipelineMap.set(stage, currentStage);

    const tasksSnapshot = await getDocs(
      collection(db, "companies", company.id, "tasks")
    );

    tasksSnapshot.docs.forEach((taskDoc) => {
      const task = taskDoc.data();
      const dueDate = toDate(task.dueDate);

      if (isOpenStatus(task.status)) {
        openTasks += 1;
      }

      if (isOpenStatus(task.status) && isOverdue(dueDate)) {
  overdueTasks += 1;
}

      if (isOpenStatus(task.status) && isToday(dueDate)) {
        todayTasks.push({
          id: taskDoc.id,
          companyId: company.id,
          companyName,
          title: task.title || "Başlıksız görev",
          status: task.status,
          type: task.type,
          dueDate,
        });
      }

      if (isOpenStatus(task.status) && isToday(dueDate) && isCallTask(task)) {
        todayCalls += 1;
      }
    });

    const activitiesQuery = query(
      collection(db, "companies", company.id, "activities"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const activitiesSnapshot = await getDocs(activitiesQuery);

    activitiesSnapshot.docs.forEach((activityDoc) => {
      const activity = activityDoc.data();

      recentActivities.push({
        id: activityDoc.id,
        companyId: company.id,
        companyName,
        title: activity.title || activity.description || "Aktivite",
        type: activity.type,
        createdAt: toDate(activity.createdAt),
      });
    });
  }

  recentActivities.sort((a, b) => {
    return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
  });

  return {
    totalCompanies: companies.length,
    openTasks,
    todayCalls,
    overdueTasks,
    potentialRevenue,
    pipelineSummary: Array.from(pipelineMap.values()),
    todayTasks: todayTasks.slice(0, 8),
    recentActivities: recentActivities.slice(0, 8),
  };
}
export async function completeDashboardTask(
  companyId: string,
  taskId: string
) {
  const taskRef = doc(db, "companies", companyId, "tasks", taskId);

  await updateDoc(taskRef, {
    status: "completed",
    completedAt: new Date(),
    updatedAt: new Date(),
  });
}