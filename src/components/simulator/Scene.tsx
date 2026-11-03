'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { RoundedBox, Environment, Lightformer } from '@react-three/drei';
import { productImages } from '@/lib/product-images';
import { products } from '@/data';
import { drawTile, layout, materialFamily } from './materials';
import type { ReportTexture } from './texture-status';

interface Props { onTextureStatus: ReportTexture; sample?: string; floor: string; wall: string; warm: boolean; rotated: { floor: boolean; wall: boolean }; preset: string; angle: number; active: boolean; onFailure: () => void }
type Vec = [number, number, number];
function Box({ position, size, color, roughness = .85 }: { position: Vec; size: Vec; color: string; roughness?: number }) {
  return <RoundedBox position={position} args={size} radius={Math.min(.045, ...size.map(v => v / 4))} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={color} roughness={roughness}/></RoundedBox>;
}
function Surface({ slug, floor, rotated, sample = false, onTextureStatus }: { slug: string; floor?: boolean; rotated: boolean; sample?: boolean; onTextureStatus: ReportTexture }) {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const { gl, invalidate } = useThree();
  const product = products.find(p => p.slug === slug && (sample || p.surfaces.includes(floor ? 'floor' : 'wall')));
  useEffect(() => {
    const slot = sample ? 'sample' : floor ? 'floor' : 'wall';
    if (!product?.dimensions) { setTexture(null); return; }
    const dimensions = product.dimensions;
    let disposed = false; let owned: CanvasTexture | undefined;
    const update = (image?: HTMLImageElement) => {
    if (disposed) return;
    const canvas = drawTile(product, rotated, image);
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; map.wrapS = map.wrapT = RepeatWrapping;
    const { repeatX, repeatY } = layout(dimensions, !!floor, rotated);
    map.repeat.set(sample ? 1 : repeatX, sample ? 1 : repeatY);
    map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    map.needsUpdate = true; const previous = owned; owned = map; setTexture(map); previous?.dispose(); invalidate();
    };
    update();
    const index = product.images.findIndex(i => i.kind === 'tile');
    const report = (state: 'loading' | 'ready' | 'error' | 'procedural') => {
      if (!disposed) onTextureStatus(slot, { slug: product.slug, rotated, state });
    };
    let image: HTMLImageElement | undefined;
    if (index >= 0) {
      report('loading');
      image = new Image();
      image.onload = () => {
        if (disposed) return;
        try { update(image); report('ready'); } catch { update(); report('error'); }
      };
      image.onerror = () => report('error');
      image.src = productImages[product.slug][index].src;
    } else report('procedural');
    return () => {
      disposed = true;
      if (image) { image.onload = null; image.onerror = null; }
      owned?.dispose();
      onTextureStatus(slot, null);
    };
  }, [product, floor, rotated, sample, gl, invalidate, onTextureStatus]);
  const ratio = product?.dimensions ? product.dimensions.width / product.dimensions.height : 1;
  return <mesh position={sample ? [0, 1.5, .1] : floor ? [0, .005, 0] : [0, 1.4, -2.095]} rotation={floor ? [-Math.PI / 2, 0, 0] : [0, 0, 0]} receiveShadow><planeGeometry args={sample ? [Math.min(1.8, 1.8 * ratio), Math.min(1.8, 1.8 / ratio)] : [4.8, floor ? 4.2 : 2.8]}/><meshStandardMaterial key={texture ? 'mapped' : 'base'} map={texture} color={texture ? '#ffffff' : floor ? '#b5aa96' : '#e7e0d2'} roughness={product ? materialFamily(product) === 'relief' ? .55 : materialFamily(product) === 'wood' ? .88 : .8 : .92}/></mesh>;
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
    <hemisphereLight args={['#fffaf0', '#777769', 1.3]}/>
    <Environment resolution={64} frames={1}><Lightformer position={[-4, 3, 1]} scale={[3, 3, 1]} intensity={2}/><Lightformer position={[3, 4, 3]} scale={[4, 2, 1]} intensity={1}/></Environment>
    <directionalLight position={[-3, 4, 1]} intensity={props.warm ? 3 : 2.5} color={props.warm ? '#ffd3a0' : '#fff7eb'} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-normalBias={.025}/>
    <Surface slug={props.floor} floor rotated={props.rotated.floor} onTextureStatus={props.onTextureStatus}/><Surface slug={props.wall} rotated={props.rotated.wall} onTextureStatus={props.onTextureStatus}/>
    {props.sample && <group><Box position={[0, .3, .05]} size={[2.05, .6, .5]} color="#d2c8b6"/><Box position={[0, 1.5, .04]} size={[1.9, 1.9, .08]} color="#383e38"/><Surface slug={props.sample} sample rotated={false} onTextureStatus={props.onTextureStatus}/></group>}
    <Box position={[0, -.09, 0]} size={[4.96, .18, 4.36]} color="#b8af9e"/>
    <Box position={[0, 1.4, -2.2]} size={[4.96, 2.8, .2]} color="#e7e0d2"/>
    {/* Left wall with a real 2.0 × 1.4 m opening, sill at 0.9 m. */}
    <Box position={[-2.5, .45, 0]} size={[.2, .9, 4.2]} color="#d5cdbd"/>
    <Box position={[-2.5, 2.55, 0]} size={[.2, .5, 4.2]} color="#d5cdbd"/>
    <Box position={[-2.5, 1.6, -1.6]} size={[.2, 1.4, 1]} color="#d5cdbd"/>
    <Box position={[-2.5, 1.6, 1.5]} size={[.2, 1.4, 1.2]} color="#d5cdbd"/>
    <Box position={[-2.48, 1.6, -.1]} size={[.12, 1.4, .045]} color="#615d50"/>
    <Box position={[-2.45, .9, -.1]} size={[.32, .06, 2]} color="#9c8b72"/>
    {!props.sample && <>
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
    </>}
  </Canvas>;
}
