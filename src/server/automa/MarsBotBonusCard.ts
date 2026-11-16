import {CardName} from '@/common/cards/CardName';
import {BonusCardId} from '../../common/automa/AutomaTypes';

export type MarsBotBonusCard = {
  readonly id: BonusCardId;
  readonly name: CardName;
};

export function bonusCard(id: BonusCardId, name: CardName): MarsBotBonusCard {
  return {id, name};
}

/** Create the base set of bonus cards (B01-B08). */
export function createBaseBonusCards(): Array<MarsBotBonusCard> {
  return [
    bonusCard(BonusCardId.B01_METEOR_SHOWER, CardName.AUTOMA_METEOR_SHOWER),
    bonusCard(BonusCardId.B02_INVASIVE_SPECIES, CardName.AUTOMA_INVASIVE_SPECIES),
    bonusCard(BonusCardId.B03_RESEARCH_AND_DEVELOPMENT, CardName.AUTOMA_RESEARCH_AND_DEVELOPMENT),
    bonusCard(BonusCardId.B04_OVERACHIEVEMENT, CardName.AUTOMA_OVERACHIEVEMENT),
    bonusCard(BonusCardId.B05_EXPEDITED_CONSTRUCTION, CardName.AUTOMA_EXPEDITED_CONSTRUCTION),
    bonusCard(BonusCardId.B06_LOBBYISTS, CardName.AUTOMA_LOBBYISTS),
    bonusCard(BonusCardId.B07_LOCAL_NEURAL_INSTANCE, CardName.AUTOMA_LOCAL_NEURAL_INSTANCE),
    bonusCard(BonusCardId.B08_CORPORATE_COMPETITION, CardName.AUTOMA_CORPORATE_COMPETITION),
  ];
}

/** Create a single bonus card by ID, from any set. */
export function createBonusCard(id: BonusCardId): MarsBotBonusCard {
  return bonusCard(id, BONUS_CARD_NAMES.get(id) ?? (id as unknown as CardName));
}

const BONUS_CARD_NAMES: Map<BonusCardId, CardName> = new Map([
  [BonusCardId.B01_METEOR_SHOWER, CardName.AUTOMA_METEOR_SHOWER],
  [BonusCardId.B02_INVASIVE_SPECIES, CardName.AUTOMA_INVASIVE_SPECIES],
  [BonusCardId.B03_RESEARCH_AND_DEVELOPMENT, CardName.AUTOMA_RESEARCH_AND_DEVELOPMENT],
  [BonusCardId.B04_OVERACHIEVEMENT, CardName.AUTOMA_OVERACHIEVEMENT],
  [BonusCardId.B05_EXPEDITED_CONSTRUCTION, CardName.AUTOMA_EXPEDITED_CONSTRUCTION],
  [BonusCardId.B06_LOBBYISTS, CardName.AUTOMA_LOBBYISTS],
  [BonusCardId.B07_LOCAL_NEURAL_INSTANCE, CardName.AUTOMA_LOCAL_NEURAL_INSTANCE],
  [BonusCardId.B08_CORPORATE_COMPETITION, CardName.AUTOMA_CORPORATE_COMPETITION],
  [BonusCardId.B15_LOBBYISTS_VENUS, CardName.AUTOMA_LOBBYISTS_VENUS],
  [BonusCardId.B16_GOVERNMENT_INTERVENTION, CardName.AUTOMA_GOVERNMENT_INTERVENTION],
  [BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES, CardName.AUTOMA_EXPEDITED_CONSTRUCTION_COLONIES],
  [BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD, CardName.AUTOMA_OUTER_SYSTEM_FOOTHOLD],
  [BonusCardId.B19_SHIPPING_LINES, CardName.AUTOMA_SHIPPING_LINES],
  [BonusCardId.B20_EXTENDED_SHIPPING_LINES, CardName.AUTOMA_EXTENDED_SHIPPING_LINES],
  [BonusCardId.B21_PARTY_POLITICS, CardName.AUTOMA_PARTY_POLITICS],
  [BonusCardId.B22_SETTLERS, CardName.AUTOMA_SETTLERS],
  [BonusCardId.B23_RAPID_SPROUTING, CardName.AUTOMA_RAPID_SPROUTING],
  [BonusCardId.B24_SUPPLY_AND_DEMAND, CardName.AUTOMA_SUPPLY_AND_DEMAND],
  [BonusCardId.B25_DO_IT_RIGHT, CardName.AUTOMA_DO_IT_RIGHT],
  [BonusCardId.B26_VENUSIAN_LOBBY, CardName.AUTOMA_VENUSIAN_LOBBY],
  [BonusCardId.B27_BUILD_BUILD_BUILD, CardName.AUTOMA_BUILD_BUILD_BUILD],
  [BonusCardId.B28_DIVERSIFICATION, CardName.AUTOMA_DIVERSIFICATION],
  [BonusCardId.B29_GRAY_EMINENCE, CardName.AUTOMA_GRAY_EMINENCE],
  [BonusCardId.B30_INTERFACE_HYPERLINK, CardName.AUTOMA_INTERFACE_HYPERLINK],
  [BonusCardId.B31_GOVERNMENT_SUBSIDY, CardName.AUTOMA_GOVERNMENT_SUBSIDY],
  [BonusCardId.B32_INVESTORS, CardName.AUTOMA_INVESTORS],
]);

/** Restore bonus cards from their serialized names. */
export function marsBotBonusCardsFromJSON(names: ReadonlyArray<CardName>): Array<MarsBotBonusCard> {
  const byName = new Map(Array.from(BONUS_CARD_NAMES, ([id, name]) => [name, id]));
  const cards: Array<MarsBotBonusCard> = [];
  for (const name of names) {
    const id = byName.get(name);
    if (id === undefined) {
      throw new Error(`Cannot restore MarsBot bonus deck card ${name}`);
    }
    cards.push(bonusCard(id, name));
  }
  return cards;
}
