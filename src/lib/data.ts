export type CompanyStatus = 'Yeni' | 'Aranacak' | 'Arandı' | 'Toplantı' | 'Teklif' | 'Takip' | 'Kazanıldı';

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

export const companies: Company[] = [
  {
    id: 'akgun-medikal',
    name: 'AKGÜN Medikal',
    city: 'Ankara',
    district: 'Çankaya / OSTİM hattı',
    sector: 'Medikal',
    productGroup: 'Hastane teknolojileri / medikal sistemler',
    score: 94,
    status: 'Aranacak',
    website: 'Web sitesi kontrol edilecek',
    email: 'Genel mail araştırılacak',
    phone: 'Santral araştırılacak',
    linkedin: 'LinkedIn karar verici araştırılacak',
    fair: 'Expomed / Medikal fuar radarında',
    reference: 'Üzümcü referansı kullanılabilir',
    potentialRevenue: 650000,
    employeeBand: '100+ potansiyel',
    exportFocus: 'Yüksek',
    firstService: 'Kurumsal film + çok dilli web',
    nextAction: 'Pazarlama / ihracat yetkilisi bulunacak',
    owner: 'Burak',
    signals: ['Medikal üretici', 'İhracat iletişimi potansiyeli', 'Kurumsal karar verici hedeflenebilir', 'Üzümcü referansı sıcak giriş sağlar'],
    weaknesses: ['Web sitesi yenileme fırsatı', 'İngilizce içerik güçlendirilebilir', 'Video içerik eksik olabilir', 'Fuar sonrası içerik akışı kurulabilir'],
    services: ['Kurumsal film', 'Çok dilli web sitesi', 'LinkedIn yönetimi', 'Fuar içerikleri'],
    note: 'İlk temas: Üzümcü referansı + medikal ihracat iletişimi üzerinden yaklaş. Web sitesi satma; ihracat satış kiti anlat.'
  },
  {
    id: 'aden-medikal',
    name: 'Aden Medikal',
    city: 'İstanbul',
    district: 'Avrupa Yakası',
    sector: 'Medikal',
    productGroup: 'Cerrahi ekipman / hastane çözümleri',
    score: 91,
    status: 'Takip',
    website: 'Web sitesi kontrol edilecek',
    email: 'Genel mail araştırılacak',
    phone: 'Santral araştırılacak',
    linkedin: 'LinkedIn kontrol edilecek',
    fair: 'Expomed',
    reference: 'Üzümcü rakip ağı',
    potentialRevenue: 520000,
    employeeBand: '50-100 potansiyel',
    exportFocus: 'Yüksek',
    firstService: 'Fuar filmi + katalog',
    nextAction: 'Fuar içerik paketi ile tanışma maili',
    owner: 'Burak',
    signals: ['Fuarlara aktif katılım', 'Ürün çeşitliliği', 'İhracat iletişimi yapılabilir'],
    weaknesses: ['Ürün katalog dili geliştirilebilir', 'Fuar sonrası içerik akışı zayıf olabilir', 'Bayi görüşmeleri için dijital sunum ihtiyacı oluşabilir'],
    services: ['Fuar filmi', 'Ürün fotoğraf çekimi', 'Katalog tasarımı', 'Web sitesi'],
    note: 'Satış açısı: Fuar dönemlerinde tek ekipten video + katalog + sosyal medya üretimi.'
  },
  {
    id: 'eryigit-medical',
    name: 'Eryiğit Medical',
    city: 'Ankara',
    district: 'OSTİM / Sincan hattı',
    sector: 'Medikal',
    productGroup: 'Sterilizasyon / medikal gaz sistemleri',
    score: 89,
    status: 'Aranacak',
    website: 'Web sitesi kontrol edilecek',
    email: 'Genel mail araştırılacak',
    phone: 'Santral araştırılacak',
    linkedin: 'LinkedIn yetkili araştırılacak',
    fair: 'Expomed',
    reference: 'Ankara üretici ağı',
    potentialRevenue: 480000,
    employeeBand: '50-100 potansiyel',
    exportFocus: 'Yüksek',
    firstService: 'Fabrika filmi + teknik animasyon',
    nextAction: 'LinkedIn ihracat / pazarlama yetkilisi bulunacak',
    owner: 'Burak',
    signals: ['Üretici firma', 'Teknik ürün anlatımı ihtiyacı', 'Fabrika filmi potansiyeli'],
    weaknesses: ['Teknik ürünlerin video anlatımı güçlendirilebilir', 'Satış sunumları yenilenebilir', 'Ürün sayfaları daha iyi yapılandırılabilir'],
    services: ['Fabrika filmi', 'Teknik animasyon', 'B2B landing page', 'LinkedIn içerik planı'],
    note: 'İlk görüşmede sosyal medya değil, teknik ürün anlatımı ve satış sunumu öner.'
  },
  {
    id: 'megasan',
    name: 'Megasan',
    city: 'Ankara',
    district: 'OSTİM / İvedik hattı',
    sector: 'Medikal',
    productGroup: 'Sterilizasyon / hastane ekipmanları',
    score: 87,
    status: 'Teklif',
    website: 'Web sitesi kontrol edilecek',
    email: 'Genel mail araştırılacak',
    phone: 'Santral araştırılacak',
    linkedin: 'LinkedIn kontrol edilecek',
    fair: 'Expomed',
    reference: 'Üzümcü referansı kullanılabilir',
    potentialRevenue: 430000,
    employeeBand: '25-75 potansiyel',
    exportFocus: 'Orta',
    firstService: 'Dijital satış kiti',
    nextAction: 'Teklif takibi yapılacak',
    owner: 'Burak',
    signals: ['Medikal üretici', 'Fuar görünürlüğü önemli', 'Katalog ve video ihtiyacı oluşabilir'],
    weaknesses: ['Dijital satış materyalleri güncellenebilir', 'Çok dilli içerik geliştirilebilir', 'Referans sunumları toparlanabilir'],
    services: ['Katalog', 'Fuar teaser', 'Kurumsal web', 'SEO'],
    note: 'Satış açısı: İhracat ve bayi görüşmeleri için dijital satış kiti.'
  },
  {
    id: 'sesinoks',
    name: 'Sesinoks',
    city: 'Ankara',
    district: 'OSTİM / Sincan hattı',
    sector: 'Medikal',
    productGroup: 'Paslanmaz hastane ekipmanları',
    score: 85,
    status: 'Arandı',
    website: 'Web sitesi kontrol edilecek',
    email: 'Genel mail araştırılacak',
    phone: 'Santral araştırılacak',
    linkedin: 'LinkedIn kontrol edilecek',
    fair: 'Expomed',
    reference: 'Üzümcü ile yakın sektör',
    potentialRevenue: 390000,
    employeeBand: '25-75 potansiyel',
    exportFocus: 'Orta',
    firstService: 'Ürün çekimi + katalog',
    nextAction: 'İkinci arama ve örnek iş gönderimi',
    owner: 'Burak',
    signals: ['Ürün görselleştirme önemli', 'B2B katalog ihtiyacı', 'Fuar katılım potansiyeli'],
    weaknesses: ['Ürün fotoğrafları yenilenebilir', 'Video showroom eksik olabilir', 'Katalog dili sadeleştirilebilir'],
    services: ['Ürün çekimi', 'Katalog', 'Fuar stand videosu', 'Web revizyon'],
    note: 'Ürün kalitesini görsel anlatan paket öner.'
  },
  {
    id: 'bicakcilar',
    name: 'Bıçakcılar',
    city: 'İstanbul',
    sector: 'Medikal',
    productGroup: 'Hastane ekipmanları / tıbbi cihaz',
    score: 92,
    status: 'Yeni',
    website: 'Web sitesi kontrol edilecek',
    email: 'Genel mail araştırılacak',
    phone: 'Santral araştırılacak',
    linkedin: 'LinkedIn karar verici araştırılacak',
    fair: 'Expomed / sektör fuarları',
    reference: 'Üzümcü referans dili kullanılabilir',
    potentialRevenue: 780000,
    employeeBand: '250+ potansiyel',
    exportFocus: 'Yüksek',
    firstService: 'Global marka filmi',
    nextAction: 'Kurumsal iletişim yetkilisi araştırılacak',
    owner: 'Burak',
    signals: ['Köklü medikal marka', 'İhracat ve kurumsal algı önemli', 'Yüksek proje bütçesi potansiyeli'],
    weaknesses: ['Global iletişim dili incelenecek', 'Video ve vaka anlatımı fırsatı aranacak'],
    services: ['Global marka filmi', 'Web deneyimi', 'LinkedIn thought leadership', 'Fuar kampanyası'],
    note: 'Üst seviye yaklaş. Tek iş değil, yıllık kurumsal iletişim partnerliği öner.'
  },
  {
    id: 'aygun-surgical',
    name: 'Aygün Surgical',
    city: 'Samsun',
    sector: 'Medikal',
    productGroup: 'Cerrahi konteyner / sterilizasyon sistemleri',
    score: 90,
    status: 'Yeni',
    website: 'Web sitesi kontrol edilecek',
    email: 'Genel mail araştırılacak',
    phone: 'Santral araştırılacak',
    linkedin: 'LinkedIn ihracat yetkilisi araştırılacak',
    fair: 'Expomed / uluslararası fuarlar',
    reference: 'Medikal üretici referansı',
    potentialRevenue: 620000,
    employeeBand: '100+ potansiyel',
    exportFocus: 'Yüksek',
    firstService: 'Teknik ürün filmi',
    nextAction: 'İhracat müdürü için LinkedIn araştırması',
    owner: 'Burak',
    signals: ['İhracat odaklı ürün', 'Teknik anlatım ihtiyacı', 'Uluslararası fuar görünürlüğü'],
    weaknesses: ['Teknik ürün anlatımı video ile güçlendirilebilir', 'Çok dilli landing page fırsatı'],
    services: ['Teknik ürün filmi', '3D/animasyon', 'Çok dilli landing page', 'Fuar içerik paketi'],
    note: 'Klasik ajans dili kullanma. Teknik satış materyali ve global bayi desteği üzerinden konuş.'
  }
];

