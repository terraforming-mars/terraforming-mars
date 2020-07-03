import { PartyName } from "./PartyName";
import { PlayerId } from "../../Player";
import { Game } from '../../Game';


export interface IParty {
    name: PartyName;
    description: string;
    delegates: Array<PlayerId | "NEUTRAL">;
    partyLeader: undefined | PlayerId | "NEUTRAL";
    sendDelegate: (playerId: PlayerId | "NEUTRAL", game: Game) => void;
    removeDelegate: (playerId: PlayerId | "NEUTRAL", game: Game) => void;
    rulingBonus: (game: Game) => void;
    getPresentPlayers(): Array<PlayerId | "NEUTRAL">;
    getDelegates:(player: PlayerId | "NEUTRAL") => number;
}