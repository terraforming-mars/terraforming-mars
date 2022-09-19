import {Tag} from '../../common/cards/Tag';

/**
 * Describes something that can be counted.
 */
export type _Countable = {
  /**
   * Count the number of tags on the players' played cards.
   *
   * If `all` or `others` is set, then either all tags, or everyone else's tags, are counted.
   *
   * This is counting tags as if the player was taking an action (for example,
   * a player's wild tags count, events are ignored.)
   */
  tag?: Tag | Array<Tag>,
  // cities?: {where?: 'onmars' | 'offmars' | 'everywhere'},
  // greeneries?: NoAttributes,
  // oceans?: {
  //   upgradedOceans?: boolean,
  //   wetlands?: boolean
  // },
  // moon?: {
  //   colonyRate?: NoAttributes,
  //   miningRate?: NoAttributes,
  //   logisticRate?: NoAttributes,
  //   colony?: NoAttributes,
  //   mine?: NoAttributes,
  //   road?: NoAttributes,
  // }

  all?: boolean; // (Note for later: Tags and Cities have different defaults. THIS IS NOT GOOD, IS IT?)
  others?: true; // For tags this has a behavior.

  /**
   * Multiple the sum by `per`.
   *
   * For example, `{cities: {}, each: 2}` would count all the cities on the board, and multiply that value by 2.
   */
  per?: number;

  /**
   * Divide the sum by `each`. Round down.
   *
   * For example, `{tags: Tag.MOON, each: 3}` would count all moon tags, and then divide by 3.
   */
  each?: number;
};

export type Countable = number | _Countable;
