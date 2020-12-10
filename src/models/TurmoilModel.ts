
import {Color} from '../Color';
import {PartyName} from '../turmoil/parties/PartyName';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {PolicyId} from '../turmoil/Policy';
import {BonusId} from '../turmoil/Bonus';

export interface TurmoilModel {
    dominant: PartyName | undefined;
    ruling: PartyName | undefined;
    chairman: Color | undefined;
    parties: Array<PartyModel>;
    lobby: Array<Color>;
    reserve: Array<DelegatesModel>;
    distant: GlobalEventModel | undefined;
    // TODO(kberg): rename to coming.
    comming: GlobalEventModel | undefined;
    current: GlobalEventModel | undefined;
    staticAgendas: PoliticalAgendasModel | undefined;
}

export interface PartyModel {
    name: PartyName;
    description: string;
    partyLeader: Color | undefined;
    delegates: Array<DelegatesModel>;
}

export interface DelegatesModel {
    color: Color;
    number: number;
}

export interface GlobalEventModel {
    name: GlobalEventName;
    description: string;
    revealed: PartyName;
    current: PartyName;
}

export interface PoliticalAgendasModel {
    marsFirstPolicy: PolicyId;
    marsFirstBonus: BonusId;
    scientistsPolicy: PolicyId;
    scientistsBonus: BonusId;
    unityPolicy: PolicyId;
    unityBonus: BonusId;
    greensPolicy: PolicyId;
    greensBonus: BonusId;
    redsPolicy: PolicyId;
    redsBonus: BonusId;
    kelvinistsPolicy: PolicyId;
    kelvinistsBonus: BonusId;
}
