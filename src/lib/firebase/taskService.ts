import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from './client';
import type { Task, TaskStatus } from '@/lib/data';

function getTasksRef(companyId: string) {
  return collection(getFirebaseDb(), 'companies', companyId, 'tasks');
}

export async function getTasks(companyId: string): Promise<Task[]> {
  const snapshot = await getDocs(query(getTasksRef(companyId), orderBy('createdAt', 'desc')));

  return snapshot.docs.map((item) => ({
    id: item.id,
    companyId,
    ...item.data(),
  } as Task));
}

export async function addTask(input: {
  companyId: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
}) {
  return addDoc(getTasksRef(input.companyId), {
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    assignedTo: input.assignedTo,
    status: 'todo',
    createdAt: serverTimestamp(),
  });
}

export async function updateTaskStatus(companyId: string, taskId: string, status: TaskStatus) {
  return updateDoc(doc(getFirebaseDb(), 'companies', companyId, 'tasks', taskId), {
    status,
  });
}

export async function deleteTask(companyId: string, taskId: string) {
  return deleteDoc(doc(getFirebaseDb(), 'companies', companyId, 'tasks', taskId));
}