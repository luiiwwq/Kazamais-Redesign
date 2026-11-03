import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { SelectionProvider } from '@/components/selection';
import './globals.css';
export const metadata: Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'Kazamais | Matéria para viver',template:'%s | Kazamais'},description:'Explore revestimentos, compare materiais e prepare uma seleção para seu projeto. Conheça as unidades Kazamais.',robots:{index:process.env.SITE_INDEXABLE==='true',follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><SelectionProvider><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header/><main id="conteudo">{children}</main><footer><div><p className="footer-title">Matéria para viver.</p><p>Revestimentos, possibilidades e escolhas conscientes.</p></div><nav aria-label="Rodapé"><Link href="/revestimentos">Catálogo</Link><Link href="/lojas">Encontre uma loja</Link><Link href="/orcamento">Minha seleção</Link><Link href="/profissionais">Para profissionais</Link></nav><p className="caption">Informações sujeitas à confirmação. Fotografias ilustrativas; consulte amostras e fichas técnicas antes de especificar.</p></footer></SelectionProvider></body></html>;}
