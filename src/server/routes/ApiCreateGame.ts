import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {BoardName} from '../../common/boards/BoardName';
import {RandomBoardOption} from '../../common/boards/RandomBoardOption';
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

function parseQuotaConfig(struct: any): QuotaConfig {
  let {limit} = struct;
  const {per} = struct;
  if (limit === undefined) {
    throw new Error('limit is absent');
  }
  limit = Number.parseInt(limit);
  if (isNaN(limit)) {
    throw new Error('limit is invalid');
  }
  if (per === undefined) {
    throw new Error('per is absent');
  }
  const perMs = durationToMilliseconds(per);
  if (isNaN(perMs)) {
    throw new Error('per is invalid');
  }
  return {limit, perMs};
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
      console.warn('While initialzing quota:', (e instanceof Error ? e.message : e));
    }
  }
  return [defaultQuota];
}

export class ApiCreateGame extends Handler {
  public static readonly INSTANCE = new ApiCreateGame();
  private quotaHandlers: Array<QuotaHandler>;

  public constructor(quotaConfigs: Array<QuotaConfig> = getQuotaConfigs()) {
    super();
    this.quotaHandlers = quotaConfigs.map((config) => new QuotaHandler(config));
  }

  public static boardOptions(board: RandomBoardOption | BoardName): Array<BoardName> {
    const allBoards = Object.values(BoardName);

    if (board === RandomBoardOption.ALL) {
      return allBoards;
    }
    if (board === RandomBoardOption.OFFICIAL) {
      return allBoards.filter((name) => {
        return name === BoardName.THARSIS ||
          name === BoardName.HELLAS ||
          name === BoardName.ELYSIUM;
      });
    }
    return [board];
  }

  /**
   * Validates that each custom list can deal every player their starting cards.
   *
   * Throws a bad request `RouteError` naming the minimum size when a list is too small. Matches the checks in
   * CreateGameForm.
   */
  public validateCustomLists(gameReq: NewGameConfig): void {
    const playerCount = gameReq.players.length;

    function validate(list: Array<unknown> | undefined, perPlayerCount: number, type: string): void {
      if (list === undefined) {
        return;
      }
      const required = playerCount * perPlayerCount;
      if (list.length > 0 && list.length < required) {
        throw RouteError.badRequest(`Must select at least ${required} ${type}`);
      }
    }
    validate(gameReq.customCorporationsList, gameReq.startingCorporations, 'corporations');
    validate(gameReq.customPreludes, gameReq.startingPreludes, 'preludes');
    validate(gameReq.customCeos, Math.max(gameReq.startingCeos ?? 0, CEO_CARDS_DEALT_PER_PLAYER), 'CEOs');
  }

  // TODO(kberg): much of this code can be moved outside of handler, and that
  // would be better.
  public override async post(req: Request, res: Response, ctx: Context): Promise<void> {
    const withinQuota = this.quotaHandlers.map((handler) => handler.measure(ctx)).every((ok) => ok);
    if (!withinQuota) {
      responses.quotaExceeded(req, res);
      return;
    }

    const body = await readBody(req);
    try {
      const gameReq = JSON.parse(body) as NewGameConfig;
      this.validateCustomLists(gameReq);
      const gameId = safeCast(generateRandomId('g'), isGameId);
      const spectatorId = safeCast(generateRandomId('s'), isSpectatorId);
      const players = gameReq.players.map((p) => {
        return new Player(
          p.name,
          p.color,
          p.beginner,
          Number(p.handicap), // For some reason handicap is coming up a string.
          safeCast(generateRandomId('p'), isPlayerId),
        );
      });
      let firstPlayerIdx = 0;
      for (let i = 0; i < gameReq.players.length; i++) {
        if (gameReq.players[i].first === true) {
          firstPlayerIdx = i;
          break;
        }
      }

      const boards = ApiCreateGame.boardOptions(gameReq.board);
      gameReq.board = boards[Math.floor(Math.random() * boards.length)];

      const gameOptions: GameOptions = {
        altVenusBoard: gameReq.altVenusBoard,
        aresExtension: gameReq.expansions.ares,
        aresHazards: true, // Not a runtime option.
        aresExtremeVariant: gameReq.aresExtremeVariant,
        bannedCards: gameReq.bannedCards,
        boardName: gameReq.board,
        ceoExtension: gameReq.expansions.ceo,
        clonedGamedId: gameReq.clonedGamedId,
        coloniesExtension: gameReq.expansions.colonies,
        communityCardsOption: gameReq.expansions.community,
        expansions: gameReq.expansions,
        ceosDraftVariant: gameReq.ceosDraftVariant,
        corporateEra: gameReq.expansions.corpera,
        customCeos: gameReq.customCeos,
        customColoniesList: gameReq.customColoniesList,
        customCorporationsList: gameReq.customCorporationsList,
        customPreludes: gameReq.customPreludes,
        draftVariant: gameReq.draftVariant,
        escapeVelocity: gameReq.escapeVelocity,
        fastModeOption: gameReq.fastModeOption,
        includedCards: gameReq.includedCards,
        includeFanMA: gameReq.includeFanMA,
        initialDraftVariant: gameReq.initialDraft,
        modularMA: gameReq.modularMA,
        moonExpansion: gameReq.expansions.moon,
        moonStandardProjectVariant: gameReq.moonStandardProjectVariant,
        moonStandardProjectVariant1: gameReq.moonStandardProjectVariant1,
        pathfindersExpansion: gameReq.expansions.pathfinders,
        politicalAgendasExtension: gameReq.politicalAgendasExtension,
        prelude2Expansion: gameReq.expansions.prelude2,
        preludeDraftVariant: gameReq.preludeDraftVariant,
        preludeExtension: gameReq.expansions.prelude,
        promoCardsOption: gameReq.expansions.promo,
        randomMA: gameReq.randomMA,
        removeNegativeGlobalEventsOption: gameReq.removeNegativeGlobalEventsOption,
        requiresMoonTrackCompletion: gameReq.requiresMoonTrackCompletion,
        requiresVenusTrackCompletion: gameReq.requiresVenusTrackCompletion,
        showOtherPlayersVP: gameReq.showOtherPlayersVP,
        showTimers: gameReq.showTimers,
        shuffleMapOption: gameReq.shuffleMapOption,
        solarPhaseOption: gameReq.solarPhaseOption,
        soloTR: gameReq.soloTR,
        startingCeos: gameReq.startingCeos,
        startingCorporations: gameReq.startingCorporations,
        startingPreludes: gameReq.startingPreludes,
        starWarsExpansion: gameReq.expansions.starwars,
        turmoilExtension: gameReq.expansions.turmoil,
        twoCorpsVariant: gameReq.twoCorpsVariant,
        underworldExpansion: gameReq.expansions.underworld,
        deltaProjectExpansion: gameReq.expansions.deltaProject,
        undoOption: gameReq.undoOption,
        venusNextExtension: gameReq.expansions.venus,
      };

      let game: IGame;
      if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
        const serialized = await Database.getInstance().getGameVersion(gameOptions.clonedGamedId, 0);
        game = Cloner.clone(gameId, players, firstPlayerIdx, serialized);
      } else {
        const seed = Math.random();
        game = Game.newInstance(gameId, players, players[firstPlayerIdx], spectatorId, gameOptions, seed);
      }
      ctx.gameLoader.add(game);
      responses.writeJson(res, ctx, Server.getSimpleGameModel(game));
    } catch (error) {
      if (error instanceof RouteError) {
        throw error;
      }
      responses.internalServerError(req, res, error);
    }
  }
}

