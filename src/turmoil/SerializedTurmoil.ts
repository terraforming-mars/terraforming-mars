import {IParty} from './parties/IParty';
import {GlobalEventDealer} from './globalEvents/GlobalEventDealer';
import {IGlobalEvent} from './globalEvents/IGlobalEvent';
import {GlobalEventName} from './globalEvents/GlobalEventName';
import {PartyName} from './parties/PartyName';
import {SerializedGlobalEventDealer} from './globalEvents/SerializedGlobalEventDealer';
import {PlayerIdOrNeutral} from './Turmoil';

export interface SerializedParty {
    name: PartyName;
    delegates: Array<PlayerIdOrNeutral>;
    partyLeader: undefined | PlayerIdOrNeutral;
}

// TODO(kberg): By 2021-01-15, remove delegeate_reserve, commingGlobalEvent, and uses
// of IParty, GlobalEventDealer, and IGlobalEvent.
export interface SerializedTurmoil {
    chairman: undefined | PlayerIdOrNeutral;
    rulingParty: IParty | PartyName;
    dominantParty: IParty | PartyName;
    lobby: Array<string>;
    delegate_reserve: Array<PlayerIdOrNeutral>; // eslint-disable-line camelcase
    delegateReserve: Array<PlayerIdOrNeutral> | undefined;
    parties: Array<IParty | SerializedParty>;
    playersInfluenceBonus: Array<[string, number]>;
    globalEventDealer: GlobalEventDealer | SerializedGlobalEventDealer;
    distantGlobalEvent: IGlobalEvent | GlobalEventName | undefined;
    commingGlobalEvent: IGlobalEvent | undefined;
    comingGlobalEvent: GlobalEventName | undefined;
    currentGlobalEvent?: IGlobalEvent | GlobalEventName;
}
