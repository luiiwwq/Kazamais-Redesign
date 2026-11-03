const sharp = require('sharp');
const { writeFile } = require('node:fs/promises');
(async () => {
  const results = [];
  for (const width of [1440, 390]) for (const slug of ['madero-jatoba-externo', 'monterrey-cement', 'savoy']) {
    const before = `docs/evidence/before-${width}-${slug}.png`, after = `docs/evidence/after-${width}-${slug}.png`;
    const a = await sharp(before).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(after).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    if (a.info.width !== b.info.width || a.info.height !== b.info.height) throw Error('Frame dimensions changed');
    const regions = { wall: [.55, .31, .16, .13], floor: [.70, .79, .18, .14] };
    const means = {};
    for (const [name, [x, y, w, h]] of Object.entries(regions)) {
      let sum = 0, count = 0;
      for (let row = Math.floor(y * a.info.height); row < (y + h) * a.info.height; row++) for (let col = Math.floor(x * a.info.width); col < (x + w) * a.info.width; col++) {
        const start = (row * a.info.width + col) * 3;
        for (let c = 0; c < 3; c++) { sum += Math.abs(a.data[start + c] - b.data[start + c]); count++; }
      }
      means[name] = +(sum / count).toFixed(2);
      if (means[name] < 1) throw Error(`No observable difference: ${slug}/${width}/${name}`);
    }
    const output = `docs/evidence/compare-${width}-${slug}.png`;
    await sharp({ create: { width: a.info.width * 2, height: a.info.height, channels: 3, background: '#eee' } }).composite([{ input: before, left: 0, top: 0 }, { input: after, left: a.info.width, top: 0 }]).png().toFile(output);
    results.push({ viewport: width, slug, meanAbsoluteRgbDifference: means, note: 'Fixed normalized crops, not semantic segmentation; difference is not a quality score.', output });
  }
  await writeFile('docs/evidence/refinement-comparison.json', JSON.stringify(results, null, 2) + '\n');
  console.log(results);
})().catch(e => { console.error(e); process.exitCode = 1; });
