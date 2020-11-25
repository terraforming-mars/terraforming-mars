import {IParty} from './parties/IParty';
import {GlobalEventDealer} from './globalEvents/GlobalEventDealer';
import {IGlobalEvent} from './globalEvents/IGlobalEvent';
import {PlayerId} from '../Player';
import {PoliticalAgendasData} from './PoliticalAgendasData';

export interface SerializedTurmoil {
    chairman: undefined | PlayerId | 'NEUTRAL';
    rulingParty: undefined | IParty;
    dominantParty: undefined | IParty;
    lobby: Array<string>;
    delegate_reserve: Array<PlayerId | 'NEUTRAL'>; // eslint-disable-line camelcase
    parties: Array<IParty>;
    playersInfluenceBonus: Array<[string, number]>;
    globalEventDealer: GlobalEventDealer;
    distantGlobalEvent: IGlobalEvent | undefined;
    commingGlobalEvent: IGlobalEvent | undefined;
    currentGlobalEvent?: IGlobalEvent;
    politicalAgendasData: PoliticalAgendasData;
}
