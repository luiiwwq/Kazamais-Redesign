import { test, expect } from '@playwright/test';

test('texture failure reports procedural fallback and ignores cancelled requests', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/simulador?produto=monte-saint-michez-fendi');
  const status = page.getByTestId('texture-status');
  await expect(status).toContainText('Textura ainda não carregada');
  let release!: () => void;
  let gate = new Promise<void>(resolve => { release = resolve; });
  let requests = 0;
  // Installed after the page loaded: only the raw face used by Three is blocked,
  // not Next chunks or the independently optimized HTML reference image.
  await page.route('**/_next/static/media/monte-saint-michez-fendi-0*.jpg', async route => {
    requests++;
    await gate;
    await route.abort('failed');
  });
  await page.getByRole('button', { name: 'Iniciar visualização 3D' }).click();
  await expect.poll(() => requests).toBe(1);
  await expect(status).toContainText('Carregando textura');
  release();
  await expect(status).toContainText('Monte Saint Michez Fendi: Falha ao carregar a face local. Fallback procedural');
  await expect(status).not.toContainText('carregada e exibida');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  const originalCanvas = await canvas.elementHandle();
  await canvas.scrollIntoViewIfNeeded();
  const before = await canvas.screenshot();
  await page.getByRole('button', { name: 'Luz: neutra' }).click();
  await expect.poll(async () => !(await canvas.screenshot()).equals(before)).toBeTruthy();
  await page.getByRole('button', { name: 'Selecionar para orçamento', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Remover do orçamento', exact: true })).toBeVisible();
  const sample = page.getByLabel('Expositor · todos os nove materiais');
  await sample.selectOption('classic-white-deco');
  await expect(status).toContainText('Classic White Deco: Face local auditada carregada e exibida.');
  gate = new Promise<void>(resolve => { release = resolve; });
  await sample.selectOption('monte-saint-michez-fendi');
  await expect.poll(() => requests).toBe(2);
  await expect(status).toContainText('Monte Saint Michez Fendi: Carregando textura');
  await sample.selectOption('savoy');
  await expect(status).toContainText('Savoy: Padrão procedural ilustrativo em uso');
  release();
  await page.waitForTimeout(300);
  await expect(status).not.toContainText('Monte Saint Michez Fendi');
  await expect(status).not.toContainText('Falha ao carregar');
  expect(await originalCanvas!.evaluate(element => element.isConnected)).toBeTruthy();
  expect(errors).toEqual([]);
});

test('nine sample deep links, focus and reduced motion', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/simulador?produto=savoy');
  await expect(page.getByLabel('Expositor · todos os nove materiais')).toHaveValue('savoy');
  await expect(page.getByRole('heading', { name: 'Savoy', exact: true })).toBeVisible();
  await expect(page.getByLabel('Material confirmado')).toHaveValue('');
  await expect(page.getByLabel('Expositor · todos os nove materiais').locator('option')).toHaveCount(10);
  const start = page.getByRole('button', { name: 'Iniciar visualização 3D' });
  await start.focus();
  await page.keyboard.press('Tab');
  expect(await page.locator(':focus').evaluate(e => getComputedStyle(e).outlineStyle)).toBe('solid');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.route-enter').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  expect(errors).toEqual([]);
});

test('four lazy map previews, modal, Escape and focus return', async ({ page }) => {
  await page.goto('/lojas');
  const previews = page.locator('.map-preview iframe');
  await expect(previews).toHaveCount(4);
  for (const frame of await previews.all()) {
    await expect(frame).toHaveAttribute('loading', 'lazy');
    await expect(frame).toHaveAttribute('title', /Mapa de Unidade/);
    await expect(frame).toHaveAttribute('src', /output=embed/);
  }
  const button = page.getByRole('button', { name: 'Ampliar mapa de Unidade Paulínia / SP' });
  await button.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('4640');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'test-results/map-expanded.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(button).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/stores-mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
