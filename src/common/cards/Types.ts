import {GlobalParameter} from '../GlobalParameter';
import {Tag} from './Tag';

export type CardDiscount = {
  tag?: Tag, // When absent, discount applies to all tags.
  amount: number,
  per?: 'card' | 'tag', // discount is either applied once for the card, or for every tag.
 }

/**
 * A type of global parameter requirement bonus.
 */
export type GlobalParameterRequirementBonus = {
  /** The size of the bonus. */
  steps: number,
  /** The global parameter it applies to */
  parameter?: GlobalParameter,
  /** This discount only applies to the next card played when this is true. */
  nextCardOnly?: boolean,
};

