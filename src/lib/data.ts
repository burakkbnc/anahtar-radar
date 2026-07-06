export type CompanyStatus = 'Yeni' | 'Aranacak' | 'Arandı' | 'Toplantı' | 'Teklif' | 'Takip' | 'Kazanıldı' | 'Kaybedildi';

export type Company = {
  id: string;
  name: string;
  city: string;
  district?: string;
  sector: string;
  productGroup: string;
  score: number;
  status: CompanyStatus;
  website: string;
  email: string;
  phone: string;
  linkedin: string;
  fair: string;
  reference: string;
  potentialRevenue: number;
  employeeBand: string;
  exportFocus: 'Yüksek' | 'Orta' | 'Düşük';
  firstService: string;
  nextAction: string;
  owner: string;
  signals: string[];
  weaknesses: string[];
  services: string[];
  note: string;
};

const baseSignals = ['PLAT üyesi / private label ağı', 'B2B üretici hedefi', 'Fuar ve ihracat iletişimi potansiyeli'];
const baseWeaknesses = ['Web sitesi ve İngilizce içerik kontrol edilecek', 'LinkedIn karar verici araştırılacak', 'Kurumsal film / fuar materyali varlığı incelenecek'];
const baseServices = ['İhracat odaklı web sitesi', 'Fuar içerikleri', 'LinkedIn B2B iletişimi', 'Kurumsal film'];

function makeCompany(input: Pick<Company, 'id' | 'name' | 'sector' | 'city' | 'score' | 'status' | 'firstService' | 'potentialRevenue' | 'exportFocus'> & Partial<Company>): Company {
  return {
    productGroup: input.sector,
    website: input.website ?? 'Araştırılacak',
    email: input.email ?? 'Genel mail araştırılacak',
    phone: input.phone ?? 'Santral araştırılacak',
    linkedin: input.linkedin ?? 'LinkedIn firma/karar verici araştırılacak',
    fair: input.fair ?? 'PLAT / private label ağı',
    reference: input.reference ?? 'Anahtar Creative kurumsal referansları',
    employeeBand: input.employeeBand ?? 'Araştırılacak',
    nextAction: input.nextAction ?? 'Santral + LinkedIn üzerinden pazarlama/ihracat yetkilisi bulunacak',
    owner: input.owner ?? 'Burak',
    signals: input.signals ?? baseSignals,
    weaknesses: input.weaknesses ?? baseWeaknesses,
    services: input.services ?? baseServices,
    note: input.note ?? 'İlk temas: Sosyal medya satma. “Üretici firmalar için ihracat odaklı dijital satış kiti, fuar içerikleri ve kurumsal film” yaklaşımıyla gir.',
    ...input,
  };
}

