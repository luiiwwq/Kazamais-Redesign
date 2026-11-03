'use client';

import { useRef, useState } from 'react';
import type { Store } from '@/data';

export function StoreMap({ store }: { store: Store }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const query = encodeURIComponent(`${store.address} ${store.name.replace('Unidade ', '')} Brasil`);
  const src = `https://www.google.com/maps?q=${query}&output=embed`;
  return <div className="store-map">
    <div className="map-preview"><iframe src={src} title={`Mapa de ${store.name}: ${store.address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1}/><button ref={trigger} className="map-open" onClick={() => { setLoaded(false); setOpen(true); dialog.current?.showModal(); }} aria-label={`Ampliar mapa de ${store.name}`}><span>Ampliar mapa ↗</span></button></div>
    <p className="caption">Prévia Google Maps. O mapa consulta um serviço externo; confirme o endereço antes de sair.</p>
    <dialog ref={dialog} className="map-dialog" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} aria-label={`Mapa ampliado de ${store.name}`}>
      <div className="map-dialog-heading"><h2>{store.name}</h2><button autoFocus onClick={() => dialog.current?.close()}>Fechar mapa</button></div>
      <p>{store.address}</p>
      <div className="map-full">{open && <iframe src={src} title={`Mapa interativo ampliado de ${store.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" onLoad={() => setLoaded(true)}/>}<span className="caption" role="status">{loaded ? 'Mapa externo. Confira o endereço informado.' : 'Carregando mapa externo… Se não aparecer, use o link abaixo.'}</span></div>
      <p><a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Abrir endereço no Google Maps (nova aba)</a></p>
      <p className="caption">Se a prévia não carregar, use o link acima ou o endereço informado.</p>
    </dialog>
  </div>;
}
