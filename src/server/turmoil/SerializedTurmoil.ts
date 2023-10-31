import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {SerializedGlobalEventDealer} from './globalEvents/SerializedGlobalEventDealer';
import {SerializedPoliticalAgendasData} from './PoliticalAgendas';
import {PlayerId} from '../../common/Types';

export type SerializedParty = {
    name: PartyName;
    delegates: Array<SerializedDelegate>;
    partyLeader?: SerializedDelegate;
}

export type SerializedDelegate = PlayerId | 'NEUTRAL';

export type SerializedTurmoil = {
    chairman: undefined | SerializedDelegate;
    rulingParty: PartyName;
    dominantParty: PartyName;
    lobby?: Array<PlayerId>;
    usedFreeDelegateAction: Array<PlayerId>;
    delegateReserve: Array<SerializedDelegate>;
    parties: Array<SerializedParty>;
    playersInfluenceBonus: Array<[string, number]>;
    globalEventDealer: SerializedGlobalEventDealer;
    distantGlobalEvent: GlobalEventName | undefined;
    comingGlobalEvent: GlobalEventName | undefined;
    currentGlobalEvent?: GlobalEventName;
    politicalAgendasData: SerializedPoliticalAgendasData;
}