export const companies: Company[] = [
  makeCompany({ id: 'abc-deterjan', name: 'ABC Deterjan', city: 'İstanbul', sector: 'Temizlik / deterjan', score: 94, status: 'Aranacak', firstService: 'İhracat odaklı web + LinkedIn', potentialRevenue: 520000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'acarsan-makarna', name: 'Acarsan Makarna', city: 'Gaziantep', sector: 'Gıda / makarna', score: 93, status: 'Aranacak', firstService: 'Fuar filmi + İngilizce satış kiti', potentialRevenue: 480000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'alpla-plastik', name: 'ALPLA Plastik', city: 'İstanbul', sector: 'Ambalaj', score: 82, status: 'Yeni', firstService: 'B2B LinkedIn + sürdürülebilirlik içeriği', potentialRevenue: 420000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'and-corap', name: 'AND Çorap', city: 'İstanbul', sector: 'Tekstil', score: 72, status: 'Yeni', firstService: 'Private label katalog + web revizyon', potentialRevenue: 210000, exportFocus: 'Orta' }),
  makeCompany({ id: 'antepsan', name: 'Antepsan', city: 'Gaziantep', sector: 'Gıda / kuruyemiş', score: 86, status: 'Yeni', firstService: 'Ürün fotoğrafı + fuar kataloğu', potentialRevenue: 280000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'aps-ambalaj', name: 'APS Ambalaj', city: 'İstanbul', sector: 'Ambalaj', score: 84, status: 'Yeni', firstService: 'B2B web + fabrika filmi', potentialRevenue: 320000, exportFocus: 'Orta' }),
  makeCompany({ id: 'ares-grup-ambalaj', name: 'Ares Grup Ambalaj', city: 'İstanbul', sector: 'Ambalaj', score: 85, status: 'Yeni', firstService: 'B2B web + LinkedIn içerikleri', potentialRevenue: 330000, exportFocus: 'Orta' }),
  makeCompany({ id: 'ariste', name: 'Ariste / Fabrikita', city: 'İstanbul', sector: 'Gıda', score: 81, status: 'Yeni', firstService: 'Marka sunumu + fuar içeriği', potentialRevenue: 260000, exportFocus: 'Orta' }),
  makeCompany({ id: 'aromsa', name: 'Aromsa', city: 'Kocaeli', sector: 'Aroma / gıda AR-GE', score: 92, status: 'Aranacak', firstService: 'B2B marka filmi + LinkedIn', potentialRevenue: 560000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'arsanmak', name: 'Arsanmak', city: 'İstanbul', sector: 'Makine', score: 75, status: 'Yeni', firstService: 'Teknik ürün filmi', potentialRevenue: 240000, exportFocus: 'Orta' }),
  makeCompany({ id: 'as-pilic', name: 'As Piliç', city: 'Bolu', sector: 'Gıda / beyaz et', score: 84, status: 'Yeni', firstService: 'Kurumsal film + İK videosu', potentialRevenue: 380000, exportFocus: 'Orta' }),
  makeCompany({ id: 'atak-farma', name: 'Atak Farma', city: 'İstanbul', sector: 'Kozmetik / kişisel bakım', score: 88, status: 'Yeni', firstService: 'Ürün lansmanı + CGI', potentialRevenue: 360000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'atessonmez-kimya', name: 'Ateşsönmez Kimya', city: 'İstanbul', sector: 'Kimya', score: 86, status: 'Yeni', firstService: 'B2B web + teknik içerik', potentialRevenue: 340000, exportFocus: 'Orta' }),
  makeCompany({ id: 'aves', name: 'Aves', city: 'Mersin', sector: 'Gıda / yağ', score: 91, status: 'Aranacak', firstService: 'İhracat satış kiti + film', potentialRevenue: 520000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'bahcivan-gida', name: 'Bahçıvan Gıda', city: 'Kırklareli', sector: 'Süt ürünleri', score: 90, status: 'Aranacak', firstService: 'Fabrika filmi + LinkedIn B2B', potentialRevenue: 500000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'balparmak', name: 'Balparmak', city: 'İstanbul', sector: 'Gıda', score: 87, status: 'Yeni', firstService: 'Kurumsal hikaye filmi', potentialRevenue: 440000, exportFocus: 'Orta' }),
  makeCompany({ id: 'banat', name: 'Banat', city: 'İstanbul', sector: 'Kişisel bakım', score: 89, status: 'Yeni', firstService: 'Ürün lansman içerikleri', potentialRevenue: 420000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'basf-turkiye', name: 'BASF Türkiye', city: 'İstanbul', sector: 'Kimya', score: 70, status: 'Yeni', firstService: 'Referans odaklı kurumsal içerik', potentialRevenue: 600000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'besler-et', name: 'Beşler Et', city: 'İstanbul', sector: 'Gıda / et ürünleri', score: 83, status: 'Yeni', firstService: 'Fabrika filmi + güven iletişimi', potentialRevenue: 360000, exportFocus: 'Orta' }),
  makeCompany({ id: 'beta-kimya', name: 'Beta Kimya', city: 'İstanbul', sector: 'Kimya', score: 88, status: 'Aranacak', firstService: 'B2B web + teknik ürün anlatımı', potentialRevenue: 410000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'beyaz-kagit', name: 'Beyaz Kağıt', city: 'Adana', sector: 'Temizlik / kağıt', score: 87, status: 'Yeni', firstService: 'İhracat odaklı satış materyali', potentialRevenue: 390000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'beyda-gida', name: 'Beyda Gıda', city: 'İstanbul', sector: 'Gıda', score: 82, status: 'Yeni', firstService: 'Katalog + ürün çekimi', potentialRevenue: 280000, exportFocus: 'Orta' }),
  makeCompany({ id: 'bff-kozmetik', name: 'BFF Kozmetik', city: 'İstanbul', sector: 'Kozmetik', score: 85, status: 'Yeni', firstService: 'CGI + ürün lansmanı', potentialRevenue: 330000, exportFocus: 'Orta' }),
  makeCompany({ id: 'bifa-biskuvi', name: 'Bifa Bisküvi', city: 'Karaman', sector: 'Gıda / bisküvi', score: 91, status: 'Aranacak', firstService: 'İhracat web + fuar filmi', potentialRevenue: 470000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'bilesim-kimya', name: 'Bileşim Kimya', city: 'İstanbul', sector: 'Kimya', score: 80, status: 'Yeni', firstService: 'Teknik B2B sunum', potentialRevenue: 260000, exportFocus: 'Orta' }),
  makeCompany({ id: 'bunge-gida', name: 'Bunge Gıda', city: 'İstanbul', sector: 'Gıda', score: 76, status: 'Yeni', firstService: 'Kurumsal iletişim içeriği', potentialRevenue: 500000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'burcu-gida', name: 'Burcu Gıda', city: 'Balıkesir', sector: 'Gıda', score: 84, status: 'Yeni', firstService: 'Ürün/fuar katalogları', potentialRevenue: 310000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'continental-confectionery', name: 'Continental Confectionery', city: 'İstanbul', sector: 'Gıda / şekerleme', score: 86, status: 'Yeni', firstService: 'Fuar videosu + katalog', potentialRevenue: 350000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'cook', name: 'Cook', city: 'İstanbul', sector: 'Tüketim ürünleri', score: 90, status: 'Aranacak', firstService: 'Ürün lansmanı + retail içerikler', potentialRevenue: 420000, exportFocus: 'Orta' }),
  makeCompany({ id: 'cosby', name: 'Cosby', city: 'İstanbul', sector: 'Gıda', score: 78, status: 'Yeni', firstService: 'Ürün çekimi + sosyal içerik', potentialRevenue: 220000, exportFocus: 'Orta' }),
  makeCompany({ id: 'cosmo-fragrances', name: 'Cosmo Fragrances', city: 'İstanbul', sector: 'Kozmetik / koku', score: 86, status: 'Yeni', firstService: 'B2B marka filmi', potentialRevenue: 360000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'dermokil', name: 'Dermokil', city: 'İstanbul', sector: 'Kozmetik', score: 92, status: 'Aranacak', firstService: 'CGI + ürün lansman paketi', potentialRevenue: 450000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'detay-gida', name: 'Detay Gıda', city: 'İstanbul', sector: 'Gıda', score: 89, status: 'Aranacak', firstService: 'İhracat satış kiti', potentialRevenue: 380000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'dimes', name: 'Dimes', city: 'Tokat', sector: 'İçecek', score: 85, status: 'Yeni', firstService: 'Kurumsal hikaye + video', potentialRevenue: 470000, exportFocus: 'Orta' }),
  makeCompany({ id: 'dogus-cay', name: 'Doğuş Çay', city: 'İstanbul', sector: 'Gıda / çay', score: 83, status: 'Yeni', firstService: 'Kurumsal kampanya içeriği', potentialRevenue: 430000, exportFocus: 'Orta' }),
  makeCompany({ id: 'dsm-firmenich', name: 'DSM Firmenich', city: 'İstanbul', sector: 'Aroma / içerik', score: 74, status: 'Yeni', firstService: 'B2B içerik ve etkinlik', potentialRevenue: 520000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'durum-gida', name: 'Durum Gıda', city: 'Mersin', sector: 'Gıda / makarna', score: 84, status: 'Yeni', firstService: 'İhracat web + fuar kiti', potentialRevenue: 330000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'ece-piknik', name: 'Ece Piknik', city: 'İstanbul', sector: 'Tüketim ürünleri', score: 78, status: 'Yeni', firstService: 'Ürün foto/video paketi', potentialRevenue: 230000, exportFocus: 'Orta' }),
  makeCompany({ id: 'efor-cay', name: 'Efor Çay', city: 'İstanbul', sector: 'Gıda / çay', score: 79, status: 'Yeni', firstService: 'Marka hikayesi + web', potentialRevenue: 250000, exportFocus: 'Orta' }),
  makeCompany({ id: 'elso-kimya', name: 'Elso Kimya', city: 'İstanbul', sector: 'Kimya', score: 81, status: 'Yeni', firstService: 'Teknik web + katalog', potentialRevenue: 270000, exportFocus: 'Orta' }),
  makeCompany({ id: 'emek-yag', name: 'Emek Yağ', city: 'İstanbul', sector: 'Gıda / yağ', score: 80, status: 'Yeni', firstService: 'İhracat katalogları', potentialRevenue: 260000, exportFocus: 'Orta' }),
  makeCompany({ id: 'endeks-kimya', name: 'Endeks Kimya', city: 'İstanbul', sector: 'Kimya', score: 79, status: 'Yeni', firstService: 'B2B LinkedIn + web revizyon', potentialRevenue: 240000, exportFocus: 'Orta' }),
  makeCompany({ id: 'feast', name: 'Feast', city: 'İzmir', sector: 'Dondurulmuş gıda', score: 88, status: 'Aranacak', firstService: 'Fabrika filmi + retail içerik', potentialRevenue: 410000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'kervan-gida', name: 'Kervan Gıda', city: 'İstanbul', sector: 'Gıda / şekerleme', score: 94, status: 'Aranacak', firstService: 'Global fuar filmi + LinkedIn', potentialRevenue: 650000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'kestane-su', name: 'Kestane Su', city: 'Bursa', sector: 'İçecek / su', score: 74, status: 'Yeni', firstService: 'Yerel marka filmi', potentialRevenue: 180000, exportFocus: 'Düşük' }),
  makeCompany({ id: 'kim-paz', name: 'Kim-Paz', city: 'İstanbul', sector: 'Kimya', score: 82, status: 'Yeni', firstService: 'B2B web + teknik katalog', potentialRevenue: 290000, exportFocus: 'Orta' }),
  makeCompany({ id: 'kiwi', name: 'Kiwi', city: 'İstanbul', sector: 'Elektronik / küçük ev aletleri', score: 77, status: 'Yeni', firstService: 'Ürün lansmanı + video', potentialRevenue: 320000, exportFocus: 'Orta' }),
  makeCompany({ id: 'sanifoam', name: 'Sanifoam', city: 'İstanbul', sector: 'Endüstri / sünger', score: 73, status: 'Yeni', firstService: 'B2B web + ürün anlatımı', potentialRevenue: 220000, exportFocus: 'Orta' }),
  makeCompany({ id: 'sanipak', name: 'Sanipak', city: 'İstanbul', sector: 'Temizlik / kağıt', score: 91, status: 'Aranacak', firstService: 'Sürdürülebilirlik + kurumsal film', potentialRevenue: 560000, exportFocus: 'Yüksek' }),
  makeCompany({ id: 'sapro', name: 'Sapro', city: 'İstanbul', sector: 'Temizlik / ıslak mendil', score: 93, status: 'Aranacak', firstService: 'Global satış kiti + fabrika filmi', potentialRevenue: 600000, exportFocus: 'Yüksek' }),
];

