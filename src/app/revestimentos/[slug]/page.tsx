import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { products } from '@/data';
import { Gallery } from '@/components/gallery';
import { SelectionButton } from '@/components/selection';
import { ProductCard, formatSize } from '@/components/product-card';
import { PublishedDetails } from '@/components/published-details';
export const dynamicParams = false;
export function generateStaticParams() { return products.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const p = products.find(p => p.slug === slug);
  return p ? { title: p.name, description: p.description, alternates: { canonical: `/revestimentos/${p.slug}` } } : { title: 'Material não encontrado' };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = products.find(p => p.slug === slug); if (!p) notFound();
  const related = products.filter(x => x.slug !== slug).sort((a, b) => Number(b.appearance === p.appearance) - Number(a.appearance === p.appearance)).slice(0, 3);
  return <div className="wrap section">
    <nav className="breadcrumbs" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/revestimentos">Revestimentos</Link><span>/</span><span>{p.name}</span></nav>
    <div className="product-detail"><Gallery product={p}/><section>
      <p className="eyebrow">{p.brand || 'Marca a confirmar'} · Ref. {p.reference}</p><h1>{p.name}</h1><p className="lead">{p.description}</p>
      <dl className="specs">{[['Formato adotado no estudo', formatSize(p)], ['Acabamento conciliado', p.finish || 'Não conciliado; veja as notas'], ['Aparência', p.appearance || 'A confirmar'], ['Aplicação técnica verificada', p.surfaces.length ? p.surfaces.map(s => s === 'wall' ? 'Parede' : 'Piso').join(', ') : 'Não verificada'], ['Cor documentada', p.color || 'Não verificada']].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <SelectionButton slug={p.slug}/><p className="caption">Preço, estoque, lote e adequação ao projeto sob consulta.</p><Link className="text-link" href={`/simulador?produto=${p.slug}`}>Explorar no simulador</Link>
    </section></div>
    <PublishedDetails product={p}/>
    <section className="technical-notes"><h2>Antes de especificar</h2><p>As tabelas acima preservam a publicação Kazamais. Validações oficiais e conflitos estão separados abaixo; não alteram silenciosamente os valores publicados.</p><details><summary>Fontes, conflitos e observações ({p.notes.length})</summary><ul>{p.notes.map(note => <li key={note}>{note}</li>)}</ul></details></section>
    <section className="section"><h2>Continue explorando</h2><div className="product-grid">{related.map(p => <ProductCard key={p.slug} product={p}/>)}</div></section>
  </div>;
}
