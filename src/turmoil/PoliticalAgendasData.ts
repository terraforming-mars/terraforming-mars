import {Bonus} from './Bonus';
import {PartyName} from './parties/PartyName';
import {Policy} from './Policy';

export enum AgendaStyle {
  STANDARD = 'Standard',
  RANDOM = 'Random', // TODO: Implement
  CHAIRMAN = 'Chairman' // TODO: Implement
}

export interface Agenda {
  partyName: PartyName;
  definedBonus: Bonus;
  definedPolicy: Policy | undefined;
}

export interface PoliticalAgendasData {
  agendas: Array<Agenda>;
}
