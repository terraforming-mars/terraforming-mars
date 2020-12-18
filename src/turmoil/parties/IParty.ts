import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {PlayerIdOrNeutral} from '../Turmoil';


export interface IParty {
    name: PartyName;
    description: string;
    delegates: Array<PlayerIdOrNeutral>;
    partyLeader: undefined | PlayerIdOrNeutral;
    sendDelegate: (playerId: PlayerIdOrNeutral, game: Game) => void;
    removeDelegate: (playerId: PlayerIdOrNeutral, game: Game) => void;
    rulingBonus: (game: Game) => void;
    getPresentPlayers(): Array<PlayerIdOrNeutral>;
    getDelegates:(player: PlayerIdOrNeutral) => number;
}
