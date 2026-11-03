'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Product } from '@/data';
import { productImages } from '@/lib/product-images';

export function Gallery({ product: p }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <div className="gallery">
    <button ref={trigger} className="gallery-main" onClick={() => { setZoomOpen(true); dialog.current?.showModal(); }} aria-label={`Ampliar imagem de ${p.name}`}>
      <Image src={productImages[p.slug][index]} alt={p.images[index].alt} loading="eager" fetchPriority="high" sizes="(max-width: 800px) 100vw, 55vw" />
      <span>Ampliar fotografia</span>
    </button>
    <div className="thumbnails">{p.images.map((im, i) => <button key={im.src} aria-label={`Ver ${im.kind === 'room' ? 'ambiente' : 'face'} ${i + 1}`} aria-pressed={index === i} onClick={() => setIndex(i)}><Image src={productImages[p.slug][i]} alt="" sizes="90px" /></button>)}</div>
    <p className="caption">{p.images[index].alt}. Imagem ilustrativa; confirme a amostra física.</p>
    <dialog ref={dialog} className="zoom-dialog" aria-label={`Fotografia ampliada: ${p.name}`} onClose={() => { setZoomOpen(false); trigger.current?.focus(); }} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <button autoFocus onClick={() => dialog.current?.close()}>Fechar imagem</button>
      {zoomOpen && <Image src={productImages[p.slug][index]} alt={p.images[index].alt} loading="eager" sizes="90vw" />}
      <p>{p.images[index].alt}</p>
    </dialog>
  </div>;
}
