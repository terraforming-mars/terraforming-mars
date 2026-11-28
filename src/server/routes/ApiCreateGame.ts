import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {Cloner} from '../database/Cloner';
import {Game} from '../Game';
import {GameOptions} from '../game/GameOptions';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {NewGameConfig} from '../../common/game/NewGameConfig';
import {safeCast, isGameId, isSpectatorId, isPlayerId} from '../../common/Types';
import {generateRandomId} from '../utils/server-ids';
import {IGame} from '../IGame';
import {Request} from '../Request';
import {Response} from '../Response';
import {QuotaConfig, QuotaHandler} from '../server/QuotaHandler';
import {durationToMilliseconds} from '../utils/durations';
import {readBody} from './readBody';
import {RouteError} from './RouteError';
import {CEO_CARDS_DEALT_PER_PLAYER} from '../../common/constants';
import {hasNegativeEscapeVelocityOption, sanitizeEscapeVelocityOptions} from '../../common/game/escapeVelocity';
import {isObject} from '@/common/utils/utils';
import {StrongRandom} from '@/common/utils/Random';
import {BoardName} from '@/common/boards/BoardName';

function parseQuotaConfig(struct: unknown): QuotaConfig {
  if (!isObject(struct)) {
    throw new Error('quota config is not an object');
  }
  if (!('limit' in struct)) {
    throw new Error('limit is absent');
  }
  if (!('per' in struct)) {
    throw new Error('per is absent');
  }
  const {limit, per} = struct;
  const parsedLimit = Number.parseInt(String(limit));
  if (isNaN(parsedLimit)) {
    throw new Error('limit is invalid');
  }
  if (typeof per !== 'string') {
    throw new Error('per is invalid');
  }
  const perMs = durationToMilliseconds(per);
  if (isNaN(perMs)) {
    throw new Error('per is invalid');
  }
  return {limit: parsedLimit, perMs};
}

// GAME_QUOTA accepts either a single {limit, per} object, or a JSON array of
// them for multiple independent tiers (e.g. a burst limit and a daily limit).
// A request must satisfy every configured tier to succeed.
function getQuotaConfigs(): Array<QuotaConfig> {
  const defaultQuota = {limit: 1, perMs: 1}; // Effectively, no limit.
  const val = process.env.GAME_QUOTA;
  if (val) {
    try {
      const parsed = JSON.parse(val);
      const structs = Array.isArray(parsed) ? parsed : [parsed];
      if (structs.length === 0) {
        throw new Error('GAME_QUOTA array is empty');
      }
      return structs.map(parseQuotaConfig);
    } catch (e) {
      console.warn('While initializing quota:', (e instanceof Error ? e.message : e));
    }
  }
  return [defaultQuota];
}

/**
 * Validates that each custom list can deal every player their starting cards.
 *
 * Throws a bad request `RouteError` naming the minimum size when a list is too small. Matches the checks in
 * CreateGameForm.
 */
function validateCustomLists(config: NewGameConfig): void {
  const playerCount = config.players.length;

  function validateList(list: ReadonlyArray<unknown> | undefined, perPlayerCount: number, type: string): void {
    if (list === undefined) {
      return;
    }
    const required = playerCount * perPlayerCount;
    if (list.length > 0 && list.length < required) {
      throw RouteError.badRequest(`Must select at least ${required} ${type}`);
    }
  }
  validateList(config.customCorporationsList, config.startingCorporations, 'corporations');
  validateList(config.customPreludes, config.startingPreludes, 'preludes');
  validateList(config.customCeos, Math.max(config.startingCeos ?? 0, CEO_CARDS_DEALT_PER_PLAYER), 'CEOs');
}

/** Validates `gameReq`, throwing a bad request `RouteError` describing the first problem found. */
function validate(config: NewGameConfig): void {
  validateCustomLists(config);
  if (config.escapeVelocity !== undefined && hasNegativeEscapeVelocityOption(config.escapeVelocity)) {
    throw RouteError.badRequest('Escape Velocity values cannot be negative.');
  }
  if (config.boards.length === 0) {
    throw RouteError.badRequest('Must select at least one board');
  }
}

/** Creates the players described in `gameReq`, each with a new random id. */
function toPlayers(config: NewGameConfig): Array<Player> {
  return config.players.map((p) => {
    return new Player(
      p.name,
      p.color,
      p.beginner,
      Number(p.handicap), // For some reason handicap is coming up a string.
      safeCast(generateRandomId('p'), isPlayerId),
    );
  });
}

