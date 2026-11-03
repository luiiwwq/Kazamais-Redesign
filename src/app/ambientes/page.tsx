import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data';
import { productImages } from '@/lib/product-images';
export const metadata={title:'Ambientes',description:'Inspiração arquitetônica com imagens vinculadas aos materiais do catálogo.',alternates:{canonical:'/ambientes'}};
export default function Page(){return <div className="wrap section"><header className="page-heading"><h1>Espaços para imaginar.</h1><p>A luz, a escala e a textura mudam a percepção. Observe o conjunto, depois conheça cada material.</p></header>{[products[3],products[4],products[6]].map((p,i)=>{const index=p.images.findIndex(im=>im.kind==='room');return <section className={`environment ${i%2?'reverse':''}`} key={p.slug}><Image src={productImages[p.slug][index]} alt={p.images[index].alt} sizes="(max-width:800px) 100vw, 65vw"/><div><h2>{['O essencial ganha espaço.','Acolhimento em textura.','Veios que desenham.'][i]}</h2><p>{p.description}</p><Link className="text-link" href={`/revestimentos/${p.slug}`}>Conhecer {p.name}</Link><p className="caption">Ambiente ilustrativo. A fotografia não comprova aplicação técnica.</p></div></section>;})}</div>;}
