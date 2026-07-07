"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createLeadJob,
  getRecentJobs,
  updateLeadJob,
  type LeadJob,
} from "@/lib/firebase/leadJobService";
import {
  createMockLeadJobResults,
  getLeadJobResults,
  markLeadJobResultsAsImported,
  type LeadJobResult,
} from "@/lib/firebase/leadJobResultService";
import { createLeadBatchFromRawInput } from "@/lib/import/leadImportEngine";

export default function LeadDiscoverClient() {
  const [title, setTitle] = useState("Yeni AI Lead Araştırması");
  const [prompt, setPrompt] = useState(
    "Ankara merkezli, kurumsal iletişim ve sosyal medya ajansı ihtiyacı olabilecek firmaları bul."
  );
  const [jobs, setJobs] = useState<LeadJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<LeadJob | null>(null);
  const [results, setResults] = useState<LeadJobResult[]>([]);
  const [selectedResultIds, setSelectedResultIds] = useState<string[]>([]);
  const [createdBatchId, setCreatedBatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  async function loadJobs() {
    const recentJobs = await getRecentJobs();
    setJobs(recentJobs);

    if (!selectedJob && recentJobs.length > 0) {
      setSelectedJob(recentJobs[0]);
    }
  }

  async function loadResults(jobId: string) {
    setResultsLoading(true);

    try {
      const jobResults = await getLeadJobResults(jobId);
      setResults(jobResults);
      setSelectedResultIds(
        jobResults
          .filter((result) => result.status !== "imported")
          .map((result) => result.id)
      );
    } finally {
      setResultsLoading(false);
    }
  }

  async function handleCreateJob() {
    if (!title.trim() || !prompt.trim()) {
      alert("Başlık ve araştırma promptu zorunludur.");
      return;
    }

    setLoading(true);
    setCreatedBatchId("");

    try {
      const jobId = await createLeadJob({
        title: title.trim(),
        prompt: prompt.trim(),
        provider: "Mock AI",
      });

      await updateLeadJob(jobId, {
        status: "running",
      });

      await createMockLeadJobResults(jobId);

      await updateLeadJob(jobId, {
        status: "completed",
      });

      await loadJobs();

      const createdJob: LeadJob = {
        id: jobId,
        title: title.trim(),
        prompt: prompt.trim(),
        provider: "Mock AI",
        status: "completed",
      };

      setSelectedJob(createdJob);
      await loadResults(jobId);
    } finally {
      setLoading(false);
    }
  }

  function toggleResult(resultId: string) {
    setSelectedResultIds((current) =>
      current.includes(resultId)
        ? current.filter((id) => id !== resultId)
        : [...current, resultId]
    );
  }

  function selectAllAvailableResults() {
    setSelectedResultIds(
      results
        .filter((result) => result.status !== "imported")
        .map((result) => result.id)
    );
  }

  function clearSelectedResults() {
    setSelectedResultIds([]);
  }

  async function handleImportSelectedResults() {
    if (!selectedJob) return;

    const selectedResults = results.filter((result) =>
      selectedResultIds.includes(result.id)
    );

    if (selectedResults.length === 0) {
      alert("Aktarılacak lead seçilmedi.");
      return;
    }

    setImporting(true);
    setCreatedBatchId("");

    try {
      const importResult = await createLeadBatchFromRawInput({
        title: `${selectedJob.title} - AI Discovery`,
        source: "AI Discovery",
        rawLeads: selectedResults.map((result) => ({
          companyName: result.companyName,
          website: result.website || "",
          phone: result.phone || "",
          email: result.email || "",
          city: result.city || "",
          sector: result.sector || "",
          notes: result.notes || "",
          source: "AI Discovery",
          score: result.score || 0,
        })),
      });

      await markLeadJobResultsAsImported({
        jobId: selectedJob.id,
        resultIds: selectedResults.map((result) => result.id),
      });

      await updateLeadJob(selectedJob.id, {
        batchId: importResult.batchId,
      });

      setCreatedBatchId(importResult.batchId);
      await loadResults(selectedJob.id);
      await loadJobs();
    } finally {
      setImporting(false);
    }
  }

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedJob?.id) {
      setCreatedBatchId("");
      loadResults(selectedJob.id);
    }
  }, [selectedJob?.id]);

  const availableResultCount = results.filter(
    (result) => result.status !== "imported"
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            AI Discovery
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">
            Lead Keşfet
          </h1>
          <p className="mt-2 max-w-3xl text-muted">
            AI ile potansiyel müşteri araştırması oluşturun, sonuçları inceleyin
            ve uygun leadleri Lead Radar’a aktarın.
          </p>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">
              Araştırma başlığı
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-line px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="Örn: Ankara sağlık sektörü lead araştırması"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">
              AI araştırma promptu
            </label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-line px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="Hangi sektör, şehir, müşteri tipi ve ihtiyaç aranacak?"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreateJob}
              disabled={loading}
              className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Araştırma oluşturuluyor..." : "AI Lead İşini Başlat"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Son araştırmalar</h2>
            <button
              type="button"
              onClick={loadJobs}
              className="text-xs font-semibold text-muted hover:text-ink"
            >
              Yenile
            </button>
          </div>

          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-muted">
                Henüz AI araştırması oluşturulmadı.
              </p>
            ) : (
              jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className={
                    selectedJob?.id === job.id
                      ? "w-full rounded-2xl bg-ink p-4 text-left text-white"
                      : "w-full rounded-2xl border border-line bg-white p-4 text-left hover:bg-slate-50"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{job.title}</p>
                      <p
                        className={
                          selectedJob?.id === job.id
                            ? "mt-1 text-xs text-slate-200"
                            : "mt-1 text-xs text-muted"
                        }
                      >
                        {job.prompt}
                      </p>
                    </div>
                    <span
                      className={
                        selectedJob?.id === job.id
                          ? "rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase text-ink"
                          : "rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600"
                      }
                    >
                      {job.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold text-muted">
                AI araştırma sonuçları
              </p>
              <h2 className="text-xl font-bold text-ink">
                {selectedJob?.title || "Araştırma seçilmedi"}
              </h2>
              {selectedJob && (
                <p className="mt-1 text-xs text-muted">
                  {selectedResultIds.length} seçili / {availableResultCount} uygun
                  lead
                </p>
              )}
            </div>

            {selectedJob && results.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAllAvailableResults}
                  className="rounded-2xl border border-line px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tümünü Seç
                </button>

                <button
                  type="button"
                  onClick={clearSelectedResults}
                  className="rounded-2xl border border-line px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Seçimi Temizle
                </button>

                <button
                  type="button"
                  onClick={handleImportSelectedResults}
                  disabled={importing || selectedResultIds.length === 0}
                  className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {importing ? "Aktarılıyor..." : "Lead Radar’a Aktar"}
                </button>
              </div>
            )}
          </div>

          {createdBatchId && (
            <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              Lead listesi oluşturuldu.{" "}
              <Link href="/leads" className="underline">
                Lead Radar’da görüntüle
              </Link>
            </div>
          )}

          {!selectedJob ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-muted">
              Sonuçları görmek için bir araştırma seç.
            </p>
          ) : resultsLoading ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-muted">
              Sonuçlar yükleniyor...
            </p>
          ) : results.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-muted">
              Bu araştırma için henüz sonuç yok.
            </p>
          ) : (
            <div className="space-y-3">
              {results.map((result) => {
                const isImported = result.status === "imported";
                const isSelected = selectedResultIds.includes(result.id);

                return (
                  <div
                    key={result.id}
                    className={
                      isSelected
                        ? "rounded-2xl border border-ink bg-slate-50 p-4"
                        : "rounded-2xl border border-line p-4"
                    }
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isImported}
                          onChange={() => toggleResult(result.id)}
                          className="mt-1 h-4 w-4"
                        />

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-ink">
                              {result.companyName}
                            </h3>

                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                              Skor: {result.score || 0}
                            </span>

                            {isImported && (
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                Lead Radar’a aktarıldı
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-slate-600">
                            {result.notes || "Not bulunmuyor."}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                            {result.city && (
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {result.city}
                              </span>
                            )}
                            {result.sector && (
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {result.sector}
                              </span>
                            )}
                            {result.website && (
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {result.website}
                              </span>
                            )}
                            {result.phone && (
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {result.phone}
                              </span>
                            )}
                            {result.email && (
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {result.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {result.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}