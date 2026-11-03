'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products, stores } from '@/data';
import { useSelection } from './selection';

export function Quote() {
  const { items, toggle, update, ready, storageError } = useSelection();
  const [unit, setUnit] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kazamais-unit');
      if (stores.some(s => s.name === saved)) setUnit(saved!);
    } catch { /* SelectionProvider reports unavailable storage. */ }
  }, []);
  const summary = [
    'Seleção Kazamais', `Unidade: ${unit || 'A definir'}`,
    ...items.map(x => {
      const p = products.find(p => p.slug === x.slug)!;
      return `\n${p.name} | Ref. ${p.reference || 'a confirmar'}\nÁrea estimada: ${x.area ? `${x.area} m²` : 'a definir'}\nNotas: ${x.notes || 'nenhuma'}`;
    }),
    '\nSolicito confirmação de preço, estoque, aplicação, lote e embalagem. Áreas não incluem perdas.',
  ].join('\n');
  if (!ready) return <p role="status">Recuperando sua seleção…</p>;
  if (!items.length) return <section className="empty"><h2>Seu projeto começa com uma escolha.</h2><p>Salve materiais no catálogo para preparar seu briefing.</p><Link className="button" href="/revestimentos">Explorar revestimentos</Link></section>;
  return <div className="quote-layout">
    <section aria-label="Itens selecionados">
      {storageError && <p role="alert">{storageError}</p>}
      {items.map(item => {
        const p = products.find(p => p.slug === item.slug)!;
        return <article className="quote-item" key={item.slug}>
          <div className="row"><h2><Link href={`/revestimentos/${p.slug}`}>{p.name}</Link></h2><button onClick={() => toggle(item.slug)} aria-label={`Remover ${p.name}`}>Remover</button></div>
          <p>Ref. {p.reference} · {p.brand || 'Marca a confirmar'}</p>
          <label htmlFor={`area-${item.slug}`}>Área estimada em m² (opcional)</label>
          <input id={`area-${item.slug}`} type="number" min="0.01" max="1000000" step="0.01" value={item.area} onChange={e => {
            if (!e.target.value || Number(e.target.value) > 0 && Number(e.target.value) <= 1000000) update(item.slug, { area: e.target.value });
          }} />
          <label htmlFor={`notes-${item.slug}`}>Notas para {p.name} (opcional)</label>
          <textarea id={`notes-${item.slug}`} maxLength={1000} value={item.notes} placeholder="Ambiente, prazo, dúvidas sobre o material…" onChange={e => update(item.slug, { notes: e.target.value })} />
        </article>;
      })}
    </section>
    <aside className="quote-summary">
      <h2>Leve suas ideias à loja.</h2>
      <label htmlFor="unit">Unidade de preferência</label>
      <select id="unit" value={unit} onChange={e => {
        setUnit(e.target.value);
        try { localStorage.setItem('kazamais-unit', e.target.value); } catch { setMessage('Unidade não salva neste navegador.'); }
      }}><option value="">A definir</option>{stores.map(s => <option key={s.name}>{s.name}</option>)}</select>
      <p>Áreas são estimativas, sem perdas. Caixas, rendimento e quantidades finais precisam de confirmação.</p>
      <label htmlFor="summary">Resumo para copiar</label>
      <textarea id="summary" className="summary-text" readOnly value={summary} />
      <button className="button" onClick={async () => {
        try { await navigator.clipboard.writeText(summary); setMessage('Resumo copiado. Nenhum pedido foi enviado.'); }
        catch { setMessage('Não foi possível copiar automaticamente. Selecione o texto do resumo e copie manualmente.'); }
      }}>Copiar resumo</button>
      <p role="status">{message}</p>
      <p className="caption">Salvo apenas neste navegador. Nenhum dado é enviado à Kazamais. Não inclua informações sensíveis nas notas.</p>
      <Link href="/lojas">Consultar contatos das lojas</Link>
    </aside>
  </div>;
}
