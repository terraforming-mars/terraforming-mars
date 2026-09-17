export enum Priority {
  /** Legacy value that should not be further used. */
  SUPERPOWER = -1,
  /** Used for Pathfinders. First thing a player must do before further effects. */
  DECLARE_CLONE_TAG,
  /** Cost of a blue card action, or paying Reds costs. Must happen before the effects. */
  COST,
  /** Pay to block Underworld attacks */
  MAYBE_BLOCK_ATTACK,
  /** Special case effects that should occur before Pharmacy Union */
  BEFORE_PHARMACY_UNION,
  /** Pharmacy Union special case, players typically prefer to resolve this early. */
  PHARMACY_UNION,
  /**
   * A choice belonging to the active player which should resolve before their opponents'
   * triggered effects. (e.g. Flooding's attack, which changes what an opponent can afford.)
   */
  BEFORE_OPPONENT_TRIGGER,
  /** Any effect from one of your opponent's card that triggers during your turn. */
  OPPONENT_TRIGGER,
  /**
   * Resolve Hyperspace Drive Prototype before Olympus Conference
   *
   * https://docs.google.com/drawings/d/1VXfVmoJWU_QmMDwZ-liVh5ZvWVmmpl2kuo_3ANz4omY/edit?usp=sharing
   */
  HYPERSPACE_DRIVE_PROTOTYPE,
  /**
   * Resolve Olympus Conference before Sponsored Academies and Mars U.
   */
  OLYMPUS_CONFERENCE,
  /** When you must discard before you can draw. Making a determination that Sponsored Academies should come before Mars U. */
  SPONSORED_ACADEMIES,
  DRAW_CARDS,
  BUILD_COLONY,
  INCREASE_COLONY_TRACK,
  PLACE_OCEAN_TILE,
  IDENTIFY_UNDERGROUND_RESOURCE,
  EXCAVATE_UNDERGROUND_RESOURCE,

  /** Anything that doesn't fit into another category. */
  DEFAULT,

  /**
   * When you must discard before you can draw. Mars U, Ender (CEO).
   *
   * Note: This used to be before DRAW_CARDS, and I don't know why it would be.
   * Moving this just after DEFAULT. See #5488
   */
  DISCARD_AND_DRAW,
  /** Effects that make your opponents lose resources or production. */
  ATTACK_OPPONENT,
  GAIN_RESOURCE_OR_PRODUCTION,
  /** Lose (or spend) resources or production. */
  LOSE_RESOURCE_OR_PRODUCTION,
  DECREASE_COLONY_TRACK_AFTER_TRADE,
  DISCARD_CARDS,
  ROBOTIC_WORKFORCE,
  BACK_OF_THE_LINE,
}
