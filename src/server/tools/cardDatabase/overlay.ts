import {CardEntry, Passive} from './CardDatabaseTypes';
import {CardName} from '@/common/cards/CardName';

/**
 * Hand-written semantics for a card whose behavior is not fully declarative.
 *
 * 'documented' supplies what the generated data cannot say. 'complete' records
 * that the card's bespoke code only guards playability or tile placement, so
 * the generated data already describes the card.
 */
export type Overlay =
  | {
    status: 'documented',
    /** Everything the structured fields cannot express, in plain English. */
    semantics: string,
    /** Continuous and triggered effects. */
    passive?: ReadonlyArray<Passive>,
    /** Restriction on when the card may be played or where its tile may go. */
    play_restriction?: string,
  }
  | {status: 'complete', reason: string};

export const CARD_OVERLAY: Partial<Record<CardName, Overlay>> = {
  // ---------------------------------------------------------------------------
  // Corporations: base and Corporate Era
  // ---------------------------------------------------------------------------
  [CardName.CREDICOR]: {
    status: 'documented',
    semantics: 'A continuous effect that pays out on expensive purchases. The 20 M€ threshold is the printed basic cost, before any discounts.',
    passive: [{
      trigger: 'you pay for a project card or a standard project whose basic cost is 20 M€ or more',
      effect: 'gain 4 M€',
    }],
  },
  [CardName.HELION]: {
    status: 'documented',
    semantics: 'A continuous payment ability: heat may be spent as if it were M€, at 1 heat per 1 M€, when paying for anything. M€ may never be spent as heat.',
    passive: [{
      trigger: 'you pay for anything',
      effect: 'you may substitute heat for M€ one for one',
    }],
  },
  [CardName.INTERPLANETARY_CINEMATICS]: {
    status: 'documented',
    semantics: 'A trigger on your own event cards only.',
    passive: [{trigger: 'you play an event card', effect: 'gain 2 M€'}],
  },
  [CardName.MINING_GUILD]: {
    status: 'documented',
    semantics: 'A trigger on your own tile placements on Mars. It does not fire for tiles you place off Mars, nor during the solar phase.',
    passive: [{
      trigger: 'you place a tile on Mars on a space with a steel or titanium placement bonus',
      effect: 'increase your steel production 1 step',
    }],
  },
  [CardName.SATURN_SYSTEMS]: {
    status: 'documented',
    semantics: 'A trigger on every player, including yourself, and including this card\'s own Jovian tag when it is played.',
    passive: [{
      trigger: 'any player puts a Jovian tag into play',
      effect: 'increase your M€ production 1 step for each Jovian tag played',
    }],
  },
  [CardName.THARSIS_REPUBLIC]: {
    status: 'documented',
    semantics: 'In a solo game the two neutral cities placed during setup pay out immediately, so playing this corporation grants 2 M€ production straight away.',
    passive: [
      {trigger: 'any player places a city tile on Mars', effect: 'increase your M€ production 1 step'},
      {trigger: 'you place a city tile anywhere', effect: 'gain 3 M€'},
    ],
  },
  [CardName.THORGATE]: {
    status: 'documented',
    semantics: 'The 3 M€ discount on power-tag cards is in card_discount. What the data cannot express is that the same discount also applies to the Power Plant standard project.',
    passive: [{
      trigger: 'you buy the Power Plant standard project',
      effect: 'pay 3 M€ less for it',
    }],
  },
  [CardName.UNITED_NATIONS_MARS_INITIATIVE]: {
    status: 'documented',
    semantics: 'The action costs 3 M€ and raises your terraform rating 1 step. It is only available if your terraform rating already went up this generation for some other reason.',
  },

  // ---------------------------------------------------------------------------
  // Prelude: corporations
  // ---------------------------------------------------------------------------
  [CardName.POINT_LUNA]: {
    status: 'documented',
    semantics: 'A trigger on your own cards only.',
    passive: [{
      trigger: 'you play a card with at least one Earth tag',
      effect: 'draw 1 card for each Earth tag on it',
    }],
  },
  [CardName.ROBINSON_INDUSTRIES]: {
    status: 'documented',
    semantics: 'The action costs 4 M€ and increases your lowest production 1 step. Only productions tied for lowest are eligible; if several tie, you choose among them.',
  },
  [CardName.VALLEY_TRUST]: {
    status: 'documented',
    semantics: 'The 2 M€ discount on science-tag cards is in card_discount. The first action draws 3 Prelude cards from the prelude deck; you play one and discard the other two.',
  },
  [CardName.VITOR]: {
    status: 'documented',
    semantics: 'The printed starting M€ is 45. The database says 48 because Vitor\'s own effect fires when the corporation is played. The first action funds one award at no cost; in a solo game there are no awards, so it does nothing.',
    passive: [{
      trigger: 'you play a card with a printed victory point value greater than zero',
      effect: 'gain 3 M€',
    }],
  },

  // ---------------------------------------------------------------------------
  // Prelude: preludes
  // ---------------------------------------------------------------------------
  [CardName.AQUIFER_TURBINES]: {
    status: 'documented',
    semantics: 'The starting_megacredits of -3 is a cost: you pay 3 M€ when this prelude is played, you do not gain it.',
    play_restriction: 'you must be able to pay 3 M€',
  },
  [CardName.GALILEAN_MINING]: {
    status: 'documented',
    semantics: 'The starting_megacredits of -5 is a cost: you pay 5 M€ when this prelude is played, you do not gain it.',
    play_restriction: 'you must be able to pay 5 M€',
  },
  [CardName.BUSINESS_EMPIRE]: {
    status: 'documented',
    semantics: 'The starting_megacredits of -6 is a cost: you pay 6 M€ when this prelude is played, you do not gain it.',
    play_restriction: 'you must be able to pay 6 M€, unless you have Manutech, whose M€ production gain covers the cost',
  },
  [CardName.HUGE_ASTEROID]: {
    status: 'documented',
    semantics: 'The starting_megacredits of -5 is a cost: you pay 5 M€ when this prelude is played, you do not gain it.',
    play_restriction: 'you must be able to pay 5 M€',
  },
  [CardName.ECCENTRIC_SPONSOR]: {
    status: 'documented',
    semantics: 'Play one card from your hand at a 25 M€ discount, which makes almost any card free. If you play no card the prelude fizzles and the discount is not carried over.',
  },
  [CardName.ECOLOGY_EXPERTS]: {
    status: 'documented',
    semantics: 'Increase your plant production 1 step, then play one card from your hand ignoring its global parameter requirements. Tag and other non-global requirements still apply.',
    play_restriction: 'you must have at least one card in hand that becomes playable once global requirements are ignored',
  },

  // ---------------------------------------------------------------------------
  // Prelude: project cards
  // ---------------------------------------------------------------------------
  [CardName.LAVA_TUBE_SETTLEMENT]: {
    status: 'documented',
    semantics: 'Places a city tile on a volcanic area, ignoring the usual rule that cities may not be placed next to another city. On a board with no volcanic spaces the city may go on any city-legal space.',
    play_restriction: 'you must have at least 1 energy production and there must be a legal volcanic space',
  },

  // ---------------------------------------------------------------------------
  // Base: triggered and continuous effects
  // ---------------------------------------------------------------------------
  [CardName.ARCTIC_ALGAE]: {
    status: 'documented',
    semantics: 'The trigger fires for every player\'s ocean placements, not only your own.',
    passive: [{trigger: 'any player places an ocean tile', effect: 'gain 2 plants'}],
  },
  [CardName.DECOMPOSERS]: {
    status: 'documented',
    semantics: 'Worth 1 victory point for every 3 microbes on this card. If this card is played in the prelude phase immediately after Ecology Experts, it starts with 2 extra microbes.',
    passive: [{
      trigger: 'you play a card with an animal, plant, or microbe tag',
      effect: 'add 1 microbe to this card for each matching tag',
    }],
  },
  [CardName.ECOLOGICAL_ZONE]: {
    status: 'documented',
    semantics: 'On play, place the Ecological Zone special tile. If this card is played in the prelude phase immediately after Ecology Experts, it starts with 1 extra animal.',
    passive: [{
      trigger: 'you play a card with an animal or plant tag',
      effect: 'add 1 animal to this card for each matching tag',
    }],
    play_restriction: 'the Ecological Zone tile must go on a land space adjacent to a greenery tile',
  },
  [CardName.HERBIVORES]: {
    status: 'documented',
    semantics: 'On play, add 1 animal to this card and decrease any player\'s plant production 1 step.',
    passive: [{trigger: 'you place a greenery tile', effect: 'add 1 animal to this card'}],
  },
  [CardName.IMMIGRANT_CITY]: {
    status: 'documented',
    semantics: 'On play, place a city tile, then decrease your energy production 1 step and your M€ production 2 steps.',
    passive: [{trigger: 'any player places a city tile', effect: 'increase your M€ production 1 step'}],
    play_restriction: 'you need 1 energy production, a legal city space, and enough M€ production to absorb the 2 step loss',
  },
  [CardName.INDENTURED_WORKERS]: {
    status: 'documented',
    semantics: 'The discount applies once, to the very next card you play this generation, and is lost if you play no further card.',
    passive: [{trigger: 'you play your next card this generation', effect: 'it costs 8 M€ less'}],
  },
  [CardName.MARS_UNIVERSITY]: {
    status: 'documented',
    semantics: 'Triggers once for each science tag played, including this card\'s own science tag when it enters play. If your hand is empty the trigger does nothing.',
    passive: [{
      trigger: 'you play a card with a science tag, including this card',
      effect: 'for each science tag, you may discard 1 card from your hand to draw 1 card',
    }],
  },
  [CardName.MEDIA_GROUP]: {
    status: 'documented',
    semantics: 'A trigger on your own event cards only.',
    passive: [{trigger: 'you play an event card', effect: 'gain 3 M€'}],
  },
  [CardName.OLYMPUS_CONFERENCE]: {
    status: 'documented',
    semantics: 'The choice is only offered when there is already a science resource here; otherwise a resource is simply added.',
    passive: [{
      trigger: 'you play a card with a science tag, including this card',
      effect: 'for each science tag, either add 1 science resource to this card, or remove 1 science resource from this card to draw a card',
    }],
  },
  [CardName.OPTIMAL_AEROBRAKING]: {
    status: 'documented',
    semantics: 'The played card must be both an event and carry a space tag.',
    passive: [{trigger: 'you play a space event card', effect: 'gain 3 M€ and 3 heat'}],
  },
  [CardName.PETS]: {
    status: 'documented',
    semantics: 'On play, add 1 animal to this card. Animals here are protected: other players cannot remove them.',
    passive: [{trigger: 'any player places a city tile', effect: 'add 1 animal to this card'}],
  },
  [CardName.ROVER_CONSTRUCTION]: {
    status: 'documented',
    semantics: 'The trigger fires for every player\'s city placements, not only your own.',
    passive: [{trigger: 'any player places a city tile', effect: 'gain 2 M€'}],
  },
  [CardName.SEARCH_FOR_LIFE]: {
    status: 'documented',
    semantics: 'Worth 3 victory points if this card holds at least 1 science resource, and 0 otherwise. The action costs 1 M€: reveal the top card of the project deck, add 1 science resource to this card if the revealed card has a microbe tag, then discard the revealed card.',
  },
  [CardName.STANDARD_TECHNOLOGY]: {
    status: 'documented',
    semantics: 'Sell Patents is explicitly excluded.',
    passive: [{
      trigger: 'you pay for a standard project other than Sell Patents',
      effect: 'gain 3 M€',
    }],
  },
  [CardName.VIRAL_ENHANCERS]: {
    status: 'documented',
    semantics: 'The choice between a plant and a card resource is offered once per matching tag, and only when the played card itself stores microbes or animals. Otherwise you simply gain the plants.',
    passive: [{
      trigger: 'you play a card with a plant, microbe, or animal tag',
      effect: 'for each matching tag, gain 1 plant, or add 1 resource to the played card if it stores microbes or animals',
    }],
  },
};

/**
 * Applies the hand-written semantics for a card, and corrects the bespoke flag
 * when the card's bespoke code turns out to add nothing the data does not say.
 */
export function applyOverlay(entry: CardEntry): CardEntry {
  const overlay = CARD_OVERLAY[entry.name as CardName];
  if (overlay === undefined) {
    return entry;
  }
  if (overlay.status === 'complete') {
    entry.bespoke = false;
    return entry;
  }
  entry.semantics = overlay.semantics;
  if (overlay.passive !== undefined) {
    entry.passive = overlay.passive.map((passive) => ({...passive}));
  }
  if (overlay.play_restriction !== undefined) {
    entry.play_restriction = overlay.play_restriction;
  }
  return entry;
}