export const tasks = [
  { time: '09:30', company: 'Kervan Gıda', action: 'Santral + LinkedIn üzerinden pazarlama/ihracat yetkilisi bulunacak', priority: 'Yüksek', type: 'Arama' },
  { time: '10:30', company: 'ABC Deterjan', action: 'İhracat odaklı web + LinkedIn satış açısı ile ilk temas', priority: 'Yüksek', type: 'Arama' },
  { time: '11:30', company: 'Sapro', action: 'Global satış kiti / fabrika filmi yaklaşımıyla karar verici araştırması', priority: 'Yüksek', type: 'Araştırma' },
  { time: '14:00', company: 'Dermokil', action: 'CGI ve ürün lansmanı örnekleriyle tanışma maili hazırlanacak', priority: 'Orta', type: 'Hazırlık' },
  { time: '16:30', company: 'Bahçıvan Gıda', action: 'Fabrika filmi + LinkedIn B2B teklifi için ilk not çıkarılacak', priority: 'Orta', type: 'Takip' }
];

export const fairs = [
  { id: 'plma', name: 'PLMA Amsterdam', sector: 'Private Label', city: 'Amsterdam', companies: 2800, hot: 120, status: 'Öncelikli' },
  { id: 'gulfood', name: 'Gulfood Dubai', sector: 'Gıda', city: 'Dubai', companies: 5000, hot: 180, status: 'Sıradaki' },
  { id: 'anuga', name: 'Anuga', sector: 'Gıda', city: 'Köln', companies: 7800, hot: 220, status: 'Sıradaki' },
  { id: 'sial', name: 'SIAL Paris', sector: 'Gıda', city: 'Paris', companies: 7000, hot: 200, status: 'Beklemede' }
];

