import {Color} from '../Color';
import {PartyName} from '../turmoil/PartyName';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {Agenda} from '../turmoil/Types';
export interface TurmoilModel {
  dominant: PartyName | undefined;
  ruling: PartyName | undefined;
  chairman: Color | undefined;
  parties: Array<PartyModel>;
  lobby: Array<Color>;
  reserve: Array<DelegatesModel>;
  distant: GlobalEventModel | undefined;
  coming: GlobalEventModel | undefined;
  current: GlobalEventModel | undefined;
  politicalAgendas: PoliticalAgendasModel | undefined;
  policyActionUsers: Array<PolicyUser>;
}

export interface PolicyUser {
  color: Color;
  turmoilPolicyActionUsed: boolean;
  politicalAgendasActionUsedCount: number;
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
  marsFirst: Agenda;
  scientists: Agenda;
  unity: Agenda;
  greens: Agenda;
  reds: Agenda;
  kelvinists: Agenda;
}
