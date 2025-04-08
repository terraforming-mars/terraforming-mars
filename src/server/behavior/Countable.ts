import {Units} from '../../common/Units';
import {OneOrArray} from '../../common/utils/types';
import {Tag} from '../../common/cards/Tag';
import {NoAttributes} from './NoAttributes';

/**
 * Describes something that can be counted.
 */
export type _Countable = {
  /** An initial value for the countable. e.g. { start: 10 } returns 10. */
  start?: number;

  /**
   * Count the number of tags on the players' played cards.
   *
   * If `all` or `others` is set, then either all tags, or everyone else's tags, are counted.
   *
   * This is counting tags as if the player was taking an action (for example,
   * a player's wild tags count, events are ignored.)
   */
  tag?: OneOrArray<Tag>,
  cities?: {where?: 'onmars' | 'offmars' | 'everywhere'},
  greeneries?: NoAttributes,
  oceans?: NoAttributes,
  /** Count the number of resources on this card. */
  resourcesHere?: NoAttributes,
  /** Count the number of floaters on all cards. */
  floaters?: NoAttributes,
  colonies?: {
    colonies?: {},
  },
  moon?: {
    habitatRate?: NoAttributes,
    miningRate?: NoAttributes,
    logisticRate?: NoAttributes,
    habitat?: NoAttributes,
    mine?: NoAttributes,
    road?: NoAttributes,
  },
  underworld?: {
    corruption?: NoAttributes,
    excavationMarkers?: NoAttributes,
  },

  all?: boolean; // (Note for later: Tags and Cities have different defaults. THIS IS NOT GOOD, IS IT?)
  others?: true; // For tags this has a behavior.

  /**
   * Multiply the sum by this value.
   *
   * For example, `{cities: {}, each: 2}` would count all the cities on the board, and multiply that value by 2.
   */
  each?: number;

  /**
   * Divide the sum by this value. Round down.
   *
   * For example, `{tags: Tag.MOON, per: 3}` would count all moon tags, and then divide by 3.
   *
   * `each` is applied before `per`, so `{tags: Tag.MOON, each: 2, per: 3}` would provide 2/3 the value
   * of moon tags.
   */
  per?: number;
};

export type Countable = number | _Countable;

/**
 * A companion to Units with countable values.
 */
export type CountableUnits = {[k in keyof Units]: Countable}
