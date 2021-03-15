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
    const turmoil = game.turmoil;
    let chairman; let dominant; let ruling;

    if (turmoil.chairman) {
      if (turmoil.chairman === 'NEUTRAL') {
        chairman = Color.NEUTRAL;
      } else {
        chairman = game.getPlayerById(turmoil.chairman).color;
      }
    }
    if (turmoil.dominantParty) {
      dominant = turmoil.dominantParty.name;
    }
    if (turmoil.rulingParty) {
      ruling = turmoil.rulingParty.name;
    }

    const lobby = Array.from(
      turmoil.lobby,
      (player) => game.getPlayerById(player).color,
    );

    const reserve = turmoil.getPresentPlayers().map((player) => {
      const number = turmoil.getDelegatesInReserve(player);
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
    if (turmoil.distantGlobalEvent) {
      distant = {
        name: turmoil.distantGlobalEvent.name,
        description: turmoil.distantGlobalEvent.description,
        revealed: turmoil.distantGlobalEvent.revealedDelegate,
        current: turmoil.distantGlobalEvent.currentDelegate,
      };
    }

    let coming;
    if (turmoil.comingGlobalEvent) {
      coming = {
        name: turmoil.comingGlobalEvent.name,
        description: turmoil.comingGlobalEvent.description,
        revealed: turmoil.comingGlobalEvent.revealedDelegate,
        current: turmoil.comingGlobalEvent.currentDelegate,
      };
    }

    let current;
    if (turmoil.currentGlobalEvent) {
      current = {
        name: turmoil.currentGlobalEvent.name,
        description: turmoil.currentGlobalEvent.description,
        revealed: turmoil.currentGlobalEvent.revealedDelegate,
        current: turmoil.currentGlobalEvent.currentDelegate,
      };
    }

    const staticAgendas = turmoil.politicalAgendasData.staticAgendas;
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

    const policyActionUsers = Array.from(
      game.getPlayers(),
      (player) => {
        return {
          color: player.color,
          turmoilPolicyActionUsed: player.turmoilPolicyActionUsed,
          politicalAgendasActionUsedCount: player.politicalAgendasActionUsedCount} as PolicyUser;
      },
    );

    return {
      chairman: chairman,
      ruling: ruling,
      dominant: dominant,
      parties: parties,
      lobby: lobby,
      reserve: reserve,
      distant: distant,
      coming: coming,
      current: current,
      politicalAgendas: {
        currentAgenda: turmoil.politicalAgendasData.currentAgenda,
        staticAgendas: staticAgendasModel,
      },
      policyActionUsers,
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
