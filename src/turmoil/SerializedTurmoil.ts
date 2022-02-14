import {GlobalEventName} from '../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../common/turmoil/PartyName';
import {SerializedGlobalEventDealer} from './globalEvents/SerializedGlobalEventDealer';
import {SerializedPoliticalAgendasData} from './PoliticalAgendas';
import {NeutralPlayer} from './Turmoil';
import {PlayerId} from '../common/Types';

export interface SerializedParty {
    name: PartyName;
    delegates: Array<PlayerId | NeutralPlayer>;
    partyLeader: undefined | PlayerId | NeutralPlayer;
}

export interface SerializedTurmoil {
    chairman: undefined | PlayerId | NeutralPlayer;
    rulingParty: PartyName;
    dominantParty: PartyName;
    lobby: Array<string>;
    delegateReserve: Array<PlayerId | NeutralPlayer>;
    parties: Array<SerializedParty>;
    playersInfluenceBonus: Array<[string, number]>;
    globalEventDealer: SerializedGlobalEventDealer;
    distantGlobalEvent: GlobalEventName | undefined;
    comingGlobalEvent: GlobalEventName | undefined;
    currentGlobalEvent?: GlobalEventName;
    politicalAgendasData: SerializedPoliticalAgendasData;
}
