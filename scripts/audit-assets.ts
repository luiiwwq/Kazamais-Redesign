import { products } from '../src/data/index.ts';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve('src/assets/images');
async function walk(dir: string): Promise<string[]> { const entries = await readdir(dir,{withFileTypes:true}); return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):Promise.resolve([path.join(dir,e.name)])))).flat(); }
const hash = (b: Uint8Array) => createHash('sha256').update(b).digest('hex');
const files = await walk(root); const hashes = new Map<string,string>();
for (const file of files) hashes.set(hash(await readFile(file)),file);
await mkdir(path.join(root,'audited'),{recursive:true});
let imports = "import type { StaticImageData } from 'next/image';\n"; const rows: string[]=[]; const report: string[]=['# Mapa de imagens locais','', 'URLs do contrato comparadas por SHA-256 com assets existentes. Cópias novas apenas quando não há correspondência binária. Direitos pendentes conforme DATA-AUDIT.md.',''];
let n=0;
for(const p of products) { const list: string[]=[]; for(const image of p.images) { const res=await fetch(image.src); if(!res.ok) throw new Error(`${res.status}: ${image.src}`); const bytes=new Uint8Array(await res.arrayBuffer()); if(!res.headers.get('content-type')?.startsWith('image/')) throw new Error('Not image'); const digest=hash(bytes); let local=hashes.get(digest); const matched=!!local; if(!local) { local=path.join(root,'audited',`${p.slug}-${list.length}${path.extname(new URL(image.src).pathname)}`); await writeFile(local,bytes); } const variable=`asset${n++}`; imports+=`import ${variable} from '${path.relative(path.resolve('src/lib'),local).replaceAll('\\','/')}';\n`; list.push(variable); report.push(`- ${p.slug}: ${image.src} → ${path.relative(process.cwd(),local)} (${matched?'existente':'cópia auditada'}; SHA-256 ${digest})`); } rows.push(`  '${p.slug}': [${list.join(', ')}]`); }
await writeFile('src/lib/product-images.ts',imports+`\nexport const productImages: Record<string, StaticImageData[]> = {\n${rows.join(',\n')}\n};\n`);
await writeFile('docs/IMAGE-MAP.md',report.join('\n')+'\n');
console.log(`PASS: ${n} imagens locais mapeadas para ${products.length} produtos.`);
