import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

export interface IGlobalEvent {
    name: GlobalEventName;
    description: string;
    revealedDelegate: PartyName;
    currentDelegate: PartyName;
    renderData: CardRenderer;
    resolve: (game: Game, turmoil: Turmoil) => void;
}
