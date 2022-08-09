import {Color} from '../Color';
import {PartyName} from '../turmoil/PartyName';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {Agenda} from '../turmoil/Types';
export type TurmoilModel = {
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

export type PolicyUser = {
  color: Color;
  turmoilPolicyActionUsed: boolean;
  politicalAgendasActionUsedCount: number;
}

export type PartyModel = {
  name: PartyName;
  description: string;
  partyLeader: Color | undefined;
  delegates: Array<DelegatesModel>;
}

export type DelegatesModel = {
  color: Color;
  number: number;
}

export type GlobalEventModel = {
  name: GlobalEventName;
  description: string;
  revealed: PartyName;
  current: PartyName;
}

export type PoliticalAgendasModel = {
  marsFirst: Agenda;
  scientists: Agenda;
  unity: Agenda;
  greens: Agenda;
  reds: Agenda;
  kelvinists: Agenda;
}
