import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Turmoil } from '../Turmoil';

export interface IGlobalEvent {
    name: GlobalEventName;
    description: string;
    revealedDelegate: PartyName;
    currentDelegate: PartyName;
    resolve: (game: Game, turmoil: Turmoil) => void;
}