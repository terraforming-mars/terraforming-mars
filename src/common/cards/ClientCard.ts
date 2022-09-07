import {Message} from '../logs/Message';
import {CardResource} from '../CardResource';
import {Units} from '../Units';
import {CardName} from './CardName';
import {CardType} from './CardType';
import {GameModule} from './GameModule';
import {ICardMetadata} from './ICardMetadata';
import {ICardRequirements} from './ICardRequirements';
import {IVictoryPoints} from './IVictoryPoints';
import {Tag} from './Tag';
import {CardDiscount} from './Types';

export type ClientCard = {
  name: CardName;
  module: GameModule;
  tags: Array<Tag>;
  cardDiscount?: CardDiscount | Array<CardDiscount>;
  victoryPoints?: number | 'special' | IVictoryPoints,
  cost?: number;
  cardType: CardType;
  requirements?: ICardRequirements;
  metadata: ICardMetadata;
  warning?: string | Message;
  productionBox?: Units; // Replace with behavior?
  resourceType?: CardResource;
  startingMegaCredits?: number; // Corporation and Prelude
  cardCost?: number; // Corporation
  compatibility: Array<GameModule>;
}
