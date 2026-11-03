import { Suspense } from 'react';
import { Catalog } from '@/components/catalog';
export const metadata={title:'Revestimentos',description:'Busque nove revestimentos por nome, referência, aparência e acabamento documentados.',alternates:{canonical:'/revestimentos'}};
export default function Page(){return <div className="wrap section"><header className="page-heading"><p className="eyebrow">Catálogo de materiais</p><h1>Escolhas que dão forma.</h1><p>Explore, compare e guarde os materiais para o seu projeto.</p></header><Suspense fallback={<p role="status">Carregando catálogo…</p>}><Catalog/></Suspense></div>;}
