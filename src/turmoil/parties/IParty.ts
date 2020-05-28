import { PartyName } from "./PartyName";
import { Player } from '../../Player';
import { Game } from '../../Game';


export interface IParty {
    name: PartyName;
    description: string;
    delegates: Array<Player | "NEUTRAL">;
    partyLeader: undefined | Player | "NEUTRAL";
    sendDelegate: (player: Player | "NEUTRAL", game: Game) => void;
    removeDelegate: (player: Player | "NEUTRAL", game: Game) => void;
    rulingBonus: (game: Game) => void;
    //rulingPolicy: (player: Player, game: Game) => void;
    getPresentPlayers(): Array<Player | "NEUTRAL">;
    getDelegates:(player: Player | "NEUTRAL") => number;
}