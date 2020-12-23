import {Color} from '../Color';
import {PartyName} from '../turmoil/parties/PartyName';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {Game} from '../Game';
import {Agenda} from '../turmoil/PoliticalAgendas';

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
  politicalAgendas: PoliticalAgendasModel | undefined;
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
  currentAgenda: Agenda,
  staticAgendas: StaticAgendasModel | undefined
}

export interface StaticAgendasModel {
  marsFirst: Agenda;
  scientists: Agenda;
  unity: Agenda;
  greens: Agenda;
  reds: Agenda;
  kelvinists: Agenda;
}

export function getTurmoil(game: Game): TurmoilModel | undefined {
  if (game.gameOptions.turmoilExtension && game.turmoil) {
    const parties = getParties(game);
    let chairman; let dominant; let ruling;
    if (game.turmoil.chairman) {
      if (game.turmoil.chairman === 'NEUTRAL') {
        chairman = Color.NEUTRAL;
      } else {
        chairman = game.getPlayerById(game.turmoil.chairman).color;
      }
    }
    if (game.turmoil.dominantParty) {
      dominant = game.turmoil.dominantParty.name;
    }
    if (game.turmoil.rulingParty) {
      ruling = game.turmoil.rulingParty.name;
    }

    const lobby = Array.from(
      game.turmoil.lobby,
      (player) => game.getPlayerById(player).color,
    );

    const reserve = game.turmoil.getPresentPlayers().map((player) => {
      const number = game.turmoil!.getDelegates(player);
      if (player !== 'NEUTRAL') {
        return {
          color: game.getPlayerById(player).color,
          number: number,
        };
      } else {
        return {color: Color.NEUTRAL, number: number};
      }
    });

    let distant;
    if (game.turmoil.distantGlobalEvent) {
      distant = {
        name: game.turmoil.distantGlobalEvent.name,
        description: game.turmoil.distantGlobalEvent.description,
        revealed: game.turmoil.distantGlobalEvent.revealedDelegate,
        current: game.turmoil.distantGlobalEvent.currentDelegate,
      };
    }

    let coming;
    if (game.turmoil.comingGlobalEvent) {
      coming = {
        name: game.turmoil.comingGlobalEvent.name,
        description: game.turmoil.comingGlobalEvent.description,
        revealed: game.turmoil.comingGlobalEvent.revealedDelegate,
        current: game.turmoil.comingGlobalEvent.currentDelegate,
      };
    }

    let current;
    if (game.turmoil.currentGlobalEvent) {
      current = {
        name: game.turmoil.currentGlobalEvent.name,
        description: game.turmoil.currentGlobalEvent.description,
        revealed: game.turmoil.currentGlobalEvent.revealedDelegate,
        current: game.turmoil.currentGlobalEvent.currentDelegate,
      };
    }

    const staticAgendas = game.turmoil.politicalAgendasData.staticAgendas;
    const getStaticAgenda = function(partyName: PartyName): Agenda {
      if (staticAgendas === undefined) {
        throw new Error('Trying to resolve static agendas when agendas are dynamic.');
      }
      const agenda = staticAgendas.get(partyName);
      if (agenda === undefined) {
        throw new Error(`Cannot find static agenda for party ${partyName}`);
      }
      return agenda;
    };

    let staticAgendasModel: StaticAgendasModel | undefined;
    if (staticAgendas !== undefined) {
      staticAgendasModel = {
        marsFirst: getStaticAgenda(PartyName.MARS),
        scientists: getStaticAgenda(PartyName.SCIENTISTS),
        unity: getStaticAgenda(PartyName.UNITY),
        greens: getStaticAgenda(PartyName.GREENS),
        reds: getStaticAgenda(PartyName.REDS),
        kelvinists: getStaticAgenda(PartyName.KELVINISTS),
      };
    }

    return {
      chairman: chairman,
      ruling: ruling,
      dominant: dominant,
      parties: parties,
      lobby: lobby,
      reserve: reserve,
      distant: distant,
      comming: coming,
      current: current,
      politicalAgendas: {
        currentAgenda: game.turmoil.politicalAgendasData.currentAgenda,
        staticAgendas: staticAgendasModel,
      },
    };
  } else {
    return undefined;
  }
}

function getParties(game: Game): Array<PartyModel> {
  if (game.gameOptions.turmoilExtension && game.turmoil) {
    return game.turmoil.parties.map(function(party) {
      const delegates: Array<DelegatesModel> = [];
      party.getPresentPlayers().forEach((player) => {
        const number = party.getDelegates(player);
        if (player !== 'NEUTRAL') {
          delegates.push({
            color: game.getPlayerById(player).color,
            number: number,
          });
        } else {
          delegates.push({color: Color.NEUTRAL, number: number});
        }
      });
      let partyLeader;
      if (party.partyLeader) {
        if (party.partyLeader === 'NEUTRAL') {
          partyLeader = Color.NEUTRAL;
        } else {
          partyLeader = game.getPlayerById(party.partyLeader).color;
        }
      }
      return {
        name: party.name,
        description: party.description,
        partyLeader: partyLeader,
        delegates: delegates,
      };
    });
  }
  return [];
}
