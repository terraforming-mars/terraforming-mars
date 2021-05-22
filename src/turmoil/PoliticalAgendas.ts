import {ChoosePoliticalAgenda} from '../deferredActions/ChoosePoliticalAgenda';
import {Game} from '../Game';
import {Bonus, BonusId} from './Bonus';
import {IParty} from './parties/IParty';
import {PartyName} from './parties/PartyName';
import {Policy, PolicyId} from './Policy';
import {Turmoil} from './Turmoil';

export enum AgendaStyle {
  STANDARD = 'Standard',
  RANDOM = 'Random',
  CHAIRMAN = 'Chairman',
}

export interface Agenda {
  bonusId: BonusId;
  policyId: PolicyId;
}

export interface PoliticalAgendasData {
  agendas: Map<PartyName, Agenda>;
  agendaStyle: AgendaStyle;
}

export interface SerializedPoliticalAgendasData {
  agendas: Array<[PartyName, Agenda]>;
  agendaStyle: AgendaStyle;
}

export class PoliticalAgendas {
  public static randomElement = PoliticalAgendas.defaultRandomElement;

  public static newInstance(
    agendaStyle: AgendaStyle,
    parties: Array<IParty>): PoliticalAgendasData {
    const agendas: Map<PartyName, Agenda> = new Map();

    parties.forEach((p) => {
      if (agendaStyle === AgendaStyle.STANDARD) {
        agendas.set(p.name, {bonusId: p.bonuses[0].id, policyId: p.policies[0].id});
      } else {
        agendas.set(p.name, PoliticalAgendas.getRandomAgenda(p));
      }
    });

    return {
      agendas: agendas,
      agendaStyle: agendaStyle,
    };
  }

  private static getRandomAgenda(party: IParty): Agenda {
    const bonus: Bonus = PoliticalAgendas.randomElement(party.bonuses);
    const policy: Policy = PoliticalAgendas.randomElement(party.policies);

    return {bonusId: bonus.id, policyId: policy.id};
  }

  public static currentAgenda(turmoil: Turmoil): Agenda {
    return this.getAgenda(turmoil, turmoil.rulingParty.name);
  }

  public static getAgenda(turmoil: Turmoil, partyName: PartyName): Agenda {
    const agenda = turmoil.politicalAgendasData.agendas.get(partyName);
    if (agenda === undefined) {
      throw new Error('Invalid party: ' + partyName);
    }
    return agenda;
  };

  // The ruling party is already in power, and now it is time for the party to select an agenda.
  // Do not expect the method to return an activated agenda if the current agenda style is chairman
  // And a person is the chairman -- the end of this method will just defer selection until later.
  public static setNextAgenda(turmoil: Turmoil, game: Game): void {
    const rulingParty = turmoil.rulingParty;
    const politicalAgendasData = turmoil.politicalAgendasData;
    const chairman = turmoil.chairman;
    if (chairman === undefined) {
      throw new Error('Chairman not defined');
    }

    // Agendas are static unless it's chosen by a chairperson, in which case
    // defer the selection.
    if (politicalAgendasData.agendaStyle === AgendaStyle.CHAIRMAN && chairman !== 'NEUTRAL') {
      const agenda = this.getAgenda(turmoil, rulingParty.name);
      game.defer(new ChoosePoliticalAgenda(
        game.getPlayerById(chairman),
        rulingParty,
        (bonusId) => {
          agenda.bonusId = bonusId;
          turmoil.onAgendaSelected(game);
        },
        (policyId) => {
          agenda.policyId = policyId;
          turmoil.onAgendaSelected(game);
        }));
    } else {
      turmoil.onAgendaSelected(game);
    }
  }

  public static serialize(agenda: PoliticalAgendasData): SerializedPoliticalAgendasData {
    return {
      agendas: Array.from(agenda.agendas.entries()),
      agendaStyle: agenda.agendaStyle,
    };
  }

  public static deserialize(d: SerializedPoliticalAgendasData): PoliticalAgendasData {
    return {
      agendas: new Map(d.agendas),
      agendaStyle: d.agendaStyle,
    };
  }

  // Overridable for tests
  public static defaultRandomElement<T>(list: Array<T>): T {
    const rng = Math.floor(Math.random() * list.length);
    return list[rng];
  }
}