/** Converts `gameReq` into the `GameOptions` for a game played on `boardName`. */
function toGameOptions(config: NewGameConfig, boardName: BoardName): GameOptions {
  return {
    altVenusBoard: config.altVenusBoard,
    aresHazards: true, // Not a runtime option.
    aresExtremeVariant: config.aresExtremeVariant,
    automa: false, // No create-game UI yet.
    bannedCards: config.bannedCards,
    boardName: boardName,
    clonedGamedId: config.clonedGamedId,
    expansions: config.expansions,
    ceosDraftVariant: config.ceosDraftVariant,
    customCeos: config.customCeos,
    customColoniesList: config.customColoniesList,
    customCorporationsList: config.customCorporationsList,
    customMA: config.customMA,
    customPreludes: config.customPreludes,
    draftVariant: config.draftVariant,
    escapeVelocity: config.escapeVelocity === undefined ? undefined : sanitizeEscapeVelocityOptions(config.escapeVelocity),
    fastModeOption: config.fastModeOption,
    includedCards: config.includedCards,
    includeFanMA: config.includeFanMA,
    initialDraftVariant: config.initialDraft,
    modularMA: config.modularMA,
    moonStandardProjectVariant: config.moonStandardProjectVariant,
    moonStandardProjectVariant1: config.moonStandardProjectVariant1,
    politicalAgendasExtension: config.politicalAgendasExtension,
    preludeDraftVariant: config.preludeDraftVariant,
    randomMA: config.randomMA,
    removeNegativeGlobalEventsOption: config.removeNegativeGlobalEventsOption,
    requiresMoonTrackCompletion: config.requiresMoonTrackCompletion,
    requiresVenusTrackCompletion: config.requiresVenusTrackCompletion,
    showVP: config.showVP,
    showTimers: config.showTimers,
    shuffleMapOption: config.shuffleMapOption,
    solarPhaseOption: config.solarPhaseOption,
    soloTR: config.soloTR,
    startingCeos: config.startingCeos,
    startingCorporations: config.startingCorporations,
    startingPreludes: config.startingPreludes,
    twoCorpsVariant: config.twoCorpsVariant,
    undoOption: config.undoOption,
  };
}

async function createGame(config: NewGameConfig): Promise<IGame> {
  const gameId = safeCast(generateRandomId('g'), isGameId);
  const spectatorId = safeCast(generateRandomId('s'), isSpectatorId);
  const players = toPlayers(config);
  const firstPlayerIdx = Math.max(0, config.players.findIndex((p) => p.first));
  const firstPlayerId = players[firstPlayerIdx].id;
  const boardName = config.boards[Math.floor(Math.random() * config.boards.length)];
  const gameOptions = toGameOptions(config, boardName);

  if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
    const serialized = await Database.getInstance().getGameVersion(gameOptions.clonedGamedId, 0);
    return Cloner.clone(gameId, spectatorId, players, firstPlayerId, serialized);
  } else {
    return Game.newInstance(gameId, players, firstPlayerId, spectatorId, gameOptions, StrongRandom.newInstance());
  }
}
export class ApiCreateGame extends Handler {
  public static readonly INSTANCE = new ApiCreateGame();
  private quotaHandlers: Array<QuotaHandler>;

  public constructor(quotaConfigs: Array<QuotaConfig> = getQuotaConfigs()) {
    super();
    this.quotaHandlers = quotaConfigs.map((config) => new QuotaHandler(config));
  }

  public override async post(req: Request, res: Response, ctx: Context): Promise<void> {
    const withinQuota = this.quotaHandlers.every((handler) => handler.isWithinQuota(ctx));
    if (!withinQuota) {
      responses.quotaExceeded(req, res);
      return;
    }

    const body = await readBody(req);
    try {
      const config = JSON.parse(body) as NewGameConfig;
      validate(config);
      const game = await createGame(config);
      ctx.gameLoader.add(game);
      // Only games that are actually created count against the quota.
      this.quotaHandlers.forEach((handler) => handler.record(ctx));
      responses.writeJson(res, ctx, Server.getSimpleGameModel(game));
    } catch (error) {
      if (error instanceof RouteError) {
        throw error;
      }
      responses.internalServerError(req, res, error);
    }
  }
}

