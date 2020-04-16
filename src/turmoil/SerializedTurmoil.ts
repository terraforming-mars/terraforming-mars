import { Player } from "../Player";
import { IParty } from "./parties/IParty";
import { GlobalEventDealer } from "./globalEvents/GlobalEventDealer";
import { IGlobalEvent } from "./globalEvents/IGlobalEvent";

export interface SerializedTurmoil {
    chairman: undefined | Player | "NEUTRAL";
    rulingParty: undefined | IParty;
    dominantParty: undefined | IParty;
    lobby: Set<Player>;
    delegate_reserve: Array<Player | "NEUTRAL">;
    parties: Array<IParty>;
    playersInfluenceBonus: Map<string, number>;
    globalEventDealer: GlobalEventDealer;
    distantGlobalEvent: IGlobalEvent | undefined;
    commingGlobalEvent: IGlobalEvent | undefined;
    currentGlobalEvent: IGlobalEvent | undefined;
}
