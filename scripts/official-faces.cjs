// Audits official ZIPs in memory. Only explicitly selected JPEG faces are written;
// archive paths are never used as filesystem paths. No remote code is executed.
const { inflateRawSync } = require('node:zlib');
const { createHash } = require('node:crypto');
const { writeFile } = require('node:fs/promises');
const sharp = require('sharp');
const products = [{ code: '2481A', slug: 'madero' }, { code: '108009A', slug: 'monterrey' }, { code: '820011A', slug: 'savoy' }];
async function zipEntries(url) {
  const r = await fetch(url); if (!r.ok) throw Error(`${url}: ${r.status}`);
  let length = 0; const parts = [];
  for await (const part of r.body) { length += part.length; if (length > 80 * 1024 * 1024) throw Error('Archive exceeds audit budget'); parts.push(part); }
  const zip = Buffer.concat(parts); const entries = [];
  // Central directory records carry sizes even when local headers use descriptors.
  for (let i = 0; i < zip.length - 46; i++) {
    if (zip.readUInt32LE(i) !== 0x02014b50) continue;
    const method = zip.readUInt16LE(i + 10), size = zip.readUInt32LE(i + 20), rawSize = zip.readUInt32LE(i + 24);
    const nameLen = zip.readUInt16LE(i + 28), extra = zip.readUInt16LE(i + 30), comment = zip.readUInt16LE(i + 32);
    const name = zip.toString('utf8', i + 46, i + 46 + nameLen); const offset = zip.readUInt32LE(i + 42);
    if (rawSize > 30 * 1024 * 1024) throw Error('Entry exceeds audit budget');
    const start = offset + 30 + zip.readUInt16LE(offset + 26) + zip.readUInt16LE(offset + 28);
    const packed = zip.subarray(start, start + size);
    const bytes = method === 8 ? inflateRawSync(packed, { maxOutputLength: 30 * 1024 * 1024 }) : method === 0 ? packed : null;
    entries.push({ name, bytes }); i += 45 + nameLen + extra + comment;
  }
  return entries;
}
(async () => {
  const audit = [];
  for (const product of products) {
    const url = `https://www.villagres.com.br/${product.code}/get/downloads`;
    const entries = await zipEntries(url); console.log('SOURCE', url);
    let index = 0; const previews = [];
    for (const { name, bytes } of entries) {
      if (!bytes || !/\.(jpg|jpeg|png)$/i.test(name)) { console.log(name); continue; }
      const meta = await sharp(bytes).metadata(); console.log(name, meta.width, meta.height, bytes.length);
      // Explicit opt-in after auditing dimensions/contact sheets of these three ZIPs.
      if (process.argv.includes('--write') && /^[a-f0-9]{32}\.jpg$/i.test(name)) {
        const file = `src/assets/images/audited/${product.slug}-official-${index++}.jpg`;
        const output = await sharp(bytes).resize({ width: 1536, height: 1536, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer();
        await writeFile(file, output);
        audit.push({ product: product.code, url, entry: name, width: meta.width, height: meta.height, file, sourceSha256: createHash('sha256').update(bytes).digest('hex'), localSha256: createHash('sha256').update(output).digest('hex') });
        previews.push({ input: await sharp(output).resize(160, 200, { fit: 'contain', background: '#eeeae0' }).png().toBuffer(), left: ((index - 1) % 4) * 160, top: Math.floor((index - 1) / 4) * 200 });
        console.log('SAVED', file, 'SOURCE SHA256', createHash('sha256').update(bytes).digest('hex'), 'LOCAL SHA256', createHash('sha256').update(output).digest('hex'));
      }
    }
    if (previews.length) await sharp({ create: { width: 640, height: Math.ceil(previews.length / 4) * 200, channels: 3, background: '#eeeae0' } }).composite(previews).png().toFile(`docs/evidence/${product.slug}-official-contact-sheet.png`);
  }
  if (audit.length) await writeFile('docs/evidence/official-faces.json', JSON.stringify(audit, null, 2) + '\n');
})().catch(e => { console.error(e); process.exitCode = 1; });
