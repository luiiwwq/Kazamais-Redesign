import Image from 'next/image';
import { stores } from '@/data';
import facade from '@/assets/images/store/fachada.png';
import { StoreMap } from '@/components/store-map';
export const metadata={title:'Nossas lojas',description:'Endereços e contatos publicados das quatro unidades Kazamais.',alternates:{canonical:'/lojas'}};
export default function Page(){return <div className="wrap section"><header className="page-heading"><h1>O material de perto.<br/>A escolha com calma.</h1><p>Encontre sua unidade Kazamais. Confirme horários e disponibilidade antes da visita.</p></header><Image className="store-photo" src={facade} alt="Fachada Kazamais, imagem institucional do acervo" loading="eager" sizes="100vw"/><div className="store-grid">{stores.map(s=><article key={s.name}><h2>{s.name}</h2><address>{s.address}</address><p>{s.hours}</p>{s.phone&&<a className="text-link" href={`tel:+55${s.phone.replace(/\D/g,'')}`}>{s.phone}</a>}<StoreMap store={s}/><p className="caption">Dados publicados; não confirmados por contato.</p></article>)}</div></div>;}
