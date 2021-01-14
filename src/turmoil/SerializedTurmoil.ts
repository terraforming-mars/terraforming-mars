import {IParty} from './parties/IParty';
import {GlobalEventDealer} from './globalEvents/GlobalEventDealer';
import {IGlobalEvent} from './globalEvents/IGlobalEvent';
import {GlobalEventName} from './globalEvents/GlobalEventName';
import {PartyName} from './parties/PartyName';
import {SerializedGlobalEventDealer} from './globalEvents/SerializedGlobalEventDealer';
import {SerializedPoliticalAgendasData} from './PoliticalAgendas';
import {NeutralPlayer} from './Turmoil';
import {PlayerId} from '../Player';

export interface SerializedParty {
    name: PartyName;
    delegates: Array<PlayerId | NeutralPlayer>;
    partyLeader: undefined | PlayerId | NeutralPlayer;
}

// TODO(kberg): By 2021-01-15, remove delegeate_reserve, commingGlobalEvent, and uses
// of IParty, GlobalEventDealer, and IGlobalEvent.
export interface SerializedTurmoil {
    chairman: undefined | PlayerId | NeutralPlayer;
    rulingParty: IParty | PartyName;
    dominantParty: IParty | PartyName;
    lobby: Array<string>;
    delegate_reserve: Array<PlayerId | NeutralPlayer>; // eslint-disable-line camelcase
    delegateReserve: Array<PlayerId | NeutralPlayer> | undefined;
    parties: Array<IParty | SerializedParty>;
    playersInfluenceBonus: Array<[string, number]>;
    globalEventDealer: GlobalEventDealer | SerializedGlobalEventDealer;
    distantGlobalEvent: IGlobalEvent | GlobalEventName | undefined;
    commingGlobalEvent: IGlobalEvent | undefined;
    comingGlobalEvent: GlobalEventName | undefined;
    currentGlobalEvent?: IGlobalEvent | GlobalEventName;
    politicalAgendasData: SerializedPoliticalAgendasData | undefined;
}
