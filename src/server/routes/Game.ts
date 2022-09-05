import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {BoardName} from '../../common/boards/BoardName';
import {RandomBoardOption} from '../../common/boards/RandomBoardOption';
import {Cloner} from '../database/Cloner';
import {GameLoader} from '../database/GameLoader';
import {Game} from '../Game';
import {GameOptions} from '../GameOptions';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {ServeAsset} from './ServeAsset';
import {NewGameConfig} from '../../common/game/NewGameConfig';
import {GameId, PlayerId, SpectatorId} from '../../common/Types';

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

  public static boardOptions(board: RandomBoardOption | BoardName): Array<BoardName> {
    const allBoards = Object.values(BoardName);

    if (board === RandomBoardOption.ALL) return allBoards;
    if (board === RandomBoardOption.OFFICIAL) {
      return allBoards.filter((name) => {
        return name === BoardName.ORIGINAL ||
          name === BoardName.HELLAS ||
          name === BoardName.ELYSIUM;
      });
    }
    return [board];
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }

  // TODO(kberg): much of this code can be moved outside of handler, and that
  // would be better.
  public override put(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', function(data) {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const gameReq: NewGameConfig = JSON.parse(body);
          const gameId = this.generateRandomId('g') as GameId;
          const spectatorId = this.generateRandomId('s') as SpectatorId;
          const players = gameReq.players.map((obj: any) => {
            return new Player(
              obj.name,
              obj.color,
              obj.beginner,
              Number(obj.handicap), // For some reason handicap is coming up a string.
              this.generateRandomId('p') as PlayerId,
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
            removeNegativeGlobalEventsOption: gameReq.removeNegativeGlobalEventsOption,
            includeVenusMA: gameReq.includeVenusMA,

            draftVariant: gameReq.draftVariant,
            corporationsDraft: gameReq.corporationsDraft,
            initialDraftVariant: gameReq.initialDraft,
            startingCorporations: gameReq.startingCorporations,
            shuffleMapOption: gameReq.shuffleMapOption,
            randomMA: gameReq.randomMA,
            soloTR: gameReq.soloTR,
            customCorporationsList: gameReq.customCorporationsList,
            bannedCards: gameReq.bannedCards,
            customColoniesList: gameReq.customColoniesList,
            customPreludes: gameReq.customPreludes,
            requiresVenusTrackCompletion: gameReq.requiresVenusTrackCompletion,
            requiresMoonTrackCompletion: gameReq.requiresMoonTrackCompletion,
            moonStandardProjectVariant: gameReq.moonStandardProjectVariant,
            altVenusBoard: gameReq.altVenusBoard,
            escapeVelocityMode: gameReq.escapeVelocityMode,
            escapeVelocityThreshold: gameReq.escapeVelocityThreshold,
            escapeVelocityPeriod: gameReq.escapeVelocityPeriod,
            escapeVelocityPenalty: gameReq.escapeVelocityPenalty,
          };

          let game: Game;
          if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
            const serialized = await Database.getInstance().loadCloneableGame(gameOptions.clonedGamedId);
            game = Cloner.clone(gameId, players, firstPlayerIdx, serialized);
          } else {
            const seed = Math.random();
            game = Game.newInstance(gameId, players, players[firstPlayerIdx], gameOptions, seed, spectatorId);
          }
          GameLoader.getInstance().add(game);
          ctx.route.writeJson(res, Server.getSimpleGameModel(game));
        } catch (error) {
          ctx.route.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}
