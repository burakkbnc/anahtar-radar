import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './client';
import type { Contact } from '@/lib/data';

function getContactsRef(companyId: string) {
  return collection(getFirebaseDb(), 'companies', companyId, 'contacts');
}

export async function getContacts(companyId: string): Promise<Contact[]> {
  const snapshot = await getDocs(query(getContactsRef(companyId), orderBy('createdAt', 'desc')));

  return snapshot.docs.map((item) => ({
    id: item.id,
    companyId,
    ...item.data(),
  } as Contact));
}

export async function addContact(input: {
  companyId: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
}) {
  return addDoc(getContactsRef(input.companyId), {
    name: input.name,
    title: input.title,
    phone: input.phone,
    email: input.email,
    linkedin: input.linkedin,
    createdAt: serverTimestamp(),
  });
}

export async function deleteContact(companyId: string, contactId: string) {
  await deleteDoc(doc(getFirebaseDb(), 'companies', companyId, 'contacts', contactId));
}