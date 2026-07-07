import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

const db = getFirebaseDb();

export type LeadJobStatus = "queued" | "running" | "completed" | "failed";

export type LeadJob = {
  id: string;
  title: string;
  prompt: string;
  provider: string;
  status: LeadJobStatus;
  batchId?: string;
  errorMessage?: string;
};

export async function createLeadJob({
  title,
  prompt,
  provider = "ChatGPT",
}: {
  title: string;
  prompt: string;
  provider?: string;
}) {
  const jobRef = await addDoc(collection(db, "leadJobs"), {
    title,
    prompt,
    provider,
    status: "queued",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return jobRef.id;
}

export async function updateLeadJob(
  jobId: string,
  data: Partial<{
    title: string;
    prompt: string;
    provider: string;
    status: LeadJobStatus;
    batchId: string;
    errorMessage: string;
  }>
) {
  await updateDoc(doc(db, "leadJobs", jobId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function completeLeadJob(jobId: string, batchId: string) {
  await updateDoc(doc(db, "leadJobs", jobId), {
    status: "completed",
    batchId,
    finishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getRunningJobs(): Promise<LeadJob[]> {
  const jobsQuery = query(
    collection(db, "leadJobs"),
    where("status", "in", ["queued", "running"]),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(jobsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      title: data.title || "İsimsiz AI işi",
      prompt: data.prompt || "",
      provider: data.provider || "ChatGPT",
      status: data.status || "queued",
      batchId: data.batchId || "",
      errorMessage: data.errorMessage || "",
    };
  });
}

export async function getRecentJobs(): Promise<LeadJob[]> {
  const jobsQuery = query(
    collection(db, "leadJobs"),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  const snapshot = await getDocs(jobsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      title: data.title || "İsimsiz AI işi",
      prompt: data.prompt || "",
      provider: data.provider || "ChatGPT",
      status: data.status || "queued",
      batchId: data.batchId || "",
      errorMessage: data.errorMessage || "",
    };
  });
}