export const pipelineStages = [
  { key: 'Yeni', title: 'Yeni', companies: companies.filter((c) => c.status === 'Yeni') },
  { key: 'Aranacak', title: 'Aranacak', companies: companies.filter((c) => c.status === 'Aranacak') },
  { key: 'Arandı', title: 'Arandı', companies: companies.filter((c) => c.status === 'Arandı') },
  { key: 'Toplantı', title: 'Toplantı', companies: companies.filter((c) => c.status === 'Toplantı') },
  { key: 'Teklif', title: 'Teklif', companies: companies.filter((c) => c.status === 'Teklif') },
  { key: 'Takip', title: 'Takip', companies: companies.filter((c) => c.status === 'Takip') },
  { key: 'Kazanıldı', title: 'Kazanıldı', companies: companies.filter((c) => c.status === 'Kazanıldı') },
  { key: 'Kaybedildi', title: 'Kaybedildi', companies: companies.filter((c) => c.status === 'Kaybedildi') }
];

export const offers = [
  { id: 'offer-kervan', company: 'Kervan Gıda', title: 'Global fuar filmi + LinkedIn içerik paketi', amount: 650000, status: 'Taslak', date: 'Bu hafta' },
  { id: 'offer-sapro', company: 'Sapro', title: 'Fabrika filmi + global satış kiti', amount: 600000, status: 'Taslak', date: 'Bu hafta' },
  { id: 'offer-dermokil', company: 'Dermokil', title: 'CGI ürün lansman paketi', amount: 450000, status: 'Araştırma', date: 'Bu hafta' }
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}
