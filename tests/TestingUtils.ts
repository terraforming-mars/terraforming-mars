import {Player} from '../src/Player';
import {DEFAULT_GAME_OPTIONS, Game, GameOptions} from '../src/Game';
import * as constants from '../src/constants';
import {ISpace} from '../src/boards/ISpace';
import {Phase} from '../src/Phase';
import {IParty} from '../src/turmoil/parties/IParty';
import {Turmoil} from '../src/turmoil/Turmoil';
import {TurmoilPolicy} from '../src/turmoil/TurmoilPolicy';
import {LogMessage} from '../src/LogMessage';
import {Log} from '../src/Log';
import {PlayerInput} from '../src/PlayerInput';
import {DeferredAction} from '../src/deferredActions/DeferredAction';

export class TestingUtils {
  // Returns the oceans created during this operation which may not reflect all oceans.
  public static maxOutOceans(player: Player, toValue: number = 0): Array<ISpace> {
    const oceans = [];
    if (toValue < 1) {
      toValue = constants.MAX_OCEAN_TILES;
    }

    while (player.game.board.getOceansOnBoard() < toValue) {
      oceans.push(TestingUtils.addOcean(player));
    }
    return oceans;
  };

  public static addGreenery(player: Player): ISpace {
    const space = player.game.board.getAvailableSpacesForGreenery(player)[0];
    player.game.addGreenery(player, space.id);
    return space;
  }

  public static addOcean(player: Player): ISpace {
    const space = player.game.board.getAvailableSpacesForOcean(player)[0];
    player.game.addOceanTile(player, space.id);
    return space;
  }

  public static addCity(player: Player): ISpace {
    const space = player.game.board.getAvailableSpacesForCity(player)[0];
    player.game.addCityTile(player, space.id);
    return space;
  }

  public static resetBoard(game: Game): void {
    game.board.spaces.forEach((space) => {
      space.player = undefined;
      space.tile = undefined;
    });
  };

  public static setCustomGameOptions(options: Partial<GameOptions> = {}): GameOptions {
    const defaultOptions = {
      ...DEFAULT_GAME_OPTIONS,
      venusNextExtension: true,
      turmoilExtension: true,
      showTimers: false,
      includeVenusMA: true,
      aresHazards: false,
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

  public static queueAction(player: Player, action: PlayerInput | undefined) {
    if (action !== undefined) {
      player.game.defer(new DeferredAction(player, () => action));
    }
  }

  public static forceGenerationEnd(game: Game) {
    while (game.deferredActions.pop() !== undefined) {};
    game.getPlayers().forEach((player) => player.pass());
    game.playerIsFinishedTakingActions();
  }

  // Provides a readable version of a log message for easier testing.
  public static formatLogMessage(message: LogMessage): string {
    return Log.applyData(message, (datum) => datum.value);
  }
}
