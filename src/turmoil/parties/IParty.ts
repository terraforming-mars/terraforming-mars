import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {PlayerId} from '../../Player';
import {NeutralPlayer} from '../Turmoil';

export interface IParty {
    name: PartyName;
    description: string; // TODO(kberg): fetch description from agenda.
    delegates: Array<PlayerId | NeutralPlayer>;
    partyLeader: undefined | PlayerId | NeutralPlayer;
    sendDelegate: (playerId: PlayerId | NeutralPlayer, game: Game) => void;
    removeDelegate: (playerId: PlayerId | NeutralPlayer, game: Game) => void;
    bonuses: Array<Bonus>;
    policies: Array<Policy>;
    getPresentPlayers(): Array<PlayerId | NeutralPlayer>;
    getDelegates:(player: PlayerId | NeutralPlayer) => number;
}
