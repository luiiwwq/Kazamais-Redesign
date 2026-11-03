import type { Product } from '@/data';

export const JOINT = .003;
export function jointFor(product: Product) {
  const field = product.technicalDetails?.find(row => /^Junta/.test(row.label));
  if (field?.value === 'Seca') return 0;
  const millimeters = field && parseFloat(field.value.replace(',', '.'));
  return millimeters && Number.isFinite(millimeters) ? millimeters / 1000 : JOINT;
}
export function layout(dimensions: NonNullable<Product['dimensions']>, floor: boolean, rotated: boolean, joint = JOINT) {
  const width = dimensions.width / 100;
  const height = dimensions.height / 100;
  const pitchX = (rotated ? height : width) + joint;
  const pitchY = (rotated ? width : height) + joint;
  return { pitchX, pitchY, repeatX: 4.8 / pitchX, repeatY: (floor ? 4.2 : 2.8) / pitchY };
}

export function materialFamily(product: Product) {
  return product.appearance === 'Madeira' ? 'wood' : product.appearance?.includes('relevo') ? 'relief' : 'cement';
}

/** Original abstract drawings; no manufacturer's face image or measured relief data. */
export function drawTile(product: Product, rotated: boolean, image?: HTMLImageElement, variant = 0) {
  const canvas = document.createElement('canvas');
  const iw = image?.naturalWidth ?? 512, ih = image?.naturalHeight ?? 512;
  canvas.width = Math.min(2048, rotated ? ih : iw); canvas.height = Math.min(2048, rotated ? iw : ih);
  const ctx = canvas.getContext('2d');
  if (!ctx || !product.dimensions) return canvas;
  ctx.scale(canvas.width / 512, canvas.height / 512);
  const family = materialFamily(product);
  let seed = [...product.slug].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 17 + variant * 7919) >>> 0;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  ctx.fillStyle = family === 'wood' ? '#99704c' : product.slug === 'savoy' ? '#777c7b' : family === 'cement' ? '#aaa69c' : '#eeeae0';
  ctx.fillRect(0, 0, 512, 512);
  ctx.save();
  if (rotated) { ctx.translate(512, 0); ctx.rotate(Math.PI / 2); }
  if (!image && family === 'wood') {
    // Longitudinal grain, along the commercial 100 cm dimension at 0°.
    for (let x = -16; x < 530; x += .9 + random() * 2) {
      ctx.beginPath(); ctx.lineWidth = .2 + random() * 1.2;
      ctx.strokeStyle = random() > .5 ? '#593c273d' : '#d5ab773d';
      for (let y = 0; y <= 512; y += 8) {
        const px = x + Math.sin(y / 73 + x * .1) * 4 + Math.sin(y / 27 + x) * 1.5;
        if (!y) ctx.moveTo(px, y); else ctx.lineTo(px, y);
      }
      ctx.stroke();
    }
    // Fine cross-grain saw marks; illustrative, not measured height data.
    for (let y = 0; y < 512; y += 2 + random() * 5) {
      ctx.fillStyle = `rgba(53,35,22,${random() * .06})`;
      ctx.fillRect(0, y, 512, .3 + random());
    }
    // Subtle elliptical knots interrupt fibres, rather than parallel synthetic stripes.
    for (let k = 0; k < 2; k++) {
      const x = 60 + random() * 390, y = 70 + random() * 370;
      for (let ring = 1; ring < 9; ring++) {
        ctx.strokeStyle = `rgba(65,40,25,${.13 - ring * .01})`; ctx.lineWidth = .7;
        ctx.beginPath(); ctx.ellipse(x, y, ring * 2.2, ring * 6, .07, 0, Math.PI * 2); ctx.stroke();
      }
    }
  } else if (!image && family === 'cement') {
    // Seeded, low-contrast mottling; stable across remounts and comparison captures.
    // Broad cloudy patches plus mid-scale mottling and fine pores.
    for (const scale of [64, 18, 3]) for (let i = 0; i < 900; i++) {
      const shade = Math.floor(130 + random() * 70);
      ctx.fillStyle = `rgba(${shade},${shade},${shade - 6},${scale === 64 ? .025 : .07})`;
      ctx.beginPath(); ctx.arc(random() * 512, random() * 512, 1 + random() * scale, 0, Math.PI * 2); ctx.fill();
    }
  } else if (!image) {
    for (let x = 0; x < 512; x += 64) {
      const gradient = ctx.createLinearGradient(x, 0, x + 64, 0);
      gradient.addColorStop(0, '#d7d4ca'); gradient.addColorStop(.5, '#faf7ef'); gradient.addColorStop(1, '#e7e3da');
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 62, 256); ctx.lineTo(x, 512); ctx.fill();
    }
  }
  if (!image && product.slug === 'savoy') {
    for (let i = 0; i < 7; i++) {
      ctx.beginPath(); ctx.strokeStyle = '#e6e8e085'; ctx.lineWidth = .4 + random() * 2;
      const origin = random() * 600;
      for (let x = 0; x <= 512; x += 4) { const y = origin + Math.sin(x / 78 + i) * 35 + Math.sin(x / 19 + i) * 9 + random() * 5 - x * .38; if (!x) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke();
    }
  }
  if (image) ctx.drawImage(image, 0, 0, 512, 512);
  ctx.restore();
  const joint = jointFor(product);
  const { pitchX, pitchY } = layout(product.dimensions, false, rotated, joint);
  // Joint widths are independently scaled on each UV axis, including rectangular planks.
  const gx = 512 * joint / pitchX / 2, gy = 512 * joint / pitchY / 2;
  ctx.fillStyle = '#827e72';
  ctx.fillRect(0, 0, gx, 512); ctx.fillRect(512 - gx, 0, gx, 512);
  ctx.fillRect(0, 0, 512, gy); ctx.fillRect(0, 512 - gy, 512, gy);
  return canvas;
}

