import {CardResource} from '../CardResource';
import {Units} from '../Units';
import {CardName} from './CardName';
import {CardType} from './CardType';
import {GameModule} from './GameModule';
import {ICardMetadata} from './ICardMetadata';
import {CardRequirementDescriptor} from './CardRequirementDescriptor';
import {IVictoryPoints} from './IVictoryPoints';
import {Tag} from './Tag';
import {CardDiscount} from './Types';
import {OneOrArray} from '../utils/types';

export type ClientCard = {
  name: CardName;
  module: GameModule;
  tags: Array<Tag>;
  cardDiscount?: OneOrArray<CardDiscount>;
  victoryPoints?: number | 'special' | IVictoryPoints,
  cost?: number;
  type: CardType;
  requirements: Array<CardRequirementDescriptor>;
  metadata: ICardMetadata;
  productionBox?: Units; // Replace with behavior?
  resourceType?: CardResource;
  startingMegaCredits?: number; // Corporation and Prelude
  cardCost?: number; // Corporation
  compatibility: Array<GameModule>;
}
