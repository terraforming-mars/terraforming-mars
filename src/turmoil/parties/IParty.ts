import { PartyName } from "./PartyName";
import { Player } from '../../Player';
import { Game } from '../../Game';


export interface IParty {
    name: PartyName;
    description: string;
    delegates: Array<Player | "NEUTRAL">;
    partyLeader: undefined | Player | "NEUTRAL";
    sendDelegate: (player: Player | "NEUTRAL") => void;
    rulingBonus: (game: Game) => void;
    //rulingPolicy: (player: Player, game: Game) => void;
    becomesRulingParty: () => void;
    getDelegates:(player: Player) => number;
}