import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {LegacySerializedGlobalEventDealer} from './globalEvents/LegacySerializedGlobalEventDealer';
import {SerializedDeck} from '@/server/cards/SerializedDeck';
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
    playersInfluenceBonus: Array<[PlayerId, number]>;
    // TODO(kberg): Remove LegacySerializedGlobalEventDealer by 2027-01-01
    globalEventDealer: SerializedDeck<GlobalEventName> | LegacySerializedGlobalEventDealer;
    distantGlobalEvent: GlobalEventName | undefined;
    comingGlobalEvent: GlobalEventName | undefined;
    currentGlobalEvent?: GlobalEventName;
    politicalAgendasData: SerializedPoliticalAgendasData;
}
