export const NS = 'http://www.w3.org/2000/svg';

export type Attrs = Record<string, string | number>;

export function $<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T {
  const e = root.querySelector<T>(sel);
  if (!e) throw new Error(`missing element ${sel}`);
  return e;
}

/** Create an SVG element, set attributes, optionally append. */
export function el<K extends keyof SVGElementTagNameMap>(tag: K, a: Attrs = {}, parent?: Element): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const k in a) e.setAttribute(k, String(a[k]));
  if (parent) parent.appendChild(e);
  return e;
}

/** setAttribute that accepts numbers. */
export const at = (e: Element, k: string, v: string | number) => e.setAttribute(k, String(v));

export const f1 = (v: number) => v.toFixed(1);

export const show = (e: HTMLElement | SVGElement, on: boolean) => { e.style.display = on ? 'block' : 'none'; };
export const shown = (e: HTMLElement | SVGElement) => e.style.display !== 'none';
