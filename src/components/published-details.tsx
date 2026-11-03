import type { Product } from '@/data';

export function PublishedDetails({ product }: { product: Product }) {
  return <section className="section" aria-label="Dados publicados pela Kazamais">
    <h2>Dados publicados pela Kazamais</h2>
    <p>Transcrição da publicação, não confirmação independente do fabricante. Valores divergentes foram preservados; consulte as notas antes de especificar.</p>
    {[['Ficha técnica', product.technicalDetails], ['Embalagem', product.packagingDetails]].map(([title, rows]) => <div key={title as string}>
      {Array.isArray(rows) ? <table className="published-table"><caption>{title as string}</caption><tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table> : <p>Embalagem: tabela não publicada nesta página Kazamais.</p>}
    </div>)}
    {product.fieldNotes?.map(note => <p key={note} className="caption">{note}</p>)}
    <a href={product.source} target="_blank" rel="noreferrer">Ler fonte Kazamais (nova aba)</a>
  </section>;
}
