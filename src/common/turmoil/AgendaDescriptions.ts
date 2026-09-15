import {BonusId, PolicyId} from './Types';

/**
 * Plain-text descriptions for every bonus/policy id, for client-side reference display
 * (hover tooltips on the Turmoil board, and the /cards reference page). The authoritative
 * logic lives in the matching `src/server/turmoil/parties/*.ts` Bonus/Policy classes --
 * these strings are copied from their `description` fields, since the client can't import
 * server-only game logic.
 *
 * Kelvinists' kp01 description is normally dynamic (cheaper with High-Temp
 * Superconductors in play); this shows its base cost, matching the server's own fallback
 * when no player context is available.
 */
export const AGENDA_DESCRIPTIONS: Partial<Record<BonusId | PolicyId, string>> = {
  mb01: 'Gain 1 M€ for each building tag you have',
  mb02: 'Gain 1 M€ for each tile you have ON MARS',
  mp01: 'When you place a tile ON MARS, gain 1 steel',
  mp02: 'When you play a building tag, gain 2 M€',
  mp03: 'Your steel resources are worth 1 M€ extra',
  mp04: 'Spend 4 M€ to draw a Building card (Turmoil Mars First)',

  sb01: 'Gain 1 M€ for each science tag you have',
  sb02: 'Gain 1 M€ for every 3 cards in hand',
  sp01: 'Pay 10 M€ to draw 3 cards (Turmoil Scientists)',
  sp02: 'Your global requirements are +/- 2 steps',
  sp03: 'When you raise a global parameter, draw a card per step raised',
  sp04: 'Cards with Science tag requirements may be played with 1 less Science tag',

  ub01: 'Gain 1 M€ for each Venus, Earth and Jovian tag you have',
  ub02: 'Gain 1 M€ for each Space tag you have',
  up01: 'Your titanium resources are worth 1 M€ extra',
  up02: 'Spend 4 M€ to gain 2 titanium or add 2 floaters to ANY card (Turmoil Unity)',
  up03: 'Spend 4 M€ to draw a Space card (Turmoil Unity)',
  up04: 'Cards with Space tags cost 2 M€ less to play',

  kb01: 'Gain 1 M€ for each heat production you have',
  kb02: 'Gain 1 heat for each heat production you have',
  kp01: 'Pay 10 M€ to increase your energy and heat production 1 step (Turmoil Kelvinists)',
  kp02: 'When you raise temperature, gain 3 M€ per step raised',
  kp03: 'Convert 6 heat into temperature (Turmoil Kelvinists)',
  kp04: 'When you place a tile, gain 2 heat',

  rb01: 'The player(s) with the lowest TR gains 1 TR',
  rb02: 'The player(s) with the highest TR loses 1 TR',
  rp01: 'When you take an action that raises TR, you MUST pay 3 M€ per step raised',
  rp02: 'When you place a tile, pay 3 M€ or as much as possible',
  rp03: 'Pay 4 M€ to reduce a non-maxed global parameter 1 step (do not gain any track bonuses)',
  rp04: 'When you raise a global parameter, decrease your M€ production 1 step per step raised if possible',

  gb01: 'Gain 1 M€ for each Plant, Microbe and Animal tag you have',
  gb02: 'Gain 2 M€ for each greenery tile you have',
  gp01: 'When you place a greenery tile, gain 4 M€',
  gp02: 'When you place a tile, gain 1 plant',
  gp03: 'When you play an animal, plant or microbe tag, gain 2 M€',
  gp04: 'Spend 5 M€ to gain 3 plants or add 2 microbes to ANY card (Turmoil Greens)',
};
