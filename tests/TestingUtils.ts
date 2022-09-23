import {expect} from 'chai';
import {Player} from '../src/server/Player';
import {Game} from '../src/server/Game';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../src/server/GameOptions';
import * as constants from '../src/common/constants';
import {ISpace} from '../src/server/boards/ISpace';
import {Phase} from '../src/common/Phase';
import {IParty} from '../src/server/turmoil/parties/IParty';
import {Turmoil} from '../src/server/turmoil/Turmoil';
import {LogMessage} from '../src/common/logs/LogMessage';
import {PolicyId} from '../src/common/turmoil/Types';
import {Log} from '../src/common/logs/Log';
import {Greens} from '../src/server/turmoil/parties/Greens';
import {PoliticalAgendas} from '../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../src/server/turmoil/parties/Reds';
import {IProjectCard} from '../src/server/cards/IProjectCard';
import {CardName} from '../src/common/cards/CardName';
import {CardType} from '../src/common/cards/CardType';

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

export function testGameOptions(options: Partial<GameOptions>): GameOptions {
  return {...DEFAULT_GAME_OPTIONS, ...options};
}

// Use gameOptions, which doesn't hide that certain features are on.
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
  if (action === undefined) {
    return undefined;
  }
  return action.execute();
}

export function forceGenerationEnd(game: Game) {
  while (game.deferredActions.pop() !== undefined) {} // eslint-disable-line no-empty
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

const FAKE_CARD_TEMPLATE: IProjectCard = {
  name: 'HELLO' as CardName,
  cost: 0,
  tags: [],
  canPlay: () => true,
  play: () => undefined,
  getVictoryPoints: () => 0,
  cardType: CardType.ACTIVE,
  metadata: {},
  resourceCount: 0,
};
export function fakeCard(card: Partial<IProjectCard>): IProjectCard {
  return {...FAKE_CARD_TEMPLATE, ...card};
}

/*
 * Confirms `obj` is defined and of type `klass`, otherwise it throws an Error.
 */
export function cast<T>(obj: any, klass: new (...args: any[]) => T): T {
  if (!(obj instanceof klass)) {
    throw new Error(`Not an instance of ${klass.name}: ${obj.constructor.name}`);
  }
  return obj;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function finishGeneration(game: Game): void {
  const priorGeneration = game.generation;
  game.getPlayersInGenerationOrder().forEach((player) => {
    game.playerHasPassed(player);
    game.playerIsFinishedTakingActions();
  });
  const currentGeneration = game.generation;
  if (currentGeneration !== priorGeneration + 1) {
    throw new Error('expected new generation');
  }
}
