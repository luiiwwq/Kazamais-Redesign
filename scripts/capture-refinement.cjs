const { chromium, expect } = require('@playwright/test');
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw Error('Use before or after');
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 844 }, reducedMotion: 'reduce' });
      await page.goto('http://localhost:3000/simulador');
      await page.getByRole('button', { name: 'Iniciar visualização 3D' }).click();
      for (const slug of ['madero-jatoba-externo', 'monterrey-cement', 'savoy']) {
        for (const surface of ['floor', 'wall']) {
          await page.getByLabel('Aplicação').selectOption(surface);
          await page.getByLabel('Material', { exact: true }).selectOption(slug);
          await expect(page.locator(`[data-texture-slot="${surface}"]`)).toContainText(/carregada e exibida|procedural ilustrativo/);
        }
        const canvas = page.locator('canvas'); await canvas.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await canvas.screenshot({ path: `docs/evidence/${phase}-${width}-${slug}.png` });
        console.log(phase, width, slug, 'room camera, 0 degrees, neutral light, both surfaces');
      }
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
