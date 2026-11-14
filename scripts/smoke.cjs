/**
 * Plays the whole film headlessly and fails on any page error.
 *   npm run dev            (in another terminal)
 *   npm run smoke [-- URL] [--shots]
 * Requires Playwright (`npm i -D playwright` locally if it isn't global).
 * Uses ?auto (answers every touch prompt) and ?speed=6.
 */
const { chromium } = require('playwright');
const fs = require('fs');

const args = process.argv.slice(2);
const base = args.find(a => a.startsWith('http')) || 'http://localhost:5173/';
const shots = args.includes('--shots');

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const sizes = [{ name: 'desktop', viewport: { width: 1280, height: 720 } }, { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }];
  for (const s of sizes) {
    const page = await browser.newPage({ viewport: s.viewport, isMobile: s.isMobile, hasTouch: s.hasTouch });
    page.on('pageerror', e => errors.push(`[${s.name}] ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${s.name}] console: ${m.text()}`); });
    await page.goto(base + (base.includes('?') ? '&' : '?') + 'auto&speed=6');
    await page.locator('#start').dispatchEvent('pointerdown');
    if (shots) fs.mkdirSync('shots', { recursive: true });
    const t0 = Date.now();
    let i = 0;
    while (Date.now() - t0 < 120000) {
      if (await page.locator('#again.show').count()) break;
      await page.waitForTimeout(2500);
      if (shots) await page.screenshot({ path: `shots/${s.name}-${String(i++).padStart(2, '0')}.png` });
    }
    const done = await page.locator('#again.show').count();
    console.log(`${s.name}: ${done ? 'reached the end' : 'DID NOT FINISH'} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    if (!done) errors.push(`[${s.name}] film did not reach the end`);
    await page.close();
  }
  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log('smoke OK');
})();
