import { IParty } from "./parties/IParty";
import { GlobalEventDealer } from "./globalEvents/GlobalEventDealer";
import { IGlobalEvent } from "./globalEvents/IGlobalEvent";
import { PlayerId } from "../Player";

export interface SerializedTurmoil {
    chairman: undefined | PlayerId | "NEUTRAL";
    rulingParty: undefined | IParty;
    dominantParty: undefined | IParty;
    lobby: Set<string>;
    delegate_reserve: Array<PlayerId | "NEUTRAL">;
    parties: Array<IParty>;
    playersInfluenceBonus: Map<string, number>;
    globalEventDealer: GlobalEventDealer;
    distantGlobalEvent: IGlobalEvent | undefined;
    commingGlobalEvent: IGlobalEvent | undefined;
    currentGlobalEvent: IGlobalEvent | undefined;
}
