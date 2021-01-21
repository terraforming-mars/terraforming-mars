import {ChoosePoliticalAgenda} from '../deferredActions/ChoosePoliticaAgenda';
import {Game} from '../Game';
import {PlayerId} from '../Player';
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
  // The agenda for this generation.
  currentAgenda: Agenda;
  staticAgendas: Map<PartyName, Agenda> | undefined;
  agendaStyle: AgendaStyle;
}

export interface SerializedPoliticalAgendasData {
  currentAgenda: Agenda;
  staticAgendas: Array<[PartyName, Agenda]> | undefined;
  agendaStyle: AgendaStyle;
}

export class PoliticalAgendas {
  public static newInstance(
    agendaStyle: AgendaStyle,
    parties: Array<IParty>,
    firstRulingParty: IParty): PoliticalAgendasData {
    const staticAgendas: Map<PartyName, Agenda> = new Map();

    parties.forEach((p) => {
      if (agendaStyle === AgendaStyle.STANDARD) {
        staticAgendas.set(p.name, {bonusId: p.bonuses[0].id, policyId: p.policies[0].id});
      } else {
        staticAgendas.set(p.name, PoliticalAgendas.getRandomAgenda(p));
      }
    });

    const firstAgenda = staticAgendas.get(firstRulingParty.name);
    if (firstAgenda === undefined) {
      throw new Error('No static agenda for party ' + firstRulingParty.name);
    }

    return {
      currentAgenda: firstAgenda,
      staticAgendas: staticAgendas,
      agendaStyle: agendaStyle,
    };
  }

  private static getRandomAgenda(party: IParty): Agenda {
    function randomElement<T>(list: Array<T>): T {
      const rng = Math.floor(Math.random() * list.length);
      return list[rng];
    }

    const bonus: Bonus = randomElement(party.bonuses);
    const policy: Policy = randomElement(party.policies);

    return {bonusId: bonus.id, policyId: policy.id};
  }

  // The ruling party is already in power, and now it is time for the party to select an agenda.
  // Do not expect the method to return an activated agenda if the current agenda style is chairman
  // And a person is the chairman -- the end of this method will just defer selection until later.
  static setNextAgenda(turmoil: Turmoil, game: Game, agendaStyle: AgendaStyle = AgendaStyle.STANDARD): void {
    const rulingParty = turmoil.rulingParty;
    const politicalAgendasData = turmoil.politicalAgendasData;
    const chairman: string = turmoil.chairman as string;

    if (agendaStyle !== AgendaStyle.CHAIRMAN) {
      politicalAgendasData.currentAgenda = this.getDeterministicAgenda(rulingParty, politicalAgendasData.staticAgendas, chairman, agendaStyle);
      turmoil.onAgendaSelected(game);
    } else {
      game.defer(new ChoosePoliticalAgenda(game.getPlayerById(chairman), rulingParty, turmoil));
    }
  }

  private static getDeterministicAgenda(
    rulingParty: IParty,
    staticAgendas: Map<PartyName, Agenda> | undefined,
    chairman: PlayerId | 'NEUTRAL',
    agendaStyle: AgendaStyle): Agenda {
    if (agendaStyle !== AgendaStyle.STANDARD && chairman === 'NEUTRAL' || staticAgendas === undefined) {
      return PoliticalAgendas.getRandomAgenda(rulingParty);
    } else {
      const agenda = staticAgendas.get(rulingParty.name);
      if (agenda === undefined) {
        throw new Error('No static agenda for party ' + rulingParty.name);
      }
      return agenda;
    }
  }

  public static serialize(agenda: PoliticalAgendasData): SerializedPoliticalAgendasData {
    return {
      currentAgenda: agenda.currentAgenda,
      staticAgendas: agenda.staticAgendas === undefined ?
        undefined :
        Array.from(agenda.staticAgendas.entries()),
      agendaStyle: agenda.agendaStyle,
    };
  }

  public static deserialize(d: SerializedPoliticalAgendasData | undefined, turmoil: Turmoil): PoliticalAgendasData {
    if (d === undefined) {
      return PoliticalAgendas.newInstance(AgendaStyle.STANDARD, turmoil.parties, turmoil.rulingParty);
    }

    if (d.staticAgendas !== undefined) {
      return {
        currentAgenda: d.currentAgenda,
        staticAgendas: new Map(d.staticAgendas),
        agendaStyle: d.agendaStyle,
      };
    }
    return {
      currentAgenda: d.currentAgenda,
      staticAgendas: undefined,
      agendaStyle: d.agendaStyle,
    };
  }
}
