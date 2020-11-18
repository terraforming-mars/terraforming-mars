import {PartyName} from './PartyName';
import {PlayerId} from '../../Player';
import {Game} from '../../Game';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';

export interface IParty {
    name: PartyName;
    description: string; // TODO(kberg): fetch description from agenda.
    delegates: Array<PlayerId | 'NEUTRAL'>;
    partyLeader: undefined | PlayerId | 'NEUTRAL';
    sendDelegate: (playerId: PlayerId | 'NEUTRAL', game: Game) => void;
    removeDelegate: (playerId: PlayerId | 'NEUTRAL', game: Game) => void;
    bonuses: Array<Bonus>;
    policies: Array<Policy>;
    getPresentPlayers(): Array<PlayerId | 'NEUTRAL'>;
    getDelegates:(player: PlayerId | 'NEUTRAL') => number;
    activeBonus?: Bonus;
    activePolicy?: Policy;
}
