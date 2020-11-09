import {IProjectCard} from './cards/IProjectCard';

export interface SerializedDealer {
    deck: Array<IProjectCard>;
    preludeDeck: Array<IProjectCard>;
    discarded: Array<IProjectCard>;
    usePreludeExtension: boolean;
    useVenusNextExtension: boolean;
    useColoniesNextExtension: boolean;
}
