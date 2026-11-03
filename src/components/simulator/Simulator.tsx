'use client';

import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/data';
import { useSelection } from '@/components/selection';
import styles from './Simulator.module.css';
import type { ReportTexture, TextureReport, TextureSlot } from './texture-status';

const Scene = lazy(() => import('./Scene'));
type Surface = 'floor' | 'wall';
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function Poster() {
  return <svg viewBox="0 0 800 520" role="img" aria-label="Perspectiva ilustrativa local: sala com janela lateral, parede de destaque, sofá e mesa" className={styles.poster}>
    <rect width="800" height="520" fill="#e5e0d5"/><path d="M0 400 190 290H650L800 410V520H0Z" fill="#b8b1a2"/>
    <path d="M190 50H650V290H190Z" fill="#f3f0e8"/><path d="M0 0 190 50V290L0 400Z" fill="#cec8bb"/>
    <path d="M28 85 150 105V245L28 290Z" fill="#e7eff0" stroke="#7f8177" strokeWidth="8"/>
    <path d="M89 95V269" stroke="#7f8177" strokeWidth="6"/>
    <g stroke="#d8d3c9" strokeWidth="1"><path d="M250 50V290M310 50V290M370 50V290M430 50V290M490 50V290M550 50V290M610 50V290M190 110H650M190 170H650M190 230H650"/></g>
    <path d="m290 300 225 0 50 55H255Z" fill="#455950"/><rect x="285" y="245" width="235" height="65" rx="10" fill="#647568"/><path d="M265 290H550V355H265Z" fill="#536658"/>
    <ellipse cx="440" cy="414" rx="110" ry="30" fill="#9c8a71"/><path d="M375 414V465M505 414V465" stroke="#615b51" strokeWidth="9"/>
  </svg>;
}
export default function Simulator() {
  const query = useSearchParams();
  const { has, toggle, ready, storageError } = useSelection();
  const [surface, setSurface] = useState<Surface>('wall');
  const [textureReports, setTextureReports] = useState<Partial<Record<TextureSlot, TextureReport | null>>>({});
  const onTextureStatus = useCallback<ReportTexture>((slot, report) => {
    setTextureReports(previous => ({ ...previous, [slot]: report }));
  }, []);
  const [chosen, setChosen] = useState({ floor: '', wall: '' });
  const [notice, setNotice] = useState('');
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [warm, setWarm] = useState(false);
  const [rotated, setRotated] = useState({ floor: false, wall: false });
  const [preset, setPreset] = useState('room');
  const [angle, setAngle] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const slug = query?.get('produto');
    if (!slug) return;
    const product = products.find(p => p.slug === slug);
    const target = product?.surfaces[0] ?? 'wall';
    if (!product) {
      setNotice('Produto do link não encontrado. Escolha um dos nove materiais.');
      return;
    }
    setSurface(target); setChosen(old => ({ ...old, [target]: slug })); setNotice(`${product.name} aplicado à ${target === 'wall' ? 'parede' : 'superfície de piso'}.`);
  }, [query]);
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    let intersecting = true;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(entries => { intersecting = entries[0].isIntersecting; update(); });
    observer.observe(node); document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  const current = products.find(p => p.slug === chosen[surface]);
  const reset = () => { setChosen({ floor: '', wall: '' }); setWarm(false); setRotated({ floor: false, wall: false }); setPreset('room'); setAngle(0); setNotice('Estudo visual reiniciado. Sua seleção de orçamento foi preservada.'); };
  const start = () => {
    setTextureReports({});
    setStarted(true);
    // Test WebGL2 only after consent, before loading Three. Release the probe immediately.
    try {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) { setFailed(true); return; }
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      setFailed(false); setAttempt(n => n + 1);
    } catch { setFailed(true); }
  };
  const fallback = <div className={styles.fallback} role="status"><strong>Visualização 3D indisponível.</strong><p>WebGL pode estar indisponível ou ter perdido o contexto. Use os controles e consulte o produto abaixo. Sua seleção para orçamento continua disponível.</p><button onClick={start}>Tentar 3D novamente</button></div>;
  return <section className={styles.simulator} aria-label="Estudo de materiais">
    <div>
      <div className={styles.viewport} ref={viewport}>
        {!started || failed ? <Poster/> : null}
        {!started ? <div className={styles.launch}><button className="button" onClick={start}>Iniciar visualização 3D</button><span>Carregamento opcional • sem imagens externas</span></div> : failed ? fallback :
          <SceneBoundary key={attempt} fallback={<><Poster/>{fallback}</>}><Suspense fallback={<><Poster/><p className={styles.loading} role="status">Carregando ambiente 3D…</p></>}><Scene onTextureStatus={onTextureStatus} floor={chosen.floor} wall={chosen.wall} warm={warm} rotated={rotated} preset={preset} angle={angle} active={visible} onFailure={() => setFailed(true)}/></Suspense></SceneBoundary>}
      </div>
      <p className={styles.caption}>Sala conceitual: 4,80 × 4,20 m; pé-direito 2,80 m. Piso e parede do fundo recebem materiais independentes. Mobiliário e demais paredes são cenográficos.</p>
      <fieldset className={styles.controls}><legend>Câmera e iluminação</legend>
        <label>Enquadramento<select value={preset} onChange={e => setPreset(e.target.value)}><option value="room">Ambiente</option><option value="wall">Parede de perto</option><option value="floor">Vista do piso</option></select></label>
        <label>Rotação limitada: {angle}°<input type="range" min="-25" max="25" step="5" value={angle} onChange={e => setAngle(Number(e.target.value))}/></label>
        <button aria-pressed={warm} onClick={() => setWarm(v => !v)}>Luz: {warm ? 'quente' : 'neutra'}</button>
        <button onClick={reset}>Reiniciar estudo</button>
      </fieldset>
    </div>
    <aside className={styles.panel}>
      <h2>Estude a superfície</h2>
      <div role="status" aria-live="polite" aria-atomic="true" data-testid="texture-status">
        {(['floor', 'wall'] as const).map(slot => {
          const slug = chosen[slot];
          const product = products.find(p => p.slug === slug);
          if (!product) return null;
          const report = textureReports[slot];
          const state = report?.slug === slug && report.rotated === rotated[slot] ? report.state : 'loading';
          const text = !started ? 'Textura ainda não carregada. Inicie a visualização 3D.' : failed ? 'Visualização indisponível; textura não exibida.' : state === 'ready' ? 'Face local auditada carregada e exibida.' : state === 'error' ? 'Falha ao carregar a face local. Fallback procedural ilustrativo em uso; não reproduz a peça real.' : state === 'procedural' ? 'Padrão procedural ilustrativo em uso; sem face isolada identificada.' : 'Carregando textura; padrão procedural provisório enquanto a cena está disponível.';
          return <p key={slot} data-texture-slot={slot}>{slot === 'floor' ? 'Piso' : 'Parede'} · {product.name}: {text}{!product.surfaces.includes(slot) && <span> {product.slug === 'classic-white-deco' ? 'Indicação técnica somente para parede; piso é estudo visual.' : 'Aplicação não verificada; apenas estudo visual.'}</span>}</p>;
        })}
      </div>
      <label>Aplicação<select value={surface} onChange={e => setSurface(e.target.value as Surface)}><option value="wall">Parede</option><option value="floor">Piso</option></select></label>
      <label>Material<select aria-label="Material" value={chosen[surface]} onChange={e => { setChosen(old => ({ ...old, [surface]: e.target.value })); setNotice('Material atualizado no estudo.'); }}><option value="">Base cenográfica — sem produto</option>{products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>
      <p>Estudo visual livre: nove materiais, piso e parede independentes.</p>
      {current && !current.surfaces.includes(surface) && <p className={styles.warning}>{current.slug === 'classic-white-deco' && surface === 'floor' ? 'Classic White Deco: indicação técnica para parede. No piso, apenas estudo visual, sem indicação técnica.' : 'Uso nesta superfície não verificado. Estudo visual não é recomendação de instalação.'}</p>}
      <p>Piso: {products.find(p => p.slug === chosen.floor)?.name ?? 'base cenográfica'} · {rotated.floor ? '90°' : '0°'}<br/>Parede: {products.find(p => p.slug === chosen.wall)?.name ?? 'base cenográfica'} · {rotated.wall ? '90°' : '0°'}</p>
      {current && <div className={styles.product}><h3>{current.name}</h3><p>{current.dimensions?.width} × {current.dimensions?.height} cm · {current.finish ?? 'Acabamento a confirmar'}</p><button aria-pressed={rotated[surface]} onClick={() => setRotated(v => ({ ...v, [surface]: !v[surface] }))}>Orientação: {rotated[surface] ? '90°' : '0°'}</button><p>Orientação independente por superfície; no piso, 0° alinha o comprimento à profundidade da sala.</p><button className="button" disabled={!ready} aria-pressed={has(current.slug)} onClick={() => toggle(current.slug)}>{has(current.slug) ? 'Remover do orçamento' : 'Selecionar para orçamento'}</button><Link href={`/revestimentos/${current.slug}`}>Consultar ficha do produto</Link></div>}
      <p className={styles.warning}><strong>Representação ilustrativa.</strong> Faces locais nos nove materiais; Madero, Monterrey e Savoy combinam múltiplas faces oficiais de resolução limitada (510–600 px no maior eixo). Falha de imagem usa padrão procedural identificado. Rugosidade e bump derivados artisticamente da imagem, não PBR medido nem geometria exata de relevo. Juntas publicadas quando disponíveis, senão referência visual de 3 mm. Valide com amostra física e fabricante.</p>
      <p role="status" aria-live="polite">{notice}</p>{storageError && <p role="alert">{storageError}</p>}
      <Link href="/orcamento">Ver seleção para orçamento →</Link>
    </aside>
  </section>;
}
