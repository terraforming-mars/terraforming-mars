import {GlobalParameter} from '../GlobalParameter';
import {Tag} from './Tag';

/**
 * Description of a discount for playing project tags.
 */
export type CardDiscount = {
  /** The tag this discount applies to, or when undefined, it applies to all cards. */
  tag?: Tag,
  /** The M€ discount. */
  amount: number,
  /** Describes whether the discount is applied once for the card, or for ever tag. */
  per?: 'card' | 'tag',
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

