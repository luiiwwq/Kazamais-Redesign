'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, NoColorSpace } from 'three';
import { RoundedBox, Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { productImages } from '@/lib/product-images';
import { products } from '@/data';
import { drawAtlas, layout, materialFamily, jointFor } from './materials';
import { officialFaces } from './official-faces';
import type { ReportTexture } from './texture-status';

interface Props { onTextureStatus: ReportTexture; floor: string; wall: string; warm: boolean; rotated: { floor: boolean; wall: boolean }; preset: string; angle: number; active: boolean; onFailure: () => void }
type Vec = [number, number, number];
function Box({ position, size, color, roughness = .85 }: { position: Vec; size: Vec; color: string; roughness?: number }) {
  return <RoundedBox position={position} args={size} radius={Math.min(.045, ...size.map(v => v / 4))} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={color} roughness={roughness}/></RoundedBox>;
}
function Surface({ slug, floor, rotated, onTextureStatus }: { slug: string; floor?: boolean; rotated: boolean; onTextureStatus: ReportTexture }) {
  const [maps, setMaps] = useState<{ color: CanvasTexture; bump: CanvasTexture; roughness: CanvasTexture } | null>(null);
  const { gl, invalidate } = useThree();
  const product = products.find(p => p.slug === slug);
  useEffect(() => {
    const slot = floor ? 'floor' : 'wall';
    if (!product?.dimensions) { setMaps(null); return; }
    const dimensions = product.dimensions;
    let disposed = false; let owned: CanvasTexture[] = [];
    const update = (images: HTMLImageElement[] = []) => {
      if (disposed) return;
      const atlas = drawAtlas(product, rotated, images);
      const { repeatX, repeatY } = layout(dimensions, !!floor, rotated, jointFor(product));
      const make = (canvas: HTMLCanvasElement, color: boolean) => {
        const map = new CanvasTexture(canvas); map.colorSpace = color ? SRGBColorSpace : NoColorSpace;
        map.wrapS = map.wrapT = RepeatWrapping; map.repeat.set(repeatX / atlas.cols, repeatY / atlas.rows);
        map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy()); return map;
      };
      const next = { color: make(atlas.color, true), bump: make(atlas.bump, false), roughness: make(atlas.roughness, false) };
      const previous = owned; owned = Object.values(next); setMaps(next); previous.forEach(map => map.dispose()); invalidate();
    };
    update();
    const index = product.images.findIndex(i => i.kind === 'tile');
    const report = (state: 'loading' | 'ready' | 'error' | 'procedural') => {
      if (!disposed) onTextureStatus(slot, { slug: product.slug, rotated, state });
    };
    const sources = officialFaces[product.slug] ?? (index >= 0 ? [productImages[product.slug][index]] : []);
    const pending: HTMLImageElement[] = [];
    if (sources.length) {
      report('loading');
      Promise.all(sources.map(source => new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image(); pending.push(image);
        image.onload = () => resolve(image); image.onerror = () => reject(new Error('Face unavailable'));
        image.src = source.src;
      }))).then(images => {
        if (!disposed) { try { update(images); report('ready'); } catch { update(); report('error'); } }
      }).catch(() => { if (!disposed) report('error'); });
    } else report('procedural');
    return () => {
      disposed = true;
      pending.forEach(image => { image.onload = null; image.onerror = null; });
      owned.forEach(map => map.dispose());
      onTextureStatus(slot, null);
    };
  }, [product, floor, rotated, gl, invalidate, onTextureStatus]);
  return <mesh position={floor ? [0, .005, 0] : [0, 1.4, -2.095]} rotation={floor ? [-Math.PI / 2, 0, 0] : [0, 0, 0]} receiveShadow><planeGeometry args={[4.8, floor ? 4.2 : 2.8]}/><meshStandardMaterial key={maps ? 'mapped' : 'base'} map={maps?.color ?? null} bumpMap={maps?.bump ?? null} bumpScale={product?.slug === 'savoy' ? .003 : .012} roughnessMap={maps?.roughness ?? null} color={maps ? '#ffffff' : floor ? '#b5aa96' : '#e7e0d2'} roughness={product ? materialFamily(product) === 'wood' ? .95 : product.slug === 'savoy' ? .58 : .84 : .92}/></mesh>;
}
function Runtime({ preset, angle, active, onFailure }: Props) {
  const { camera, invalidate, gl, setDpr } = useThree();
  useEffect(() => {
    const a = angle * Math.PI / 180;
    const distance = preset === 'wall' ? 3.6 : preset === 'floor' ? 6.8 : 7.2;
    camera.position.set(Math.sin(a) * distance, preset === 'floor' ? 5.5 : preset === 'wall' ? 1.9 : 3.4, Math.cos(a) * distance - 1);
    camera.lookAt(0, preset === 'floor' ? .1 : 1.2, -1); camera.updateProjectionMatrix(); invalidate();
  }, [camera, preset, angle, invalidate]);
  useEffect(() => { const canvas = gl.domElement; const lost = (e: Event) => { e.preventDefault(); onFailure(); }; canvas.addEventListener('webglcontextlost', lost); return () => canvas.removeEventListener('webglcontextlost', lost); }, [gl, onFailure]);
  useEffect(() => { if (active) invalidate(); }, [active, invalidate]);
  // Measure actual rendering cost, not demand-loop idle deltas. One-way reduction avoids oscillation.
  useEffect(() => {
    let slow = 0; const original = gl.render.bind(gl);
    gl.render = (...args) => { const start = performance.now(); original(...args); if (performance.now() - start > 28 && ++slow === 4) setDpr(1); };
    return () => { gl.render = original; };
  }, [gl, setDpr]);
  return null;
}
export default function Scene(props: Props) {
  return <Canvas frameloop={props.active ? 'demand' : 'never'} dpr={[1, 1.5]} shadows="percentage" camera={{ position: [0, 3.4, 6.2], fov: 46, near: .1, far: 35 }} gl={{ antialias: true, powerPreference: 'low-power' }} fallback={<p>WebGL indisponível. Use os controles de material e orçamento ao lado.</p>}>
    <color attach="background" args={['#e5e0d5']}/><Runtime {...props}/>
    <hemisphereLight args={['#f3f5f7', '#8b8275', .65]}/>
    <Environment resolution={64} frames={1}><Lightformer position={[-4, 2.4, 0]} rotation={[0, Math.PI / 2, 0]} scale={[2, 1.4, 1]} intensity={3}/><Lightformer position={[1, 4, 3]} scale={[4, 3, 1]} intensity={.8}/></Environment>
    <directionalLight position={[-3.5, 4.8, 2]} intensity={props.warm ? 2.4 : 2.15} color={props.warm ? '#ffd3a0' : '#fff4e5'} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-3.8} shadow-camera-right={3.8} shadow-camera-top={4} shadow-camera-bottom={-3} shadow-camera-near={.5} shadow-camera-far={14} shadow-normalBias={.008} shadow-bias={-.00015} shadow-radius={3}/>
    <Surface slug={props.floor} floor rotated={props.rotated.floor} onTextureStatus={props.onTextureStatus}/><Surface slug={props.wall} rotated={props.rotated.wall} onTextureStatus={props.onTextureStatus}/>
    {/* Static furniture only: one low-resolution depth/blur capture, never per frame. */}
    <ContactShadows position={[0, .012, 0]} opacity={.24} scale={5.2} blur={2.4} far={1.7} resolution={256} frames={1} color="#53483c"/>
    <Box position={[0, -.09, 0]} size={[4.96, .18, 4.36]} color="#b8af9e"/>
    <Box position={[0, 1.4, -2.2]} size={[4.96, 2.8, .2]} color="#e7e0d2"/>
    {/* Left wall with a real 2.0 × 1.4 m opening, sill at 0.9 m. */}
    <Box position={[-2.5, .45, 0]} size={[.2, .9, 4.2]} color="#d5cdbd"/>
    <Box position={[-2.5, 2.55, 0]} size={[.2, .5, 4.2]} color="#d5cdbd"/>
    <Box position={[-2.5, 1.6, -1.6]} size={[.2, 1.4, 1]} color="#d5cdbd"/>
    <Box position={[-2.5, 1.6, 1.5]} size={[.2, 1.4, 1.2]} color="#d5cdbd"/>
    <Box position={[-2.48, 1.6, -.1]} size={[.12, 1.4, .045]} color="#615d50"/>
    <Box position={[-2.45, .9, -.1]} size={[.32, .06, 2]} color="#9c8b72"/>
    <Box position={[0, .28, -1.15]} size={[2.25, .35, .88]} color="#45594c"/>
    <Box position={[0, .72, -1.52]} size={[2.25, .7, .25]} color="#657666"/>
    {[-1.1, 1.1].map(x => <Box key={x} position={[x, .6, -1.1]} size={[.18, .48, .95]} color="#536956"/>)}
    {[-.55, .55].map(x => <Box key={x} position={[x, .5, -1.03]} size={[1.06, .18, .65]} color="#74816c"/>)}
    {[-.72, .72].map(x => <group key={x} position={[x, .79, -1.25]} rotation={[-.18, 0, x * .16]}><RoundedBox args={[.43, .43, .16]} radius={.075} smoothness={3} castShadow><meshPhysicalMaterial color={x < 0 ? '#c1b39a' : '#87917c'} roughness={.96} sheen={.7} sheenColor="#e7e0d2"/></RoundedBox></group>)}
    {[-.9, .9].flatMap(x => [-1.4, -.85].map(z => <Box key={`leg-${x}-${z}`} position={[x, .09, z]} size={[.07, .18, .07]} color="#574738"/>))}
    <mesh position={[0, .48, .55]} castShadow receiveShadow><cylinderGeometry args={[.65, .65, .08, 48]}/><meshStandardMaterial color="#987c59" roughness={.65}/></mesh>
    {[-.4, .4].flatMap(x => [-.3, .3].map(z => <Box key={`${x}-${z}`} position={[x, .23, .55 + z]} size={[.055, .46, .055]} color="#5b5142"/>))}
    <Box position={[1.65, .4, -1.3]} size={[.55, .8, .55]} color="#9c8565"/>
    <mesh position={[1.65, .94, -1.3]} castShadow><cylinderGeometry args={[.12, .1, .28, 24]}/><meshStandardMaterial color="#ac6d50" roughness={.95}/></mesh>
    {[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[1.65 + Math.sin(i * 2) * .12, 1.23 + i * .055, -1.3 + Math.cos(i * 2) * .12]} rotation={[.4, i, .5]} castShadow><sphereGeometry args={[.13, 12, 8]}/><meshStandardMaterial color={i % 2 ? '#667250' : '#425841'} roughness={.9}/></mesh>)}
  </Canvas>;
}
