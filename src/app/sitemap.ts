import type { MetadataRoute } from 'next';
import { products } from '@/data';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';return ['/','/revestimentos','/ambientes','/profissionais','/lojas','/simulador',...products.map(p=>`/revestimentos/${p.slug}`)].map(path=>({url:new URL(path,base).href}));}
