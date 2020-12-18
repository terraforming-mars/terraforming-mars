import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {PlayerId} from '../../Player';
import {NeutralPlayer} from '../Turmoil';


export interface IParty {
    name: PartyName;
    description: string;
    delegates: Array<PlayerId | NeutralPlayer>;
    partyLeader: undefined | PlayerId | NeutralPlayer;
    sendDelegate: (playerId: PlayerId | NeutralPlayer, game: Game) => void;
    removeDelegate: (playerId: PlayerId | NeutralPlayer, game: Game) => void;
    rulingBonus: (game: Game) => void;
    getPresentPlayers(): Array<PlayerId | NeutralPlayer>;
    getDelegates:(player: PlayerId | NeutralPlayer) => number;
}
