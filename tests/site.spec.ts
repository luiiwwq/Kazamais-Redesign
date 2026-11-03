import { test,expect } from '@playwright/test';
import { products } from '../src/data';
test('navegação, imagens, fichas, metadados e 404',async({page})=>{
 const errors:string[]=[];const consoleErrors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  for(const route of ['/','/ambientes','/profissionais','/lojas','/orcamento','/simulador',...products.map(p=>`/revestimentos/${p.slug}`)]){const response=await page.goto(route);expect(response?.status()).toBe(200);await expect(page.locator('h1')).toHaveCount(1);await expect(page).toHaveTitle(/Kazamais/);const imgs=page.locator('img:visible');for(let i=0;i<await imgs.count();i++){await imgs.nth(i).scrollIntoViewIfNeeded();await expect(imgs.nth(i)).toHaveJSProperty('complete',true);await expect(imgs.nth(i)).not.toHaveJSProperty('naturalWidth',0);}}
 expect(consoleErrors).toEqual([]);
 const missing=await page.goto('/revestimentos/nao-existe');expect(missing?.status()).toBe(404);
 await page.goto('/blog/produto/savoy');await expect(page).toHaveURL(/\/revestimentos\/savoy$/);
 expect(errors).toEqual([]);
});
test('metadados públicos, sitemap e armazenamento indisponível',async({page,request})=>{
 await page.goto('/revestimentos/classic-white-deco');await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','http://localhost:3000/revestimentos/classic-white-deco');
 const sitemap=await request.get('/sitemap.xml');expect(sitemap.status()).toBe(200);expect(await sitemap.text()).toContain('/revestimentos/classic-white-deco');
 const robots=await request.get('/robots.txt');expect(await robots.text()).toContain('Disallow: /');
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('Storage blocked by test');};});
 await page.goto('/revestimentos/savoy');await page.getByRole('button',{name:'Selecionar para orçamento'}).click();await page.getByRole('link',{name:/Minha seleção/}).first().click();await expect(page.getByRole('alert').filter({hasText:'O navegador não permitiu salvar'})).toBeVisible();await expect(page.getByLabel('Resumo para copiar',{exact:true})).toHaveValue(/Savoy/);
});
test('busca, filtros URL, ordenação, vazio e comparação limitada',async({page})=>{
 await page.goto('/revestimentos');await expect(page.getByRole('status')).toContainText('9 revestimentos');
 await page.getByLabel('Nome ou referência').fill('73003');await page.getByRole('button',{name:'Buscar',exact:true}).click();await expect(page.getByRole('status')).toContainText('1 revestimento');await expect(page).toHaveURL(/q=73003/);
 await page.getByRole('link',{name:'Limpar filtros'}).click();await expect(page.getByRole('status')).toContainText('9 revestimentos');await page.getByLabel('Aplicação confirmada').selectOption('wall');await expect(page.getByRole('heading',{name:'Classic White Deco'})).toBeVisible();await expect(page.getByRole('status')).toContainText('3 revestimentos');await page.reload();await expect(page.getByLabel('Aplicação confirmada')).toHaveValue('wall');await expect(page.getByRole('status')).toContainText('3 revestimentos');
 await page.goto('/revestimentos?q=inexistente');await expect(page.getByRole('heading',{name:'Nenhum material com esses critérios.'})).toBeVisible();
 await page.goto('/revestimentos?ordem=az');await expect(page.locator('.product-card h3').first()).toHaveText('Artsy Cement');
 const checks=page.getByRole('checkbox');for(let i=0;i<3;i++)await checks.nth(i).check();await expect(checks.nth(3)).toBeDisabled();await page.getByRole('button',{name:'Abrir comparação'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Abrir comparação'})).toBeFocused();
});
test('seleção persistida, notas, área e zoom por teclado',async({page})=>{
 await page.goto('/revestimentos/savoy');const zoom=page.getByRole('button',{name:'Ampliar imagem de Savoy'});await zoom.focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(zoom).toBeFocused();
 await page.getByRole('button',{name:'Selecionar para orçamento'}).click();await page.getByRole('link',{name:/Minha seleção/}).first().click();await page.getByRole('spinbutton').fill('25.5');await page.getByLabel('Notas para Savoy (opcional)',{exact:true}).fill('Confirmar acabamento e lote.');await page.getByLabel('Unidade de preferência').selectOption({index:1});await page.reload();await expect(page.getByRole('spinbutton')).toHaveValue('25.5');await expect(page.getByLabel('Resumo para copiar',{exact:true})).toHaveValue(/Confirmar acabamento e lote/);await page.getByRole('button',{name:'Copiar resumo'}).click();await expect(page.getByRole('status')).toContainText(/copiado|copiar automaticamente/);await page.getByRole('button',{name:'Remover Savoy'}).click();await expect(page.getByRole('heading',{name:'Seu projeto começa com uma escolha.'})).toBeVisible();
});
test('mobile, reduced motion, menu e screenshots',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/','/revestimentos','/revestimentos/savoy','/lojas','/orcamento']){await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 await page.goto('/');await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('navigation',{name:'Principal',exact:true}).getByRole('link',{name:'Revestimentos',exact:true}).click();await expect(page).toHaveURL(/revestimentos/);await page.screenshot({path:'test-results/catalog-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
});

test('piso confirmado na URL e comparação de todas as superfícies', async ({ page }) => {
  await page.goto('/revestimentos');
  await page.getByLabel('Aplicação confirmada').selectOption('floor');
  await expect(page).toHaveURL(/aplicacao=floor/);
  await expect(page.getByRole('status')).toHaveText('2 revestimentos encontrados');
  await expect(page.locator('.product-card h3')).toHaveText(['Madero Jatobá', 'Monterrey Cement']);
  await page.reload();
  await expect(page.getByLabel('Aplicação confirmada')).toHaveValue('floor');
  await expect(page.getByRole('status')).toHaveText('2 revestimentos encontrados');
  await page.getByRole('checkbox', { name: 'Comparar Madero Jatobá', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Comparar Monterrey Cement', exact: true }).check();
  await page.getByRole('link', { name: 'Limpar filtros' }).click();
  await expect(page.getByRole('status')).toContainText('9 revestimentos');
  await page.getByRole('checkbox', { name: 'Comparar Classic White Deco', exact: true }).check();
  await page.getByRole('button', { name: 'Abrir comparação' }).click();
  await expect(page.getByRole('dialog').getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'Aplicação', exact: true }) }).getByRole('cell')).toHaveText(['Piso, Parede', 'Piso, Parede', 'Parede']);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Limpar comparação' }).click();
  await page.getByRole('checkbox', { name: 'Comparar Artsy Cement', exact: true }).check();
  await page.getByRole('button', { name: 'Abrir comparação' }).click();
  await expect(page.getByRole('dialog').getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'Aplicação', exact: true }) }).getByRole('cell')).toHaveText(['A confirmar']);
});

