import {SpaceId} from '@/common/Types';

// Scrolls the Mars or Moon board into view depending on which board `spaceId` belongs to.
// Returns the scrolled-to element, or null if it isn't present (e.g. no board on this screen).
export function scrollToSpace(spaceId: SpaceId): HTMLElement | null {
  const id = spaceId.startsWith('m') ? 'shortkey-moonBoard' : 'shortkey-board';
  const el = document.getElementById(id);
  el?.scrollIntoView({block: 'center', inline: 'center', behavior: 'auto'});
  return el;
}
