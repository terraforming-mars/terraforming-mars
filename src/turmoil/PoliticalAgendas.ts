import {Bonus, BonusId} from './Bonus';
import {IParty} from './parties/IParty';
import {PartyName} from './parties/PartyName';
import {Policy, PolicyId} from './Policy';

export enum AgendaStyle {
  STANDARD = 'Standard',
  RANDOM = 'Random',
  CHAIRMAN = 'Chairman' // TODO: Implement
}

export interface Agenda {
  bonusId: BonusId;
  policyId: PolicyId;
}

export interface PoliticalAgendasData {
  // The agenda for this generation.
  thisAgenda: Agenda;
  // Standard and Random agendas are static through the game. CHAIRMAN changes
  // by the will of the chairperson.
  staticAgendas: Map<PartyName, Agenda> | undefined;
}

export class PoliticalAgendas {
  public static newInstance(agendaStyle: AgendaStyle, parties: Array<IParty>, firstRulingParty: IParty | undefined): PoliticalAgendasData {
    if (firstRulingParty === undefined) {
      throw new Error('unexpected initialization issue: first ruling party is undefined');
    }
    const staticAgendas = this.selectStaticAgendas(agendaStyle, parties);
    return {
      thisAgenda: this.getAgenda(firstRulingParty, staticAgendas),
      staticAgendas: staticAgendas,
    };
  }

  private static selectStaticAgendas(agendaStyle: AgendaStyle, parties: Array<IParty>): Map<PartyName, Agenda> | undefined {
    if (agendaStyle === AgendaStyle.CHAIRMAN) {
      return undefined;
    }

    const staticAgendas = new Map();
    parties.forEach((p) => {
      const bonuses = p.bonuses;
      const policies = p.policies;

      const bonus: Bonus = agendaStyle === AgendaStyle.STANDARD ? bonuses[0] : bonuses[Math.floor(Math.random() * bonuses.length)];
      const policy: Policy = agendaStyle === AgendaStyle.STANDARD ? policies[0] : policies[Math.floor(Math.random() * policies.length)];
      staticAgendas.set(p.name, {bonusId: bonus.id, policyId: policy.id} as Agenda);
    });

    return staticAgendas;
  }

  private static getAgenda(rulingParty: IParty, staticAgendas: Map<PartyName, Agenda> | undefined): Agenda {
    if (staticAgendas === undefined) {
      return {
        bonusId: rulingParty.bonuses[0].id,
        policyId: rulingParty.policies[0].id,
      };
    } else {
      const agenda = staticAgendas.get(rulingParty.name);
      if (agenda === undefined) {
        throw new Error('No static agenda for party ' + rulingParty.name);
      }
      return agenda;
    }
  }

  static setAgenda(rulingParty: IParty, politicalAgendasData: PoliticalAgendasData): void {
    const newAgenda = this.getAgenda(rulingParty, politicalAgendasData.staticAgendas);
    politicalAgendasData.thisAgenda = newAgenda;
  }
}
