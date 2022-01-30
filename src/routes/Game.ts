import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';
import {BoardName, RandomBoardOption} from '../boards/BoardName';
import {Cloner} from '../database/Cloner';
import {GameLoader} from '../database/GameLoader';
import {Game, GameOptions} from '../Game';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {ServeAsset} from './ServeAsset';

// Oh, this could be called Game, but that would introduce all kinds of issues.

// Calling get() feeds the game to the player (I think, and calling put creates a game.)
// So, that should be fixed, you know.
export class GameHandler extends Handler {
  public static readonly INSTANCE = new GameHandler();
  private constructor() {
    super();
  }

  public generateRandomId(prefix: string): string {
    // 281474976710656 possible values.
    return prefix + Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
  }

  public static boardOptions(board: string) {
    const allBoards = Object.values(BoardName);

    if (board === RandomBoardOption.ALL) return allBoards;
    if (board === RandomBoardOption.OFFICIAL) return allBoards.filter((name) => name !== BoardName.ARABIA_TERRA);
    return [board];
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    req.url = '/assets/index.html';
    ServeAsset.INSTANCE.get(req, res, ctx);
  }

  // TODO(kberg): much of this code can be moved outside of handler, and that
  // would be better.
  public override put(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    let body = '';
    req.on('data', function(data) {
      body += data.toString();
    });
    req.once('end', () => {
      try {
        const gameReq = JSON.parse(body);
        const gameId = this.generateRandomId('g');
        const spectatorId = this.generateRandomId('s');
        const players = gameReq.players.map((obj: any) => {
          return new Player(
            obj.name,
            obj.color,
            obj.beginner,
            Number(obj.handicap), // For some reason handicap is coming up a string.
            this.generateRandomId('p'),
          );
        });
        let firstPlayerIdx: number = 0;
        for (let i = 0; i < gameReq.players.length; i++) {
          if (gameReq.players[i].first === true) {
            firstPlayerIdx = i;
            break;
          }
        }

        const boards = GameHandler.boardOptions(gameReq.board);
        gameReq.board = boards[Math.floor(Math.random() * boards.length)];

        const gameOptions: GameOptions = {
          boardName: gameReq.board,
          clonedGamedId: gameReq.clonedGamedId,

          undoOption: gameReq.undoOption,
          showTimers: gameReq.showTimers,
          fastModeOption: gameReq.fastModeOption,
          showOtherPlayersVP: gameReq.showOtherPlayersVP,

          corporateEra: gameReq.corporateEra,
          venusNextExtension: gameReq.venusNext,
          coloniesExtension: gameReq.colonies,
          preludeExtension: gameReq.prelude,
          turmoilExtension: gameReq.turmoil,
          aresExtension: gameReq.aresExtension,
          aresHazards: true, // Not a runtime option.
          politicalAgendasExtension: gameReq.politicalAgendasExtension,
          moonExpansion: gameReq.moonExpansion,
          pathfindersExpansion: gameReq.pathfindersExpansion,
          promoCardsOption: gameReq.promoCardsOption,
          communityCardsOption: gameReq.communityCardsOption,
          solarPhaseOption: gameReq.solarPhaseOption,
          removeNegativeGlobalEventsOption:
            gameReq.removeNegativeGlobalEventsOption,
          includeVenusMA: gameReq.includeVenusMA,

          draftVariant: gameReq.draftVariant,
          initialDraftVariant: gameReq.initialDraft,
          startingCorporations: gameReq.startingCorporations,
          shuffleMapOption: gameReq.shuffleMapOption,
          randomMA: gameReq.randomMA,
          soloTR: gameReq.soloTR,
          customCorporationsList: gameReq.customCorporationsList,
          cardsBlackList: gameReq.cardsBlackList,
          customColoniesList: gameReq.customColoniesList,
          requiresVenusTrackCompletion: gameReq.requiresVenusTrackCompletion,
          requiresMoonTrackCompletion: gameReq.requiresMoonTrackCompletion,
          moonStandardProjectVariant: gameReq.moonStandardProjectVariant,
          altVenusBoard: gameReq.altVenusBoard,
          escapeVelocityMode: gameReq.escapeVelocityMode,
          escapeVelocityThreshold: gameReq.escapeVelocityThreshold,
          escapeVelocityPeriod: gameReq.escapeVelocityPeriod,
          escapeVelocityPenalty: gameReq.escapeVelocityPenalty,
        };

        if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
          Database.getInstance().loadCloneableGame(gameOptions.clonedGamedId, (err, serialized) => {
            Cloner.clone(gameId, players, firstPlayerIdx, err, serialized, (err, game) => {
              if (err) {
                throw err;
              }
              if (game === undefined) {
                throw new Error(`game ${gameOptions.clonedGamedId} not cloned`); // how to nest errs in the way Java nests exceptions?
              }
              GameLoader.getInstance().add(game);
              ctx.route.writeJson(res, Server.getSimpleGameModel(game));
            });
          });
        } else {
          const seed = Math.random();
          const game = Game.newInstance(gameId, players, players[firstPlayerIdx], gameOptions, seed, spectatorId);
          GameLoader.getInstance().add(game);
          ctx.route.writeJson(res, Server.getSimpleGameModel(game));
        }
      } catch (error) {
        ctx.route.internalServerError(req, res, error);
      }
    });
  }
}