test('seleção sincroniza adição, edição e remoção entre abas', async ({ page, context }) => {
  await page.goto('/revestimentos/savoy');
  await page.getByRole('button', { name: 'Selecionar para orçamento' }).click();
  await expect(page.getByRole('button', { name: 'Remover da seleção' })).toBeVisible();
  const other = await context.newPage();
  await other.goto('/orcamento');
  await expect(other.getByRole('button', { name: 'Remover Savoy', exact: true })).toBeVisible();
  await page.goto('/revestimentos/monterrey-cement');
  await page.getByRole('button', { name: 'Selecionar para orçamento' }).click();
  await expect(other.getByRole('button', { name: 'Remover Monterrey Cement', exact: true })).toBeVisible();
  await other.getByLabel('Notas para Savoy (opcional)', { exact: true }).fill('Nota compartilhada');
  await page.goto('/orcamento');
  await expect(page.getByLabel('Notas para Savoy (opcional)', { exact: true })).toHaveValue('Nota compartilhada');
  await page.getByRole('button', { name: 'Remover Savoy', exact: true }).click();
  await expect(other.getByRole('button', { name: 'Remover Savoy', exact: true })).toHaveCount(0);
  await expect(other.getByRole('button', { name: 'Remover Monterrey Cement', exact: true })).toBeVisible();
  await other.reload();
  await expect(other.getByRole('button', { name: 'Remover Savoy', exact: true })).toHaveCount(0);
});

