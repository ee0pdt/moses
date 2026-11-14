/**
 * Plays every chapter headlessly and fails on any page error.
 *   npm run dev            (in another terminal)
 *   npm run smoke [-- URL] [--shots] [--only=basket]
 * Requires Playwright (`npm i -D playwright` locally if it isn't global).
 * Uses ?auto (answers every touch prompt) and ?speed=6.
 */
const { chromium } = require('playwright');
const fs = require('fs');

const args = process.argv.slice(2);
const base = (args.find(a => a.startsWith('http')) || 'http://localhost:5173/').replace(/[?#].*$/, '');
const shots = args.includes('--shots');
const only = (args.find(a => a.startsWith('--only=')) || '').slice(7);
const q = '?auto&speed=6';

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const watch = (page, tag) => {
    page.on('pageerror', e => errors.push(`[${tag}] ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${tag}] console: ${m.text()}`); });
  };
  if (shots) fs.mkdirSync('shots', { recursive: true });

  // the menu lists every chapter and opens one
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  watch(page, 'menu');
  await page.goto(base + q);
  await page.locator('#start').dispatchEvent('pointerdown');
  await page.waitForSelector('#menu.show');
  const ids = await page.evaluate(() => window.__moses.chapters);
  const cards = await page.locator('#menu .card').count();
  console.log(`menu: ${cards} chapters (${ids.join(', ')})`);
  if (cards !== ids.length) errors.push('[menu] card count mismatch');
  await page.waitForTimeout(1500);
  if (shots) await page.screenshot({ path: 'shots/menu.png' });
  await page.locator('#menu .card').first().click();
  await page.waitForTimeout(1500);
  if (!(await page.evaluate(() => location.hash))) errors.push('[menu] opening a chapter did not set the hash');
  await page.locator('#menuBtn').click();
  await page.waitForSelector('#menu.show');
  await page.close();

  const sizes = [{ name: 'desktop', viewport: { width: 1280, height: 720 } }, { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }];
  for (const id of ids.filter(i => !only || i === only)) for (const s of sizes) {
    const tag = `${id}/${s.name}`;
    const p = await browser.newPage({ viewport: s.viewport, isMobile: s.isMobile, hasTouch: s.hasTouch });
    watch(p, tag);
    await p.goto(base + q + '#' + id);
    await p.locator('#start').dispatchEvent('pointerdown');
    const t0 = Date.now();
    let i = 0;
    while (Date.now() - t0 < 180000) {
      if (await p.locator('#again.show').count()) break;
      await p.waitForTimeout(2000);
      if (shots) await p.screenshot({ path: `shots/${id}-${s.name}-${String(i++).padStart(2, '0')}.png` });
    }
    const done = await p.locator('#again.show').count();
    console.log(`${tag}: ${done ? 'reached the end' : 'DID NOT FINISH'} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    if (!done) errors.push(`[${tag}] film did not reach the end`);
    await p.close();
  }
  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log('smoke OK');
})();
