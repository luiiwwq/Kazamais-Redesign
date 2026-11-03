import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data';
import { productImages } from '@/lib/product-images';
export function formatSize(p:Product){return p.dimensions?`${p.dimensions.width.toLocaleString('pt-BR')} × ${p.dimensions.height.toLocaleString('pt-BR')} cm`:'Formato a confirmar';}
export function ProductCard({product:p}:{product:Product}){const index=p.images.findIndex(i=>i.kind==='room');const i=index<0?0:index;return <article className="product-card"><Link href={`/revestimentos/${p.slug}`}><div className={`product-image ${p.images[i].kind}`}><Image src={productImages[p.slug][i]} alt={p.images[i].alt} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" /></div><div className="product-meta"><span>{p.brand||'Marca a confirmar'}</span><span>Ref. {p.reference||'a confirmar'}</span></div><h3>{p.name}</h3><p>{formatSize(p)}{p.finish?` · ${p.finish}`:''}</p></Link></article>;}
