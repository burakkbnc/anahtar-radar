# Anahtar Radar MVP

Anahtar Creative için satış istihbarat ve CRM MVP.

## Ekranlar

- Dashboard
- Firmalar
- Firma detay
- Pipeline
- Görevler
- Teklifler
- Fuarlar
- AI Analiz mock ekranı

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıdan:

```bash
http://localhost:3000
```

## Build testi

Bu paket oluşturulurken production build başarılı şekilde test edildi.

```bash
npm run build
```

## Not

Veriler şimdilik `src/lib/data.ts` içindeki mock CRM datasından geliyor. Sonraki sprintte CSV/Excel import ve Supabase bağlantısı eklenebilir.
