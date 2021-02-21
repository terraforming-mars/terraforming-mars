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
  // Standard and Random agendas are static through the game. CHAIRMAN changes
  // by the will of the chairperson, so when staticAgendas is undefined, that means
  // it's the CHAIRMAN agenda style
  staticAgendas: Map<PartyName, Agenda> | undefined;

  // Agendas will always be populated, even if the current agenda is the chairman.
  agendas: Map<PartyName, Agenda>;
  agendaStyle: AgendaStyle;
}

export interface SerializedPoliticalAgendasData {
  currentAgenda: Agenda;
  staticAgendas: Array<[PartyName, Agenda]> | undefined;
  // Replacing staticAgendas and currentAgenda with agendas, eventually.
  agendas: Array<[PartyName, Agenda]> | undefined;
  agendaStyle: AgendaStyle | undefined;
}

export class PoliticalAgendas {
  public static randomElement = PoliticalAgendas.defaultRandomElement;

  public static newInstance(
    agendaStyle: AgendaStyle,
    parties: Array<IParty>,
    firstRulingParty: IParty): PoliticalAgendasData {
    const agendas: Map<PartyName, Agenda> = new Map();
    parties.forEach((p) => {
      if (agendaStyle === AgendaStyle.STANDARD) {
        agendas.set(p.name, {bonusId: p.bonuses[0].id, policyId: p.policies[0].id});
      } else {
        agendas.set(p.name, PoliticalAgendas.getRandomAgenda(p));
      }
    });

    if (agendaStyle === AgendaStyle.CHAIRMAN) {
      return {
        // First chairman will always be neutral, so get a random agenda.
        currentAgenda: PoliticalAgendas.getRandomAgenda(firstRulingParty),
        staticAgendas: undefined,
        agendas: agendas,
        agendaStyle: agendaStyle,
      };
    } else {
      const firstAgenda = agendas.get(firstRulingParty.name);
      if (firstAgenda === undefined) {
        throw new Error('No static agenda for party ' + firstRulingParty.name);
      }
      return {
        currentAgenda: firstAgenda,
        staticAgendas: agendas,
        agendas: agendas,
        agendaStyle: agendaStyle,
      };
    }
  }

  private static getRandomAgenda(party: IParty): Agenda {
    const bonus: Bonus = PoliticalAgendas.randomElement(party.bonuses);
    const policy: Policy = PoliticalAgendas.randomElement(party.policies);

    return {bonusId: bonus.id, policyId: policy.id};
  }

  // The ruling party is already in power, and now it is time for the party to select an agenda.
  // Do not expect the method to return an activated agenda if the current agenda style is chairman
  // And a person is the chairman -- the end of this method will just defer selection until later.
  public static setNextAgenda(turmoil: Turmoil, game: Game): void {
    const rulingParty = turmoil.rulingParty;
    const politicalAgendasData = turmoil.politicalAgendasData;
    const chairman: string = turmoil.chairman as string;
    const nextAgenda = this.getDeterministicAgenda(rulingParty, chairman, politicalAgendasData);
    if (nextAgenda !== undefined) {
      politicalAgendasData.currentAgenda = nextAgenda;
      turmoil.onAgendaSelected(game);
    } else {
      // Only called when player !== neutral and agenda style === chairman
      game.defer(new ChoosePoliticalAgenda(game.getPlayerById(chairman), rulingParty, turmoil));
    }
  }

  // Getting the agenda most of the time is pretty simple - there's a simple algorithm.
  // However, when agendaStyle is CHAIRMAN, the agenda is only known after a callback.
  private static getDeterministicAgenda(
    rulingParty: IParty,
    chairman: PlayerId | 'NEUTRAL',
    politicalAgendasData: PoliticalAgendasData): Agenda | undefined {
    if (politicalAgendasData.agendaStyle === AgendaStyle.CHAIRMAN) {
      if (chairman === 'NEUTRAL') {
        return PoliticalAgendas.getRandomAgenda(rulingParty);
      } else {
        return undefined;
      }
    } else {
      if (politicalAgendasData.staticAgendas === undefined) {
        throw new Error('static agendas should be defined when agenda style is ' + politicalAgendasData.agendaStyle);
      }
      const agenda = politicalAgendasData.staticAgendas.get(rulingParty.name);
      if (agenda === undefined) {
        throw new Error('No static agenda for party ' + rulingParty.name);
      }
      return agenda;
    }
  }

  public static serialize(agenda: PoliticalAgendasData): SerializedPoliticalAgendasData {
    return {
      currentAgenda: agenda.currentAgenda,
      staticAgendas: agenda.staticAgendas === undefined ? undefined : Array.from(agenda.staticAgendas.entries()),
      agendaStyle: agenda.agendaStyle,
      agendas: Array.from(agenda.agendas.entries()),
    };
  }

  public static deserialize(d: SerializedPoliticalAgendasData): PoliticalAgendasData {
    if (d.agendaStyle === undefined) {
      if (d.staticAgendas !== undefined) {
        return {
          currentAgenda: d.currentAgenda,
          staticAgendas: new Map(d.staticAgendas),
          agendas: new Map(d.staticAgendas),
          agendaStyle: AgendaStyle.CHAIRMAN,
        };
      }
      return {
        currentAgenda: d.currentAgenda,
        staticAgendas: undefined,
        agendas: new Map(), // An empty map for a legacy game is fine.
        agendaStyle: AgendaStyle.STANDARD, // Defaulting to STANDARD isn't great, but it'll do the job correctly.
      };
    }

    // Agenda style is stored, which means all four fields are populated.
    switch (d.agendaStyle) {
    case AgendaStyle.STANDARD:
    case AgendaStyle.RANDOM:
      return {
        currentAgenda: d.currentAgenda,
        staticAgendas: new Map(d.staticAgendas),
        agendas: new Map(d.agendas),
        agendaStyle: d.agendaStyle,
      };

    case AgendaStyle.CHAIRMAN:
      return {
        currentAgenda: d.currentAgenda,
        staticAgendas: undefined,
        agendas: new Map(d.agendas),
        agendaStyle: d.agendaStyle,
      };
    }
  }

  // Overridable for tests
  public static defaultRandomElement<T>(list: Array<T>): T {
    const rng = Math.floor(Math.random() * list.length);
    return list[rng];
  }
}
