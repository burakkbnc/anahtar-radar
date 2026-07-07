"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getLeadBatches,
  getLeadsByBatch,
  importLeadToCompany,
  LeadBatch,
  LeadItem,
} from "@/lib/firebase/leadService";

export default function LeadsClient() {
  const [batches, setBatches] = useState<LeadBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [importingLeadId, setImportingLeadId] = useState("");

  async function refreshBatches() {
    setLoading(true);

    const batchList = await getLeadBatches();
    setBatches(batchList);

    const firstBatchId = selectedBatchId || batchList[0]?.id || "";
    setSelectedBatchId(firstBatchId);

    if (firstBatchId) {
      const leadList = await getLeadsByBatch(firstBatchId);
      setLeads(leadList);
    } else {
      setLeads([]);
    }

    setLoading(false);
  }

  async function handleSelectBatch(batchId: string) {
    setSelectedBatchId(batchId);
    setLoading(true);

    const leadList = await getLeadsByBatch(batchId);
    setLeads(leadList);

    setLoading(false);
  }

  async function handleImportLead(lead: LeadItem) {
    setImportingLeadId(lead.id);

    await importLeadToCompany(lead);

    const leadList = await getLeadsByBatch(lead.batchId);
    setLeads(leadList);

    setImportingLeadId("");
  }

  useEffect(() => {
    refreshBatches();
  }, []);

  const importedCount = leads.filter((lead) => lead.status === "imported").length;
  const newCount = leads.filter((lead) => lead.status !== "imported").length;
  const duplicateCount = leads.filter((lead) => lead.duplicateDetected).length;

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
        Lead Radar yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
          AI Lead Engine
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">
          Lead Radar
        </h1>
        <p className="mt-2 text-muted">
          AI/PLAT ile bulunan müşteri adaylarını inceleyin ve CRM’ye aktarın.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard title="Lead Listesi" value={batches.length} />
        <SummaryCard title="Yeni Lead" value={newCount} />
        <SummaryCard title="CRM’ye Aktarılan" value={importedCount} />
        <SummaryCard title="Duplicate" value={duplicateCount} />
      </div>

      {batches.length === 0 ? (
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Henüz lead listesi yok</h2>
          <p className="mt-2 text-sm text-muted">
            PLAT veya AI çıktısı import edildiğinde burada görüntülenecek.
          </p>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-line bg-white p-4 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-ink">Listeler</h2>

            <div className="space-y-2">
              {batches.map((batch) => (
                <button
                  key={batch.id}
                  type="button"
                  onClick={() => handleSelectBatch(batch.id)}
                  className={
                    selectedBatchId === batch.id
                      ? "w-full rounded-2xl bg-ink px-4 py-3 text-left text-sm font-semibold text-white"
                      : "w-full rounded-2xl border border-line px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  }
                >
                  <span className="block">{batch.title}</span>
                  <span className="mt-1 block text-xs opacity-70">
                    {batch.source || "Manual"} · {batch.status || "review"}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-ink">Leadler</h2>

            <div className="space-y-3">
              {leads.length === 0 ? (
                <p className="text-sm text-muted">
                  Bu listede lead bulunamadı.
                </p>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={
                      lead.duplicateDetected
                        ? "rounded-2xl border border-amber-200 bg-amber-50 p-4"
                        : "rounded-2xl border border-line p-4"
                    }
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-ink">
                            {lead.companyName}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            Skor: {lead.score || 0}
                          </span>

                          {lead.status === "imported" && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              CRM’ye aktarıldı
                            </span>
                          )}

                          {lead.duplicateDetected && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                              Mevcut CRM kaydıyla eşleşti
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm text-muted">
                          {[lead.city, lead.sector].filter(Boolean).join(" · ") ||
                            "Şehir / sektör bilgisi yok"}
                        </p>

                        {lead.notes && (
                          <p className="mt-2 text-sm text-slate-600">
                            {lead.notes}
                          </p>
                        )}

                        {lead.duplicateDetected && (
                          <p className="mt-3 rounded-2xl bg-white/70 p-3 text-sm font-medium text-amber-800">
                            Bu lead yeni firma olarak eklenmedi. Sistem mevcut
                            CRM kaydıyla eşleştirdi ve timeline’a not düştü.
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          {lead.website && <span>{lead.website}</span>}
                          {lead.phone && <span>{lead.phone}</span>}
                          {lead.email && <span>{lead.email}</span>}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        {lead.status === "imported" ? (
                          <Link
                            href={
                              lead.importedCompanyId
                                ? `/companies/${lead.importedCompanyId}`
                                : "/companies"
                            }
                            className="rounded-2xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Firma Kaydını Aç
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleImportLead(lead)}
                            disabled={importingLeadId === lead.id}
                            className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {importingLeadId === lead.id
                              ? "Aktarılıyor..."
                              : "CRM’ye Aktar"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}