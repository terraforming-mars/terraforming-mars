import {CardName} from './CardName';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {IProjectCard} from './cards/IProjectCard';

export interface SerializedDealer {
    corporationCards: Array<CorporationCard | CardName>;
    deck: Array<IProjectCard | CardName>;
    discarded: Array<IProjectCard | CardName>;
    preludeDeck: Array<IProjectCard | CardName>;
}
