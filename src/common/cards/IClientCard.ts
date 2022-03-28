import {Message} from '../logs/Message';
import {ResourceType} from '../ResourceType';
import {Units} from '../Units';
import {CardName} from './CardName';
import {CardType} from './CardType';
import {ICardMetadata} from './ICardMetadata';
import {ICardRequirements} from './ICardRequirements';
import {IVictoryPoints} from './IVictoryPoints';
import {Tags} from './Tags';
import {ICardDiscount} from './Types';

export interface IClientCard {
  name: CardName;
  tags: Array<Tags>;
  cardDiscount?: ICardDiscount | Array<ICardDiscount>;
  victoryPoints?: number | 'special' | IVictoryPoints,
  cost?: number;
  cardType: CardType;
  requirements?: ICardRequirements;
  metadata: ICardMetadata;
  warning?: string | Message;
  productionBox?: Units;
  resourceType?: ResourceType;
  startingMegaCredits?: number; // Corporation Card
  cardCost?: number; // Corporation Card
}
