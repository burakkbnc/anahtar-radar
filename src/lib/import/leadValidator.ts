import { NormalizedLead } from "./leadNormalizer";

export type LeadValidationResult = {
  isValid: boolean;
  warnings: string[];
  errors: string[];
};

function hasContactInfo(lead: NormalizedLead) {
  return Boolean(lead.phone || lead.email || lead.website);
}

export function validateLead(lead: NormalizedLead): LeadValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!lead.companyName) {
    errors.push("Firma adı eksik.");
  }

  if (!hasContactInfo(lead)) {
    warnings.push("Telefon, e-posta veya web sitesi bilgisi yok.");
  }

  if (lead.score === 0) {
    warnings.push("Lead skoru yok veya 0.");
  }

  if (!lead.city) {
    warnings.push("Şehir bilgisi eksik.");
  }

  if (!lead.sector) {
    warnings.push("Sektör bilgisi eksik.");
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

export function validateLeadList(leads: NormalizedLead[]) {
  return leads.map((lead) => ({
    lead,
    validation: validateLead(lead),
  }));
}