// Sizing card titles to fit their box, by measuring the rendered text and
// shrinking the font until it stops overflowing. This is more accurate than
// guessing from the title's character count, since glyphs aren't all the same
// width. It relies on the real font being loaded, so callers should wait on
// `document.fonts.ready` first.
//
// Fitted sizes are persisted by titleFontSizeCache so later visits skip the
// (layout-forcing) measurement entirely.
import {getCachedFontSize, setCachedFontSize} from '@/client/components/card/titleFontSizeCache';

// Matches `.card-title` font-size in cards_v2.less.
const DEFAULT_FONT_SIZE = 16;
// Don't shrink past the smallest legible size (matches `.title-smallest`).
const MIN_FONT_SIZE = 10;

// Tracks the cost of fitting titles so the cards list can report how long it
// took to resize every card.
class TitleFitMetrics {
  private totalMs = 0;
  private count = 0;

  reset(): void {
    this.totalMs = 0;
    this.count = 0;
  }

  record(durationMs: number): void {
    this.totalMs += durationMs;
    this.count++;
  }

  get total(): number {
    return this.totalMs;
  }

  get cards(): number {
    return this.count;
  }
}

export const titleFitMetrics = new TitleFitMetrics();

// Shrinks `el`'s font until its text no longer overflows horizontally. Records
// the time spent so it can be aggregated by the cards list. The fitted size is
// cached (keyed on the rendered text) so subsequent visits apply it without
// re-measuring.
export function fitTitle(el: HTMLElement): void {
  const start = performance.now();
  const key = el.textContent ?? '';

  const cached = getCachedFontSize(key);
  if (cached !== undefined) {
    el.style.fontSize = `${cached}px`;
  } else {
    // Start from the stylesheet default so repeated fits don't ratchet downward.
    el.style.fontSize = '';
    let size = DEFAULT_FONT_SIZE;
    while (el.scrollWidth > el.clientWidth && size > MIN_FONT_SIZE) {
      size--;
      el.style.fontSize = `${size}px`;
    }

    // Cache every result, including titles that already fit at the default size,
    // so a later visit applies the size from the cache instead of re-measuring.
    // Re-measuring forces a layout reflow per card, which is the bulk of the cost.
    setCachedFontSize(key, size);
  }

  titleFitMetrics.record(performance.now() - start);
}