test('edição de aba desatualizada não ressuscita item removido', async ({ page, context }) => {
  await page.goto('/revestimentos/savoy');
  await page.getByRole('button', { name: 'Selecionar para orçamento' }).click();
  await expect(page.getByRole('button', { name: 'Remover da seleção' })).toBeVisible();
  await page.goto('/orcamento');
  const stale = await context.newPage();
  // Delay notifications only in this tab, reproducing an edit before storage
  // events/focus reconciliation arrive. The real storage remains shared.
  await stale.addInitScript(() => {
    window.addEventListener('storage', event => event.stopImmediatePropagation(), true);
    window.addEventListener('focus', event => { if (event.target === window) event.stopImmediatePropagation(); }, true);
  });
  await stale.goto('/orcamento');
  const staleNotes = stale.getByLabel('Notas para Savoy (opcional)', { exact: true });
  await expect(staleNotes).toBeVisible();
  await page.getByRole('button', { name: 'Remover Savoy', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Seu projeto começa com uma escolha.' })).toBeVisible();
  await expect(staleNotes).toBeVisible();
  await staleNotes.fill('Edição atrasada não deve recriar Savoy');
  await expect(stale.getByRole('heading', { name: 'Seu projeto começa com uma escolha.' })).toBeVisible();
  expect(await stale.evaluate(() => JSON.parse(localStorage.getItem('kazamais-selection-v1') || '[]'))).toEqual([]);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Seu projeto começa com uma escolha.' })).toBeVisible();
});

test('mutações concorrentes preservam área e nota em abas distintas', async ({ page, context }) => {
  await page.goto('/revestimentos/savoy');
  await page.getByRole('button', { name: 'Selecionar para orçamento' }).click();
  await expect(page.getByRole('button', { name: 'Remover da seleção' })).toBeVisible();
  await page.goto('/orcamento');
  const other = await context.newPage();
  await other.goto('/orcamento');
  await expect(other.getByRole('spinbutton')).toBeVisible();
  // Hold the same-origin lock until both UI mutations are queued. This makes
  // the read/modify/write collision deterministic instead of timing-dependent.
  await page.evaluate(() => new Promise<void>(acquired => {
    void navigator.locks.request('kazamais-selection-v1-mutation', () => new Promise<void>(release => {
      (window as unknown as { releaseSelectionLock: () => void }).releaseSelectionLock = release;
      acquired();
    }));
  }));
  await page.getByRole('spinbutton').fill('42.5');
  await other.getByLabel('Notas para Savoy (opcional)', { exact: true }).fill('Preservar ambos os campos');
  await expect.poll(() => page.evaluate(async () => (await navigator.locks.query()).pending?.filter(lock => lock.name === 'kazamais-selection-v1-mutation').length)).toBe(2);
  await page.evaluate(() => (window as unknown as { releaseSelectionLock: () => void }).releaseSelectionLock());
  for (const tab of [page, other]) {
    await expect(tab.getByRole('spinbutton')).toHaveValue('42.5');
    await expect(tab.getByLabel('Notas para Savoy (opcional)', { exact: true })).toHaveValue('Preservar ambos os campos');
    await tab.reload();
    await expect(tab.getByRole('spinbutton')).toHaveValue('42.5');
    await expect(tab.getByLabel('Notas para Savoy (opcional)', { exact: true })).toHaveValue('Preservar ambos os campos');
  }
});
