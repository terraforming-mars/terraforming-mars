import {Color} from '../../common/Color';
import {PartyName} from '../../common/turmoil/PartyName';
import {IGame} from '../IGame';
import {PoliticalAgendas} from '../turmoil/PoliticalAgendas';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {Turmoil} from '../turmoil/Turmoil';
import {DelegatesModel, GlobalEventModel, PartyModel, PoliticalAgendasModel, TurmoilModel} from '../../common/models/TurmoilModel';

export function getTurmoilModel(game: IGame): TurmoilModel | undefined {
  return Turmoil.ifTurmoilElse(game, (turmoil) => {
    const parties = getParties(game);
    let chairman: Color | undefined;

    if (turmoil.chairman) {
      if (turmoil.chairman === 'NEUTRAL') {
        chairman = Color.NEUTRAL;
      } else {
        chairman = game.getPlayerById(turmoil.chairman).color;
      }
    }
    const dominant = turmoil.dominantParty.name;
    const ruling = turmoil.rulingParty.name;

    const reserve: Array<DelegatesModel> = [];
    const lobby: Array<Color> = [];
    turmoil.delegateReserve.forEachMultiplicity((count, playerId) => {
      const color = playerId === 'NEUTRAL' ? Color.NEUTRAL : game.getPlayerById(playerId).color;
      if (playerId !== 'NEUTRAL') {
        if (!turmoil.usedFreeDelegateAction.has(playerId)) {
          count--;
          lobby.push(color);
        }
      }
      reserve.push({color, number: count});
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
      game.getPlayersInGenerationOrder(),
      (player) => {
        return {
          color: player.color,
          turmoilPolicyActionUsed: player.turmoilPolicyActionUsed,
          politicalAgendasActionUsedCount: player.politicalAgendasActionUsedCount};
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

function getParties(game: IGame): Array<PartyModel> {
  return Turmoil.ifTurmoilElse(game,
    (turmoil) => {
      return turmoil.parties.map(function(party) {
        const delegates: Array<DelegatesModel> = [];
        for (const player of party.delegates.keys()) {
          const number = party.delegates.count(player);
          const color = player === 'NEUTRAL' ? Color.NEUTRAL : game.getPlayerById(player).color;
          delegates.push({color, number});
        }
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
          partyLeader: partyLeader,
          delegates: delegates,
        };
      });
    },
    () => []);
}