export const tasks = [
  { time: '09:30', company: 'AKGÜN Medikal', action: 'İlk arama: Üzümcü referansı + ihracat satış kiti', priority: 'Yüksek', type: 'Arama' },
  { time: '11:00', company: 'Eryiğit Medical', action: 'LinkedIn yetkili araştır ve bağlantı isteği gönder', priority: 'Yüksek', type: 'Araştırma' },
  { time: '14:00', company: 'Megasan', action: 'Teklif takip ve ikinci temas', priority: 'Orta', type: 'Takip' },
  { time: '16:30', company: 'Aden Medikal', action: 'Fuar paketi sunumu hazırla', priority: 'Orta', type: 'Hazırlık' }
];

export const fairs = [
  { id: 'expomed', name: 'Expomed İstanbul', sector: 'Medikal', city: 'İstanbul', companies: 527, hot: 83, status: 'Öncelikli' },
  { id: 'win', name: 'WIN Eurasia', sector: 'Makine / Endüstri', city: 'İstanbul', companies: 700, hot: 120, status: 'Sıradaki' },
  { id: 'idef', name: 'IDEF', sector: 'Savunma', city: 'İstanbul', companies: 900, hot: 140, status: 'Sıradaki' },
  { id: 'isk-sodex', name: 'ISK-SODEX', sector: 'İklimlendirme', city: 'İstanbul', companies: 800, hot: 110, status: 'Beklemede' }
];

export const pipelineStages = [
  { key: 'Yeni', title: 'Yeni', companies: companies.filter((c) => c.status === 'Yeni') },
  { key: 'Aranacak', title: 'Aranacak', companies: companies.filter((c) => c.status === 'Aranacak') },
  { key: 'Arandı', title: 'Arandı', companies: companies.filter((c) => c.status === 'Arandı') },
  { key: 'Teklif', title: 'Teklif', companies: companies.filter((c) => c.status === 'Teklif') },
  { key: 'Takip', title: 'Takip', companies: companies.filter((c) => c.status === 'Takip') }
];

export const offers = [
  { id: 'megasan-fuar-kit', company: 'Megasan', title: 'Dijital Satış Kiti', amount: 430000, status: 'Takipte', date: '2026-06-29' },
  { id: 'uzumcu-cross-sell', company: 'Üzümcü', title: 'Fuar İçerik Paketi', amount: 280000, status: 'Taslak', date: '2026-06-30' }
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
