import {Player} from '../src/Player';
import {Game, GameOptions} from '../src/Game';
import * as constants from '../src/constants';
import {SpaceType} from '../src/SpaceType';
import {BoardName} from '../src/boards/BoardName';
import {RandomMAOptionType} from '../src/RandomMAOptionType';
import {ISpace} from '../src/boards/ISpace';
import {AgendaStyle} from '../src/turmoil/PoliticalAgendas';
import {Phase} from '../src/Phase';
import {IParty} from '../src/turmoil/parties/IParty';
import {Turmoil} from '../src/turmoil/Turmoil';
import {TurmoilPolicy} from '../src/turmoil/TurmoilPolicy';
import {LogMessage} from '../src/LogMessage';

export class TestingUtils {
  // Returns the oceans created during this operation which may not reflect all oceans.
  public static maxOutOceans(player: Player, toValue: number = 0): Array<ISpace> {
    const oceans = [];
    if (toValue < 1) {
      toValue = constants.MAX_OCEAN_TILES;
    }

    for (const space of player.game.board.getSpaces(SpaceType.OCEAN, player)) {
      if (space.tile !== undefined) continue;
      if (player.game.board.getOceansOnBoard() >= toValue) break;
      player.game.addOceanTile(player, space.id);
      oceans.push(space);
    }
    return oceans;
  };

  public static resetBoard(game: Game): void {
    game.board.spaces.forEach((space) => {
      space.player = undefined;
      space.tile = undefined;
    });
  };

  public static setCustomGameOptions(options: Partial<GameOptions> = {}): GameOptions {
    const defaultOptions = {
      draftVariant: false,
      initialDraftVariant: false,
      corporateEra: true,
      randomMA: RandomMAOptionType.NONE,
      preludeExtension: false,
      venusNextExtension: true,
      coloniesExtension: false,
      turmoilExtension: true,
      boardName: BoardName.ORIGINAL,
      showOtherPlayersVP: false,
      customCorporationsList: [],
      solarPhaseOption: false,
      shuffleMapOption: false,
      promoCardsOption: false,
      communityCardsOption: false,
      undoOption: false,
      showTimers: false,
      startingCorporations: 2,
      includeVenusMA: true,
      soloTR: false,
      clonedGamedId: undefined,
      cardsBlackList: [],
      aresExtension: false,
      aresHazards: false,
      fastModeOption: false,
      removeNegativeGlobalEventsOption: false,
      customColoniesList: [],
      requiresVenusTrackCompletion: false,
      politicalAgendasExtension: AgendaStyle.STANDARD,
      moonExpansion: false,
      requiresMoonTrackCompletion: false,
    };

    return Object.assign(defaultOptions, options);
  };

  public static setRulingPartyAndRulingPolicy(game: Game, turmoil: Turmoil, party: IParty, policyId: TurmoilPolicy) {
    turmoil.rulingParty = party;
    turmoil.politicalAgendasData.agendas.set(party.name, {bonusId: party.bonuses[0].id, policyId: policyId});
    game.phase = Phase.ACTION;
  };

  // Just shortcuts to some often called methods
  // related to the deferred actions queue
  public static runAllActions(game: Game) {
    game.deferredActions.runAll(() => {});
  }

  public static runNextAction(game: Game) {
    const action = game.deferredActions.pop();
    if (action !== undefined) {
      game.deferredActions.run(action, () => {});
    }
  }

  public static executeNextAction(game: Game) {
    const action = game.deferredActions.pop();
    if (action === undefined) {
      throw new Error('No action in queue.');
    }
    return action.execute();
  }

  public static forceGenerationEnd(game: Game) {
    while (game.deferredActions.pop() !== undefined) {};
    game.getPlayers().forEach((player) => player.pass());
    game.playerIsFinishedTakingActions();
  }

  // Provides a readable version of a log message for easier testing.
  public static formatLogMessage(message: LogMessage): string {
    return message.message.replace(/\$\{([0-9]{1})\}/gi, (_match, idx) => {
      return message.data[idx].value;
    });
  }
}
