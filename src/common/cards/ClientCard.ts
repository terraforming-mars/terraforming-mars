import {CardResource} from '../CardResource';
import {Units} from '../Units';
import {CardName} from './CardName';
import {CardType} from './CardType';
import {Expansion, GameModule} from './GameModule';
import {CardMetadata} from './CardMetadata';
import {CardRequirementDescriptor} from './CardRequirementDescriptor';
import {CountableVictoryPoints} from './CountableVictoryPoints';
import {Tag} from './Tag';
import {CardDiscount} from './Types';
import {OneOrArray} from '../utils/types';

export type ClientCard = {
  name: CardName;
  module: GameModule;
  tags: Array<Tag>;
  cardDiscount?: OneOrArray<CardDiscount>;
  victoryPoints?: number | 'special' | CountableVictoryPoints,
  cost?: number;
  type: CardType;
  requirements: Array<CardRequirementDescriptor>;
  metadata: CardMetadata;
  productionBox?: Units; // Replace with behavior?
  resourceType?: CardResource;
  startingMegaCredits?: number; // Corporation and Prelude
  cardCost?: number; // Corporation
  compatibility: Array<Expansion>;
  hasAction: boolean; // For Prelude 2 preludes with actions. Can be used for more, of course.
}
