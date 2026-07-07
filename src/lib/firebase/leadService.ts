import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

const db = getFirebaseDb();

export type LeadBatch = {
  id: string;
  title: string;
  source?: string;
  status?: string;
};

export type LeadItem = {
  id: string;
  batchId: string;
  companyName: string;
  website?: string;
  phone?: string;
  email?: string;
  city?: string;
  sector?: string;
  score?: number;
  notes?: string;
  status?: string;
};

export async function getLeadBatches(): Promise<LeadBatch[]> {
  const batchesQuery = query(
    collection(db, "leadBatches"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(batchesQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      title: data.title || "İsimsiz Lead Listesi",
      source: data.source || "Manual",
      status: data.status || "review",
    };
  });
}

export async function getLeadsByBatch(batchId: string): Promise<LeadItem[]> {
  const leadsQuery = query(
    collection(db, "leadBatches", batchId, "leads"),
    orderBy("score", "desc")
  );

  const snapshot = await getDocs(leadsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      batchId,
      companyName: data.companyName || "İsimsiz Firma",
      website: data.website || "",
      phone: data.phone || "",
      email: data.email || "",
      city: data.city || "",
      sector: data.sector || "",
      score: Number(data.score || 0),
      notes: data.notes || "",
      status: data.status || "new",
    };
  });
}

export async function importLeadToCompany(lead: LeadItem) {
  const companyRef = await addDoc(collection(db, "companies"), {
    name: lead.companyName,
    website: lead.website || "",
    phone: lead.phone || "",
    email: lead.email || "",
    city: lead.city || "",
    sector: lead.sector || "",
    source: "PLAT",
    leadScore: lead.score || 0,
    notes: lead.notes || "",
    pipelineStage: "Yeni Lead",
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "companies", companyRef.id, "tasks"), {
    title: "İlk tanışma araması yap",
    type: "call",
    status: "open",
    dueDate: new Date(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "companies", companyRef.id, "activities"), {
    title: "Lead Radar üzerinden CRM’ye aktarıldı",
    type: "system",
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "leadBatches", lead.batchId, "leads", lead.id), {
    status: "imported",
    importedCompanyId: companyRef.id,
    importedAt: serverTimestamp(),
  });

  return companyRef.id;
}