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

/** Restore bonus cards from their serialized names. */
export function marsBotBonusCardsFromJSON(names: ReadonlyArray<CardName>): Array<MarsBotBonusCard> {
  const byName = new Map(createBaseBonusCards().map((card) => [card.name, card]));
  const cards: Array<MarsBotBonusCard> = [];
  for (const name of names) {
    const card = byName.get(name);
    if (card !== undefined) {
      cards.push(card);
    } else {
      console.warn(`bonus card ${name} not found while loading game.`);
    }
  }
  return cards;
}
