// Read-only inspection of public manufacturer pages; never executes remote scripts.
const urls = process.argv.slice(2);
(async () => {
  for (const url of urls) {
    const response = await fetch(url); console.log('\nSOURCE', url, response.status, response.url, response.headers.get('content-type'));
    if (!response.headers.get('content-type')?.includes('text')) { await response.body.cancel(); continue; }
    const html = await response.text();
    const links = [...html.matchAll(/(?:href|src|srcset|data-src)\s*=\s*["']([^"'<>]+)["']/gi)].map(m => m[1]);
    console.log([...new Set(links)].filter(x => /storage|download|\/get\/|\.zip/i.test(x)).join('\n'));
    for (const match of html.matchAll(/.{0,120}(?:imgProFaces|srcset|\.zip|get\/downloads).{0,200}/g)) console.log('CONTEXT', match[0]);
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
