import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './client';
import type { Activity, ActivityType } from '@/lib/data';

function getActivitiesRef(companyId: string) {
  return collection(getFirebaseDb(), 'companies', companyId, 'activities');
}

export async function getActivities(companyId: string): Promise<Activity[]> {
  const snapshot = await getDocs(query(getActivitiesRef(companyId), orderBy('createdAt', 'desc')));

  return snapshot.docs.map((item) => ({
    id: item.id,
    companyId,
    ...item.data(),
  } as Activity));
}

export async function addActivity(input: {
  companyId: string;
  type: ActivityType;
  title: string;
  description: string;
  createdBy: string;
}) {
  return addDoc(getActivitiesRef(input.companyId), {
    type: input.type,
    title: input.title,
    description: input.description,
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
  });
}

export async function deleteActivity(companyId: string, activityId: string) {
  await deleteDoc(doc(getFirebaseDb(), 'companies', companyId, 'activities', activityId));
}