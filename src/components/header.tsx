'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import logo from '@/assets/images/brands/kazamais-logo.png';
import { useSelection } from './selection';

const links = [['/revestimentos', 'Revestimentos'], ['/ambientes', 'Ambientes'], ['/profissionais', 'Profissionais'], ['/lojas', 'Lojas'], ['/simulador', 'Simulador']];
export function Header() {
  const path = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const { items } = useSelection();
  return <header className="site-header">
    <Link href="/" aria-label="Kazamais, início"><Image className="logo" src={logo} alt="Kazamais" priority /></Link>
    <button ref={menu} className="menu-button" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>Menu</button>
    <nav id="navigation" className={open ? 'navigation open' : 'navigation'} aria-label="Principal" onKeyDown={e => {
      if (e.key === 'Escape') { setOpen(false); menu.current?.focus(); }
    }}>
      {links.map(([href, label]) => <Link key={href} href={href} aria-current={path.startsWith(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
    </nav>
    <Link className="selection-link" href="/orcamento" onClick={() => setOpen(false)}>Minha seleção <span>{items.length}</span></Link>
  </header>;
}
