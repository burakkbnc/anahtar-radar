import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseDb } from './client';
import type { Company, CompanyStatus } from '@/lib/data';

function getCompaniesRef() {
  return collection(getFirebaseDb(), 'companies');
}

export async function getCompanies(): Promise<Company[]> {
  const snapshot = await getDocs(query(getCompaniesRef(), orderBy('score', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Company));
}

export async function seedCompanies(items: Company[]) {
  const db = getFirebaseDb();
  await Promise.all(
    items.map((item) =>
      setDoc(doc(db, 'companies', item.id), {
        ...item,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
    )
  );
}

export async function addCompany(input: Omit<Company, 'id' | 'signals' | 'weaknesses' | 'services' | 'note' | 'potentialRevenue' | 'exportFocus' | 'employeeBand' | 'fair' | 'reference' | 'productGroup'>) {
  return addDoc(getCompaniesRef(), {
    ...input,
    productGroup: input.sector,
    fair: 'PLAT / private label ağı',
    reference: 'Anahtar Creative referansları',
    potentialRevenue: 250000,
    employeeBand: 'Araştırılacak',
    exportFocus: 'Orta',
    signals: ['PLAT üyesi', 'B2B üretici', 'İhracat / private label potansiyeli'],
    weaknesses: ['Web ve LinkedIn kontrol edilecek', 'Kurumsal film / fuar materyali araştırılacak'],
    services: ['İhracat odaklı web sitesi', 'Fuar içerikleri', 'LinkedIn B2B iletişimi'],
    note: 'İlk aramada sosyal medya değil; ihracat odaklı dijital satış kiti anlatılacak.',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCompanyStatus(companyId: string, status: CompanyStatus) {
  await updateDoc(doc(getFirebaseDb(), 'companies', companyId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
