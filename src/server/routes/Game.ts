import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {BoardName} from '../../common/boards/BoardName';
import {RandomBoardOption} from '../../common/boards/RandomBoardOption';
import {Cloner} from '../database/Cloner';
import {GameLoader} from '../database/GameLoader';
import {Game} from '../Game';
import {GameOptions} from '../game/GameOptions';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {ServeAsset} from './ServeAsset';
import {NewGameConfig} from '../../common/game/NewGameConfig';
import {safeCast, isGameId, isSpectatorId, isPlayerId} from '../../common/Types';
import {generateRandomId} from '../utils/server-ids';
import {IGame} from '../IGame';
import {Request} from '../Request';
import {Response} from '../Response';
import {QuotaConfig, QuotaHandler} from '../server/QuotaHandler';
import {durationToMilliseconds} from '../utils/durations';

function get(): QuotaConfig {
  const defaultQuota = {limit: 1, perMs: 1}; // Effectively, no limit.
  const val = process.env.GAME_QUOTA;
  try {
    if (val !== undefined) {
      const struct = JSON.parse(val);
      let {limit, per} = struct;
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
        throw new Error('perMillis is invalid');
      }
      return {limit, perMs};
    }
    return defaultQuota;
  } catch (e) {
    console.warn('While initialzing quota:', (e instanceof Error ? e.message : e));
    return defaultQuota;
  }
}

// Oh, this could be called Game, but that would introduce all kinds of issues.
// Calling get() feeds the game to the player (I think, and calling put creates a game.)
// So, that should be fixed, you know.
export class GameHandler extends Handler {
  public static readonly INSTANCE = new GameHandler();
  private quotaHandler;

  private constructor(quotaConfig: QuotaConfig = get()) {
    super();
    this.quotaHandler = new QuotaHandler(quotaConfig);
  }

  public static boardOptions(board: RandomBoardOption | BoardName): Array<BoardName> {
    const allBoards = Object.values(BoardName);

    if (board === RandomBoardOption.ALL) return allBoards;
    if (board === RandomBoardOption.OFFICIAL) {
      return allBoards.filter((name) => {
        return name === BoardName.THARSIS ||
          name === BoardName.HELLAS ||
          name === BoardName.ELYSIUM;
      });
    }
    return [board];
  }

  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }

  // TODO(kberg): much of this code can be moved outside of handler, and that
  // would be better.
  public override put(req: Request, res: Response, ctx: Context): Promise<void> {
    return new Promise((resolve) => {
      if (this.quotaHandler.measure(ctx) === false) {
        responses.quotaExceeded(req, res);
        resolve();
        return;
      }

      let body = '';
      req.on('data', function(data) {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const gameReq = JSON.parse(body) as NewGameConfig;
          const gameId = safeCast(generateRandomId('g'), isGameId);
          const spectatorId = safeCast(generateRandomId('s'), isSpectatorId);
          const players = gameReq.players.map((obj: any) => {
            return new Player(
              obj.name,
              obj.color,
              obj.beginner,
              Number(obj.handicap), // For some reason handicap is coming up a string.
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

          const boards = GameHandler.boardOptions(gameReq.board);
          gameReq.board = boards[Math.floor(Math.random() * boards.length)];

          const gameOptions: GameOptions = {
            altVenusBoard: gameReq.altVenusBoard,
            aresExtension: gameReq.aresExtension,
            aresHazards: true, // Not a runtime option.
            bannedCards: gameReq.bannedCards,
            boardName: gameReq.board,
            ceoExtension: gameReq.ceoExtension,
            clonedGamedId: gameReq.clonedGamedId,
            coloniesExtension: gameReq.colonies,
            communityCardsOption: gameReq.communityCardsOption,
            corporateEra: gameReq.corporateEra,
            customCeos: gameReq.customCeos,
            customColoniesList: gameReq.customColoniesList,
            customCorporationsList: gameReq.customCorporationsList,
            customPreludes: gameReq.customPreludes,
            draftVariant: gameReq.draftVariant,
            escapeVelocityBonusSeconds: gameReq.escapeVelocityBonusSeconds,
            escapeVelocityMode: gameReq.escapeVelocityMode,
            escapeVelocityPenalty: gameReq.escapeVelocityPenalty,
            escapeVelocityPeriod: gameReq.escapeVelocityPeriod,
            escapeVelocityThreshold: gameReq.escapeVelocityThreshold,
            fastModeOption: gameReq.fastModeOption,
            includedCards: gameReq.includedCards,
            includeFanMA: gameReq.includeFanMA,
            includeVenusMA: gameReq.includeVenusMA,
            initialDraftVariant: gameReq.initialDraft,
            moonExpansion: gameReq.moonExpansion,
            moonStandardProjectVariant: gameReq.moonStandardProjectVariant,
            moonStandardProjectVariant1: gameReq.moonStandardProjectVariant1,
            pathfindersExpansion: gameReq.pathfindersExpansion,
            politicalAgendasExtension: gameReq.politicalAgendasExtension,
            prelude2Expansion: gameReq.prelude2Expansion,
            preludeDraftVariant: gameReq.preludeDraftVariant,
            preludeExtension: gameReq.prelude,
            promoCardsOption: gameReq.promoCardsOption,
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
            starWarsExpansion: gameReq.starWarsExpansion,
            turmoilExtension: gameReq.turmoil,
            twoCorpsVariant: gameReq.twoCorpsVariant,
            underworldExpansion: gameReq.underworldExpansion,
            undoOption: gameReq.undoOption,
            venusNextExtension: gameReq.venusNext,
          };

          let game: IGame;
          if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
            const serialized = await Database.getInstance().getGameVersion(gameOptions.clonedGamedId, 0);
            game = Cloner.clone(gameId, players, firstPlayerIdx, serialized);
          } else {
            const seed = Math.random();
            game = Game.newInstance(gameId, players, players[firstPlayerIdx], gameOptions, seed, spectatorId);
          }
          GameLoader.getInstance().add(game);
          responses.writeJson(res, Server.getSimpleGameModel(game));
        } catch (error) {
          responses.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}

