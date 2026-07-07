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

export type LeadJobResultStatus = "new" | "selected" | "imported" | "rejected";

export type LeadJobResult = {
  id: string;
  jobId: string;
  companyName: string;
  website?: string;
  phone?: string;
  email?: string;
  city?: string;
  sector?: string;
  score?: number;
  notes?: string;
  status?: LeadJobResultStatus;
};

export async function createLeadJobResult({
  jobId,
  companyName,
  website = "",
  phone = "",
  email = "",
  city = "",
  sector = "",
  score = 0,
  notes = "",
  status = "new",
}: Omit<LeadJobResult, "id">) {
  const resultRef = await addDoc(collection(db, "leadJobs", jobId, "results"), {
    companyName,
    website,
    phone,
    email,
    city,
    sector,
    score,
    notes,
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return resultRef.id;
}

export async function getLeadJobResults(
  jobId: string
): Promise<LeadJobResult[]> {
  const resultsQuery = query(
    collection(db, "leadJobs", jobId, "results"),
    orderBy("score", "desc")
  );

  const snapshot = await getDocs(resultsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      jobId,
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

export async function markLeadJobResultsAsImported({
  jobId,
  resultIds,
}: {
  jobId: string;
  resultIds: string[];
}) {
  await Promise.all(
    resultIds.map((resultId) =>
      updateDoc(doc(db, "leadJobs", jobId, "results", resultId), {
        status: "imported",
        updatedAt: serverTimestamp(),
      })
    )
  );
}

export async function createMockLeadJobResults(jobId: string) {
  const mockResults = [
    {
      companyName: "Ankara Medikal Sistemleri",
      website: "https://example.com",
      phone: "0312 000 00 01",
      email: "info@example.com",
      city: "Ankara",
      sector: "Sağlık / Medikal",
      score: 88,
      notes: "Kamu referansları ve sağlık iletişimi çalışmaları için uygun aday.",
      status: "new" as const,
    },
    {
      companyName: "Kapadokya Turizm Yatırımları",
      website: "https://example.com",
      phone: "0384 000 00 02",
      email: "hello@example.com",
      city: "Nevşehir",
      sector: "Turizm",
      score: 82,
      notes: "Bölgesel tanıtım, içerik üretimi ve dijital kampanya ihtiyacı olabilir.",
      status: "new" as const,
    },
    {
      companyName: "Endüstriyel Kimya Merkezi",
      website: "https://example.com",
      phone: "0212 000 00 03",
      email: "info@example.com",
      city: "İstanbul",
      sector: "Kimya / Sanayi",
      score: 79,
      notes: "Kurumsal iletişim, fuar ve B2B pazarlama potansiyeli yüksek.",
      status: "new" as const,
    },
  ];

  await Promise.all(
    mockResults.map((result) =>
      createLeadJobResult({
        jobId,
        ...result,
      })
    )
  );
}