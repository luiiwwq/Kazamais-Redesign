import Image from 'next/image';
import Link from 'next/link';
import { products, stores } from '@/data';
import { productImages } from '@/lib/product-images';
import { ProductCard } from '@/components/product-card';

const appearances = [
  { label: 'Cimento', value: 'Cimento' },
  { label: 'Concreto', value: 'Concreto' },
  { label: 'Madeira', value: 'Madeira' },
  { label: 'Pedra', value: 'Pedra' },
  { label: 'Mármore', value: 'Mármore' },
  { label: 'Relevo', value: 'Monocolor, relevo 3D' },
].map(appearance => ({ ...appearance, count: products.filter(p => p.appearance === appearance.value).length }))
  .filter(appearance => appearance.count > 0);

export default function Home() {
  const hero = products.find(p => p.slug === 'monterrey-cement')!;
  return <>
    <section className="hero wrap">
      <div className="hero-heading">
        <h1>Cada espaço começa pela escolha da matéria.</h1>
        <div>
          <p>Texturas, formatos e possibilidades para dar forma ao seu jeito de habitar.</p>
          <div className="hero-actions">
            <Link className="button" href="/revestimentos">Explorar revestimentos</Link>
            <Link className="hero-secondary" href={`/simulador?produto=${hero.slug}`}>Visualizar em um ambiente</Link>
          </div>
        </div>
      </div>
      <figure className="hero-photo">
        <Image src={productImages[hero.slug][0]} alt={hero.images[0].alt} priority sizes="100vw" />
        <figcaption><span>Cimento, luz e continuidade.</span><Link href={`/revestimentos/${hero.slug}`}>Conheça Monterrey Cement</Link></figcaption>
      </figure>
    </section>

    <section className="wrap section">
      <div className="section-heading">
        <h2>A matéria muda<br />a leitura do espaço.</h2>
        <p>Do relevo delicado à presença do concreto. Explore a seleção e encontre o ponto de partida do seu projeto.</p>
      </div>
      <div className="featured-grid">{[products[0], products[6], products[8]].map(p => <ProductCard key={p.slug} product={p} />)}</div>
      <Link className="text-link" href="/revestimentos">Ver os nove revestimentos</Link>
    </section>

    <section className="wrap section material-index" aria-labelledby="appearance-title">
      <div className="material-index-intro">
        <h2 id="appearance-title">Por onde começa<br />a sua escolha?</h2>
        <p>Uma aparência pode ser o primeiro caminho. Explore as referências, depois compare os detalhes de cada material.</p>
      </div>
      <ol className="material-index-list" aria-label="Explorar por aparência">
        {appearances.map((appearance, i) => <li key={appearance.value}>
          <Link href={`/revestimentos?${new URLSearchParams({ aparencia: appearance.value })}`}>
            <span className="material-index-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="material-index-name">{appearance.label}</span>
            <span className="material-index-count">{appearance.count} {appearance.count === 1 ? 'referência' : 'referências'}</span>
          </Link>
        </li>)}
      </ol>
    </section>

    <section className="editorial-band">
      <div>
        <p className="eyebrow">Antes da obra, possibilidades</p>
        <h2>Veja a matéria<br />em outra perspectiva.</h2>
        <p>Explore combinações no simulador. A representação digital não substitui a amostra física nem a orientação técnica.</p>
        <Link className="button" href="/simulador">Abrir simulador</Link>
      </div>
      <Image src={productImages['madero-jatoba-externo'][0]} alt={products[4].images[0].alt} sizes="(max-width:800px) 100vw, 50vw" />
    </section>

    <section className="home-professionals" aria-labelledby="professionals-title">
      <div className="wrap section">
        <div className="section-heading">
          <h2 id="professionals-title">Para quem projeta,<br />cada detalhe conta.</h2>
          <div><p>Da primeira referência à conversa técnica, organize as escolhas sem perder de vista o que precisa ser confirmado.</p><Link className="text-link" href="/profissionais">Conheça o percurso para profissionais</Link></div>
        </div>
        <ol className="professional-process" aria-label="Da seleção à especificação">
          <li><h3>Seleção</h3><p>Reúna referências e registre as áreas estimadas e as perguntas do projeto.</p></li>
          <li><h3>Comparação</h3><p>Veja até três materiais lado a lado, com formatos, acabamentos e aplicações documentados.</p></li>
          <li><h3>Especificação</h3><p>Valide amostras, ficha técnica, instalação e embalagem com a loja e o fabricante antes de fechar.</p></li>
        </ol>
      </div>
    </section>

    <section className="wrap section home-stores" aria-labelledby="stores-title">
      <div className="home-stores-intro">
        <h2 id="stores-title">A próxima escolha<br />pode ser ao vivo.</h2>
        <p>Veja o material de perto e converse sobre o seu projeto em uma das quatro unidades.</p>
        <p className="caption">Confirme horários e disponibilidade antes da visita.</p>
      </div>
      <ul className="home-store-list" aria-label="Unidades Kazamais">
        {stores.map(store => <li key={store.name}>
          <Link href="/lojas"><span>{store.name}</span><span className="home-store-action">Endereço e contato</span></Link>
        </li>)}
      </ul>
    </section>
  </>;
}