/** Atlas breaks the one-face-per-repeat effect. Native source resolution is never
 * upscaled; overall atlas is capped at 2048 per axis. Rotation also swaps atlas axes. */
export function drawAtlas(product: Product, rotated: boolean, images: HTMLImageElement[] = []) {
  const count = images.length || 8;
  const baseCols = count > 8 ? 4 : count > 1 ? 2 : 1;
  const baseRows = Math.ceil(count / baseCols);
  const cols = rotated ? baseRows : baseCols, rows = rotated ? baseCols : baseRows;
  const tiles = Array.from({ length: cols * rows }, (_, i) => drawTile(product, rotated, images[i % count], i));
  const w = Math.min(tiles[0].width, Math.floor(2048 / cols));
  const h = Math.min(tiles[0].height, Math.floor(2048 / rows));
  const color = document.createElement('canvas'); color.width = cols * w; color.height = rows * h;
  const ctx = color.getContext('2d')!;
  // Coprime stride gives a stable, non-sequential distribution of distinct faces.
  for (let i = 0; i < tiles.length; i++) ctx.drawImage(tiles[(i * 5) % tiles.length], (i % cols) * w, Math.floor(i / cols) * h, w, h);
  const bump = document.createElement('canvas'), roughness = document.createElement('canvas');
  const scale = Math.min(1, 512 / Math.max(color.width, color.height));
  bump.width = roughness.width = Math.max(1, Math.round(color.width * scale));
  bump.height = roughness.height = Math.max(1, Math.round(color.height * scale));
  const bctx = bump.getContext('2d', { willReadFrequently: true })!;
  bctx.drawImage(color, 0, 0, bump.width, bump.height);
  const pixels = bctx.getImageData(0, 0, bump.width, bump.height);
  const rctx = roughness.getContext('2d')!; const rp = rctx.createImageData(bump.width, bump.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const luma = pixels.data[i] * .2126 + pixels.data[i + 1] * .7152 + pixels.data[i + 2] * .0722;
    // Restrained artistic response, NOT measured height or calibrated PBR.
    const relief = 112 + luma * .12;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = relief;
    rp.data[i] = rp.data[i + 1] = rp.data[i + 2] = 205 + luma * .12; rp.data[i + 3] = 255;
  }
  bctx.putImageData(pixels, 0, 0); rctx.putImageData(rp, 0, 0);
  return { color, bump, roughness, cols, rows };
}
