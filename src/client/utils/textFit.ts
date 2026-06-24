// Sizing a text box (a card title, a milestone/award name) to fit, by measuring
// the rendered text and shrinking the font until it stops overflowing. This is
// more accurate than guessing from the character count, since glyphs aren't all
// the same width. It relies on the real font being loaded, so callers should
// wait on `document.fonts.ready` first.
//
// Fitted sizes are persisted by fontSizeCache so later visits skip the
// (layout-forcing) measurement entirely.
import {getCachedFontSize, setCachedFontSize} from '@/client/utils/fontSizeCache';

// Don't shrink past the smallest legible size.
const MIN_FONT_SIZE = 10;

// Tracks the cost of fitting text so a caller can report how long it took to
// resize a batch of elements.
class TextFitMetrics {
  private totalMs = 0;
  private fitCount = 0;

  reset(): void {
    this.totalMs = 0;
    this.fitCount = 0;
  }

  record(durationMs: number): void {
    this.totalMs += durationMs;
    this.fitCount++;
  }

  get total(): number {
    return this.totalMs;
  }

  get count(): number {
    return this.fitCount;
  }
}

export const textFitMetrics = new TextFitMetrics();

// Shrinks `el`'s font until its text no longer overflows its box. Records the
// time spent so it can be aggregated by the caller. The fitted size is
// cached (keyed on the rendered text) so subsequent visits apply it without
// re-measuring.
//
// `namespace` keys the cache by context: the same text in a card title and a
// milestone name lives in differently sized boxes and fits at different sizes,
// so they must not share a cache entry.
export function fitText(el: HTMLElement, namespace: string): void {
  const start = performance.now();
  const key = `${namespace}:${el.textContent ?? ''}`;

  const cached = getCachedFontSize(key);
  if (cached !== undefined) {
    el.style.fontSize = `${cached}px`;
  } else {
    // Start from the stylesheet size so repeated fits don't ratchet downward, and
    // so each context shrinks from its own default (16px for card titles, 15px
    // for milestone/award names).
    el.style.fontSize = '';
    let size = Math.round(parseFloat(getComputedStyle(el).fontSize));
    if (!Number.isFinite(size) || size <= 0) {
      // No readable starting size (e.g. no layout engine); leave the text alone
      // rather than guessing a size that may not match this element's box.
      return;
    }
    while (overflows(el) && size > MIN_FONT_SIZE) {
      size--;
      el.style.fontSize = `${size}px`;
    }

    // Cache every result, including titles that already fit at the default size,
    // so a later visit applies the size from the cache instead of re-measuring.
    // Re-measuring forces a layout reflow per card, which is the bulk of the cost.
    setCachedFontSize(key, size);
  }

  textFitMetrics.record(performance.now() - start);
}

// Fits `el` to `namespace` once the card font is loaded, the way a component's
// mounted/watch hook wants it: tolerant of a missing element, and deferred until
// `document.fonts.ready` so the measurement uses real glyph widths. Outside a
// real browser (e.g. JSDOM tests) `document.fonts` is unavailable, so fit
// synchronously.
export function fitTextWhenReady(el: HTMLElement | undefined, namespace: string): void {
  if (el === undefined) {
    return;
  }
  if (document.fonts === undefined) {
    fitText(el, namespace);
    return;
  }
  document.fonts.ready.then(() => fitText(el, namespace));
}

// True when the text spills past its box in either direction. Card titles are a
// single clipped line (horizontal overflow only); milestone/award names wrap, so
// a too-long unbreakable word likewise shows up as horizontal overflow.
function overflows(el: HTMLElement): boolean {
  return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
}
