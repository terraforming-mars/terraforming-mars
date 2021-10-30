import {Color} from '../Color';
import {PartyName} from '../turmoil/parties/PartyName';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {Game} from '../Game';
import {Agenda, PoliticalAgendas} from '../turmoil/PoliticalAgendas';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {Turmoil} from '../turmoil/Turmoil';

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

export function getTurmoilModel(game: Game): TurmoilModel | undefined {
  return Turmoil.ifTurmoilElse(game, (turmoil) => {
    const parties = getParties(game);
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

    const reserve = turmoil.getPresentPlayersInReserve().map((player) => {
      const number = turmoil.getAvailableDelegateCount(player, 'reserve');
      if (player !== 'NEUTRAL') {
        return {
          color: game.getPlayerById(player).color,
          number: number,
        };
      } else {
        return {color: Color.NEUTRAL, number: number};
      }
    });

    const distant = globalEventToModel(turmoil.distantGlobalEvent);
    const coming = globalEventToModel(turmoil.comingGlobalEvent);
    const current = globalEventToModel(turmoil.currentGlobalEvent);

    const politicalAgendas: PoliticalAgendasModel = {
      marsFirst: PoliticalAgendas.getAgenda(turmoil, PartyName.MARS),
      scientists: PoliticalAgendas.getAgenda(turmoil, PartyName.SCIENTISTS),
      unity: PoliticalAgendas.getAgenda(turmoil, PartyName.UNITY),
      greens: PoliticalAgendas.getAgenda(turmoil, PartyName.GREENS),
      reds: PoliticalAgendas.getAgenda(turmoil, PartyName.REDS),
      kelvinists: PoliticalAgendas.getAgenda(turmoil, PartyName.KELVINISTS),
    };

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
      chairman,
      ruling,
      dominant,
      parties,
      lobby,
      reserve,
      distant,
      coming,
      current,
      politicalAgendas,
      policyActionUsers,
    };
  },
  () => undefined);
}

function globalEventToModel(globalEvent: IGlobalEvent | undefined): GlobalEventModel | undefined {
  if (globalEvent === undefined) {
    return undefined;
  }
  return {
    name: globalEvent.name,
    description: globalEvent.description,
    revealed: globalEvent.revealedDelegate,
    current: globalEvent.currentDelegate,
  };
}

function getParties(game: Game): Array<PartyModel> {
  return Turmoil.ifTurmoilElse(game,
    (turmoil) => {
      return turmoil.parties.map(function(party) {
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
    },
    () => []);
}
