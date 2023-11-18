import {expect} from 'chai';
import {IGame} from '../src/server/IGame';
import * as constants from '../src/common/constants';
import {Space} from '../src/server/boards/Space';
import {Phase} from '../src/common/Phase';
import {Turmoil} from '../src/server/turmoil/Turmoil';
import {Message} from '../src/common/logs/Message';
import {PolicyId} from '../src/common/turmoil/Types';
import {Log} from '../src/common/logs/Log';
import {Greens} from '../src/server/turmoil/parties/Greens';
import {PoliticalAgendas} from '../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../src/server/turmoil/parties/Reds';
import {CanPlayResponse, IProjectCard} from '../src/server/cards/IProjectCard';
import {CardName} from '../src/common/cards/CardName';
import {CardType} from '../src/common/cards/CardType';
import {SpaceId} from '../src/common/Types';
import {PlayerInput} from '../src/server/PlayerInput';
import {IActionCard} from '../src/server/cards/ICard';
import {TestPlayer} from './TestPlayer';
import {PartyName} from '../src/common/turmoil/PartyName';
import {IPlayer} from '../src/server/IPlayer';
import {CardRequirements} from '../src/server/cards/requirements/CardRequirements';

// Returns the oceans created during this operation which may not reflect all oceans.
export function maxOutOceans(player: IPlayer, toValue: number = 0): Array<Space> {
  const oceans = [];
  if (toValue < 1) {
    toValue = constants.MAX_OCEAN_TILES;
  }

  while (player.game.board.getOceanSpaces().length < toValue) {
    oceans.push(addOcean(player));
  }
  return oceans;
}

export function setTemperature(game: IGame, temperature: number) {
  (game as any).temperature = temperature;
}

export function setOxygenLevel(game: IGame, oxygenLevel: number) {
  (game as any).oxygenLevel = oxygenLevel;
}

export function setVenusScaleLevel(game: IGame, venusScaleLevel: number) {
  (game as any).venusScaleLevel = venusScaleLevel;
}

export function addGreenery(player: IPlayer, spaceId?: SpaceId): Space {
  const space = spaceId ?
    player.game.board.getSpace(spaceId) :
    player.game.board.getAvailableSpacesForGreenery(player)[0];
  player.game.addGreenery(player, space);
  return space;
}

export function addOcean(player: IPlayer, spaceId?: SpaceId): Space {
  const space = spaceId ?
    player.game.board.getSpace(spaceId) :
    player.game.board.getAvailableSpacesForOcean(player)[0];
  player.game.addOcean(player, space);
  return space;
}

export function addCity(player: IPlayer, spaceId?: SpaceId): Space {
  const space = spaceId ?
    player.game.board.getSpace(spaceId) :
    player.game.board.getAvailableSpacesForCity(player)[0];
  player.game.addCity(player, space);
  return space;
}

export function resetBoard(game: IGame): void {
  game.board.spaces.forEach((space) => {
    space.player = undefined;
    space.tile = undefined;
  });
}

export function setRulingParty(game: IGame, partyName: PartyName, policyId?: PolicyId) {
  const turmoil = Turmoil.getTurmoil(game);
  const party = turmoil.getPartyByName(partyName);
  const resolvedPolicyId = policyId ?? party.policies[0].id;

  turmoil.rulingPolicy().onPolicyEnd?.(game);

  turmoil.rulingParty = party;
  turmoil.politicalAgendasData.agendas.set(party.name, {bonusId: party.bonuses[0].id, policyId: resolvedPolicyId});
  turmoil.rulingPolicy().onPolicyStart?.(game);

  game.phase = Phase.ACTION;
}

// Just shortcuts to some often called methods
// related to the deferred actions queue
export function runAllActions(game: IGame) {
  game.deferredActions.runAll(() => {});
}

export function runNextAction(game: IGame) {
  return game.deferredActions.pop()?.execute();
}

// Use churnAction instead.
export function cardAction(card: IActionCard, player: TestPlayer): PlayerInput | undefined {
  const input = card.action(player);
  if (input !== undefined) {
    return input;
  }
  runAllActions(player.game);
  return player.popWaitingFor();
}

