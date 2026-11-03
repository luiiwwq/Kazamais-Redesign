'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { products } from '@/data';

export interface SelectionItem { slug: string; area: string; notes: string }
type ItemPatch = Partial<Pick<SelectionItem, 'area' | 'notes'>>;
interface Selection {
  items: SelectionItem[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  update: (slug: string, patch: ItemPatch) => void;
  ready: boolean;
  storageError: string;
}
type Mutation = (latest: SelectionItem[]) => SelectionItem[];
const Context = createContext<Selection | null>(null);
const key = 'kazamais-selection-v1';
const lockName = `${key}-mutation`;

function readSelection(): SelectionItem[] {
  const raw: unknown = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.flatMap(item => {
    if (!item || !products.some(p => p.slug === item.slug) || seen.has(item.slug)) return [];
    seen.add(item.slug);
    return [{ slug: item.slug, area: typeof item.area === 'string' ? item.area.slice(0, 12) : '', notes: typeof item.notes === 'string' ? item.notes.slice(0, 1000) : '' }];
  });
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SelectionItem[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setError] = useState('');
  const current = useRef<SelectionItem[]>([]);
  const sessionOnly = useRef(false);
  const mounted = useRef(false);

  function publish(next: SelectionItem[]) {
    current.current = next;
    if (mounted.current) setItems(next);
  }

  useEffect(() => {
    mounted.current = true;
    function refresh() {
      // Never replace unsaved in-memory edits when storage is unavailable.
      if (sessionOnly.current) return;
      try { publish(readSelection()); }
      catch {
        sessionOnly.current = true;
        setError('Não foi possível recuperar a seleção. Você pode continuar nesta sessão.');
      }
    }
    function onStorage(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === key || event.key === null)) refresh();
    }
    refresh();
    setReady(true);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    return () => {
      mounted.current = false;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  function mutate(operation: Mutation) {
    if (!ready) return;
    function commit() {
      let latest = current.current;
      if (!sessionOnly.current) {
        try { latest = readSelection(); }
        catch {
          sessionOnly.current = true;
          if (mounted.current) setError('Não foi possível recuperar a seleção. Você pode continuar nesta sessão.');
        }
      }
      const next = operation(latest);
      // Persistence belongs to the mutation, not a React state effect. Incoming
      // storage events cannot write stale snapshots back into another tab.
      if (!sessionOnly.current) {
        try { localStorage.setItem(key, JSON.stringify(next)); }
        catch {
          sessionOnly.current = true;
          if (mounted.current) setError('O navegador não permitiu salvar. Copie o resumo antes de sair.');
        }
      }
      publish(next);
    }
    // Serialize read/modify/write across same-origin tabs when Web Locks exists.
    // Without it, still rebase synchronously, but localStorage is not transactional.
    if (navigator.locks) {
      void navigator.locks.request(lockName, commit).catch(() => {
        if (mounted.current) setError('Não foi possível sincronizar a alteração entre abas. Tente novamente.');
      });
    } else commit();
  }

  function toggle(slug: string) {
    if (!products.some(p => p.slug === slug)) return;
    // Capture the user's intent before waiting for the lock. A second removal
    // from a stale tab must remain a removal, not become an accidental addition.
    const removing = current.current.some(item => item.slug === slug);
    mutate(latest => removing ? latest.filter(item => item.slug !== slug)
      : latest.some(item => item.slug === slug) ? latest : [...latest, { slug, area: '', notes: '' }]);
  }

  function update(slug: string, patch: ItemPatch) {
    const fields: ItemPatch = {};
    if (typeof patch.area === 'string') fields.area = patch.area.slice(0, 12);
    if (typeof patch.notes === 'string') fields.notes = patch.notes.slice(0, 1000);
    // Patch only supplied fields; an edit never recreates a removed item.
    mutate(latest => latest.map(item => item.slug === slug ? { ...item, ...fields } : item));
  }

  return <Context.Provider value={{ items, toggle, has: slug => items.some(item => item.slug === slug), update, ready, storageError }}>{children}</Context.Provider>;
}

export function useSelection() {
  const value = useContext(Context);
  if (!value) throw new Error('useSelection requires SelectionProvider');
  return value;
}
export function SelectionButton({ slug }: { slug: string }) {
  const { has, toggle, ready } = useSelection();
  return <button className={has(slug) ? 'button selected' : 'button'} disabled={!ready} aria-pressed={has(slug)} onClick={() => toggle(slug)}>{has(slug) ? 'Remover da seleção' : 'Selecionar para orçamento'}</button>;
}
