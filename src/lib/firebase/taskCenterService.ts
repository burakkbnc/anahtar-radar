import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

const db = getFirebaseDb();

export type TaskCenterTask = {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  status?: string;
  type?: string;
  dueDate?: Date | null;
  createdAt?: Date | null;
};

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

export function isTaskCompleted(status?: string) {
  const normalized = String(status || "").toLowerCase();

  return ["done", "completed", "complete", "closed", "tamamlandı"].includes(
    normalized
  );
}

export function isTaskToday(date?: Date | null) {
  if (!date) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isTaskOverdue(date?: Date | null, status?: string) {
  if (!date || isTaskCompleted(status)) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  return taskDate < today;
}

export async function getTaskCenterTasks(): Promise<TaskCenterTask[]> {
  const companiesSnapshot = await getDocs(collection(db, "companies"));

  const tasks: TaskCenterTask[] = [];

  for (const companyDoc of companiesSnapshot.docs) {
    const company = companyDoc.data();
    const companyName = company.name || company.title || "İsimsiz Firma";

    const tasksQuery = query(
      collection(db, "companies", companyDoc.id, "tasks"),
      orderBy("createdAt", "desc")
    );

    const tasksSnapshot = await getDocs(tasksQuery);

    tasksSnapshot.docs.forEach((taskDoc) => {
      const task = taskDoc.data();

      tasks.push({
        id: taskDoc.id,
        companyId: companyDoc.id,
        companyName,
        title: task.title || "Başlıksız görev",
        status: task.status,
        type: task.type,
        dueDate: toDate(task.dueDate),
        createdAt: toDate(task.createdAt),
      });
    });
  }

  return tasks.sort((a, b) => {
    const aTime = a.dueDate?.getTime() || 0;
    const bTime = b.dueDate?.getTime() || 0;

    return aTime - bTime;
  });
}