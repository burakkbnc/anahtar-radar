'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      } else {
        await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      }
    } catch (err) {
      setError(firebaseErrorToText(err));
    }
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-surface text-sm font-semibold text-muted">Anahtar Radar açılıyor...</div>;
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface p-5">
        <section className="w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-soft">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Anahtar Radar</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Satış paneline giriş</h1>
            <p className="mt-2 text-sm text-muted">Firebase Auth ile güvenli giriş. İlk kullanıcıyı “Kayıt oluştur” ile açabilirsin.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-ink">E-posta</span>
              <input className="mt-2 w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-ink" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="burak@anahtarcreative.com" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Şifre</span>
              <input className="mt-2 w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-ink" value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} required placeholder="En az 6 karakter" />
            </label>

            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div> : null}

            <button className="w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white" type="submit">
              {mode === 'login' ? 'Giriş yap' : 'Kayıt oluştur'}
            </button>
          </form>

          <button className="mt-5 w-full text-sm font-semibold text-muted hover:text-ink" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'İlk kullanıcıyı oluştur' : 'Zaten hesabım var, giriş yap'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className="fixed right-5 top-5 z-50 hidden items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2 text-xs shadow-soft lg:flex">
        <span className="max-w-[220px] truncate text-muted">{user.email}</span>
        <button className="font-semibold text-ink" onClick={() => signOut(getFirebaseAuth())} type="button">Çıkış</button>
      </div>
      {children}
    </>
  );
}

function firebaseErrorToText(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: string }).code) : '';
  if (code.includes('auth/invalid-credential')) return 'E-posta veya şifre hatalı.';
  if (code.includes('auth/email-already-in-use')) return 'Bu e-posta ile zaten kullanıcı var.';
  if (code.includes('auth/weak-password')) return 'Şifre en az 6 karakter olmalı.';
  if (code.includes('auth/configuration-not-found')) return 'Firebase Authentication içinde Email/Password aktif değil.';
  return 'İşlem tamamlanamadı. Firebase ayarlarını ve .env.local dosyasını kontrol et.';
}
