import {Units} from '../../common/Units';
import {OneOrArray} from '../../common/utils/types';
import {Tag} from '../../common/cards/Tag';
import {NoAttributes} from './NoAttributes';

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
  tag?: OneOrArray<Tag>,
  cities?: {where?: 'onmars' | 'offmars' | 'everywhere'},
  greeneries?: NoAttributes,
  oceans?: NoAttributes,
  /** Count the number of resources on this card. */
  resourcesHere?: NoAttributes,
  /** Count the number of floaters on all cards. */
  floaters?: NoAttributes,
  colonies?: {
    /** Count the number of colonies this player has (or all colonies.) */
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
    undergroundTokens?: NoAttributes,
  },

  /** When counting tiles (cities, oceans, greeneries, moon tiles), only count tiles adjacent to this card's tile. */
  nextToThis?: NoAttributes,

  // (Note for later: Tags and Cities have different defaults. THIS IS NOT GOOD, IS IT?)
  all?: boolean;
  /**
   * When counting tags, this counts other players' tags, not yours.
   */
  others?: true;
  /**
   * When true, include events when counting tags.
   */
  includeEvents?: true;

  /**
   * Count the number of events this player has played.
   */
  eventsPlayed?: true;

  turmoil?: {
    /**
     * Count the number of parties this player leads.
     */
    partyLeaders?: NoAttributes,
    /**
     * Cap the count so far at this value. Global events commonly cap a count
     * before adding influence, so this is applied before `influence`, and
     * before `each` and `per`.
     */
    max?: number;
    /**
     * Add this player's Turmoil influence, or subtract it when `subtract` is set.
     *
     * Penalty global events reduce a capped count by influence, which is what `subtract`
     * is for. The result can go negative; pair it with `lose`, which treats a negative
     * count as zero.
     */
    influence?: {subtract?: boolean},
  }

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
