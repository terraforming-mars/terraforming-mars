import {BonusCardName} from '@/common/automa/BonusCardName';
import {BonusCardId} from '../../common/automa/AutomaTypes';

export type MarsBotBonusCard = {
  readonly id: BonusCardId;
  readonly name: BonusCardName;
};

export function bonusCard(id: BonusCardId, name: BonusCardName): MarsBotBonusCard {
  return {id, name};
}

/** Create the base set of bonus cards (B01-B08). */
export function createBaseBonusCards(): Array<MarsBotBonusCard> {
  return [
    bonusCard(BonusCardId.B01_METEOR_SHOWER, BonusCardName.METEOR_SHOWER),
    bonusCard(BonusCardId.B02_INVASIVE_SPECIES, BonusCardName.INVASIVE_SPECIES),
    bonusCard(BonusCardId.B03_RESEARCH_AND_DEVELOPMENT, BonusCardName.RESEARCH_AND_DEVELOPMENT),
    bonusCard(BonusCardId.B04_OVERACHIEVEMENT, BonusCardName.OVERACHIEVEMENT),
    bonusCard(BonusCardId.B05_EXPEDITED_CONSTRUCTION, BonusCardName.EXPEDITED_CONSTRUCTION),
    bonusCard(BonusCardId.B06_LOBBYISTS, BonusCardName.LOBBYISTS),
    bonusCard(BonusCardId.B07_LOCAL_NEURAL_INSTANCE, BonusCardName.LOCAL_NEURAL_INSTANCE),
    bonusCard(BonusCardId.B08_CORPORATE_COMPETITION, BonusCardName.CORPORATE_COMPETITION),
  ];
}

/** Create a single bonus card by ID, from any set. */
export function createBonusCard(id: BonusCardId): MarsBotBonusCard {
  return bonusCard(id, BONUS_CARD_NAMES.get(id) ?? (id as unknown as BonusCardName));
}

const BONUS_CARD_NAMES: Map<BonusCardId, BonusCardName> = new Map([
  [BonusCardId.B01_METEOR_SHOWER, BonusCardName.METEOR_SHOWER],
  [BonusCardId.B02_INVASIVE_SPECIES, BonusCardName.INVASIVE_SPECIES],
  [BonusCardId.B03_RESEARCH_AND_DEVELOPMENT, BonusCardName.RESEARCH_AND_DEVELOPMENT],
  [BonusCardId.B04_OVERACHIEVEMENT, BonusCardName.OVERACHIEVEMENT],
  [BonusCardId.B05_EXPEDITED_CONSTRUCTION, BonusCardName.EXPEDITED_CONSTRUCTION],
  [BonusCardId.B06_LOBBYISTS, BonusCardName.LOBBYISTS],
  [BonusCardId.B07_LOCAL_NEURAL_INSTANCE, BonusCardName.LOCAL_NEURAL_INSTANCE],
  [BonusCardId.B08_CORPORATE_COMPETITION, BonusCardName.CORPORATE_COMPETITION],
  [BonusCardId.B15_LOBBYISTS_VENUS, BonusCardName.LOBBYISTS_VENUS],
  [BonusCardId.B16_GOVERNMENT_INTERVENTION, BonusCardName.GOVERNMENT_INTERVENTION],
  [BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES, BonusCardName.EXPEDITED_CONSTRUCTION_COLONIES],
  [BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD, BonusCardName.OUTER_SYSTEM_FOOTHOLD],
  [BonusCardId.B19_SHIPPING_LINES, BonusCardName.SHIPPING_LINES],
  [BonusCardId.B20_EXTENDED_SHIPPING_LINES, BonusCardName.EXTENDED_SHIPPING_LINES],
  [BonusCardId.B21_PARTY_POLITICS, BonusCardName.PARTY_POLITICS],
  [BonusCardId.B22_SETTLERS, BonusCardName.SETTLERS],
  [BonusCardId.B23_RAPID_SPROUTING, BonusCardName.RAPID_SPROUTING],
  [BonusCardId.B24_SUPPLY_AND_DEMAND, BonusCardName.SUPPLY_AND_DEMAND],
  [BonusCardId.B25_DO_IT_RIGHT, BonusCardName.DO_IT_RIGHT],
  [BonusCardId.B26_VENUSIAN_LOBBY, BonusCardName.VENUSIAN_LOBBY],
  [BonusCardId.B27_BUILD_BUILD_BUILD, BonusCardName.BUILD_BUILD_BUILD],
  [BonusCardId.B28_DIVERSIFICATION, BonusCardName.DIVERSIFICATION],
  [BonusCardId.B29_GRAY_EMINENCE, BonusCardName.GRAY_EMINENCE],
  [BonusCardId.B30_INTERFACE_HYPERLINK, BonusCardName.INTERFACE_HYPERLINK],
  [BonusCardId.B31_GOVERNMENT_SUBSIDY, BonusCardName.GOVERNMENT_SUBSIDY],
  [BonusCardId.B32_INVESTORS, BonusCardName.INVESTORS],
]);

/** Restore bonus cards from their serialized names. */
export function marsBotBonusCardsFromJSON(names: ReadonlyArray<BonusCardName>): Array<MarsBotBonusCard> {
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
