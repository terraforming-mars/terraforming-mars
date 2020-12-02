import {IParty} from './parties/IParty';
import {GlobalEventDealer} from './globalEvents/GlobalEventDealer';
import {IGlobalEvent} from './globalEvents/IGlobalEvent';
import {PlayerId} from '../Player';
import {PartyName} from './parties/PartyName';

export interface SerializedTurmoil {
    chairman: undefined | PlayerId | 'NEUTRAL';
    // TODO(kberg): Remove by end of year.
    rulingParty: undefined | IParty;
    rulingPartyName: undefined | PartyName;
    // TODO(kberg): Remove by end of year.
    dominantParty: undefined | IParty;
    dominantPartyName: undefined | PartyName;
    lobby: Array<PlayerId>;
    // TODO(kberg): Remove by end of year.
    delegate_reserve: Array<PlayerId | 'NEUTRAL'>; // eslint-disable-line camelcase
    delegateReserve: Array<PlayerId | 'NEUTRAL'> | undefined;
    parties: Array<IParty>;
    playersInfluenceBonus: Array<[string, number]>;
    globalEventDealer: GlobalEventDealer;
    distantGlobalEvent: IGlobalEvent | undefined;
    comingGlobalEvent: IGlobalEvent | undefined;
    // TODO(kberg): Remove by end of year.
    commingGlobalEvent: IGlobalEvent | undefined;
    currentGlobalEvent?: IGlobalEvent;
}
