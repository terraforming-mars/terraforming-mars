import {Bonus} from './Bonus';
import {PartyName} from './parties/PartyName';
import {Policy} from './Policy';

export enum AgendaStyle {
  STANDARD,
  RANDOM, // TODO: Implement
  CHAIRMAN // TODO: Implement
}

export interface Agenda {
  partyName: PartyName;
  definedBonus: Bonus;
  definedPolicy: Policy | undefined;
}

export interface PoliticalAgendasData {
  agendas: Array<Agenda>;
}
