import {expect} from 'chai';
import {Player} from '../src/Player';
import {DEFAULT_GAME_OPTIONS, Game, GameOptions} from '../src/Game';
import * as constants from '../src/common/constants';
import {ISpace} from '../src/boards/ISpace';
import {Phase} from '../src/common/Phase';
import {IParty} from '../src/turmoil/parties/IParty';
import {Turmoil} from '../src/turmoil/Turmoil';
import {LogMessage} from '../src/common/logs/LogMessage';
import {PolicyId} from '../src/common/turmoil/Types';
import {Log} from '../src/common/logs/Log';
import {Greens} from '../src/turmoil/parties/Greens';
import {PoliticalAgendas} from '../src/turmoil/PoliticalAgendas';
import {Reds} from '../src/turmoil/parties/Reds';
import {IProjectCard} from '../src/cards/IProjectCard';
import {CardName} from '../src/common/cards/CardName';
import {CardType} from '../src/common/cards/CardType';

export class TestingUtils {
  public static maxOutOceans(player: Player, toValue: number = 0): Array<ISpace> {
    return maxOutOceans(player, toValue);
  }

  public static addGreenery(player: Player): ISpace {
    return addGreenery(player);
  }

  public static addOcean(player: Player): ISpace {
    return addOcean(player);
  }

  public static addCity(player: Player): ISpace {
    return addCity(player);
  }

  public static resetBoard(game: Game): void {
    resetBoard(game);
  }

  public static setCustomGameOptions(options: Partial<GameOptions> = {}): GameOptions {
    return setCustomGameOptions(options);
  }

  public static setRulingPartyAndRulingPolicy(game: Game, turmoil: Turmoil, party: IParty, policyId: PolicyId) {
    setRulingPartyAndRulingPolicy(game, turmoil, party, policyId);
  }

  public static runAllActions(game: Game) {
    runAllActions(game);
  }

  public static runNextAction(game: Game) {
    runNextAction(game);
  }

  public static executeNextAction(game: Game) {
    return executeNextAction(game);
  }

  public static forceGenerationEnd(game: Game) {
    forceGenerationEnd(game);
  }

  public static formatLogMessage(message: LogMessage): string {
    return formatLogMessage(message);
  }

  public static testRedsCosts(cb: () => boolean, player: Player, initialMegacredits: number, passingDelta: number) {
    testRedsCosts(cb, player, initialMegacredits, passingDelta);
  }

  public static fakeCard(card: Partial<IProjectCard>): IProjectCard {
    return fakeCard(card);
  }

  public static cast<T>(obj: any, klass: new (...args: any[]) => T): T {
    return cast(obj, klass);
  }
}

// Returns the oceans created during this operation which may not reflect all oceans.
export function maxOutOceans(player: Player, toValue: number = 0): Array<ISpace> {
  const oceans = [];
  if (toValue < 1) {
    toValue = constants.MAX_OCEAN_TILES;
  }

  while (player.game.board.getOceanCount() < toValue) {
    oceans.push(addOcean(player));
  }
  return oceans;
}

export function addGreenery(player: Player): ISpace {
  const space = player.game.board.getAvailableSpacesForGreenery(player)[0];
  player.game.addGreenery(player, space.id);
  return space;
}

export function addOcean(player: Player): ISpace {
  const space = player.game.board.getAvailableSpacesForOcean(player)[0];
  player.game.addOceanTile(player, space.id);
  return space;
}

export function addCity(player: Player): ISpace {
  const space = player.game.board.getAvailableSpacesForCity(player)[0];
  player.game.addCityTile(player, space.id);
  return space;
}

export function resetBoard(game: Game): void {
  game.board.spaces.forEach((space) => {
    space.player = undefined;
    space.tile = undefined;
  });
}

export function setCustomGameOptions(options: Partial<GameOptions> = {}): GameOptions {
  const defaultOptions = {
    ...DEFAULT_GAME_OPTIONS,
    venusNextExtension: true,
    turmoilExtension: true,
    showTimers: false,
    includeVenusMA: true,
    aresHazards: false,
  };

  return Object.assign(defaultOptions, options);
}

export function setRulingPartyAndRulingPolicy(game: Game, turmoil: Turmoil, party: IParty, policyId: PolicyId) {
  turmoil.rulingParty = party;
  turmoil.politicalAgendasData.agendas.set(party.name, {bonusId: party.bonuses[0].id, policyId: policyId});
  game.phase = Phase.ACTION;
}

// Just shortcuts to some often called methods
// related to the deferred actions queue
export function runAllActions(game: Game) {
  game.deferredActions.runAll(() => {});
}

export function runNextAction(game: Game) {
  const action = game.deferredActions.pop();
  if (action !== undefined) {
    game.deferredActions.run(action, () => {});
  }
}
// This could be replaced with runNextAction()
export function executeNextAction(game: Game) {
  const action = game.deferredActions.pop();
  if (action === undefined) {
    throw new Error('No action in queue.');
  }
  return action.execute();
}

export function forceGenerationEnd(game: Game) {
  while (game.deferredActions.pop() !== undefined) {}
  game.getPlayersInGenerationOrder().forEach((player) => player.pass());
  game.playerIsFinishedTakingActions();
}

// Provides a readable version of a log message for easier testing.
export function formatLogMessage(message: LogMessage): string {
  return Log.applyData(message, (datum) => datum.value);
}

export function testRedsCosts(cb: () => boolean, player: Player, initialMegacredits: number, passingDelta: number) {
  const turmoil = player.game.turmoil!;
  turmoil.rulingParty = new Greens();
  PoliticalAgendas.setNextAgenda(turmoil, player.game);
  player.megaCredits = initialMegacredits;
  expect(cb(), 'Greens in power').is.true;
  turmoil.rulingParty = new Reds();
  PoliticalAgendas.setNextAgenda(turmoil, player.game);
  player.megaCredits = initialMegacredits + passingDelta - 1;
  expect(cb(), 'Reds in power, not enough money').is.false;
  player.megaCredits = initialMegacredits + passingDelta;
  expect(cb(), 'Reds in power, enough money').is.true;
}

export function fakeCard(card: Partial<IProjectCard>): IProjectCard {
  const template: IProjectCard = {
    name: 'HELLO' as CardName,
    cost: 0,
    tags: [],
    canPlay: () => true,
    play: () => undefined,
    getVictoryPoints: () => 0,
    cardType: CardType.ACTIVE,
    metadata: {
      cardNumber: '1',
    },
    resourceCount: 0,
  };
  return Object.assign(template, card);
}

// type Class<T> = new (...args: any[]) => T;
// export function cast<T>(klass: Class<T>, obj: any): T {
export function cast<T>(obj: any, klass: new (...args: any[]) => T): T {
  if (!(obj instanceof klass)) {
    throw new Error(`Not an instance of ${klass.name}: ${obj.constructor.name}`);
  }
  return obj;
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
