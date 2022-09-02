import {Tag} from '../../../common/cards/Tag';

/*
 * Implementing clone tags is a little tricky and falls outside of fairly standard behavior.
 * To make a clone tag work:
 * 1) implement ICloneTag on the card.
 * 2) initialze cloneTag to Tag.CLONE, not in the constructor, but as an attribute.
 * 3) Don't define tags in the constructor, implement tags as a getter.
 *
 * These three steps create a card with a clone tag that serializes and deserializes.
 *
 * This could be simpler with some sort of mutliple inheritence, e.g.
 * https://stackoverflow.com/questions/40807808/typescript-multiple-inheritance
 * but not right now.
 */

// A card that has a clone tag icon also must store information about what that card's clone tag represents.
export interface ICloneTagCard {
  cloneTag: Tag;
}

export function isICloneTagCard(obj: object): obj is ICloneTagCard {
  return 'cloneTag' in obj;
}