export function forceGenerationEnd(game: IGame) {
  while (game.deferredActions.pop() !== undefined) {} // eslint-disable-line no-empty
  game.getPlayersInGenerationOrder().forEach((player) => player.pass());
  game.playerIsFinishedTakingActions();
}

/** Provides a readable version of a log message for easier testing. */
export function formatLogMessage(message: Message): string {
  return Log.applyData(message, (datum) => datum.value);
}

/** Provides a readable version of a message for easier testing. */
export function formatMessage(message: Message | string): string {
  if (typeof message === 'string') {
    return message;
  }
  return Log.applyData(message, (datum) => datum.value);
}

export function testRedsCosts(cb: () => CanPlayResponse, player: IPlayer, initialMegacredits: number, passingDelta: number) {
  const turmoil = Turmoil.getTurmoil(player.game);
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

class FakeCard implements IProjectCard {
  public name = 'Fake Card' as CardName;
  public cost = 0;
  public tags = [];
  public requirements = [];
  public canPlay(player: IPlayer) {
    if (this.requirements.length === 0) {
      return true;
    }
    return CardRequirements.compile(this.requirements).satisfies(player);
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 0;
  }
  public getGlobalParameterRequirementBonus(): number {
    return 0;
  }
  public type = CardType.ACTIVE;
  public metadata = {};
  public resourceCount = 0;
}

export function fakeCard(attrs: Partial<IProjectCard>): IProjectCard {
  const card = new FakeCard();
  Object.assign(card, attrs);
  return card;
}

type ConstructorOf<T> = new (...args: any[]) => T;

/**
 * Confirms `obj` is defined and of type `klass`, otherwise it throws an Error.
 *
 * Accepts `undefined` as class and fails when obj is not undefined.
 */
export function cast<T>(obj: any, klass: ConstructorOf<T>): T;
export function cast<T>(obj: any, klass: undefined): undefined;
export function cast<T>(obj: any, klass: ConstructorOf<T> | undefined): T | undefined {
  if (klass === undefined) {
    if (obj !== undefined) {
      throw new Error(`Expected undefined, got type ${obj.constructor.name}`);
    }
    return undefined;
  }
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

export function finishGeneration(game: IGame): void {
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

export function getSendADelegateOption(player: IPlayer) {
  return player.getActions().options.find(
    (option) => option.title.toString().startsWith('Send a delegate'));
}

/**
 * Simulate the behavior of a playing a project card run through the deferred action queue, returning the
 * next input the player must supply.
 *
 * ../srcsee churn.
 */
export function churnPlay(card: IProjectCard, player: TestPlayer) {
  return churn(() => card.play(player), player);
}

/**
 * Simulate the behavior of a card action run through the deferred action queue, returning the
 * next input the player must supply.
 *
 * ../srcsee churn.
 */
export function churnAction(card: IActionCard, player: TestPlayer) {
  return churn(() => card.action(player), player);
}

/**
 * Simulate the behavior of a block run through the deferred action queue, returning the next input
 * the player must supply.
 *
 * Card actions can return input through deferred actions, and also through the return value.
 * Rather than have to know which is correct, this function supports both cases, returning a
 * PlayerInput if necessary.
 */
export function churn(pi: PlayerInput | (() => PlayerInput | undefined) | undefined, player: TestPlayer): PlayerInput | undefined {
  const result = typeof(pi) === 'function' ? pi() : pi;
  player.defer(result);
  runAllActions(player.game);
  return player.popWaitingFor();
}

/**
 * Get the PlayerInput a player is waiting for. Expect it to be of type `klass` and call `f` with it.
 * Afterwards, call any additional callback.
 */
export function doWait<T>(player: TestPlayer, klass: new (...args: any[]) => T, f: (waitingFor: T) => void) {
  const [waitingFor, cb] = player.popWaitingFor2();
  f(cast(waitingFor, klass));
  cb?.();
}
