import type { Product } from '@/data';

export const JOINT = .003;
export function layout(dimensions: NonNullable<Product['dimensions']>, floor: boolean, rotated: boolean) {
  const width = dimensions.width / 100;
  const height = dimensions.height / 100;
  const pitchX = (rotated ? height : width) + JOINT;
  const pitchY = (rotated ? width : height) + JOINT;
  return { pitchX, pitchY, repeatX: 4.8 / pitchX, repeatY: (floor ? 4.2 : 2.8) / pitchY };
}

export function materialFamily(product: Product) {
  return product.appearance === 'Madeira' ? 'wood' : product.appearance?.includes('relevo') ? 'relief' : 'cement';
}

/** Original abstract drawings; no manufacturer's face image or measured relief data. */
export function drawTile(product: Product, rotated: boolean, image?: HTMLImageElement) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = image ? Math.min(2048, image.naturalWidth) : 512;
  const ctx = canvas.getContext('2d');
  if (!ctx || !product.dimensions) return canvas;
  ctx.scale(canvas.width / 512, canvas.height / 512);
  const family = materialFamily(product);
  ctx.fillStyle = family === 'wood' ? '#99704c' : product.slug === 'savoy' ? '#777c7b' : family === 'cement' ? '#aaa69c' : '#eeeae0';
  ctx.fillRect(0, 0, 512, 512);
  ctx.save();
  if (rotated) { ctx.translate(512, 0); ctx.rotate(Math.PI / 2); }
  if (family === 'wood') {
    // Longitudinal grain, along the commercial 100 cm dimension at 0°.
    for (let x = -16; x < 530; x += 5) {
      ctx.beginPath(); ctx.lineWidth = 1 + (x % 3 + 3) % 3;
      ctx.strokeStyle = x % 2 ? '#694b3380' : '#c49a6b90';
      for (let y = 0; y <= 512; y += 8) {
        const px = x + Math.sin(y / 73 + x * .1) * 4 + Math.sin(y / 27 + x) * 1.5;
        if (!y) ctx.moveTo(px, y); else ctx.lineTo(px, y);
      }
      ctx.stroke();
    }
  } else if (family === 'cement') {
    // Seeded, low-contrast mottling; stable across remounts and comparison captures.
    let seed = 108009;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 6500; i++) {
      const shade = Math.floor(130 + random() * 70);
      ctx.fillStyle = `rgba(${shade},${shade},${shade - 6},.12)`;
      ctx.beginPath(); ctx.arc(random() * 512, random() * 512, 1 + random() * 12, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    for (let x = 0; x < 512; x += 64) {
      const gradient = ctx.createLinearGradient(x, 0, x + 64, 0);
      gradient.addColorStop(0, '#d7d4ca'); gradient.addColorStop(.5, '#faf7ef'); gradient.addColorStop(1, '#e7e3da');
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 62, 256); ctx.lineTo(x, 512); ctx.fill();
    }
  }
  if (product.slug === 'savoy') {
    for (let i = 0; i < 7; i++) {
      ctx.beginPath(); ctx.strokeStyle = '#e6e8e0aa'; ctx.lineWidth = 1 + i % 3;
      for (let x = 0; x <= 512; x += 8) { const y = i * 83 + Math.sin(x / 78 + i) * 35 - x * .28; if (!x) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke();
    }
  }
  if (image) ctx.drawImage(image, 0, 0, 512, 512);
  ctx.restore();
  const { pitchX, pitchY } = layout(product.dimensions, false, rotated);
  // Joint widths are independently scaled on each UV axis, including rectangular planks.
  const gx = 512 * JOINT / pitchX / 2, gy = 512 * JOINT / pitchY / 2;
  ctx.fillStyle = '#827e72';
  ctx.fillRect(0, 0, gx, 512); ctx.fillRect(512 - gx, 0, gx, 512);
  ctx.fillRect(0, 0, 512, gy); ctx.fillRect(0, 512 - gy, 512, gy);
  return canvas;
}
