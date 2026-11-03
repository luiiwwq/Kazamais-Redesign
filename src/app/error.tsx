'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="wrap section"><h1>Não foi possível abrir este espaço.</h1><p>Tente carregar novamente ou volte ao catálogo.</p><button onClick={reset}>Tentar novamente</button> <Link href="/revestimentos">Voltar ao catálogo</Link></div>;}
