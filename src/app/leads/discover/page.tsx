"use client";

import { useState } from "react";
import { createLeadJob } from "@/lib/firebase/leadJobService";

const examples = [
  "OSTİM medikal üreticileri",
  "Ankara savunma sanayi firmaları",
  "Bosna'da diş klinikleri",
  "Plastik enjeksiyon firmaları",
];

export default function LeadDiscoverClient() {
  const [prompt, setPrompt] = useState("");
  const [createdJobId, setCreatedJobId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateJob() {
    if (!prompt.trim()) return;

    setLoading(true);

    const jobId = await createLeadJob({
      title: prompt.trim(),
      prompt: prompt.trim(),
      provider: "ChatGPT",
    });

    setCreatedJobId(jobId);
    setPrompt("");
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
          AI Discovery
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">
          Lead Keşfet
        </h1>
        <p className="mt-2 text-muted">
          Hedef müşteri kitlesini yazın, AI lead arama işi oluşturulsun.
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
        <label className="text-sm font-semibold text-ink">
          Ne arıyoruz?
        </label>

        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
          placeholder="Örn: Ankara'da medikal üretici firmalar"
          className="mt-3 w-full rounded-2xl border border-line p-4 text-sm outline-none focus:border-slate-400"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setPrompt(example)}
              className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              {example}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCreateJob}
          disabled={loading || !prompt.trim()}
          className="mt-6 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "İş oluşturuluyor..." : "AI Lead İşini Başlat"}
        </button>

        {createdJobId && (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            Lead işi oluşturuldu. Job ID: {createdJobId}
          </div>
        )}
      </section>
    </div>
  );
}