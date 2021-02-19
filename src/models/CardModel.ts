import {Message} from '../Message';
import {CardType} from '../cards/CardType';
import {ResourceType} from '../ResourceType';
import {Units} from '../Units';
import {CardName} from '../CardName';
import {CardDiscount} from '../cards/ICard';
import {OwnerModel} from './PlayerModel';

export interface CardModel {
    name: CardName;
    resources: number | undefined;
    resourceType: ResourceType | undefined;
    calculatedCost?: number;
    discount?: CardDiscount,
    cardType: CardType;
    isDisabled: boolean;
    warning?: string | Message;
    reserveUnits: Readonly<Units>;
    owner?: OwnerModel;
}
