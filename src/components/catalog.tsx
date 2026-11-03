'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { products } from '@/data';
import { ProductCard, formatSize } from './product-card';
import { SelectionButton } from './selection';

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const surfaceLabels = { floor: 'Piso', wall: 'Parede' };
const confirmedSurfaces = [...new Set(products.flatMap(p => p.surfaces))].sort();

export function Catalog() {
  const searchParams = useSearchParams();
  const params = searchParams ?? new URLSearchParams();
  const router = useRouter();
  const [compare, setCompare] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const q = params.get('q') || '';
  const brand = params.get('marca') || '';
  const appearance = params.get('aparencia') || '';
  const finish = params.get('acabamento') || '';
  const surface = params.get('aplicacao') || '';
  const sort = params.get('ordem') || 'editorial';
  const list = products.filter(p =>
    normalize(`${p.name} ${p.reference}`).includes(normalize(q)) &&
    (!brand || p.brand === brand) && (!appearance || p.appearance === appearance) &&
    (!finish || p.finish === finish) && (!surface || p.surfaces.includes(surface as 'wall' | 'floor'))
  ).sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name, 'pt-BR') : sort === 'za' ? b.name.localeCompare(a.name, 'pt-BR') : 0);

  function change(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    router.replace(`/revestimentos?${next}`, { scroll: false });
  }
  const options = (key: 'brand' | 'appearance' | 'finish') => [...new Set(products.map(p => p[key]).filter((x): x is string => !!x))].sort();
  const filters = [
    { key: 'marca', label: 'Fabricante', value: brand, values: options('brand') },
    { key: 'aparencia', label: 'Aparência', value: appearance, values: options('appearance') },
    { key: 'acabamento', label: 'Acabamento', value: finish, values: options('finish') },
  ];
  return <>
    <form className="filters" action="/revestimentos">
      <label className="search-label">Nome ou referência<input name="q" defaultValue={q} key={q} placeholder="Ex.: cimento ou 73003" type="search" /></label>
      {filters.map(({ key, label, value, values }) => <label key={key}>{label}
        <select name={key} value={value} onChange={e => change(key, e.target.value)}><option value="">Todos</option>{values.map(v => <option key={v}>{v}</option>)}</select>
      </label>)}
      <label>Aplicação confirmada<select name="aplicacao" value={surface} onChange={e => change('aplicacao', e.target.value)}>
        <option value="">Todas / a confirmar</option>
        {confirmedSurfaces.map(value => <option key={value} value={value}>{surfaceLabels[value]}</option>)}
      </select></label>
      <button type="submit">Buscar</button><input type="hidden" name="ordem" value={sort} />
    </form>
    <div className="results-bar">
      <p role="status">{list.length} {list.length === 1 ? 'revestimento encontrado' : 'revestimentos encontrados'}</p>
      <Link href="/revestimentos">Limpar filtros</Link>
      <label>Ordenar<select value={sort} onChange={e => change('ordem', e.target.value)}><option value="editorial">Seleção editorial</option><option value="az">Nome: A a Z</option><option value="za">Nome: Z a A</option></select></label>
    </div>
    <p className="caption">Filtros usam somente informações documentadas. Ausência de aplicação não significa incompatibilidade.</p>
    {list.length ? <div className="product-grid">{list.map(p => <div key={p.slug}>
      <ProductCard product={p} />
      <div className="card-actions"><SelectionButton slug={p.slug} />
        <label className="compare-check"><input type="checkbox" checked={compare.includes(p.slug)} disabled={compare.length === 3 && !compare.includes(p.slug)} onChange={() => setCompare(old => old.includes(p.slug) ? old.filter(x => x !== p.slug) : old.length < 3 ? [...old, p.slug] : old)} />Comparar {p.name}</label>
      </div>
    </div>)}</div> : <section className="empty"><h2>Nenhum material com esses critérios.</h2><p>Experimente outra referência ou retire um filtro.</p><Link className="button" href="/revestimentos">Ver todos os revestimentos</Link></section>}
    {compare.length > 0 && <aside className="compare-bar" aria-label="Comparação"><span>{compare.length} de 3 selecionados para comparar</span><button ref={trigger} onClick={() => dialog.current?.showModal()}>Abrir comparação</button><button onClick={() => setCompare([])}>Limpar comparação</button></aside>}
    <dialog ref={dialog} className="compare-dialog" aria-labelledby="compare-title" onClose={() => trigger.current?.focus()}>
      <button autoFocus onClick={() => dialog.current?.close()}>Fechar comparação</button><h2 id="compare-title">Materiais lado a lado</h2>
      <div className="table-scroll"><table>
        <caption>Dados documentados; confirme adequação e disponibilidade com a loja.</caption>
        <thead><tr><th scope="col">Característica</th>{compare.map(slug => <th scope="col" key={slug}>{products.find(p => p.slug === slug)!.name}</th>)}</tr></thead>
        <tbody>{['Marca', 'Referência', 'Formato', 'Acabamento', 'Aplicação'].map((label, i) => <tr key={label}>
          <th scope="row">{label}</th>{compare.map(slug => {
            const p = products.find(p => p.slug === slug)!;
            const surfaces = p.surfaces.map(value => surfaceLabels[value]).join(', ') || 'A confirmar';
            return <td key={slug}>{[p.brand || 'A confirmar', p.reference || 'A confirmar', formatSize(p), p.finish || 'A confirmar', surfaces][i]}</td>;
          })}
        </tr>)}</tbody>
      </table></div>
    </dialog>
  </>;
}
