import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
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
  importedCompanyId?: string;
  duplicateDetected?: boolean;
};

function buildSalesIntelligence(lead: LeadItem) {
  const sector = lead.sector || "Genel";
  const city = lead.city || "Araştırılacak";
  const score = lead.score || 0;

  const isHighScore = score >= 80;
  const isIndustrial =
    sector.toLowerCase().includes("sanayi") ||
    sector.toLowerCase().includes("kimya") ||
    sector.toLowerCase().includes("medikal") ||
    sector.toLowerCase().includes("üretim");

  const firstService = isIndustrial
    ? "Kurumsal web + B2B LinkedIn + tanıtım filmi"
    : "Sosyal medya + kurumsal iletişim + dijital kampanya";

  const potentialRevenue = isHighScore ? 450000 : score >= 60 ? 250000 : 120000;

  const signals = [
    `AI Discovery skoru: ${score}`,
    `${city} lokasyonunda potansiyel müşteri`,
    `${sector} sektöründe Anahtar Creative hizmetleri için uygun aday`,
  ];

  const weaknesses = [
    lead.website ? "Web sitesi kontrol edilecek" : "Web sitesi eksik",
    lead.email ? "Genel e-posta mevcut" : "E-posta bilgisi eksik",
    lead.phone ? "Telefon bilgisi mevcut" : "Telefon bilgisi eksik",
    "Karar verici LinkedIn üzerinden araştırılacak",
  ];

  const services = isIndustrial
    ? [
        "Kurumsal web sitesi",
        "LinkedIn B2B iletişimi",
        "Kurumsal tanıtım filmi",
        "Fuar iletişim materyalleri",
      ]
    : [
        "Sosyal medya yönetimi",
        "Kurumsal iletişim",
        "Dijital reklam kampanyası",
        "Marka içerik üretimi",
      ];

  const note = [
    lead.notes || "AI Discovery üzerinden CRM’ye aktarıldı.",
    "",
    "İlk temas stratejisi:",
    isIndustrial
      ? "Sosyal medya satışıyla değil; kurumsal güven, B2B satış, fuar ve tanıtım filmi ihtiyacı üzerinden yaklaş."
      : "Marka görünürlüğü, düzenli içerik üretimi ve dijital kampanya ihtiyacı üzerinden yaklaş.",
  ].join("\n");

  return {
    productGroup: sector,
    fair: "AI Discovery",
    reference: "Anahtar Creative referansları",
    potentialRevenue,
    employeeBand: "Araştırılacak",
    exportFocus: isIndustrial ? "Orta" : "Düşük",
    firstService,
    nextAction: "Karar verici araştırılacak ve ilk tanışma araması yapılacak",
    owner: "Burak",
    signals,
    weaknesses,
    services,
    note,
  };
}

async function findExistingCompany(lead: LeadItem) {
  if (lead.website) {
    const websiteSnapshot = await getDocs(
      query(collection(db, "companies"), where("website", "==", lead.website))
    );

    if (!websiteSnapshot.empty) {
      return websiteSnapshot.docs[0].id;
    }
  }

  if (lead.email) {
    const emailSnapshot = await getDocs(
      query(collection(db, "companies"), where("email", "==", lead.email))
    );

    if (!emailSnapshot.empty) {
      return emailSnapshot.docs[0].id;
    }
  }

  const nameSnapshot = await getDocs(
    query(collection(db, "companies"), where("name", "==", lead.companyName))
  );

  if (!nameSnapshot.empty) {
    return nameSnapshot.docs[0].id;
  }

  return "";
}

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
      importedCompanyId: data.importedCompanyId || "",
      duplicateDetected: Boolean(data.duplicateDetected),
    };
  });
}

export async function importLeadToCompany(lead: LeadItem) {
  const existingCompanyId = await findExistingCompany(lead);

  if (existingCompanyId) {
    await updateDoc(doc(db, "leadBatches", lead.batchId, "leads", lead.id), {
      status: "imported",
      importedCompanyId: existingCompanyId,
      duplicateDetected: true,
      importedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "companies", existingCompanyId, "activities"), {
      title: "Tekrar gelen lead tespit edildi",
      description:
        "Bu lead daha önce CRM’de kayıtlı olduğu için mevcut firma ile eşleştirildi.",
      type: "note",
      createdBy: "Anahtar Radar",
      createdAt: serverTimestamp(),
    });

    return existingCompanyId;
  }

  const intelligence = buildSalesIntelligence(lead);

  const companyRef = await addDoc(collection(db, "companies"), {
    name: lead.companyName,
    website: lead.website || "Araştırılacak",
    phone: lead.phone || "Santral araştırılacak",
    email: lead.email || "Genel mail araştırılacak",
    city: lead.city || "Araştırılacak",
    district: "",
    sector: lead.sector || "Araştırılacak",
    linkedin: "LinkedIn firma/karar verici araştırılacak",
    score: lead.score || 0,
    status: "Yeni",
    source: lead.status || "AI Discovery",
    pipelineStage: "Yeni Lead",
    ...intelligence,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "companies", companyRef.id, "tasks"), {
    title: "İlk tanışma araması yap",
    description: intelligence.nextAction,
    type: "call",
    status: "todo",
    dueDate: new Date().toISOString().slice(0, 10),
    assignedTo: "Burak",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "companies", companyRef.id, "activities"), {
    title: "Lead Radar üzerinden CRM’ye aktarıldı",
    description: intelligence.note,
    type: "note",
    createdBy: "Anahtar Radar",
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "leadBatches", lead.batchId, "leads", lead.id), {
    status: "imported",
    importedCompanyId: companyRef.id,
    duplicateDetected: false,
    importedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return companyRef.id;
}