import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import {
  normalizeLeadList,
  RawLeadInput,
} from "./leadNormalizer";
import { validateLead } from "./leadValidator";

const db = getFirebaseDb();

export type LeadImportResult = {
  batchId: string;
  total: number;
  imported: number;
  skipped: number;
};

export async function createLeadBatchFromRawInput({
  title,
  source = "PLAT",
  rawLeads,
}: {
  title: string;
  source?: string;
  rawLeads: RawLeadInput[];
}): Promise<LeadImportResult> {
  const normalizedLeads = normalizeLeadList(rawLeads);

  const batchRef = await addDoc(collection(db, "leadBatches"), {
    title,
    source,
    status: "review",
    totalLeads: normalizedLeads.length,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  let imported = 0;
  let skipped = 0;

  for (const lead of normalizedLeads) {
    const validation = validateLead(lead);

    if (!validation.isValid) {
      skipped += 1;
      continue;
    }

    await addDoc(collection(db, "leadBatches", batchRef.id, "leads"), {
      companyName: lead.companyName,
      website: lead.website,
      phone: lead.phone,
      email: lead.email,
      city: lead.city,
      sector: lead.sector,
      notes: lead.notes,
      source: lead.source || source,
      score: lead.score,
      status: "new",
      warnings: validation.warnings,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    imported += 1;
  }

  return {
    batchId: batchRef.id,
    total: rawLeads.length,
    imported,
    skipped,
  };
}