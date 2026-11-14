/*
 * Full screen for the whole page. Uses the standard API with the WebKit
 * prefix as a fallback (older iPad Safari). iPhone Safari has no element
 * full screen, and an installed app is already full screen via the manifest,
 * so the toggle button stays hidden in those cases.
 */

type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

const doc = document as FsDoc;
const root = document.documentElement as FsEl;

export const fullscreenSupported = !!(root.requestFullscreen || root.webkitRequestFullscreen);
const standalone = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;

export function isFullscreen(): boolean {
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
}

/** Must be called from a user gesture. Failures (denied, headless) are ignored. */
export function enterFullscreen(): void {
  if (!fullscreenSupported || standalone || isFullscreen()) return;
  try {
    const r = root.requestFullscreen ? root.requestFullscreen({ navigationUI: 'hide' }) : root.webkitRequestFullscreen!();
    if (r) r.catch(() => {});
  } catch { /* not allowed here */ }
}

export function exitFullscreen(): void {
  if (!isFullscreen()) return;
  try {
    const r = doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.();
    if (r) r.catch(() => {});
  } catch { /* ignore */ }
}

/** Wire a toggle button: shown only where it can work, `.on` while full screen. */
export function bindFullscreenButton(btn: HTMLElement): void {
  if (!fullscreenSupported || standalone) return;
  btn.hidden = false;
  const sync = () => btn.classList.toggle('on', isFullscreen());
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  btn.addEventListener('click', () => (isFullscreen() ? exitFullscreen() : enterFullscreen()));
  sync();
}
