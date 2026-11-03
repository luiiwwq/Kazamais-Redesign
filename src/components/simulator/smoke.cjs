const { chromium, expect } = require('@playwright/test');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const wood = 'madero-jatoba-externo', cement = 'monterrey-cement', relief = 'classic-white-deco';
const base = 'http://localhost:3217';

(async () => {
  const { layout, materialFamily } = await import('./materials.ts');
  for (const floor of [false, true]) for (const rotated of [false, true]) {
    for (const [width, height] of [[24.5, 100], [108, 108], [72, 72]]) {
      const actual = layout({ width, height }, floor, rotated);
      assert(Math.abs(actual.repeatX * actual.pitchX - 4.8) < 1e-9);
      assert(Math.abs(actual.repeatY * actual.pitchY - (floor ? 4.2 : 2.8)) < 1e-9);
      assert.equal(actual.pitchX, (rotated ? height : width) / 100 + .003);
      assert.equal(actual.pitchY, (rotated ? width : height) / 100 + .003);
    }
  }
  assert.equal(materialFamily({ appearance: 'Madeira' }), 'wood');
  assert.equal(materialFamily({ appearance: 'Cimento' }), 'cement');
  assert.equal(materialFamily({ appearance: 'Monocolor, relevo 3D' }), 'relief');
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3217'], { stdio: 'ignore' });
  let browser;
  const errors = [];
  const watch = page => {
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  };
  try {
    let available = false;
    for (let n = 0; n < 60; n++) { try { if ((await fetch(`${base}/simulador`)).ok) { available = true; break; } } catch {} await new Promise(r => setTimeout(r, 500)); }
    assert(available, 'Production server did not start');
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 820, height: 1180 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport }); watch(page);
      await page.goto(`${base}/simulador?produto=${relief}`);
      await page.getByRole('heading', { name: 'Classic White Deco', exact: true }).waitFor();
      assert.equal(await page.locator('canvas').count(), 0);
      await page.evaluate(() => { window.__simulatorIdentity = 'same-document'; });
      let navigations = 0;
      page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations++; });
      const application = page.getByLabel('Aplicação'), material = page.getByLabel('Material confirmado');
      await expect(material.locator('option')).toHaveCount(4);
      await page.getByRole('button', { name: 'Selecionar para orçamento', exact: true }).click();
      await page.getByRole('button', { name: 'Iniciar visualização 3D' }).click();
      const canvas = page.locator('canvas'); await canvas.waitFor();
      const originalCanvas = await canvas.elementHandle();
      const capture = async () => { await canvas.scrollIntoViewIfNeeded(); await page.waitForTimeout(350); return canvas.screenshot(); };
      const different = (a, b, label) => assert(!a.equals(b), `Rendered pixels unchanged: ${label}`);
      let previous = await capture();
      const samples = page.getByLabel('Expositor · todos os nove materiais');
      await expect(samples.locator('option')).toHaveCount(10);
      const slugs = await samples.locator('option').evaluateAll(options => options.map(o => o.value).filter(Boolean));
      const captures = [];
      for (const slug of slugs) {
        await samples.selectOption(slug);
        await page.waitForTimeout(250);
        const next = await capture();
        for (const prior of captures) different(prior, next, `unique sample ${slug}`);
        captures.push(next);
        await canvas.screenshot({ path: `test-results/sample-${viewport.width}-${slug}.png` });
        await expect(page.getByText('Amostra / expositor 3D.', { exact: true })).toBeVisible();
      }
      await samples.selectOption('');
      await page.screenshot({ path: `test-results/room-${viewport.width}.png`, fullPage: true });
      previous = await capture();
      for (const slug of [wood, cement, relief]) {
        await material.selectOption(slug);
        const next = await capture(); different(previous, next, `wall ${slug}`); previous = next;
      }
      await page.getByRole('button', { name: 'Orientação: 0°' }).click();
      await application.selectOption('floor'); await expect(material.locator('option')).toHaveCount(3);
      for (const slug of [wood, cement, wood]) {
        await material.selectOption(slug);
        const next = await capture(); different(previous, next, `floor ${slug}`); previous = next;
      }
      await expect(page.getByRole('button', { name: 'Orientação: 0°' })).toHaveAttribute('aria-pressed', 'false');
      const unrotatedWood = await capture();
      await page.getByRole('button', { name: 'Orientação: 0°' }).click();
      different(unrotatedWood, await capture(), 'wood 90-degree pagination');
      await application.selectOption('wall'); await expect(material).toHaveValue(relief);
      await expect(page.getByRole('button', { name: 'Orientação: 90°' })).toHaveAttribute('aria-pressed', 'true');
      await page.getByRole('button', { name: 'Orientação: 90°' }).click();
      await application.selectOption('floor'); await expect(material).toHaveValue(wood);
      await expect(page.getByRole('button', { name: 'Orientação: 90°' })).toHaveAttribute('aria-pressed', 'true');
      previous = await capture();
      for (const preset of ['wall', 'floor', 'room']) {
        await page.getByLabel('Enquadramento').selectOption(preset);
        const next = await capture(); different(previous, next, `camera ${preset}`); previous = next;
      }
      for (const light of ['neutra', 'quente']) {
        await page.getByRole('button', { name: `Luz: ${light}` }).click();
        const next = await capture(); different(previous, next, `light ${light}`); previous = next;
      }
      const slider = page.getByLabel('Rotação limitada');
      await slider.focus(); await page.keyboard.press('End'); await expect(slider).toHaveValue('25');
      await page.keyboard.press('Home'); await expect(slider).toHaveValue('-25');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
      assert.equal(navigations, 0); assert.equal(await page.evaluate(() => window.__simulatorIdentity), 'same-document');
      assert(await originalCanvas.evaluate(c => c.isConnected), 'Canvas remounted during material changes');
      await page.getByRole('button', { name: 'Reiniciar estudo' }).click();
      await expect(material).toHaveValue('');
      await expect(page.getByLabel('Enquadramento')).toHaveValue('room'); await expect(slider).toHaveValue('0');
      await expect(page.getByRole('button', { name: 'Luz: neutra' })).toHaveAttribute('aria-pressed', 'false');
      await material.selectOption(wood); await expect(page.getByRole('button', { name: 'Orientação: 0°' })).toBeVisible();
      await application.selectOption('wall'); await expect(material).toHaveValue('');
      await material.selectOption(relief); await expect(page.getByRole('button', { name: 'Orientação: 0°' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Remover do orçamento', exact: true })).toBeVisible();
      // Actual browser context loss, rather than just dispatching a synthetic DOM event.
      await canvas.evaluate(c => { const gl = c.getContext('webgl2'); const ext = gl?.getExtension('WEBGL_lose_context'); if (!ext) throw Error('Context-loss extension unavailable'); ext.loseContext(); });
      await page.getByText('Visualização 3D indisponível.', { exact: true }).waitFor();
      await material.selectOption(cement); await expect(material).toHaveValue(cement);
      await page.getByRole('button', { name: 'Tentar 3D novamente' }).click(); await canvas.waitFor();
      await capture(); await expect(material).toHaveValue(cement);
      await page.getByRole('link', { name: 'Consultar ficha do produto' }).click(); await page.waitForURL(`**/revestimentos/${cement}`);
      console.log(`PASS ${viewport.width}×${viewport.height}: pixels/materials, independent surfaces/orientation, cameras/lights, no reload/remount, reset, contextloss/retry, navigation`);
      await page.close();
    }
    // Deterministic unavailable WebGL: native getContext returns null only for GL requests.
    const unavailable = await browser.newPage(); watch(unavailable);
    await unavailable.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) { return /webgl/i.test(type) ? null : original.call(this, type, ...args); };
    });
    await unavailable.goto(`${base}/simulador?produto=${wood}`);
    await expect(unavailable.getByLabel('Aplicação')).toHaveValue('floor');
    await unavailable.getByRole('button', { name: 'Iniciar visualização 3D' }).click();
    await unavailable.getByText('Visualização 3D indisponível.', { exact: true }).waitFor();
    assert.equal(await unavailable.locator('canvas').count(), 0);
    await unavailable.getByLabel('Material confirmado').selectOption(cement);
    await unavailable.getByRole('button', { name: 'Selecionar para orçamento', exact: true }).click();
    await expect(unavailable.getByRole('button', { name: 'Remover do orçamento', exact: true })).toBeVisible();
    await unavailable.getByRole('button', { name: 'Tentar 3D novamente' }).click();
    await expect(unavailable.getByText('Visualização 3D indisponível.', { exact: true })).toBeVisible();
    console.log('PASS WebGL unavailable: fallback, retry, material and budget remain usable');
    console.log(JSON.stringify({ errors })); assert.equal(errors.length, 0);
  } finally { if (browser) await browser.close(); server.kill(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
