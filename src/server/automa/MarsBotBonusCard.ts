import {BonusCardId} from '../../common/automa/AutomaTypes';

export type MarsBotBonusCard = {
  readonly id: BonusCardId;
  readonly name: string;
};

export function bonusCard(id: BonusCardId, name: string): MarsBotBonusCard {
  return {id, name};
}

/** Create the base set of bonus cards (B01-B08). */
export function createBaseBonusCards(): Array<MarsBotBonusCard> {
  return [
    bonusCard(BonusCardId.B01_METEOR_SHOWER, 'Meteor Shower'),
    bonusCard(BonusCardId.B02_INVASIVE_SPECIES, 'Invasive Species'),
    bonusCard(BonusCardId.B03_RESEARCH_AND_DEVELOPMENT, 'Research and Development'),
    bonusCard(BonusCardId.B04_OVERACHIEVEMENT, 'Overachievement'),
    bonusCard(BonusCardId.B05_EXPEDITED_CONSTRUCTION, 'Expedited Construction'),
    bonusCard(BonusCardId.B06_LOBBYISTS, 'Lobbyists'),
    bonusCard(BonusCardId.B07_LOCAL_NEURAL_INSTANCE, 'Local Neural Instance'),
    bonusCard(BonusCardId.B08_CORPORATE_COMPETITION, 'Corporate Competition'),
  ];
}
