export type RawLeadInput = Record<string, unknown>;

export type NormalizedLead = {
  companyName: string;
  website: string;
  phone: string;
  email: string;
  city: string;
  sector: string;
  notes: string;
  source: string;
  score: number;
};

function getStringValue(
  input: RawLeadInput,
  keys: string[],
  fallback = ""
): string {
  for (const key of keys) {
    const value = input[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return fallback;
}

function getNumberValue(
  input: RawLeadInput,
  keys: string[],
  fallback = 0
): number {
  for (const key of keys) {
    const value = input[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value.replace(",", "."));

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
}

function normalizeWebsite(value: string) {
  if (!value) return "";

  const trimmed = value.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.includes(".")) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

function normalizePhone(value: string) {
  return value
    .replaceAll(" ", "")
    .replaceAll("-", "")
    .replaceAll("(", "")
    .replaceAll(")", "");
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;

  return Math.round(value);
}

export function normalizeLead(input: RawLeadInput): NormalizedLead {
  const companyName = getStringValue(input, [
    "companyName",
    "company",
    "name",
    "firma",
    "firmaAdi",
    "firma_adı",
    "title",
    "unvan",
  ]);

  const website = normalizeWebsite(
    getStringValue(input, ["website", "web", "site", "url", "domain"])
  );

  const phone = normalizePhone(
    getStringValue(input, ["phone", "telefon", "tel", "gsm", "mobile"])
  );

  const email = getStringValue(input, ["email", "mail", "ePosta", "eposta"]);

  const city = getStringValue(input, [
    "city",
    "sehir",
    "şehir",
    "il",
    "location",
  ]);

  const sector = getStringValue(input, [
    "sector",
    "sektor",
    "sektör",
    "industry",
    "category",
  ]);

  const notes = getStringValue(input, [
    "notes",
    "note",
    "not",
    "description",
    "aciklama",
    "açıklama",
  ]);

  const source = getStringValue(input, ["source", "kaynak"], "PLAT");

  const score = clampScore(
    getNumberValue(input, ["score", "leadScore", "puan", "skor"], 0)
  );

  return {
    companyName,
    website,
    phone,
    email,
    city,
    sector,
    notes,
    source,
    score,
  };
}

export function normalizeLeadList(inputs: RawLeadInput[]): NormalizedLead[] {
  return inputs
    .map((input) => normalizeLead(input))
    .filter((lead) => lead.companyName.length > 0);
}