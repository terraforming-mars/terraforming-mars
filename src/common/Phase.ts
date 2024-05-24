/**
 * The different phases the game goes through. These do not perfectly match
 * to phases in the rulebook.
 *
 * A chart describing the phase transitions can be found at
 * https://docs.google.com/drawings/d/1OvSmFEWVxVuydRCVkWT1BVoqurKYeYNvKP-6htNjcCM/edit?usp=sharing
 */
export enum Phase {
  /**
   * Not part of the rulebook, initial drafting includes project cards and
   * prelude cards (maybe others ongoing?) Transitions to RESEARCH
   * but as mentioned above, only the first generation type of research.
   */
  INITIALDRAFTING = 'initial_drafting',

  /** Between 1st gen research and action phases, each player plays their preludes. */
  PRELUDES = 'preludes',
  /** Between 1st gen research and action phases, each player plays their CEOs. */
  CEOS = 'ceos',

  /**
   * The phase where a player chooses cards to keep.
   * This includes the first generation drafting phase, which has different
   * behavior and transitions to a different eventual phase
   */
  RESEARCH = 'research',

  /** The standard drafting phase, as described by the official rules variant. */
  DRAFTING = 'drafting',

  /** Maps to rulebook action phase */
  ACTION = 'action',

  /** Maps to rulebook production phase */
  PRODUCTION = 'production',
  /** Standard rulebook Solar phase, triggers WGT, but also Turmoil and final greeneries. */
  SOLAR = 'solar',
  /** Does some cleanup and also executes the rulebook's turn order phase. */
  INTERGENERATION = 'intergeneration',

  /** The game is over. */
  END = 'end',
}
