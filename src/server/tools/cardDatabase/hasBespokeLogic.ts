import {ICard} from '@/server/cards/ICard';

/**
 * Members a card subclass defines when its behavior cannot be expressed as data.
 *
 * Base classes define most of these too, which is why the search stops at them.
 */
const BESPOKE_MEMBERS: ReadonlyArray<string> = [
  'action',
  'bespokeAction',
  'bespokeCanAct',
  'bespokeCanPlay',
  'bespokeOnDiscard',
  'bespokePlay',
  'canAct',
  'canPlay',
  'computeTr',
  'getCardDiscount',
  'getGlobalParameterRequirementBonus',
  'getInfluenceBonus',
  'getStandardProjectDiscount',
  'getVictoryPoints',
  'initialAction',
  'onCardPlayed',
  'onCardPlayedByAnyPlayer',
  'onClaim',
  'onColonyAddedByAnyPlayer',
  'onDiscard',
  'onGlobalParameterIncrease',
  'onIdentificationByAnyPlayer',
  'onIncreaseTerraformRatingByAnyPlayer',
  'onNonCardTagAdded',
  'onNonCardTagAddedByAnyPlayer',
  'onProductionGain',
  'onProductionPhase',
  'onResourceAdded',
  'onStandardProject',
  'onTilePlaced',
  'play',
  'produce',
  'productionBox',
];

/** Classes that supply the data-driven default implementations. */
const DATA_DRIVEN_BASES: ReadonlyArray<string> = [
  'ActionCard',
  'ActiveCorporationCard',
  'Card',
  'CorporationCard',
  'Object',
  'PreludeCard',
];

/**
 * Returns true when some of the card's behavior lives in TypeScript rather than
 * in its declarative properties, which means the exported data alone does not
 * describe it fully.
 */
export function hasBespokeLogic(card: ICard): boolean {
  let prototype = Object.getPrototypeOf(card);
  while (prototype !== null && !DATA_DRIVEN_BASES.includes(prototype.constructor.name)) {
    for (const member of BESPOKE_MEMBERS) {
      if (Object.prototype.hasOwnProperty.call(prototype, member)) {
        return true;
      }
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}
