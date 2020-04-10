import { PartyName } from "./PartyName";
import { Player } from '../../Player';
import { Game } from '../../Game';


export interface IParty {
    name: PartyName;
    description: string;
    delegates: Array<Player>;
    partyLeader: undefined | Player;
    sendDelegate: (player: Player) => void;
    rulingBonus: (game: Game) => void;
    //rulingPolicy: (player: Player, game: Game) => void;
    becomesRulingParty: () => void;
}